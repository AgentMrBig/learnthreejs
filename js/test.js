// Setting base dom styling from DomStyling.js
DomStyle();




var camera, scene, renderer;
var controls;
var objects = [];
var targets = { table: [], sphere: [], helix: [], grid: [] };

var panelHome;



init();
animate();

document.body.addEventListener('onmouseenter', test)

function test(e) {
    console.log(e.target);
}

function init() {

    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 50;
    scene = new THREE.Scene();
    //scene.background = new THREE.Color(0x000000); // UPDATED

    createRenderer();

    //console.log(apiData);

    createPanel(0, 0, 0);
    //createPanels(localApiData);
    //createGrid(6, 7, 100);
    setupControls();
    //transform(targets.grid, 2000);
    //
    window.addEventListener('resize', onWindowResize, false);
}

function createRenderer() {
    //
    renderer = new THREE.CSS3DRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.background = new THREE.Color(0x000000); // UPDATED
    document.getElementById('container').appendChild(renderer.domElement);
    //
}

function createPanels(data) {
    var prevX;
    var tempX = 0;
    data.forEach((item, index, array) => {
        console.log('found one')
        createPanel(tempX, 0, 0)
        prevX = tempX;
        tempX + 30;
    })
}

// x, y, z of css3dobject
function createPanel(x, y, z) {

    var myApiData = localApiData;

    var element = document.createElement('div');

    // elementStyle is defined in DomStyling.js
    element.style.cssText = cardStyle;
    element.style.backgroundColor = 'rgba(0,127,127,' + (Math.random() * 0.5 + 0.25) + ')';

    var number = document.createElement('div');
    number.style.cssText = numberStyle;
    number.textContent = 'Forex Data';
    element.appendChild(number);

    var curExchange = document.createElement('div');
    curExchange.style.cssText = curExchangeStyle;
    if (exchangeRate) {
        curExchange.textContent = exchangeRate;
        //console.log(exchangeRate);
        element.appendChild(curExchange);
    } else if (!exchangeRate) {
        setTimeout(function() {
            curExchange.textContent = exchangeRate;
            //console.log(exchangeRate);
            element.appendChild(curExchange);
        }, 500);
    }


    var object = new THREE.CSS3DObject(element);
    object.position.x = 0 //Math.random() * 4000 - 2000;
    object.position.y = 0 //Math.random() * 4000 - 2000;
    object.position.z = 0 //Math.random() * 4000 - 2000;
    scene.add(object);
    objects.push(object);

    var vector = new THREE.Vector3();

    object.position.x = x;
    object.position.y = y;
    object.position.z = z;
    targets.table.push(object);




}

function createTable() {
    // table
    for (var i = 0; i < table.length; i += 5) {
        var element = document.createElement('div');

        // elementStyle is defined in DomStyling.js
        element.style.cssText = cardStyle;
        element.style.backgroundColor = 'rgba(0,127,127,' + (Math.random() * 0.5 + 0.25) + ')';

        var number = document.createElement('div');
        number.className = 'number';
        // numberStyle is defined in DomStyling.js
        number.style.cssText = numberStyle;
        number.textContent = ((i / 5) + 1).toString();
        element.appendChild(number);

        var symbol = document.createElement('div');
        //symbol.className = 'symbol';
        // symbolStyle is defined in DomStyling.js
        symbol.style.cssText = symbolStyle
        symbol.textContent = table[i].toString();
        element.appendChild(symbol);

        var details = document.createElement('div');
        //details.className = 'details';
        // detailsStyle is defined in DomStyling.js
        // details.style.cssText = detailsStyle;
        details.innerHTML = table[i + 1] + '<br>' + table[i + 2];
        element.appendChild(details);

        var object = new THREE.CSS3DObject(element);
        object.position.x = Math.random() * 4000 - 2000;
        object.position.y = Math.random() * 4000 - 2000;
        object.position.z = Math.random() * 4000 - 2000;
        scene.add(object);
        objects.push(object);
        //
        var object = new THREE.Object3D();
        object.position.x = (parseInt(table[i + 2].toString()) * 140) - 1330;
        object.position.y = -(parseInt(table[i + 4].toString()) * 180) + 990;
        targets.table.push(object);
    }
}

function createSphere() {
    // sphere
    var vector = new THREE.Vector3();
    for (var i = 0, l = objects.length; i < l; i++) {
        var phi = Math.acos(-1 + (2 * i) / l);
        var theta = Math.sqrt(l * Math.PI) * phi;
        var object = new THREE.Object3D();
        object.position.setFromSphericalCoords(800, phi, theta);
        vector.copy(object.position).multiplyScalar(2);
        object.lookAt(vector);
        targets.sphere.push(object);
    }
}

function createHelix() {
    // helix
    var vector = new THREE.Vector3();
    for (var i = 0, l = objects.length; i < l; i++) {
        var theta = i * 0.175 + Math.PI;
        var y = -(i * 8) + 450;
        var object = new THREE.Object3D();
        object.position.setFromCylindricalCoords(900, theta, y);
        vector.x = object.position.x * 2;
        vector.y = object.position.y;
        vector.z = object.position.z * 2;
        object.lookAt(vector);
        targets.helix.push(object);
    }
}

// createGrid(number of x columns, number of rows, z layers(experament) )
// function to take in a collection of data, mapping each data item into 
// a Object3D, then position that object, then on to next data point.
function createGrid(xCols, yRows, zMod) {
    // grid
    for (var i = 0; i < objects.length; i++) {
        var object = new THREE.Object3D();
        object.position.x = ((i % xCols) * 300) - 800;
        object.position.y = (-(Math.floor(i / 5) % yRows) * 400) + 800;
        object.position.z = (Math.floor(i / zMod)) * 500 - 2000;
        object.id = Math.random() * 300;
        targets.grid.push(object);
    }
}

function setupControls() {
    // Controls
    controls = new THREE.TrackballControls(camera, renderer.domElement);
    controls.minDistance = 800;
    controls.maxDistance = 6000;
    controls.addEventListener('change', render);
    // var button = document.getElementById('table');
    // button.addEventListener('click', function () {
    //     transform(targets.table, 2000);
    // }, false);
    // var button = document.getElementById('sphere');
    // button.addEventListener('click', function () {
    //     transform(targets.sphere, 2000);
    // }, false);
    // var button = document.getElementById('helix');
    // button.addEventListener('click', function () {
    //     transform(targets.helix, 2000);
    // }, false);
    // var button = document.getElementById('grid');
    // button.addEventListener('click', function () {
    //     transform(targets.grid, 2000);
    // }, false);
}

function transform(targets, duration) {
    TWEEN.removeAll();
    for (var i = 0; i < objects.length; i++) {
        var object = objects[i];
        var target = targets[i];
        new TWEEN.Tween(object.position)
            .to({ x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();
        new TWEEN.Tween(object.rotation)
            .to({ x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();
    }
    new TWEEN.Tween(this)
        .to({}, duration * 2)
        .onUpdate(render)
        .start();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}

function animate() {
    requestAnimationFrame(animate);
    TWEEN.update();
    controls.update();
}

function render() {
    renderer.render(scene, camera);
}

function FxPlay(timeFocus, pair) {
    var timeFocus;
    var pair;
    var exRate;
    var playStrategy;
    var riskPercent;
}