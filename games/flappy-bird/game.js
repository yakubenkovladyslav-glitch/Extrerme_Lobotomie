const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// UI elements
const mainMenu = document.getElementById("mainMenu");
const playBtn = document.getElementById("playBtn");
const skinsBtn = document.getElementById("skinsBtn");
const exitBtn = document.getElementById("exitBtn");
const scoreDisplay = document.getElementById("scoreDisplay");
const gameOverUI = document.getElementById("gameOverUI");
const restartBtn = document.getElementById("restartBtn");
const quitBtn = document.getElementById("quitBtn");

// Images
const birdImg = new Image();
birdImg.src = "assets/bird.png"; // ← ton voiseau

const bgImg = new Image();
bgImg.src = "assets/bg.png";

const towerImg = new Image();
towerImg.src = "assets/tower.png"; // ← ton obstacle

// Bird
let bird = {
  x: 50,
  y: 150,
  width: 50,
  height: 50,
  velocity: 0,
  gravity: 0.3,
  jumpStrength: -8
};

// Towers
let towers = [];
let towerGap = 180;
let towerWidth = 60;
let towerSpeed = 2;
let frameCount = 0;

// Game state
let gameOver = false;
let score = 0;

// Menu actions
playBtn.addEventListener("click", () => {
  mainMenu.style.display = "none";
  scoreDisplay.style.display = "block";
  draw();
});

skinsBtn.addEventListener("click", () => {
  alert("Les skins arrivent bientôt !");
});

exitBtn.addEventListener("click", () => {
  window.location.href = "https://tonsite.com"; // ← change selon ton site
});

restartBtn.addEventListener("click", () => {
  resetGame();
  gameOverUI.style.display = "none";
});

quitBtn.addEventListener("click", () => {
  window.location.href = "index.html";
});

// Controls
canvas.addEventListener("click", () => {
  if (!gameOver) {
    bird.velocity = bird.jumpStrength;
  }
});

function resetGame() {
  bird.y = 150;
  bird.velocity = 0;
  towers = [];
  frameCount = 0;
  gameOver = false;
  score = 0;
  scoreDisplay.innerText = "Score : 0";
  draw();
}

function draw() {
  if (gameOver) {
    gameOverUI.style.display = "block";
    return;
  }

  ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);



  ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

  if (frameCount % 100 === 0) {
    let minY = -150;
    let maxY = 0;
    let offset = Math.floor(Math.random() * (maxY - minY + 1)) + minY;
    towers.push({
      x: canvas.width,
      y: offset,
      passed: false
    });
  }

  for (let i = 0; i < towers.length; i++) {
    let t = towers[i];

    ctx.drawImage(towerImg, t.x, t.y, towerWidth, 300);
    ctx.drawImage(towerImg, t.x, t.y + 300 + towerGap, towerWidth, 300);
    t.x -= towerSpeed;

    if (
      bird.x + bird.width > t.x &&
      bird.x < t.x + towerWidth &&
      (bird.y < t.y + 300 || bird.y + bird.height > t.y + 300 + towerGap)
    ) {
      gameOver = true;
    }

    if (!t.passed && t.x + towerWidth < bird.x) {
      score++;
      t.passed = true;
      scoreDisplay.innerText = "Score : " + score;
    }
  }

  towers = towers.filter(t => t.x + towerWidth > 0);

  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  if (bird.y + bird.height > canvas.height || bird.y < 0) {
    gameOver = true;
  }

  frameCount++;
  requestAnimationFrame(draw);
}
