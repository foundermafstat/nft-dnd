import { CharacterStats, formatModifier, getModifier } from '@/types/character';
import { cn } from '@/lib/utils';

interface StatBlockProps {
  stats: CharacterStats;
  isEditing: boolean;
  onChange: (stat: keyof CharacterStats, value: number) => void;
}

const StatBlock = ({ stats, isEditing, onChange }: StatBlockProps) => {
  const statNames: Array<{key: keyof CharacterStats; name: string}> = [
    { key: 'STR', name: 'Сила' },
    { key: 'DEX', name: 'Ловкость' },
    { key: 'CON', name: 'Телосложение' },
    { key: 'INT', name: 'Интеллект' },
    { key: 'WIS', name: 'Мудрость' },
    { key: 'CHA', name: 'Харизма' },
  ];

  return (
    <div className="bg-card rounded-lg p-4 border border-border">
      <h3 className="text-primary text-lg font-medium mb-3">Характеристики</h3>
      <div className="grid grid-cols-2 gap-3">
        {statNames.map(({ key, name }) => (
          <div key={key} className="relative bg-secondary/20 rounded-md p-3 border border-border">
            <div className="text-xs text-muted-foreground uppercase">{name}</div>
            <div className="flex items-center justify-between mt-1">
              {isEditing ? (
                <input
                  type="number"
                  value={stats[key]}
                  onChange={(e) => onChange(key, parseInt(e.target.value) || 0)}
                  className="w-12 h-8 text-center bg-muted rounded-sm border border-border text-foreground"
                  min={3}
                  max={20}
                />
              ) : (
                <div className="text-xl font-bold text-foreground">{stats[key]}</div>
              )}
              <div className={cn("text-lg rounded-full w-8 h-8 flex items-center justify-center", 
                getModifier(stats[key]) >= 0 ? 'text-green-400 bg-green-900/30' : 'text-red-400 bg-red-900/30')}>
                {formatModifier(getModifier(stats[key]))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatBlock;