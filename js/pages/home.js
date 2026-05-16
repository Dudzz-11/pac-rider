const logo = document.querySelector(".logoBtn");
const loginScreen = document.getElementById("login");
const playGameScreen = document.getElementById("playGame");
const textStart = document.querySelector(".textStart");
const displayName = document.getElementById("displayName");
const rankingList = document.getElementById("rankingList");

const motoSound = new Audio("../assets/audio/sound-engine-menu.mp3");
motoSound.volume = 0.8;

const inputUserLogin = document.getElementById("usuarioLogin");
const inputPasswordLogin = document.getElementById("passwordLogin");

const inputUserRegister = document.getElementById("usuarioRegister");
const inputPasswordRegister = document.getElementById("passwordRegister");

const btnLogin = document.querySelector(".btnLogin");
const btnRegister = document.querySelector(".btnRegister");
const btnGuest = document.querySelector(".btnGuest");

const message = document.getElementById("message");

let users = JSON.parse(localStorage.getItem("users")) || [];


const playlist = [
    new Audio("../assets/audio/music-game.mp3"),
    new Audio("../assets/audio/music-game2.mp3"),
    new Audio("../assets/audio/music-game3.mp3")
];

let currentTrack = 0;
let playlistStarted = false;
playlist.forEach(music => music.volume = 0.3);

function playNextTrack() {
    const track = playlist[currentTrack];
    track.currentTime = 0;
    track.play();

    track.onended = function () {
        currentTrack = (currentTrack + 1) % playlist.length;
        playNextTrack();
    };
}


const tabLoginBtn = document.getElementById("tabLoginBtn");
const tabRegisterBtn = document.getElementById("tabRegisterBtn");
const loginFields = document.getElementById("loginFields");
const registerFields = document.getElementById("registerFields");

tabLoginBtn.addEventListener("click", function () {
    tabLoginBtn.classList.add("active");
    tabRegisterBtn.classList.remove("active");
    loginFields.style.display = "block";
    registerFields.style.display = "none";
    message.textContent = "";
});

tabRegisterBtn.addEventListener("click", function () {
    tabRegisterBtn.classList.add("active");
    tabLoginBtn.classList.remove("active");
    registerFields.style.display = "block";
    loginFields.style.display = "none";
    message.textContent = "";
});


logo.addEventListener("click", function () {
    logo.classList.add("moved");
    loginScreen.style.display = "flex";
    textStart.style.display = "none";

    if (!playlistStarted) {
        playlistStarted = true;
        motoSound.play();
        motoSound.onended = function () {
            playNextTrack();
        };
    }
});


function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function renderRanking() {
    users = JSON.parse(localStorage.getItem("users")) || [];

    const ranked = users
        .filter(u => u.bestTime !== null && u.bestTime !== undefined)
        .sort((a, b) => a.bestTime - b.bestTime)
        .slice(0, 3);

    if (ranked.length === 0) {
        rankingList.innerHTML = '<p class="rankingEmpty">Nenhuma run registrada ainda.</p>';
        return;
    }

    const medals = [
        "assets/img/icon1-player.png",
        "assets/img/icon2-player.png",
        "assets/img/icon3-player.png"
    ];

    rankingList.innerHTML = ranked.map((u, i) => `
    <div class="rankingRow ${i === 0 ? "first" : ""}">
        <img class="rankingMedalImg" src="${medals[i]}" alt="medalha ${i + 1}">
        <span class="rankingNick">${u.userName}</span>
        <span class="rankingTime">${formatTime(u.bestTime)}</span>
    </div>
`).join("");
}

function goToPlayScreen(name) {
    loginScreen.style.display = "none";
    displayName.textContent = name;
    playGameScreen.style.display = "flex";
    renderRanking();
}


function checkAndSaveLastRun() {
    const lastTime = localStorage.getItem("pacRiderLastTime");
    const lastPlayer = localStorage.getItem("pacRiderLastPlayer");

    if (!lastTime || !lastPlayer) return;

    users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(u => u.userName === lastPlayer);

    if (user) {
        const time = parseInt(lastTime);
        if (user.bestTime === null || user.bestTime === undefined || time < user.bestTime) {
            user.bestTime = time;
            localStorage.setItem("users", JSON.stringify(users));
        }
    }

    localStorage.removeItem("pacRiderLastTime");
    localStorage.removeItem("pacRiderLastPlayer");
}

checkAndSaveLastRun();


btnRegister.addEventListener("click", function () {
    const userName = inputUserRegister.value.trim();
    const password = inputPasswordRegister.value.trim();

    if (!userName || !password) {
        message.textContent = "Preencha todos os campos";
        return;
    }

    users = JSON.parse(localStorage.getItem("users")) || [];
    const userExists = users.find(u => u.userName === userName);

    if (userExists) {
        message.textContent = "Usuário já existe";
        return;
    }

    users.push({ userName, password, bestTime: null });
    localStorage.setItem("users", JSON.stringify(users));

    message.textContent = "Usuário cadastrado!";
    inputUserRegister.value = "";
    inputPasswordRegister.value = "";
});


btnLogin.addEventListener("click", function () {
    const userName = inputUserLogin.value.trim();
    const password = inputPasswordLogin.value.trim();

    users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.userName === userName && u.password === password);

    if (!user) {
        message.textContent = "Usuário ou senha incorretos";
        return;
    }

    localStorage.setItem("currentPlayer", userName);
    goToPlayScreen(userName);
});


btnGuest.addEventListener("click", function () {
    localStorage.setItem("currentPlayer", "Convidado");
    goToPlayScreen("Convidado");
});