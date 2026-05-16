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
    enemy.style.width = "80px";
    enemy.style.height = "80px";
    enemy.style.position = "absolute";

    game.appendChild(enemy);

    const startX = cell.x * cellSize + 10;
    const startY = cell.y * cellSize + 10;
    enemy.style.left = startX + "px";
    enemy.style.top = startY + "px";

    cell.type = "enemy";

    enemys.push({
        element: enemy,
        originX: startX,
        originY: startY,
        state: "wandering",
        slideX: 0,
        slideY: 0,
        slideXRemaining: 0,
        slideYRemaining: 0
    });
};

function wouldHitOutOfBounds(element, direction, speed) {
    const elementRect = element.getBoundingClientRect();
    const gameRect = game.getBoundingClientRect();

    switch (direction) {
        case "up":    return elementRect.top - speed < gameRect.top;
        case "down":  return elementRect.bottom + speed > gameRect.bottom;
        case "left":  return elementRect.left - speed < gameRect.left;
        case "right": return elementRect.right + speed > gameRect.right;
    }
    return false;
};

function isPathBlocked(element, direction, speed) {
    return isCollidingWithWall(element, direction, speed) || wouldHitOutOfBounds(element, direction, speed);
};

function updateEnemies() {
    if (isGameOver) return;
    enemys.forEach((enemy, enemyIndex) => {
        const enemyElement = enemy.element;
        const enemyX = textPositionToNumber(enemyElement.style.left);
        const enemyY = textPositionToNumber(enemyElement.style.top);
        const speed = enemiesSpeed[enemyIndex];

        const playerX = textPositionToNumber(player.style.left);
        const playerY = textPositionToNumber(player.style.top);

        let chaseDx = 0, chaseDy = 0;
        let chaseXDirection, chaseYDirection;

        if (playerX >= enemyX + 5)      { chaseDx = speed;  chaseXDirection = "right"; }
        else if (playerX <= enemyX - 5) { chaseDx = -speed; chaseXDirection = "left"; }

        if (playerY >= enemyY + 5)      { chaseDy = speed;  chaseYDirection = "down"; }
        else if (playerY <= enemyY - 5) { chaseDy = -speed; chaseYDirection = "up"; }

        const xChaseBlocked = chaseXDirection ? isPathBlocked(enemyElement, chaseXDirection, speed) : false;
        const yChaseBlocked = chaseYDirection ? isPathBlocked(enemyElement, chaseYDirection, speed) : false;

        let moveDx = 0, moveDy = 0;

        if (chaseXDirection && !xChaseBlocked) moveDx = chaseDx;
        if (chaseYDirection && !yChaseBlocked) moveDy = chaseDy;

        // Slide vertical com commitment quando X está bloqueado
        const currentSlideYDirection = enemy.slideY > 0 ? "down" : "up";
        const slideYStillValid = enemy.slideY !== 0 && !isPathBlocked(enemyElement, currentSlideYDirection, speed);

        if (xChaseBlocked && chaseXDirection) {
            if (!slideYStillValid) {
                // Pick com lookahead de uma célula: prefere direção com mais espaço livre
                const hasUpClearance   = !isPathBlocked(enemyElement, "up",   cellSize);
                const hasDownClearance = !isPathBlocked(enemyElement, "down", cellSize);
                if      (hasUpClearance && hasDownClearance) enemy.slideY = playerY <= enemyY ? -speed : speed;
                else if (hasUpClearance)                     enemy.slideY = -speed;
                else if (hasDownClearance)                   enemy.slideY =  speed;
                else {
                    // Sem clearance de uma célula, fallback ao check imediato
                    const canMoveUp   = !isPathBlocked(enemyElement, "up",   speed);
                    const canMoveDown = !isPathBlocked(enemyElement, "down", speed);
                    if      (canMoveUp && canMoveDown) enemy.slideY = playerY <= enemyY ? -speed : speed;
                    else if (canMoveUp)                enemy.slideY = -speed;
                    else if (canMoveDown)              enemy.slideY =  speed;
                    else                               enemy.slideY = 0;
                }
                enemy.slideYRemaining = enemy.slideY !== 0 ? cellSize : 0;
            }
            moveDy = enemy.slideY;
            if (enemy.slideY !== 0) enemy.slideYRemaining -= Math.abs(speed);
        } else if (enemy.slideY !== 0 && enemy.slideYRemaining > 0 && slideYStillValid) {
            // Commitment: continua slide mesmo após X liberar, para passar da quina
            moveDy = enemy.slideY;
            enemy.slideYRemaining -= Math.abs(speed);
        } else {
            enemy.slideY = 0;
            enemy.slideYRemaining = 0;
        }

        // Slide horizontal com commitment quando Y está bloqueado e X natural não funciona
        const currentSlideXDirection = enemy.slideX > 0 ? "right" : "left";
        const slideXStillValid = enemy.slideX !== 0 && !isPathBlocked(enemyElement, currentSlideXDirection, speed);

        if (yChaseBlocked && chaseYDirection && moveDx === 0) {
            if (!slideXStillValid) {
                const hasLeftClearance  = !isPathBlocked(enemyElement, "left",  cellSize);
                const hasRightClearance = !isPathBlocked(enemyElement, "right", cellSize);
                if      (hasLeftClearance && hasRightClearance) enemy.slideX = playerX <= enemyX ? -speed : speed;
                else if (hasRightClearance)                     enemy.slideX =  speed;
                else if (hasLeftClearance)                      enemy.slideX = -speed;
                else {
                    const canMoveLeft  = !isPathBlocked(enemyElement, "left",  speed);
                    const canMoveRight = !isPathBlocked(enemyElement, "right", speed);
                    if      (canMoveLeft && canMoveRight) enemy.slideX = playerX <= enemyX ? -speed : speed;
                    else if (canMoveRight)                enemy.slideX =  speed;
                    else if (canMoveLeft)                 enemy.slideX = -speed;
                    else                                  enemy.slideX = 0;
                }
                enemy.slideXRemaining = enemy.slideX !== 0 ? cellSize : 0;
            }
            moveDx = enemy.slideX;
            if (enemy.slideX !== 0) enemy.slideXRemaining -= Math.abs(speed);
        } else if (enemy.slideX !== 0 && enemy.slideXRemaining > 0 && slideXStillValid && moveDx === 0) {
            moveDx = enemy.slideX;
            enemy.slideXRemaining -= Math.abs(speed);
        } else {
            enemy.slideX = 0;
            enemy.slideXRemaining = 0;
        }

        // Tenta diagonal; se colidir, tenta só X, depois só Y (corner sliding)
        const intendedX = enemyX + moveDx;
        const intendedY = enemyY + moveDy;

        let actualDx = moveDx;
        let actualDy = moveDy;

        enemyElement.style.left = intendedX + "px";
        enemyElement.style.top  = intendedY + "px";

        if (isCollidingWithWall(enemyElement) || isOutOfBounds(enemyElement)) {
            // Diagonal falhou: tenta só X
            enemyElement.style.left = intendedX + "px";
            enemyElement.style.top  = enemyY + "px";
            if (moveDx !== 0 && !isCollidingWithWall(enemyElement) && !isOutOfBounds(enemyElement)) {
                actualDy = 0;
            } else {
                // Tenta só Y
                enemyElement.style.left = enemyX + "px";
                enemyElement.style.top  = intendedY + "px";
                if (moveDy !== 0 && !isCollidingWithWall(enemyElement) && !isOutOfBounds(enemyElement)) {
                    actualDx = 0;
                } else {
                    // Nada deu: reverte tudo e invalida slides
                    enemyElement.style.left = enemyX + "px";
                    enemyElement.style.top  = enemyY + "px";
                    enemy.slideX = 0;
                    enemy.slideY = 0;
                    enemy.slideXRemaining = 0;
                    enemy.slideYRemaining = 0;
                    return;
                }
            }
        }

        // Sprite reflete o movimento que de fato aconteceu
        if      (actualDx > 0) enemyElement.src = "assets/img/enemys/cop-right-100.png";
        else if (actualDx < 0) enemyElement.src = "assets/img/enemys/cop-left-100.png";
        else if (actualDy > 0) enemyElement.src = "assets/img/enemys/cop-down-100.png";
        else if (actualDy < 0) enemyElement.src = "assets/img/enemys/cop-up-100.png";
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