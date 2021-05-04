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
    gameboard.clearBoard();
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
  const render = (board) => {
    boardHTML = board.map(field => {
      const fieldHTML = document.createElement('div');
      fieldHTML.textContent = field;
      return fieldHTML;
    });

    const wrapperHTML = document.querySelector("#tictactoe");
    boardHTML.forEach(child => {
      wrapperHTML.appendChild(child);
    });

    return wrapperHTML;
  };

  return { render };
})();

console.log(displayController.render(gameBoard.getBoard()));

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
