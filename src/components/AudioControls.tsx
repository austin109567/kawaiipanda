import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useAudio } from '../contexts/AudioContext';

export const AudioControls: React.FC = () => {
  const { isPlaying, volume, togglePlay, setVolume } = useAudio();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-lg p-2 border border-primary-pink/20">
      <button
        onClick={togglePlay}
        className="p-2 hover:bg-primary-pink/20 rounded-lg transition-colors"
      >
        {isPlaying ? (
          <Volume2 className="w-5 h-5 text-primary-pink" />
        ) : (
          <VolumeX className="w-5 h-5 text-primary-pink" />
        )}
      </button>
      <input
        type="range"
        min="0"
        max="0.2"
        step="0.01"
        value={volume}
        onChange={(e) => setVolume(parseFloat(e.target.value))}
        className="w-24 h-1 bg-primary-pink/30 rounded-lg appearance-none cursor-pointer 
          [&::-webkit-slider-thumb]:appearance-none 
          [&::-webkit-slider-thumb]:w-3 
          [&::-webkit-slider-thumb]:h-3 
          [&::-webkit-slider-thumb]:rounded-full 
          [&::-webkit-slider-thumb]:bg-primary-pink
          [&::-webkit-slider-thumb]:hover:bg-primary-pink/80
          [&::-webkit-slider-thumb]:transition-colors
          [&::-webkit-slider-thumb]:shadow-lg
          [&::-webkit-slider-thumb]:shadow-primary-pink/20"
      />
    </div>
  );
};