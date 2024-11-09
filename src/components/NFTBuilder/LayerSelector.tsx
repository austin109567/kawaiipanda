// Add missing layer and trait selections
import { FC } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Layer } from './types';

interface LayerSelectorProps {
  layer: Layer;
  selectedTrait: number | undefined;
  onSelect: (traitId: number) => void;
  isLoading: boolean;
}

export const LayerSelector: FC<LayerSelectorProps> = ({
  layer,
  selectedTrait,
  onSelect,
  isLoading
}) => {
  const currentTraitIndex = layer.traits.findIndex(t => t.id === selectedTrait);
  
  const handlePrevious = () => {
    if (isLoading) return;
    const newIndex = currentTraitIndex > 0 
      ? currentTraitIndex - 1 
      : layer.traits.length - 1;
    onSelect(layer.traits[newIndex].id);
  };

  const handleNext = () => {
    if (isLoading) return;
    const newIndex = currentTraitIndex < layer.traits.length - 1 
      ? currentTraitIndex + 1 
      : 0;
    onSelect(layer.traits[newIndex].id);
  };

  const currentTrait = layer.traits.find(t => t.id === selectedTrait);

  return (
    <div className={`gradient-box p-4 ${
      isLoading ? 'opacity-50 pointer-events-none' : ''
    }`}>
      <h3 className="text-sm font-medium text-text-light-primary dark:text-white mb-2">{layer.name}</h3>
      
      <div className="flex items-center gap-4">
        <button
          onClick={handlePrevious}
          disabled={isLoading}
          className="p-2 rounded-full bg-primary-main/10 text-primary-main hover:bg-primary-main/20 transition-colors disabled:opacity-50"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex-1 text-center">
          <span className="text-lg font-medium text-text-light-primary dark:text-white">
            {currentTrait?.name || 'Select trait'}
          </span>
        </div>

        <button
          onClick={handleNext}
          disabled={isLoading}
          className="p-2 rounded-full bg-primary-main/10 text-primary-main hover:bg-primary-main/20 transition-colors disabled:opacity-50"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4">
        {layer.traits.map(trait => (
          <button
            key={trait.id}
            onClick={() => !isLoading && onSelect(trait.id)}
            disabled={isLoading}
            className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
              selectedTrait === trait.id
                ? 'border-primary-main scale-105 shadow-glow'
                : 'border-transparent hover:border-primary-main/50'
            } ${isLoading ? 'opacity-50' : ''}`}
          >
            <img
              src={trait.image}
              alt={trait.name}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};