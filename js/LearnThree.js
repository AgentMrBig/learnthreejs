var USE_WIREFRAME = false;
var cube, controls, scene, camera, renderer;



var texture = new THREE.TextureLoader().load('../img/textures/MetalBoxTextures/low_default_AlbedoTransparency.png');



init();

function init(){
    scene = new THREE.Scene();

    setupCamera();
    camera.position.z = 30;

    document.getElementById('app').appendChild(renderer.domElement);

    Cube();
    createFloor();
    createLights();
    createControls();

    
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
function setupShader(){
    var shaderMat = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: document.getElementById('shader').textContent
    });
}

// setupCamera
//  Setup the camera
//  setup the renderer
//  add event listener for window resizing

function setupCamera(){
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({antialias: 'true'});
    renderer.setClearColor('#408dbd');
    renderer.setSize(window.innerWidth, window.innerHeight);

    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;

        camera.updateProjectMatrix();
    })
}



function createFloor(){
    var geometry = new THREE.PlaneGeometry(10, 10, 10, 10);
    var material = new THREE.MeshPhongMaterial({ color: 0xffffff, wireframe: USE_WIREFRAME });
    var floor = new THREE.Mesh(geometry, material);
    floor.rotation.x -= Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);
}

function createControls(){
    controls = new THREE.TrackballControls( camera );

    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;

    controls.noZoom = false;
    controls.noPan = false;

    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;

    controls.keys = [ 65, 83, 68 ];

    controls.addEventListener( 'change', render );
}

function createLights(){
    ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    light = new THREE.PointLight(0xffffff, 0.8, 18);
    light.position.set(-3, 6, -3);
    light.castShadow = true;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 25;
    scene.add(light);
}

function Cube() {
    crateTexture = new THREE.TextureLoader().load('../img/textures/CrateTextures/crate1_diffuse.png')

    var geometry = new THREE.BoxGeometry(10, 10, 10);
    var material = new THREE.MeshPhongMaterial({ color: 0xffffff, map: crateTexture });
    cube = new THREE.Mesh(geometry, material);


    cube.position.y += 1;
    cube.recieveShadow = true;
    cube.castShadow = true;
    scene.add(cube);
}

// var myRotate = cube.ProtoType.myRotate = function(){
//     cube.rotation.x += 0.01;
//     cube.rotation.y += 0.01;
// }



function animate() {
    requestAnimationFrame(animate);
    
    controls.update();
    render();
}
animate();

function render(){
    renderer.render(scene, camera);
}