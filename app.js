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

	const isValidPlacement = (row, column) => {
		return board[row][column].getValue() === "";
	};

	const placeToken = (row, column, player) => {
		if (!isValidPlacement(row, column)) {
			return;
		} else board[row][column].addToken(player);
	};

	const printBoard = () => {
		boardWithCellValues = board.map((row) =>
			row.map((cell) => cell.getValue())
		);
		console.log(boardWithCellValues);
	};

	return { getBoard, placeToken, printBoard, isValidPlacement };
}

function Cell() {
	let value = "";

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
			.every((row) => row.every((cell) => cell.getValue() !== ""));

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
			primDiag[0] !== "" &&
			primDiag[0] === primDiag[1] &&
			primDiag[0] === primDiag[2]
		) {
			console.log(`${getActivePlayer().name} wins`);
			return true;
		} else if (
			secDiag[0] !== "" &&
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
		if (!board.isValidPlacement(row, column)) {
			console.log("no");
			return;
		}
		board.placeToken(row, column, getActivePlayer().token);
		if (!checkWin(row, column)) {
			switchPlayerTurn();
			printNewRound();
		} else {
			board.printBoard();
		}
	};

	printNewRound();

	return {
		playRound,
		getActivePlayer,
		getBoard: board.getBoard,
		switchPlayerTurn,
	};
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
				cellButton.classList.add("jersey-10-regular");
				// Create a data attribute to identify the column
				// This makes it easier to pass into our `playRound` function
				cellButton.dataset.row = rowIndex;
				cellButton.dataset.column = columnIndex;
				cellButton.textContent = cell.getValue();
				boardDiv.appendChild(cellButton);
			});
		});
	};

	function clickHandlerBoard(e) {
		const selectedColumn = e.target.dataset.column;
		const selectedRow = e.target.dataset.row;
		// Make sure I've clicked a column and not the gaps in between
		if (!selectedColumn || !selectedRow) return;

		game.playRound(selectedRow, selectedColumn);
		updateScreen();
	}
	boardDiv.addEventListener("click", clickHandlerBoard);

	updateScreen();
}

ScreenController();

/* 
	TODO:
		- Style the game
		- Add option to change names
		- Add start button
		- Add restart button
*/
