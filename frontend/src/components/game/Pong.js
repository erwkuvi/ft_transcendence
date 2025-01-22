// import { createRoot } from 'react-dom/client';
// import React, { useRef, useState, useEffect } from 'react';
// import { Canvas, useFrame } from '@react-three/fiber';
// import { OrbitControls, Edges, RoundedBox } from '@react-three/drei';
// // import './style.css'

// const FIELD_WIDTH = 26;
// const FIELD_LEN = 32;
// const SPEED = 0.5;
// let	BALL_SPEED = 0.12;

// let	P_ONE_F_SCORE = 0;
// let P_TWO_F_SCORE = 0;
// let P_ONE_S_SCORE = 0;
// let P_TWO_S_SCORE = 0;
// let P_ONE_S_COUNT = 0;
// let P_TWO_S_COUNT = 0;

// let MAX_SCORE_COUNT = 5;
// let MAX_SET_COUNT = 3;

// function Ball({player1Ref, player2Ref, handleScore}) {
//   // Reference to the ball mesh
//   const meshRef = useRef();

//   // Refs to store position and velocity without causing re-renders
//   const velocity = useRef([0.1, 0, 0.1]); // Initial velocity [x, y, z]
//   const position = useRef([0, 1, 0]); // Initial position

//   const hasCollided = useRef(false);

//   const FIELD_WIDTH = 26; // Field boundaries
//   const FIELD_LEN = 32;

// // Helper function to calculate collision angle and update velocity
// const calculateReflection = (ball, player) => {
//     const ballPos = ball.position.x;
//     const playerPos = player.position.x;

//     // Compute the collision point
//     let collidePoint = ballPos - playerPos;

//     // Normalize to range [-1, 1]
//     collidePoint = collidePoint / (4 / 2);

//     // Calculate the angle of reflection
//     const angleRad = (Math.PI / 4) * collidePoint;

//     // Determine direction based on ball position (top or bottom of the field)
//     const direction = ball.position.z > 0 ? 1 : -1;

//     // Update ball velocity (Z for forward/backward, X for side movement)
//     velocity.current[2] = -direction * BALL_SPEED * Math.cos(angleRad); // Forward/backward velocity
//     velocity.current[0] = BALL_SPEED * Math.sin(angleRad); // Sideways velocity
// 	BALL_SPEED += 0.01;
//   };



//   // Helper function to check collision
//   const checkCollision = (playerRef) => {
//     if (!playerRef.current) return false;

//     const playerPos = playerRef.current.position;

//     // Bounding box collision detection
//     const ballX = position.current[0];
//     const ballZ = position.current[2];
//    // const playerX = playerPos.x;
//    // const playerZ = playerPos.z;

//     const playerWidth = 4; // Match player geometry width
//     const playerDepth = 1; // Match player geometry depth
//     const ballRadius = 0.7; // Match ball geometry radius

//     // Check if the ball is within the player's boundaries
//     return (
//       ballX > playerPos.x - playerWidth / 2 - ballRadius &&
//       ballX < playerPos.x + playerWidth / 2 + ballRadius &&
//       ballZ > playerPos.z - playerDepth / 2 - ballRadius &&
//       ballZ < playerPos.z + playerDepth / 2 + ballRadius
//     );
//   };

//   // Frame-based animation loop
//   useFrame(() => {
//     if (!meshRef.current) return;

//     // Calculate the new position
//     const [vx, vy, vz] = velocity.current;
//     const [px, py, pz] = position.current;
//     const newPosition = [px + vx, py + vy, pz + vz];

//     // Handle collisions with the field boundaries
//     const halfWidth = (FIELD_WIDTH - 2 - 0.7) / 2;
//     const halfLength = (FIELD_LEN - 1) / 2;

//     if (newPosition[0] > halfWidth || newPosition[0] < -halfWidth) {
//       velocity.current[0] = -vx; // Reverse X velocity
//     }
//     if (newPosition[2] > halfLength || newPosition[2] < -halfLength) {
//       velocity.current[2] = -vz; // Reverse Z velocity
//     }

// 	//If the ball makes a goal
// 	if (newPosition[2] > halfLength) {

// 		handleScore(2);
// 		position.current = [0, 1, 0];
// 		velocity.current = [0.1, 0, 0.1];
// 		return;
// 	}

