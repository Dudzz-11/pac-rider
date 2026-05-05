
const game = document.getElementById("game");

const playerSpeed = 10;

const rows = 9;

const cols = 16;

const cellSize = 100;

const map = [];

let isGameOver = false
let lives = 1;
let isInvincible = false;

const livesText = document.getElementById("lives");

function takeDamage() {
    if (isInvincible) return;

    if (lives === 0) {
        gameOver();
    } else {
        lives--;
        if (livesText) livesText.innerText = lives;
        triggerInvincibility();
        resetPlayerPosition();
    }
};

function resetPlayerPosition() {
    const spawn = map[5][7];
    player.style.left = (spawn.x * cellSize) + "px";
    player.style.top = (spawn.y * cellSize) + "px";
};

function gameOver() {
    alert("Game Over! Você perdeu todas as vidas.");
    location.reload();
};

let collectedPieces = 0

function createCells() {

    for (let row = 0; row < rows; row++) {
        map[row] = [];

        for (let col = 0; col < cols; col++) {
            const cell = {
                x: col,
                y: row,
                width: cellSize,
                height: cellSize
            };

            const newCell = document.createElement("div");
            newCell.id = `x${cell.x}y${cell.y}`;
            newCell.style.width = cell.width + "px";
            newCell.style.height = cell.height + "px";
            newCell.style.position = "absolute";
            newCell.style.left = (cell.x * cellSize) + "px";
            newCell.style.top = (cell.y * cellSize) + "px";
            game.appendChild(newCell);

            cell.element = newCell;

            map[row][col] = cell;

        };
    };
};

createCells();

function isCollidingWithWall(player) {
    return wallElements.some(wall => externalCollision(player, wall));
};

function getDistance(cellA, cellB) {
    return Math.abs(cellA.x - cellB.x) + Math.abs(cellA.y - cellB.y);
};

const playerDirections = {
    up: false,
    right: false,
    down: false,
    left: false
};

document.addEventListener("keydown", (event) => {

    switch (event.key) {
        case "w": {
            playerMovement.up = true
            break;
        }

        case "d": {
            playerMovement.right = true
            break;
        }

        case "s": {
            playerMovement.down = true
            break;
        }

        case "a": {
            playerMovement.left = true
            break;
        }
    }

});

document.addEventListener("keyup", (event) => {

    switch (event.key) {
        case "w": {
            playerMovement.up = false
            break;
        }

        case "d": {
            playerMovement.right = false
            break;
        }

        case "s": {
            playerMovement.down = false
            break;
        }

        case "a": {
            playerMovement.left = false
            break;
        }
    }

});

setInterval(() => {
    playerMovement()
    checkCollectiblesCollision();
    checkEnemyCollision();
    updateEnemies();
    checkMotoclubCollision();
}, 40);

function checkEnemyCollision() {
    enemys.forEach(enemyObj => {
        if (externalCollision(player, enemyObj.element)) {
            takeDamage();
        }
    });
};

function textPositionToNumber(textPosition) {
    return parseFloat(textPosition.split("px")[0]);
};

function externalCollision(elementA, elementB) {

    const rectA = elementA.getBoundingClientRect();
    const rectB = elementB.getBoundingClientRect();


    const margin = 10;

    const A = {
        top: rectA.top + margin,
        bottom: rectA.bottom - margin,
        left: rectA.left + margin,
        right: rectA.right - margin
    };

    const B = {
        top: rectB.top + margin,
        bottom: rectB.bottom - margin,
        left: rectB.left + margin,
        right: rectB.right - margin
    };

    return !(
        A.top > B.bottom ||
        A.right < B.left ||
        A.bottom < B.top ||
        A.left > B.right
    );
};

function collisionSidesMap(elementA, elementB) {
    const elementAPosition = elementA.getBoundingClientRect();
    const elementBPosition = elementB.getBoundingClientRect();

    return {
        top: elementAPosition.top >= elementBPosition.top,
        left: elementAPosition.left >= elementBPosition.left,
        bottom: elementAPosition.bottom <= elementBPosition.bottom,
        right: elementAPosition.right <= elementBPosition.right
    };
};

function isOutOfBounds(player) {
    const rect = player.getBoundingClientRect();
    const gameRect = game.getBoundingClientRect();

    return (
        rect.left < gameRect.left ||
        rect.right > gameRect.right ||
        rect.top < gameRect.top ||
        rect.bottom > gameRect.bottom
    );
};

function checkMotoclubCollision() {
    if (isGameOver) return;

    if (externalCollision(player, motoclubImg)) {
        if (collectedPieces >= 5) {
            isGameOver = true;

            alert("VOCÊ CONSEGUIU! A gangue está reunida.");

            location.reload();
        } else {
            if (playerMovement.up) player.style.top = (textPositionToNumber(player.style.top) + playerSpeed) + "px";
            if (playerMovement.down) player.style.top = (textPositionToNumber(player.style.top) - playerSpeed) + "px";
            if (playerMovement.left) player.style.left = (textPositionToNumber(player.style.left) + playerSpeed) + "px";
            if (playerMovement.right) player.style.left = (textPositionToNumber(player.style.left) - playerSpeed) + "px";
        }
    };
};