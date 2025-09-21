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

interface CharacterSheetProps {
  externalCharacter?: Character;
  isStatic?: boolean;
}

const CharacterSheet = ({ externalCharacter, isStatic = false }: CharacterSheetProps) => {
  const { character: storeCharacter, updateCharacter, updateStats } = useCharacterStore();
  const { updateCharacter: updateSBT, isLoading: isSbtLoading } = useSoulboundToken();
  const { addNotification } = useNotificationStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [localCharacter, setLocalCharacter] = useState<Character | null>(null);

  // Using either external data or data from store
  const character = externalCharacter || storeCharacter;

  // Initialize local copy of character on load
  useEffect(() => {
    if (character) {
      setLocalCharacter({ ...character });
    }
  }, [character]);

  if (!character || !localCharacter) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-muted-foreground">Character not found</p>
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
    if (isStatic) return; // Don't save if this is static mode
    
    try {
      setIsLoading(true);
      if (!localCharacter) return;
      
      // Update character in local store
      updateCharacter(localCharacter);
      updateStats(localCharacter.stats);
      
      // Convert character to token metadata
      const metadata = characterToTokenMetadata(localCharacter);
      
      // Create JSON string for token update
      const metadataString = JSON.stringify(metadata);
      
      // In a real application, this would upload metadata to IPFS or other storage
      // and update tokenURI in the contract
      
      // Simulate SBT update
      console.log('Updating SBT with metadata:', metadataString);
      // updateSBT(metadataString); // Uncomment for real blockchain update
      
      addNotification({
        type: 'success',
        message: 'Character successfully updated',
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving character:', error);
      addNotification({
        type: 'error',
        message: 'Error saving character',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Return local state to current character state
    if (character) {
      setLocalCharacter({ ...character });
    }
    setIsEditing(false);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-foreground">Character Sheet</h2>
        {!isStatic && (
          <div className="space-x-2">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading || isSbtLoading}
                  className="px-3 py-1 text-sm"
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  onClick={handleSave}
                  disabled={isLoading || isSbtLoading}
                  className="px-3 py-1 text-sm"
                >
                  {isLoading || isSbtLoading ? 'Saving...' : 'Save'}
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="px-3 py-1 text-sm text-primary border-primary hover:bg-primary/10"
              >
                Edit
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Basic info */}
        <motion.div layout className="col-span-1 md:col-span-3">
          <InfoBlock character={localCharacter} isEditing={isEditing && !isStatic} onChange={handleInfoChange} />
        </motion.div>

        {/* Stats */}
        <motion.div layout className="col-span-1">
          <StatBlock 
            stats={localCharacter.stats} 
            isEditing={isEditing && !isStatic} 
            onChange={handleStatChange} 
          />
        </motion.div>

        {/* Attacks and skills */}
        <motion.div layout className="col-span-1 md:col-span-2 space-y-6">
          <AttacksBlock 
            attacks={localCharacter.attacks} 
            isEditing={isEditing && !isStatic} 
            onChange={(attacks) => handleInfoChange('attacks', attacks)} 
          />
          
          <TalentsBlock 
            talents={localCharacter.talents} 
            isEditing={isEditing && !isStatic} 
            onChange={(talents) => handleInfoChange('talents', talents)} 
          />
        </motion.div>

        {/* Inventory */}
        <motion.div layout className="col-span-1 md:col-span-3">
          <GearBlock 
            gear={localCharacter.gear} 
            isEditing={isEditing && !isStatic} 
            onChange={(gear) => handleInfoChange('gear', gear)} 
          />
        </motion.div>
      </div>
    </div>
  );
};

export default CharacterSheet;