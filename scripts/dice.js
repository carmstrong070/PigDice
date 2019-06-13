window.onload = function () {
    var newGameBtn = document.getElementById("new_game");
    newGameBtn.onclick = createNewGame;
    document.getElementById("roll").onclick = rollDie;
    document.getElementById("hold").onclick = holdDie;
};
var player = (function () {
    function player() {
        this.score = 0;
        this.lostTurns = 0;
        this.bestTurn = 0;
        this.longestTurn = 0;
    }
    return player;
}());
var game = (function () {
    function game() {
        this.turnTotal = 0;
        this.stateOfGame = 0;
    }
    return game;
}());
var NO_GAME = 0;
var GAME_IN_PROGRESS = 1;
var GAME_OVER = 2;
var WINNING_SCORE = 50;
var player1 = new player();
var player2 = new player();
var gameHelper = new game();
function generateRandomValue(minValue, maxValue) {
    var random = Math.random();
    return Math.floor(random * maxValue + 1);
}
function changePlayers() {
    if (gameHelper.isPlayer1turn) {
        gameHelper.isPlayer1turn = false;
        document.getElementById("current").innerText = player2.name + "'s turn";
    }
    else {
        gameHelper.isPlayer1turn = true;
        document.getElementById("current").innerText = player1.name + "'s turn";
    }
}
function createNewGame() {
    if (gameHelper.stateOfGame != NO_GAME) {
        var confirmNewGame = confirm("Are you sure you want to start a new game?");
        if (confirmNewGame) {
            location.reload();
        }
        else {
            return;
        }
    }
    if (!playerNamesValid()) {
        return;
    }
    player1.name = (document.getElementById("player1").value).trim();
    player2.name = (document.getElementById("player2").value).trim();
    document.getElementById("roll").removeAttribute("disabled");
    document.getElementById("hold").removeAttribute("disabled");
    document.getElementById("score1").value = "0";
    document.getElementById("score2").value = "0";
    document.getElementById("total").value = "0";
    document.getElementById("player1").setAttribute("disabled", "disabled");
    document.getElementById("player2").setAttribute("disabled", "disabled");
    gameHelper.stateOfGame = GAME_IN_PROGRESS;
    gameHelper.isPlayer1turn = true;
    document.getElementById("current").innerText = player1.name + "'s turn";
}
function rollDie() {
    var dieElem = document.getElementById("die");
    var totalElem = document.getElementById("total");
    var currTotal = parseInt(document.getElementById("total").value);
    var rollValue = generateRandomValue(1, 6);
    if (rollValue == 1) {
        endTurn();
        currTotal = 0;
        if (gameHelper.isPlayer1turn) {
            player1.lostTurns += 1;
        }
        else {
            player2.lostTurns += 1;
        }
    }
    else {
        currTotal += rollValue;
    }
    dieElem.value = String(rollValue);
    totalElem.value = String(currTotal);
    if (gameHelper.isPlayer1turn) {
        if (player1.score + currTotal >= WINNING_SCORE) {
            gameHelper.stateOfGame = GAME_OVER;
            holdDie();
        }
    }
    else {
        if (player2.score + currTotal >= WINNING_SCORE) {
            gameHelper.stateOfGame = GAME_OVER;
            holdDie();
        }
    }
}
function holdDie() {
    var currTotal = parseInt(document.getElementById("total").value);
    if (gameHelper.isPlayer1turn) {
        if (currTotal > player1.bestTurn) {
            player1.bestTurn = currTotal;
        }
        player1.score += currTotal;
    }
    else {
        if (currTotal > player2.bestTurn) {
            player2.bestTurn = currTotal;
        }
        player2.score += currTotal;
    }
    endTurn();
}
function playerNamesValid() {
    var errorMsg = "";
    var player1Name = (document.getElementById("player1").value).trim();
    var player2Name = (document.getElementById("player2").value).trim();
    var flag = true;
    if (player1Name == "") {
        errorMsg = "Player 1 name required.\n";
        flag = false;
    }
    if (player2Name == "") {
        errorMsg += "Player 2 name required.\n";
        flag = false;
    }
    if (player1Name == player2Name) {
        errorMsg += "Player names must be different.";
        flag = false;
    }
    if (errorMsg != "") {
        alert(errorMsg);
    }
    return flag;
}
function endTurn() {
    document.getElementById("score1").value = String(player1.score);
    document.getElementById("score2").value = String(player2.score);
    gameHelper.turnTotal += 1;
    if (gameHelper.stateOfGame == GAME_IN_PROGRESS) {
        document.getElementById("total").value = "0";
        changePlayers();
    }
    else if (gameHelper.stateOfGame == GAME_OVER) {
        document.getElementById("roll").setAttribute("disabled", "disabled");
        document.getElementById("hold").setAttribute("disabled", "disabled");
        if (gameHelper.isPlayer1turn) {
            document.getElementById("current").innerText = player1.name + " wins!";
        }
        else {
            document.getElementById("current").innerText = player2.name + " wins!";
        }
        document.getElementById("game-stats").removeAttribute("hidden");
        document.getElementById("p1-lost-turns").innerText = player1.name + " lost " + player1.lostTurns + " turns.";
        document.getElementById("p2-lost-turns").innerText = player2.name + " lost " + player1.lostTurns + " turns.";
        document.getElementById("p1-best-turn").innerText = player1.name + "'s best turn was " + player1.bestTurn + " points.";
        document.getElementById("p2-best-turn").innerText = player2.name + "'s best turn was " + player2.bestTurn + " points.";
        document.getElementById("total-turns").innerText = String(gameHelper.turnTotal);
    }
}
