import { useEffect, useState } from 'react';
import { Cell as CellType } from '../lib/types';

interface AIHelperProps {
  board: CellType[][];
  onSuggestMove: (move: { row: number; col: number; confidence: string; reason: string }) => void;
  enabled: boolean;
  gameStatus: 'ongoing' | 'won' | 'lost';
}

interface CellProbability {
  row: number;
  col: number;
  probability: number;
  reason: string;
}

export default function AIHelper({ board, onSuggestMove, enabled, gameStatus }: AIHelperProps) {
  const [lastAnalysis, setLastAnalysis] = useState<number>(0);

  useEffect(() => {
    if (!enabled || !board.length || gameStatus !== 'ongoing') {
      return;
    }

    // Only analyze the board if it's been more than 1 second since the last analysis
    const now = Date.now();
    if (now - lastAnalysis < 1000) {
      return;
    }

    const analyzeBoard = () => {
      const probabilities: CellProbability[] = [];
      
      // Analyze each cell
      for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[0].length; col++) {
          const cell = board[row][col];
          
          // Skip revealed cells
          if (cell.state === 'revealed') continue;
          
          // If cell is flagged, it's already marked as a mine
          if (cell.state === 'flagged') continue;
          
          // Calculate probability based on adjacent revealed cells
          let probability = 0;
          let reason = '';
          
          // Check adjacent cells
          for (let r = Math.max(0, row - 1); r <= Math.min(board.length - 1, row + 1); r++) {
            for (let c = Math.max(0, col - 1); c <= Math.min(board[0].length - 1, col + 1); c++) {
              if (r === row && c === col) continue;
              
              const adjacentCell = board[r][c];
              if (adjacentCell.state === 'revealed' && typeof adjacentCell.value === 'number') {
                // Count adjacent hidden cells
                let hiddenCount = 0;
                let flaggedCount = 0;
                
                for (let ar = Math.max(0, r - 1); ar <= Math.min(board.length - 1, r + 1); ar++) {
                  for (let ac = Math.max(0, c - 1); ac <= Math.min(board[0].length - 1, c + 1); ac++) {
                    if (ar === r && ac === c) continue;
                    
                    const cell = board[ar][ac];
                    if (cell.state === 'hidden') hiddenCount++;
                    if (cell.state === 'flagged') flaggedCount++;
                  }
                }
                
                // If all remaining adjacent cells must be mines
                if (adjacentCell.value - flaggedCount === hiddenCount) {
                  probability = 1;
                  reason = "All remaining adjacent cells must be mines";
                }
                // If all mines are already flagged
                else if (adjacentCell.value === flaggedCount) {
                  probability = 0;
                  reason = "All mines are already flagged";
                }
                // Otherwise, calculate probability based on remaining mines
                else if (hiddenCount > 0) {
                  const remainingMines = adjacentCell.value - flaggedCount;
                  const cellProbability = remainingMines / hiddenCount;
                  if (cellProbability > probability) {
                    probability = cellProbability;
                    reason = `Based on adjacent cell with ${adjacentCell.value} mines`;
                  }
                }
              }
            }
          }
          
          if (probability !== undefined) {
            probabilities.push({
              row,
              col,
              probability,
              reason
            });
          }
        }
      }
      
      // Find the safest move (lowest probability of being a mine)
      const safestMove = probabilities.reduce((safest, current) => {
        if (!safest || current.probability < safest.probability) {
          return current;
        }
        return safest;
      }, null as CellProbability | null);
      
      if (safestMove) {
        const move = {
          row: safestMove.row,
          col: safestMove.col,
          confidence: safestMove.probability === 0 ? 'High' : 
                     safestMove.probability < 0.3 ? 'Medium' : 'Low',
          reason: safestMove.reason
        };
        console.log('AI suggesting move:', move);
        onSuggestMove(move);
      }
    };

    analyzeBoard();
    setLastAnalysis(Date.now());
  }, [board, enabled, gameStatus, onSuggestMove, lastAnalysis]);

  return null;
} 