const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Images
const birdImg = new Image();
birdImg.src = "assets/bird.png";

const bgImg = new Image();
bgImg.src = "assets/bg.png";

const towerImg = new Image();
towerImg.src = "assets/tower.png";

// Bird
let bird = {
  x: 50,
  y: 150,
  width: 50,
  height: 50,
  velocity: 0,
  gravity: 0.06,         // gravité équilibrée
  jumpStrength: -2      // saut dynamique
};

// Towers
let towers = [];
let towerGap = 180;       // espace entre les tuyaux
let towerWidth = 60;
let towerSpeed = 3;
let frameCount = 0;

// Game state
let gameOver = false;

// Controls
canvas.addEventListener("click", () => {
  if (!gameOver) {
    bird.velocity = bird.jumpStrength;
  } else {
    resetGame();
  }
});

function resetGame() {
  bird.y = 150;
  bird.velocity = 0;
  towers = [];
  frameCount = 0;
  gameOver = false;
  draw();
}

function draw() {
  if (gameOver) {
    ctx.fillStyle = "black";
    ctx.font = "40px Arial";
    ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);
    ctx.font = "20px Arial";
    ctx.fillText("Clique pour recommencer", canvas.width / 2 - 130, canvas.height / 2 + 40);
    return;
  }

  // Fond
  ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

  // Voiseau
  ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

  // Génération des obstacles
  if (frameCount % 100 === 0) {
    let minY = -150;
    let maxY = 0;
    let offset = Math.floor(Math.random() * (maxY - minY + 1)) + minY;
    towers.push({
      x: canvas.width,
      y: offset
    });
  }

  // Dessin des obstacles + collision
  for (let i = 0; i < towers.length; i++) {
    let t = towers[i];

    // Tuyau du haut
    ctx.drawImage(towerImg, t.x, t.y, towerWidth, 300);

    // Tuyau du bas
    ctx.drawImage(towerImg, t.x, t.y + 300 + towerGap, towerWidth, 300);

    // Déplacement
    t.x -= towerSpeed;

    // Collision
    if (
      bird.x + bird.width > t.x &&
      bird.x < t.x + towerWidth &&
      (bird.y < t.y + 300 || bird.y + bird.height > t.y + 300 + towerGap)
    ) {
      gameOver = true;
    }
  }

  // Nettoyage des obstacles hors écran
  towers = towers.filter(t => t.x + towerWidth > 0);

  // Gravité
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  // Collision avec le sol ou le haut
  if (bird.y + bird.height > canvas.height || bird.y < 0) {
    gameOver = true;
  }

  frameCount++;
  requestAnimationFrame(draw);
}

draw();
