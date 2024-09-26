import pygame
import random
import sys

# Initialize pygame
pygame.init()

# Game constants
SCREEN_WIDTH, SCREEN_HEIGHT = 600, 400
SNAKE_BLOCK_SIZE = 32
SPEED = 15

# Colors
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)

# Load sprites from "YoshiSprites" folder
yoshi_img = pygame.image.load("YoshiSprites/yoshi_resized.png")
melon_img = pygame.image.load("YoshiSprites/melon_resized.png")
egg_img = pygame.image.load("YoshiSprites/egg_resized.png")

# Setup display
screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
pygame.display.set_caption('Yoshi Snake Game')

# Clock for controlling the game speed
clock = pygame.time.Clock()

# Function to draw the snake
def draw_snake(snake_body):
    for x, y in snake_body[:-1]:
        screen.blit(egg_img, (x, y))  # Draw eggs for the snake's body
    screen.blit(yoshi_img, (snake_body[-1][0], snake_body[-1][1]))  # Draw Yoshi as the head

# Function to generate a random position for the melon
def random_melon_position():
    return (
        random.randrange(0, SCREEN_WIDTH - SNAKE_BLOCK_SIZE, SNAKE_BLOCK_SIZE),
        random.randrange(0, SCREEN_HEIGHT - SNAKE_BLOCK_SIZE, SNAKE_BLOCK_SIZE),
    )

# Main game loop
def game_loop():
    # Initial settings for Yoshi's position and movement
    x = SCREEN_WIDTH // 2
    y = SCREEN_HEIGHT // 2
    x_change = 0
    y_change = 0
    snake_body = [(x, y)]
    snake_length = 1

    melon_x, melon_y = random_melon_position()

    game_over = False

    while not game_over:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                game_over = True
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_LEFT:
                    x_change = -SNAKE_BLOCK_SIZE
                    y_change = 0
                elif event.key == pygame.K_RIGHT:
                    x_change = SNAKE_BLOCK_SIZE
                    y_change = 0
                elif event.key == pygame.K_UP:
                    x_change = 0
                    y_change = -SNAKE_BLOCK_SIZE
                elif event.key == pygame.K_DOWN:
                    x_change = 0
                    y_change = SNAKE_BLOCK_SIZE

        # Move the snake
        x += x_change
        y += y_change

        # Check for collisions with walls
        if x >= SCREEN_WIDTH or x < 0 or y >= SCREEN_HEIGHT or y < 0:
            game_over = True

        # Check if Yoshi eats the melon
        if x == melon_x and y == melon_y:
            melon_x, melon_y = random_melon_position()  # New melon position
            snake_length += 1  # Increase snake length

        # Update the snake's body
        snake_body.append((x, y))
        if len(snake_body) > snake_length:
            del snake_body[0]

        # Check for collisions with the snake's own body
        for segment in snake_body[:-1]:
            if segment == (x, y):
                game_over = True

        # Draw everything
        screen.fill(WHITE)
        screen.blit(melon_img, (melon_x, melon_y))  # Draw melon
        draw_snake(snake_body)  # Draw Yoshi and the snake

        pygame.display.update()
        clock.tick(SPEED)

    pygame.quit()
    sys.exit()

# Uncomment the line below to run the game in a Python environment with pygame installed
# game_loop()