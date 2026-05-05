const enemyImages = [
    "../assets/img/enemys/cop-down-100.png",
    "../assets/img/enemys/cop-down-100.png",
    "../assets/img/enemys/cop-down-100.png",
    "../assets/img/enemys/cop-down-100.png",
    "../assets/img/enemys/cop-down-100.png"
];

const enemiesAvailableDirections = [];

const enemys = [];

const emptyCellsEnemy = [];

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
    enemys.forEach(enemy => {
        let enemyX = textPositionToNumber(enemy.element.style.left);
        let enemyY = textPositionToNumber(enemy.element.style.top);
        let moveX = 0;
        let moveY = 0;
        let speed = 5;

        const playerX = textPositionToNumber(player.style.left);
        const playerY = textPositionToNumber(player.style.top);


        if (playerX > enemyX + 5) moveX = speed;
        else if (playerX < enemyX - 5) moveX = -speed;

        enemy.element.style.left = (enemyX + moveX) + "px";

        if (isCollidingWithWall(enemy.element) || isOutOfBounds(enemy.element)) {
            enemy.element.style.left = enemyX + "px";

            if (Math.abs(playerY - enemyY) < speed) {
                moveY = speed;
            }
            moveX = 0;
        }

        if (moveY === 0) {
            if (playerY > enemyY + 5) moveY = speed;
            else if (playerY < enemyY - 5) moveY = -speed;
        }

        enemy.element.style.top = (enemyY + moveY) + "px";

        if (isCollidingWithWall(enemy.element) || isOutOfBounds(enemy.element)) {
            enemy.element.style.top = enemyY + "px";

            if (moveX === 0 && Math.abs(playerX - enemyX) < speed) {
                moveX = speed;
                enemy.element.style.left = (enemyX + moveX) + "px";
                if (isCollidingWithWall(enemy.element)) {
                    enemy.element.style.left = (enemyX - moveX) + "px";
                }
            }
            moveY = 0;
        }

        if (moveX > 0) enemy.element.src = "assets/img/enemys/cop-right-100.png";
        else if (moveX < 0) enemy.element.src = "assets/img/enemys/cop-left-100.png";
        else if (moveY > 0) enemy.element.src = "assets/img/enemys/cop-down-100.png";
        else if (moveY < 0) enemy.element.src = "assets/img/enemys/cop-up-100.png";
    });
};

// function updateEnemies() {
//     enemys.forEach(enemy => {
//         let enemyX = textPositionToNumber(enemy.element.style.left);
//         let enemyY = textPositionToNumber(enemy.element.style.top);

//         let moveX = 0;
//         let moveY = 0;
//         let speed = 4;

//         const playerX = textPositionToNumber(player.style.left);
//         const playerY = textPositionToNumber(player.style.top);

//         let enemyAvailableDirections = undefined;

//         const filteredDirections = enemiesAvailableDirections.filter((enemyDirectionsItem) => { 
//             return enemyDirectionsItem.enemyId == enemy.id
//         });

//         if (filteredDirections.length > 0) {
//             enemyAvailableDirections = filteredDirections[0]
//         } else {
//             enemyAvailableDirections = {
//                 enemyId: enemy.id,
//                 top: true,
//                 right: true,
//                 bottom: true,
//                 left: true
//             }
//         };

//         let enemyXDirection = undefined

//         if (playerX > enemyX) {
//             moveX = speed;
//             enemyXDirection = "right"
//         } else {
//             moveX = -speed;
//             enemyXDirection = "left"
//         }
//         enemy.element.style.left = (enemyX + moveX) + "px";

//         if (isCollidingWithWall(enemy.element) || isOutOfBounds(enemy.element)) {
//             enemy.element.style.left = enemyX + "px";
//             if (enemyXDirection == "right") enemyAvailableDirections.right = false
//             else enemyAvailableDirections.left = false
//         };

//         let enemyYDirection = undefined

//         if (playerY > enemyY) {
//             moveY = speed;
//             enemyYDirection = "top"
//         } else {
//             moveY = -speed;
//             enemyYDirection = "bottom"
//         }
//         enemy.element.style.top = (enemyY + moveY) + "px";


//         if (isCollidingWithWall(enemy.element) || isOutOfBounds(enemy.element)) {
//             enemy.element.style.top = enemyY + "px";
//             if (enemyYDirection == "top") enemyAvailableDirections.top = false
//             else enemyAvailableDirections.bottom = false
//         };

//         enemiesAvailableDirections.push(enemyAvailableDirections);

//         if (moveX > 0) enemy.element.src = "assets/img/enemys/cop-right-100.png";
//         else if (moveX < 0) enemy.element.src = "assets/img/enemys/cop-left-100.png";
//         else if (moveY > 0) enemy.element.src = "assets/img/enemys/cop-down-100.png";
//         else if (moveY < 0) enemy.element.src = "assets/img/enemys/cop-up-100.png";
//     });
// };

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