import './style.css';
import * as THREE from 'three';
import * as FIELD from './playingField.js'
import {player1, movePlayer, constrainPlayer, computerPlay, COMPUTER_HEIGHT, COM, resetComputer, PLAYER1, computer, PLAYER_WIDTH, PLAYER_HEIGHT, PLAYER2, MAX_SCORE_COUNT, MAX_SET_COUNT} from './player.js';
import {ball, BALL, BALL_RADIUS, resetBall} from './ball.js';
console.log('startThreeJsandLights.js loaded');


let RUNNING_GAME = true;


const cube1Geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
const cube1Material = new THREE.MeshBasicMaterial({color: 0xFFFFF});
const cube1 = new THREE.Mesh(cube1Geometry, cube1Material);
// scene.add(cube1);



// // //PLAYER1
// // const	player1Geometry = new THREE.BoxGeometry(4, 10, 1);
// // const	player1Material = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
// // const	player1 = new THREE.Mesh(player1Geometry, player1Material);

// // player1.castShadow = true;
// // player1.position.z = 0;
// // player1.position.y = 0;


// const boxHelper = new THREE.BoxHelper(player1, 0xffff00);
// scene.add(boxHelper);

// scene.add(player1);


function ballBounceSideWall() {
	if (ball.position.x >= (FIELD.FIELD_WIDTH / 2) - BALL_RADIUS) {
		FIELD.outerWallX2.material.color.set(0x2C2F4B);
		BALL.velocityX = BALL.velocityX * -1;
		let count = 3;
		const timer = setInterval(function() {
			count--;
			if (count === 0) {
				clearInterval(timer);
				FIELD.outerWallX2.material.color.set(0x10112);
			}
		}, 300);
	}

	if (ball.position.x <= -(FIELD.FIELD_WIDTH / 2) + BALL_RADIUS) {
		FIELD.outerWallX1.material.color.set(0x2C2F4B);
		BALL.velocityX = BALL.velocityX * -1;
		let count = 3;
		const timer = setInterval(function() {
			count--;
			if (count === 0) {
				clearInterval(timer);
				FIELD.outerWallX1.material.color.set(0x10112);
			}
		}, 300);
	}
}

// Collision Detection ( b = ball , p = player)
// function collision(b,p){
// 	let	ballXmax = b.position.z + BALL_RADIUS;
// 	let	ballXmin = b.position.z - BALL_RADIUS;
// 	let	ballYmax = b.position.x - BALL_RADIUS;
// 	let	ballYmin = b.position.x + BALL_RADIUS;

// 	// console.log("BallFront: " + ballFront + " BallBack: " + ballBack + " BallLeft: " + ballLeft + " BallRight" + ballRight);
// 	let	playerXmax = p.position.z + PLAYER_HEIGHT/2;
// 	let	playerXmin = p.position.z - PLAYER_HEIGHT/2;
// 	let	playerYmax = p.position.x - PLAYER_WIDTH/2;
// 	let	playerYmin = p.position.x  + PLAYER_WIDTH/2;

// 	return playerXmin <= ballXmax && playerXmax >= ballXmin && playerYmin <= ballYmax && playerYmax >= ballYmin;
// }


function collision(b, p) {
    let ballXmax = b.position.x + BALL_RADIUS;
    let ballXmin = b.position.x - BALL_RADIUS;
    let ballZmax = b.position.z + BALL_RADIUS;
    let ballZmin = b.position.z - BALL_RADIUS;

    let playerXmax = p.position.x + PLAYER_WIDTH / 2;
    let playerXmin = p.position.x - PLAYER_WIDTH / 2;
    let playerZmax = p.position.z + PLAYER_HEIGHT / 2;
    let playerZmin = p.position.z - PLAYER_HEIGHT / 2;

    // Check if the ball's bounding box overlaps with the player's bounding box
    return playerXmin <= ballXmax && playerXmax >= ballXmin &&
           playerZmin <= ballZmax && playerZmax >= ballZmin;
}

function increaseScoreIndicator(player) {
	if (1 === player) {
		console.log("PLayer score:  " + PLAYER1.score);
		document.getElementById("player1_score").innerText = PLAYER1.score;
	} else if (2 === player) {
		//IF COmputer
		console.log("Com: score: " + COM.score);
		document.getElementById("player2_score").innerText = COM.score;
		//IF Player2
		//document.getElementById("player2_score").textContent = PLAYER2.score.toString();
	} else {
		console.log("Error: in point counting logic!");
	}
}

function increaseSetIndicator(player) {
	if (1 === player) {
		console.log("PLayer set:  " + PLAYER1.set_count);
		document.getElementById("player1_sets").innerText = PLAYER1.set_count;
		PLAYER1.score = 0;
		COM.score = 0;
		document.getElementById("player2_score").innerText = COM.score;
		document.getElementById("player1_score").innerText = PLAYER1.score;
	} else if (2 === player) {
		//IF COmputer
		console.log("Com: set: " + COM.set_count);
		document.getElementById("player2_sets").innerText = COM.set_count;
		COM.score = 0;
		PLAYER1.score = 0;
		document.getElementById("player2_score").innerText = COM.score;
		document.getElementById("player1_score").innerText = PLAYER1.score;
		//IF Player2
		//document.getElementById("player2_score").textContent = PLAYER2.score.toString();
	} else {
		console.log("Error: in point counting logic!");
	}
}

