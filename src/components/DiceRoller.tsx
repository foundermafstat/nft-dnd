'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useDiceGame } from '@/hooks/useDiceGame';

const DiceRoller = () => {
  const { rollDiceLocal, isRolling } = useDiceGame();
  const [selectedDice, setSelectedDice] = useState<'d4' | 'd6' | 'd20'>('d20');
  const [reason, setReason] = useState('');
  
  const handleRoll = () => {
    rollDiceLocal(selectedDice, reason);
    setReason('');
  };

  // Стили для каждого типа кубика
  const diceColors = {
    'd4': {
      bg: 'rgba(59, 130, 246, 0.2)',
      border: '#3b82f6',
      text: '#3b82f6',
      hoverBg: 'rgba(59, 130, 246, 0.3)',
    },
    'd6': {
      bg: 'rgba(168, 85, 247, 0.2)',
      border: '#a855f7',
      text: '#a855f7',
      hoverBg: 'rgba(168, 85, 247, 0.3)',
    },
    'd20': {
      bg: 'rgba(57, 255, 20, 0.2)',
      border: '#39ff14',
      text: '#39ff14',
      hoverBg: 'rgba(57, 255, 20, 0.3)',
    },
  };

  return (
    <div style={{
      backgroundColor: '#121212',
      padding: '1.25rem',
      borderRadius: '0.5rem',
      border: '1px solid #232323',
    }}>
      <h3 style={{
        fontSize: '1.25rem',
        fontWeight: 'bold',
        marginBottom: '1rem',
        color: '#f0f0f0'
      }}>Кинуть кубик</h3>
      
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.75rem',
        marginBottom: '1rem'
      }}>
        {(['d4', 'd6', 'd20'] as const).map((dice) => (
          <button
            key={dice}
            onClick={() => setSelectedDice(dice)}
            disabled={isRolling}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              border: `1px solid ${selectedDice === dice ? diceColors[dice].border : '#303030'}`,
              backgroundColor: selectedDice === dice ? diceColors[dice].bg : 'transparent',
              color: selectedDice === dice ? diceColors[dice].text : '#a0a0a0',
              transition: 'all 0.2s',
              cursor: 'pointer'
            }}
          >
            {dice}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          disabled={isRolling}
          placeholder="Причина броска (необязательно)"
          style={{
            width: '100%',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            backgroundColor: '#232323',
            border: '1px solid #303030',
            color: '#f0f0f0',
            outline: 'none'
          }}
        />
      </div>

      <motion.button
        onClick={handleRoll}
        disabled={isRolling}
        whileTap={{ scale: 0.95 }}
        style={{
          width: '100%',
          padding: '0.75rem',
          borderRadius: '0.5rem',
          textAlign: 'center',
          fontWeight: '500',
          backgroundColor: diceColors[selectedDice].bg,
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: diceColors[selectedDice].border,
          color: diceColors[selectedDice].text,
          transition: 'all 0.2s',
          cursor: 'pointer',
          opacity: isRolling ? 0.5 : 1
        }}
      >
        {isRolling ? 'Бросаем...' : `Бросить ${selectedDice}`}
      </motion.button>
    </div>
  );
};

export default DiceRoller;