import { FC } from 'react';
import { Wallet } from 'lucide-react';

export const Welcome: FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <Wallet className="w-16 h-16 text-purple-400 mb-4" />
      <h2 className="text-3xl font-bold text-white mb-4">
        Welcome to Solana NFT Dashboard
      </h2>
      <p className="text-gray-400 max-w-md">
        Connect your wallet to view your NFT collection and access exclusive features.
      </p>
    </div>
  );
};