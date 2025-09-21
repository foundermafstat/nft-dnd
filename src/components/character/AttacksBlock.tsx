'use client';

import { useState } from 'react';
import { CharacterAttack, formatModifier } from '@/types/character';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface AttacksBlockProps {
  attacks: CharacterAttack[];
  isEditing: boolean;
  onChange: (attacks: CharacterAttack[]) => void;
}

const AttacksBlock = ({ attacks, isEditing, onChange }: AttacksBlockProps) => {
  const [newAttack, setNewAttack] = useState<CharacterAttack>({
    name: '',
    damage: '',
    bonus: 0,
  });

  const handleAttackChange = (index: number, field: keyof CharacterAttack, value: string | number) => {
    const updatedAttacks = [...attacks];
    updatedAttacks[index] = {
      ...updatedAttacks[index],
      [field]: field === 'bonus' ? parseInt(value as string) || 0 : value,
    };
    onChange(updatedAttacks);
  };

  const addAttack = () => {
    if (newAttack.name && newAttack.damage) {
      onChange([...attacks, { ...newAttack }]);
      setNewAttack({ name: '', damage: '', bonus: 0 });
    }
  };

  const removeAttack = (index: number) => {
    const updatedAttacks = [...attacks];
    updatedAttacks.splice(index, 1);
    onChange(updatedAttacks);
  };

  return (
    <div className="bg-card rounded-lg p-4 border border-border">
      <h3 className="text-primary text-lg font-medium mb-3">Атаки</h3>

      <div className="grid grid-cols-12 gap-2 mb-2 text-xs text-muted-foreground">
        <div className="col-span-5">Название</div>
        <div className="col-span-4">Урон</div>
        <div className="col-span-3">Бонус</div>
      </div>

      {attacks.map((attack, index) => (
        <div key={index} className="grid grid-cols-12 gap-2 mb-2 items-center">
          {isEditing ? (
            <>
              <div className="col-span-5">
                <input
                  type="text"
                  value={attack.name}
                  onChange={(e) => handleAttackChange(index, 'name', e.target.value)}
                  className="w-full px-2 py-1 bg-muted border border-border text-foreground rounded-sm"
                />
              </div>
              <div className="col-span-4">
                <input
                  type="text"
                  value={attack.damage}
                  onChange={(e) => handleAttackChange(index, 'damage', e.target.value)}
                  className="w-full px-2 py-1 bg-muted border border-border text-foreground rounded-sm"
                  placeholder="1d6"
                />
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  value={attack.bonus}
                  onChange={(e) => handleAttackChange(index, 'bonus', e.target.value)}
                  className="w-full px-2 py-1 bg-muted border border-border text-foreground rounded-sm"
                />
              </div>
              <div className="col-span-1 flex justify-center">
                <button
                  onClick={() => removeAttack(index)}
                  className="text-destructive hover:text-destructive/80"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="col-span-5">{attack.name}</div>
              <div className="col-span-4">{attack.damage}</div>
              <div className="col-span-3">{formatModifier(attack.bonus || 0)}</div>
            </>
          )}
        </div>
      ))}

      {isEditing && (
        <div className="grid grid-cols-12 gap-2 mt-4 items-center">
          <div className="col-span-5">
            <input
              type="text"
              value={newAttack.name}
              onChange={(e) => setNewAttack({ ...newAttack, name: e.target.value })}
              className="w-full px-2 py-1 bg-secondary/20 border border-border text-foreground rounded-sm"
              placeholder="Название"
            />
          </div>
          <div className="col-span-4">
            <input
              type="text"
              value={newAttack.damage}
              onChange={(e) => setNewAttack({ ...newAttack, damage: e.target.value })}
              className="w-full px-2 py-1 bg-secondary/20 border border-border text-foreground rounded-sm"
              placeholder="1d6"
            />
          </div>
          <div className="col-span-2">
            <input
              type="number"
              value={newAttack.bonus}
              onChange={(e) => setNewAttack({ ...newAttack, bonus: parseInt(e.target.value) || 0 })}
              className="w-full px-2 py-1 bg-secondary/20 border border-border text-foreground rounded-sm"
              placeholder="0"
            />
          </div>
          <div className="col-span-1 flex justify-center">
            <button
              onClick={addAttack}
              disabled={!newAttack.name || !newAttack.damage}
              className="text-primary hover:text-primary/80 disabled:text-muted-foreground"
            >
              <PlusIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttacksBlock;