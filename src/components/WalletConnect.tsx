import { FC, useCallback, useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { playerService } from '../services/playerService';

interface WalletConnectProps {
  onConnect?: () => void;
}

export const WalletConnect: FC<WalletConnectProps> = ({ onConnect }) => {
  const { connected, connecting, wallet, select, connect, publicKey } = useWallet();
  const [hasConnected, setHasConnected] = useState(false);

  useEffect(() => {
    if (connected && publicKey) {
      playerService.enrollPlayer(publicKey.toString());
    }
  }, [connected, publicKey]);

  const handleConnect = useCallback(async () => {
    try {
      if (wallet) {
        await connect();
        setHasConnected(true);
      }
    } catch (error: any) {
      if (error.name !== 'WalletConnectionError') {
        console.error('Connection error:', error);
      }
    }
  }, [wallet, connect]);

  useEffect(() => {
    if (wallet && !connected && !connecting && !hasConnected) {
      handleConnect();
    }
  }, [wallet, connected, connecting, handleConnect, hasConnected]);

  useEffect(() => {
    if (connected && onConnect && hasConnected) {
      onConnect();
    }
  }, [connected, onConnect, hasConnected]);

  return (
    <div className="flex items-center gap-4">
      <WalletMultiButton 
        className="!bg-primary-main !text-white hover:!bg-primary-main/90 !transition-all !rounded-lg !font-medium !h-9 !px-4 !py-0 !text-xs !whitespace-nowrap !min-w-[130px] !flex !items-center !justify-center !gap-1.5 !shadow-glow"
        onClick={() => {
          if (!wallet) {
            select('phantom');
          }
        }}
      >
        {!connected ? 'Connect' : (
          <span className="truncate max-w-[100px]">
            {publicKey?.toString().slice(0, 4)}...{publicKey?.toString().slice(-4)}
          </span>
        )}
      </WalletMultiButton>
    </div>
  );
};