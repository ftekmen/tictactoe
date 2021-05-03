const gameBoard = (() => {
  const board = Array(9).fill('X');

  const getBoard = () => {
    return board;
  }

  return { getBoard };
})();

const game = (() => {

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

const player = () => {
  const name = "";

  const getName = () => {

  };

  return { getName };
};
