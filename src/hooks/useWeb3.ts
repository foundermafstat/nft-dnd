'use client';

import { useEffect } from 'react';
import { 
  useAccount, 
  useConnect, 
  useDisconnect, 
  useChainId 
} from 'wagmi';
import { useWeb3Store } from '@/store/web3Store';
import { useNotificationStore } from '@/store/notificationStore';

export function useWeb3() {
  const {
    isConnected,
    address,
    chainId,
    setConnected,
    setAddress,
    setChainId,
    resetState,
  } = useWeb3Store();
  
  const { addNotification } = useNotificationStore();
  
  const { 
    address: wagmiAddress,
    isConnected: wagmiIsConnected,
    status
  } = useAccount();
  
  const { connectors, connect, error: connectError, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const currentChainId = useChainId();

  // Синхронизируем состояние wagmi с нашим хранилищем
  useEffect(() => {
    if (wagmiIsConnected !== isConnected) {
      setConnected(wagmiIsConnected);
    }
    
    if (wagmiAddress !== address) {
      setAddress(wagmiAddress || null);
    }
    
    if (currentChainId !== chainId) {
      setChainId(currentChainId || null);
    }
  }, [wagmiIsConnected, wagmiAddress, currentChainId, isConnected, address, chainId, setConnected, setAddress, setChainId]);

  // Отображаем уведомления при ошибках подключения
  useEffect(() => {
    if (connectError) {
      addNotification({
        type: 'error',
        message: `Ошибка подключения: ${connectError.message}`,
      });
    }
  }, [connectError, addNotification]);

  const handleConnect = async (connectorId: string) => {
    try {
      const connector = connectors.find(c => c.id === connectorId);
      if (connector) {
        await connect({ connector });
      }
    } catch (error) {
      console.error('Failed to connect:', error);
      addNotification({
        type: 'error',
        message: 'Не удалось подключиться к кошельку',
      });
    }
  };

  const handleDisconnect = () => {
    disconnect();
    resetState();
  };

  return {
    isConnected: wagmiIsConnected,
    address: wagmiAddress,
    chainId: currentChainId,
    chain: { id: currentChainId },
    status,
    connectors,
    isLoading: isPending,
    pendingConnector: null,
    connect: handleConnect,
    disconnect: handleDisconnect,
  };
}