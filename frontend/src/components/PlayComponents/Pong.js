
import React, { useRef, useState, useContext} from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Edges, RoundedBox } from '@react-three/drei';
import { GameContext } from "../../context/GameContext";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const	FIELD_WIDTH = 26;
const	FIELD_LEN = 32;
const	FIELD_HALF_WIDHT = FIELD_WIDTH / 2;
const	FIELD_HALF_LEN =  FIELD_LEN / 2;
const	PLAYER_SPEED = 0.5;
const	PLAYER_WIDTH = 4;
const	PLAYER_LEN = 1;
const	PLAYER_HALF_WIDTH = PLAYER_WIDTH /2;
const	PLAYER_HALF_LEN = PLAYER_LEN / 2;
let		BALL_SPEED = 0.12;

let 	MAX_SCORE_COUNT = 5;
let		MAX_SET_COUNT = 3;

function Ball({player1Ref, player2Ref, handleScore}) {
	//Reference to the ball mesh
	const meshRef = useRef();

	//Refs to store position and velocity without causing re-renders
	const velocity = useRef([0.1, 0, 0.1]); //Initial velocity [x, y, z]
	const position = useRef([0, 1, 0]); //Initial position

	const hasCollided = useRef(false);

	//Reflection angle and updates velocity :)
	const calculateReflection = (ball, player) => {
		const ballPos = ball.position.x;
		const playerPos = player.position.x;

		let collisionPoint = ballPos - playerPos;

		//Normalize to range [-1, 1]
		collisionPoint = collisionPoint / 2;

		//Calculate the angle of reflection
		const angleRad = (Math.PI / 4) * collisionPoint;

		//Determine direction based on ball position (top or bottom of the field)
		const direction = ball.position.z > 0 ? 1 : -1;

		//Update ball velocity (Z for forward/backward, X for side movement)
		velocity.current[2] = -direction * BALL_SPEED * Math.cos(angleRad); //Forward/backward velocity
		velocity.current[0] = BALL_SPEED * Math.sin(angleRad); //Sideways velocity
		BALL_SPEED += 0.01;
	};



	//Helper function to check collision
	const checkCollision = (playerRef) => {
		if (!playerRef.current) return false;

		const playerPos = playerRef.current.position;

		//Bounding box collision detection
		const ballX = position.current[0];
		const ballZ = position.current[2];

		const ballRadius = 0.7 + 0.1; //Match ball geometry radius + plus I have added a small safety area

		//Check if the ball is within the player's boundaries
		//Axis-Aligned Bounding Box (AABB) Collision Detection
		//Used for the plane of x z 
		return (
			ballX >= playerPos.x - PLAYER_HALF_WIDTH - ballRadius &&
			ballX <= playerPos.x + PLAYER_HALF_WIDTH + ballRadius &&
			ballZ >= playerPos.z - PLAYER_HALF_LEN - ballRadius &&
			ballZ <= playerPos.z + PLAYER_HALF_LEN + ballRadius
		);
	};

	useFrame(() => {
    	if (!meshRef.current) return;

    	//Calculate the new position
    	const [vx, vy, vz] = velocity.current;
    	const [px, py, pz] = position.current;
    	const newPosition = [px + vx, py + vy, pz + vz];

    	const halfWidth = (FIELD_WIDTH - 2 - 0.7) / 2;
    	const halfLength = (FIELD_LEN - 1) / 2;

    	if (newPosition[0] > halfWidth || newPosition[0] < -halfWidth) {
    	  velocity.current[0] = -vx; //Reverses it
    	}
    	if (newPosition[2] > halfLength || newPosition[2] < -halfLength) {
    	  velocity.current[2] = -vz;
    	}

		//GOAL
		if (newPosition[2] > halfLength) {
		
			handleScore(2);
			position.current = [0, 1, 0];
			velocity.current = [0.1, 0, 0.1];
			return;
		} else if (newPosition[2] < -halfLength) {

			handleScore(1);
			position.current = [0, 1, 0];
			velocity.current = [0.1, 0, -0.1];
			return;
		}

		const collidedWithPlayer1 = checkCollision(player1Ref);
		const collidedWithPlayer2 = checkCollision(player2Ref);

		//Player collision detection
		if ((collidedWithPlayer1 || collidedWithPlayer2) && !hasCollided.current) {
			const playerRef = collidedWithPlayer1 ? player1Ref : player2Ref;
			calculateReflection(meshRef.current, playerRef.current); //Reflect the ball
			hasCollided.current = true;
		} else if (!collidedWithPlayer1 && !collidedWithPlayer2) {
			hasCollided.current = false;
		}

		//Update the position
		position.current = newPosition;
			
		//Apply the position to the mesh
		meshRef.current.position.set(...newPosition);
	});

	return (
		<mesh ref={meshRef}>
    		<sphereGeometry args={[0.7, 32, 32]} />
    		<meshStandardMaterial color="orange" />
    	</mesh>
	);
}

