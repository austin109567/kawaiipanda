import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { NFTGrid } from './NFTGrid';
import { ConnectPrompt } from './ConnectPrompt';

export const Dashboard: FC = () => {
  const { connected } = useWallet();

  if (!connected) {
    return <ConnectPrompt />;
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-title text-text-light-primary dark:text-white mb-2 flex items-center justify-center gap-3">
        <img 
            src="/src/assets/pandas/nestledpandaflip.PNG" 
            alt="Raid Panda"
            className="w-12 h-12 object-contain"
          />
          My NFT Dashboard
          <img 
            src="/src/assets/pandas/nestledpanda.PNG" 
            alt="Raid Panda"
            className="w-12 h-12 object-contain"
          />
        </h1>
        <p className="text-text-light-secondary dark:text-text-dark-secondary">
          Checkout NFT's in your wallet.
        </p>
      </div>
      
      <NFTGrid 
        showWalletOnly={true}
        initialDisplayCount={4}
        showSearch={false}
      />
    </div>
  );
};