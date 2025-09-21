import { Character, CharacterRace, CharacterGender } from './character';

export interface DiceRoll {
  id: string;
  diceType: 'd4' | 'd6' | 'd20';
  result: number;
  timestamp: number;
  characterName: string;
  reason?: string;
}

export interface TokenMetadata {
  name: string;
  race: string;
  gender: string;
  class: string;
  level: number;
  xp: number;
  stats: {
    STR: number;
    DEX: number;
    CON: number;
    INT: number;
    WIS: number;
    CHA: number;
  };
  hp: number;
  ac: number;
  gear: string[];
  talents: string[];
  background?: string;
  alignment?: string;
  deity?: string;
  image?: string;
}

export interface SBTMetadata {
  tokenId: string;
  owner: string;
  metadata: TokenMetadata;
}

export const characterToTokenMetadata = (character: Character): TokenMetadata => {
  return {
    name: character.name,
    race: character.race,
    gender: character.gender,
    class: character.class,
    level: character.level,
    xp: character.xp,
    stats: character.stats,
    hp: character.hp,
    ac: character.ac,
    gear: character.gear,
    talents: character.talents,
    background: character.background,
    alignment: character.alignment,
    deity: character.deity,
    image: character.portrait,
  };
};

export const tokenMetadataToCharacter = (metadata: TokenMetadata): Character => {
  return {
    name: metadata.name,
    race: metadata.race as CharacterRace || 'Human',
    gender: metadata.gender as CharacterGender || 'Male',
    class: metadata.class,
    level: metadata.level,
    xp: metadata.xp,
    stats: metadata.stats,
    hp: metadata.hp,
    maxHp: metadata.hp, // Предполагаем, что текущее HP равно максимальному
    ac: metadata.ac,
    background: metadata.background,
    alignment: metadata.alignment,
    deity: metadata.deity,
    attacks: [], // Нужно добавить логику для создания атак на основе класса
    talents: metadata.talents,
    gear: metadata.gear,
    portrait: metadata.image,
  };
};
