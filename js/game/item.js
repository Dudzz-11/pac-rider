const collectibleImages = [
    "assets/img/items/engine.png",
    "assets/img/items/exhaust.png",
    "assets/img/items/headers.png",
    "assets/img/items/piston.png",
    "assets/img/items/wheel.png"
];

const collectSound = new Audio("./assets/audio/sound-collect.mp3");

const collectedPartsText = document.getElementById("collectedParts");

const collectibles = [];

const emptyCellsForItems = [];

for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        const cell = map[row][col];

        if (cell.type === "wall") continue;
        if (cell.type === "collectible") continue;

        if (row === 5 && col === 7) continue;
        if (row === 0 && col === 15) continue;

        if (getDistance(cell, map[5][7]) < 4) continue;

        if (isCellBlocked(cell)) continue;

        emptyCellsForItems.push(cell);
    };
};

emptyCellsForItems.sort(() => Math.random() - 0.5);

for (let i = 0; i < collectibleImages.length; i++) {
    const cell = emptyCellsForItems[i];


    const item = document.createElement("img");

    item.src = collectibleImages[i];
    item.style.width = "100px";
    item.style.height = "100px";

    cell.element.innerHTML = "";
    cell.element.appendChild(item);

    cell.type = "collectible";

    collectibles.push({
        element: item,
        cell: cell,
        collected: false
    });
};

function checkCollectiblesCollision() {
    if (isGameOver) return;
    collectibles.forEach(obj => {
        if (obj.collected) return;

        if (externalCollision(player, obj.element)) {
            obj.collected = true;

            obj.element.remove();
            collectedPieces++;

            collectedPartsText.innerText = collectedPieces;

            collectSound.currentTime = 0;
            collectSound.play();
        }
        if (collectedPieces === 5) {
            motoclubImg.src = "assets/img/buildings/dead-riders-mc1.png";
            console.log("Motoclube Desbloqueado!");
        }

    });
};

function isCellBlocked(cell) {
    let wallCount = 0;

    const directions = [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0]
    ];

    directions.forEach(([dx, dy]) => {
        const r = cell.y + dy;
        const c = cell.x + dx;

        if (map[r] && map[r][c]?.type === "wall") {
            wallCount++;
        }
    });

    return wallCount >= 2;
};
