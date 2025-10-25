// Access the canvas and context
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Game configuration
const tileSize = 32;
let width = canvas.width / tileSize;
let height = canvas.height / tileSize;

let snake = [{x: 10, y: 10}]; // Initial snake position
let direction = "RIGHT"; // Initial direction
let nextDirection = "RIGHT"; // Direction we want to move next
let food = spawnFood(); // Generate initial food
let frameDelay = 100; // Delay between game frames (controls speed)
let score = 0; // Initial score

// Start the game
function startGame() {
    setInterval(update, frameDelay); // Set up the game loop
}

// Listen for keyboard input (W, A, S, D or arrow keys)
document.addEventListener("keydown", e => {
    if (e.key === "ArrowUp" || e.key === "w") if (direction !== "DOWN") nextDirection = "UP";
    if (e.key === "ArrowDown" || e.key === "s") if (direction !== "UP") nextDirection = "DOWN";
    if (e.key === "ArrowLeft" || e.key === "a") if (direction !== "RIGHT") nextDirection = "LEFT";
    if (e.key === "ArrowRight" || e.key === "d") if (direction !== "LEFT") nextDirection = "RIGHT";
});

// Game loop
function update() {
    direction = nextDirection;
    let head = {...snake[0]}; // Create a copy of the head

    // Move the snake based on the direction
    if (direction === "UP") head.y--;
    if (direction === "DOWN") head.y++;
    if (direction === "LEFT") head.x--;
    if (direction === "RIGHT") head.x++;

    // Check for collisions with walls or itself
    if (head.x < 0 || head.x >= width || head.y < 0 || head.y >= height || snake.some(s => s.x === head.x && s.y === head.y)) {
        return gameOver(); // End the game
    }

    snake.unshift(head); // Add the new head to the snake

    // Check if the snake eats food
    if (head.x === food.x && head.y === food.y) {
        score++; // Increase score
        food = spawnFood(); // Respawn food
    } else {
        snake.pop(); // Remove the tail if no food is eaten
    }

    draw(); // Redraw the game
}

// Spawn food in a random location
function spawnFood() {
    let x, y;
    do {
        x = Math.floor(Math.random() * width);
        y = Math.floor(Math.random() * height);
    } while (snake.some(s => s.x === x && s.y === y)); // Ensure food doesn't spawn on the snake
    return {x, y};
}

// Handle game over (reset the game)
function gameOver() {
    alert("Game Over! Your score is: " + score);
    snake = [{x: 10, y: 10}]; // Reset snake position
    direction = "RIGHT"; // Reset direction
    score = 0; // Reset score
}

// Draw everything to the canvas
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    // Draw snake
    snake.forEach((segment, index) => {
        const img = index === 0 ? document.getElementById("head") : document.getElementById("body"); // Use head for the first segment and body for others
        ctx.drawImage(img, segment.x * tileSize, segment.y * tileSize, tileSize, tileSize); // Draw the segment
    });

    // Draw food
    const foodImg = document.getElementById("food"); // Get food image
    ctx.drawImage(foodImg, food.x * tileSize, food.y * tileSize, tileSize, tileSize); // Draw food

    // Update score display
    document.getElementById("score").textContent = "Score: " + score;
}

// Initialize images (snake head, body, food)
function loadImages() {
    const head = new Image();
    head.src = "assets/head.png";
    head.id = "head"; // Assign ID for later use
    document.body.appendChild(head); // Append image to body (not visible)

    const body = new Image();
    body.src = "assets/body.png";
    body.id = "body";
    document.body.appendChild(body);

    const food = new Image();
    food.src = "assets/food.png";
    food.id = "food";
    document.body.appendChild(food);
}

// Load images and start the game
loadImages();
startGame();
