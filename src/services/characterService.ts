// Service for working with character data
import { Character, CharacterRace, CharacterGender } from '@/types/character';

// Mock data for characters
const characters = [
  { 
    id: 1, 
    name: 'Ralina', 
    race: 'Elf',
    gender: 'Female',
    class: 'Wizard', 
    level: 5,
    xp: 350,
    hp: 28,
    maxHp: 35, 
    ac: 12,
    background: 'Sage',
    alignment: 'Chaotic Good',
    deity: 'Seladrine',
    portrait: '/upload/character-portraits/elf_female.png',
    attacks: [
      { name: 'Magic Missile', damage: '3d4+3', bonus: 7 },
      { name: 'Staff', damage: '1d6', bonus: 2 }
    ],
    talents: ['Mage Hand', 'Fireball', 'Mage Shield', 'Invisibility'],
    gear: ['Spellbook', 'Wizard Staff', 'Spell Components', 'Magic Robe', 'Healing Potion'],
    stats: {
      STR: 8,
      DEX: 14,
      CON: 12,
      INT: 17,
      WIS: 13,
      CHA: 10
    }
  },
  { 
    id: 2, 
    name: 'Thorn', 
    race: 'Human',
    gender: 'Male',
    class: 'Warrior', 
    level: 7,
    xp: 550,
    hp: 65,
    maxHp: 65, 
    ac: 18,
    background: 'Soldier',
    alignment: 'Lawful Neutral',
    deity: 'Tempus',
    portrait: '/upload/character-portraits/human.png',
    attacks: [
      { name: 'Longsword', damage: '1d8+3', bonus: 6 },
      { name: 'Heavy Crossbow', damage: '1d10', bonus: 4 }
    ],
    talents: ['Fighting Style: Protection', 'Second Wind', 'Improved Critical Hit', 'Extra Attack'],
    gear: ['Chainmail', 'Shield', 'Longsword', 'Heavy Crossbow', 'Explorer Pack'],
    stats: {
      STR: 16,
      DEX: 12,
      CON: 15,
      INT: 8,
      WIS: 10,
      CHA: 14
    }
  },
  {
    id: 3,
    name: 'Grokk',
    race: 'Half-Orc',
    gender: 'Male',
    class: 'Barbarian',
    level: 6,
    xp: 450,
    hp: 72,
    maxHp: 72,
    ac: 15,
    background: 'Outlander',
    alignment: 'Chaotic Neutral',
    deity: 'Gruumsh',
    portrait: '/upload/character-portraits/half_orc.png',
    attacks: [
      { name: 'Battle Axe', damage: '1d12+4', bonus: 7 },
      { name: 'Throwing Axes', damage: '1d6+4', bonus: 7 }
    ],
    talents: ['Rage', 'Reckless Attack', 'Danger Sense', 'Path of the Berserker'],
    gear: ['Leather Armor', 'Battle Axe', 'Throwing Axes (3)', 'Fang Amulet', 'Hunting Horn'],
    stats: {
      STR: 18,
      DEX: 12,
      CON: 16,
      INT: 7,
      WIS: 10,
      CHA: 8
    }
  },
  {
    id: 4,
    name: 'Lilia',
    race: 'Halfling',
    gender: 'Female',
    class: 'Druid',
    level: 5,
    xp: 330,
    hp: 36,
    maxHp: 40,
    ac: 14,
    background: 'Hermit',
    alignment: 'Neutral Good',
    deity: 'Silvanus',
    portrait: '/upload/character-portraits/halfling_female.png',
    attacks: [
      { name: 'Staff', damage: '1d6', bonus: 4 },
      { name: 'Sickle', damage: '1d4', bonus: 4 }
    ],
    talents: ['Wild Shape', 'Speak with Plants', 'Entangle', 'Restoration', 'Circle of Land'],
    gear: ['Leather Armor', 'Wooden Shield', 'Staff', 'Sickle', 'Druidic Focus', 'Herbalism Kit'],
    stats: {
      STR: 10,
      DEX: 16,
      CON: 12,
      INT: 13,
      WIS: 17,
      CHA: 14
    }
  },
  {
    id: 5,
    name: 'Grimnir',
    race: 'Dwarf',
    gender: 'Female',
    class: 'Mage',
    level: 4,
    xp: 290,
    hp: 26,
    maxHp: 30,
    ac: 13,
    background: 'Guild Artisan',
    alignment: 'Lawful Neutral',
    deity: 'Moradin',
    portrait: '/upload/character-portraits/dwarf_female_mage.png',
    attacks: [
      { name: 'Runic Staff', damage: '1d6+2', bonus: 4 },
      { name: 'Fireball', damage: '3d6', bonus: 6 }
    ],
    talents: ['School of Evocation', 'Arcane Recovery', 'Runic Magic', 'Enchantment'],
    gear: ['Runic Staff', 'Spellbook', 'Magic Amulet', 'Power Runes', 'Mana Potions (2)'],
    stats: {
      STR: 12,
      DEX: 10,
      CON: 14,
      INT: 16,
      WIS: 14,
      CHA: 9
    }
  }
];

// Function to get all characters
export const getAllCharacters = async () => {
  // Network request emulation
  return new Promise<any[]>((resolve) => {
    setTimeout(() => {
      resolve(characters.map(char => ({
        id: char.id,
        name: char.name,
        class: char.class,
        level: char.level,
        race: char.race,
        gender: char.gender,
        image: char.portrait,
        stats: {
          strength: char.stats.STR,
          dexterity: char.stats.DEX,
          constitution: char.stats.CON,
          intelligence: char.stats.INT,
          wisdom: char.stats.WIS,
          charisma: char.stats.CHA
        }
      })));
    }, 300);
  });
};

// Function to get character by ID
export const getCharacterById = async (id: number): Promise<Character | null> => {
  // Network request emulation
  return new Promise<Character | null>((resolve) => {
    setTimeout(() => {
      const character = characters.find(c => c.id === id);
      if (!character) {
        resolve(null);
        return;
      }
      
      // Convert mock data to Character type
      const result: Character = {
        name: character.name,
        race: character.race as CharacterRace,
        gender: character.gender as CharacterGender,
        class: character.class,
        level: character.level,
        xp: character.xp,
        stats: character.stats,
        hp: character.hp,
        maxHp: character.maxHp,
        ac: character.ac,
        background: character.background,
        alignment: character.alignment,
        deity: character.deity,
        attacks: character.attacks,
        talents: character.talents,
        gear: character.gear,
        portrait: character.portrait
      };
      
      resolve(result);
    }, 500);
  });
};

