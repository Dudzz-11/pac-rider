const player = document.createElement("img");

const soundEngine = new Audio("../assets/audio/sound-bike-ingame.mp3");

player.id = "player";
player.src = "assets/img/player/player-up.png";

player.style.position = "absolute";
player.style.width = "80px";

const spawn = map[5][7];

player.style.left = (spawn.x * cellSize) + "px";
player.style.top = (spawn.y * cellSize) + "px";

game.appendChild(player);

function playerMovement() {
    if (isGameOver) return;
    window.getComputedStyle(player);

    if (playerMovement.up) {
        const currentTop = textPositionToNumber(player.style.top || "0px");
        const newTop = currentTop - playerSpeed;

        player.style.top = `${newTop}px`;

        if (isCollidingWithWall(player) || isOutOfBounds(player)) {
            player.style.top = `${currentTop}px`;
        }
        player.src = "assets/img/player/player-up.png";
    } if (playerMovement.right) {
        const currentLeft = textPositionToNumber(player.style.left || "0px");
        const newLeft = currentLeft + playerSpeed;

        player.style.left = `${newLeft}px`;

        if (isCollidingWithWall(player) || isOutOfBounds(player)) {
            player.style.left = `${currentLeft}px`;
        }

        player.src = "assets/img/player/player-right.png";
    } if (playerMovement.down) {
        const currentTop = textPositionToNumber(player.style.top || "0px");
        const newTop = currentTop + playerSpeed;

        player.style.top = `${newTop}px`;

        if (isCollidingWithWall(player) || isOutOfBounds(player)) {
            player.style.top = `${currentTop}px`;
        }

        player.src = "assets/img/player/player-down.png";
    } if (playerMovement.left) {
        const currentLeft = textPositionToNumber(player.style.left || "0px");
        const newLeft = currentLeft - playerSpeed;

        player.style.left = `${newLeft}px`;

        if (isCollidingWithWall(player) || isOutOfBounds(player)) {
            player.style.left = `${currentLeft}px`;
        }

        player.src = "assets/img/player/player-left.png";
    };


    // switch (playerMovement) {
    //     case "w": {
    //         const currentTop = textPositionToNumber(player.style.top || "0px");
    //         const newTop = currentTop - playerSpeed;

    //         player.style.top = `${newTop}px`;

    //         if (isCollidingWithWall(player) || isOutOfBounds(player)) {
    //             player.style.top = `${currentTop}px`;
    //         }
    //         player.src = "assets/img/player-up.png";
    //         break;
    //     }

    //     case "d": {
    //         const currentLeft = textPositionToNumber(player.style.left || "0px");
    //         const newLeft = currentLeft + playerSpeed;

    //         player.style.left = `${newLeft}px`;

    //         if (isCollidingWithWall(player) || isOutOfBounds(player)) {
    //             player.style.left = `${currentLeft}px`;
    //         }

    //         player.src = "assets/img/player-right.png";
    //         break;
    //     }

    //     case "s": {
    //         const currentTop = textPositionToNumber(player.style.top || "0px");
    //         const newTop = currentTop + playerSpeed;

    //         player.style.top = `${newTop}px`;

    //         if (isCollidingWithWall(player) || isOutOfBounds(player)) {
    //             player.style.top = `${currentTop}px`;
    //         }

    //         player.src = "assets/img/player-down.png";
    //         break;
    //     }

    //     case "a": {
    //         const currentLeft = textPositionToNumber(player.style.left || "0px");
    //         const newLeft = currentLeft - playerSpeed;

    //         player.style.left = `${newLeft}px`;

    //         if (isCollidingWithWall(player) || isOutOfBounds(player)) {
    //             player.style.left = `${currentLeft}px`;
    //         }

    //         player.src = "assets/img/player-left.png";
    //         break;
    //     }
    // }
};