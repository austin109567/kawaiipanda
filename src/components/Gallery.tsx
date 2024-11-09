import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { NFTGrid } from './NFTGrid';
import { ConnectPrompt } from './ConnectPrompt';
import { Image } from 'lucide-react';

export const Gallery: FC = () => {
  const { connected } = useWallet();

  if (!connected) {
    return <ConnectPrompt />;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 px-4">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-title text-text-light-primary dark:text-white mb-2 flex items-center justify-center gap-3">
        <img 
            src="/src/assets/pandas/runningpandaflip.PNG" 
            alt="Raid Panda"
            className="w-12 h-12 object-contain"
          />
          Gallery
          <img 
            src="/src/assets/pandas/runningpanda.PNG" 
            alt="Raid Panda"
            className="w-12 h-12 object-contain"
          />
        </h1>
        <p className="text-text-light-secondary dark:text-text-dark-secondary">
          The Full Collection Gallery, rate limited to 100/hr.<br></br>  Please use custom API for more under settings.
        </p>
      </div>
<br></br>
      {/* Gallery Grid */}

        <NFTGrid 
          showWalletOnly={false}
          initialDisplayCount={8}
          showSearch={true}
        />

    </div>
  );
};