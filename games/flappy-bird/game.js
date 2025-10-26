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

const skinsModal = document.getElementById("skinsModal");
const skinsList = document.getElementById("skinsList");
const closeSkins = document.getElementById("closeSkins");

// Available skins configuration (jusqu'à 10)
const SKINS = [
  { id: "default", file: "assets/bird.png", name: "Bird (base)" },
  { id: "bird1",   file: "assets/bird1.png", name: "Skin 1" },
  { id: "bird2",   file: "assets/bird2.png", name: "Skin 2" },
  { id: "bird3",   file: "assets/bird3.png", name: "Skin 3" },
  { id: "bird4",   file: "assets/bird4.png", name: "Skin 4" },
  { id: "bird5",   file: "assets/bird5.png", name: "Skin 5" },
  { id: "bird6",   file: "assets/bird6.png", name: "Skin 6" },
  { id: "bird7",   file: "assets/bird7.png", name: "Skin 7" },
  { id: "bird8",   file: "assets/bird8.png", name: "Skin 8" },
  { id: "bird9",   file: "assets/bird9.png", name: "Skin 9" }
];

// Persisted selected skin id key
const SKIN_KEY = "flappy_selected_skin";

// Current skin image
let birdImg = new Image();

// Load selected skin from localStorage or default
function loadSelectedSkin() {
  const saved = localStorage.getItem(SKIN_KEY) || "default";
  const skin = SKINS.find(s => s.id === saved) || SKINS[0];
  birdImg.src = skin.file;
}
loadSelectedSkin();

// Background and towers images
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
  gravity: 0.06,
  jumpStrength: -2
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
let animationId = null; // conserve l'id d'animation pour contrôle

// Build skins modal items (génère dynamiquement jusqu'à 10)
function buildSkinsUI() {
  skinsList.innerHTML = "";
  const currentId = localStorage.getItem(SKIN_KEY) || "default";

  SKINS.forEach(skin => {
    const wrapper = document.createElement("div");
    wrapper.className = "skin-item" + (skin.id === currentId ? " selected" : "");
    wrapper.dataset.skinId = skin.id;

    const img = document.createElement("img");
    img.src = skin.file;
    img.alt = skin.name;
    img.loading = "lazy";

    const label = document.createElement("div");
    label.style.fontSize = "12px";
    label.style.marginTop = "4px";
    label.style.textAlign = "center";
    label.textContent = skin.name;

    wrapper.appendChild(img);
    wrapper.appendChild(label);

    wrapper.addEventListener("click", () => {
      document.querySelectorAll(".skin-item").forEach(el => el.classList.remove("selected"));
      wrapper.classList.add("selected");
      localStorage.setItem(SKIN_KEY, skin.id);
      birdImg.src = skin.file;
    });

    skinsList.appendChild(wrapper);
  });
}

// Menu actions
playBtn.addEventListener("click", () => {
  mainMenu.style.display = "none";
  scoreDisplay.style.display = "block";
  resetGame();
  startGameLoop();
});

skinsBtn.addEventListener("click", () => {
  buildSkinsUI();
  skinsModal.setAttribute("aria-hidden", "false");
});

closeSkins.addEventListener("click", () => {
  skinsModal.setAttribute("aria-hidden", "true");
});

skinsModal.addEventListener("click", (e) => {
  if (e.target === skinsModal) skinsModal.setAttribute("aria-hidden", "true");
});

exitBtn.addEventListener("click", () => {
  window.location.href = "index.html";
});

restartBtn.addEventListener("click", () => {
  // cacher l'UI Game Over, réinitialiser, et relancer la boucle de jeu
  gameOverUI.style.display = "none";
  resetGame();
  startGameLoop();
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
}

// démarre la boucle de jeu en s'assurant qu'il n'y a pas déjà une animation en cours
function startGameLoop() {
  if (animationId !== null) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
  // lancer la boucle
  animationId = requestAnimationFrame(gameLoop);
}

// boucle principale (séparée pour contrôle)
function gameLoop() {
  if (gameOver) {
    gameOverUI.style.display = "block";
    // annuler l'animation pour être sûr; l'utilisateur devra cliquer sur recommencer
    if (animationId !== null) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    return;
  }

  update();
  render();

  animationId = requestAnimationFrame(gameLoop);
}

function update() {
  // Spawn towers
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

  // Move towers and check collisions/score
  for (let i = 0; i < towers.length; i++) {
    let t = towers[i];
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
}

function render() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  if (bgImg.complete) ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

  // Draw bird with current skin (vérifie que l'image est chargée)
  if (birdImg.complete && birdImg.naturalWidth !== 0) {
    ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
  } else {
    // fallback: draw simple rectangle si l'image n'est pas prête
    ctx.fillStyle = "#ffcc00";
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
  }

  // Draw towers
  for (let i = 0; i < towers.length; i++) {
    let t = towers[i];
    if (towerImg.complete) {
      ctx.drawImage(towerImg, t.x, t.y, towerWidth, 300);
      ctx.drawImage(towerImg, t.x, t.y + 300 + towerGap, towerWidth, 300);
    } else {
      ctx.fillStyle = "#2e8b57";
      ctx.fillRect(t.x, t.y, towerWidth, 300);
      ctx.fillRect(t.x, t.y + 300 + towerGap, towerWidth, 300);
    }
  }
}

// ensure the selected skin is displayed as soon as its image loads
birdImg.addEventListener("load", () => {
  // image ready; nothing de spécial à faire ici car render() vérifie birdImg.complete
});
