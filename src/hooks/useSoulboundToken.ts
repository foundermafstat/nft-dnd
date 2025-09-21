'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  useReadContract, 
  useWriteContract, 
  useWaitForTransactionReceipt 
} from 'wagmi';
import { parseEther } from 'viem';
import { SoulboundTokenABI } from '@/contracts/SoulboundTokenABI';
import { contractAddresses } from '@/lib/wagmiConfig';
import { useWeb3Store } from '@/store/web3Store';
import { useCharacterStore } from '@/store/characterStore';
import { useNotificationStore } from '@/store/notificationStore';
import { SBTMetadata, characterToTokenMetadata, tokenMetadataToCharacter } from '@/types/web3';

export function useSoulboundToken() {
  const { address, hasSBT, setSbtMetadata, setHasSBT, setLoading, setError } = useWeb3Store();
  const { setCharacter } = useCharacterStore();
  const { addNotification } = useNotificationStore();
  
  const [tokenId, setTokenId] = useState<string | null>(null);
  const [tokenURI, setTokenURI] = useState<string | null>(null);

  // Проверяем, есть ли у пользователя SBT
  const { data: balanceData } = useReadContract({
    address: contractAddresses.soulboundToken as `0x${string}`,
    abi: SoulboundTokenABI,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
    query: {
      enabled: !!address,
    }
  });

  // Функции для работы с контрактом
  const { writeContract, data: writeData, isPending: isWritePending, error: writeError } = useWriteContract();

  // Ожидание завершения транзакций
  const { isLoading: isMintLoading, isSuccess: isMintSuccess } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  // Получаем tokenId пользователя
  useEffect(() => {
    const fetchTokenId = async () => {
      if (!address || !balanceData || Number(balanceData) === 0) {
        setTokenId(null);
        setHasSBT(false);
        return;
      }

      try {
        // В реальном приложении нужно будет сделать запрос к контракту, чтобы получить tokenId пользователя
        // Здесь мы просто предполагаем, что у пользователя есть только один токен
        setHasSBT(true);
        setTokenId("1"); // Упрощено для примера
      } catch (error) {
        console.error('Error fetching token ID:', error);
        setError('Не удалось получить данные токена');
      }
    };

    fetchTokenId();
  }, [address, balanceData, setHasSBT, setError]);

  // Получаем метаданные токена
  useEffect(() => {
    const fetchTokenMetadata = async () => {
      if (!tokenId) return;

      setLoading(true);
      try {
        // В реальном приложении здесь будет запрос tokenURI из контракта
        // и затем запрос метаданных по этому URI
        
        // Пример с использованием контракта (закомментировано)
        /*
        const tokenURI = await sbtContract.tokenURI(tokenId);
        setTokenURI(tokenURI);
        
        // Если URI - это IPFS или HTTP URL
        const response = await fetch(tokenURI);
        const metadata = await response.json();
        */
        
        // Для примера используем тестовые данные
        const mockMetadata = {
          tokenId,
          owner: address as string,
          metadata: {
            name: "Ralina Biggins",
            class: "Thief",
            level: 1,
            xp: 10,
            stats: {
              STR: 11,
              DEX: 17,
              CON: 9,
              INT: 12,
              WIS: 8,
              CHA: 15
            },
            hp: 3,
            ac: 14,
            gear: ["Leather armor", "Dagger", "Crossbow", "Bow bolts (20)", "Rations (3)"],
            talents: ["Stealthy", "Backstab", "Thievery"]
          }
        };
        
        setSbtMetadata(mockMetadata);
        
        // Конвертируем метаданные в персонажа и обновляем хранилище
        const character = tokenMetadataToCharacter(mockMetadata.metadata);
        setCharacter(character);
      } catch (error) {
        console.error('Error fetching token metadata:', error);
        setError('Не удалось получить метаданные токена');
      } finally {
        setLoading(false);
      }
    };

    fetchTokenMetadata();
  }, [tokenId, address, setLoading, setSbtMetadata, setError, setCharacter]);

  // Функция для создания нового SBT
  const mintCharacter = useCallback(async (characterData: string) => {
    if (!address) {
      addNotification({
        type: 'error',
        message: 'Подключите кошелек для создания персонажа',
      });
      return;
    }

    try {
      writeContract({
        address: contractAddresses.soulboundToken as `0x${string}`,
        abi: SoulboundTokenABI,
        functionName: 'mint',
        args: [address as `0x${string}`, characterData],
      });
    } catch (error) {
      console.error('Error minting character:', error);
      addNotification({
        type: 'error',
        message: 'Ошибка при создании персонажа',
      });
    }
  }, [address, writeContract, addNotification]);

  // Функция для обновления метаданных SBT
  const updateCharacter = useCallback(async (characterData: string) => {
    if (!tokenId) {
      addNotification({
        type: 'error',
        message: 'Токен персонажа не найден',
      });
      return;
    }

    try {
      writeContract({
        address: contractAddresses.soulboundToken as `0x${string}`,
        abi: SoulboundTokenABI,
        functionName: 'setTokenURI',
        args: [BigInt(tokenId), characterData],
      });
    } catch (error) {
      console.error('Error updating character:', error);
      addNotification({
        type: 'error',
        message: 'Ошибка при обновлении персонажа',
      });
    }
  }, [tokenId, writeContract, addNotification]);

  // Обработка успешных транзакций
  useEffect(() => {
    if (isMintSuccess) {
      addNotification({
        type: 'success',
        message: 'Персонаж успешно создан!',
      });
    }
  }, [isMintSuccess, addNotification]);

  return {
    hasSBT,
    tokenId,
    tokenURI,
    isLoading: isWritePending || isMintLoading,
    mintCharacter,
    updateCharacter,
  };
}