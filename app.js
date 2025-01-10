function Gameboard() {
	const rows = 3;
	const columns = 3;
	const board = [];

	for (let i = 0; i < rows; i++) {
		board[i] = [];
		for (let j = 0; j < columns; j++) {
			board[i].push(Cell());
		}
	}

	const getBoard = () => board;

	const placeToken = (row, column, player) => {
		if (board[row][column].getValue() !== 0) {
			return;
		}
		board[row][column].addToken(player);
	};

	const printBoard = () => {
		boardWithCellValues = board.map((row) =>
			row.map((cell) => cell.getValue())
		);
		console.log(boardWithCellValues);
	};

	return { getBoard, placeToken, printBoard };
}

function Cell() {
	let value = 0;

	const addToken = (player) => {
		value = player;
	};

	const getValue = () => value;

	return { addToken, getValue };
}

function GameController() {
	playerOneName = "Player One";
	playerTwoName = "Player Two";

	const board = Gameboard();

	const players = [
		{
			name: playerOneName,
			token: "X",
		},
		{
			name: playerTwoName,
			token: "O",
		},
	];

	let activePlayer = players[0];

	const switchPlayerTurn = () => {
		activePlayer = activePlayer === players[0] ? players[1] : players[0];
	};

	const getActivePlayer = () => activePlayer;

	const printNewRound = () => {
		board.printBoard();
		console.log(`${getActivePlayer().name}'s turn.`);
	};

	const checkTie = () => {
		const isBoardFull = board
			.getBoard()
			.every((row) => row.every((cell) => cell.getValue() !== 0));

		if (isBoardFull) {
			console.log("It's a tie!");
			return true;
		}

		return false;
	};

	const checkWin = (row, column) => {
		const gameColumn = board.getBoard().map((row) => row[column].getValue());
		const gameRow = board.getBoard()[row].map((row) => row.getValue());
		const primDiag = [];
		const secDiag = [];

		for (let i = 0; i < board.getBoard().length; i++) {
			for (let j = 0; j < board.getBoard().length; j++) {
				if (i === j) {
					primDiag.push(board.getBoard()[i][j].getValue());
				}

				if (i + j === board.getBoard().length - 1) {
					secDiag.push(board.getBoard()[i][j].getValue());
				}
			}
		}

		console.log("Column: " + gameColumn);
		console.log("Row: " + gameRow);
		console.log("Primary diagonal" + primDiag);
		console.log("Secondary diagonal: " + secDiag);

		if (gameColumn[0] === gameColumn[1] && gameColumn[0] === gameColumn[2]) {
			console.log(`${getActivePlayer().name} wins`);
			return true;
		} else if (gameRow[0] === gameRow[1] && gameRow[0] === gameRow[2]) {
			console.log(`${getActivePlayer().name} wins`);
			return true;
		} else if (
			primDiag[0] !== 0 &&
			primDiag[0] === primDiag[1] &&
			primDiag[0] === primDiag[2]
		) {
			console.log(`${getActivePlayer().name} wins`);
			return true;
		} else if (
			secDiag[0] !== 0 &&
			secDiag[0] === secDiag[1] &&
			secDiag[0] === secDiag[2]
		) {
			console.log(`${getActivePlayer().name} wins`);
			return true;
		}

		if (checkTie()) {
			return true;
		}
	};

	const playRound = (row, column) => {
		board.placeToken(row, column, getActivePlayer().token);
		if (!checkWin(row, column)) {
			switchPlayerTurn();
			printNewRound();
		} else {
			board.printBoard();
		}
	};

	printNewRound();

	return { playRound, getActivePlayer, getBoard: board.getBoard };
}

function ScreenController() {
	const game = GameController();
	const playerTurnDiv = document.querySelector(".turn");
	const boardDiv = document.querySelector(".board");

	const updateScreen = () => {
		// clear the board
		boardDiv.textContent = "";

		// get the newest version of the board and player turn
		const board = game.getBoard();
		const activePlayer = game.getActivePlayer();

		// Display player's turn
		playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;

		// Render board squares
		board.forEach((row, rowIndex) => {
			row.forEach((cell, columnIndex) => {
				// Anything clickable should be a button!!
				const cellButton = document.createElement("button");
				cellButton.classList.add("cell");
				// Create a data attribute to identify the column
				// This makes it easier to pass into our `playRound` function
				cellButton.dataset.row = rowIndex;
				cellButton.dataset.column = columnIndex;
				cellButton.textContent = cell.getValue();
				boardDiv.appendChild(cellButton);
			});
		});
	};

	// Add event listener for the board
	function clickHandlerBoard(e) {
		const selectedColumn = e.target.dataset.column;
		const selectedRow = e.target.dataset.row;
		// Make sure I've clicked a column and not the gaps in between
		if (!selectedColumn || !selectedRow) return;

		game.playRound(selectedRow, selectedColumn);
		updateScreen();
	}
	boardDiv.addEventListener("click", clickHandlerBoard);

	// Initial render
	updateScreen();

	// We don't need to return anything from this module because everything is encapsulated inside this screen controller.
}

ScreenController();

/* function player1Row() {
	game.playRound(0, 0); // Player 1 places "X"
	game.playRound(1, 0); // Player 2 places "O"
	game.playRound(0, 1); // Player 1 places "X"
	game.playRound(1, 1); // Player 2 places "O"
	game.playRound(0, 2); // Player 1 places "X" - WIN!
}

function player1Column() {
	game.playRound(0, 0); // Player 1 places "X"
	game.playRound(0, 1); // Player 2 places "O"
	game.playRound(1, 0); // Player 1 places "X"
	game.playRound(1, 1); // Player 2 places "O"
	game.playRound(2, 0); // Player 1 places "X" - WIN!
}

function player1primDiag() {
	game.playRound(0, 0); // Player 1 places "X"
	game.playRound(0, 1); // Player 2 places "O"
	game.playRound(1, 1); // Player 1 places "X"
	game.playRound(0, 2); // Player 2 places "O"
	game.playRound(2, 2); // Player 1 places "X" - WIN!
}

function player1secDiag() {
	game.playRound(0, 2); // Player 1 places "X" in top-right
	game.playRound(0, 0); // Player 2 places "O"
	game.playRound(1, 1); // Player 1 places "X" in center
	game.playRound(0, 1); // Player 2 places "O"
	game.playRound(2, 0); // Player 1 places "X" in bottom-left - WIN!
}

function tie() {
	game.playRound(0, 1); // Player 1 places "X"
	game.playRound(0, 0); // Player 2 places "O"
	game.playRound(1, 0); // Player 1 places "X"
	game.playRound(0, 2); // Player 2 places "O"
	game.playRound(1, 1); // Player 1 places "X"
	game.playRound(1, 2); // Player 2 places "O"
	game.playRound(2, 0); // Player 1 places "X"
	game.playRound(2, 1); // Player 2 places "O"
	game.playRound(2, 2); // Player 1 places "X" - **Tie!**
}

player1Row();
player1Column();
player1primDiag();
player1secDiag();
tie(); */
/* 
	TODO:
		- Keep players from playing in spots that are taken
		- Start DOM
*/
