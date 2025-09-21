'use client';

import { useState, useCallback, useEffect } from 'react';
import { 
  useWriteContract, 
  useWaitForTransactionReceipt,
  useWatchContractEvent
} from 'wagmi';
import { DiceGameABI } from '@/contracts/DiceGameABI';
import { contractAddresses } from '@/lib/wagmiConfig';
import { useCharacterStore } from '@/store/characterStore';
import { useNotificationStore } from '@/store/notificationStore';
import { DiceRoll } from '@/types/web3';

export function useDiceGame() {
  const [isRolling, setIsRolling] = useState(false);
  const { character, addDiceRoll } = useCharacterStore();
  const { addNotification } = useNotificationStore();

  // Подготавливаем вызовы контракта
  const { writeContract, data: writeData, isPending } = useWriteContract();

  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  // Слушаем события от контракта
  useWatchContractEvent({
    address: contractAddresses.diceGame as `0x${string}`,
    abi: DiceGameABI,
    eventName: 'DiceRolled',
    onLogs(logs) {
      // Каждый лог в массиве представляет собой событие
      logs.forEach((log) => {
        // log.args содержит данные события
        const [player, rollId, diceType, result, reason] = log.args;
        
        // Создаем объект броска кубика
        const diceRoll: DiceRoll = {
          id: rollId.toString(),
          diceType: getDiceTypeString(Number(diceType)),
          result: Number(result),
          timestamp: Date.now(),
          characterName: character?.name || 'Unknown',
          reason: reason || '',
        };
        
        // Добавляем в историю и показываем уведомление
        addDiceRoll(diceRoll);
        addNotification({
          type: 'success',
          message: `${diceRoll.characterName} бросает ${diceRoll.diceType} и выкидывает ${diceRoll.result}!`,
          duration: 3000,
        });
        
        setIsRolling(false);
      });
    }
  });

  // Функция для определения типа кубика по числу
  const getDiceTypeString = (diceType: number): 'd4' | 'd6' | 'd20' => {
    switch (diceType) {
      case 4: return 'd4';
      case 6: return 'd6';
      case 20: return 'd20';
      default: return 'd20';
    }
  };

  // Функция для получения числового значения типа кубика
  const getDiceTypeNumber = (diceType: 'd4' | 'd6' | 'd20'): number => {
    switch (diceType) {
      case 'd4': return 4;
      case 'd6': return 6;
      case 'd20': return 20;
    }
  };

  // Функция для броска кубика через смарт-контракт
  const rollDice = useCallback(
    async (diceType: 'd4' | 'd6' | 'd20', reason: string = '') => {
      if (!character) {
        addNotification({
          type: 'error',
          message: 'Сначала создайте персонажа',
        });
        return;
      }

      setIsRolling(true);
      try {
        writeContract({
          address: contractAddresses.diceGame as `0x${string}`,
          abi: DiceGameABI,
          functionName: 'rollDice',
          args: [getDiceTypeNumber(diceType), reason || ''],
        });
      } catch (error) {
        console.error('Error rolling dice:', error);
        addNotification({
          type: 'error',
          message: 'Ошибка при броске кубика',
        });
        setIsRolling(false);
      }
    },
    [character, writeContract, addNotification]
  );

  // Имитация броска кубика локально (для тестирования без блокчейна)
  const rollDiceLocal = useCallback(
    (diceType: 'd4' | 'd6' | 'd20', reason: string = '') => {
      if (!character) {
        addNotification({
          type: 'error',
          message: 'Сначала создайте персонажа',
        });
        return;
      }

      setIsRolling(true);

      // Получаем максимальное значение для выбранного типа кубика
      const max = getDiceTypeNumber(diceType);
      
      // Имитируем задержку сети
      setTimeout(() => {
        // Генерируем случайное число
        const result = Math.floor(Math.random() * max) + 1;
        
        // Создаем объект броска кубика
        const diceRoll: DiceRoll = {
          id: Date.now().toString(),
          diceType,
          result,
          timestamp: Date.now(),
          characterName: character.name,
          reason,
        };
        
        // Добавляем в историю и показываем уведомление
        addDiceRoll(diceRoll);
        addNotification({
          type: 'success',
          message: `${diceRoll.characterName} бросает ${diceRoll.diceType} и выкидывает ${diceRoll.result}!`,
          duration: 3000,
        });
        
        setIsRolling(false);
      }, 1000);
    },
    [character, addDiceRoll, addNotification]
  );

  // Обработка успешных транзакций
  useEffect(() => {
    if (isSuccess) {
      addNotification({
        type: 'success',
        message: 'Бросок кубика выполнен!',
        duration: 3000,
      });
    }
  }, [isSuccess, addNotification]);

  return {
    rollDice,
    rollDiceLocal,
    isRolling: isRolling || isPending || isLoading,
    isSuccess,
  };
}