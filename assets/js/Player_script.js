// Constructor for the TicTacToe game
function TicTacToe(placeholder, grid_size, callback) {
	// Save the placeholder element
	this.placeholder = placeholder;
	// Paint the placeholder with the game board
	this.paint(grid_size);
	// Save the callback function
	this.callback = callback;
	// Initialize player scores
	this.scores = {
		O: 0,
		X: 0
	};
	// Initialize marks and move count
	this.marks = {
		O: "O",  // Player 1 mark
		X: "X",  // Player 2 mark
		count: 0 // Number of moves made by players
	};
	// Return the instance
	return this;
}

// Prototype method to paint the game board
TicTacToe.prototype.paint = function(grid_size) {
	var self = this;
	// Get the number of columns, considering the board as an N x N board (e.g., 3 x 3)
	self.grid_size = grid_size;
	var html = '<table id="tic-tac-toe" align="center">';
	// Generate the HTML table for the game board
	for(var i = 0; i < grid_size; i++) {
		html += '<tr>';
		for(var j = 0; j < grid_size; j++) {
			html += '<td></td>';
		}
		html += '</tr>';
	}
	html += '</table>';
	// Set the HTML content of the placeholder element
	self.placeholder.innerHTML = html;
	// Find all columns (table cells) from the board
	self.columns = self.placeholder.getElementsByTagName("td");
	// Attach click event handlers to each column
	for(i = 0; i < this.columns.length; i++) {
		self.columns[i].addEventListener("click", markHandler);
	}
	// Event handler for column click
	function markHandler(e) {
		self.mark(e.target);
	}
};

// Prototype method to mark a column with a player's mark
TicTacToe.prototype.mark = function(column) {
	// Stop if the column is not empty
	if(column.innerHTML) {
		return;
	}
	// Increment the move count
	this.marks.count++;
	// Determine the current player's mark based on the move count
	var current_mark = this.marks.count % 2 === 1 ? this.marks.O : this.marks.X;
	// Fill the column with the current player's mark
	column.innerHTML = current_mark;
	column.classList.add(current_mark);
	// Check if the current player has won
	if(this.didWin(current_mark)) {
		// Increment the player's score
		if(this.marks.count % 2 === 1) {
			this.scores.O++;
		} else {
			this.scores.X++;
		}
		// Trigger the callback with the current mark and scores
		this.callback(current_mark, this.scores);
	} else if(this.marks.count === this.columns.length) {
		// If the board is full, trigger a draw
		this.callback("draw");
	}
};

// Prototype method to check if a player has won
TicTacToe.prototype.didWin = function(mark) {
	var grid_size = this.grid_size;
	var horizontal_count,
		vertical_count,
		right_to_left_count = 0,
		left_to_right_count = 0;
	// Loop through rows and columns to check for a winning combination
	for(var i = 0; i < grid_size; i++) {
		horizontal_count = vertical_count = 0;
		for(var j = 0; j < grid_size; j++) {
			// Check horizontal combinations
			if(this.columns[i * grid_size + j].innerHTML == mark) {
				horizontal_count++;
			}
			// Check vertical combinations
			if(this.columns[j * grid_size + i].innerHTML == mark) {
				vertical_count++;
			}
		}
		// If a horizontal or vertical combination is found, return true
		if(horizontal_count == grid_size || vertical_count == grid_size) {
			return true;
		}
		// Check diagonal combinations
		if(this.columns[i * grid_size + i].innerHTML == mark) {
			right_to_left_count++;
		}
		if(this.columns[(grid_size - 1) * (i + 1)].innerHTML == mark) {
			left_to_right_count++;
		}
	}
	// If a diagonal combination is found, return true
	if(right_to_left_count == grid_size || left_to_right_count == grid_size) {
		return true;
	}
	// If no winning combination is found, return false
	return false;
};

// Prototype method to clear the game board
TicTacToe.prototype.empty = function() {
	// Reset all columns by clearing their content and classes
	for(var i = 0; i < this.columns.length; i++) {
		this.columns[i].innerHTML = '';
		this.columns[i].classList.remove(this.marks.O);
		this.columns[i].classList.remove(this.marks.X);
	}
	// Reset the move count
	this.marks.count = 0;
};

// Prototype method to reset the game
TicTacToe.prototype.reset = function() {
	this.empty();
	// Reset player scores
	this.scores = {
		O: 0,
		X: 0
	};
};

// Initialize the game
var placeholder = document.getElementById("placeholder");
var tictactoe = new TicTacToe(placeholder, 3, onResult);

// Callback function to handle game results
function onResult(result, scores) {
	if(result == 'draw') {
		alert("It's a draw! Better luck next time!");
	} else {
		alert(result + " has won this round");
		updateScores(scores.O, scores.X);
	}
	tictactoe.empty();
}

// Function to update player scores on the scoreboard
function updateScores(O, X) {
	document.querySelector("#scoreboard #player1").innerHTML = O;
	document.querySelector("#scoreboard #player2").innerHTML = X;
}

// Function to restart the game with an optional grid size parameter
function restart(grid_size) {
	tictactoe.reset();
	updateScores(0, 0);
	if(grid_size) {
		tictactoe.paint(grid_size);
	}
}

// Button click sound setup
const audio = new Audio("https://www.fesliyanstudios.com/play-mp3/387");
const buttons = document.querySelectorAll("button");

buttons.forEach(button => {
	button.addEventListener("click", () => {
		audio.play();
	});
});
