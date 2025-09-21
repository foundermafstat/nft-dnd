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
    'Dwarf': 'Крепкие и выносливые жители подземных городов. +2 Телосложение, +1 Мудрость, -1 Харизма. Видят в темноте и искусны в работе с камнем и металлом.',
    'Elf': 'Изящные и долгоживущие обитатели лесов. +2 Ловкость, +1 Интеллект, -1 Телосложение. Имеют особое зрение и устойчивы к зачарованию.',
    'Goblin': 'Маленькие, ловкие и изобретательные существа. +2 Ловкость, +1 Харизма, -1 Сила. Могут видеть в темноте и проникать в узкие пространства.',
    'Halfling': 'Маленькие и удачливые существа. +2 Ловкость, +1 Харизма, -1 Сила. Природная удачливость и скрытность помогают им избегать опасностей.',
    'Half-Orc': 'Сильные воины, объединяющие лучшие качества людей и орков. +2 Сила, +1 Телосложение, -1 Интеллект. Устойчивы к ранам и обладают свирепостью в бою.',
    'Human': 'Универсальные, адаптивные и амбициозные. +1 ко всем характеристикам. Быстро обучаются новым навыкам и способны преуспеть в любой области.',
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-bold mb-4">Выберите расу</h3>
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
                  // Если изображение не найдено, показываем заглушку
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
      
      {/* Переключатель пола */}
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
              {gender === 'Male' ? 'Мужской' : 'Женский'}
            </button>
          ))}
        </div>
      </div>
      
      <div className="mt-4 p-4 bg-card rounded-md">
        <h4 className="font-medium mb-2">Особенности расы: {selectedRace}</h4>
        <p className="text-sm text-muted-foreground">
          {raceDescriptions[selectedRace]}
        </p>
      </div>
    </div>
  );
};

export default RaceSelector;
