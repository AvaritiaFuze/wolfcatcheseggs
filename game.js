const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const wolfLeftImg = new Image();
wolfLeftImg.src = 'wolf_left.png';

const wolfRightImg = new Image();
wolfRightImg.src = 'wolf_right.png';

const eggImg = new Image();
eggImg.src = 'egg.png';

let wolf = {
    x: canvas.width / 2 - 50,
    y: canvas.height - 100,
    width: 100,
    height: 100,
    position: 0 // 0 - left-up, 1 - left-down, 2 - right-up, 3 - right-down
};

let eggs = [];
let score = 0;
let gameInterval;
let eggInterval;

function drawWolf() {
    let wolfImage = wolf.position < 2 ? wolfLeftImg : wolfRightImg;
    ctx.drawImage(wolfImage, wolf.x, wolf.y, wolf.width, wolf.height);
}

function drawEggs() {
    eggs.forEach(egg => {
        ctx.drawImage(eggImg, egg.x - egg.radius, egg.y - egg.radius, egg.radius * 2, egg.radius * 2);
    });
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawWolf();
    drawEggs();
    moveEggs();
    checkCollisions();
}

function moveWolf() {
    switch (wolf.position) {
        case 0:
            wolf.x = canvas.width / 4 - wolf.width / 2;
            wolf.y = canvas.height / 4 - wolf.height / 2;
            break;
        case 1:
            wolf.x = canvas.width / 4 - wolf.width / 2;
            wolf.y = 3 * canvas.height / 4 - wolf.height / 2;
            break;
        case 2:
            wolf.x = 3 * canvas.width / 4 - wolf.width / 2;
            wolf.y = canvas.height / 4 - wolf.height / 2;
            break;
        case 3:
            wolf.x = 3 * canvas.width / 4 - wolf.width / 2;
            wolf.y = 3 * canvas.height / 4 - wolf.height / 2;
            break;
    }
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
        x: Math.random() < 0.5 ? canvas.width / 4 : 3 * canvas.width / 4,
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

// Обработка сенсоров устройства
window.addEventListener('deviceorientation', (event) => {
    if (event.gamma !== null) {
        if (event.gamma < -15) {
            wolf.position = 0; // left-up
        } else if (event.gamma > 15) {
            wolf.position = 2; // right-up
        } else if (event.beta > 45) {
            wolf.position = 3; // right-down
        } else if (event.beta < -45) {
            wolf.position = 1; // left-down
        }
        moveWolf();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        wolf.position = (wolf.position + 1) % 4;
    } else if (e.key === 'ArrowRight') {
        wolf.position = (wolf.position + 3) % 4;
    }
    moveWolf();
});

startGame();