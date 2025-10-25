const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// === CONFIG ===
const tileSize = 32;
let width = canvas.width / tileSize;
let height = canvas.height / tileSize;

let snake = [{x: 10, y: 10}];
let direction = "RIGHT";
let nextDirection = "RIGHT";
let food = spawnFood();
let frameDelay = 25;
let speed = 7;
let moveProgress = 0;
let score = 0;
let paused = false;
let gameInterval;

// === START ===
startGame();

function startGame() {
  clearInterval(gameInterval);
  gameInterval = setInterval(update, frameDelay);
}

// === CONTROLES ===
document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp" || e.key === "z") if (direction !== "DOWN") nextDirection = "UP";
  if (e.key === "ArrowDown" || e.key === "s") if (direction !== "UP") nextDirection = "DOWN";
  if (e.key === "ArrowLeft" || e.key === "q") if (direction !== "RIGHT") nextDirection = "LEFT";
  if (e.key === "ArrowRight" || e.key === "d") if (direction !== "LEFT") nextDirection = "RIGHT";
  if (e.key === " " || e.key === "p") paused = !paused;
});

// === FONCTIONS PRINCIPALES ===
function update() {
  if (paused) {
    drawPause();
    return;
  }

  moveProgress += speed * (frameDelay / 1000);
  if (moveProgress >= 1) {
    moveProgress = 0;
    advanceSnake();
  }
  drawSmooth(moveProgress);
}

function advanceSnake() {
  direction = nextDirection;
  let head = {...snake[0]};

  if (direction === "UP") head.y--;
  if (direction === "DOWN") head.y++;
  if (direction === "LEFT") head.x--;
  if (direction === "RIGHT") head.x++;

  if (head.x < 0 || head.x >= width || head.y < 0 || head.y >= height) return gameOver();
  if (snake.some(s => s.x === head.x && s.y === head.y)) return gameOver();

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    speed += 0.25;
    food = spawnFood();
  } else {
    snake.pop();
  }
}

function spawnFood() {
  let x, y;
  do {
    x = Math.floor(Math.random() * width);
    y = Math.floor(Math.random() * height);
  } while (snake.some(s => s.x === x && s.y === y));
  return {x, y, pulse: 0};
}

function gameOver() {
  clearInterval(gameInterval);
  drawGameOver();
  setTimeout(() => {
    snake = [{x: 10, y: 10}];
    direction = "RIGHT";
    nextDirection = "RIGHT";
    food = spawnFood();
    score = 0;
    speed = 7;
    moveProgress = 0;
    startGame();
  }, 1500);
}

// === DESSIN ===
function drawSmooth(progress) {
  drawBackground();
  drawFood(food);
  drawSnake(progress);
  drawHUD();
}

function drawBackground() {
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#0b0b0b");
  gradient.addColorStop(1, "#101010");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if ((x + y) % 2 === 0) {
        ctx.fillStyle = "rgba(255,255,255,0.02)";
        ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
      }
    }
  }
}

function drawFood(food) {
  food.pulse += 0.15;
  const cx = food.x * tileSize + tileSize / 2;
  const cy = food.y * tileSize + tileSize / 2;
  const r = (tileSize / 2.5) + Math.sin(food.pulse) * 2;

  const gradient = ctx.createRadialGradient(cx, cy, 2, cx, cy, r);
  gradient.addColorStop(0, "#ff5555");
  gradient.addColorStop(1, "#660000");

  ctx.shadowColor = "#ff3333";
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.fillStyle = gradient;
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
}

function drawSnake(progress) {
  ctx.shadowColor = "#00ff99";
  ctx.shadowBlur = 15;

  for (let i = snake.length - 1; i >= 0; i--) {
    const seg = snake[i];
    const prev = snake[i - 1] || seg;
    const next = snake[i + 1] || seg;
    const isHead = i === 0;

    let offsetX = 0, offsetY = 0;
    if (isHead) {
      if (direction === "UP") offsetY = tileSize * (1 - progress);
      if (direction === "DOWN") offsetY = -tileSize * (1 - progress);
      if (direction === "LEFT") offsetX = tileSize * (1 - progress);
      if (direction === "RIGHT") offsetX = -tileSize * (1 - progress);
    }

    const x = seg.x * tileSize + offsetX;
    const y = seg.y * tileSize + offsetY;

    const cx = x + tileSize / 2;
    const cy = y + tileSize / 2;
    const radius = tileSize / 2.2;

    const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, radius);
    grad.addColorStop(0, isHead ? "#66ffaa" : "#33cc77");
    grad.addColorStop(1, "#003322");

    ctx.beginPath();
    ctx.fillStyle = grad;
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    if (isHead) {
      ctx.fillStyle = "black";
      let ex = 0, ey = 0;
      if (direction === "UP") ey = -6;
      if (direction === "DOWN") ey = 6;
      if (direction === "LEFT") ex = -6;
      if (direction === "RIGHT") ex = 6;
      ctx.beginPath();
      ctx.arc(cx + ex, cy + ey, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.shadowBlur = 0;
}

function drawHUD() {
  ctx.fillStyle = "#00ff99";
  ctx.font = "20px Consolas";
  ctx.fillText("Score: " + score, 10, 25);
  ctx.fillText("Speed: " + speed.toFixed(1), 10, 50);
  if (paused) {
    ctx.fillStyle = "yellow";
    ctx.fillText("⏸ PAUSE", canvas.width / 2 - 40, 40);
  }
}

function drawPause() {
  drawBackground();
  drawSnake(0);
  drawFood(food);
  drawHUD();
  ctx.fillStyle = "rgba(0,0,0,0.7)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.font = "32px Arial";
  ctx.fillText("⏸ Pause", canvas.width / 2 - 60, canvas.height / 2);
}

function drawGameOver() {
  drawBackground();
  drawSnake(0);
  drawFood(food);
  ctx.fillStyle = "rgba(0,0,0,0.6)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#ff3333";
  ctx.font = "36px Arial";
  ctx.fillText("💀 GAME OVER 💀", canvas.width / 2 - 140, canvas.height / 2);
  ctx.fillStyle = "#00ff99";
  ctx.font = "20px Consolas";
  ctx.fillText("Score final : " + score, canvas.width / 2 - 60, canvas.height / 2 + 40);
}
