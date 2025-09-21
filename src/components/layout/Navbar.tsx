'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Cog6ToothIcon, UserCircleIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import WalletConnectButton from '../WalletConnectButton';

const Navbar = () => {
  const pathname = usePathname();

  // Навигационные ссылки
  const navLinks = [
    {
      name: 'Dashboard',
      href: '/',
      icon: <Cog6ToothIcon className="w-5 h-5" />,
    },
    {
      name: 'Character',
      href: '/character',
      icon: <UserCircleIcon className="w-5 h-5" />,
    },
    {
      name: 'History',
      href: '/history',
      icon: <DocumentTextIcon className="w-5 h-5" />,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-card border-t border-border md:top-0 md:bottom-auto md:border-t-0 md:border-b z-50">
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          {/* Логотип (только для десктопа) */}
          <div className="hidden md:block">
            <Link href="/" className="flex items-center">
              <span className="text-primary text-xl font-bold animate-pulse">
                NFT D&D
              </span>
            </Link>
          </div>

          {/* Навигационные ссылки */}
          <div className="flex justify-center space-x-1 md:space-x-4 w-full md:w-auto">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3 py-2 rounded-md transition-colors flex flex-col items-center md:flex-row md:space-x-1 ${
                    isActive
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-primary/80'
                  }`}
                >
                  <span className="md:hidden">{link.icon}</span>
                  <span className="text-xs md:text-sm">{link.name}</span>
                  
                  {isActive && (
                    <motion.div
                      className="absolute bottom-0 left-0 h-0.5 bg-primary md:w-full"
                      layoutId="navbar-indicator"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      style={{ width: '100%' }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Кнопка подключения кошелька (только для десктопа) */}
          <div className="hidden md:block">
            <WalletConnectButton />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
