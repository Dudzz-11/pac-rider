const logo = document.querySelector(".logoBtn");

const loginScreen = document.getElementById("login");

const textStart = document.querySelector(".textStart")

const motoSound = new Audio("../assets/audio/sound-engine-menu.mp3");

const inputUser = document.getElementById("usuario");
const inputPassword = document.getElementById("password");

const btnLogin = document.querySelector(".btnLogin");
const btnRegister = document.querySelector(".btnRegister");
const btnGuest = document.querySelector(".btnGuest");

const message = document.getElementById("message");

const playerName = localStorage.getItem("currentPlayer");

let users = JSON.parse(localStorage.getItem("users")) || [];

const playlist = [
    new Audio("../assets/audio/music-game.mp3"),
    new Audio("../assets/audio/music-game2.mp3"),
    new Audio("../assets/audio/music-game3.mp3") 
];

let currentTrack = 0;

playlist.forEach(music => music.volume = 0.3);

function playNextTrack() {
    playlist[currentTrack].play();
    playlist[currentTrack].onended = function() {

        currentTrack++;

        if (currentTrack >= playlist.length) {
            currentTrack = 0;
        }

        playNextTrack();

    };
}

logo.addEventListener("click", function(){
    logo.classList.add("moved");
    loginScreen.style.display = "flex";
    textStart.style.display = "none";
    motoSound.play();
    motoSound.onended = function(){
        playNextTrack();
    };
});

btnRegister.addEventListener("click", function(){
    const userName = inputUser.value;
    const password = inputPassword.value;

    if (!userName || !password) {
        message.textContent = "Preencha todos os campos";
        return;
    }

    const userExists = users.find(user => user.userName === userName);

    if (userExists) {
        message.textContent = "Usuário já existe";
        return;
    }

    const newUser = {
        userName: userName,
        password: password,
        bestTime: null
    };

    users.push(newUser);

    localStorage.setItem("users", JSON.stringify(users));

    message.textContent = "Usuário Cadastrado!";
});

btnLogin.addEventListener("click", function() {
    const userName = inputUser.value;
    const password = inputPassword.value;

    const user = users.find(
        user => user.userName ===  userName && user.password === password
    );

    if (!user) {
        message.textContent = "Usuário ou senha incorretos";
        return;
    }

    localStorage.setItem("currentPlayer", userName);

    message.textContent = "Login realizado!";
});

btnGuest.addEventListener("click", function() {

    localStorage.setItem("currentPlayer", "Convidado");

    message.textContent = "Entrando como convidado...";
});