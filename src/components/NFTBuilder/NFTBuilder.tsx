import { FC, useState, useEffect } from 'react';
import { Shuffle, Download, User } from 'lucide-react';
import { LayerSelector } from './LayerSelector';
import { NFTPreview } from './NFTPreview';
import { mergeImages } from './utils';
import { useLayerPreloader } from './useLayerPreloader';
import { playerService } from '../../services/playerService';
import { useWallet } from '@solana/wallet-adapter-react';
import { Layer } from './types';

// Sample layers with valid image paths and unique IDs
export const LAYERS: Layer[] = [
  {
    id: 1,
    name: 'Background',
    traits: [
      { id: 101, name: 'Byzantium Purple', image: '/assets/layers/Background/Byzantium_Purple.png' },
      { id: 102, name: 'Cream', image: '/assets/layers/Background/Cream.png' },
      { id: 103, name: 'Ruddy Blue', image: '/assets/layers/Background/Ruddy_Blue.png' }
    ]
  }, {
    id: 2,
    name: 'Skin',
    traits: [
      { id: 201, name: 'Tree', image: '/assets/layers/Skin/Tree.png' },
      { id: 202, name: 'Cybersuit', image: '/assets/layers/Skin/Cybersuit.png' },
      { id: 203, name: 'Dreamland', image: '/assets/layers/Skin/Dreamland.png' }
    ]
  }, {
    id: 3,
    name: 'Eyes',
    traits: [
      { id: 301, name: 'Gaze', image: '/assets/layers/Eyes/Gaze.png' },
      { id: 302, name: 'Nano', image: '/assets/layers/Eyes/Nano.png' },
      { id: 303, name: 'Bloodshot', image: '/assets/layers/Eyes/Bloodshot.png' }
    ]
  }, {
    id: 4,
    name: 'Mouth',
    traits: [
      { id: 401, name: 'Red', image: '/assets/layers/Mouth/Red.png' },
      { id: 402, name: 'Bone', image: '/assets/layers/Mouth/Bone.png' },
      { id: 403, name: 'Chick', image: '/assets/layers/Mouth/Chick.png' },
      { id: 404, name: 'Scruff', image: '/assets/layers/Mouth/Scruff.png' },
      { id: 405, name: 'Gold Cheese', image: '/assets/layers/Mouth/Gold_Cheese.png' }
    ]
  }, {
    id: 5,
    name: 'Outfit',
    traits: [
      { id: 501, name: 'Birfday', image: '/assets/layers/Outfit/Birfday.png' },
      { id: 502, name: 'Colonial', image: '/assets/layers/Outfit/Colonial.png' },
      { id: 503, name: 'Bear Suit', image: '/assets/layers/Outfit/Bear_Suit.png' },
      { id: 504, name: 'Blue Jacket', image: '/assets/layers/Outfit/Blue_Jacket.png' }
    ]
  }, {
    id: 6,
    name: 'Hat',
    traits: [
      { id: 601, name: 'None', image: '/assets/layers/Hat/None.png' },
      { id: 602, name: 'Crown', image: '/assets/layers/Hat/Crown.png' },
      { id: 603, name: 'Troll', image: '/assets/layers/Hat/Troll.png' },
      { id: 605, name: 'Skull Cap', image: '/assets/layers/Hat/Skull_Cap.png' },
      { id: 606, name: 'Forest Ancients', image: '/assets/layers/Hat/Forest_Ancients.png' }
    ]
  }
];

export const NFTBuilder: FC = () => {
  const { Key } = useWallet();
  const [selectedTraits, setSelectedTraits] = useState<Record<number, number>>({});
  const [downloading, setDownloading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { loadingProgress } = useLayerPreloader(LAYERS);

  // Generate random configuration immediately
  useEffect(() => {
    handleRandomize();
  }, []);

  const handleTraitSelect = (layerId: number, traitId: number) => {
    setSelectedTraits(prev => ({
      ...prev,
      [layerId]: traitId
    }));
  };

  const handleRandomize = () => {
    const randomTraits: Record<number, number> = {};
    LAYERS.forEach(layer => {
      const randomTrait = layer.traits[Math.floor(Math.random() * layer.traits.length)];
      randomTraits[layer.id] = randomTrait.id;
    });
    setSelectedTraits(randomTraits);
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const selectedImages = LAYERS.map(layer => {
        const traitId = selectedTraits[layer.id];
        const trait = layer.traits.find(t => t.id === traitId);
        return trait?.image || '';
      }).filter(Boolean);

      if (selectedImages.length > 0) {
        const mergedImage = await mergeImages(selectedImages);
        const link = document.createElement('a');
        link.href = mergedImage;
        link.download = 'my-nft.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Failed to download NFT:', error);
    } finally {
      setDownloading(false);
    }
  };

  const handleSetAsProfilePicture = async () => {
    if (!Key) return;

    try {
      const selectedImages = LAYERS.map(layer => {
        const traitId = selectedTraits[layer.id];
        const trait = layer.traits.find(t => t.id === traitId);
        return trait?.image || '';
      }).filter(Boolean);

      if (selectedImages.length > 0) {
        const mergedImage = await mergeImages(selectedImages);
        playerService.setProfilePicture(Key.toString(), mergedImage);
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
      }
    } catch (error) {
      console.error('Failed to set profile picture:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="text-center mb-8">
      <div className="text-center">
        <h1 className="text-4xl font-title text-text-light-primary dark:text-white mb-2 flex items-center justify-center gap-3">
        <img 
            src="/assets/pandas/happypanda.PNG" 
            alt="Raid Panda"
            className="w-12 h-12 object-contain"
          />
          NFT Builder
          <img 
            src="/assets/pandas/happypandaflip.PNG" 
            alt="Raid Panda2"
            className="w-12 h-12 object-contain"
          />
        </h1>
        <p className="text-text-light-secondary dark:text-text-dark-secondary">
        Create your own unique NFT by mixing and matching traits
        </p>
      </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Preview */}
        <div className="lg:col-span-5">
          <div className="sticky top-24">
            <div className="gradient-box p-6">
              <div className="relative">
                <NFTPreview 
                  layers={LAYERS} 
                  selectedTraits={selectedTraits}
                  loadingProgress={loadingProgress}
                />
                {Key && (
                  <button
                    onClick={handleSetAsProfilePicture}
                    className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-primary-main text-white rounded-lg hover:bg-primary-main/90 transition-colors shadow-glow"
                  >
                    <User className="w-4 h-4" />
                    Set as PFP
                  </button>
                )}
              </div>
              
              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleRandomize}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary-main/20 text-primary-main rounded-lg hover:bg-primary-main/30 transition-colors"
                >
                  <Shuffle className="w-4 h-4" />
                  Randomize
                </button>
                <button
                  onClick={handleDownload}
                  disabled={downloading || loadingProgress < 100}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary-main text-white rounded-lg hover:bg-primary-main/90 transition-colors disabled:opacity-50 shadow-glow"
                >
                  <Download className="w-4 h-4" />
                  {downloading ? 'Downloading...' : 'Download'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Layer Selectors */}
        <div className="lg:col-span-7">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {LAYERS.map(layer => (
              <LayerSelector
                key={layer.id}
                layer={layer}
                selectedTrait={selectedTraits[layer.id]}
                onSelect={(traitId) => handleTraitSelect(layer.id, traitId)}
                isLoading={loadingProgress < 100}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed bottom-4 right-4 bg-primary-main text-white px-6 py-3 rounded-lg shadow-glow animate-fade-in">
          Profile picture updated successfully!
        </div>
      )}
    </div>
  );
};