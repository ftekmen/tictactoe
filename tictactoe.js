const GameBoard = (() => {
  const board = Array(9).fill('X');

  const getBoard = () => board;

  const getBoardField = (field) => board[field];

  const setBoard = (pos, val) => board[pos] = val;

  const clearBoard = () => board.fill('');

  const freeTilesCount = () => {
    return board.reduce((sum, tile) => {
      sum = !tile ? sum++ : sum;
    }, 0);
  };

  const countMarkers = (() => {
    let x = 0, o = 0;

    getBoard().forEach(field => field === 'X' ? x++ : o++);

    return { x, o };
  })();

  return { getBoard, getBoardField, setBoard, clearBoard, freeTilesCount, countMarkers };
})();

const Game = (() => {
  const winnerPattern = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 4, 7], [2, 5, 8], [3, 6, 9], [1, 5, 9], [3, 5, 7]];
  let winner = '';
  let result = '';
  let moveNo = 0;
  let end;

  const start = () => {
    end = false;
    GameBoard.clearBoard();
    DisplayController.renderBoard();
    DisplayController.markerSelection();
  };

  const checkWin = () => {
    if (moveNo >= 5) {
      for (const pattern of winnerPattern) {
        if (pattern.every(item => GameBoard.getBoardField(item) === 'X' || GameBoard.getBoardField(item) === 'O')) {
          winner = pattern[0];
          result = `Winner is ${winner}!`;
          finish();
          return winner;
        }

        if (GameBoard.freeTilesCount() === 0 && !winner) {
          result = 'Tie!';
          finish();
          return 'tie';
        }
      }
    }

    return false;
  };

  const getWinner = () => winner;

  const getResult = () => result;

  const setMoveNo = () => moveNo++;

  const getMoveNo = () => moveNo;

  const finish = () => end = true;

  return { start, checkWin, getWinner, getResult, setMoveNo, getMoveNo };
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
    Game.setMoveNo();
    Game.checkWin();
    DisplayController.renderBoard();
  }

  return { getMarker, markTheBoard };
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
playerSelection.addEventListener('click', (e) => {
  if (e.target.className === 'x-button') {
    [human, computer] = [Player('X'), Player('O')];
    DisplayController.removeMarkerSelection();
    return;
  } else if (e.target.className === 'o-button') {
    [human, computer] = [Player('O'), Player('X')];
    DisplayController.removeMarkerSelection();
    return;
  }

  const clickedTileHTML = e.target;
  const clickedTileNo = clickedTileHTML.getAttribute('data-no');
  human.markTheBoard(clickedTileNo);
});