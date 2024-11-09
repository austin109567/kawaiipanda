import { FC } from 'react';
import { NFTMetadata } from '../types/nft';
import { Heart, ExternalLink } from 'lucide-react';
import { NFTProfileButton } from './Dashboard/NFTProfileButton';
import { useWallet } from '@solana/wallet-adapter-react';

interface NFTCardProps {
  nft: NFTMetadata;
  isFavorite: boolean;
  onFavoriteToggle: () => void;
  showProfileButton?: boolean;
}

export const NFTCard: FC<NFTCardProps> = ({ 
  nft, 
  isFavorite, 
  onFavoriteToggle,
  showProfileButton = false
}) => {
  const { connected } = useWallet();
  const COLLECTION_ADDRESS = 'Hcudg3n6ggbc5kMo2ZtVbXKJb7oXhNCQxJsY42ZMiPpp';
  
  return (
    <div className="group relative h-full bg-black/40 rounded-xl overflow-hidden border border-primary-pink/20 hover:border-primary-pink/40 transition-all duration-300 hover:transform hover:scale-[1.02]">
      {/* Action Buttons */}
      <div className="absolute top-2 right-2 z-10 flex gap-2">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onFavoriteToggle();
          }}
          className={`p-2 rounded-lg backdrop-blur-sm transition-colors ${
            isFavorite 
              ? 'bg-primary-pink text-white' 
              : 'bg-black/40 text-primary-pink hover:bg-primary-pink/20'
          }`}
        >
          <Heart className="w-4 h-4" fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
        <a
          href={`https://solscan.io/token/${nft.mint}?cluster=mainnet`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg bg-black/40 text-primary-pink hover:bg-primary-pink/20 backdrop-blur-sm transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Profile Picture Button */}
      {showProfileButton && connected && (
        <NFTProfileButton nft={nft} />
      )}

      {/* NFT Image */}
      <div className="aspect-square bg-neutral-charcoal/40 relative overflow-hidden">
        {nft.image && (
          <img
            src={nft.image}
            alt={nft.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      {/* NFT Details */}
      <div className="p-4 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-white group-hover:text-primary-pink transition-colors truncate">
            {nft.name || 'Unnamed NFT'}
          </h3>
          <a
            href={`https://solscan.io/collection/${COLLECTION_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary-pink hover:text-primary-pink/80 transition-colors"
          >
            View Collection
          </a>
        </div>

        {/* Attributes */}
        {nft.attributes && nft.attributes.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {nft.attributes.slice(0, 4).map((attr, index) => (
              <div 
                key={index} 
                className="bg-primary-pink/10 rounded-lg p-2 group-hover:bg-primary-pink/20 transition-colors"
              >
                <p className="text-xs text-primary-pink truncate">
                  {attr.trait_type}
                </p>
                <p className="text-sm font-medium text-white truncate">
                  {attr.value}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};