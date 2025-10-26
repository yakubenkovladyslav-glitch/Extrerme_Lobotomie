// games/flappy-bird/game.js
const bird = document.getElementById('bird');
const birdStyle = bird.style;
const gameScreen = document.querySelector('.game-screen');

let birdPositionY = 150;
let birdVelocity = 10; // Vitesse verticale de l'oiseau
const gravity = 0.5;  // Gravité
const jumpPower = 1; // Puissance du saut
let isJumping = false;

// Position de l'oiseau
birdStyle.top = `${birdPositionY}px`;

let obstacles = [];
let score = 0;
const obstacleWidth = 50;
const obstacleGap = 150; // Espacement entre les obstacles (hauteur du gap)

document.addEventListener('keydown', function (event) {
  if (event.code === 'Space' && !isJumping) {
    jumpBird();
  }
});

function jumpBird() {
  birdVelocity = jumpPower;
  isJumping = true;
}

// Déplacer l'oiseau en fonction de la gravité et des sauts
function moveBird() {
  birdVelocity += gravity;
  birdPositionY += birdVelocity;
  birdStyle.top = `${birdPositionY}px`;

  // Empêcher l'oiseau de sortir de l'écran (le sol et le plafond)
  if (birdPositionY < 0) {
    birdPositionY = 0;
    birdVelocity = 0;
  }

  if (birdPositionY > 400) {
    birdPositionY = 400;
    birdVelocity = 0;
  }
}

// Créer des obstacles
function createObstacle() {
  const obstacleHeight = Math.floor(Math.random() * (300 - 100) + 100); // Hauteur aléatoire
  const obstacleBottomHeight = 500 - obstacleHeight - obstacleGap; // La partie basse des tours

  // Créer les tours (haut et bas)
  const topObstacle = document.createElement('div');
  topObstacle.classList.add('obstacle', 'top');
  topObstacle.style.height = `${obstacleHeight}px`;
  topObstacle.style.left = '100%'; // Démarre à droite de l'écran

  const bottomObstacle = document.createElement('div');
  bottomObstacle.classList.add('obstacle', 'bottom');
  bottomObstacle.style.height = `${obstacleBottomHeight}px`;
  bottomObstacle.style.left = '100%';

  gameScreen.appendChild(topObstacle);
  gameScreen.appendChild(bottomObstacle);

  obstacles.push({ top: topObstacle, bottom: bottomObstacle, passed: false });
}

// Déplacer les obstacles
function moveObstacles() {
  obstacles.forEach((obstacle, index) => {
    let obstaclePositionX = parseInt(obstacle.top.style.left);

    // Déplace les obstacles de droite à gauche
    obstaclePositionX -= 2;
    obstacle.top.style.left = `${obstaclePositionX}px`;
    obstacle.bottom.style.left = `${obstaclePositionX}px`;

    // Vérifie si l'obstacle est sorti de l'écran
    if (obstaclePositionX < -obstacleWidth) {
      gameScreen.removeChild(obstacle.top);
      gameScreen.removeChild(obstacle.bottom);
      obstacles.splice(index, 1);
      if (!obstacle.passed) {
        score++;
      }
    }

    // Vérifier la collision entre l'oiseau et les obstacles
    if (
      parseInt(obstacle.top.style.left) < 60 &&
      parseInt(obstacle.top.style.left) > 10 &&
      (birdPositionY < parseInt(obstacle.height) || birdPositionY > 500 - parseInt(obstacle.height) - obstacleGap)
    ) {
      // Si l'oiseau touche un obstacle, on réinitialise le jeu
      gameOver();
    }

    // Vérifier si l'oiseau passe les obstacles sans collision
    if (!obstacle.passed && obstaclePositionX < 60) {
      obstacle.passed = true;
    }
  });
}

// Game Over (arrêt du jeu)
function gameOver() {
  alert("Game Over!");
  window.location.reload(); // Recharger la page pour recommencer
}

// Afficher le score
function updateScore() {
  const scoreElement = document.getElementById('score');
  scoreElement.textContent = `Score: ${score}`;
}

function gameLoop() {
  moveBird();
  moveObstacles();
  updateScore();
}

// Créer un obstacle toutes les 2 secondes
setInterval(createObstacle, 2000);

// Exécuter la logique du jeu à intervalles réguliers
setInterval(gameLoop, 20);