function delayWallCollorChange() {
	let count = 3;
	const timer = setInterval(function() {
		count--;
		if (count === 0) {
			clearInterval(timer);
			FIELD.outerWallZ1.material.color.set(0x10112);
			FIELD.outerWallZ2.material.color.set(0x10112);
		}
	}, 800);
}

function announceWinnerOfTheGame(player) {
	let	gameEndScreen = document.getElementById('gameEndScreen');
	let	winnerGameTag = document.getElementById('winnerOfTheGameTag');
	let gameEndScreenScore = document.getElementById('gameEndScreenScoreTag');

	gameEndScreenScore.textContent = PLAYER1.playerFinalScore + " : " + COM.playerFinalScore;
	if (1 === player) {
		console.log("Player 1 wins the game:");
		winnerGameTag.textContent = "Winner is Player1";
	} else if (2 === player) {
		console.log("Player 2 wins the game:");
		winnerGameTag.textContent = "Winner is Player2";
	} else {
		console.log("Error: in point logic!");
	}
	gameEndScreen.style.display = "flex";
	RUNNING_GAME = false;
}

export function update(scene, ball, player1, computer) {
	if (RUNNING_GAME === false ) {
		return ;
	}
	//Check if ball goes outside of the field
	if (ball.position.z + BALL_RADIUS > FIELD.FIELD_LENGTH / 2) {
		COM.score++;
		COM.playerFinalScore++;
		FIELD.outerWallZ2.material.color.set(0xFFFFFF);
		delayWallCollorChange();
		//Annouce set win and increase set count
		if (MAX_SCORE_COUNT === COM.score) {
			console.log("Computer wins a set!");
			COM.set_count++;
			increaseSetIndicator(2);
			if (MAX_SET_COUNT === COM.set_count) {
				//Annouce winner of the game
				announceWinnerOfTheGame(2);
				return ;
			}

		} else {
			increaseScoreIndicator(2);
		}
		resetBall();
		resetComputer();
	} else if  (ball.position.z - BALL_RADIUS < -FIELD.FIELD_LENGTH / 2) {
		PLAYER1.score++;
		PLAYER1.playerFinalScore++;
		FIELD.outerWallZ1.material.color.set(0xFF0000);
		delayWallCollorChange();
		//Annouce set win and increase set count
		if (MAX_SCORE_COUNT === COM.score) {
			console.log("Player 1 wins a set!");
			PLAYER1.set_count++;
			increaseSetIndicator(1);
			if (MAX_SET_COUNT === PLAYER1.set_count) {
				//Announce Winner of the game
				announceWinnerOfTheGame(1);
				return ;
			}	
		} else {
			increaseScoreIndicator(1);
		}
		resetBall();
		resetComputer();
	}

	computerPlay(ball);


	//lets fasten the ball
	ball.position.x += BALL.velocityX;
	ball.position.z += BALL.velocityZ;

	//IF ball hits the sideWalls inverse the balls movement
	ballBounceSideWall();

	// Check on which side of the field is the paddle
	let player = (ball.position.z > 0) ? player1 : computer;



	        // If the ball hits a paddle
			if(collision(ball, player)){
				console.log("Hellocollision!!!!");
				// Check where the ball hits the paddle
				let collidePoint = ball.position.x - player.position.x;
				// Normalize the value of collidePoint, to get numbers between -1 and 1.
				collidePoint = collidePoint / (PLAYER_WIDTH/2);
				console.log("Collid Point: " + collidePoint);
				
				// When the ball hits the top of a paddle we want the ball, to take a -45 degrees angle
				// When the ball hits the center of the paddle we want the ball to take a 0 degrees angle
				// When the ball hits the bottom of the paddle we want the ball to take a 45 degrees
				// Math.PI/4 = 45degrees
				let angleRad = (Math.PI/4) * collidePoint;
				
				// Change the X and Z velocity direction
				let direction = (ball.position.z + BALL_RADIUS < 0) ? 1 : -1;
				BALL.velocityZ = direction * BALL.speed * Math.cos(angleRad);		// Check if correct
				BALL.velocityX = BALL.speed * Math.sin(angleRad);					//Check if correct
				
				// Speed up the ball every time a paddle hits it.
				BALL.speed += 0.025;
			}
		if (BALL.speed >= 0.5) {
			BALL.speed = 0.5;
		}
}

export function animate(renderer, scene, camera, gameObjects) {
	if (!RUNNING_GAME) {
	 	renderer.setAnimationLoop(null);
		return;
	}
	
	const { ball, player1, computer } = gameObjects;
	update(scene, ball, player1, computer);
	renderer.render(scene, camera);
}

export function startGame(renderer, scene, camera, gameObjects) {
	RUNNING_GAME = true;
	renderer.setAnimationLoop(() => animate(renderer, scene, camera, gameObjects));
}

export function stopGame() {
	RUNNING_GAME = false;
}

export function initializeResizeHandler(camera, renderer, d) {
	window.addEventListener('resize', function() {
		const aspect = window.innerWidth / window.innerHeight;
		camera.left = -d * aspect;
		camera.right = d * aspect;
		camera.top = d;
		camera.bottom = -d;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	});
}
