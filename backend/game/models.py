from django.db import models

class Game(models.Model):
    game_id = models.AutoField(primary_key=True)
    player1_id = models.CharField(max_length=50)
    player2_id = models.CharField(max_length=50)

    ball_position = models.JSONField(default=dict)  # To store position as a JSON object (e.g., {"x": 0, "y": 0, "z": 0})
    ball_velocity = models.JSONField(default=dict)  # To store velocity as a JSON object (e.g., {"x": 1, "y": 1, "z": 0})
    ball_direction = models.JSONField(default=dict)  # To store velocity as a JSON object (e.g., {"x": 1, "y": 1, "z": 0})

    player1_paddle = models.FloatField(default=0.0)
    player2_paddle = models.FloatField(default=0.0)

    player1_score = models.IntegerField(default=0)
    player2_score = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_running = models.BooleanField(default=True)

    def __str__(self):
        return f"Game {self.game_id} between: {self.player1_id} and {self.player2_id}"


# updating the ball state:
# game.ball_position = {"x": 150, "y": 250, "z": 0}
# game.ball_velocity = {"x": 2, "y": -2, "z": 0}
# game.save()


# I want to save it to db when the game starts and when it ends (2 times only)
# maybe two tables one with the active games and one for history?
# everything else websockets
# update when the ball hits the wall or paddle (velocity and vector)y

# Recommended Approach for Pong
# For a real-time Pong game:

# 1.Use a hybrid model:

# Server computes and sends ball position, velocity, and direction at fixed intervals.
# Clients use this data to interpolate the ball's movement locally for smoother rendering.

# 2.Optimize server computations:

# Use time-stepped updates (e.g., 60 updates per second).
# Perform collision checks on the server, updating velocity and direction as needed.

# 3.Optimize network traffic:

# Use efficient serialization formats (e.g., JSON, Protobuf) for updates.
# Reduce update frequency if bandwidth is a concern.
# This approach balances server authority, computational efficiency, and smooth client experience.