const enemyImages = [
    "../assets/img/enemys/cop-down-100.png",
    "../assets/img/enemys/cop-down-100.png",
    "../assets/img/enemys/cop-down-100.png",
    "../assets/img/enemys/cop-down-100.png",
    "../assets/img/enemys/cop-down-100.png"
];

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

    enemy.src = enemyImages[i];
    enemy.style.width = "100px";
    enemy.style.height = "100px";

    cell.element.innerHTML = "";
    cell.element.appendChild(enemy);

    cell.type = "enemy";

    enemys.push({
    element: enemy,
    row: cell.y,
    col: cell.x,
    originRow: cell.y, 
    originCol: cell.x, 
    state: "wandering"
});
};

function updateEnemies() {
    const playerGridX = Math.round(textPositionToNumber(player.style.left) / cellSize);
    const playerGridY = Math.round(textPositionToNumber(player.style.top) / cellSize);

    enemys.forEach(enemy => {
        let nextRow = enemy.row;
        let nextCol = enemy.col;

        const dist = getDistance({x: enemy.col, y: enemy.row}, {x: playerGridX, y: playerGridY});
        
        if (dist <= 5) { 
            enemy.state = "chasing";
            if (enemy.col !== playerGridX) {
                nextCol += (playerGridX > enemy.col) ? 1 : -1;
            } else if (enemy.row !== playerGridY) {
                nextRow += (playerGridY > enemy.row) ? 1 : -1;
            }
        } else {
            enemy.state = "wandering";
            const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
            const randomDir = directions[Math.floor(Math.random() * directions.length)];
            nextRow += randomDir[0];
            nextCol += randomDir[1];
        }

        const targetCell = map[nextRow] ? map[nextRow][nextCol] : null;

        if (targetCell && targetCell.type !== "wall" && targetCell.type !== "enemy") {
            map[enemy.row][enemy.col].type = null; 
            
            enemy.row = nextRow;
            enemy.col = nextCol;

            map[enemy.row][enemy.col].type = "enemy";

            targetCell.element.appendChild(enemy.element);
        } else {
            enemy.state = "wandering"; 
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