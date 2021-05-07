const GameBoard = (() => {
  const board = Array(9).fill('X');

  const getBoard = () => board;

  const getBoardField = (field) => board[field];

  const setBoard = (pos, val) => board[pos] = val;

  const clearBoard = () => board.fill('');

  const freeTilesCount = () => {
    return board.reduce((sum, tile) => {
      return sum = !tile ? ++sum : sum;
    }, 0);
  };

  return { getBoard, getBoardField, setBoard, clearBoard, freeTilesCount };
})();

const Game = (() => {
  const winnerPattern = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 4, 7], [2, 5, 8], [3, 6, 9], [1, 5, 9], [3, 5, 7]];
  let message = '';
  const scores = {
    X: 1,
    O: -1,
    tie: 0
  };

  const start = () => {
    GameBoard.clearBoard();
    DisplayController.renderBoard();
    DisplayController.markerSelection();
  };

  const checkWin = () => {
    let winner = null;
    for (const pattern of winnerPattern) {
      if (pattern.every(item => GameBoard.getBoardField(item) === 'X')) {
        winner = GameBoard.getBoardField(pattern[0]);
      } else if (pattern.every(item => GameBoard.getBoardField(item) === 'O')) {
        winner = GameBoard.getBoardField(pattern[0]);
      }

      if (winner) message = `Winner is ${winner}!`;

      if (GameBoard.freeTilesCount() === 0 && !winner) {
        message = 'Tie!';
        return 'tie';
      }
    }

    return winner;
  };

  const miniMax = (board, maximizing) => {
    let result = checkWin();
    if (result) return scores[result];

    if (maximizing) {
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

  return { start, checkWin, miniMax, getResult, setScores, getScores };
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

  const markerSelection = () => {
    const overlay = document.querySelector('#tictactoe .overlay');

    if (overlay === null) {
      const board = document.querySelector('#tictactoe');

      const overlay = document.createElement('div');
      overlay.className = 'overlay';

      const labelPlayerSelection = document.createElement('span');
      labelPlayerSelection.textContent = 'Select Player'
      overlay.appendChild(labelPlayerSelection);

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

  const removeMarkerSelection = () => {
    const board = document.querySelector('#tictactoe');
    const markerSelectionHTML = board.querySelector('.overlay');
    board.removeChild(markerSelectionHTML);
  };

  return { createBoard, renderBoard, markerSelection, removeMarkerSelection };
})();

const Player = (marker) => {
  const getMarker = () => marker;

  const markTheBoard = (pos) => {
    GameBoard.setBoard(pos, getMarker());
    Game.checkWin();
    DisplayController.renderBoard();
  };

  const bestMove = async () => {
    let bestScore = -Infinity;
    let move;

    GameBoard.getBoard().map((tile, index) => {
      if (tile === '') {
        GameBoard.setBoard(index, computer.getMarker());
        let score = Game.miniMax(GameBoard.getBoard(), false);
        GameBoard.setBoard(index, '');
        if (score > bestScore) {
          bestScore = score;
          move = index;
        }
      }
    });

    return new Promise((resolve) => {
      setTimeout(resolve(GameBoard.setBoard(move, computer.getMarker())), 200);
    });
  };

  return { getMarker, markTheBoard, bestMove };
};

DisplayController.createBoard();

// Start Game
const startButton = document.querySelector('#start button');
startButton.addEventListener('click', (e) => {
  Game.start();
});

let human, computer;

// Select Player Marker
const playerSelection = document.querySelector('#tictactoe');
playerSelection.addEventListener('click', async (e) => {
  if (e.target.className === 'x-button') {
    [human, computer] = [Player('X'), Player('O')];
    Game.setScores(1, 0);
    DisplayController.removeMarkerSelection();
    return;
  } else if (e.target.className === 'o-button') {
    [human, computer] = [Player('O'), Player('X')];
    Game.setScores(0, 1);
    DisplayController.removeMarkerSelection();
    return;
  }

  const clickedTileHTML = e.target;
  const clickedTileNo = clickedTileHTML.getAttribute('data-no');
  human.markTheBoard(clickedTileNo);
  await computer.bestMove();
});