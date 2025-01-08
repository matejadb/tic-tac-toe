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

		/* console.log(gameColumn);
		console.log(gameRow);
		console.log(primDiag);
		console.log(secDiag); */

		if (gameColumn[0] === gameColumn[1] && gameColumn[0] === gameColumn[2]) {
			console.log(`${getActivePlayer().name} wins`);
			return true;
		} else if (gameRow[0] === gameRow[1] && gameRow[0] === gameRow[2]) {
			console.log(`${getActivePlayer().name} wins`);
			return true;
		} else if (primDiag[0] === primDiag[1] && primDiag[0] === primDiag[2]) {
			console.log(`${getActivePlayer().name} wins`);
			return true;
		} else if (
			secDiag[0] === secDiag[1] &&
			secDiag[0] === secDiag[2] &&
			secDiag[0] !== 0
		) {
			console.log(`${getActivePlayer().name} wins`);
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

	return { playRound, getActivePlayer };
}

const game = GameController();
//game.playRound(0, 0);
//game.playRound(1, 1);
//game.playRound(0, 1);
//game.playRound(1, 2);
//game.playRound(0, 2);

game.playRound(0, 0); // Player 1 places "X" at (0, 0)
game.playRound(0, 1); // Player 2 places "O" at (0, 1)
game.playRound(0, 2); // Player 1 places "X" at (0, 2)
game.playRound(1, 0); // Player 2 places "O" at (1, 0)
game.playRound(1, 1); // Player 1 places "X" at (1, 1)
game.playRound(1, 2); // Player 2 places "O" at (1, 2)
game.playRound(2, 0); // Player 1 places "X" at (2, 0)
//game.playRound(2, 1); // Player 2 places "O" at (2, 1)
//game.playRound(2, 2); // Player 1 places "X" at (2, 2)

/* 
	TODO:
		- Keep players from playing in spots that are taken
		- Check for ties
*/
