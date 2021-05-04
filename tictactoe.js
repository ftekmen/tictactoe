const gameBoard = (() => {
  const board = Array(9).fill('X');

  const getBoard = () => {
    return board;
  };

  const setBoard = (pos, val) => {
    board[pos] = val;
  };

  const clearBoard = () => {
    board.fill('');
  };

  const countMarkers = (() => {
    let x = 0, o = 0;

    getBoard().map(field => field === 'X' ? x++ : o++);

    return { x, o };
  })();

  return { getBoard, setBoard, clearBoard, countMarkers };
})();

const game = (() => {
  const moveNo = 0;

  const start = () => {
    gameboard.clearBoard();
  };

  const checkWin = () => {
    if (moveNo >= 5) {

    }
  };

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
  }

  return { getName, getMarker, setMarker, markTheBoard };
};
