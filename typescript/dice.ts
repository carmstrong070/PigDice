window.onload = function(){
    let newGameBtn: HTMLInputElement = <HTMLInputElement> document.getElementById("new_game");
    newGameBtn.onclick = createNewGame;

    document.getElementById("roll").onclick = rollDie;

    document.getElementById("hold").onclick = holdDie;
}
// Create Player and Game classes
class player{
    name:string;
    score:number = 0;
    lostTurns:number = 0;
    bestTurn:number = 0;
    longestTurn:number = 0;
}
class game{
    isPlayer1turn:boolean;
    turnTotal:number = 0;
    stateOfGame:number = 0;
}
// global constants 
const NO_GAME = 0;
const GAME_IN_PROGRESS = 1;
const GAME_OVER = 2;
const WINNING_SCORE = 50;

let player1 = new player();
let player2 = new player();
let gameHelper = new game();


function generateRandomValue(minValue:number, maxValue:number):number{
    var random = Math.random();
    
    //TODO: use random to generate a number between min and max

    return Math.floor(random * maxValue + 1);
}

function changePlayers():void{
    //swap from player to player by comparing current name to player names
    //set currentPlayerName to the next player
    if (gameHelper.isPlayer1turn) {
        gameHelper.isPlayer1turn = false;
        document.getElementById("current").innerText = player2.name + "'s turn";
    }
    else{
        gameHelper.isPlayer1turn = true;
        document.getElementById("current").innerText = player1.name + "'s turn";
    }
}

function createNewGame(){
    if (gameHelper.stateOfGame != NO_GAME) {
        let confirmNewGame: Boolean = confirm("Are you sure you want to start a new game?");
        if (confirmNewGame) {
            location.reload();
        }
        else{
            return;
        }
    }
    
    //verify each player has a name
    if (!playerNamesValid()) {
        return;
    }
    // Set player names
    player1.name = ((<HTMLInputElement>document.getElementById("player1")).value).trim();
    player2.name = ((<HTMLInputElement>document.getElementById("player2")).value).trim();

    // enable Roll and Hold buttons
    (<HTMLInputElement>document.getElementById("roll")).removeAttribute("disabled");
    (<HTMLInputElement>document.getElementById("hold")).removeAttribute("disabled");

    //set player 1 and player 2 scores to 0
    (<HTMLInputElement>document.getElementById("score1")).value = "0";
    (<HTMLInputElement>document.getElementById("score2")).value = "0";
    (<HTMLInputElement>document.getElementById("total")).value = "0";

    //if both players do have a name start the game!
    //lock in player names and then set the turn to player 1
    document.getElementById("player1").setAttribute("disabled", "disabled");
    document.getElementById("player2").setAttribute("disabled", "disabled");
    gameHelper.stateOfGame = GAME_IN_PROGRESS;
    gameHelper.isPlayer1turn = true;
    document.getElementById("current").innerText = player1.name + "'s turn";
}

function rollDie():void{
    let dieElem: HTMLInputElement = <HTMLInputElement> document.getElementById("die");
    let totalElem: HTMLInputElement = <HTMLInputElement> document.getElementById("total"); 
    let currTotal = parseInt((<HTMLInputElement>document.getElementById("total")).value);    
    //roll the die and get a random value 1 - 6 (use generateRandomValue function)
    let rollValue:number = generateRandomValue(1, 6)

    //if the roll is 1
    if (rollValue == 1) {
        //  change players
        endTurn();
        //  set current total to 0
        currTotal = 0;
        if (gameHelper.isPlayer1turn) {
            player1.lostTurns += 1;
        } else {
            player2.lostTurns += 1;
        }

    } else {
        //  add roll value to current total
        currTotal += rollValue;
    }    

    //set the die roll to value player rolled
    dieElem.value = String(rollValue);
    //display current total on form
    totalElem.value = String(currTotal);

    // If score plus total wins the game
    if (gameHelper.isPlayer1turn) {
        if(player1.score + currTotal >= WINNING_SCORE){
            gameHelper.stateOfGame = GAME_OVER;
            holdDie();
        }
    } else {
        if(player2.score + currTotal >= WINNING_SCORE){
            gameHelper.stateOfGame = GAME_OVER;
            holdDie();
        }
    }
}

function holdDie():void{
    //get the current turn total
    let currTotal = parseInt((<HTMLInputElement>document.getElementById("total")).value);
    //determine who the current player is
    if (gameHelper.isPlayer1turn) {
        if (currTotal > player1.bestTurn) {
            player1.bestTurn = currTotal;
        }
        player1.score += currTotal;
    } else {
        if (currTotal > player2.bestTurn) {
            player2.bestTurn = currTotal;
        }
        player2.score += currTotal;
    }
    //change players
    endTurn();
}

function playerNamesValid():boolean{
    let errorMsg:string = "";
    let player1Name = ((<HTMLInputElement>document.getElementById("player1")).value).trim();
    let player2Name = ((<HTMLInputElement>document.getElementById("player2")).value).trim();
    let flag = true;

    if (player1Name == "") {
        errorMsg = "Player 1 name required.\n";
        flag = false;
    }
    if (player2Name == "") {
        errorMsg += "Player 2 name required.\n";
        flag = false;
    }
    if(player1Name == player2Name){
        errorMsg += "Player names must be different."
        flag = false;
    }
    if(errorMsg != ""){
        alert(errorMsg);
    }
    return flag;
}

function endTurn(){
    (<HTMLInputElement>document.getElementById("score1")).value = String(player1.score);
    (<HTMLInputElement>document.getElementById("score2")).value = String(player2.score);
    
    // add 1 to turn total
    gameHelper.turnTotal += 1;

    if(gameHelper.stateOfGame == GAME_IN_PROGRESS){
        (<HTMLInputElement>document.getElementById("total")).value = "0";
        changePlayers();
    }
    else if (gameHelper.stateOfGame == GAME_OVER) {
        // disable roll and hold buttons
        (<HTMLInputElement>document.getElementById("roll")).setAttribute("disabled", "disabled");
        (<HTMLInputElement>document.getElementById("hold")).setAttribute("disabled", "disabled");

        if(gameHelper.isPlayer1turn){
            document.getElementById("current").innerText = player1.name + " wins!"
        }
        else{
            document.getElementById("current").innerText = player2.name + " wins!"
        }

        // Set game stats
        document.getElementById("game-stats").removeAttribute("hidden");

        document.getElementById("p1-lost-turns").innerText = player1.name + " lost " + player1.lostTurns + " turns."
        document.getElementById("p2-lost-turns").innerText = player2.name + " lost " + player1.lostTurns + " turns."

        document.getElementById("p1-best-turn").innerText = player1.name + "'s best turn was " + player1.bestTurn + " points."
        document.getElementById("p2-best-turn").innerText = player2.name + "'s best turn was " + player2.bestTurn + " points."

        document.getElementById("total-turns").innerText = String(gameHelper.turnTotal);
    
    }
}