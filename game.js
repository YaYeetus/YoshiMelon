const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const SNAKE_BLOCK_SIZE = 32;
const SPEED = 100; // Lower value = faster snake

// Load background image
const backgroundImg = new Image();
backgroundImg.src = 'YoshiSprites/background.png';  // Replace with the actual background image path

// Load sprites
const yoshiImg = new Image();
yoshiImg.src = 'YoshiSprites/yoshi_resized.png';

const melonImg = new Image();
melonImg.src = 'YoshiSprites/melon_resized.png';

const eggImg = new Image();
eggImg.src = 'YoshiSprites/egg_resized.png';

// Snake variables
let snakeBody = [{ x: 300, y: 200 }];
let snakeLength = 1;  // This controls the number of segments
let dx = SNAKE_BLOCK_SIZE;
let dy = 0;

// Melon position
let melon = {
    x: Math.floor(Math.random() * (canvas.width / SNAKE_BLOCK_SIZE)) * SNAKE_BLOCK_SIZE,
    y: Math.floor(Math.random() * (canvas.height / SNAKE_BLOCK_SIZE)) * SNAKE_BLOCK_SIZE,
};

// Function to draw the background
function drawBackground() {
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);  // Draw the background covering the whole canvas
}

// Function to draw the snake
function drawSnake() {
    for (let i = 0; i < snakeBody.length; i++) {
        const segment = snakeBody[i];
        if (i === snakeBody.length - 1) {
            ctx.drawImage(yoshiImg, segment.x, segment.y, SNAKE_BLOCK_SIZE, SNAKE_BLOCK_SIZE);  // Draw Yoshi's head
        } else {
            ctx.drawImage(eggImg, segment.x, segment.y, SNAKE_BLOCK_SIZE, SNAKE_BLOCK_SIZE);   // Draw eggs for the body
        }
    }
}

// Function to generate a new melon position
function generateMelon() {
    melon.x = Math.floor(Math.random() * (canvas.width / SNAKE_BLOCK_SIZE)) * SNAKE_BLOCK_SIZE;
    melon.y = Math.floor(Math.random() * (canvas.height / SNAKE_BLOCK_SIZE)) * SNAKE_BLOCK_SIZE;
}

// Main game loop
function gameLoop() {
    // Calculate new head position
    const head = { x: snakeBody[snakeBody.length - 1].x + dx, y: snakeBody[snakeBody.length - 1].y + dy };

    // Add the new head to the snake body
    snakeBody.push(head);

    // Check if snake eats the melon
    if (head.x === melon.x && head.y === melon.y) {
        snakeLength++;  // Increase snake length when Yoshi eats the melon
        generateMelon(); // Generate a new melon position
    }

    // Ensure that the snake's body only maintains its current length
    while (snakeBody.length > snakeLength) {
        snakeBody.shift(); // Remove the oldest body segment
    }

    // Check for wall collisions
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        resetGame();
    }

    // Check for self-collision
    for (let i = 0; i < snakeBody.length - 1; i++) {
        if (head.x === snakeBody[i].x && head.y === snakeBody[i].y) {
            resetGame();
        }
    }

    // Clear the canvas and redraw everything
    drawBackground();  // Draw the background first
    ctx.drawImage(melonImg, melon.x, melon.y, SNAKE_BLOCK_SIZE, SNAKE_BLOCK_SIZE); // Draw melon
    drawSnake();  // Draw Yoshi and the snake (eggs)
}

// Reset the game when Yoshi collides with a wall or itself
function resetGame() {
    snakeBody = [{ x: 300, y: 200 }];  // Reset to starting position
    snakeLength = 1;  // Reset to initial length
    dx = SNAKE_BLOCK_SIZE;  // Reset movement direction
    dy = 0;
    generateMelon();  // Generate a new melon position
}

// Control snake direction using arrow keys and WASD keys
window.addEventListener('keydown', function (e) {
    switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            if (dy === 0) {
                dx = 0;
                dy = -SNAKE_BLOCK_SIZE;
            }
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            if (dy === 0) {
                dx = 0;
                dy = SNAKE_BLOCK_SIZE;
            }
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            if (dx === 0) {
                dx = -SNAKE_BLOCK_SIZE;
                dy = 0;
            }
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            if (dx === 0) {
                dx = SNAKE_BLOCK_SIZE;
                dy = 0;
            }
            break;
    }
});

// Start the game loop
setInterval(gameLoop, SPEED);