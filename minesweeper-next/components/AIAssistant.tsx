import React from 'react';

interface AIAssistantProps {
  enabled: boolean;
  onSuggestMove: (move: { row: number; col: number; confidence: string; reason: string }) => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ enabled, onSuggestMove }) => {
  if (!enabled) return null;

  return (
    <div className="mt-4 p-3 bg-white rounded shadow-sm">
      <h3 className="font-bold mb-2">AI Assistant</h3>
      <p className="text-sm text-gray-600">
        AI assistant is enabled. It will analyze the board and suggest moves.
      </p>
    </div>
  );
};

export default AIAssistant; 