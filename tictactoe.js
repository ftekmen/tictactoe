const GameBoard = (() => {
  const board = Array(9).fill('X');

  const getBoard = () => board;

  const getBoardField = (field) => board[field];

  const setBoardField = (pos, val) => board[pos] = val;

  const clearBoard = () => board.fill('');

  const freeTilesCount = () => {
    return board.reduce((sum, tile) => {
      return sum = !tile ? ++sum : sum;
    }, 0);
  };

  return { getBoard, getBoardField, setBoardField, clearBoard, freeTilesCount };
})();

const Game = (() => {
  const winnerPattern = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  let started = false;
  let ended = false;
  let message = '';
  const scores = {
    X: -1,
    O: 1,
    tie: 0
  };

  const startPressed = () => {
    GameBoard.clearBoard();
    DisplayController.renderBoard();
    DisplayController.playerSelection();
  };

  const selectPlayer = (human) => {
    let computer;
    if (human === 'X') {
      Game.setScores(-1, 1);
      computer = 'O';
    } else {
      Game.setScores(1, -1);
      computer = 'X';
    }
    DisplayController.removeOverlay();
    Game.start();
    DisplayController.setRestartButton();
    return [Player(human), Player(computer)];
  };

  const start = () => [started, ended] = [true, false];

  const finish = () => [started, ended] = [false, true];

  const isStarted = () => started === true;

  const isOver = () => ended === true;

  const getMessage = () => message;

  const checkWin = () => {
    let winner = null;
    for (const pattern of winnerPattern) {
      if (pattern.every(item => GameBoard.getBoardField(item) === 'X')) {
        winner = GameBoard.getBoardField(pattern[0]);
      } else if (pattern.every(item => GameBoard.getBoardField(item) === 'O')) {
        winner = GameBoard.getBoardField(pattern[0]);
      }

      if (winner) {
        message = `Player ${winner} is winner!`;
      }
    }

    if (GameBoard.freeTilesCount() === 0 && !winner) {
      message = 'Tie!';
      return 'tie';
    }

    return winner;
  };

  const miniMax = (board, isMaximizing) => {
    let result = checkWin();
    if (result) return scores[result];

    if (isMaximizing) {
      let bestScore = -Infinity;
      board.map((tile, index) => {
        if (tile === '') {
          board[index] = computer.getMarker();
          let score = miniMax(board, false);
          // console.log(score);
          board[index] = '';
          bestScore = Math.max(score, bestScore);
        }
      });

      return bestScore;
    } else {
      let bestScore = Infinity;
      board.map((tile, index) => {
        if (tile === '') {
          board[index] = human.getMarker();
          let score = miniMax(board, true);
          board[index] = '';
          bestScore = Math.min(score, bestScore);
        }
      });

      return bestScore;
    }
  };

  const getResult = () => result;

  const setScores = (x, o) => {
    scores.X = x;
    scores.O = o;
  };

  const getScores = () => scores;

  return { startPressed, selectPlayer, start, finish, isStarted, isOver, checkWin, miniMax, getResult, setScores, getScores, getMessage };
})();

const DisplayController = (() => {
  const createBoard = () => {
    const boardHTML = GameBoard.getBoard().map((tile, index) => {
      const tileHTML = document.createElement('div');
      tileHTML.className = 'tile';
      tileHTML.setAttribute('data-no', index);
      tileHTML.textContent = tile;
      return tileHTML;
    });

    const wrapperHTML = document.querySelector("#tictactoe");
    boardHTML.forEach(child => {
      wrapperHTML.appendChild(child);
    });

    return wrapperHTML;
  };

  const renderBoard = () => {
    const tilesHTML = document.querySelectorAll("#tictactoe div");
    GameBoard.getBoard().map((tile, index) => {
      tilesHTML[index].textContent = tile;
    });
  };

  const playerSelection = () => {
    const overlay = document.querySelector('#tictactoe .overlay');

    if (overlay === null) {
      const board = document.querySelector('#tictactoe');

      const overlay = createOverlay('Select Player');
      const buttonWrapper = document.createElement('div');

      const xButton = document.createElement('button');
      xButton.className = 'x-button';
      xButton.textContent = 'X';

      const oButton = document.createElement('button');
      oButton.className = 'o-button';
      oButton.textContent = 'O';

      buttonWrapper.appendChild(xButton);
      buttonWrapper.appendChild(oButton);

      overlay.appendChild(buttonWrapper);

      board.appendChild(overlay);
    }
  };

  const winMessage = () => {
    let overlay = document.querySelector('#tictactoe .overlay');

    if (overlay === null) {
      const board = document.querySelector('#tictactoe');
      overlay = createOverlay(Game.getMessage());
      board.appendChild(overlay);
    }
  };

  const createOverlay = (message) => {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';

    const overlayText = document.createElement('span');
    overlayText.textContent = message;
    overlay.appendChild(overlayText);

    return overlay;
  };

  const removeOverlay = () => {
    const board = document.querySelector('#tictactoe');
    const playerSelectionHTML = board.querySelector('.overlay');
    board.removeChild(playerSelectionHTML);
  };

  const setRestartButton = () => {
    document.querySelector('#start button').textContent = "Restart Game";
  };

  return { createBoard, renderBoard, playerSelection, winMessage, createOverlay, removeOverlay, setRestartButton };
})();

const Player = (marker) => {
  const getMarker = () => marker;

  const markTheBoard = (pos) => {
    if (!GameBoard.getBoardField(pos)) {
      GameBoard.setBoardField(pos, getMarker());
      DisplayController.renderBoard();
      Game.checkWin() && Game.finish() && DisplayController.winMessage();
    }
  };

  const bestMove = () => {
    let bestScore = -Infinity;
    let move;

    GameBoard.getBoard().map((tile, index) => {
      if (tile === '') {
        GameBoard.setBoardField(index, getMarker());
        let score = Game.miniMax(GameBoard.getBoard(), false);
        GameBoard.setBoardField(index, '');
        if (score > bestScore) {
          bestScore = score;
          move = index;
        }
      }
    });

    GameBoard.setBoardField(move, getMarker());
    DisplayController.renderBoard();
    Game.checkWin() && Game.finish() && DisplayController.winMessage();
  };

  return { getMarker, markTheBoard, bestMove };
};

DisplayController.createBoard();

// Start Game
const startButton = document.querySelector('#start button');
startButton.addEventListener('click', (e) => {
  Game.isOver() && DisplayController.removeOverlay();
  Game.startPressed();
});

let human, computer;

// Select Player Marker
const playerSelection = document.querySelector('#tictactoe');
playerSelection.addEventListener('click', (e) => {
  if (e.target.className === 'x-button') {
    [human, computer] = Game.selectPlayer('X');
    return;
  } else if (e.target.className === 'o-button') {
    [human, computer] = Game.selectPlayer('O');
    computer.bestMove();
    return;
  }

  if (e.target.className === 'tile' && e.target.textContent !== '') return;

  if (Game.isStarted() && !Game.isOver()) {
    const clickedTileHTML = e.target;
    const clickedTileNo = clickedTileHTML.getAttribute('data-no');
    human.markTheBoard(clickedTileNo);
  }

  Game.isStarted() && !Game.isOver() && computer.bestMove();
});