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
	const board = Gameboard();
	let gameOver = false;

	const players = [
		{
			name: "",
			token: "X",
		},
		{
			name: "",
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
	};

	const checkTie = () => {
		const isBoardFull = board
			.getBoard()
			.every((row) => row.every((cell) => cell.getValue() !== ""));

		if (isBoardFull) {
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

		if (gameColumn[0] === gameColumn[1] && gameColumn[0] === gameColumn[2]) {
			gameOver = true;
			return true;
		} else if (gameRow[0] === gameRow[1] && gameRow[0] === gameRow[2]) {
			gameOver = true;
			return true;
		} else if (
			primDiag[0] !== "" &&
			primDiag[0] === primDiag[1] &&
			primDiag[0] === primDiag[2]
		) {
			gameOver = true;
			return true;
		} else if (
			secDiag[0] !== "" &&
			secDiag[0] === secDiag[1] &&
			secDiag[0] === secDiag[2]
		) {
			gameOver = true;
			return true;
		}

		if (checkTie()) {
			gameOver = true;
			return true;
		}

		return false;
	};

	const playRound = (row, column) => {
		if (gameOver) return;

		if (!board.isValidPlacement(row, column)) {
			return;
		}
		board.placeToken(row, column, getActivePlayer().token);

		if (checkWin(row, column)) {
			gameOver = true;
			return;
		}
		switchPlayerTurn();
		printNewRound();
	};

	return {
		playRound,
		getActivePlayer,
		getBoard: board.getBoard,
		switchPlayerTurn,
		players,
		checkTie,
		isGameOver: () => gameOver,
	};
}

(function ScreenController() {
	const game = GameController();
	const playerTurnDiv = document.querySelector(".turn");
	const boardDiv = document.querySelector(".board");
	const mainMenuDiv = document.querySelector(".main-menu");
	const gameDiv = document.querySelector(".container");
	const startButton = document.querySelector(".start");
	const restartDiv = document.querySelector(".restart");
	const restartButton = document.querySelector(".restart-button");

	const restartScreen = () => {
		if (game.checkTie()) {
			playerTurnDiv.textContent = "It's a tie";
		} else {
			playerTurnDiv.textContent = game.getActivePlayer().name + " wins!";
		}
		restartDiv.classList.add("visible");
	};

	const updateScreen = () => {
		boardDiv.textContent = "";

		const board = game.getBoard();
		const activePlayer = game.getActivePlayer();

		playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;

		board.forEach((row, rowIndex) => {
			row.forEach((cell, columnIndex) => {
				const cellButton = document.createElement("button");
				cellButton.classList.add("cell");
				cellButton.classList.add("jersey-10-regular");

				cellButton.dataset.row = rowIndex;
				cellButton.dataset.column = columnIndex;
				cellButton.textContent = cell.getValue();
				boardDiv.appendChild(cellButton);
			});
		});
	};

	function startMenuHandler(e) {
		mainMenuDiv.classList.add("hidden");
		gameDiv.classList.add("visible");
		game.players[0].name = document.getElementById("player-one").value;
		game.players[1].name = document.getElementById("player-two").value;
		updateScreen();
	}
	startButton.addEventListener("click", startMenuHandler);

	function restartHandler(e) {
		window.location.reload();
	}
	restartButton.addEventListener("click", restartHandler);

	function clickHandlerBoard(e) {
		const selectedColumn = e.target.dataset.column;
		const selectedRow = e.target.dataset.row;

		if (!selectedColumn || !selectedRow) return;

		game.playRound(selectedRow, selectedColumn);

		updateScreen();
		if (game.isGameOver()) {
			restartScreen();
		}
	}
	boardDiv.addEventListener("click", clickHandlerBoard);
})();
