const gameBoard = (() => {
  const board = Array(9).fill('X');

  const getBoard = () => {
    return board;
  };

  const getBoardField = (field) => {
    return board[field];
  };

  const setBoard = (pos, val) => {
    board[pos] = val;
  };

  const clearBoard = () => {
    board.fill('');
  };

  const countMarkers = (() => {
    let x = 0, o = 0;

    getBoard().forEach(field => field === 'X' ? x++ : o++);

    return { x, o };
  })();

  return { getBoard, getBoardField, setBoard, clearBoard, countMarkers };
})();

const game = (() => {
  const winnerPattern = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 4, 7], [2, 5, 8], [3, 6, 9], [1, 5, 9], [3, 5, 7]];
  let winner = '';
  let moveNo = 0;
  let end = false;

  const start = () => {
    gameBoard.clearBoard();
    displayController.renderBoard();
    displayController.markerSelection();
  };

  const checkWin = () => {
    if (moveNo >= 5) {
      winnerPattern.forEach(pattern => {
        if (pattern.every(item => gameBoard.getBoardField(item) === 'X' || gameBoard.getBoardField(item) === 'O')) {
          winner = pattern[0];
          finish();
          return;
        }
      })
    }
  };

  const finish = () => {
    end = true;
  }

  return { start, checkWin };
})();

const displayController = (() => {
  const createBoard = () => {
    const boardHTML = gameBoard.getBoard().map(tile => {
      const tileHTML = document.createElement('div');
      tileHTML.className = 'tile';
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
    gameBoard.getBoard().map((tile, index) => {
      tilesHTML[index].textContent = tile;
    });
  };

  const markerSelection = () => {
    const overlay = document.querySelector('#tictactoe .overlay');

    if (overlay === null) {
      const board = document.querySelector('#tictactoe');

      const overlay = document.createElement('div');
      overlay.className = 'overlay';

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

  return { createBoard, renderBoard, markerSelection };
})();

displayController.createBoard();

const player = (name, marker) => {
  const getName = () => {
    return name;
  };

  const getMarker = () => {
    return marker;
  }

  const markTheBoard = (pos) => {
    gameBoard.setBoard(pos, val);
    game.checkWin();
  }

  return { getName, getMarker, markTheBoard };
};

const startButton = document.querySelector('#start button');
startButton.addEventListener('click', (e) => {
  game.start();
});