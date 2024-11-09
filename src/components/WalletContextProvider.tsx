import { FC, ReactNode, useEffect, useRef } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { ErrorBoundary } from './ErrorBoundary';
import '@solana/wallet-adapter-react-ui/styles.css';

// Load RPC settings from localStorage or use default
const getStoredRPCSettings = () => {
  const customRpcUrl = localStorage.getItem('custom_rpc_url');
  const customApiKey = localStorage.getItem('custom_api_key');
  
  if (customRpcUrl && customApiKey) {
    return `${customRpcUrl}?api-key=${customApiKey}`;
  }
  
  return `https://mainnet.helius-rpc.com/?api-key=294dd1b6-c58f-4fd1-bebf-2b17a910915a`;
};

interface Props {
  children: ReactNode;
}

export const WalletContextProvider: FC<Props> = ({ children }) => {
  const wallets = [new PhantomWalletAdapter()];
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create a container for the wallet adapter if it doesn't exist
    const modalContainer = document.createElement('div');
    modalContainer.id = 'wallet-adapter-modal-container';
    document.body.appendChild(modalContainer);

    // Cleanup on unmount
    return () => {
      if (modalContainer && modalContainer.parentNode) {
        modalContainer.parentNode.removeChild(modalContainer);
      }
    };
  }, []);

  return (
    <ErrorBoundary>
      <ConnectionProvider endpoint={getStoredRPCSettings()}>
        <WalletProvider 
          wallets={wallets} 
          autoConnect={true}
          onError={(error) => {
            if (error.name !== 'WalletConnectionError') {
              console.error('Wallet error:', error);
            }
          }}
        >
          <WalletModalProvider>
            {children}
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </ErrorBoundary>
  );
};