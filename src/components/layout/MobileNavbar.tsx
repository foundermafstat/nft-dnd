'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  HomeIcon, 
  UserCircleIcon, 
  DocumentTextIcon, 
  Cog6ToothIcon 
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

const MobileNavbar = () => {
  const pathname = usePathname();

  // Навигационные ссылки
  const navLinks = [
    {
      name: 'Главная',
      href: '/',
      icon: <HomeIcon className="w-5 h-5" />,
    },
    {
      name: 'Персонаж',
      href: '/character',
      icon: <UserCircleIcon className="w-5 h-5" />,
    },
    {
      name: 'История',
      href: '/history',
      icon: <DocumentTextIcon className="w-5 h-5" />,
    },
    {
      name: 'Настройки',
      href: '/settings',
      icon: <Cog6ToothIcon className="w-5 h-5" />,
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 z-50 w-full h-16 bg-card border-t border-border shadow-lg">
      <div className="grid h-full grid-cols-4">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-col items-center justify-center",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <div className="relative">
                <div className={cn(
                  "p-1.5 rounded-full", 
                  isActive ? "bg-primary/20" : "transparent"
                )}>
                  {link.icon}
                </div>
                {isActive && (
                  <motion.span
                    className="absolute -bottom-1 left-1/2 w-1 h-1 bg-primary rounded-full -translate-x-1/2 neon-border"
                    layoutId="mobile-nav-indicator"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </div>
              <span className={cn(
                "text-xs mt-1",
                isActive ? "font-medium" : ""
              )}>{link.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNavbar;
