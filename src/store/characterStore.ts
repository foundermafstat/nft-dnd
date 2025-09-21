import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Character, CharacterStats, getModifier } from '@/types/character';
import { DiceRoll } from '@/types/web3';

interface CharacterState {
  character: Character | null;
  isLoading: boolean;
  error: string | null;
  diceRolls: DiceRoll[];
  setCharacter: (character: Character) => void;
  updateCharacter: (updates: Partial<Character>) => void;
  updateStats: (stats: Partial<CharacterStats>) => void;
  addDiceRoll: (roll: DiceRoll) => void;
  clearDiceRolls: () => void;
  resetCharacter: () => void;
}

// Создаем дефолтный персонаж для примера
const defaultCharacter: Character = {
  name: 'Ralina Biggins',
  race: 'Halfling',
  gender: 'Female',
  class: 'Thief',
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
  maxHp: 3,
  ac: 14,
  attacks: [
    { name: 'Dagger', damage: '1d4', bonus: getModifier(11) },
    { name: 'Crossbow', damage: '1d6', bonus: getModifier(17) }
  ],
  gear: ['Leather armor', 'Dagger', 'Crossbow', 'Bow bolts (20)', 'Rations (3)'],
  talents: ['Stealthy', 'Backstab', 'Thievery'],
  background: 'Criminal',
  alignment: 'Neutral',
  portrait: '/upload/character-portraits/halfling_female.png',
};

export const useCharacterStore = create<CharacterState>()(
  persist(
    (set) => ({
      character: null,
      isLoading: false,
      error: null,
      diceRolls: [],
      setCharacter: (character) => set({ character }),
      updateCharacter: (updates) =>
        set((state) => ({
          character: state.character
            ? { ...state.character, ...updates }
            : null,
        })),
      updateStats: (statUpdates) =>
        set((state) => {
          if (!state.character) return state;
          
          const newStats = { ...state.character.stats, ...statUpdates };
          
          // Обновляем бонусы к атакам в зависимости от характеристик
          const updatedAttacks = state.character.attacks.map(attack => {
            if (attack.name === 'Dagger') {
              return { ...attack, bonus: getModifier(newStats.STR) };
            }
            if (attack.name === 'Crossbow') {
              return { ...attack, bonus: getModifier(newStats.DEX) };
            }
            return attack;
          });
          
          return {
            character: {
              ...state.character,
              stats: newStats,
              attacks: updatedAttacks,
            },
          };
        }),
      addDiceRoll: (roll) =>
        set((state) => ({
          diceRolls: [roll, ...state.diceRolls].slice(0, 50), // Ограничиваем историю 50 бросками
        })),
      clearDiceRolls: () => set({ diceRolls: [] }),
      resetCharacter: () => set({ character: defaultCharacter }),
    }),
    {
      name: 'nft-dnd-character-storage',
    }
  )
);
