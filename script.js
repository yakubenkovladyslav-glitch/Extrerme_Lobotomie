function openGame(url) {
  const frame = document.getElementById('game-frame');
  frame.src = url;

  // Quand l'iframe est chargé, lui donner le focus pour capter le clavier
  frame.onload = function() {
    frame.contentWindow.focus();
  };
}

// Permet de fermer le jeu et vider l'iframe
window.addEventListener("message", (event) => {
  if (event.data === "closeGame") {
    document.getElementById('game-frame').src = "";
  }
});
