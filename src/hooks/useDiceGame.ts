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

  // Preparing contract calls
  const { writeContract, data: writeData, isPending } = useWriteContract();

  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  // Listening for contract events
  useWatchContractEvent({
    address: contractAddresses.diceGame as `0x${string}`,
    abi: DiceGameABI,
    eventName: 'DiceRolled',
    onLogs(logs) {
      // Each log in the array represents an event
      logs.forEach((log) => {
        // log.args contains event data
        const [player, rollId, diceType, result, reason] = log.args;
        
        // Creating dice roll object
        const diceRoll: DiceRoll = {
          id: rollId.toString(),
          diceType: getDiceTypeString(Number(diceType)),
          result: Number(result),
          timestamp: Date.now(),
          characterName: character?.name || 'Unknown',
          reason: reason || '',
        };
        
        // Adding to history and showing notification
        addDiceRoll(diceRoll);
        addNotification({
          type: 'success',
          message: `${diceRoll.characterName} rolls ${diceRoll.diceType} and gets ${diceRoll.result}!`,
          duration: 3000,
        });
        
        setIsRolling(false);
      });
    }
  });

  // Function to determine dice type by number
  const getDiceTypeString = (diceType: number): 'd4' | 'd6' | 'd20' => {
    switch (diceType) {
      case 4: return 'd4';
      case 6: return 'd6';
      case 20: return 'd20';
      default: return 'd20';
    }
  };

  // Function to get numeric value of dice type
  const getDiceTypeNumber = (diceType: 'd4' | 'd6' | 'd20'): number => {
    switch (diceType) {
      case 'd4': return 4;
      case 'd6': return 6;
      case 'd20': return 20;
    }
  };

  // Function for rolling dice through smart contract
  const rollDice = useCallback(
    async (diceType: 'd4' | 'd6' | 'd20', reason: string = '') => {
      if (!character) {
        addNotification({
          type: 'error',
          message: 'Create a character first',
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
          message: 'Error rolling dice',
        });
        setIsRolling(false);
      }
    },
    [character, writeContract, addNotification]
  );

  // Local dice roll simulation (for testing without blockchain)
  const rollDiceLocal = useCallback(
    (diceType: 'd4' | 'd6' | 'd20', reason: string = '', characterName?: string) => {
      // If character name is not provided, use name from store or default
      const charName = characterName || (character?.name || 'Unknown');
      
      setIsRolling(true);

      // Get maximum value for selected dice type
      const max = getDiceTypeNumber(diceType);
      
      // Simulate network delay
      setTimeout(() => {
        // Generate random number
        const result = Math.floor(Math.random() * max) + 1;
        
        // Creating dice roll object
        const diceRoll: DiceRoll = {
          id: Date.now().toString(),
          diceType,
          result,
          timestamp: Date.now(),
          characterName: charName,
          reason,
        };
        
        // Adding to history and showing notification
        addDiceRoll(diceRoll);
        addNotification({
          type: 'success',
          message: `${diceRoll.characterName} rolls ${diceRoll.diceType} and gets ${diceRoll.result}!`,
          duration: 3000,
        });
        
        setIsRolling(false);
      }, 1000);
    },
    [character, addDiceRoll, addNotification]
  );

  // Processing successful transactions
  useEffect(() => {
    if (isSuccess) {
      addNotification({
        type: 'success',
        message: 'Dice roll completed!',
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