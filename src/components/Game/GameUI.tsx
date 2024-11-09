import { FC } from 'react';
import { GameState } from './useGameState';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface GameUIProps {
  gameState: GameState;
}

export const GameUI: FC<GameUIProps> = ({ gameState }) => {
  if (!gameState.isGameOver && gameState.isPlaying) {
    return null;
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="text-center">
        {gameState.isGameOver ? (
          <>
            <h3 className="text-2xl font-bold text-white mb-2">Game Over!</h3>
            <p className="text-purple-300 mb-6">Score: {gameState.score}</p>
            <button
              onClick={gameState.resetGame}
              className="flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Play Again
            </button>
          </>
        ) : (
          <>
            <h3 className="text-2xl font-bold text-white mb-6">Flappy Pepe</h3>
            <button
              onClick={gameState.startGame}
              className="flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              <Play className="w-4 h-4" />
              Start Game
            </button>
          </>
        )}
      </div>
    </div>
  );
};