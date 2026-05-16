const game = document.getElementById("game");

const soundDamage  = new Audio("./assets/audio/sound-click-effect.mp3");
const soundVictory = new Audio("./assets/audio/sound-win.mp3");
soundDamage.volume  = 0.5;
soundVictory.volume = 0.7;

const gamePlaylist = [
    new Audio("./assets/audio/music-game.mp3"),
    new Audio("./assets/audio/music-game2.mp3"),
    new Audio("./assets/audio/music-game3.mp3")
];
let currentGameTrack = 0;
gamePlaylist.forEach(music => music.volume = 0.15);

function playNextGameTrack() {
    const track = gamePlaylist[currentGameTrack];
    track.currentTime = 0;
    track.play().catch(() => {});
    track.onended = function () {
        currentGameTrack = (currentGameTrack + 1) % gamePlaylist.length;
        playNextGameTrack();
    };
}

const savedTrack = sessionStorage.getItem("currentGameTrack");
if (savedTrack !== null) {
    currentGameTrack = parseInt(savedTrack);
    sessionStorage.removeItem("currentGameTrack");
    playNextGameTrack();
}

let audioUnlocked = false;
document.addEventListener("keydown", () => {
    if (audioUnlocked) return;
    audioUnlocked = true;

    const effectSounds = [soundDamage, soundVictory];
    const unlockPromises = effectSounds.map(sound =>
        sound.play().then(() => { sound.pause(); sound.currentTime = 0; }).catch(() => {})
    );

    if (!savedTrack) {
        Promise.allSettled(unlockPromises).then(() => {
            playNextGameTrack();
        });
    }
});

const playerSpeed = 10;
const rows        = 9;
const cols        = 16;
const cellSize    = 100;
const map         = [];

let isGameOver   = false;
let lives        = 3;
let isInvincible = false;

const livesText = document.getElementById("lives");
const timerText = document.getElementById("timer");
let startTime    = parseInt(localStorage.getItem("pacRiderTime")) || 0;
let timerInterval = null;

function triggerInvincibility() {
    isInvincible = true;
    setTimeout(() => { isInvincible = false; }, 2000);
}

function takeDamage() {
    if (isInvincible) return;

    if (lives <= 1) {
        lives = 0;
        if (livesText) livesText.innerText = lives;
        gameOver();
    } else {
        lives--;
        if (livesText) livesText.innerText = lives;
        soundDamage.currentTime = 0;
        soundDamage.play().catch(() => {});
        resetPlayerPosition();
        resetAllEnemies();
        triggerInvincibility();
    }
}

function resetPlayerPosition() {
    const spawn = map[5][7];
    player.style.left = (spawn.x * cellSize) + "px";
    player.style.top  = (spawn.y * cellSize) + "px";
}

function gameOver() {
    isGameOver = true;
    clearInterval(timerInterval);

    const defeatScreen      = document.getElementById("defeatScreen");
    const defeatTimeDisplay = document.getElementById("defeatTimeDisplay");
    if (defeatScreen && defeatTimeDisplay) {
        defeatTimeDisplay.innerText = formatTime(startTime);
        defeatScreen.style.display  = "flex";
    }
    localStorage.removeItem("pacRiderTime");
}

let collectedPieces = 0;

function createCells() {
    for (let row = 0; row < rows; row++) {
        map[row] = [];
        for (let col = 0; col < cols; col++) {
            const cell = { x: col, y: row, width: cellSize, height: cellSize };
            const newCell = document.createElement("div");
            newCell.id = `x${cell.x}y${cell.y}`;
            newCell.style.width    = cell.width  + "px";
            newCell.style.height   = cell.height + "px";
            newCell.style.position = "absolute";
            newCell.style.left     = (cell.x * cellSize) + "px";
            newCell.style.top      = (cell.y * cellSize) + "px";
            game.appendChild(newCell);
            cell.element  = newCell;
            map[row][col] = cell;
        }
    }
}
createCells();

function isCollidingWithWall(element, testDirection, testSpeed) {
    if (testDirection && testSpeed) {
        const elementRect = JSON.parse(JSON.stringify(element.getBoundingClientRect()));
        switch (testDirection) {
            case "up":    elementRect.top    -= testSpeed; break;
            case "right": elementRect.right  += testSpeed; break;
            case "down":  elementRect.bottom += testSpeed; break;
            case "left":  elementRect.left   -= testSpeed; break;
        }
        return wallElements.some(wall => externalCollision(undefined, wall, elementRect, undefined));
    }
    return wallElements.some(wall => externalCollision(element, wall));
}

