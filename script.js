const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("startButton");
const pauseButton = document.getElementById("pauseButton");
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("highScore");

const box = 20;
let snake, direction, food, game, score, isPaused = false;

const themeToggle = document.getElementById("themeToggle");

document.addEventListener("DOMContentLoaded", () => {
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "minimalist") {
document.body.classList.add("minimalist");
}
});

themeToggle.addEventListener("click", () => {
document.body.classList.toggle("minimalist");
localStorage.setItem("theme", document.body.classList.contains("minimalist") ? "minimalist" : "neon");
});


highScore = localStorage.getItem("highScore") ? parseInt(localStorage.getItem("highScore")) : 0;
highScoreDisplay.textContent = highScore;

function initGame() {
    clearInterval(game);
    snake = [{ x: 10 * box, y: 10 * box }];
    direction = "RIGHT";
    food = { 
        x: Math.floor(Math.random() * 20) * box, 
        y: Math.floor(Math.random() * 20) * box 
    };
    score = 0;
    scoreDisplay.textContent = score;
    pauseButton.style.display = "inline";
    isPaused = false;
    pauseButton.textContent = "Szünet";
    game = setInterval(draw, 100);
}

document.addEventListener("keydown", changeDirection);

startButton.addEventListener("click", () => {
    initGame();
    startButton.textContent = "Újrakezdés";
});

pauseButton.addEventListener("click", () => {
    if (isPaused) {
        game = setInterval(draw, 100);
        pauseButton.textContent = "Szünet";
    } else {
        clearInterval(game);
        pauseButton.textContent = "Folytatás";
    }
    isPaused = !isPaused;
});

function changeDirection(event) {
    if ((event.key === "ArrowUp" || event.key === "w") && direction !== "DOWN") direction = "UP";
    else if ((event.key === "ArrowDown"|| event.key === "s") && direction !== "UP") direction = "DOWN";
    else if ((event.key === "ArrowLeft" || event.key === "a")&& direction !== "RIGHT") direction = "LEFT";
    else if ((event.key === "ArrowRight" || event.key === "d")&& direction !== "LEFT") direction = "RIGHT";
}

function draw() {
    const isNeonTheme = document.body.classList.contains("minimalist") === false;

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.shadowColor = "rgba(255, 255, 255, 0.7)";
    ctx.shadowBlur = 10;

    ctx.fillStyle = isNeonTheme ? "#ce363c" : "#ffffff"; 
    ctx.beginPath();
    ctx.arc(food.x + box / 2, food.y + box / 3, box / 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

    ctx.fillStyle = isNeonTheme ? "#00ff00" : "#ffffff";
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, box, box);
    });

    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    
    let newHead = { x: snake[0].x, y: snake[0].y };
    if (direction === "UP") newHead.y -= box;
    if (direction === "DOWN") newHead.y += box;
    if (direction === "LEFT") newHead.x -= box;
    if (direction === "RIGHT") newHead.x += box;
    
    if (newHead.x === food.x && newHead.y === food.y) {
        food = { 
            x: Math.floor(Math.random() * 20) * box, 
            y: Math.floor(Math.random() * 20) * box 
        };
        score++;
        scoreDisplay.textContent = score;
    } else {
        snake.pop();
    }
    
    if (newHead.x < 0 || newHead.x >= canvas.width || 
        newHead.y < 0 || newHead.y >= canvas.height ||
        snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        clearInterval(game);
        pauseButton.style.display = "block";

        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore);
            highScoreDisplay.textContent = highScore;
        }

        return;
    }
    
    snake.unshift(newHead);
}