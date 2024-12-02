// Create the game board
const board = [];
const rows = 6;
const cols = 7;
let currentPlayer = 'red'; // 'red' or 'yellow'
let gameOver = false; // Flag to track if the game is over

// Audio elements
const dropSound = document.getElementById('drop-sound');
const winSound = document.getElementById('win-sound');

// Restart button
const restartBtn = document.getElementById('restart-btn');

// Winner message div
const winnerMessageDiv = document.getElementById('winner-message');

// Turn indicator div
const turnIndicator = document.getElementById('turn-indicator');

// Create the board grid dynamically
const gameBoard = document.getElementById('game-board');
for (let r = 0; r < rows; r++) {
  board[r] = [];
  for (let c = 0; c < cols; c++) {
    board[r][c] = null; // Empty cell
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.row = r;
    cell.dataset.col = c;
    gameBoard.appendChild(cell);
  }
}

// Function to handle cell click (drop a piece)
gameBoard.addEventListener('click', (e) => {
  if (gameOver) return; // If the game is over, prevent further moves

  const cell = e.target;
  const col = cell.dataset.col;

  if (!col) return; // Only handle clicks on cells

  const colIndex = parseInt(col);

  // Find the lowest empty row in this column
  for (let rowIndex = rows - 1; rowIndex >= 0; rowIndex--) {
    if (board[rowIndex][colIndex] === null) {
      board[rowIndex][colIndex] = currentPlayer;
      updateBoard();
      dropSound.play(); // Play drop sound

      // After placing the piece, check for a winner
      if (checkWinner(rowIndex, colIndex)) {
        winSound.play(); // Play win sound

        // Show the winner message with a delay
        setTimeout(() => {
          winnerMessageDiv.textContent = `${currentPlayer} wins!`;
          winnerMessageDiv.classList.add('show');
          gameOver = true; // Stop the game
        }, 1000); // 1-second delay for sound to play before showing the message
      } else {
        currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red'; // Switch players
        turnIndicator.textContent = currentPlayer === 'red' ? "Player 1 Turn" : "Player 2 Turn"; // Update turn indicator
      }
      break;
    }
  }
});

// Update the visual board after a move
function updateBoard() {
  const cells = document.querySelectorAll('.cell');
  cells.forEach(cell => {
    const r = cell.dataset.row;
    const c = cell.dataset.col;
    if (board[r][c]) {
      cell.classList.add(board[r][c]);
    } else {
      cell.classList.remove('red', 'yellow'); // Clear the cell if no piece is present
    }
  });
}

// Check if there is a winner
function checkWinner(row, col) {
  return (
    checkDirection(row, col, 1, 0) ||  // Horizontal
    checkDirection(row, col, 0, 1) ||  // Vertical
    checkDirection(row, col, 1, 1) ||  // Diagonal /
    checkDirection(row, col, 1, -1)    // Diagonal \
  );
}

// Check for 4 pieces in a row in a given direction
function checkDirection(row, col, rowDelta, colDelta) {
  let count = 1;
  let r = row + rowDelta;
  let c = col + colDelta;

  // Count in the positive direction
  while (r >= 0 && r < rows && c >= 0 && c < cols && board[r][c] === currentPlayer) {
    count++;
    r += rowDelta;
    c += colDelta;
  }

  r = row - rowDelta;
  c = col - colDelta;

  // Count in the negative direction
  while (r >= 0 && r < rows && c >= 0 && c < cols && board[r][c] === currentPlayer) {
    count++;
    r -= rowDelta;
    c -= colDelta;
  }

  return count >= 4;
}

// Restart the game
restartBtn.addEventListener('click', () => {
  // Clear the board and reset the game
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      board[r][c] = null;
    }
  }
  updateBoard();
  winnerMessageDiv.classList.remove('show'); // Hide winner message
  turnIndicator.textContent = "Player 1 Turn"; // Reset turn indicator
  currentPlayer = 'red';
  gameOver = false; // Reset game over flag
});

