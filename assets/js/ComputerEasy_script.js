// Initialize the game board and player symbols
var origBoard;
const huPlayer = 'O'; // Human player
const aiPlayer = 'X'; // AI player

// Define the winning combinations on the game board
const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2]
]

// Select all cells on the game board
const cells = document.querySelectorAll('.cell');
startGame(); // Start the game

// Function to start the game
function startGame() {
  // Hide the endgame message
  document.querySelector(".endgame").style.display = "none";
  // Initialize the original game board with empty cells
  origBoard = Array.from(Array(9).keys());
  for (var i = 0; i < cells.length; i++) {
    cells[i].innerText = '';
    cells[i].style.removeProperty('background-color');
    cells[i].addEventListener('click', turnClick, false);
  }
}

// Function to handle a player's turn when a cell is clicked
function turnClick(square) {
  if (typeof origBoard[square.target.id] == 'number') {
    // Human player's turn
    turn(square.target.id, huPlayer)
    // If the game is not tied, it's AI's turn
    if (!checkTie()) turn(bestSpot(), aiPlayer);
  }
}

// Function to execute a player's turn
function turn(squareId, player) {
  origBoard[squareId] = player;
  document.getElementById(squareId).innerText = player;
  let gameWon = checkWin(origBoard, player)
  if (gameWon) gameOver(gameWon)
}

// Function to check if a player has won the game
function checkWin(board, player) {
  let plays = board.reduce((a, e, i) => 
    (e === player) ? a.concat(i) : a, []);
  let gameWon = null;
  for (let [index, win] of winCombos.entries()) {
    if (win.every(elem => plays.indexOf(elem) > -1)) {
      gameWon = {index: index, player: player};
      break;
    }
  }
  return gameWon;
}

// Function to handle the end of the game
function gameOver(gameWon) {
  for (let index of winCombos[gameWon.index]) {
    document.getElementById(index).style.backgroundColor =
      gameWon.player == huPlayer ? "blue" : "red";
  }
  for (var i = 0; i < cells.length; i++) {
    cells[i].removeEventListener('click', turnClick, false);
  }
  declareWinner(gameWon.player == huPlayer ? "You win!" : "You lose.");
}

// Function to display the game result
function declareWinner(who) {
  document.querySelector(".endgame").style.display = "block";
  document.querySelector(".endgame .text").innerText = who;
}

// Function to find empty cells on the board
function emptySquares() {
  return origBoard.filter(s => typeof s == 'number');
}

// Function to determine the best move for the AI
function bestSpot() {
  return emptySquares()[0];
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

// Button click sound
const audio = new Audio("https://www.fesliyanstudios.com/play-mp3/387");
const buttons = document.querySelectorAll("button");

buttons.forEach(button => {
  button.addEventListener("click", () => {
    audio.play();
  });
});
