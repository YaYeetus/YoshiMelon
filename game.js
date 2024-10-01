const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const SNAKE_BLOCK_SIZE = 32;
const SPEED = 100; // Lower value = faster snake

// Load sprites
const yoshiImg = new Image();
yoshiImg.src = 'YoshiSprites/yoshi_resized.png';

const melonImg = new Image();
melonImg.src = 'YoshiSprites/melon_resized.png';

const eggImg = new Image();
eggImg.src = 'YoshiSprites/egg_resized.png';

// Load background image
const backgroundImg = new Image();
backgroundImg.src = 'YoshiSprites/checkerboard_background.png';  // Adjust this path if saved elsewhere

// Snake variables
let snakeBody = [{ x: 300, y: 200 }];
let snakeLength = 1;
let dx = SNAKE_BLOCK_SIZE;
let dy = 0;

// Melon position
let melon = {
    x: Math.floor(Math.random() * (canvas.width / SNAKE_BLOCK_SIZE)) * SNAKE_BLOCK_SIZE,
    y: Math.floor(Math.random() * (canvas.height / SNAKE_BLOCK_SIZE)) * SNAKE_BLOCK_SIZE,
};

// Function to draw the game background
function drawBackground() {
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
}

// Function to draw the snake
function drawSnake() {
    for (let i = 0; i < snakeBody.length - 1; i++) {
        ctx.drawImage(eggImg, snakeBody[i].x, snakeBody[i].y, SNAKE_BLOCK_SIZE, SNAKE_BLOCK_SIZE);
    }
    // Draw Yoshi as the snake's head
    const head = snakeBody[snakeBody.length - 1];
    ctx.drawImage(yoshiImg, head.x, head.y, SNAKE_BLOCK_SIZE, SNAKE_BLOCK_SIZE);
}

// Function to generate a new melon position
function generateMelon() {
    melon.x = Math.floor(Math.random() * (canvas.width / SNAKE_BLOCK_SIZE)) * SNAKE_BLOCK_SIZE;
    melon.y = Math.floor(Math.random() * (canvas.height / SNAKE_BLOCK_SIZE)) * SNAKE_BLOCK_SIZE;
}

// Main game loop
function gameLoop() {
    // Move snake
    const head = { x: snakeBody[snakeBody.length - 1].x + dx, y: snakeBody[snakeBody.length - 1].y + dy };
    snakeBody.push(head);

    // Check if snake eats the melon
    if (head.x === melon.x && head.y === melon.y) {
        snakeLength++;
        generateMelon();
    } else {
        snakeBody.shift(); // Remove the last segment if no melon is eaten
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

    // Clear canvas and redraw
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();  // Draw the new background image
    ctx.drawImage(melonImg, melon.x, melon.y, SNAKE_BLOCK_SIZE, SNAKE_BLOCK_SIZE); // Draw melon
    drawSnake();
}

// Reset game when snake collides
function resetGame() {
    snakeBody = [{ x: 300, y: 200 }];
    snakeLength = 1;
    dx = SNAKE_BLOCK_SIZE;
    dy = 0;
    generateMelon();
}

// Control snake direction using arrow keys and W, A, S, D
window.addEventListener('keydown', function (e) {
    switch (e.key) {
        case 'ArrowUp':
        case 'w':
            if (dy === 0) {
                dx = 0;
                dy = -SNAKE_BLOCK_SIZE;
            }
            break;
        case 'ArrowDown':
        case 's':
            if (dy === 0) {
                dx = 0;
                dy = SNAKE_BLOCK_SIZE;
            }
            break;
        case 'ArrowLeft':
        case 'a':
            if (dx === 0) {
                dx = -SNAKE_BLOCK_SIZE;
                dy = 0;
            }
            break;
        case 'ArrowRight':
        case 'd':
            if (dx === 0) {
                dx = SNAKE_BLOCK_SIZE;
                dy = 0;
            }
            break;
    }
});

// Start game loop
setInterval(gameLoop, SPEED);