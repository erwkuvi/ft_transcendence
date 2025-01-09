import * as THREE from 'three';

//My import
import { FIELD_LENGTH, FIELD_WIDTH} from "./playingField.js";

export function initializePlayers(scene) {
	const player1 = createPlayer(scene);
	const computer = createComputer(scene);

	return { player1, computer };
}

function createPlayer(scene) {
	const geometry = new THREE.BoxGeometry(PLAYER_WIDTH, PLAYER_HEIGHT, 1);
	const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
	const player = new THREE.Mesh(geometry, material);
	scene.add(player);
	return player;
}

function createComputer(scene) {
	const geometry = new THREE.BoxGeometry(COMPUTER_WIDTH, COMPUTER_HEIGHT, 1);
	const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
	const computer = new THREE.Mesh(geometry, material);
		
	computer.position.z = -FIELD_LENGTH/2 + 1.5;
	computer.position.y = 1.6;
	computer.position.x = 0;
		
	scene.add(computer);
	return computer;
}

export	const	PLAYER_WIDTH = 4;
export	const	PLAYER_HEIGHT = 1;

export	const	COMPUTER_WIDTH = 4;
export	const	COMPUTER_HEIGHT = 1;


//COMPUTER GOES OUTSIDE OF THE FIELD
export	const	MAX_SCORE_COUNT = 2;
export	const	MAX_SET_COUNT = 2;

export const PLAYER1 = {
	x: 0,
	y: 0,
	paddleDirectionX: 1,
	width: PLAYER_WIDTH,
	height: PLAYER_WIDTH,
	color: 0xff0000,
	score: 0,
	set_count: 0,
	playerFinalScore: 0
}


//Introduce second player
export const PLAYER2 = {
	x: 0,
	y: 0,
	paddleDirectionX: 1,
	width: PLAYER_WIDTH,
	height: PLAYER_WIDTH,
	color: 0xff0000,
	score: 0,
	set_count: 0,
	playerFinalScore: 0
}

// Create the com paddle Object
export const COM = {
	x: 0,
	y: 0,
	width: COMPUTER_WIDTH,
	height: COMPUTER_HEIGHT,
	color: 0x00FF00,
	score: 0,
	set_count: 0,
	playerFinalScore: 0
}


//PLAYER1
const	player1Geometry = new THREE.BoxGeometry(PLAYER_WIDTH, PLAYER_HEIGHT, 1);
const	player1Material = new THREE.MeshStandardMaterial({ color: PLAYER1.color });
export const	player1 = new THREE.Mesh(player1Geometry, player1Material);

player1.castShadow = true;
player1.position.z = FIELD_LENGTH/2 -1.5;
player1.position.y = 1.6;


//COMPUTER 
const	computerGeometry = new THREE.BoxGeometry(PLAYER_WIDTH, PLAYER_HEIGHT, 1);
const	computerMaterial = new THREE.MeshStandardMaterial({ color: COM.color });
export const	computer = new THREE.Mesh(computerGeometry, computerMaterial);

computer.castShadow = true;
computer.position.z = -FIELD_LENGTH/2 + 1.5;
computer.position.y = 1.6;


export function	computerPlay(ball) {
	  // Calculate the difference between the ball's Y position and the paddle's Y position
	  const difference = ball.position.x - computer.position.x;
	
	  // Adjust the paddle's Y position based on the difference, with a smoothing factor
	  computer.position.x += difference * 0.1;

	// Optionally, constrain the computer paddle to stay within the field boundaries
	if (computer.position.y < -FIELD_LENGTH / 2 + COMPUTER_HEIGHT / 2) {
		computer.position.y = -FIELD_LENGTH / 2 + COMPUTER_HEIGHT / 2;
	} else if (computer.position.y > FIELD_LENGTH / 2 - COMPUTER_HEIGHT / 2) {
		computer.position.y = FIELD_LENGTH / 2 - COMPUTER_HEIGHT / 2;
	}
}

export function resetComputer() {
	COM.x = -FIELD_LENGTH/2 + 1.5;
	COM.y = 0;

	computer.position.z = -FIELD_LENGTH/2 + 1.5;
	computer.position.x = 0;
}

//PlayerMove
const keysPressed = {};

document.body.addEventListener("keydown", (e) => {
  keysPressed[e.key] = true;
  //console.log("KeyPressed: ", keysPressed);
  movePlayer();
});

document.body.addEventListener("keyup", (ev) => {
	//Player1
	if (keysPressed['a']) {
		PLAYER1.paddleDirX = 0;
	}
	if (keysPressed['d']) {
		PLAYER1.paddleDirX = 0;
	}

	// //Player2
	// if (keysPressed['l']) {
	// 	PLAYER2.paddleDirX = 0;
	// }
	// if (keysPressed['j']) {
	// 	PLAYER2.paddleDirX = 0;
	// }
	// keysPressed[ev.key] = false;
});


function playerOne() {
	if (keysPressed['a']) {
		if (player1.position.x - PLAYER_WIDTH / 2 >= (-FIELD_WIDTH / 2) + 0.5 ) {
			PLAYER1.paddleDirX = -1;
		} else {
			PLAYER1.paddleDirX = 0;
		}
	}

	if ( keysPressed['d']) {
		if (player1.position.x + PLAYER_WIDTH / 2 <= (FIELD_WIDTH / 2)  - 0.5 ) {
			PLAYER1.paddleDirX = 1;
		} else {
			PLAYER1.paddleDirX = 0;
		}
 	}

	player1.position.x += PLAYER1.paddleDirX * 0.5;
	PLAYER1.x = player1.position.x;
	// player1BBoxHelper.update();         // Update the wireframe position
}

// Mouse move logic
let mouseX = 0;

document.addEventListener('mousemove', (event) => {
  // Get the mouse's x position in normalized device coordinates (-1 to 1)
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;

  // Map mouseX to the playing field width (from -FIELD_WIDTH/2 to FIELD_WIDTH/2)
  player1.position.x = mouseX * (FIELD_WIDTH / 2 - PLAYER_WIDTH / 2);
});

// Optionally, to prevent the player from going out of bounds //No need to export it
export function constrainPlayer() {
  if (player1.position.x < -FIELD_WIDTH / 2 + PLAYER_WIDTH / 2) {
    player1.position.x = -FIELD_WIDTH / 2 + PLAYER_WIDTH / 2;
  } else if (player1.position.x > FIELD_WIDTH / 2 - PLAYER_WIDTH / 2) {
    player1.position.x = FIELD_WIDTH / 2 - PLAYER_WIDTH / 2;
  }
}

function movePlayer() {
	playerOne();
	// playerTwo();
};


export {movePlayer, keysPressed};