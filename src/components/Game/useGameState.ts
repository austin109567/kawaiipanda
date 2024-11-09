import { useState, useEffect, useCallback } from 'react';

interface Bird {
  x: number;
  y: number;
  velocity: number;
  width: number;
  height: number;
}

interface Pipe {
  x: number;
  width: number;
  topHeight: number;
  bottomHeight: number;
}

interface LeaderboardEntry {
  wallet: string;
  score: number;
}

export interface GameState {
  bird: Bird;
  pipes: Pipe[];
  score: number;
  isPlaying: boolean;
  isGameOver: boolean;
  leaderboard: LeaderboardEntry[];
  handleClick: () => void;
  startGame: () => void;
  resetGame: () => void;
}

const GRAVITY = 0.5;
const FLAP_VELOCITY = -8;
const PIPE_SPEED = 3;
const PIPE_SPAWN_INTERVAL = 2000;
const GAP_SIZE = 150;

export const useGameState = (wallet?: string): GameState => {
  const [bird, setBird] = useState<Bird>({
    x: 100,
    y: 300,
    velocity: 0,
    width: 30,
    height: 30,
  });

  const [pipes, setPipes] = useState<Pipe[]>([]);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  const createPipe = useCallback(() => {
    const minHeight = 50;
    const maxHeight = 400;
    const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;

    return {
      x: 800,
      width: 50,
      topHeight,
      bottomHeight: 600 - topHeight - GAP_SIZE,
    };
  }, []);

  const resetGame = useCallback(() => {
    setBird({
      x: 100,
      y: 300,
      velocity: 0,
      width: 30,
      height: 30,
    });
    setPipes([]);
    setScore(0);
    setIsPlaying(false);
    setIsGameOver(false);
  }, []);

  const startGame = useCallback(() => {
    resetGame();
    setIsPlaying(true);
  }, [resetGame]);

  const handleClick = useCallback(() => {
    if (!isGameOver && isPlaying) {
      setBird(prev => ({
        ...prev,
        velocity: FLAP_VELOCITY,
      }));
    }
  }, [isGameOver, isPlaying]);

  useEffect(() => {
    if (!isPlaying || isGameOver) return;

    const gameLoop = setInterval(() => {
      setBird(prev => ({
        ...prev,
        y: prev.y + prev.velocity,
        velocity: prev.velocity + GRAVITY,
      }));

      setPipes(prev => {
        const newPipes = prev
          .map(pipe => ({
            ...pipe,
            x: pipe.x - PIPE_SPEED,
          }))
          .filter(pipe => pipe.x + pipe.width > 0);

        // Check for collisions
        const birdRect = {
          left: bird.x,
          right: bird.x + bird.width,
          top: bird.y,
          bottom: bird.y + bird.height,
        };

        const collision = newPipes.some(pipe => {
          const hitTop = birdRect.right > pipe.x &&
            birdRect.left < pipe.x + pipe.width &&
            birdRect.top < pipe.topHeight;

          const hitBottom = birdRect.right > pipe.x &&
            birdRect.left < pipe.x + pipe.width &&
            birdRect.bottom > 600 - pipe.bottomHeight;

          return hitTop || hitBottom;
        });

        if (collision || bird.y < 0 || bird.y + bird.height > 600) {
          setIsGameOver(true);
          if (wallet) {
            setLeaderboard(prev => {
              const newEntry = { wallet, score };
              const newLeaderboard = [...prev, newEntry]
                .sort((a, b) => b.score - a.score)
                .slice(0, 10);
              return newLeaderboard;
            });
          }
        }

        // Update score
        newPipes.forEach(pipe => {
          if (pipe.x + PIPE_SPEED >= bird.x && pipe.x < bird.x) {
            setScore(prev => prev + 1);
          }
        });

        return newPipes;
      });
    }, 1000 / 60);

    const spawnPipes = setInterval(() => {
      setPipes(prev => [...prev, createPipe()]);
    }, PIPE_SPAWN_INTERVAL);

    return () => {
      clearInterval(gameLoop);
      clearInterval(spawnPipes);
    };
  }, [isPlaying, isGameOver, bird.x, bird.y, bird.width, bird.height, createPipe, score, wallet]);

  return {
    bird,
    pipes,
    score,
    isPlaying,
    isGameOver,
    leaderboard,
    handleClick,
    startGame,
    resetGame,
  };
};