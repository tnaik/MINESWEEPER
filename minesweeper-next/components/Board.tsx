import { useState, useEffect } from 'react';
import Cell from './Cell';
import AIHelper from './AIHelper';
import { createBoard, revealCell, toggleFlag, getAdjacentMines } from '../lib/game';
import { Cell as CellType } from '../lib/types';

// Define prop types
interface BoardProps {
  difficulty: {
    rows: number;
    cols: number;
    mines: number;
  };
  gameStatus: 'ongoing' | 'won' | 'lost';
  onGameStatusChange: (status: 'ongoing' | 'won' | 'lost') => void;
  resetTrigger: number;
  aiEnabled: boolean;
  suggestedMove: { row: number; col: number; confidence: string; reason: string } | null;
  onSuggestMove: (move: { row: number; col: number; confidence: string; reason: string }) => void;
}

export default function Board({ 
  difficulty, 
  gameStatus, 
  onGameStatusChange, 
  resetTrigger,
  aiEnabled,
  suggestedMove,
  onSuggestMove
}: BoardProps) {
  const [board, setBoard] = useState<CellType[][]>([]);
  const [remainingFlags, setRemainingFlags] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  // Initialize game on component mount or difficulty change
  useEffect(() => {
    const { rows, cols, mines } = difficulty;
    const newBoard = createBoard(rows, cols, mines);
    
    setBoard(newBoard);
    setRemainingFlags(mines);
    setElapsedTime(0);
    
    if (gameStatus === 'ongoing') {
      startTimer();
    }
    
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [difficulty, resetTrigger]);

  // Update timer display
  useEffect(() => {
    if (gameStatus === 'ongoing') {
      startTimer();
    } else if (timer) {
      clearInterval(timer);
    }
    
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [gameStatus]);

  // Start timer
  const startTimer = () => {
    if (timer) {
      clearInterval(timer);
    }
    
    const newTimer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    
    setTimer(newTimer);
  };

  // Handle cell click
  const handleCellClick = (row: number, col: number) => {
    if (gameStatus !== 'ongoing') {
      return;
    }
    
    const newBoard = revealCell(board, row, col);
    setBoard(newBoard);
    
    // Check if game is won or lost
    const cell = newBoard[row][col];
    if (cell.value === 'mine') {
      onGameStatusChange('lost');
    } else if (isGameWon(newBoard)) {
      onGameStatusChange('won');
    }
  };

  // Handle flag placement
  const handleRightClick = (row: number, col: number) => {
    if (gameStatus !== 'ongoing') {
      return;
    }
    
    const cell = board[row][col];
    if (cell.state === 'revealed') {
      return;
    }
    
    const newBoard = toggleFlag(board, row, col);
    setBoard(newBoard);
    
    // Update remaining flags count
    const newCell = newBoard[row][col];
    if (newCell.state === 'flagged' && cell.state !== 'flagged') {
      setRemainingFlags(prev => prev - 1);
    } else if (newCell.state !== 'flagged' && cell.state === 'flagged') {
      setRemainingFlags(prev => prev + 1);
    }
  };

  // Check if game is won
  const isGameWon = (currentBoard: CellType[][]): boolean => {
    return currentBoard.every(row => 
      row.every(cell => 
        cell.state === 'revealed' || (cell.value === 'mine' && cell.state === 'flagged')
      )
    );
  };

  // Format elapsed time as MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // If board not initialized yet, show loading
  if (board.length === 0) {
    return <div className="text-center p-4">Loading...</div>;
  }

  // Check if a cell is highlighted by AI suggestion
  const isHighlighted = (row: number, col: number): boolean => {
    return !!(suggestedMove && suggestedMove.row === row && suggestedMove.col === col);
  };

  const handleSuggestedMove = (move: { row: number; col: number; confidence: string; reason: string }) => {
    // Handle the suggested move here if needed
    console.log('AI suggested move:', move);
  };

  return (
    <div className="space-y-4">
      {/* Game status bar */}
      <div className="flex justify-between items-center bg-gray-200 p-2">
        <div className="font-mono font-bold text-black">Flags: {remainingFlags}</div>
        <div className="text-center text-black">
          {gameStatus === 'won' ? (
            <span className="text-green-600 font-bold">You Won!</span>
          ) : gameStatus === 'lost' ? (
            <span className="text-red-600 font-bold">Game Over!</span>
          ) : (
            <span>Playing...</span>
          )}
        </div>
        <div className="font-mono font-bold text-black">Time: {formatTime(elapsedTime)}</div>
      </div>
      
      {/* Game board */}
      <div 
        className="grid gap-0 mx-auto" 
        style={{
          gridTemplateColumns: `repeat(${difficulty.cols}, 2rem)`,
          width: `${difficulty.cols * 2}rem`
        }}
      >
        {board.map((row, rowIndex) => (
          row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              row={rowIndex}
              col={colIndex}
              isRevealed={cell.state === 'revealed'}
              isFlagged={cell.state === 'flagged'}
              isMine={cell.value === 'mine'}
              adjacentMines={typeof cell.value === 'number' ? cell.value : 0}
              onClick={handleCellClick}
              onRightClick={handleRightClick}
              gameStatus={gameStatus}
              isHighlighted={isHighlighted(rowIndex, colIndex)}
            />
          ))
        ))}
      </div>

      {/* Suggested Move Info */}
      {suggestedMove && (
        <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-1">AI Suggestion</h3>
          <p className="text-sm text-blue-700">
            Click on Row {suggestedMove.row + 1}, Column {suggestedMove.col + 1}
          </p>
          <p className="text-sm text-blue-700">
            Confidence: <span className="font-medium">{suggestedMove.confidence}</span>
          </p>
          <p className="text-sm text-blue-700">
            Reason: <span className="font-medium">{suggestedMove.reason}</span>
          </p>
        </div>
      )}

      {/* AI Helper */}
      {aiEnabled && (
        <AIHelper
          board={board}
          onSuggestMove={onSuggestMove}
          enabled={aiEnabled}
          gameStatus={gameStatus}
        />
      )}
    </div>
  );
}