const Player = React.forwardRef(({ position, color, controls }, ref, player) => {
	const meshRef = useRef();
  
	const keysPressed = useRef({});
  
	useEffect(() => {
		const handleKeyDown = (e) => {
			keysPressed.current[e.key] = true;
	  	};
  
		const handleKeyUp = (e) => {
			keysPressed.current[e.key] = false;
		};
  
		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);
  
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
	  	};
	}, []);
  
	useFrame(() => {
  
		//Updating the meshRef position
		if (meshRef.current) {
			if (meshRef.current.position.x - 2 > -FIELD_HALF_WIDHT + 1) {
				if (keysPressed.current[controls.left]) meshRef.current.position.x -= PLAYER_SPEED; //Move left
			}
			if(meshRef.current.position.x + 2 < FIELD_HALF_WIDHT - 1) {
				if (keysPressed.current[controls.right]) meshRef.current.position.x += PLAYER_SPEED; //Move right
			}
	  	}

		if (ref) ref.current = meshRef.current;
	});
	return (	
		<mesh ref={meshRef} position={position}>
			<RoundedBox args={[4, 1, 1]} radius={0.2} smoothness={4}>
				<meshStandardMaterial color={color} />
			</RoundedBox>
		</mesh>
	);

});
  


function Field({dimensions, borderColor}) {
	const wallThickness = 0.1;

	return (
		<>

    	{/* Border walls */}
    	{/* Left Wall */}
    	<mesh position={[-dimensions.width / 2 - wallThickness / 2, 0, 0]}>
    	  <boxGeometry args={[wallThickness, dimensions.height, dimensions.length - 4]} />
    	  <meshStandardMaterial color={borderColor} />
    	</mesh>

    	{/* Right Wall */}
    	<mesh position={[dimensions.width / 2 + wallThickness / 2, 0, 0]}>
    	  <boxGeometry args={[wallThickness, dimensions.height, dimensions.length - 4]} />
    	  <meshStandardMaterial color={borderColor} />
    	</mesh>

    	{/* Top Wall */}
    	<mesh position={[0, 0, dimensions.length / 2 + wallThickness / 2]}>
    	  <boxGeometry args={[dimensions.width - 4, dimensions.height, wallThickness]} />
    	  <meshStandardMaterial color={borderColor} />
    	</mesh>

    	{/* Bottom Wall */}
    	<mesh position={[0, 0, -dimensions.length / 2 - wallThickness / 2]}>
    	  <boxGeometry args={[dimensions.width - 4, dimensions.height, wallThickness]} />
    	  <meshStandardMaterial color={borderColor} />
    	</mesh>
		{/* Middle Wall */}
		<mesh position={[0, 0, 0]}>
    		<boxGeometry args={[dimensions.width - 4, dimensions.height, 0.05]} />
    		<meshStandardMaterial color={borderColor} />
    	</mesh>
    	</>
  	);
}

