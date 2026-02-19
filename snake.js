// ===== Constants and Variables =====
const boardSize = 20;
const gameBoard = document.getElementById("game-board");
const scoreSpan = document.getElementById("score");
const startBtn = document.getElementById("start");
const pauseBtn = document.getElementById("pause");
const resetBtn = document.getElementById("reset");

let snake = [{ x: 10, y: 10 }];
let direction = "RIGHT";
let food = {};
let score = 0;
let intervalId;
let running = false;
let speed = 200; // default speed = Easy
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

// ===== Convert coordinates to index =====
function getIndex(x, y) {
  return y * boardSize + x;
}

// ===== Draw Snake and Food =====
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

  // Check food
  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreSpan.innerText = score;
    spawnFood();
  } else {
    snake.pop();
  }

  draw();
}

// ===== Game Over =====
function gameOver() {
  clearInterval(intervalId);
  running = false;
  alert("Game Over! Press Space to restart.");
}

// ===== Restart Game =====
function restartGame() {
  clearInterval(intervalId);
  snake = [{ x: 10, y: 10 }];
  direction = "RIGHT";
  score = 0;
  scoreSpan.innerText = score;
  running = true;
  spawnFood();
  draw();
  intervalId = setInterval(moveSnake, speed);
}

// ===== Keyboard Controls =====
document.addEventListener("keydown", e => {
  switch (e.key) {
    case "ArrowUp": if (direction !== "DOWN") direction = "UP"; break;
    case "ArrowDown": if (direction !== "UP") direction = "DOWN"; break;
    case "ArrowLeft": if (direction !== "RIGHT") direction = "LEFT"; break;
    case "ArrowRight": if (direction !== "LEFT") direction = "RIGHT"; break;
  }

  // Space = restart after game over
  if (!running && e.code === "Space") {
    restartGame();
  }
});

// ===== Button Controls =====
startBtn.addEventListener("click", () => {
  if (!running) {
    intervalId = setInterval(moveSnake, speed);
    running = true;
  }
});

pauseBtn.addEventListener("click", () => {
  if (running) {
    clearInterval(intervalId);
    running = false;
  }
});

resetBtn.addEventListener("click", restartGame);

// ===== Difficulty Buttons =====
document.getElementById("easy").addEventListener("click", () => setDifficulty("easy"));
document.getElementById("medium").addEventListener("click", () => setDifficulty("medium"));
document.getElementById("hard").addEventListener("click", () => setDifficulty("hard"));

function setDifficulty(level) {
  speed = difficulties[level];
  if (running) {
    clearInterval(intervalId);
    intervalId = setInterval(moveSnake, speed);
  }
}

// ===== Start Game =====
createBoard();
spawnFood();
draw();
setDifficulty("easy"); // default difficulty
