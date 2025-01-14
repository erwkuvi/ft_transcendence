# game/game_logic.py

game_state = {
    'player1': {'x': 0.0, 'y': 0.0},  # paddle position for player 1
    'player2': {'x': 0.0, 'y': 0.0},  # paddle position for player 2
    'ball': {'x': 0.0, 'y': 0.0, 'velocity': [0.1, 0.1]},  # ball position and velocity
    'scores': {'player1': 0, 'player2': 0},  # scores
}

def move_ball():
    """Update ball position based on its velocity."""
    game_state['ball']['x'] += game_state['ball']['velocity'][0]
    game_state['ball']['y'] += game_state['ball']['velocity'][1]
    check_collisions()

def check_collisions():
    """Handle ball collisions with the top/bottom walls and paddles."""
    # Ball collision with top and bottom walls (y axis)
    if game_state['ball']['y'] <= -1 or game_state['ball']['y'] >= 1:
        game_state['ball']['velocity'][1] *= -1  # Reverse y velocity

    # Ball collision with left and right paddles (x axis)
    if game_state['ball']['x'] <= -1 and game_state['ball']['y'] > game_state['player1']['y'] - 0.1 and game_state['ball']['y'] < game_state['player1']['y'] + 0.1:
        game_state['ball']['velocity'][0] *= -1  # Reverse x velocity (bounce)
    elif game_state['ball']['x'] >= 1 and game_state['ball']['y'] > game_state['player2']['y'] - 0.1 and game_state['ball']['y'] < game_state['player2']['y'] + 0.1:
        game_state['ball']['velocity'][0] *= -1  # Reverse x velocity (bounce)

    # Scoring (ball passed a player)
    if game_state['ball']['x'] <= -1:
        game_state['scores']['player2'] += 1  # Player 2 scores
        reset_ball()
    elif game_state['ball']['x'] >= 1:
        game_state['scores']['player1'] += 1  # Player 1 scores
        reset_ball()

# def calculate_reflection(ball, player):
    
def reset_ball():
    """Reset the ball to the center of the screen."""
    game_state['ball']['x'] = 0.0
    game_state['ball']['y'] = 0.0
    game_state['ball']['velocity'] = [0.1, 0.1]

def update_paddle(player, position):
    """Update paddle position for the specified player."""
    if player == 1:
        game_state['player1']['x'] = position
    elif player == 2:
        game_state['player2']['x'] = position

def get_game_state():
    """Return the current game state (to be sent to frontend)."""
    return game_state
