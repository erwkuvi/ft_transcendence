import * as THREE from 'three';

export const	BALL_RADIUS = 0.8;

// Create the ball Object
export	const BALL = {
	x: 0,
	y: 0,
	radius: BALL_RADIUS,
	speed: 0.02,
	velocityX: 0.1,
	velocityZ: 0.1,
	color: 0x00AABB
}


export function initializeBall(scene) {
	const ballGeometry = new THREE.SphereGeometry(BALL_RADIUS, 20, 20);
	const ballMaterial = new THREE.MeshStandardMaterial({ color: BALL.color });
	const ball = new THREE.Mesh(ballGeometry, ballMaterial);
	
	ball.castShadow = true;
	ball.position.set(0, 1.6, 0);
	
	scene.add(ball);
	return ball;
}

const ballGeometry = new THREE.SphereGeometry(BALL_RADIUS, 20, 20);
const ballMaterial = new THREE.MeshStandardMaterial({ color: BALL.color });
export const ball = new THREE.Mesh(ballGeometry, ballMaterial);
ball.castShadow = true;
ball.position.x = 0;
ball.position.z = 0;
ball.position.y = 1.6;

const ballBoundingSphere = new THREE.Sphere(ball.position, BALL_RADIUS);

export function resetBall(ball) {
	BALL.velocityZ = -0.1;
	BALL.velocityX = 0.1;
	BALL.speed = 0.02;
	
	ball.position.set(0, 1.6, 0);
}
