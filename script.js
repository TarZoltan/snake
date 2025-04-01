const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const restartButton = document.getElementById("restartButton");
const scoreDisplay = document.getElementById("score");

const box = 20;
let snake, direction, food, game, score;

function initGame() {
    snake = [{ x: 10 * box, y: 10 * box }];
    direction = "RIGHT";
    food = { 
        x: Math.floor(Math.random() * 20) * box, 
        y: Math.floor(Math.random() * 20) * box 
    };
    score = 0;
    scoreDisplay.textContent = score;
    restartButton.style.display = "none";
    game = setInterval(draw, 100);
}

document.addEventListener("keydown", changeDirection);
restartButton.addEventListener("click", initGame);

function changeDirection(event) {
    if ((event.key === "ArrowUp" || event.key === "w") && direction !== "DOWN") direction = "UP";
    else if ((event.key === "ArrowDown"|| event.key === "s") && direction !== "UP") direction = "DOWN";
    else if ((event.key === "ArrowLeft" || event.key === "a")&& direction !== "RIGHT") direction = "LEFT";
    else if ((event.key === "ArrowRight" || event.key === "d")&& direction !== "LEFT") direction = "RIGHT";
}

function draw() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);
    
    ctx.fillStyle = "green";
    snake.forEach(segment => ctx.fillRect(segment.x, segment.y, box, box));
    
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
        restartButton.style.display = "block";
        return;
    }
    
    snake.unshift(newHead);
}

initGame();