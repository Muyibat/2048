document.getElementById("hamburger").addEventListener("click", function () {
  const navLinks = document.querySelector(".nav-links");
  navLinks.classList.toggle("active");
});

const currentScore = document.getElementById("current-score");
const highScore = document.getElementById("high-score");
const gameContainer = document.getElementById("game-board");
const gameOver = document.getElementById("game-over");
const restart = document.getElementById("restart");

let score = 0;
let board = [];

function startGame() {
  board = Array(4)
    .fill()
    .map(() => Array(4).fill(0));
  score = 0;
  currentScore.textContent = score;
  gameOver.style.display = "none";
  addNumber();
  addNumber();
  updateBoard();
}

function addNumber() {
  let emptyTiles = [];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (board[i][j] === 0) {
        emptyTiles.push({ i, j });
      }
    }
  }
  if (emptyTiles.length > 0) {
    let { i, j } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    if (Math.random() < 0.9) {
      board[i][j] = 2;
    } else {
      board[i][j] = 4;
    }
  }
}

function updateBoard() {
  gameContainer.innerHTML = "";
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      let tile = document.createElement("div");
      tile.className = "tile";
      if (board[i][j] !== 0) {
        tile.textContent = board[i][j];
        tile.setAttribute("data-value", board[i][j]);
      }
      gameContainer.appendChild(tile);
    }
  }
}

function move(direction) {
  let moved = false;
  if (direction === "up" || direction === "down") {
    for (let j = 0; j < 4; j++) {
      let col = board.map((row) => row[j]);
      let newCol = slide(col, direction === "down");
      for (let i = 0; i < 4; i++) {
        if (board[i][j] !== newCol[i]) {
          board[i][j] = newCol[i];
          moved = true;
        }
      }
    }
  } else if (direction === "left" || direction === "right") {
    for (let i = 0; i < 4; i++) {
      let row = board[i];
      let newRow = slide(row, direction === "right");
      for (let j = 0; j < 4; j++) {
        if (board[i][j] !== newRow[j]) {
          board[i][j] = newRow[j];
          moved = true;
        }
      }
    }
  }
  if (moved) {
    addNumber();
    updateBoard();
    updateScore();
    if (isGameOver()) {
      gameOver.style.display = "flex";
    }
  }
}

function slide(array, reverse = false) {
  if (reverse) {
    array = array.reverse();
  }

  let newArray = array.filter((val) => val !== 0);
  for (let i = 0; i < newArray.length - 1; i++) {
    if (newArray[i] === newArray[i + 1]) {
      newArray[i] *= 2;
      score += newArray[i];
      newArray[i + 1] = 0;
    }
  }
  newArray = newArray.filter((val) => val !== 0);
  while (newArray.length < 4) {
    newArray.push(0);
  }
  if (reverse) newArray = newArray.reverse();
  return newArray;
}

function updateScore() {
  currentScore.textContent = score;
  if (score > parseInt(highScore.textContent || 0)) {
    highScore.textContent = score;
  }
}

function isGameOver() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (board[i][j] === 0) return false;
      if (i < 3 && board[i][j] === board[i + 1][j]) return false;
      if (j < 3 && board[i][j] === board[i][j + 1]) return false;
    }
  }
  return true;
}

document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
      move("up");
      break;
    case "ArrowDown":
      move("down");
      break;
    case "ArrowLeft":
      move("left");
      break;
    case "ArrowRight":
      move("right");
      break;
  }
});

restart.addEventListener("click", startGame);

startGame();

let touchStartX = 0;
let touchStartY = 0;

document.addEventListener("touchstart", (e) => {
  const touch = e.touches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
});

document.addEventListener("touchend", (e) => {
  const touch = e.changedTouches[0];
  const touchEndX = touch.clientX;
  const touchEndY = touch.clientY;

  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX > 0) {
      move("right");
    } else {
      move("left");
    }
  } else {
    if (deltaY > 0) {
      move("down");
    } else {
      move("up");
    }
  }
});
