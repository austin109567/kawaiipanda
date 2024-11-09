import { FC, useEffect, useRef, useState } from 'react';
import { Layer } from './index';
import { Loader } from 'lucide-react';

interface NFTPreviewProps {
  layers: Layer[];
  selectedTraits: Record<number, number>;
  loadingProgress: number;
}

export const NFTPreview: FC<NFTPreviewProps> = ({ 
  layers, 
  selectedTraits,
  loadingProgress 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setError('Could not initialize canvas context');
      return;
    }

    const drawLayers = async () => {
      // Clear canvas and error state
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setError(null);

      try {
        // Create promises for all selected images
        const loadImage = (src: string): Promise<HTMLImageElement> => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
            img.src = src;
          });
        };

        // Load and draw images in layer order
        for (const layer of layers) {
          const traitId = selectedTraits[layer.id];
          if (!traitId) continue;

          const trait = layer.traits.find(t => t.id === traitId);
          if (!trait) continue;

          try {
            const img = await loadImage(trait.image);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          } catch (error) {
            console.error(`Failed to load image for layer ${layer.name}:`, error);
            setError(`Failed to load ${layer.name} layer`);
          }
        }
      } catch (error) {
        console.error('Failed to draw layers:', error);
        setError('Failed to generate preview');
      }
    };

    if (loadingProgress === 100) {
      drawLayers();
    }
  }, [layers, selectedTraits, loadingProgress]);

  return (
    <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-background-darkForest/40 border-2 border-primary-neonGreen/20 shadow-neon">
      <canvas
        ref={canvasRef}
        width={1000}
        height={1000}
        className="w-full h-full"
      />
      
      {loadingProgress < 100 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
          <Loader className="w-8 h-8 text-primary-neonGreen animate-spin mb-2" />
          <div className="text-sm text-neutral-white font-game">
            Loading assets... {loadingProgress}%
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="text-red-400 text-center p-4">
            <p className="font-game text-sm mb-2">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
      
      {Object.keys(selectedTraits).length === 0 && loadingProgress === 100 && !error && (
        <div className="absolute inset-0 flex items-center justify-center text-neutral-white font-game text-sm text-center p-4">
          Select traits to preview your NFT
        </div>
      )}
    </div>
  );
};