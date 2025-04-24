import { Cell, CellState, CellValue, GameState } from './types';

export function createBoard(rows: number, cols: number, mines: number): Cell[][] {
  const board: Cell[][] = Array(rows).fill(null).map(() => 
    Array(cols).fill(null).map(() => ({
      value: 0,
      state: 'hidden'
    }))
  );

  // Place mines randomly
  let minesPlaced = 0;
  while (minesPlaced < mines) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);
    
    if (board[row][col].value !== 'mine') {
      board[row][col].value = 'mine';
      minesPlaced++;
      
      // Update adjacent cells
      for (let r = Math.max(0, row - 1); r <= Math.min(rows - 1, row + 1); r++) {
        for (let c = Math.max(0, col - 1); c <= Math.min(cols - 1, col + 1); c++) {
          if (board[r][c].value !== 'mine') {
            board[r][c].value = (board[r][c].value as number) + 1;
          }
        }
      }
    }
  }

  return board;
}

export function revealCell(board: Cell[][], row: number, col: number): Cell[][] {
  const newBoard = [...board];
  const cell = newBoard[row][col];

  if (cell.state === 'revealed' || cell.state === 'flagged') {
    return newBoard;
  }

  cell.state = 'revealed';

  // If it's an empty cell, reveal adjacent cells
  if (cell.value === 0) {
    for (let r = Math.max(0, row - 1); r <= Math.min(board.length - 1, row + 1); r++) {
      for (let c = Math.max(0, col - 1); c <= Math.min(board[0].length - 1, col + 1); c++) {
        if (r !== row || c !== col) {
          revealCell(newBoard, r, c);
        }
      }
    }
  }

  return newBoard;
}

export function toggleFlag(board: Cell[][], row: number, col: number): Cell[][] {
  const newBoard = [...board];
  const cell = newBoard[row][col];

  if (cell.state === 'revealed') {
    return newBoard;
  }

  cell.state = cell.state === 'flagged' ? 'hidden' : 'flagged';
  return newBoard;
}

export function getAdjacentMines(board: Cell[][], row: number, col: number): number {
  let count = 0;
  for (let r = Math.max(0, row - 1); r <= Math.min(board.length - 1, row + 1); r++) {
    for (let c = Math.max(0, col - 1); c <= Math.min(board[0].length - 1, col + 1); c++) {
      if (board[r][c].value === 'mine') {
        count++;
      }
    }
  }
  return count;
} 