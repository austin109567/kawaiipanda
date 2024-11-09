import { FC } from 'react';
import { WalletConnect } from './WalletConnect';
import { Wallet } from 'lucide-react';

export const ConnectPrompt: FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-16 h-16 bg-primary-main/10 rounded-full flex items-center justify-center mb-6">
        <Wallet className="w-8 h-8 text-primary-main" />
      </div>
      <h2 className="text-3xl font-title text-text-light-primary dark:text-white mb-4">
        Connect Your Wallet
      </h2>
      <p className="text-text-light-secondary dark:text-text-dark-secondary mb-8 max-w-md">
        Connect your wallet to access exclusive features and start your raiding adventure!
      </p>
      <WalletConnect />
    </div>
  );
};