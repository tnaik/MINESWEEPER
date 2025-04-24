// Define prop types
interface CellProps {
  row: number;
  col: number;
  isRevealed: boolean;
  isFlagged: boolean;
  isMine: boolean;
  adjacentMines: number;
  onClick: (row: number, col: number) => void;
  onRightClick: (row: number, col: number) => void;
  gameStatus: 'ongoing' | 'won' | 'lost';
  isHighlighted?: boolean;
}

export default function Cell({ 
  row, 
  col, 
  isRevealed, 
  isFlagged, 
  isMine, 
  adjacentMines, 
  onClick, 
  onRightClick,
  gameStatus,
  isHighlighted = false
}: CellProps) {
  // Determine cell display content
  const getCellContent = () => {
    if (!isRevealed) {
      // Cell not yet revealed
      return isFlagged ? '🚩' : '';
    } else if (isMine) {
      // Revealed mine
      return '💣';
    } else if (adjacentMines > 0) {
      // Show number of adjacent mines
      return adjacentMines;
    }
    // Empty revealed cell
    return '';
  };

  // Get cell color based on number of adjacent mines
  const getNumberColor = () => {
    const colors = [
      'text-blue-600',     // 1
      'text-green-600',    // 2
      'text-red-600',      // 3
      'text-purple-800',   // 4
      'text-yellow-600',   // 5
      'text-pink-600',     // 6
      'text-black',        // 7
      'text-gray-600'      // 8
    ];
    
    return adjacentMines > 0 && adjacentMines <= 8 
      ? colors[adjacentMines - 1] 
      : '';
  };

  // Handle right click (flag placement)
  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (gameStatus === 'ongoing' && !isRevealed) {
      onRightClick(row, col);
    }
  };

  return (
    <button
      className={`
        w-8 h-8 flex items-center justify-center 
        border border-gray-400 text-sm font-bold
        ${isRevealed 
          ? (isMine 
              ? 'bg-red-500' 
              : 'bg-gray-200')
          : 'bg-gray-300 hover:bg-gray-400 inset-shadow-sm/20'
        }
        ${gameStatus !== 'ongoing' ? 'cursor-default' : 'cursor-pointer'}
        ${getNumberColor()}
        ${isHighlighted ? 'ring-2 ring-blue-500 ring-offset-1 animate-pulse' : ''}
      `}
      onClick={() => gameStatus === 'ongoing' && !isFlagged ? onClick(row, col) : null}
      onContextMenu={handleRightClick}
      disabled={gameStatus !== 'ongoing'}
    >
      {getCellContent()}
    </button>
  );
}