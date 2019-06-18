//Creates Scene
var HEIGHT, WIDTH
var scene, camera, renderer
var cube, ghostScene, geometry, spoopy, materials = []

//Set canvas ratio when rendering
var scaleX, scaleY

//Creates Textures and Materials
var textureLoader = new THREE.TextureLoader();

//Suit
var spoopyTexture = textureLoader.load('../../textures/spoopy/spoopy.png');
spoopyTexture.flipY = false;
spoopyTexture.anisotropy = 8;
var spoopyMaterial = new THREE.MeshPhongMaterial( { map: spoopyTexture } )
materials["Spoopy"] = spoopyMaterial;

//hat
var hatTexture = textureLoader.load('../../textures/spoopy/hat.png');
hatTexture.flipY = false;
hatTexture.anisotropy = 8;
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
  var newWidth = ogWidth/window.innerWidth
  var newHeigth = ogHeight/window.innerHeight
  spoopy.scale.set(newWidth, newHeigth, newWidth)

  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

//Renders screen
function animate() {
	requestAnimationFrame( animate )

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
    console.log(spoopy)

    ogWidth = window.innerWidth * 75
    ogHeight = window.innerHeight * 75

    spoopy.scale.set(75, 75, 75)
    scene.add(spoopy)
    spoopy.position.y = 60;

    animate()
  }, undefined, function (error) {
    console.error(error)
  })
}

function init(){
  scene = new THREE.Scene()
  var width = window.innerWidth;
  var height = window.innerHeight;
  
  // camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 0.1, 1000 )
  camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / -2, -500, 500 )
  renderer = new THREE.WebGLRenderer({alpha: true, antialias: true })

  renderer.setSize( window.innerWidth, window.innerHeight )
  renderer.setPixelRatio( window.devicePixelRatio )
  renderer.shadowMap.Enabled = true

  container = document.getElementById('world')
  container.appendChild(renderer.domElement)

  window.addEventListener('resize', onWindowResize, false)

  loadGhost()
  createLights()
  camera.position.z = 5
}

if (WEBGL.isWebGLAvailable()) {
	init()
} else {
	var warning = WEBGL.getWebGLErrorMessage()
	document.getElementById('world').appendChild(warning)
}