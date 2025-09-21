export interface CharacterStats {
  STR: number;
  DEX: number;
  CON: number;
  INT: number;
  WIS: number;
  CHA: number;
}

export interface CharacterAttack {
  name: string;
  damage: string;
  bonus?: number;
}

export interface CharacterTalent {
  name: string;
  description: string;
}

export type CharacterRace = 'Human' | 'Elf' | 'Dwarf' | 'Halfling' | 'Half-Orc' | 'Goblin';

export const RACES: CharacterRace[] = ['Human', 'Elf', 'Dwarf', 'Halfling', 'Half-Orc', 'Goblin'];

export type CharacterGender = 'Male' | 'Female';

export const GENDERS: CharacterGender[] = ['Male', 'Female'];

export interface Character {
  name: string;
  race: CharacterRace;
  gender: CharacterGender;
  class: string;
  level: number;
  xp: number;
  stats: CharacterStats;
  hp: number;
  maxHp: number;
  ac: number;
  background?: string;
  alignment?: string;
  deity?: string;
  attacks: CharacterAttack[];
  talents: string[];
  gear: string[];
  portrait?: string;
}

export const getModifier = (stat: number): number => {
  return Math.floor((stat - 10) / 2);
};

export const formatModifier = (mod: number): string => {
  return mod >= 0 ? `+${mod}` : `${mod}`;
};
