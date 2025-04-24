import React from 'react';

interface AIAssistantProps {
  gameState: any;
  onSuggestMove: (move: any) => void;
  enabled: boolean;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ gameState, onSuggestMove, enabled }) => {
  if (!enabled) return null;

  return (
    <div className="mt-4 p-4 bg-white rounded shadow-sm">
      <h3 className="mb-2 text-black font-semibold">AI Assistant</h3>
      <p className="text-sm text-gray-600">
        AI assistant is enabled. It will analyze the board and suggest moves.
      </p>
    </div>
  );
};

export default AIAssistant; 