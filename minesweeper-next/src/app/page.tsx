// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Board from '@/components/Board';
import GameControls from '@/components/GameControls';
import { DIFFICULTY } from '@/lib/gameLogic';
import AIAssistant from '@/components/AIAssistant';

// Define types for game state
type Difficulty = {
  rows: number;
  cols: number;
  mines: number;
};

type GameStatus = 'ongoing' | 'won' | 'lost';

type SuggestedMove = {
  row: number;
  col: number;
  confidence: string;
  reason: string;
  probability?: number;
};

export default function Home() {
  const [difficulty, setDifficulty] = useState<Difficulty>(DIFFICULTY.BEGINNER);
  const [gameStatus, setGameStatus] = useState<GameStatus>('ongoing');
  const [resetCounter, setResetCounter] = useState<number>(0);
  const [aiEnabled, setAiEnabled] = useState<boolean>(false);
  const [suggestedMove, setSuggestedMove] = useState<SuggestedMove | null>(null);

  // Reset game function
  const resetGame = () => {
    setGameStatus('ongoing');
    setResetCounter(prevCounter => prevCounter + 1);
    setSuggestedMove(null);
  };

  // Handle difficulty change
  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
    resetGame();
  };

  // Handle suggested move from AI
  const handleSuggestedMove = (move: SuggestedMove) => {
    console.log('Received suggested move:', move);
    setSuggestedMove(move);
  };

  // Handle suggest move button click
  const handleSuggestMoveClick = () => {
    if (aiEnabled && gameStatus === 'ongoing') {
      // The AIHelper component will automatically analyze and suggest a move
      // through the handleSuggestedMove callback
    }
  };
  
  // Save game stats when game ends
  useEffect(() => {
    if (gameStatus === 'won' || gameStatus === 'lost') {
      // Here you would typically save game statistics to localStorage
      console.log('Game ended with status:', gameStatus);
    }
  }, [gameStatus]);

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Minesweeper with NumJS</h1>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left sidebar with game controls */}
          <div className="col-span-1">
            <GameControls 
              onDifficultyChange={handleDifficultyChange}
              onResetGame={resetGame}
              aiEnabled={aiEnabled}
              onToggleAI={setAiEnabled}
              onSuggestMove={handleSuggestMoveClick}
            />
            
            {/* AI Assistant (conditionally rendered) */}
            {aiEnabled && (
              <AIAssistant 
                onSuggestMove={handleSuggestedMove}
                enabled={aiEnabled}
              />
            )}
          </div>
          
          {/* Game board */}
          <div className="col-span-1 md:col-span-2">
            <Board
              difficulty={difficulty}
              gameStatus={gameStatus}
              onGameStatusChange={setGameStatus}
              resetTrigger={resetCounter}
              aiEnabled={aiEnabled}
              suggestedMove={suggestedMove}
              onSuggestMove={handleSuggestedMove}
            />
            
            {/* Game instructions */}
            <div className="mt-6 bg-white p-4 rounded shadow-sm">
              <h2 className="font-bold text-lg mb-2 text-gray-900">How to Play</h2>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-800">
                <li>Left-click to reveal a cell</li>
                <li>Right-click to place or remove a flag</li>
                <li>The numbers indicate how many mines are adjacent to a cell</li>
                <li>Flag all mines to win the game</li>
                <li>Enable AI Assistant for help with difficult decisions</li>
              </ul>
            </div>
          </div>
        </div>
        
        <footer className="mt-8 text-center text-gray-700 text-sm">
          <p>Minesweeper Game for CPSC 481 Project</p>
          <p>&copy; {new Date().getFullYear()} [Your Name]</p>
        </footer>
      </div>
    </main>
  );
}