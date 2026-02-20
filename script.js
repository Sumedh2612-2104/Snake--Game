// ===== Constants & Variables =====
const boardSize = 20;
const gameBoard = document.getElementById("game-board");
const scoreSpan = document.getElementById("score");
const finalScoreSpan = document.getElementById("final-score");

const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const gameOverScreen = document.getElementById("gameover-screen");

const restartBtn = document.getElementById("restart");

let snake = [];
let direction = "RIGHT";
let food = {};
let score = 0;
let intervalId;
let running = false;
let speed = 200;
const difficulties = { easy: 200, medium: 170, hard: 140 };

// ===== Initialize Board =====
function createBoard() {
  gameBoard.innerHTML = "";
  for (let i = 0; i < boardSize * boardSize; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    gameBoard.appendChild(cell);
  }
}

function getIndex(x, y) {
  return y * boardSize + x;
}

function draw() {
  const cells = document.querySelectorAll(".cell");
  cells.forEach(cell => cell.classList.remove("snake", "food"));

  snake.forEach(segment => {
    cells[getIndex(segment.x, segment.y)].classList.add("snake");
  });

  if (food.x !== undefined && food.y !== undefined) {
    cells[getIndex(food.x, food.y)].classList.add("food");
  }
}

// ===== Spawn Food =====
function spawnFood() {
  let x, y;
  do {
    x = Math.floor(Math.random() * boardSize);
    y = Math.floor(Math.random() * boardSize);
  } while (snake.some(segment => segment.x === x && segment.y === y));
  food = { x, y };
}

// ===== Move Snake =====
function moveSnake() {
  const head = { ...snake[0] };
  switch (direction) {
    case "UP": head.y -= 1; break;
    case "DOWN": head.y += 1; break;
    case "LEFT": head.x -= 1; break;
    case "RIGHT": head.x += 1; break;
  }

  // Check collisions
  if (
    head.x < 0 || head.x >= boardSize ||
    head.y < 0 || head.y >= boardSize ||
    snake.some(segment => segment.x === head.x && segment.y === head.y)
  ) {
    gameOver();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreSpan.innerText = score;
    spawnFood();
  } else {
    snake.pop();
  }

  draw();
}

// ===== Start Game =====
function startGame() {

  clearInterval(intervalId);

  snake = [{ x: 10, y: 10 }];
  direction = "RIGHT";
  score = 0;
  scoreSpan.innerText = score;
  createBoard();
  spawnFood();
  draw();
  running = true;
  intervalId = setInterval(moveSnake, speed);

  // Show game screen
  startScreen.classList.add("hidden");
  gameOverScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
}

// ===== Game Over =====
function gameOver() {
  clearInterval(intervalId);
  running = false;
  finalScoreSpan.innerText = score;

  // Show Game Over screen
  gameScreen.classList.add("hidden");
  gameOverScreen.classList.remove("hidden");
}

// ===== Restart Game =====
function restartGame() {
  startScreen.classList.remove("hidden");
  gameOverScreen.classList.add("hidden");
  gameScreen.classList.add("hidden");
}

// ===== Difficulty Selection =====
document.getElementById("easy").addEventListener("click", () => {
  speed = difficulties.easy; startGame();
});
document.getElementById("medium").addEventListener("click", () => {
  speed = difficulties.medium; startGame();
});
document.getElementById("hard").addEventListener("click", () => {
  speed = difficulties.hard; startGame();
});

// ===== Restart Button =====
restartBtn.addEventListener("click", restartGame);

// ===== Keyboard Controls =====
document.addEventListener("keydown", e => {
  switch (e.key) {
    case "ArrowUp": if (direction !== "DOWN") direction = "UP"; break;
    case "ArrowDown": if (direction !== "UP") direction = "DOWN"; break;
    case "ArrowLeft": if (direction !== "RIGHT") direction = "LEFT"; break;
    case "ArrowRight": if (direction !== "LEFT") direction = "RIGHT"; break;
  }

  // Space to restart after game over
  if (!running && e.code === "Space") restartGame();
});

// ===== Mobile Swipe Controls =====
let startX = 0;
let startY = 0;

document.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener("touchend", e => {
  if (!running) return;

  let endX = e.changedTouches[0].clientX;
  let endY = e.changedTouches[0].clientY;

  let diffX = endX - startX;
  let diffY = endY - startY;

  // Prevent tiny accidental swipes
  if (Math.abs(diffX) < 30 && Math.abs(diffY) < 30) return;

  if (Math.abs(diffX) > Math.abs(diffY)) {
    if (diffX > 0 && direction !== "LEFT") direction = "RIGHT";
    else if (diffX < 0 && direction !== "RIGHT") direction = "LEFT";
  } else {
    if (diffY > 0 && direction !== "UP") direction = "DOWN";
    else if (diffY < 0 && direction !== "DOWN") direction = "UP";
  }
});

// ===== Mobile Swipe Controls ===== 

let startX = 0, startY = 0;

document.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener("touchend", e => {
  if (!running) return;

  let endX = e.changedTouches[0].clientX;
  let endY = e.changedTouches[0].clientY;
  let dx = endX - startX;
  let dy = endY - startY;

  if (Math.abs(dx) < 30 && Math.abs(dy) < 30) return;

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0 && direction !== "LEFT") direction = "RIGHT";
    else if (dx < 0 && direction !== "RIGHT") direction = "LEFT";
  } else {
    if (dy > 0 && direction !== "UP") direction = "DOWN";
    else if (dy < 0 && direction !== "DOWN") direction = "UP";
  }
});