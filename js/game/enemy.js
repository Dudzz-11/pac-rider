const enemyImages = [
    "../assets/img/enemys/cop-down-100.png",
    "../assets/img/enemys/cop-down-100.png",
    "../assets/img/enemys/cop-down-100.png",
    "../assets/img/enemys/cop-down-100.png",
    "../assets/img/enemys/cop-down-100.png"
];

const enemiesSpeed = [3, 3.25, 3.5, 3.75, 4, 4.25];

const enemiesAvailableDirections = [];

const enemys = [];

const emptyCellsEnemy = [];

const enemiesCollisionDirections = {
    enemy1: { up: false, right: false, down: false, left: false },
    enemy2: { up: false, right: false, down: false, left: false },
    enemy3: { up: false, right: false, down: false, left: false },
    enemy4: { up: false, right: false, down: false, left: false },
    enemy5: { up: false, right: false, down: false, left: false }
};

for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        const cell = map[row][col];

        if (cell.type === "wall") continue;
        if (cell.type === "collectible") continue;
        if (cell.type === "enemy") continue;

        if (row === 5 && col === 7) continue;
        if (row === 0 && col === 15) continue;

        if (getDistance(cell, map[5][7]) < 6) continue;

        emptyCellsEnemy.push(cell);
    };
};

emptyCellsEnemy.sort(() => Math.random() - 0.5);


for (let i = 0; i < enemyImages.length; i++) {
    const cell = emptyCellsEnemy[i];
    const enemy = document.createElement("img");

    enemy.id = "enemy" + (i + 1);
    enemy.src = enemyImages[i];
    enemy.style.width = "100px";
    enemy.style.height = "100px";
    enemy.style.position = "absolute";

    game.appendChild(enemy);

    const startX = cell.x * cellSize;
    const startY = cell.y * cellSize;
    enemy.style.left = startX + "px";
    enemy.style.top = startY + "px";

    cell.type = "enemy";

    enemys.push({
        element: enemy,
        originX: startX,
        originY: startY,
        state: "wandering"
    });
};

function updateEnemies() {
    enemys.forEach((enemy, i) => {
        let enemyLeftValue = textPositionToNumber(enemy.element.style.left);
        let enemyTopValue = textPositionToNumber(enemy.element.style.top);
        let moveX = 0;
        let moveY = 0;
        let speed = enemiesSpeed[i];

        const playerX = textPositionToNumber(player.style.left);
        const playerY = textPositionToNumber(player.style.top);

        let xDirection = undefined;

        if (playerX >= enemyLeftValue + 5) {
            moveX = speed;
            xDirection = "right";
            enemy.element.src = "assets/img/enemys/cop-right-100.png";

        } else if (playerX <= enemyLeftValue - 5) {
            moveX = -speed;
            xDirection = "left";
            enemy.element.src = "assets/img/enemys/cop-left-100.png";
        }

        // if (enemiesCollisionDirections["enemy" + (i + 1)][xDirection]) {
        if (isCollidingWithWall (enemy.element, xDirection, speed)) {
            enemy.element.style.left = (enemyLeftValue + (moveX * -1)) + "px";
            enemiesCollisionDirections["enemy" + (i + 1)][xDirection] = false;
        } else {
            enemy.element.style.left = (enemyLeftValue + moveX) + "px";
        }

        if (isCollidingWithWall(enemy.element) || isOutOfBounds(enemy.element)) {
            enemy.element.style.left = enemyLeftValue + "px";
            enemiesCollisionDirections["enemy" + (i + 1)][xDirection] = true;
        }

        let yDirection = undefined;

        if (playerY >= enemyTopValue + 5) {
            moveY = speed;
            yDirection = "down";
            enemy.element.src = "assets/img/enemys/cop-down-100.png";

        } else if (playerY < enemyTopValue - 5) {
            moveY = -speed;
            yDirection = "up";
            enemy.element.src = "assets/img/enemys/cop-up-100.png";
        }

        // if (enemiesCollisionDirections["enemy" + (i + 1)][xDirection]) {
        if (isCollidingWithWall (enemy.element, yDirection, speed)) {
            enemy.element.style.top = (enemyTopValue + (moveY * -1)) + "px";
            enemiesCollisionDirections["enemy" + (i + 1)][yDirection] = false;
        } else {
            enemy.element.style.top = (enemyTopValue + moveY) + "px";
        }

        if (isCollidingWithWall(enemy.element) || isOutOfBounds(enemy.element)) {
            enemy.element.style.top = enemyTopValue + "px";
            enemiesCollisionDirections["enemy" + (i + 1)][yDirection] = true;
        }
    });
};



function resetAllEnemies() {
    enemys.forEach(enemy => {

        map[enemy.row][enemy.col].type = null;

        enemy.row = enemy.originRow;
        enemy.col = enemy.originCol;

        map[enemy.row][enemy.col].type = "enemy";

        map[enemy.row][enemy.col].element.appendChild(enemy.element);
    });
};

function takeDamage() {
    if (isInvincible) return;

    if (lives === 0) {
        gameOver();
    } else {
        lives--;
        if (livesText) livesText.innerText = lives;

        resetPlayerPosition();
        resetAllEnemies();
        triggerInvincibility();
    }
};

//usar clone pra verificar se vou bater