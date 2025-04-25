export type CellState = 'hidden' | 'revealed' | 'flagged';
export type CellValue = number | 'mine';

export interface Cell {
  state: CellState;
  value: CellValue;
}

export type GameStatus = 'ongoing' | 'won' | 'lost';

export interface GameState {
  board: Cell[][];
  gameStatus: GameStatus;
  minesLeft: number;
} 