// 	if (newPosition[2] < -halfLength) {
		
// 		handleScore(1);
// 		position.current = [0, 1, 0];
// 		velocity.current = [0.1, 0, -0.1];
// 		return;
// 	}

// 	// Player collision detection with buffering
// 	const collidedWithPlayer1 = checkCollision(player1Ref);
// 	const collidedWithPlayer2 = checkCollision(player2Ref);

//     // Player collision detection
//     if ((collidedWithPlayer1 || collidedWithPlayer2) && !hasCollided.current) {
// 		const playerRef = collidedWithPlayer1 ? player1Ref : player2Ref;
// 		calculateReflection(meshRef.current, playerRef.current); // Reflect the ball
// 		hasCollided.current = true;
// 	} else if (!collidedWithPlayer1 && !collidedWithPlayer2) {
// 		hasCollided.current = false;
// 	}

//     // Update the position ref
//     position.current = newPosition;

//     // Apply the position to the mesh
//     meshRef.current.position.set(...newPosition);
//   });

//   return (
//     <mesh ref={meshRef}>
//     	<sphereGeometry args={[0.7, 32, 32]} />
//     	<meshStandardMaterial color="orange" />
//     </mesh>
//   );
// }

// const Player = React.forwardRef(({ position, color, controls }, ref, player) => {
// 	const meshRef = useRef();
  
// 	const keysPressed = useRef({});
  
// 	useEffect(() => {
// 	  const handleKeyDown = (e) => {
// 		keysPressed.current[e.key] = true;
// 	  };
  
// 	  const handleKeyUp = (e) => {
// 		keysPressed.current[e.key] = false;
// 	  };
  
// 	  window.addEventListener('keydown', handleKeyDown);
// 	  window.addEventListener('keyup', handleKeyUp);
  
// 	  return () => {
// 		window.removeEventListener('keydown', handleKeyDown);
// 		window.removeEventListener('keyup', handleKeyUp);
// 	  };
// 	}, []);
  
// 	useFrame(() => {
// 	  const moveSpeed = SPEED;
  
// 	  // Directly update the meshRef position
// 	  if (meshRef.current) {
// 		if (meshRef.current.position.x - 2 > -FIELD_WIDTH/2 + 1) {
// 			if (keysPressed.current[controls.left]) meshRef.current.position.x -= moveSpeed; // Move left
// 		}
// 		if(meshRef.current.position.x + 2 < FIELD_WIDTH/2 - 1) {
// 			if (keysPressed.current[controls.right]) meshRef.current.position.x += moveSpeed; // Move right
// 		}
// 	  }
  
// 	  // Ensure ref passed to Ball has the updated position
// 	  if (ref) ref.current = meshRef.current;
// 	});
// 	return (	
// 		<mesh ref={meshRef} position={position}>
// 			<RoundedBox args={[4, 1, 1]} radius={0.2} smoothness={4}>
// 				<meshStandardMaterial color={color} />
// 			</RoundedBox>
// 		</mesh>
// 	);

//   });
  


// function Field({dimensions, position, color, borderColor}) {
//   const meshRef = useRef();
//   const wallThickness = 0.1; // The thickness of the border walls

//   return (
//     <>
//       {/* Field ground */}
//       {/* <mesh ref={meshRef} position={position}>
//         <boxGeometry args={[dimensions.width, dimensions.height, dimensions.length]} />
//         <meshStandardMaterial color={color} />
//       </mesh> */}

//     	{/* Border walls */}
//     	{/* Left Wall */}
//     	<mesh position={[-dimensions.width / 2 - wallThickness / 2, 0, 0]}>
//     	  <boxGeometry args={[wallThickness, dimensions.height, dimensions.length - 4]} />
//     	  <meshStandardMaterial color={borderColor} />
//     	</mesh>

//     	{/* Right Wall */}
//     	<mesh position={[dimensions.width / 2 + wallThickness / 2, 0, 0]}>
//     	  <boxGeometry args={[wallThickness, dimensions.height, dimensions.length - 4]} />
//     	  <meshStandardMaterial color={borderColor} />
//     	</mesh>

