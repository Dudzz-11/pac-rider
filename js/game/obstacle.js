const randomwallsCount = 20;

const motoClubPos = [0, 15];

const motoClubCell = map[motoClubPos[0]][motoClubPos[1]];

const [row, col] = motoClubPos;

const cell = map[row][col];

const motoclubImg = document.createElement("img");
motoclubImg.id = "motoclub-gate";
motoclubImg.src = "assets/img/buildings/dead-riders-mc-block.png";

motoclubImg.style.width = "100px";
motoclubImg.style.height = "100px";

cell.element.innerHTML = "";
cell.element.appendChild(motoclubImg);

const motoClubElement = motoclubImg;

const wallElements = [];

const walls = [
    [5, 6],
    [6, 6],
    [5, 8],
    [6, 8]
];

walls.forEach(([row, col]) => {
    map[row][col].type = "wall";
});

walls.forEach(([row, col]) => {

    const cell = map[row][col];

    const wall = document.createElement("img");

    wall.src = "assets/img/fixed-wall.png";

    wall.style.width = "100px";
    wall.style.height = "100px";

    cell.element.innerHTML = "";
    cell.element.appendChild(wall);

    wallElements.push(cell.element);
});

const emptyCells = [];

for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        const cell = map[row][col];

        if (cell.type === "wall") continue;

        if (row === 5 && col === 7) continue;

        const motoclubCell = map[0][15];

        if (getDistance(cell, motoclubCell) < 2) continue;

        const spawnCell = map[5][7];

        if (getDistance(cell, spawnCell) < 2) continue;

        emptyCells.push(cell);
    }
};

emptyCells.sort(() => Math.random() - 0.5);

for (let i = 0; i < randomwallsCount; i++) {
    const cell = emptyCells[i];

     if (willBlockCell(cell)) continue;

    cell.type = "wall";

    const wall = document.createElement("img");
    wall.src = "assets/img/wooden-crate.png";
    wall.style.width = "100px";
    wall.style.height = "100px";

    cell.element.innerHTML = "";
    cell.element.appendChild(wall);

    wallElements.push(cell.element);
};

function willBlockCell(cell) {
    let count = 0;

    const directions = [
        [0,1],
        [1,0],
        [0,-1],
        [-1,0]
    ];

    directions.forEach(([dx, dy]) => {
        const r = cell.y + dy;
        const c = cell.x + dx;

        if (map[r] && map[r][c]?.type === "wall") {
            count++;
        }
    });

    return count >= 2;
}