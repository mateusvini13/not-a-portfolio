//Creates Scene
var HEIGHT, WIDTH, camFactor = 150
var scene, camera, renderer, then = 0
var cube, ghostScene, geometry, spoopy, materials = []

//Set canvas ratio when rendering
var scaleX, scaleY

//Creates Textures and Materials
var textureLoader = new THREE.TextureLoader();

//Suit
var spoopyTexture = textureLoader.load('../../textures/spoopy/spoopy.png');
spoopyTexture.flipY = false;
spoopyTexture.anisotropy = 4;
var spoopyMaterial = new THREE.MeshPhongMaterial( { map: spoopyTexture } )
materials["Spoopy"] = spoopyMaterial;

//hat
var hatTexture = textureLoader.load('../../textures/spoopy/hat.png');
hatTexture.flipY = false;
hatTexture.anisotropy = 4;
var hatMaterial = new THREE.MeshPhongMaterial( { map: hatTexture } )
materials["Hat"] = hatMaterial;

//Bow
var bowMaterial = new THREE.MeshPhongMaterial( { color: 0xf22e48 } )
materials["Bowtie"] = bowMaterial;

//Create Lights
function createLights() {
  light = new THREE.HemisphereLight(0xffffff, 0xffffff, .5)
  
  shadowLight = new THREE.DirectionalLight(0xffffff, .8)
  shadowLight.position.set(200, 200, 200)
  shadowLight.castShadow = true
 	
  backLight = new THREE.DirectionalLight(0xffffff, .4)
  backLight.position.set(-100, 200, 50)
  backLight.castShadow = true
 	
  scene.add(backLight)
  scene.add(light)
  scene.add(shadowLight)
}

//Resize Window
function onWindowResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.left = -window.innerWidth / camFactor;
  camera.right = window.innerWidth / camFactor;
  camera.top = window.innerHeight / camFactor;
  camera.bottom = -window.innerHeight / camFactor;
  camera.updateProjectionMatrix();
}

//Renders screen
function animate(now) {

  //log FPS
  now *= 0.001  // convert to seconds
  const deltaTime = now - then
  then = now
  console.log((1 / deltaTime).toFixed(1))

	requestAnimationFrame(animate)

  // cube.rotation.x += 0.01
  // cube.rotation.y += 0.01
  spoopy.rotation.y += 0.01
	renderer.render(scene, camera)
}

//Load Ghost
function loadGhost(){
  var loader = new THREE.GLTFLoader()

  loader.load('../../models/spoopy.glb', function ( ghost ) {
    ghostScene = ghost.scene
    ghostScene.traverse((o) => {
      if (o.isMesh) {
        o.material = materials[o.name];
      }
    });

    spoopy = ghostScene.getObjectByName("SpoopyArmature")
    spoopy.scale.set(1, 1, 1)
    scene.add(spoopy)
    // spoopy.position.y = 30;

    animate(0)
  }, undefined, function (error) {
    console.error(error)
  })
}

//Render Cube
function renderCube(){
  geometry = new THREE.IcosahedronGeometry(10, 0)
  material = new THREE.MeshPhongMaterial({color: 0x120315, flatShading: true})

  cube = new THREE.Mesh( geometry, material)
  scene.add(cube)
  animate(0)
}

function init(){
  scene = new THREE.Scene()
  var width = window.innerWidth;
  var height = window.innerHeight;
  
  // camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 0.1, 1000 )
  camera = new THREE.OrthographicCamera( width / -camFactor, width / camFactor, height / camFactor, height / -camFactor, -500, 500 )
  renderer = new THREE.WebGLRenderer({alpha: true, antialias: true })

  renderer.setSize( window.innerWidth, window.innerHeight )
  renderer.setPixelRatio( window.devicePixelRatio )
  renderer.shadowMap.Enabled = true

  container = document.getElementById('world')
  container.appendChild(renderer.domElement)

  window.addEventListener('resize', onWindowResize, false)

  loadGhost()
  //renderCube()

  createLights()
  camera.position.z = 5
}

if (WEBGL.isWebGLAvailable()) {
	init()
} else {
	var warning = WEBGL.getWebGLErrorMessage()
	document.getElementById('world').appendChild(warning)
}