//     	{/* Top Wall */}
//     	<mesh position={[0, 0, dimensions.length / 2 + wallThickness / 2]}>
//     	  <boxGeometry args={[dimensions.width - 4, dimensions.height, wallThickness]} />
//     	  <meshStandardMaterial color={borderColor} />
//     	</mesh>

//     	{/* Bottom Wall */}
//     	<mesh position={[0, 0, -dimensions.length / 2 - wallThickness / 2]}>
//     	  <boxGeometry args={[dimensions.width - 4, dimensions.height, wallThickness]} />
//     	  <meshStandardMaterial color={borderColor} />
//     	</mesh>
// 		{/* Middle Wall */}
// 		<mesh position={[0, 0, 0]}>
//     		<boxGeometry args={[dimensions.width - 4, dimensions.height, 0.05]} />
//     		<meshStandardMaterial color={borderColor} />
//     	</mesh>
//     </>
//   );
// }

// function Pong() {
// 	// Declare refs inside the Canvas component
// 	// const [socket, setSocket] = useState(null);
// 	const player1Ref = useRef();
// 	const player2Ref = useRef();

// 	const [scores, setScores] = useState({
// 		p1_f_score: 0,
// 		p2_f_score: 0,
// 		p1_in_set_score: 0,
// 		p2_in_set_score: 0,
// 		p1_won_set_count: 0,
// 		p2_won_set_count: 0,
// 	});

// 	// useEffect(() => {
// 	// 	const gameSocket = new WebSocket('ws://localhost:8000/ws/game-endpoint/');
// 	// 	setSocket(gameSocket);

// 	// 	gameSocket.onmessage = (event) => {
//     //         const message = JSON.parse(event.data);
//     //         console.log('Message from server:', message);
//     //         // setMessages((prevMessages) => [...prevMessages, message]);
//     //     };

// 	// 	return () => {
// 	// 		if (gameSocket.readyState === WebSocket.OPEN){
// 	// 			gameSocket.close();
// 	// 		};
// 	// 	};
// 	// }, []);
	
// 	// useEffect(() => {
// 	// 	if (socket) {
// 	// 	  socket.onmessage = (event) => {
// 	// 		const data = JSON.parse(event.data);
// 	// 		if (data.type === 'game_state') {
// 	// 		  const { game_state } = data;
// 	// 		  setScores({
// 	// 			p1_f_score: game_state.p1_score,
// 	// 			p2_f_score: game_state.p2_score,
// 	// 			p1_in_set_score: game_state.p1_score,
// 	// 			p2_in_set_score: game_state.p2_score,
// 	// 			p1_won_set_count: game_state.p1_wins,
// 	// 			p2_won_set_count: game_state.p2_wins,
// 	// 		  });
// 	// 		} else if (data.type === 'game_over') {
// 	// 		  alert(`Player ${data.winner} wins the game!`);
// 	// 		}
// 	// 	  };
// 	// 	}
// 	//   }, [socket]);
	  

// 	  // Function to handle score updates
// 	const handleScore = (player) => {
// 		setScores((prev) => {
// 		  const updatedScores = { ...prev };
// 		  if (player === 1) {
// 			updatedScores.p1_f_score++;
// 			updatedScores.p1_in_set_score++;
// 			if (updatedScores.p1_in_set_score >= MAX_SCORE_COUNT) {
// 				updatedScores.p1_in_set_score = 0; // Reset score for next set
// 				updatedScores.p1_won_set_count++;
// 				if (updatedScores.p1_won_set_count >= MAX_SET_COUNT) {
// 					alert('Player 1 has won the game!');
// 				}
// 			}
// 		  } else if (player === 2) {
// 			updatedScores.p2_f_score++;
// 			updatedScores.p2_in_set_score++;
// 			if (updatedScores.p2_in_set_score >= MAX_SCORE_COUNT) {
// 				updatedScores.p2_in_set_score = 0; // Reset score for next set
// 				updatedScores.p2_won_set_count++;
// 				if (updatedScores.p2_won_set_count >= MAX_SET_COUNT) {
// 					alert('Player 2 has won the game!');
// 					//Bring another page to stop the game and send the data
// 				}
// 			}
// 		  }
// 		//   if (socket) {
//         //     socket.send(JSON.stringify({ action: 'score', player: player }));
//         // 	}
// 		  return updatedScores;
// 		});
// 	};

// 	return (
// 	<div id="pong-container" style={{ width: '100vw', height: '100vh', marginTop: '50px' }}  >
// 		<div style={{ position: 'absolute', top: '5rem', left: '50%', transform: 'translateX(-50%)', color: 'white', fontSize: '24px' }}>
//         	Player 1: {scores.p1_in_set_score} Set count: {scores.p1_won_set_count} | Player 2: {scores.p2_in_set_score} Set count: {scores.p2_won_set_count}
//       	</div>
// 	  <Canvas style={{width: '100%', height: '100%'}} camera={{ fov: 75, near: 0.1, far: 200, position: [0, 100, 150] }}>
// 		{/* Add your other elements */}
// 		<axesHelper args={[15]} /> {/*axes len 5*/}
// 		<OrbitControls
// 			enableZoom={true}
// 			enablePan={true}
// 			maxPolarAngle={Math.PI / 2} // Restrict vertical rotation (e.g., stop below horizon)
// 			minDistance={5} // Minimum zoom distance
// 			maxDistance={30} // Maximum zoom distance
// 		/>
// 		<ambientLight intensity={Math.PI / 2} />
// 		<spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
// 		<pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
// 		{/* Pass player references as props */}
// 		<Field dimensions={{width: FIELD_WIDTH - 2, height: 0.1, length: FIELD_LEN - 2}} position={[0, 0, 0]} color={0x0E0F22} borderColor="white"/>
// 		{/*LEFT and RIGHT wallls */}
// 		{/* <Field dimensions={{width: 1, height: 0.5, length: FIELD_LEN - 1}} position={[FIELD_WIDTH/2 -0.5, 0.1, 0]} color={0xF0A1} borderColor="white"/>
// 		<Field dimensions={{width: 1, height: 0.5, length: FIELD_LEN - 1}} position={[-FIELD_WIDTH/2 +0.5, 0.1, 0]} color={0xF0A1}/> */}
// 		<Ball player1Ref={player1Ref} player2Ref={player2Ref} handleScore={handleScore}/>
// 		<Player
// 			position={[0, 1, FIELD_LEN / 2 - 1.5]}
// 			color={0xFFFFFF}
// 			controls={{ left: 'a', right: 'd' }}
// 			ref={player1Ref}
// 		/>
// 		<Player
// 			position={[0, 1, -FIELD_LEN / 2 + 1.5]}
// 			color={0x60616D}
// 			controls={{ left: 'ArrowLeft', right: 'ArrowRight' }}
// 			ref={player2Ref}
// 		/>
// 	  </Canvas>
// 	</div>
// 	);
//   }
  
// //   createRoot(document.getElementById('root')).render(<MyCanvas />);
// export default Pong;

import { createRoot } from 'react-dom/client';
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Edges, RoundedBox } from '@react-three/drei';

const FIELD_WIDTH = 26;
const FIELD_LEN = 32;
const SPEED = 0.5;
// let	BALL_SPEED = 0.12;
// let MAX_SCORE_COUNT = 5;
// let MAX_SET_COUNT = 3;