function getDistance(cellA, cellB) {
    return Math.abs(cellA.x - cellB.x) + Math.abs(cellA.y - cellB.y);
}

function externalCollision(elementA, elementB, rectA, rectB) {
    if (rectA == undefined) rectA = elementA.getBoundingClientRect();
    if (rectB == undefined) rectB = elementB.getBoundingClientRect();
    const margin = 5;
    const A = { top: rectA.top+margin, bottom: rectA.bottom-margin, left: rectA.left+margin, right: rectA.right-margin };
    const B = { top: rectB.top+margin, bottom: rectB.bottom-margin, left: rectB.left+margin, right: rectB.right-margin };
    return !(A.top > B.bottom || A.right < B.left || A.bottom < B.top || A.left > B.right);
}

function isOutOfBounds(element) {
    const rect     = element.getBoundingClientRect();
    const gameRect = game.getBoundingClientRect();
    return (rect.left < gameRect.left || rect.right > gameRect.right ||
            rect.top  < gameRect.top  || rect.bottom > gameRect.bottom);
}

document.addEventListener("keydown", (event) => {
    switch (event.key.toLowerCase()) {
        case "w": playerMovement.up    = true; break;
        case "d": playerMovement.right = true; break;
        case "s": playerMovement.down  = true; break;
        case "a": playerMovement.left  = true; break;
    }
    if (["w","a","s","d"].includes(event.key.toLowerCase())) {
        if (soundEngine.paused) {
            soundEngine.loop = true;
            soundEngine.play().catch(() => {});
        }
    }
});

document.addEventListener("keyup", (event) => {
    switch (event.key.toLowerCase()) {
        case "w": playerMovement.up    = false; break;
        case "d": playerMovement.right = false; break;
        case "s": playerMovement.down  = false; break;
        case "a": playerMovement.left  = false; break;
    }
    const moving = playerMovement.up || playerMovement.down || playerMovement.left || playerMovement.right;
    if (!moving) { soundEngine.pause(); soundEngine.currentTime = 0; }
});

setInterval(() => {
    playerMovement();
    checkCollectiblesCollision();
    checkEnemyCollision();
    updateEnemies();
    checkMotoclubCollision();
}, 40);

function checkEnemyCollision() {
    enemys.forEach(enemyObj => {
        if (externalCollision(player, enemyObj.element)) takeDamage();
    });
}

function textPositionToNumber(textPosition) {
    return parseFloat(textPosition.split("px")[0]);
}

function checkMotoclubCollision() {
    if (isGameOver) return;
    if (externalCollision(player, motoclubImg)) {
        if (collectedPieces >= 5) {
            isGameOver = true;
            clearInterval(timerInterval);

            soundVictory.currentTime = 0;
            soundVictory.play().catch(() => {});

            const victoryScreen    = document.getElementById("victoryScreen");
            const finalTimeDisplay = document.getElementById("finalTimeDisplay");
            if (victoryScreen && finalTimeDisplay) {
                finalTimeDisplay.innerText  = formatTime(startTime);
                victoryScreen.style.display = "flex";
            }
            localStorage.removeItem("pacRiderTime");

            const currentPlayer = localStorage.getItem("currentPlayer");
            if (currentPlayer && currentPlayer !== "Convidado") {
                localStorage.setItem("pacRiderLastTime",   startTime);
                localStorage.setItem("pacRiderLastPlayer", currentPlayer);
            }
        } else {
            if (playerMovement.up)    player.style.top  = (textPositionToNumber(player.style.top)  + playerSpeed) + "px";
            if (playerMovement.down)  player.style.top  = (textPositionToNumber(player.style.top)  - playerSpeed) + "px";
            if (playerMovement.left)  player.style.left = (textPositionToNumber(player.style.left) + playerSpeed) + "px";
            if (playerMovement.right) player.style.left = (textPositionToNumber(player.style.left) - playerSpeed) + "px";
        }
    }
}

function manageTimer() {
    if (timerInterval !== null) return;
    timerInterval = setInterval(() => {
        if (!isGameOver) {
            startTime++;
            if (timerText) timerText.innerText = formatTime(startTime);
        }
    }, 1000);
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
}

manageTimer();

function retryGame() {
 
    const nextTrack = (currentGameTrack + 1) % gamePlaylist.length;
    
    sessionStorage.setItem("currentGameTrack", nextTrack);
    
    location.reload();
}

function goToMenu() {
    sessionStorage.removeItem("currentGameTrack");
    gamePlaylist.forEach(music => { music.pause(); music.currentTime = 0; });
    window.location.href = "index.html";
}
