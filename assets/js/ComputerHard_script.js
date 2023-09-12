// Define variables and constants
var original;
const human = 'O';
const aiPlayer = 'X';

// Define winning combinations for the game
const winCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
]

// Get all the cell elements
const cells = document.querySelectorAll('.cell');

// Start the game
startGame();

// Function to initialize the game
function startGame() {
    // Hide the endgame message
    document.querySelector(".endgame").style.display = "none";
    
    // Initialize the game board
    original = Array.from(Array(9).keys());
    
    // Clear the cells and event listeners
    for (var i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
    }
}

// Function to handle a player's turn
function turnClick(square) {
    if (typeof original[square.target.id] == 'number') {
        turn(square.target.id, human)
        if (!checkWin(original, human) && !checkTie()) turn(bestSpot(), aiPlayer);
    }
}

// Function to make a move
function turn(squareId, player) {
    original[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let gameWon = checkWin(original, player)
    if (gameWon) gameOver(gameWon)
}

// Function to check if a player has won
function checkWin(board, player) {
    let plays = board.reduce((a, e, i) =>
        (e === player) ? a.concat(i) : a, []);
    let gameWon = null;
    for (let [index, win] of winCombinations.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            gameWon = {index: index, player: player};
            break;
        }
    }
    return gameWon;
}

// Function to handle the end of the game
function gameOver(gameWon) {
    for (let index of winCombinations[gameWon.index]) {
        document.getElementById(index).style.backgroundColor =
            gameWon.player == human ? "blue" : "red";
    }
    for (var i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(gameWon.player == human ? "You win!" : "You lose.");
}

// Function to declare the winner
function declareWinner(who) {
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = who;
}

// Function to find empty squares on the board
function emptySquares() {
    return original.filter(s => typeof s == 'number');
}

// Function to find the best spot for the AI player to move
function bestSpot() {
    return minimax(original, aiPlayer).index;
}

// Function to check if the game is a tie
function checkTie() {
    if (emptySquares().length == 0) {
        for (var i = 0; i < cells.length; i++) {
            cells[i].style.backgroundColor = "green";
            cells[i].removeEventListener('click', turnClick, false);
        }
        declareWinner("Tie Game!")
        return true;
    }
    return false;
}

// Function to implement the minimax algorithm for the AI player
function minimax(newBoard, player) {
    var availSpots = emptySquares();

    if (checkWin(newBoard, human)) {
        return {score: -10};
    } else if (checkWin(newBoard, aiPlayer)) {
        return {score: 10};
    } else if (availSpots.length === 0) {
        return {score: 0};
    }
    var moves = [];
    for (var i = 0; i < availSpots.length; i++) {
        var move = {};
        move.index = newBoard[availSpots[i]];
        newBoard[availSpots[i]] = player;

        if (player == aiPlayer) {
            var result = minimax(newBoard, human);
            move.score = result.score;
        } else {
            var result = minimax(newBoard, aiPlayer);
            move.score = result.score;
        }

        newBoard[availSpots[i]] = move.index;

        moves.push(move);
    }

    var bestMove;
    if(player === aiPlayer) {
        var bestScore = -10000;
        for(var i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        var bestScore = 10000;
        for(var i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}

// Add click sound to buttons
const audio = new Audio("https://www.fesliyanstudios.com/play-mp3/387");
const buttons = document.querySelectorAll("button");

buttons.forEach(button => {
  button.addEventListener("click", () => {
    audio.play();
  });
});
