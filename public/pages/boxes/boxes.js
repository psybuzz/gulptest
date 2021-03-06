// Get the width and the height of the screen,
// use them to set up the aspect ratio of the camera 
// and the size of the renderer.
HEIGHT = window.innerHeight;
WIDTH = window.innerWidth;

// Create the scene
scene = new THREE.Scene();

// Add a fog effect to the scene; same color as the
// background color used in the style sheet
// scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);

// Create the camera
aspectRatio = WIDTH / HEIGHT;
fieldOfView = 60;
nearPlane = 1;
farPlane = 10000;
camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
    );

// Set the position of the camera
camera.position.x = 0;
camera.position.z = 128;
// camera.position.y = 100;

// Create the renderer
renderer = new THREE.WebGLRenderer({ 
    // Allow transparency to show the gradient background
    // we defined in the CSS
    alpha: true, 

    // Activate the anti-aliasing; this is less performant,
    // but, as our project is low-poly based, it should be fine :)
    antialias: true 
});

// Define the size of the renderer; in this case,
// it will fill the entire screen
renderer.setSize(WIDTH, HEIGHT);

// Enable shadow rendering
renderer.shadowMapEnabled = true;

// Add the DOM element of the renderer to the 
// container we created in the HTML
$('.container').append(renderer.domElement);

// Listen to the screen: if the user resizes it
// we have to update the camera and the renderer size
// window.addEventListener('resize', handleWindowResize, false);

var geometry = new THREE.BoxGeometry(1,1,1);
var material = new THREE.MeshBasicMaterial({color: 0x585751});
var cube = new THREE.Mesh(geometry, material);
var cube2 = new THREE.Mesh(geometry, material);
var cube3 = new THREE.Mesh(geometry, material);

cube2.position.x = 3;
cube3.position.x = -3;

scene.add(cube);
scene.add(cube2);
scene.add(cube3);

var start = Date.now();
var speed = 8;
function render () {
    var dt = Date.now() - start;
    
    cube.scale.y += Math.pow(2, -dt*0.008)*speed;
    cube2.scale.y += Math.pow(2, -dt*0.005)*speed;
    cube3.scale.y += Math.pow(2, -dt*0.005)*speed;

    // camera.position.y += 0.08*speed/2;
    // camera.rotation.x = (Math.pow(3, -dt*0.01) - 0.5);
    console.log(camera.rotation.x);
    
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}
render();

function jump () {
    start = Date.now();
    camera.rotation.x = 0;
    camera.position.y = 0;
    cube.scale.y = 1;
    cube2.scale.y = 1;
    cube3.scale.y = 1;
}
document.addEventListener("click", jump);
document.addEventListener("keydown", jump);