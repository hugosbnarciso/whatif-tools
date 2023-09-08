let canvas;
let canvasContext;
let boxSize = 20;
let gridSize = 20;
let snake = [{ x: 0, y: 0 }];
let food = { x: 0, y: 0 };
let dx = boxSize;
let dy = 0;
let points = 0;
let gameOver = false;
let gameInterval;
let intervalTime = 200; // Starting interval time
let canvasSelected = false;

window.onload = function () {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');
    document.addEventListener('keydown', keyDownHandler);
    document.getElementById('newGameBtn').addEventListener('click', newGame);
    fetch('/highscores')
    .then(response => response.json())
    .then(data => {
        displayHighScores(data.high_scores);
    });
    canvas.addEventListener('click', function() {
        canvasSelected = true;
    });
    document.addEventListener('click', function(event) {
        if (event.target !== canvas) {
            canvasSelected = false;
        }
    });
    
};
function displayHighScores(highScores) {
    let highScoresList = document.getElementById('highScoresList');
    highScoresList.innerHTML = highScores.map(score => `<li>${score.name}: ${score.score}</li>`).join('');
}

function newGame() {
    console.log('newGame called')
    snake = [{ x: 0, y: 0 }];
    dx = boxSize;
    dy = 0;
    points = 0;
    gameOver = false;
    document.getElementById('points').innerText = `Points: ${points}`;
    placeFood();
    clearInterval(gameInterval); // Clear existing interval
    intervalTime = 200; // Reset to initial speed
    gameInterval = setInterval(updateGame, intervalTime); // Start new interval
}

function updateGame() {
    if (!gameOver) {
        moveSnake();
        checkCollision();
        checkFood();
        drawGame();
    }
}

function keyDownHandler(event) {
    if (!canvasSelected) return;

    switch (event.keyCode) {
        case 37:
            dx = -boxSize; dy = 0;
            event.preventDefault();
            break;
        case 38:
            dx = 0; dy = -boxSize;
            event.preventDefault();
            break;
        case 39:
            dx = boxSize; dy = 0;
            event.preventDefault();
            break;
        case 40:
            dx = 0; dy = boxSize;
            event.preventDefault();
            break;
    }
}

function moveSnake() {
    let head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
}

function checkCollision() {
    // Check wall collision
    if (snake[0].x < 0 || snake[0].x >= canvas.width || snake[0].y < 0 || snake[0].y >= canvas.height) {
        gameOver = true;
    }
    
    // Check self-collision
    for(let i = 1; i < snake.length; i++) {
        if(snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            gameOver = true;
            break;
        }
    }

    if (gameOver) {
        let playerName = document.getElementById('playerName').value || "Anonymous";
        fetch('/highscores', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: playerName, score: points })
        }).then(response => response.json())
          .then(data => {
              if (data.status === 'success') {
                  displayHighScores(data.high_scores);
              }
          });
    }
}

function checkFood() {
    if (snake[0].x === food.x && snake[0].y === food.y) {
        placeFood();
        points++;
        document.getElementById('points').innerText = `Points: ${points}`; // Update this line
        clearInterval(gameInterval); // Clear existing interval
        intervalTime--; // Decrease interval time by 1ms
        console.log(`Interval updated to ${intervalTime} ms`);  // Add this line
        gameInterval = setInterval(updateGame, intervalTime); // Start new interval

    } else {
        snake.pop();
    }
}

function placeFood() {
    food.x = Math.floor(Math.random() * gridSize) * boxSize;
    food.y = Math.floor(Math.random() * gridSize) * boxSize;
}

function drawGame() {
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < snake.length; i++) {
        canvasContext.fillStyle = i === 0 ? '#00FF00' : '#FFFFFF';
        canvasContext.fillRect(snake[i].x, snake[i].y, boxSize, boxSize);
    }
    canvasContext.fillStyle = '#FF0000';
    canvasContext.fillRect(food.x, food.y, boxSize, boxSize);
}
