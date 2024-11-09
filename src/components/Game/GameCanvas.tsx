import { FC, useEffect, useRef } from 'react';
import { GameState } from './useGameState';

interface GameCanvasProps {
  gameState: GameState;
}

export const GameCanvas: FC<GameCanvasProps> = ({ gameState }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tunnelOffset = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawTunnel = () => {
      const tunnelSpeed = 2;
      tunnelOffset.current = (tunnelOffset.current + tunnelSpeed) % 50;
      
      // Draw moving tunnel pattern
      ctx.strokeStyle = '#4c1d95';
      ctx.lineWidth = 2;
      
      for (let i = -50; i < canvas.width + 50; i += 50) {
        const x = i - tunnelOffset.current;
        
        // Top tunnel
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + 25, 50);
        ctx.stroke();
        
        // Bottom tunnel
        ctx.beginPath();
        ctx.moveTo(x, canvas.height);
        ctx.lineTo(x + 25, canvas.height - 50);
        ctx.stroke();
      }
    };

    const render = () => {
      // Clear canvas
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw moving tunnel effect
      if (gameState.isPlaying) {
        drawTunnel();
      }

      // Draw pipes with gradient
      gameState.pipes.forEach(pipe => {
        // Top pipe gradient
        const topGradient = ctx.createLinearGradient(
          pipe.x, 0,
          pipe.x + pipe.width, 0
        );
        topGradient.addColorStop(0, '#4c1d95');
        topGradient.addColorStop(1, '#7e22ce');
        
        // Bottom pipe gradient
        const bottomGradient = ctx.createLinearGradient(
          pipe.x, canvas.height,
          pipe.x + pipe.width, canvas.height - pipe.bottomHeight
        );
        bottomGradient.addColorStop(0, '#4c1d95');
        bottomGradient.addColorStop(1, '#7e22ce');

        // Draw pipes with gradients
        ctx.fillStyle = topGradient;
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.topHeight);
        
        ctx.fillStyle = bottomGradient;
        ctx.fillRect(
          pipe.x,
          canvas.height - pipe.bottomHeight,
          pipe.width,
          pipe.bottomHeight
        );

        // Add pipe highlights
        ctx.strokeStyle = '#9333ea';
        ctx.lineWidth = 2;
        ctx.strokeRect(pipe.x, 0, pipe.width, pipe.topHeight);
        ctx.strokeRect(
          pipe.x,
          canvas.height - pipe.bottomHeight,
          pipe.width,
          pipe.bottomHeight
        );
      });

      // Draw bird with gradient
      const birdGradient = ctx.createRadialGradient(
        gameState.bird.x + gameState.bird.width / 2,
        gameState.bird.y + gameState.bird.height / 2,
        0,
        gameState.bird.x + gameState.bird.width / 2,
        gameState.bird.y + gameState.bird.height / 2,
        gameState.bird.width
      );
      birdGradient.addColorStop(0, '#9333ea');
      birdGradient.addColorStop(1, '#7e22ce');
      
      ctx.fillStyle = birdGradient;
      ctx.beginPath();
      ctx.arc(
        gameState.bird.x + gameState.bird.width / 2,
        gameState.bird.y + gameState.bird.height / 2,
        gameState.bird.width / 2,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Draw score with glow effect
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 24px monospace';
      ctx.textAlign = 'center';
      ctx.shadowColor = '#9333ea';
      ctx.shadowBlur = 10;
      ctx.fillText(
        gameState.score.toString(),
        canvas.width / 2,
        50
      );
      ctx.shadowBlur = 0;
    };

    const animate = () => {
      render();
      requestAnimationFrame(animate);
    };

    animate();
  }, [gameState]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      width={800}
      height={600}
      onClick={gameState.handleClick}
    />
  );
};