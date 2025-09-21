'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCharacterStore } from '@/store/characterStore';
import { FunnelIcon, TrashIcon } from '@heroicons/react/24/outline';
import { DiceRoll } from '@/types/web3';

const RollHistory = () => {
  const { diceRolls, clearDiceRolls } = useCharacterStore();
  const [filter, setFilter] = useState<'all' | 'd4' | 'd6' | 'd20'>('all');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // Фильтруем броски кубиков
  const filteredRolls = filter === 'all'
    ? diceRolls
    : diceRolls.filter(roll => roll.diceType === filter);

  // Цвета для разных типов кубиков
  const getDiceColor = (diceType: 'd4' | 'd6' | 'd20') => {
    switch (diceType) {
      case 'd4': return '#3b82f6'; // blue
      case 'd6': return '#a855f7'; // purple
      case 'd20': return '#39ff14'; // neon green
    }
  };

  // Форматирование даты
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  const RollItem = ({ roll }: { roll: DiceRoll }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      style={{
        backgroundColor: '#121212',
        borderRadius: '0.5rem',
        padding: '0.75rem',
        border: '1px solid #232323',
        marginBottom: '0.75rem'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: '#f0f0f0', fontWeight: '500' }}>{roll.characterName}</span>
            <span style={{ color: '#a0a0a0', fontSize: '0.75rem' }}>
              бросает {' '}
              <span style={{ color: getDiceColor(roll.diceType) }}>{roll.diceType}</span>
            </span>
          </div>
          
          <div style={{ marginTop: '0.25rem' }}>
            <span style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#f0f0f0' }}>
              Результат: {' '}
              <span style={{ 
                color: roll.result > (parseInt(roll.diceType.substring(1)) / 2) ? '#22c55e' : '#ef4444'
              }}>
                {roll.result}
              </span>
            </span>
          </div>
          
          {roll.reason && (
            <div style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: '#a0a0a0' }}>
              "{roll.reason}"
            </div>
          )}
        </div>
        
        <div style={{ fontSize: '0.75rem', color: '#a0a0a0' }}>
          {formatTimestamp(roll.timestamp)}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div style={{
      backgroundColor: '#232323',
      borderRadius: '0.5rem',
      padding: '1rem',
      border: '1px solid #303030'
    }} className="card">
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <h3 style={{ 
          color: '#39ff14', 
          fontSize: '1.125rem',
          fontWeight: '500'
        }} className="neon-green">История бросков</h3>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              style={{
                padding: '0.5rem',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                backgroundColor: 'transparent'
              }}
              onMouseOver={(e) => (e.target as HTMLElement).style.backgroundColor = '#303030'}
              onMouseOut={(e) => (e.target as HTMLElement).style.backgroundColor = 'transparent'}
            >
              <FunnelIcon style={{ width: '1.25rem', height: '1.25rem', color: '#a0a0a0' }} />
            </button>
            
            {showFilterMenu && (
              <div style={{
                position: 'absolute',
                right: 0,
                marginTop: '0.5rem',
                padding: '0.5rem 0',
                width: '8rem',
                backgroundColor: '#121212',
                borderRadius: '0.375rem',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                zIndex: 10,
                border: '1px solid #303030'
              }}>
                <button
                  onClick={() => { setFilter('all'); setShowFilterMenu(false); }}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.25rem 1rem',
                    fontSize: '0.875rem',
                    color: filter === 'all' ? '#39ff14' : '#f0f0f0',
                    backgroundColor: 'transparent',
                    cursor: 'pointer'
                  }}
                >
                  Все кубики
                </button>
                <button
                  onClick={() => { setFilter('d4'); setShowFilterMenu(false); }}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.25rem 1rem',
                    fontSize: '0.875rem',
                    color: filter === 'd4' ? '#3b82f6' : '#f0f0f0',
                    backgroundColor: 'transparent',
                    cursor: 'pointer'
                  }}
                >
                  D4
                </button>
                <button
                  onClick={() => { setFilter('d6'); setShowFilterMenu(false); }}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.25rem 1rem',
                    fontSize: '0.875rem',
                    color: filter === 'd6' ? '#a855f7' : '#f0f0f0',
                    backgroundColor: 'transparent',
                    cursor: 'pointer'
                  }}
                >
                  D6
                </button>
                <button
                  onClick={() => { setFilter('d20'); setShowFilterMenu(false); }}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.25rem 1rem',
                    fontSize: '0.875rem',
                    color: filter === 'd20' ? '#39ff14' : '#f0f0f0',
                    backgroundColor: 'transparent',
                    cursor: 'pointer'
                  }}
                >
                  D20
                </button>
              </div>
            )}
          </div>
          
          <button
            onClick={clearDiceRolls}
            style={{
              padding: '0.5rem',
              borderRadius: '0.375rem',
              color: '#ef4444',
              cursor: 'pointer',
              backgroundColor: 'transparent'
            }}
            onMouseOver={(e) => (e.target as HTMLElement).style.backgroundColor = '#303030'}
            onMouseOut={(e) => (e.target as HTMLElement).style.backgroundColor = 'transparent'}
            title="Очистить историю"
          >
            <TrashIcon style={{ width: '1.25rem', height: '1.25rem' }} />
          </button>
        </div>
      </div>

      <div style={{ marginTop: '0.75rem' }}>
        {filteredRolls.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '1.5rem 0',
            color: '#a0a0a0'
          }}>
            История бросков пуста
          </div>
        ) : (
          <AnimatePresence>
            {filteredRolls.map((roll) => (
              <RollItem key={roll.id} roll={roll} />
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default RollHistory;