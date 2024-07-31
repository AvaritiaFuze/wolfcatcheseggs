const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let wolf = {
    x: canvas.width / 2 - 50,
    y: canvas.height - 100,
    width: 100,
    height: 100,
    dx: 0
};

let eggs = [];
let score = 0;
let gameInterval;
let eggInterval;

function drawWolf() {
    ctx.fillStyle = 'gray';
    ctx.fillRect(wolf.x, wolf.y, wolf.width, wolf.height);
}

function drawEggs() {
    eggs.forEach(egg => {
        ctx.beginPath();
        ctx.arc(egg.x, egg.y, egg.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.closePath();
    });
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawWolf();
    drawEggs();
    moveWolf();
    moveEggs();
    checkCollisions();
}

function moveWolf() {
    wolf.x += wolf.dx;
    if (wolf.x < 0) wolf.x = 0;
    if (wolf.x + wolf.width > canvas.width) wolf.x = canvas.width - wolf.width;
}

function moveEggs() {
    eggs.forEach(egg => {
        egg.y += egg.dy;
    });
}

function checkCollisions() {
    eggs.forEach((egg, index) => {
        if (egg.y + egg.radius > wolf.y &&
            egg.x > wolf.x &&
            egg.x < wolf.x + wolf.width) {
            score++;
            document.getElementById('score').textContent = `Score: ${score}`;
            eggs.splice(index, 1);
        } else if (egg.y + egg.radius > canvas.height) {
            eggs.splice(index, 1);
        }
    });
}

function spawnEgg() {
    const egg = {
        x: Math.random() * (canvas.width - 20) + 10,
        y: 0,
        radius: 10,
        dy: 2
    };
    eggs.push(egg);
}

function startGame() {
    score = 0;
    document.getElementById('score').textContent = `Score: ${score}`;
    eggs = [];
    gameInterval = setInterval(update, 20);
    eggInterval = setInterval(spawnEgg, 1000);
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        wolf.dx = -5;
    } else if (e.key === 'ArrowRight') {
        wolf.dx = 5;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        wolf.dx = 0;
    }
});

startGame();