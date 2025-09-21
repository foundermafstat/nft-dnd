'use client';

import { useState } from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

interface GearBlockProps {
  gear: string[];
  isEditing: boolean;
  onChange: (gear: string[]) => void;
}

const GearBlock = ({ gear, isEditing, onChange }: GearBlockProps) => {
  const [newItem, setNewItem] = useState('');

  const addItem = () => {
    if (newItem.trim()) {
      onChange([...gear, newItem.trim()]);
      setNewItem('');
    }
  };

  const removeItem = (index: number) => {
    const updatedGear = [...gear];
    updatedGear.splice(index, 1);
    onChange(updatedGear);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newItem.trim()) {
      addItem();
    }
  };

  return (
    <div className="bg-card rounded-lg p-4 border border-border">
      <h3 className="text-primary text-lg font-medium mb-3">Снаряжение</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {gear.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-secondary/20 rounded-md px-3 py-2 border border-border"
          >
            <span className="text-sm">{item}</span>
            {isEditing && (
              <button
                onClick={() => removeItem(index)}
                className="ml-2 text-destructive hover:text-destructive/80"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}

        {isEditing && (
          <div className="flex items-center bg-secondary/20 border border-dashed border-border rounded-md px-3 py-2">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm"
              placeholder="Добавить предмет..."
            />
            <button
              onClick={addItem}
              disabled={!newItem.trim()}
              className="ml-2 text-primary hover:text-primary/80 disabled:text-muted-foreground"
            >
              <PlusIcon className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GearBlock;