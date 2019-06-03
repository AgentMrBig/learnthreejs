var USE_WIREFRAME = false;
var cube, controls, scene, camera, renderer1, renderer2, singleRing;
var shaderMat, crateTexture, p2paterial, pmaterial;
var light, ambientLight, hemisphericLight, directionalLight;
var ringGeometry;

var mouse = new THREE.Vector2(), INTERSECTED;
var raycaster = new THREE.Raycaster();

var ringColour = 0xffff00;

var currentCameraLocation;

var materials = [
    p2paterial = new THREE.MeshPhongMaterial({ flatShading: false, blending: THREE.AdditiveBlending, transparent: true, color: ringColour, specular: 0xffffff, shininess: 1, vertexColors: false }),
    pmaterial = new THREE.PointsMaterial({ size: 1, transparent: true, vertexColors: true }),

    // singleRing = new THREE.SceneUtils.createMultiMaterialObject(ringGeometry, materials)
];

var texture = new THREE.TextureLoader().load('../img/textures/MetalBoxTextures/low_default_AlbedoTransparency.png');



init();

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xa0a0a0);
    scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000);

    setupCamera();

    Cube();

    setupRenderer();
    camera.position.z = 10;

    //document.getElementById('app').appendChild(defaultRenderer.domElement);
    // document.getElementById('app').appendChild(cssRenderer.domElement);


    createFloor();
    createLights();
    createControls();
    fetchData();
    // createDomPlane();
    // LightSetup();


    window.addEventListener('mousemove', onMouseMove, { passive: false });

}

function setupRenderer() {
    renderer1 = new THREE.WebGLRenderer({ antialias: 'true' });
    renderer1.setSize(window.innerWidth, window.innerHeight / 2);
    document.body.appendChild(renderer1.domElement);

    renderer2 = new THREE.WebGLRenderer({ antialias: false });
    renderer2.setSize(window.innerWidth, window.innerHeight / 2);
    document.body.appendChild(renderer2.domElement);
}

async function fetchData() {
    const res = await fetch
        ('https://jsonplaceholder.typicode.com/users');
    const data = await res.json();

    console.log(data);
}

function createDomPlane() {
    // create the plane mesh
    var material = new THREE.MeshBasicMaterial({ wireframe: true });
    var geometry = new THREE.PlaneGeometry(50, 50, 50, 50);
    var planeMesh = new THREE.Mesh(geometry, material);
    // add it to the WebGL scene
    scene.add(planeMesh);

    planeMesh.position.y += 5;


    planeMesh.rotation.y -= Math.PI / 2;

    var cssScene = new THREE.Scene()

    // create the dom Element
    var element = document.createElement('img');
    element.src = '../img/textures/MetalBoxTextures/low_default_AlbedoTransparency.png';
    // create the object3d for this element
    var cssObject = new THREE.CSS3DObject(element);
    // we reference the same position and rotation 
    cssObject.position = planeMesh.position;
    cssObject.rotation = planeMesh.rotation;
    // add it to the css scene
    cssScene.add(cssObject);
}

var VertexNoise = `
    precision mediump float;

    varying vec2 position;
    uniform float time;

    float random(float p) {
    return fract(sin(p)*10000.);
    }

    float noise(vec2 p) {
    return random(p.x + p.y*10000.);
    }

    vec2 sw(vec2 p) {return vec2( floor(p.x) , floor(p.y) );}
    vec2 se(vec2 p) {return vec2( ceil(p.x)  , floor(p.y) );}
    vec2 nw(vec2 p) {return vec2( floor(p.x) , ceil(p.y)  );}
    vec2 ne(vec2 p) {return vec2( ceil(p.x)  , ceil(p.y)  );}

    float smoothNoise(vec2 p) {
    vec2 inter = smoothstep(0., 1., fract(p));
    float s = mix(noise(sw(p)), noise(se(p)), inter.x);
    float n = mix(noise(nw(p)), noise(ne(p)), inter.x);
    return mix(s, n, inter.y);
    return noise(nw(p));
    }

    float movingNoise(vec2 p) {
    float total = 0.0;
    total += smoothNoise(p     - time);
    total += smoothNoise(p*2.  + time) / 2.;
    total += smoothNoise(p*4.  - time) / 4.;
    total += smoothNoise(p*8.  + time) / 8.;
    total += smoothNoise(p*16. - time) / 16.;
    total /= 1. + 1./2. + 1./4. + 1./8. + 1./16.;
    return total;
    }

    float nestedNoise(vec2 p) {
    float x = movingNoise(p);
    float y = movingNoise(p + 100.);
    return movingNoise(p + vec2(x, y));
    }

    void main() {
    vec2 p = position * 6.;
    float brightness = nestedNoise(p);
    gl_FragColor.rgb = vec3(brightness);
    gl_FragColor.a = 1.;
    }
`

