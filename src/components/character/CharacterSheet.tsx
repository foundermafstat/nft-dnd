'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Character, formatModifier, getModifier } from '@/types/character';
import { useCharacterStore } from '@/store/characterStore';
import { useSoulboundToken } from '@/hooks/useSoulboundToken';
import { characterToTokenMetadata } from '@/types/web3';
import { useNotificationStore } from '@/store/notificationStore';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import StatBlock from './StatBlock';
import InfoBlock from './InfoBlock';
import AttacksBlock from './AttacksBlock';
import TalentsBlock from './TalentsBlock';
import GearBlock from './GearBlock';

const CharacterSheet = () => {
  const { character, updateCharacter, updateStats } = useCharacterStore();
  const { updateCharacter: updateSBT, isLoading } = useSoulboundToken();
  const { addNotification } = useNotificationStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [localCharacter, setLocalCharacter] = useState<Character | null>(null);

  // Инициализируем локальную копию персонажа при загрузке
  useEffect(() => {
    if (character) {
      setLocalCharacter({ ...character });
    }
  }, [character]);

  if (!character || !localCharacter) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-muted-foreground">Персонаж не найден</p>
      </div>
    );
  }

  const handleStatChange = (stat: keyof typeof character.stats, value: number) => {
    setLocalCharacter({
      ...localCharacter,
      stats: {
        ...localCharacter.stats,
        [stat]: value
      }
    });
  };

  const handleInfoChange = (field: keyof Character, value: unknown) => {
    setLocalCharacter({
      ...localCharacter,
      [field]: value
    });
  };

  const handleSave = async () => {
    try {
      if (!localCharacter) return;
      
      // Обновляем персонажа в локальном хранилище
      updateCharacter(localCharacter);
      updateStats(localCharacter.stats);
      
      // Конвертируем персонажа в метаданные токена
      const metadata = characterToTokenMetadata(localCharacter);
      
      // Создаем JSON строку для обновления токена
      const metadataString = JSON.stringify(metadata);
      
      // В реальном приложении здесь будет загрузка метаданных в IPFS или другое хранилище
      // и обновление tokenURI в контракте
      
      // Имитируем обновление SBT
      console.log('Updating SBT with metadata:', metadataString);
      // updateSBT(metadataString); // Раскомментировать для реального обновления в блокчейне
      
      addNotification({
        type: 'success',
        message: 'Персонаж успешно обновлен',
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving character:', error);
      addNotification({
        type: 'error',
        message: 'Ошибка при сохранении персонажа',
      });
    }
  };

  const handleCancel = () => {
    // Возвращаем локальное состояние к текущему состоянию персонажа
    if (character) {
      setLocalCharacter({ ...character });
    }
    setIsEditing(false);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-foreground">Лист персонажа</h2>
        <div className="space-x-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
                className="px-3 py-1 text-sm"
              >
                Отменить
              </Button>
              <Button
                variant="default"
                onClick={handleSave}
                disabled={isLoading}
                className="px-3 py-1 text-sm"
              >
                {isLoading ? 'Сохранение...' : 'Сохранить'}
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="px-3 py-1 text-sm text-primary border-primary hover:bg-primary/10"
            >
              Редактировать
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Основная информация */}
        <motion.div layout className="col-span-1 md:col-span-3">
          <InfoBlock character={localCharacter} isEditing={isEditing} onChange={handleInfoChange} />
        </motion.div>

        {/* Характеристики */}
        <motion.div layout className="col-span-1">
          <StatBlock 
            stats={localCharacter.stats} 
            isEditing={isEditing} 
            onChange={handleStatChange} 
          />
        </motion.div>

        {/* Атаки и навыки */}
        <motion.div layout className="col-span-1 md:col-span-2 space-y-6">
          <AttacksBlock 
            attacks={localCharacter.attacks} 
            isEditing={isEditing} 
            onChange={(attacks) => handleInfoChange('attacks', attacks)} 
          />
          
          <TalentsBlock 
            talents={localCharacter.talents} 
            isEditing={isEditing} 
            onChange={(talents) => handleInfoChange('talents', talents)} 
          />
        </motion.div>

        {/* Инвентарь */}
        <motion.div layout className="col-span-1 md:col-span-3">
          <GearBlock 
            gear={localCharacter.gear} 
            isEditing={isEditing} 
            onChange={(gear) => handleInfoChange('gear', gear)} 
          />
        </motion.div>
      </div>
    </div>
  );
};

export default CharacterSheet;