function Ball({player1Ref, player2Ref, socketRef, setScores}) {
  const meshRef = useRef();
  const velocity = useRef([0.1, 0, 0.1]);
  const position = useRef([0, 1, 0]);
  const hasCollided = useRef(false);


  useEffect(() => {
    if (socketRef.current) {
		socketRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'game_state') {
          position.current = data.ball_position;
          velocity.current = data.ball_velocity;
          if (meshRef.current) {
            meshRef.current.position.set(...data.ball_position);
          }
        }
		if (data.scores) {
			setScores(data.scores)
			
		} else if (data.type === 'game_over') {
			alert(`Player ${data.winner} wins the game!`);
		}
      };
    }
  }, [setScores, socketRef]);

  const checkCollision = (playerRef) => {
    if (!playerRef.current) return false;

    const playerPos = playerRef.current.position;
    const ballX = position.current[0];
    const ballZ = position.current[2];
    const playerWidth = 4;
    const playerDepth = 1;
    const ballRadius = 0.7;

    return (
      ballX > playerPos.x - playerWidth / 2 - ballRadius &&
      ballX < playerPos.x + playerWidth / 2 + ballRadius &&
      ballZ > playerPos.z - playerDepth / 2 - ballRadius &&
      ballZ < playerPos.z + playerDepth / 2 + ballRadius
    );
  };

  useFrame(() => {
    if (!meshRef.current || !socketRef.current) return;

    const [vx, vy, vz] = velocity.current;
    const [px, py, pz] = position.current;
    const newPosition = [px + vx, py + vy, pz + vz];

    const collidedWithPlayer1 = checkCollision(player1Ref);
    const collidedWithPlayer2 = checkCollision(player2Ref);

    if ((collidedWithPlayer1 || collidedWithPlayer2) && !hasCollided.current) {
      const playerRef = collidedWithPlayer1 ? player1Ref : player2Ref;
      socketRef.current.send(JSON.stringify({
        action: 'ball_collision',
        player: collidedWithPlayer1 ? 1 : 2,
        ballPosition: {
          x: meshRef.current.position.x,
          y: meshRef.current.position.y,
          z: meshRef.current.position.z
        },
        playerPosition: {
          x: playerRef.current.position.x,
          y: playerRef.current.position.y,
          z: playerRef.current.position.z
        }
      }));
      hasCollided.current = true;
    } else if (!collidedWithPlayer1 && !collidedWithPlayer2) {
      hasCollided.current = false;
    }

    position.current = newPosition;
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
	  const moveSpeed = SPEED;
  
	  // Directly update the meshRef position
	  if (meshRef.current) {
		if (meshRef.current.position.x - 2 > -FIELD_WIDTH/2 + 1) {
			if (keysPressed.current[controls.left]) meshRef.current.position.x -= moveSpeed; // Move left
		}
		if(meshRef.current.position.x + 2 < FIELD_WIDTH/2 - 1) {
			if (keysPressed.current[controls.right]) meshRef.current.position.x += moveSpeed; // Move right
		}
	  }
  
	  // Ensure ref passed to Ball has the updated position
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
  


function Field({dimensions, position, color, borderColor}) {
  const wallThickness = 0.1;

  return (
    <>
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

function Pong() {
  const player1Ref = useRef();
  const player2Ref = useRef();
  const socketRef = useRef(null);
  const [scores, setScores] = useState({
    p1_f_score: 0,
    p2_f_score: 0,
    p1_in_set_score: 0,
    p2_in_set_score: 0,
    p1_won_set_count: 0,
    p2_won_set_count: 0,
  });

  useEffect(() => {
	if (!socketRef.current) {
		const ws = new WebSocket('ws://localhost:8000/ws/game-endpoint/');
		socketRef.current = ws;
		console.log("WebSocket initialized");

		return () => {
            if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                console.log("Cleaning up WebSocket");
                socketRef.current.close();
                socketRef.current = null;
            }
        };
	}
  }, []);

  return (
    <div id="pong-container" style={{ width: '100vw', height: '100vh', marginTop: '50px' }}>
      <div style={{ position: 'absolute', top: '5rem', left: '50%', transform: 'translateX(-50%)', color: 'white', fontSize: '24px' }}>
        Player 1: {scores.p1_in_set_score} Set count: {scores.p1_won_set_count} | 
        Player 2: {scores.p2_in_set_score} Set count: {scores.p2_won_set_count}
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
        <Field 
          dimensions={{width: FIELD_WIDTH - 2, height: 0.1, length: FIELD_LEN - 2}} 
          position={[0, 0, 0]} 
          color={0x0E0F22} 
          borderColor="white"
        />
        <Ball player1Ref={player1Ref} player2Ref={player2Ref} socketRef={socketRef} setScores={setScores}/>
        <Player
          position={[0, 1, FIELD_LEN / 2 - 1.5]}
          color={0xFFFFFF}
          controls={{ left: 'a', right: 'd' }}
          ref={player1Ref}
          socketRef={socketRef}
          playerId={1}
        />
        <Player
          position={[0, 1, -FIELD_LEN / 2 + 1.5]}
          color={0x60616D}
          controls={{ left: 'ArrowLeft', right: 'ArrowRight' }}
          ref={player2Ref}
          socketRef={socketRef}
          playerId={2}
        />
      </Canvas>
    </div>
  );
}

export default Pong;