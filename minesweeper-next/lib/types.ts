export type CellState = 'hidden' | 'revealed' | 'flagged';
export type CellValue = number | 'mine';

export interface Cell {
  value: CellValue;
  state: CellState;
}

export interface GameState {
  board: Cell[][];
  gameStatus: 'ongoing' | 'won' | 'lost';
  minesLeft: number;
} 