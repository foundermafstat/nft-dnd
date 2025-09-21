'use client';

import { useState } from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

interface TalentsBlockProps {
  talents: string[];
  isEditing: boolean;
  onChange: (talents: string[]) => void;
}

const TalentsBlock = ({ talents, isEditing, onChange }: TalentsBlockProps) => {
  const [newTalent, setNewTalent] = useState('');

  const addTalent = () => {
    if (newTalent.trim()) {
      onChange([...talents, newTalent.trim()]);
      setNewTalent('');
    }
  };

  const removeTalent = (index: number) => {
    const updatedTalents = [...talents];
    updatedTalents.splice(index, 1);
    onChange(updatedTalents);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTalent.trim()) {
      addTalent();
    }
  };

  return (
    <div className="bg-card rounded-lg p-4 border border-border">
      <h3 className="text-primary text-lg font-medium mb-3">Таланты и навыки</h3>

      <div className="flex flex-wrap gap-2">
        {talents.map((talent, index) => (
          <div 
            key={index} 
            className={cn(
              "rounded-full px-3 py-1 text-sm bg-secondary/20 border border-border",
              isEditing && "pr-2"
            )}
          >
            {talent}
            {isEditing && (
              <button
                onClick={() => removeTalent(index)}
                className="ml-2 text-destructive hover:text-destructive/80"
              >
                <TrashIcon className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}

        {isEditing && (
          <div className="flex items-center space-x-2 mt-1">
            <input
              type="text"
              value={newTalent}
              onChange={(e) => setNewTalent(e.target.value)}
              onKeyDown={handleKeyDown}
              className="px-3 py-1 text-sm bg-secondary/20 border border-border rounded-full focus:ring-1 focus:ring-primary"
              placeholder="Новый навык..."
            />
            <button
              onClick={addTalent}
              disabled={!newTalent.trim()}
              className="text-primary hover:text-primary/80 disabled:text-muted-foreground"
            >
              <PlusIcon className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TalentsBlock;