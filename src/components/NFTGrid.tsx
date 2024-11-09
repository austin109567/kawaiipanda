import { FC, useEffect, useState, useCallback, useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { NFTCard } from './NFTCard';
import { fetchCollectionNFTs, fetchWalletNFTs } from '../utils/api';
import { NFTMetadata } from '../types/nft';
import { ChevronDown, Search } from 'lucide-react';

interface NFTGridProps {
  showWalletOnly: boolean;
  initialDisplayCount: number;
  showSearch: boolean;
  showProfileButtons?: boolean;
  traitFilters?: Array<{ type: string; value: string }>;
  onTraitTypesFound?: (nfts: NFTMetadata[]) => void;
}

export const NFTGrid: FC<NFTGridProps> = ({ 
  showWalletOnly,
  initialDisplayCount,
  showSearch,
  showProfileButtons = false,
  traitFilters = [],
  onTraitTypesFound 
}) => {
  const { publicKey } = useWallet();
  const [nfts, setNfts] = useState<NFTMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [displayCount, setDisplayCount] = useState(initialDisplayCount);
  const [loadingMore, setLoadingMore] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  const FETCH_COOLDOWN = 60000; // 1 minute cooldown between API calls

  // Load NFTs with caching and rate limiting
  useEffect(() => {
    const loadNFTs = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if we should fetch new data
        const now = Date.now();
        if (now - lastFetchTime < FETCH_COOLDOWN) {
          return; // Skip fetch if within cooldown period
        }

        const fetchedNFTs = showWalletOnly && publicKey
          ? await fetchWalletNFTs(publicKey.toString())
          : await fetchCollectionNFTs();

        if (onTraitTypesFound) {
          onTraitTypesFound(fetchedNFTs);
        }

        setNfts(fetchedNFTs);
        setLastFetchTime(now);
      } catch (error) {
        console.error('Error loading NFTs:', error);
        setError('Failed to load NFTs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadNFTs();
  }, [publicKey, showWalletOnly, onTraitTypesFound, lastFetchTime]);

  // Filter and sort NFTs
  const filteredAndSortedNfts = useMemo(() => {
    let filtered = [...nfts];

    // Apply trait filters
    if (traitFilters.length > 0) {
      filtered = filtered.filter(nft => 
        traitFilters.every(filter =>
          nft.attributes.some(attr =>
            attr.trait_type === filter.type && attr.value === filter.value
          )
        )
      );
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(nft =>
        nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        nft.name.match(new RegExp(`#${searchQuery}$`))
      );
    }

    // Sort favorites to top
    filtered.sort((a, b) => {
      if (favorites.has(a.name) && !favorites.has(b.name)) return -1;
      if (!favorites.has(a.name) && favorites.has(b.name)) return 1;
      return 0;
    });

    return filtered;
  }, [nfts, traitFilters, searchQuery, favorites]);

  // Get displayed NFTs
  const displayedNfts = useMemo(() => {
    return filteredAndSortedNfts.slice(0, displayCount);
  }, [filteredAndSortedNfts, displayCount]);

  const loadMore = useCallback(async () => {
    setLoadingMore(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate loading
    setDisplayCount(prev => prev + initialDisplayCount);
    setLoadingMore(false);
  }, [initialDisplayCount]);

  const toggleFavorite = useCallback((nftName: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(nftName)) {
        newFavorites.delete(nftName);
      } else {
        newFavorites.add(nftName);
      }
      return newFavorites;
    });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 max-w-md mx-auto">
          <p className="text-red-400">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showSearch && (
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name or number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 bg-black/40 border border-primary-purple/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-purple/40"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 p-3 sm:p-4 md:p-6 bg-black/40 rounded-xl border border-primary-purple/20 backdrop-blur-sm">
        {displayedNfts.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-black/40 rounded-lg border border-primary-purple/30">
            <p className="text-gray-400">
              {searchQuery 
                ? 'No NFTs found matching your search'
                : showWalletOnly 
                  ? 'No NFTs found in your wallet from this collection'
                  : traitFilters.length > 0
                    ? 'No NFTs found matching the selected filters'
                    : 'No NFTs found in the collection'}
            </p>
          </div>
        ) : (
          displayedNfts.map((nft, index) => (
            <div key={`${nft.name}-${index}`} className="group relative">
              <NFTCard 
                nft={nft} 
                isFavorite={favorites.has(nft.name)}
                onFavoriteToggle={() => toggleFavorite(nft.name)}
                showProfileButton={showProfileButtons}
              />
            </div>
          ))
        )}
      </div>

      {displayedNfts.length < filteredAndSortedNfts.length && (
        <div className="flex justify-center">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="flex items-center gap-2 px-6 py-3 bg-primary-purple/20 hover:bg-primary-purple/30 text-primary-purple rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
          >
            {loadingMore ? (
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary-purple" />
            ) : (
              <>
                Show More
                <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};