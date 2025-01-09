import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

//My imports
import {FIELD_WIDTH, FIELD_LENGTH } from './playingField.js';
import { animate } from './main.js';

//Setting up rendering ==============================================================================================================================================

//GUI
const gui = new dat.GUI();

//STARTING THREEJS
const scene = new THREE.Scene();

const aspect = .innerWidth / window.innerHeight;

const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
camera.position.set(20, 20, 20);
camera.lookAt(0, 1, 0); // Look at the center of the field

//Adding directional lighting
const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.5);
directionalLight.shadow.mapSize.width = 512; // Size of the shadow map
directionalLight.shadow.mapSize.height = 512;


// Adjust shadow camera to control the width and height of the light's effect
directionalLight.shadow.camera.left = -FIELD_WIDTH / 2; 
directionalLight.shadow.camera.right = FIELD_WIDTH / 2; 
directionalLight.shadow.camera.top = FIELD_LENGTH / 2; 
directionalLight.shadow.camera.bottom = -FIELD_LENGTH / 2; 


scene.add(directionalLight);
directionalLight.position.set(0, 30, 0);
directionalLight.castShadow = true;

//directional light helper
// const directionalLighthelper = new THREE.DirectionalLightHelper( directionalLight, 10 );
// scene.add( directionalLighthelper );

//Ambient light
const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.2);
scene.add(ambientLight);

const spotLight = new THREE.SpotLight( 0xffffff, 800 );
// spotLight.position.set( 0, 50, 0 );
// spotLight.map = new THREE.TextureLoader().load( url );

spotLight.castShadow = true;

spotLight.shadow.mapSize.width = 2048;
spotLight.shadow.mapSize.height = 2048;
spotLight.shadow.camera.near = 10;
spotLight.shadow.camera.far = 20;
spotLight.shadow.camera.fov = 30;


spotLight.position.set(0, 20, 0);  // Positioned above the field
spotLight.target.position.set(0, 0, 0);  // Ensure the light targets the center of the field
scene.add(spotLight.target);


scene.add( spotLight );


// //directional light helper

// const spotLighthelper = new THREE.SpotLightHelper( spotLight, 10 );
// scene.add( spotLighthelper );

// Optional: Helper to visualize the shadow camera frustum
// const shadowCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
// scene.add(shadowCameraHelper);

// const directionalCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
// scene.add(directionalCameraHelper);


camera.position.set(0, 10, 30);

camera.lookAt(0, 0, 0);

//Rendering
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild(renderer.domElement);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Optional: soft shadows

const controls = new OrbitControls(camera, renderer.domElement);

export {scene, renderer, camera};