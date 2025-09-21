import { Character, RACES, GENDERS } from '@/types/character';
import { cn } from '@/lib/utils';

interface InfoBlockProps {
  character: Character;
  isEditing: boolean;
  onChange: (field: keyof Character, value: any) => void;
}

const InfoBlock = ({ character, isEditing, onChange }: InfoBlockProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Name and portrait */}
      <div className="col-span-1 flex flex-col">
        <div className="mb-3">
          <label className="block text-xs text-muted-foreground mb-1">Name</label>
          {isEditing ? (
            <input
              type="text"
              value={character.name}
              onChange={(e) => onChange('name', e.target.value)}
              className="w-full px-3 py-2 bg-card border border-border rounded-md focus:ring-1 focus:ring-primary"
            />
          ) : (
            <div className="text-xl font-bold text-primary">{character.name}</div>
          )}
        </div>

        <div className="bg-card rounded-lg p-2 border border-border flex items-center justify-center flex-1 w-full">
          <div className="w-full flex justify-center">
            <img 
              src={`/upload/character-portraits/${character.race.toLowerCase().replace('-', '_')}${character.gender === 'Female' ? '_female' : ''}.png`}
              alt={character.name} 
              className="w-full md:w-auto md:max-w-[1000px] md:max-h-[1000px] object-contain rounded" 
              onError={(e) => {
                console.log('Image not found:', e.currentTarget.src, 'Gender:', character.gender);
                // If image not found, show placeholder
                (e.target as HTMLImageElement).src = '/upload/character-portraits/placeholder.png';
              }}
            />
          </div>
        </div>
      </div>

      {/* Main characteristics in tabular form */}
      <div className="col-span-1 md:col-span-2">
        {isEditing ? (
          // Editable view - keep form for convenient editing
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Race</label>
              <select
                value={character.race}
                onChange={(e) => {
                  const newRace = e.target.value;
                  onChange('race', newRace);
                  
                  // Update portrait when race changes
                  const portraitPath = character.gender === 'Female' 
                    ? `/upload/character-portraits/${newRace.toLowerCase().replace('-', '_')}_female.png` 
                    : `/upload/character-portraits/${newRace.toLowerCase().replace('-', '_')}.png`;
                  
                  console.log('Updating portrait for race change:', portraitPath);
                  onChange('portrait', portraitPath);
                }}
                className="w-full px-3 py-2 bg-card border border-border rounded-md focus:ring-1 focus:ring-primary"
              >
                {RACES.map((race) => (
                  <option key={race} value={race}>
                    {race}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Gender</label>
              <select
                value={character.gender}
                onChange={(e) => {
                  const newGender = e.target.value;
                  onChange('gender', newGender);
                  
                  // Force portrait update when gender changes
                  const race = character.race.toLowerCase().replace('-', '_');
                  const portraitPath = newGender === 'Female' 
                    ? `/upload/character-portraits/${race}_female.png` 
                    : `/upload/character-portraits/${race}.png`;
                  
                  console.log('Updating portrait to:', portraitPath, 'Gender:', newGender);
                  onChange('portrait', portraitPath);
                  
                  // Delay for rendering changes
                  setTimeout(() => {
                    const newCharacter = { ...character, gender: newGender, portrait: portraitPath };
                    onChange('portrait', portraitPath);
                  }, 100);
                }}
                className="w-full px-3 py-2 bg-card border border-border rounded-md focus:ring-1 focus:ring-primary"
              >
                {GENDERS.map((gender) => (
                  <option key={gender} value={gender}>
                    {gender === 'Male' ? 'Male' : 'Female'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-muted-foreground mb-1">Class</label>
              <input
                type="text"
                value={character.class}
                onChange={(e) => onChange('class', e.target.value)}
                className="w-full px-3 py-2 bg-card border border-border rounded-md focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs text-muted-foreground mb-1">Level</label>
              <input
                type="number"
                value={character.level}
                onChange={(e) => onChange('level', parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 bg-card border border-border rounded-md focus:ring-1 focus:ring-primary"
                min={1}
              />
            </div>

            <div>
              <label className="block text-xs text-muted-foreground mb-1">XP</label>
              <input
                type="number"
                value={character.xp}
                onChange={(e) => onChange('xp', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-card border border-border rounded-md focus:ring-1 focus:ring-primary"
                min={0}
              />
            </div>

            <div>
              <label className="block text-xs text-muted-foreground mb-1">HP</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={character.hp}
                  onChange={(e) => onChange('hp', parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 bg-card border border-border rounded-md focus:ring-1 focus:ring-primary"
                  min={0}
                />
                <span className="py-2">/</span>
                <input
                  type="number"
                  value={character.maxHp}
                  onChange={(e) => onChange('maxHp', parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 bg-card border border-border rounded-md focus:ring-1 focus:ring-primary"
                  min={1}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-muted-foreground mb-1">AC</label>
              <input
                type="number"
                value={character.ac}
                onChange={(e) => onChange('ac', parseInt(e.target.value) || 10)}
                className="w-full px-3 py-2 bg-card border border-border rounded-md focus:ring-1 focus:ring-primary"
                min={10}
              />
            </div>

            <div>
              <label className="block text-xs text-muted-foreground mb-1">Alignment</label>
              <input
                type="text"
                value={character.alignment || ''}
                onChange={(e) => onChange('alignment', e.target.value)}
                className="w-full px-3 py-2 bg-card border border-border rounded-md focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs text-muted-foreground mb-1">Background</label>
              <input
                type="text"
                value={character.background || ''}
                onChange={(e) => onChange('background', e.target.value)}
                className="w-full px-3 py-2 bg-card border border-border rounded-md focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs text-muted-foreground mb-1">Deity</label>
              <input
                type="text"
                value={character.deity || ''}
                onChange={(e) => onChange('deity', e.target.value)}
                className="w-full px-3 py-2 bg-card border border-border rounded-md focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        ) : (
          // Table view for display mode
          <div className="bg-card rounded-lg border border-border p-4">
            <table className="w-full text-sm">
              <tbody>
                <tr>
                  <td className="py-1 pr-4 text-xs text-muted-foreground">Race:</td>
                  <td className="py-1 font-medium">{character.race}</td>
                  <td className="py-1 pr-4 text-xs text-muted-foreground">Gender:</td>
                  <td className="py-1 font-medium">{character.gender === 'Male' ? 'Male' : 'Female'}</td>
                </tr>
                <tr>
                  <td className="py-1 pr-4 text-xs text-muted-foreground">Class:</td>
                  <td className="py-1 font-medium">{character.class}</td>
                  <td className="py-1 pr-4 text-xs text-muted-foreground">Level:</td>
                  <td className="py-1 font-medium">{character.level}</td>
                </tr>
                <tr>
                  <td className="py-1 pr-4 text-xs text-muted-foreground">XP:</td>
                  <td className="py-1 font-medium">{character.xp}</td>
                  <td className="py-1 pr-4 text-xs text-muted-foreground">HP:</td>
                  <td className="py-1 font-medium">{character.hp} / {character.maxHp}</td>
                </tr>
                <tr>
                  <td className="py-1 pr-4 text-xs text-muted-foreground">AC:</td>
                  <td className="py-1 font-medium">{character.ac}</td>
                  <td className="py-1 pr-4 text-xs text-muted-foreground">Alignment:</td>
                  <td className="py-1 font-medium">{character.alignment || '-'}</td>
                </tr>
                <tr>
                  <td className="py-1 pr-4 text-xs text-muted-foreground">Background:</td>
                  <td className="py-1 font-medium">{character.background || '-'}</td>
                  <td className="py-1 pr-4 text-xs text-muted-foreground">Deity:</td>
                  <td className="py-1 font-medium">{character.deity || '-'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoBlock;