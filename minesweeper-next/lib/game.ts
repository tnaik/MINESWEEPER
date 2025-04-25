import { Cell } from './types';

export const DIFFICULTY = {
  BEGINNER: {
    rows: 9,
    cols: 9,
    mines: 10
  },
  INTERMEDIATE: {
    rows: 16,
    cols: 16,
    mines: 40
  },
  EXPERT: {
    rows: 16,
    cols: 30,
    mines: 99
  }
};

export function createBoard(rows: number, cols: number, mines: number): Cell[][] {
  // Initialize empty board
  const board: Cell[][] = Array(rows).fill(null).map(() =>
    Array(cols).fill(null).map(() => ({
      state: 'hidden',
      value: 0
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
    }
  }

  // Calculate numbers for each cell
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (board[row][col].value !== 'mine') {
        let count = 0;
        
        // Check all adjacent cells
        for (let r = Math.max(0, row - 1); r <= Math.min(rows - 1, row + 1); r++) {
          for (let c = Math.max(0, col - 1); c <= Math.min(cols - 1, col + 1); c++) {
            if (board[r][c].value === 'mine') {
              count++;
            }
          }
        }
        
        board[row][col].value = count;
      }
    }
  }

  return board;
}

export function revealCell(board: Cell[][], row: number, col: number): Cell[][] {
  const newBoard = board.map(row => [...row]);
  
  if (newBoard[row][col].state === 'revealed' || newBoard[row][col].state === 'flagged') {
    return newBoard;
  }
  
  newBoard[row][col].state = 'revealed';
  
  // If empty cell, reveal adjacent cells
  if (newBoard[row][col].value === 0) {
    const rows = newBoard.length;
    const cols = newBoard[0].length;
    
    for (let r = Math.max(0, row - 1); r <= Math.min(rows - 1, row + 1); r++) {
      for (let c = Math.max(0, col - 1); c <= Math.min(cols - 1, col + 1); c++) {
        if (newBoard[r][c].state === 'hidden') {
          revealCell(newBoard, r, c);
        }
      }
    }
  }
  
  return newBoard;
}

export function toggleFlag(board: Cell[][], row: number, col: number): Cell[][] {
  const newBoard = board.map(row => [...row]);
  
  if (newBoard[row][col].state === 'revealed') {
    return newBoard;
  }
  
  newBoard[row][col].state = newBoard[row][col].state === 'flagged' ? 'hidden' : 'flagged';
  
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