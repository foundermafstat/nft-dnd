'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CharacterRace, CharacterGender, RACES, GENDERS } from '@/types/character';

interface RaceSelectorProps {
  selectedRace: CharacterRace;
  selectedGender: CharacterGender;
  onSelectRace: (race: CharacterRace) => void;
  onSelectGender: (gender: CharacterGender) => void;
}

const RaceSelector: React.FC<RaceSelectorProps> = ({ selectedRace, selectedGender, onSelectRace, onSelectGender }) => {
  const raceDescriptions: Record<CharacterRace, string> = {
    'Dwarf': 'Strong and enduring inhabitants of underground cities. +2 Constitution, +1 Wisdom, -1 Charisma. They can see in the dark and are skilled in working with stone and metal.',
    'Elf': 'Graceful and long-lived forest dwellers. +2 Dexterity, +1 Intelligence, -1 Constitution. They have special vision and are resistant to enchantment.',
    'Goblin': 'Small, agile, and inventive creatures. +2 Dexterity, +1 Charisma, -1 Strength. They can see in the dark and squeeze into tight spaces.',
    'Halfling': 'Small and lucky creatures. +2 Dexterity, +1 Charisma, -1 Strength. Their natural luck and stealth help them avoid dangers.',
    'Half-Orc': 'Strong warriors combining the best qualities of humans and orcs. +2 Strength, +1 Constitution, -1 Intelligence. They are resistant to wounds and possess ferocity in battle.',
    'Human': 'Universal, adaptive, and ambitious. +1 to all characteristics. They learn new skills quickly and can excel in any field.',
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-bold mb-4">Choose a race</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {RACES.map((race) => (
          <motion.div
            key={race}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectRace(race)}
            className={`cursor-pointer rounded-lg overflow-hidden border-2 ${
              selectedRace === race
                ? 'border-neon-green glow-border'
                : 'border-border'
            }`}
          >
            <div className="relative aspect-[3/4] bg-card-dark overflow-hidden">
              <img 
                src={`/upload/character-portraits/${race.toLowerCase().replace('-', '_')}${selectedGender === 'Female' ? '_female' : ''}.png`}
                alt={race}
                className="object-cover w-full h-full"
                onError={(e) => {
                  // If image not found, show placeholder
                  (e.target as HTMLImageElement).src = '/upload/character-portraits/placeholder.png';
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                <h4 className={`text-center font-bold ${
                  selectedRace === race ? 'text-neon-green' : 'text-white'
                }`}>
                  {race}
                </h4>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Gender switch */}
      <div className="flex justify-center mt-6 mb-3">
        <div className="bg-card rounded-full p-1 inline-flex">
          {GENDERS.map((gender) => (
            <button
              key={gender}
              onClick={() => onSelectGender(gender)}
              className={`px-4 py-2 rounded-full transition-colors ${
                selectedGender === gender 
                  ? 'bg-neon-green text-black' 
                  : 'text-foreground hover:bg-secondary'
              }`}
            >
              {gender === 'Male' ? 'Male' : 'Female'}
            </button>
          ))}
        </div>
      </div>
      
      <div className="mt-4 p-4 bg-card rounded-md">
        <h4 className="font-medium mb-2">Race traits: {selectedRace}</h4>
        <p className="text-sm text-muted-foreground">
          {raceDescriptions[selectedRace]}
        </p>
      </div>
    </div>
  );
};

export default RaceSelector;
