import React, { useEffect } from "react";
import * as THREE from "three";
import * as FIELD from "./playingField.js";
import { initializePlayers } from "./player.js";
import { initializeBall, BALL, BALL_RADIUS, resetBall } from "./ball.js";
import { animate, startGame } from "./main.js";


const Pong = ({ mode }) => {
	useEffect(() => {
	  // Setup scene
	  const scene = new THREE.Scene();
	  scene.background = new THREE.Color(0x000000);
  
	  // Setup camera with better positioning
	  const camera = new THREE.PerspectiveCamera(
		60, // Field of view
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	  );
	  camera.position.set(0, 20, 30); // Position camera above and behind
	  camera.lookAt(0, 0, 0); // Look at center
  
	  // Setup renderer
	  const renderer = new THREE.WebGLRenderer({ antialias: true });
	  renderer.setSize(window.innerWidth, window.innerHeight);
	  renderer.setPixelRatio(window.devicePixelRatio);
  
	  // Add lights
	  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
	  scene.add(ambientLight);
  
	  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
	  directionalLight.position.set(0, 20, 10);
	  scene.add(directionalLight);
  
	  // Initialize game objects
	  FIELD.constructPlayingField(scene);
	  const gameObjects = {
		player1: initializePlayers(scene).player1,
		computer: initializePlayers(scene).computer,
		ball: initializeBall(scene)
	  };
  
	  // Mount renderer
	  const container = document.getElementById('pong-container');
	  container.appendChild(renderer.domElement);
  
	  // Start game loop
	  startGame(renderer, scene, camera, gameObjects);
  
	  // Handle window resize
	  const handleResize = () => {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	  };
	  window.addEventListener('resize', handleResize);
  
	  // Cleanup
	  return () => {
		window.removeEventListener('resize', handleResize);
		renderer.dispose();
		container.removeChild(renderer.domElement);
	  };
	}, [mode]);
  
	return <div id="pong-container" style={{ width: '100%', height: '100vh' }} />;
  };

// const Pong = ({ mode }) => {
// 	useEffect(() => {
// 		const scene = new THREE.Scene();
// 		const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// 		const renderer = new THREE.WebGLRenderer();
// 		renderer.setSize(window.innerWidth, window.innerHeight);
		
// 		const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.2);
// 		scene.add(ambientLight);
	
// 		FIELD.constructPlayingField(scene);
// 		const { player1, computer } = initializePlayers(scene);
// 		const ball = initializeBall(scene);
	
// 		document.getElementById('pong-container').appendChild(renderer.domElement);
	
// 		const animate = () => {
// 			renderer.render(scene, camera);
// 			renderer.setAnimationLoop(animate);
// 		};
	
// 		animate();
	
// 		return () => {
// 			renderer.dispose();
// 			document.getElementById('pong-container').removeChild(renderer.domElement);
// 		};
// 	}, [mode]);
	
// 	return <div id="pong-container" />;
// };

export default Pong;
