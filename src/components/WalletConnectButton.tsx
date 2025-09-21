'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWeb3 } from '@/hooks/useWeb3';
import { ArrowRightOnRectangleIcon, WalletIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

const WalletConnectButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isConnected, address, connectors, connect, disconnect, isLoading } = useWeb3();

  const formatAddress = (address: string | undefined) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleConnect = (connectorId: string) => {
    connect(connectorId);
    setIsOpen(false);
  };

  const handleDisconnect = () => {
    disconnect();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full border transition-all",
          isConnected ? 
            "border-primary text-primary neon-border hover:bg-primary/20" : 
            "border-secondary text-secondary neon-yellow-border hover:bg-secondary/20"
        )}
      >
        <WalletIcon className="w-5 h-5" />
        <span className="hidden sm:inline">
          {isLoading
            ? 'Подключение...'
            : isConnected
              ? formatAddress(address)
              : 'Подключить кошелёк'}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Оверлей для закрытия меню при клике вне его */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Выпадающее меню */}
            <motion.div
              className="absolute right-0 mt-2 p-2 w-56 bg-card border border-border rounded-md shadow-lg z-50"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {isConnected ? (
                <div>
                  <div className="p-3 text-sm font-medium">
                    Подключен
                  </div>
                  <div className="p-3 pt-0 text-xs text-muted-foreground border-b border-border">
                    {address}
                  </div>
                  <button
                    onClick={handleDisconnect}
                    className="flex items-center w-full p-3 text-sm text-destructive hover:bg-muted/50 text-left"
                  >
                    <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
                    Отключиться
                  </button>
                </div>
              ) : (
                <div>
                  <div className="p-3 text-sm font-medium">
                    Выберите кошелёк
                  </div>
                  {connectors.map((connector) => (
                    <button
                      key={connector.id}
                      onClick={() => handleConnect(connector.id)}
                      disabled={!connector.ready || isLoading}
                      className={cn(
                        "flex items-center w-full p-3 text-sm hover:bg-muted/50 text-left",
                        (!connector.ready || isLoading) ? "opacity-50" : ""
                      )}
                    >
                      {connector.name}
                      {!connector.ready && ' (не установлен)'}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WalletConnectButton;