// Variables du jeu
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Dimensions
const birdWidth = 30;
const birdHeight = 30;
let birdY = canvas.height / 2 - birdHeight / 2;
let birdVelocity = 0;
const gravity = 0.5;
const lift = -10;
const pipeWidth = 50;
const pipeGap = 150;
let pipes = [];
let score = 0;

// Images
const birdImage = new Image();
birdImage.src = "assets/bird.png"; // Remplace avec l'image de ton oiseau
const pipeImage = new Image();
pipeImage.src = "assets/pipe.png"; // Remplace avec l'image de ton tuyau

// Événements
document.addEventListener("keydown", () => {
    birdVelocity = lift;  // Lorsque l'utilisateur appuie sur une touche, l'oiseau s'élève
});

// Création des tuyaux
function createPipe() {
    const pipeHeight = Math.floor(Math.random() * (canvas.height - pipeGap));
    pipes.push({
        x: canvas.width,
        top: pipeHeight,
        bottom: pipeHeight + pipeGap
    });
}

// Mise à jour du jeu
function updateGame() {
    // Déplacer les tuyaux
    pipes.forEach(pipe => {
        pipe.x -= 2;  // Les tuyaux se déplacent de 2 pixels par frame
    });

    // Ajouter des tuyaux si nécessaire
    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
        createPipe();
    }

    // Vérifier les collisions avec les tuyaux ou les bords du canvas
    pipes.forEach(pipe => {
        if (
            birdY < pipe.top || birdY + birdHeight > pipe.bottom ||  // Si l'oiseau touche un tuyau
            birdY < 0 || birdY + birdHeight > canvas.height          // Si l'oiseau sort du canvas
        ) {
            resetGame();
        }
    });

    // Mettre à jour la position de l'oiseau
    birdVelocity += gravity;  // Ajouter la gravité à la vitesse de l'oiseau
    birdY += birdVelocity;

    // Supprimer les tuyaux qui sont sortis de l'écran
    pipes = pipes.filter(pipe => pipe.x + pipeWidth > 0);

    // Mise à jour du score (ajouter 1 à chaque fois que l'oiseau passe un tuyau)
    pipes.forEach(pipe => {
        if (pipe.x + pipeWidth < 0) {
            score++;
        }
    });

    // Redessiner l'écran
    drawGame();
}

// Dessiner le jeu
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // Effacer le canvas à chaque frame

    // Dessiner l'oiseau
    ctx.drawImage(birdImage, 50, birdY, birdWidth, birdHeight);

    // Dessiner les tuyaux
    pipes.forEach(pipe => {
        ctx.drawImage(pipeImage, pipe.x, 0, pipeWidth, pipe.top);  // Tuyau du haut
        ctx.drawImage(pipeImage, pipe.x, pipe.bottom, pipeWidth, canvas.height - pipe.bottom);  // Tuyau du bas
    });

    // Afficher le score
    ctx.font = "24px Arial";
    ctx.fillStyle = "#ff1a1a";  // Néon rouge pour le score
    ctx.fillText("Score: " + score, 10, 30);
}

// Réinitialiser le jeu en cas de collision
function resetGame() {
    birdY = canvas.height / 2 - birdHeight / 2;
    birdVelocity = 0;
    pipes = [];
    score = 0;
}

// Boucle de jeu
function gameLoop() {
    updateGame();  // Mettre à jour l'état du jeu
    requestAnimationFrame(gameLoop);  // Appeler la fonction à la prochaine frame
}

// Démarrer le jeu
gameLoop();
