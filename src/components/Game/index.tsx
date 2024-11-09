import { FC, useEffect, useRef, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { GameCanvas } from './GameCanvas';
import { GameUI } from './GameUI';
import { useGameState } from './useGameState';
import { Trophy } from 'lucide-react';

export const Game: FC = () => {
  const { publicKey } = useWallet();
  const gameState = useGameState(publicKey?.toString());
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Flappy Pepe</h2>
        <button
          onClick={() => setShowLeaderboard(!showLeaderboard)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors bg-purple-900/20 text-purple-300 hover:bg-purple-900/40"
        >
          <Trophy className="w-4 h-4" />
          Leaderboard
        </button>
      </div>

      <div className="relative aspect-[4/3] max-w-2xl mx-auto bg-black/40 rounded-lg overflow-hidden border border-purple-700/30">
        <GameCanvas gameState={gameState} />
        <GameUI gameState={gameState} />
      </div>

      {showLeaderboard && (
        <div className="bg-black/40 backdrop-blur-sm rounded-lg border border-purple-700/30 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Top Scores</h3>
          <div className="space-y-2">
            {gameState.leaderboard.map((entry, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-purple-900/20 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-purple-400 font-mono">#{index + 1}</span>
                  <span className="text-white font-medium truncate">
                    {entry.wallet.slice(0, 4)}...{entry.wallet.slice(-4)}
                  </span>
                </div>
                <span className="text-purple-300 font-mono">{entry.score}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};