function setupShader() {
    shaderMat = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: document.getElementById('shader').textContent
    });
}

// setupCamera
//  Setup the camera
//  setup the renderer
//  add event listener for window resizing
// setupCamera should be followed by setupRenderer
function setupCamera() {
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    window.addEventListener('resize', () => {
        defaultRenderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;

        camera.updateProjectMatrix();
    })
}



function createFloor() {
    var geometry = new THREE.PlaneGeometry(100, 100, 100, 100);
    var material = new THREE.MeshPhongMaterial({ color: 0xffffff, wireframe: USE_WIREFRAME });
    var floor = new THREE.Mesh(geometry, material);

    floor.position.y -= 5;


    floor.rotation.x -= Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);
}

function createControls() {
    controls = new THREE.TrackballControls(camera);

    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;

    controls.noZoom = false;
    controls.noPan = false;

    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;

    controls.keys = [65, 83, 68];

    controls.addEventListener('change', render);
}

function LightSetup() {
    hemisphericLight = new THREE.HemisphereLight(0xffffff, 0x444444);
    hemisphericLight.position.set(0, 200, 0);

    scene.add(hemisphericLight);

    directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 200, 100);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.top = 180;
    directionalLight.shadow.camera.bottom = - 100;
    directionalLight.shadow.camera.left = - 120;
    directionalLight.shadow.camera.right = 120;
    scene.add(directionalLight);
}

function createLights() {
    ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    light = new THREE.PointLight(0xffffff, 0.8, 18);
    light.position.set(-3, 6, -3);
    light.castShadow = true;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 25;
    scene.add(light);
}

function Sphere() {
    var geometry = new THREE.SphereGeometry(10, 10);
    var material = new THREE.MeshStandardMaterial({
        color: 0xF3FFE2,
        roughness: 0.5,
        metalness: 1
    })
    var sphere = new THREE.Mesh(geometry, material);
    sphere.position.y += 10;
    sphere.position.x += 10;
    sphere.recieveShadow = true;
    sphere.castShadow = true;
    scene.add(sphere);
    controls.addEventListener('onClick', clickToggle);
}

function clickToggle() {
    console.log('this is a test');
}

function Cube() {
    crateTexture = new THREE.TextureLoader().load('../img/textures/CrateTextures/crate1_diffuse.png')

    var geometry = new THREE.BoxGeometry(10, 10, 10);
    var material = new THREE.MeshPhongMaterial({ color: 0xffffff, map: crateTexture });
    cube = new THREE.Mesh(geometry, materials[0]);


    cube.position.y += 1;
    cube.recieveShadow = true;
    cube.castShadow = true;
    scene.add(cube);
}

// var myRotate = cube.ProtoType.myRotate = function(){
//     cube.rotation.x += 0.01;
//     cube.rotation.y += 0.01;
// }

function onMouseMove(event) {

    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = (event.clientY / window.innerHeight) * 2 + 1;
}


function newElement(id, x, y, z, ry) {
    var div = document.createElement('div');
    div.style.width = '480px';
    div.style.height = '360px';
    div.style.backgroundColor = '#000';
    var iframe = document.createElement('iframe');
    iframe.style.width = '480px';
    iframe.style.height = '360px';
    iframe.style.border = '0px';
    iframe.src = ['https://www.youtube.com/embed/', id, '?rel=0'].join('');
    div.appendChild(iframe);
    var object = new THREE.CSS3DObject(div);
    object.position.set(x, y, z);
    object.rotation.y = ry;
    return object;
}

function createGroup() {
    var group = new THREE.Group();
    group.add(new newElement('SJOz3qjfQXU', 0, 0, 240, 0));
    group.add(new newElement('Y2-xZ-1HE-Q', 240, 0, 0, Math.PI / 2));
    group.add(new newElement('IrydklNpcFI', 0, 0, - 240, Math.PI));
    group.add(new newElement('9ubytEsCaS0', - 240, 0, 0, - Math.PI / 2));
    scene.add(group);
}

function animate() {
    requestAnimationFrame(animate);

    controls.update();
    render();
}
animate();

function render() {


    //update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);
    // calculate objects intersecting the picking ray
    var intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
        if (INTERSECTED != intersects[0].object) {
            if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

            INTERSECTED = intersects[0].object;
            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            INTERSECTED.material.emissive.setHex(0xff0000);

            for (var i = 0; i < intersects.length; i++) {
                intersects[i].object.material.color.set(0xff0000);
                console.log(intersects[i]);
            }
        }
    } else {
        if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
        INTERSECTED = null;
    }

    // for (var i = 0; i < intersects.length; i++) {
    //     intersects[i].object.material.color.set(0xff0000);
    //     console.log(intersects[i]);
    // }
    //defaultRenderer.render(scene, camera);
    renderer1.render(scene, camera);
    renderer2.render(scene, camera);

}

