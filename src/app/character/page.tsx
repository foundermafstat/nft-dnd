'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useWeb3 } from '@/hooks/useWeb3';
import { useSoulboundToken } from '@/hooks/useSoulboundToken';
import { useCharacterStore } from '@/store/characterStore';
import CharacterSheet from '@/components/character/CharacterSheet';
import CreateCharacterCard from '@/components/CreateCharacterCard';
import DiceRoller from '@/components/DiceRoller';
import WalletConnectButton from '@/components/WalletConnectButton';

export default function CharacterPage() {
  const { isConnected } = useWeb3();
  const { hasSBT, isLoading: isLoadingSBT } = useSoulboundToken();
  const { character, resetCharacter } = useCharacterStore();
  const [isLoading, setIsLoading] = useState(true);

  // Инициализируем персонажа если его еще нет
  useEffect(() => {
    // Имитируем загрузку данных
    const timer = setTimeout(() => {
      if (!character && !hasSBT) {
        resetCharacter();
      }
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [character, hasSBT, resetCharacter]);

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-bold text-kaia-text-primary mb-6">
          Подключите кошелёк для доступа к персонажу
        </h1>
        <WalletConnectButton />
      </div>
    );
  }

  if (isLoading || isLoadingSBT) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-kaia-green/30 border-t-kaia-green rounded-full animate-spin mb-4"></div>
        <p className="text-kaia-text-secondary">Загрузка персонажа...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="col-span-1 md:col-span-2"
      >
        {character ? (
          <CharacterSheet />
        ) : (
          <CreateCharacterCard />
        )}
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="col-span-1"
      >
        <DiceRoller />
      </motion.div>
    </div>
  );
}
