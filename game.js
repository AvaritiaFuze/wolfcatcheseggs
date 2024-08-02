const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const wolfLeftImg = new Image();
wolfLeftImg.src = 'wolf_left.png';

const wolfRightImg = new Image();
wolfRightImg.src = 'wolf_right.png';

const eggImg = new Image();
eggImg.src = 'egg.png';

const bombImg = new Image();
bombImg.src = 'bomb.png';

const beamImg = new Image();
beamImg.src = 'beam.png'; // Убедитесь, что путь к изображению правильный

let wolf = {
    x: 0,
    y: canvas.height - 100,
    width: 100,
    height: 100,
    position: 0 // 0 - left-up, 1 - left-down, 2 - right-up, 3 - right-down
};

let objects = [];
let beams = [
    {img: beamImg, x: 70, y: 70, width: 300, height: 10, angle: 45}, // top left
    {img: beamImg, x: canvas.width - 370, y: 70, width: 300, height: 10, angle: -45}, // top right
    {img: beamImg, x: 70, y: canvas.height - 70, width: 300, height: 10, angle: -45}, // bottom left
    {img: beamImg, x: canvas.width - 370, y: canvas.height - 70, width: 300, height: 10, angle: 45} // bottom right
];
let score = 0;
let gameInterval;
let objectInterval;
let speed = 2;
let maxSpeed = 5;

function drawWolf() {
    let wolfImage = wolf.position < 2 ? wolfLeftImg : wolfRightImg;
    ctx.drawImage(wolfImage, wolf.x, wolf.y, wolf.width, wolf.height);
}

function drawObjects() {
    objects.forEach(object => {
        let img = object.type === 'egg' ? eggImg : bombImg;
        ctx.drawImage(img, object.x - object.radius, object.y - object.radius, object.radius * 2, object.radius * 2);
    });
}

function drawBeams() {
    beams.forEach(beam => {
        ctx.save();
        ctx.translate(beam.x + beam.width / 2, beam.y + beam.height / 2); // Перемещаем начало координат в центр балки
        ctx.rotate(beam.angle * Math.PI / 180); // Поворачиваем систему координат на угол балки
        ctx.drawImage(beam.img, -beam.width / 2, -beam.height / 2, beam.width, beam.height); // Рисуем балку, центрируя ее
        ctx.restore();
    });
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBeams();
    drawWolf();
    drawObjects();
    moveObjects();
    checkCollisions();
}

function moveWolf() {
    const positions = [
        {x: 70, y: 200}, // left-up
        {x: 70, y: canvas.height - 200}, // left-down
        {x: canvas.width - 150, y: 200}, // right-up
        {x: canvas.width - 150, y: canvas.height - 200} // right-down
    ];
    wolf.x = positions[wolf.position].x;
    wolf.y = positions[wolf.position].y;
}

function moveObjects() {
    objects.forEach(object => {
        object.x += object.dx;
        object.y += object.dy;
    });
}

function checkCollisions() {
    objects.forEach((object, index) => {
        if (object.y + object.radius > wolf.y &&
            object.x > wolf.x &&
            object.x < wolf.x + wolf.width) {
            if (object.type === 'egg') {
                score++;
                document.getElementById('score').textContent = `Score: ${score}`;
            } else {
                resetGame();
            }
            objects.splice(index, 1);
        } else if (object.y + object.radius > canvas.height ||
                   object.x + object.radius > canvas.width ||
                   object.x - object.radius < 0) {
            objects.splice(index, 1);
        }
    });
}

function spawnObject() {
    const position = Math.floor(Math.random() * 4);
    let x, y, dx, dy;

    switch (position) {
        case 0: // top left
            x = 70;
            y = 70;
            dx = speed / Math.sqrt(2);
            dy = speed / Math.sqrt(2);
            break;
        case 1: // bottom left
            x = 70;
            y = canvas.height - 70;
            dx = speed / Math.sqrt(2);
            dy = -speed / Math.sqrt(2);
            break;
        case 2: // top right
            x = canvas.width - 370;
            y = 70;
            dx = -speed / Math.sqrt(2);
            dy = speed / Math.sqrt(2);
            break;
        case 3: // bottom right
            x = canvas.width - 370;
            y = canvas.height - 70;
            dx = -speed / Math.sqrt(2);
            dy = -speed / Math.sqrt(2);
            break;
    }

    const object = {
        x: x,
        y: y,
        radius: 10,
        dx: dx,
        dy: dy,
        type: Math.random() < 0.8 ? 'egg' : 'bomb'
    };
    objects.push(object);
}

function startGame() {
    score = 0;
    document.getElementById('score').textContent = `Score: ${score}`;
    objects = [];
    gameInterval = setInterval(update, 20);
    objectInterval = setInterval(spawnObject, 1000);
    setInterval(() => {
        if (speed < maxSpeed) {
            speed += 0.1;
        }
    }, 5000);
}

function resetGame() {
    clearInterval(gameInterval);
    clearInterval(objectInterval);
    speed = 2;
    startGame();
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
