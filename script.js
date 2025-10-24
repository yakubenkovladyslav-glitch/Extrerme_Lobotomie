function openGame(url) {
  const frame = document.getElementById('game-frame');
  frame.src = url;
}

window.addEventListener("message", (event) => {
  if (event.data === "closeGame") {
    document.getElementById('game-frame').src = "";
  }
});
