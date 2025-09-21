'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useWeb3 } from '@/hooks/useWeb3';
import { useSoulboundToken } from '@/hooks/useSoulboundToken';
import { useCharacterStore } from '@/store/characterStore';
import { characterToTokenMetadata } from '@/types/web3';
import { UserPlusIcon } from '@heroicons/react/24/outline';
import { CharacterRace, CharacterGender } from '@/types/character';
import RaceSelector from './character/RaceSelector';

const CreateCharacterCard = () => {
  const { isConnected } = useWeb3();
  const { mintCharacter } = useSoulboundToken();
  const { character, resetCharacter, updateCharacter } = useCharacterStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showRaceSelector, setShowRaceSelector] = useState(false);
  const [selectedRace, setSelectedRace] = useState<CharacterRace>(character?.race || 'Human');
  const [selectedGender, setSelectedGender] = useState<CharacterGender>(character?.gender || 'Male');

  const handleSelectRace = (race: CharacterRace) => {
    setSelectedRace(race);
    if (character) {
      updateCharacter({ 
        ...character, 
        race, 
        portrait: `/upload/character-portraits/${race.toLowerCase().replace('-', '_')}${selectedGender === 'Female' ? '_female' : ''}.png`
      });
    }
  };

  const handleSelectGender = (gender: CharacterGender) => {
    setSelectedGender(gender);
    if (character) {
      updateCharacter({ 
        ...character, 
        gender, 
        portrait: `/upload/character-portraits/${selectedRace.toLowerCase().replace('-', '_')}${gender === 'Female' ? '_female' : ''}.png`
      });
    }
  };

  const handleCreateCharacter = async () => {
    if (!character) {
      resetCharacter();
      return;
    }

    if (!showRaceSelector) {
      setShowRaceSelector(true);
      return;
    }

    setIsLoading(true);
    try {
      const metadata = characterToTokenMetadata(character);
      const metadataString = JSON.stringify(metadata);
      
      // In a real application, there would be metadata upload to IPFS here
      // const ipfsHash = await uploadToIPFS(metadataString);
      // const tokenURI = `ipfs://${ipfsHash}`;
      
      // For example, we're using JSON string directly
      // mintCharacter(metadataString);
      
      // Simulate delay
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
      
    } catch (error) {
      console.error('Failed to create character:', error);
    }
  };

  return (
    <motion.div
      style={{
        backgroundColor: '#121212',
        borderRadius: '0.5rem',
        padding: '1.5rem',
        border: '1px solid #232323',
        transition: 'border-color 0.2s',
      }}
      className="card neon-box"
    >
      {!showRaceSelector ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <div style={{
            width: '5rem',
            height: '5rem',
            borderRadius: '9999px',
            backgroundColor: 'rgba(57, 255, 20, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem'
          }}>
            <UserPlusIcon style={{ width: '2.5rem', height: '2.5rem', color: '#39ff14' }} />
          </div>
          
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: 'bold',
            color: '#f0f0f0',
            marginBottom: '0.5rem'
          }}>
            Create a Character
          </h3>
          
          <p style={{
            color: 'rgba(240, 240, 240, 0.7)',
            marginBottom: '1.5rem'
          }}>
            Create a new D&D character and save it as a unique NFT token
          </p>
          
          <button
            onClick={handleCreateCharacter}
            disabled={!isConnected}
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '0.375rem',
              backgroundColor: 'rgba(57, 255, 20, 0.2)',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: '#39ff14',
              color: '#39ff14',
              transition: 'all 0.2s',
              opacity: (!isConnected) ? 0.5 : 1,
              cursor: (!isConnected) ? 'not-allowed' : 'pointer'
            }}
            className="neon-border"
          >
            {isConnected ? 'Start creation' : 'Connect wallet first'}
          </button>
        </div>
      ) : (
        <div>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: 'bold',
            color: '#f0f0f0',
            marginBottom: '1rem'
          }}>
            Character Creation
          </h3>
          
          <RaceSelector 
            selectedRace={selectedRace}
            selectedGender={selectedGender}
            onSelectRace={handleSelectRace}
            onSelectGender={handleSelectGender}
          />
          
          <div className="flex justify-between">
            <button
              onClick={() => setShowRaceSelector(false)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                backgroundColor: 'transparent',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: '#666',
                color: '#f0f0f0',
                transition: 'all 0.2s',
              }}
              className="hover:bg-gray-800"
            >
              Back
            </button>
            
            <button
              onClick={handleCreateCharacter}
              disabled={isLoading}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                backgroundColor: 'rgba(57, 255, 20, 0.2)',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: '#39ff14',
                color: '#39ff14',
                transition: 'all 0.2s',
                opacity: isLoading ? 0.5 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
              className="neon-border"
            >
              {isLoading ? 'Creating...' : 'Create Character'}
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CreateCharacterCard;