function Pong({className}) {
	// Declare refs inside the Canvas component
	const { opponentsId } = useContext(GameContext);
	const { setIsSubmitting } = useContext(GameContext);
	const { setIsOpponentAuthenticated } = useContext(GameContext); 
	const { setIsReadyToPlay } = useContext(GameContext); 
	// const { personLoggedIn } = useContext(GameContext);
	const player1Ref = useRef();
	const player2Ref = useRef();
	const gameContainerRef = useRef();
	const navigate = useNavigate(); 
	
	

	const [scores, setScores] = useState({
		p1_f_score: 0,
		p2_f_score: 0,
		p1_in_set_score: 0,
		p2_in_set_score: 0,
		p1_won_set_count: 0,
		p2_won_set_count: 0,
	});

	const personsLoggedInId = localStorage.getItem('user_id');

	const postMatchResults = async (winnerId, scores) => {
		const matchData = {
			player1: personsLoggedInId, 
			player2: opponentsId,    
			winner: winnerId,       
			score_player1: scores.p1_f_score,
			score_player2: scores.p2_f_score
		};
	
		try {
			const response = await fetch('http://localhost:8000/user_management/matches/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'JWT ' + localStorage.getItem('access_token') 
				},
				body: JSON.stringify(matchData)
			});
	
			if (!response.ok) {
				const errorData = await response.json();
				console.error("Failed to post match results:", errorData);
			} else {
				console.log("Match results successfully saved.");
			}
		} catch (error) {
			console.error("Error posting match results:", error);
		}
	};
	
	

	  // Function to handle score updates
	const handleScore = (player) => {
		setScores((prev) => {
		  const updatedScores = { ...prev };
		  if (player === 1) {
			updatedScores.p1_f_score++;
			updatedScores.p1_in_set_score++;
			if (updatedScores.p1_in_set_score >= MAX_SCORE_COUNT) {
				updatedScores.p1_in_set_score = 0; // Reset score for next set
				updatedScores.p1_won_set_count++;
				if (updatedScores.p1_won_set_count >= MAX_SET_COUNT) {
					postMatchResults(personsLoggedInId, updatedScores);
				}
			}
		  } else if (player === 2) {
			updatedScores.p2_f_score++;
			updatedScores.p2_in_set_score++;
			if (updatedScores.p2_in_set_score >= MAX_SCORE_COUNT) {
				updatedScores.p2_in_set_score = 0; // Reset score for next set
				updatedScores.p2_won_set_count++;
				if (updatedScores.p2_won_set_count >= MAX_SET_COUNT) {
					postMatchResults(opponentsId, updatedScores);
				}
			}
		  }
		  return updatedScores;
		});
	};

	useEffect(() => {
		if (gameContainerRef.current) {
			gameContainerRef.current.focus();
		}
	}, []);

	const handleClick = (e) => {
		e.preventDefault();
		if (gameContainerRef.current) {
			gameContainerRef.current.focus();
		}
	};

	return (
	<div id="pong-container" 
		ref={gameContainerRef} 
		className={`pong-container ${className}`} 
		tabIndex="0" 
		style={{ outline: 'none', width: '100vw', height: '100vh', marginTop: '50px' }} 
		onClick={handleClick} 
		onMouseDown={(e) => e.preventDefault()} 
		>
		<div style={{ position: 'absolute', top: '5rem', left: '50%', transform: 'translateX(-50%)', color: 'white', fontSize: '24px' }}>
        	Player 1 ({personsLoggedInId}): {scores.p1_in_set_score} Set count: {scores.p1_won_set_count} | Player 2 ({opponentsId}): {scores.p2_in_set_score} Set count: {scores.p2_won_set_count}
      	</div>
		<Canvas style={{width: '100%', height: '100%'}} camera={{ fov: 75, near: 0.1, far: 200, position: [0, 100, 150] }}>
			<axesHelper args={[15]} />
			<OrbitControls
				enableZoom={true}
				enablePan={true}
				maxPolarAngle={Math.PI / 2}
				minDistance={5}
				maxDistance={30}
			/>
			<ambientLight intensity={Math.PI / 2} />
			<spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
			<pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
			<Field dimensions={{width: FIELD_WIDTH - 2, height: 0.1, length: FIELD_LEN - 2}} position={[0, 0, 0]} color="#0E0F22" borderColor="white"/>

			<Ball player1Ref={player1Ref} player2Ref={player2Ref} handleScore={handleScore}/>
			<Player
				position={[0, 1, FIELD_LEN / 2 - 1.5]}
				color="#FFFFFF"
				controls={{ left: 'a', right: 'd' }}
				ref={player1Ref}
			/>
			<Player
				position={[0, 1, -FIELD_LEN / 2 + 1.5]}
				color="#60616D"
				controls={{ left: 'ArrowLeft', right: 'ArrowRight' }}
				ref={player2Ref}
			/>
		</Canvas>
	</div>
	);
  }
  
//   createRoot(document.getElementById('root')).render(<MyCanvas />);
export default Pong;