const wolf = document.getElementById('wolf');
const gameArea = document.getElementById('gameArea');
let wolfPosition = 0;

function moveWolf(position) {
    const positions = [
        {x: 50, y: 150}, // left-up
        {x: 50, y: gameArea.clientHeight - 150}, // left-down
        {x: gameArea.clientWidth - 150, y: 150}, // right-up
        {x: gameArea.clientWidth - 150, y: gameArea.clientHeight - 150} // right-down
    ];
    wolf.style.left = positions[position].x + 'px';
    wolf.style.top = positions[position].y + 'px';
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        wolfPosition = (wolfPosition + 1) % 4;
    } else if (e.key === 'ArrowRight') {
        wolfPosition = (wolfPosition + 3) % 4;
    }
    moveWolf(wolfPosition);
});

function spawnObject() {
    const object = document.createElement('div');
    object.classList.add(Math.random() < 0.8 ? 'egg' : 'bomb');
    const position = Math.floor(Math.random() * 4);
    let x, y, dx, dy;

    switch (position) {
        case 0: // top left
            x = 50;
            y = 50;
            dx = 1;
            dy = 1;
            break;
        case 1: // bottom left
            x = 50;
            y = gameArea.clientHeight - 60;
            dx = 1;
            dy = -1;
            break;
        case 2: // top right
            x = gameArea.clientWidth - 100;
            y = 50;
            dx = -1;
            dy = 1;
            break;
        case 3: // bottom right
            x = gameArea.clientWidth - 100;
            y = gameArea.clientHeight - 60;
            dx = -1;
            dy = -1;
            break;
    }

    object.style.left = x + 'px';
    object.style.top = y + 'px';
    gameArea.appendChild(object);

    function moveObject() {
        x += dx;
        y += dy;
        object.style.left = x + 'px';
        object.style.top = y + 'px';

        // Проверка столкновения с волком
        const wolfRect = wolf.getBoundingClientRect();
        const objectRect = object.getBoundingClientRect();
        if (
            objectRect.left < wolfRect.right &&
            objectRect.right > wolfRect.left &&
            objectRect.top < wolfRect.bottom &&
            objectRect.bottom > wolfRect.top
        ) {
            gameArea.removeChild(object);
            // Добавьте логику для увеличения счета или перезапуска игры
        }

        if (
            x < 0 || x > gameArea.clientWidth - object.clientWidth ||
            y < 0 || y > gameArea.clientHeight - object.clientHeight
        ) {
            gameArea.removeChild(object);
        } else {
            requestAnimationFrame(moveObject);
        }
    }

    moveObject();
}

setInterval(spawnObject, 1000);
