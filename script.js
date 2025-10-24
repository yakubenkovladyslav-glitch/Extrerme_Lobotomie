function openGame(url) {
  if(url === '#') {
    alert("Ce jeu n'est pas encore disponible !");
    return;
  }

  const iframe = document.getElementById("game-frame");
  const gameContainer = document.getElementById("game-container");

  iframe.src = url;
  gameContainer.style.display = "flex";
}
