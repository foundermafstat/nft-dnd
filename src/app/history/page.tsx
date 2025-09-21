'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useWeb3 } from '@/hooks/useWeb3';
import { useCharacterStore } from '@/store/characterStore';
import RollHistory from '@/components/history/RollHistory';
import WalletConnectButton from '@/components/WalletConnectButton';
import { ArrowUturnLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function HistoryPage() {
  const { isConnected } = useWeb3();
  const { character, diceRolls } = useCharacterStore();
  const [isLoading, setIsLoading] = useState(true);

  // Имитируем загрузку данных
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (!isConnected) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh'
      }}>
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#f0f0f0',
          marginBottom: '1.5rem'
        }}>
          Подключите кошелёк для доступа к истории бросков
        </h1>
        <WalletConnectButton />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh'
      }}>
        <div style={{
          width: '4rem',
          height: '4rem',
          borderWidth: '4px',
          borderStyle: 'solid',
          borderColor: 'rgba(57, 255, 20, 0.3)',
          borderTopColor: '#39ff14',
          borderRadius: '9999px',
          animation: 'spin 1s linear infinite',
          marginBottom: '1rem'
        }} className="spin"></div>
        <p style={{ color: '#a0a0a0' }}>Загрузка истории...</p>
      </div>
    );
  }

  if (!character) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh'
      }}>
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#f0f0f0',
          marginBottom: '1rem'
        }}>
          Персонаж не найден
        </h1>
        <p style={{
          color: '#a0a0a0',
          marginBottom: '1.5rem'
        }}>
          Сначала создайте персонажа для доступа к истории бросков
        </p>
        <Link
          href="/character"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            backgroundColor: 'rgba(57, 255, 20, 0.2)',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: '#39ff14',
            color: '#39ff14',
            transition: 'all 0.2s'
          }}
          className="neon-border"
        >
          <ArrowUturnLeftIcon style={{ width: '1.25rem', height: '1.25rem' }} />
          Создать персонажа
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#f0f0f0',
        marginBottom: '1.5rem'
      }} className="neon-glow">
        История приключений
      </h1>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <RollHistory />
      </motion.div>

      {diceRolls.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            marginTop: '2rem',
            padding: '1.5rem',
            backgroundColor: '#121212',
            borderRadius: '0.5rem',
            border: '1px solid #232323',
            textAlign: 'center'
          }}
          className="card"
        >
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: 'bold',
            color: '#f0f0f0',
            marginBottom: '0.75rem'
          }}>
            История пуста
          </h3>
          <p style={{
            color: '#a0a0a0',
            marginBottom: '1.5rem'
          }}>
            Бросайте кубики во время игры, и здесь будет отображаться история всех ваших бросков
          </p>
          <Link
            href="/character"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              backgroundColor: 'rgba(57, 255, 20, 0.2)',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: '#39ff14',
              color: '#39ff14',
              transition: 'all 0.2s'
            }}
            className="neon-border"
          >
            <ArrowUturnLeftIcon style={{ width: '1.25rem', height: '1.25rem' }} />
            Вернуться к персонажу
          </Link>
        </motion.div>
      )}
    </div>
  );
}