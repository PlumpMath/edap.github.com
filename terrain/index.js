var container, camera, controls, scene, renderer, stats, gui;
var bumpScale;
var camera_z_position = 500;

var terrain;

//if model loaded OK
init();
animate();

function init() {
    camera = new THREE.PerspectiveCamera( 120, window.innerWidth / window.innerHeight, 1, 4000 );
    camera.position.z = camera_z_position;
    controls = new THREE.OrbitControls( camera );
    controls.addEventListener( 'change', render );
    scene = new THREE.Scene();
    bumpScale = 200.0;


    // Create Light
    var light = new THREE.PointLight(0xFFFFFF);
    light.position.set(0, 0, 500);
    scene.add(light);

    renderer = new THREE.WebGLRenderer( { antialias: true, depth:true} );
    renderer.setSize( window.innerWidth, window.innerHeight );

    //container DOM
    container = document.getElementById( 'container' );
    container.appendChild( renderer.domElement );

    window.addEventListener( 'resize', onWindowResize, false );

    var bumpTexture = loadTexture( 'noise.png' );
    var customMaterial = createCustomMaterial( bumpTexture );

    var geometryPlane = new THREE.PlaneBufferGeometry(2000, 2000, 50, 50);
    geometryPlane.rotateX( - Math.PI / 2.5);
    terrain = new THREE.Mesh( geometryPlane, customMaterial );
    scene.add( terrain );

    addGui( customMaterial );
    addStats();
}

function createCustomMaterial( texture ) {
    //var material = new THREE.MeshBasicMaterial({ map : groundTexture})
    var myUniforms = {
        bumpScale: {type: 'f', value: bumpScale},
        bumpTexture: {type: 't', value: texture}
    };

    var customMaterial = new THREE.ShaderMaterial({
        uniforms: myUniforms,
        vertexShader: document.getElementById('vertexShader').textContent,
        fragmentShader: document.getElementById('fragmentShader').textContent,
    });

    return customMaterial;
}

function loadTexture( filename ){
    var loadingManager = new THREE.LoadingManager( function(){
        terrain.visible = true;
    });
    var textureLoader = new THREE.TextureLoader( loadingManager );
    var bumpTexture = textureLoader.load('noise.png');
    bumpTexture.wrapS = bumpTexture.wrapT = THREE.RepeatWrapping;

    return bumpTexture;
}

function addGui(customMaterial){
    gui = new dat.GUI();
    gui.add(customMaterial.uniforms.bumpScale, 'value')
        .name('bumpScale').min(20).max(300).step(1.0);
    gui.close();
}

function addStats(){
    stats = new Stats();
    stats.showPanel( 0 );
    container.appendChild(stats.domElement);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
  render();
}

function animate() {
  requestAnimationFrame( animate );
  //controls.update();
  render();
  stats.update();
}

function render() {
    renderer.render( scene, camera );
}
