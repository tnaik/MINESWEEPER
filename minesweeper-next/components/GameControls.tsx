import { useState } from 'react';
import { DIFFICULTY } from '../lib/gameLogic';

// Define prop types
interface GameControlsProps {
  onDifficultyChange: (difficulty: { rows: number; cols: number; mines: number }) => void;
  onResetGame: () => void;
  aiEnabled: boolean;
  onToggleAI: (enabled: boolean) => void;
  onSuggestMove: () => void;
}

// Define custom settings type
interface CustomSettings {
  rows: number;
  cols: number;
  mines: number;
}

export default function GameControls({ 
  onDifficultyChange, 
  onResetGame, 
  aiEnabled, 
  onToggleAI,
  onSuggestMove
}: GameControlsProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('BEGINNER');
  const [customSettings, setCustomSettings] = useState<CustomSettings>({
    rows: 9,
    cols: 9,
    mines: 10
  });
  const [showCustomSettings, setShowCustomSettings] = useState<boolean>(false);

  // Handle difficulty selection
  const handleDifficultyChange = (difficultyKey: string) => {
    setSelectedDifficulty(difficultyKey);
    
    if (difficultyKey === 'CUSTOM') {
      setShowCustomSettings(true);
    } else {
      setShowCustomSettings(false);
      onDifficultyChange(DIFFICULTY[difficultyKey as keyof typeof DIFFICULTY]);
    }
  };

  // Handle custom difficulty setting changes
  const handleCustomSettingChange = (setting: keyof CustomSettings, value: string) => {
    // Parse value as integer and ensure it's within reasonable limits
    const parsedValue = parseInt(value, 10);
    let validValue = parsedValue;
    
    // Apply limits based on the setting
    if (setting === 'rows' || setting === 'cols') {
      validValue = Math.min(Math.max(parsedValue, 5), 30); // Min 5, Max 30
    } else if (setting === 'mines') {
      const maxMines = Math.floor((customSettings.rows * customSettings.cols) * 0.35); // Max 35% of cells
      validValue = Math.min(Math.max(parsedValue, 1), maxMines); // Min 1, Max 35% of cells
    }
    
    // Update custom settings
    const updatedSettings = {
      ...customSettings,
      [setting]: validValue
    };
    
    setCustomSettings(updatedSettings);
    
    // If we're showing custom settings, also update the actual game
    if (showCustomSettings) {
      onDifficultyChange(updatedSettings);
    }
  };

  // Handle new game button click
  const handleNewGame = () => {
    // Apply current difficulty settings and reset the game
    if (selectedDifficulty === 'CUSTOM') {
      onDifficultyChange(customSettings);
    } else {
      onDifficultyChange(DIFFICULTY[selectedDifficulty as keyof typeof DIFFICULTY]);
    }
    
    onResetGame();
  };

  return (
    <div className="bg-white p-4 rounded shadow-md">
      <h2 className="text-xl font-bold mb-4 text-black">Game Settings</h2>
      
      {/* Difficulty selection */}
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2 text-black">Difficulty:</label>
        <div className="flex flex-wrap gap-2">
          {Object.keys(DIFFICULTY).map((key) => (
            <button
              key={key}
              className={`px-3 py-1 rounded ${
                selectedDifficulty === key 
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-500 font-semibold'
              }`}
              onClick={() => handleDifficultyChange(key)}
            >
              {key.charAt(0) + key.slice(1).toLowerCase()}
            </button>
          ))}
          {/* <button
            className={`px-3 py-1 rounded ${
              selectedDifficulty === 'CUSTOM' 
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
            onClick={() => handleDifficultyChange('CUSTOM')}
          >
            Custom
          </button> */}
        </div>
      </div>
      
      {/* Custom difficulty settings */}
      {showCustomSettings && (
        <div className="mb-4 p-3 bg-gray-100 rounded">
          <h3 className="text-md font-semibold mb-2">Custom Settings</h3>
          <div className="grid grid-cols-3 gap-18">
            <div>
              <label className="block text-xs mb-1">Rows</label>
              <input
                type="number"
                min="5"
                max="30"
                value={customSettings.rows}
                onChange={(e) => handleCustomSettingChange('rows', e.target.value)}
                className="w-full p-1 border rounded"
              />
            </div>
            <div>
              <label className="block text-xs mb-1">Columns</label>
              <input
                type="number"
                min="5"
                max="30"
                value={customSettings.cols}
                onChange={(e) => handleCustomSettingChange('cols', e.target.value)}
                className="w-full p-1 border rounded"
              />
            </div>
            <div>
              <label className="block text-xs mb-1">Mines</label>
              <input
                type="number"
                min="1"
                max={Math.floor((customSettings.rows * customSettings.cols) * 0.35)}
                value={customSettings.mines}
                onChange={(e) => handleCustomSettingChange('mines', e.target.value)}
                className="w-full p-1 border rounded"
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Game controls */}
        <div className="flex items-center">
          <label className="inline-flex items-center mr-2">
            <input
              type="checkbox"
              checked={aiEnabled}
              onChange={() => onToggleAI(!aiEnabled)}
              className="form-checkbox h-4 w-4 text-blue-600"
            />
            <span className="ml-2 text-sm text-black font-semibold">AI Assistant</span>
          </label>
          <button
            className={`px-3 py-1 rounded ${
              aiEnabled ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            disabled={!aiEnabled}
            onClick={onSuggestMove}
          >
            Suggest Move
          </button>

      </div>

        <div className="flex justify-between mt-4">
        <button
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={handleNewGame}
        >
          New Game
        </button>
      </div>
    </div>
  );
}