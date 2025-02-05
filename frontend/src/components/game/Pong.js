import { createRoot } from 'react-dom/client';
import axiosInstance from '../../services/axiosInstance';
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Edges, RoundedBox } from '@react-three/drei';

const FIELD_WIDTH = 26;
const FIELD_LEN = 32;
const SPEED = 0.5;

function Ball({player1Ref, player2Ref, socketRef, setScores, setGameOver}) {
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
			// alert(`Player ${data.winner} wins the game!`);
			console.log(`Player ${data.winner} wins the game!`);
			setGameOver(data.winner);
			return;
		} else if (data.type === 'player_disconnected') {
			alert(`Player ${data.player} has disconnected. Game ended.`);
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

const Player = React.forwardRef(({ position, color, socketRef, playerId }, ref) => {
	const meshRef = useRef();
  
	const keysPressed = useRef({});
  
	useEffect(() => {
		const handleKeyDown = (e) => {
		  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
			keysPressed.current[e.key] = true;
		  }
		};
	
		const handleKeyUp = (e) => {
		  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
			keysPressed.current[e.key] = false;
		  }
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
	
		if (meshRef.current) {
		  let newX = meshRef.current.position.x;
		  
		  if (meshRef.current.position.x - 2 > -FIELD_WIDTH/2 + 1) {
			if (keysPressed.current['ArrowLeft']) newX -= moveSpeed;
		  }
		  if(meshRef.current.position.x + 2 < FIELD_WIDTH/2 - 1) {
			if (keysPressed.current['ArrowRight']) newX += moveSpeed;
		  }
	
		  meshRef.current.position.x = newX;
	
		  if (socketRef.current) {
			socketRef.current.send(JSON.stringify({
			  action: 'update_player_position',
			  player: playerId,
			  position: [newX, meshRef.current.position.y, meshRef.current.position.z]
			}));
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

function Pong( { socketRef }) {
  const player1Ref = useRef();
  const player2Ref = useRef();
  const [gameOver, setGameOver] = useState(null);
  const [playerInfo, setPlayerInfo] = useState(null);
  const [playerNumber, setPlayerNumber] = useState(null);
  const [opponentInfo, setOpponentInfo] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [scores, setScores] = useState({
    p1_f_score: 0,
    p2_f_score: 0,
    p1_in_set_score: 0,
    p2_in_set_score: 0,
    p1_won_set_count: 0,
    p2_won_set_count: 0,
  });

  useEffect(() => {
    const fetchPlayerInfo = async () => {
      try {
		const response = await axiosInstance.get('/user_management/players/me/');
        setPlayerInfo(response.data);

        if (socketRef.current) {
          socketRef.current.send(
            JSON.stringify({
              action: "player_info",
              user_id: response.data.user_id,
              display_name: response.data.display_name
            })
          );
        }
      } catch (error) {
        console.error("Error fetching player info:", error);
      }
    };

    if (!playerInfo) {
      fetchPlayerInfo();
    }

    if (!socketRef.current) {
      const ws = new WebSocket('ws://localhost:8000/ws/game/');
      socketRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket connected");
        ws.send(JSON.stringify({ join: true }));
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("Received message:", data);

        switch (data.type) {
          case 'player_assignment':
            console.log("Assigned player number:", data.player_number);
            setPlayerNumber(data.player_number);
            break;

          case 'game_start':
            console.log("Game starting!");
            setGameStarted(true);
            break;

          case 'player_disconnected':
            alert('Opponent disconnected. Game ended.');
            setGameStarted(false);
            break;

          case 'game_state':
            if (data.scores) {
              setScores(prevScores => ({
                ...prevScores,
                ...data.scores
              }));
            }
            break;

          case 'game_over':
            setGameOver(data.winner);
            break;

          default:
            break;
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      return () => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
          console.log("Cleaning up WebSocket");
          socketRef.current.close();
          socketRef.current = null;
        }
      };
    }
  }, []);

//   const handleRestart = () => {
// 	// setGameOver(null);
// 	setScores({
// 		p1_f_score: 0,
// 		p2_f_score: 0,
// 		p1_in_set_score: 0,
// 		p2_in_set_score: 0,
// 		p1_won_set_count: 0,
// 		p2_won_set_count: 0,
// 	});

// 	if (socketRef.current) {
// 		socketRef.current.send(JSON.stringify({ action: 'restart_game' }));
// 	}
//   };

if (!playerNumber) {
    return (
      <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>
        <h2>Connecting to game...</h2>
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>
        <h2>Waiting for opponent...</h2>
        <p>You are Player {playerNumber}</p>
      </div>
    );
  }

  return (
	<>
	  {gameOver && (
		<div className="game-over-modal">
		  <h2>Player {gameOver} Wins!</h2>
		  {/* <button className="btn" onClick={handleRestart}>Play Again</button> */}
		</div>
	  )}
	  
	  {!gameOver && (
		<div id="pong-container" style={{ width: '100vw', height: '100vh', marginTop: '50px' }}>
		  <div style={{ position: 'absolute', top: '5rem', left: '50%', transform: 'translateX(-50%)', color: 'white', fontSize: '24px' }}>
			Player 1: {scores.p1_in_set_score} Set count: {scores.p1_won_set_count} | 
			Player 2: {scores.p2_in_set_score} Set count: {scores.p2_won_set_count}
		  </div>
		  
		  <Canvas style={{ width: '100%', height: '100%' }} camera={{ fov: 75, near: 0.1, far: 200, position: [0, 100, 150] }}>
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
			  dimensions={{ width: FIELD_WIDTH - 2, height: 0.1, length: FIELD_LEN - 2 }} 
			  position={[0, 0, 0]} 
			  color={0x0E0F22} 
			  borderColor="white"
			/>
			
			<Ball player1Ref={player1Ref} player2Ref={player2Ref} socketRef={socketRef} setScores={setScores} setGameOver={setGameOver} />
			
			<Player
			  position={[0, 1, FIELD_LEN / 2 - 1.5]}
			  color={0xFFFFFF}
			  controls={{ left: 'ArrowLeft', right: 'ArrowRight' }}
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
	  )}
	</>
  );
  
};
export default Pong;