import { FC, useState, useEffect } from 'react';
import { Save, Server, Key, AlertCircle } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { ConnectPrompt } from './ConnectPrompt';

export const Settings: FC = () => {
  const { connected } = useWallet();
  const [rpcUrl, setRpcUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);
  const [useCustomEndpoint, setUseCustomEndpoint] = useState(false);

  useEffect(() => {
    const storedRpcUrl = localStorage.getItem('custom_rpc_url');
    const storedApiKey = localStorage.getItem('custom_api_key');
    
    if (storedRpcUrl && storedApiKey) {
      setRpcUrl(storedRpcUrl);
      setApiKey(storedApiKey);
      setUseCustomEndpoint(true);
    }
  }, []);

  const handleSave = () => {
    if (useCustomEndpoint && rpcUrl && apiKey) {
      localStorage.setItem('custom_rpc_url', rpcUrl);
      localStorage.setItem('custom_api_key', apiKey);
      localStorage.setItem('disable_rate_limit', 'true');
    } else {
      localStorage.removeItem('custom_rpc_url');
      localStorage.removeItem('custom_api_key');
      localStorage.removeItem('disable_rate_limit');
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!connected) {
    return <ConnectPrompt />;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 px-4">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-title text-text-light-primary dark:text-white mb-2 flex items-center justify-center gap-3">
          Settings
        </h1>
        <p className="text-text-light-secondary dark:text-text-dark-secondary">
          Configure a Custom API or use the Default API
        </p>
      </div>

      {/* Settings Panel */}
      <div className="gradient-box p-8">
        {/* Custom Endpoint Toggle */}
        <div className="flex items-center gap-3 mb-6 p-4 bg-primary-pink/10 rounded-lg">
          <input
            type="checkbox"
            id="use-custom"
            checked={useCustomEndpoint}
            onChange={(e) => setUseCustomEndpoint(e.target.checked)}
            className="w-4 h-4 rounded border-primary-pink/20 text-primary-pink focus:ring-primary-pink"
          />
          <div>
            <label htmlFor="use-custom" className="text-white font-medium">
              Use Custom RPC Endpoint
            </label>
            <p className="text-sm text-neutral-lightGray mt-1">
              Enable this to use your own RPC endpoint and API key
            </p>
          </div>
        </div>

        {useCustomEndpoint && (
          <div className="space-y-6">
            {/* RPC URL Input */}
            <div className="space-y-2">
              <label htmlFor="rpc-url" className="block text-sm font-medium text-white">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-primary-pink" />
                  Custom RPC URL
                </div>
              </label>
              <input
                type="text"
                id="rpc-url"
                value={rpcUrl}
                onChange={(e) => setRpcUrl(e.target.value)}
                placeholder="https://your-rpc-endpoint.com"
                className="w-full px-4 py-2 bg-black/40 border border-primary-pink/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-pink/40"
              />
              <p className="text-xs text-neutral-lightGray">
                Enter your custom RPC endpoint URL (e.g., Helius, QuickNode)
              </p>
            </div>

            {/* API Key Input */}
            <div className="space-y-2">
              <label htmlFor="api-key" className="block text-sm font-medium text-white">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-primary-pink" />
                  API Key
                </div>
              </label>
              <input
                type="password"
                id="api-key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Your API key"
                className="w-full px-4 py-2 bg-black/40 border border-primary-pink/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-pink/40"
              />
              <p className="text-xs text-neutral-lightGray">
                Enter your API key for the custom RPC endpoint
              </p>
            </div>
          </div>
        )}

        {/* Warning Message */}
        {!useCustomEndpoint && (
          <div className="flex items-start gap-3 p-4 bg-yellow-900/20 rounded-lg mb-6">
            <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-200">
              Using default RPC endpoint with rate limiting enabled. For better performance, consider using a custom endpoint.
            </p>
          </div>
        )}

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-pink text-white rounded-lg hover:bg-primary-pink/90 transition-colors"
        >
          <Save className="w-4 h-4" />
          {saved ? 'Settings Saved!' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
};