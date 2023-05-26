'use strict';
const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

const box = 30;

const smallerDimension = Math.min(window.innerWidth, window.innerHeight);
const canvasSize = Math.floor(smallerDimension / box);


canvas.width = box * canvasSize;
canvas.height = box * canvasSize;

let score = 0;

let snake = [];
snake[0] = { x: Math.floor(canvasSize / 2) * box, y: Math.floor(canvasSize / 2) * box };

let food = {
    x: Math.floor(Math.random() * canvas.width / box) * box,
    y: Math.floor(Math.random() * canvas.height / box) * box
};

let d;

document.addEventListener('keydown', direction);

function direction(event) {
    if (event.keyCode == 37 && d != 'RIGHT') {
        d = 'LEFT';
    } else if (event.keyCode == 38 && d != 'DOWN') {
        d = 'UP';
    } else if (event.keyCode == 39 && d != 'LEFT') {
        d = 'RIGHT';
    } else if (event.keyCode == 40 && d != 'UP') {
        d = 'DOWN';
    }
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        context.fillStyle = (i === 0) ? '#F0DB4F' : '#F4E04D';
        context.fillRect(snake[i].x, snake[i].y, box, box);

        context.strokeStyle = '#B5DE48';
        context.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    context.fillStyle = '#E74C3C';
    context.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (d === 'LEFT') snakeX -= box;
    if (d === 'UP') snakeY -= box;
    if (d === 'RIGHT') snakeX += box;
    if (d === 'DOWN') snakeY += box;

    if (snakeX === food.x && snakeY === food.y) {
        score++;
        food = {
            x: Math.floor(Math.random() * canvas.width / box) * box,
            y: Math.floor(Math.random() * canvas.height / box) * box
        };
    } else {
        snake.pop();
    }

    const newHead = { x: snakeX, y: snakeY };

    if (snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height || collision(newHead, snake)) {
        clearInterval(game);
    }

    snake.unshift(newHead);

    context.fillStyle = '#F0DB4F';
    context.font = '20px Arial';
    context.fillText('Score: ' + score, 2 * box, 1.6 * box);
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

let game = setInterval(draw, 150);

const upButton = document.getElementById('up');
const downButton = document.getElementById('down');
const leftButton = document.getElementById('left');
const rightButton = document.getElementById('right');
const pauseButton = document.getElementById('pause');

upButton.addEventListener('click', () => {
    if (d !== 'DOWN') {
        d = 'UP';
    }
});
downButton.addEventListener('click', () => {
    if (d !== 'UP') {
        d = 'DOWN';
    }
});
leftButton.addEventListener('click', () => {
    if (d !== 'RIGHT') {
        d = 'LEFT';
    }
});
rightButton.addEventListener('click', () => {
    if (d !== 'LEFT') {
        d = 'RIGHT';
    }
});

let gamePaused = false;
pauseButton.addEventListener('click', () => {
    gamePaused = !gamePaused;
    if (gamePaused) {
        clearInterval(game);
    } else {
        game = setInterval(draw, 150);
    }
});
