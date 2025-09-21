'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import WalletConnectButton from '@/components/WalletConnectButton';
import { useWeb3 } from '@/hooks/useWeb3';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';

const MainNav = () => {
  const { isConnected, address, disconnect } = useWeb3();

  // Пункты основного меню
  const menuItems = [
    { title: 'Главная', href: '/' },
    { title: 'Персонажи', href: '/character' },
    { title: 'История игр', href: '/history' },
    { title: 'Информация', href: '/info' },
  ];

  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        {menuItems.map((item) => (
          <NavigationMenuItem key={item.href}>
            <NavigationMenuLink 
              href={item.href}
              className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
            >
              {item.title}
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

const MobileNav = () => {
  // Пункты мобильного меню
  const menuItems = [
    { title: 'Главная', href: '/' },
    { title: 'Персонажи', href: '/character' },
    { title: 'История игр', href: '/history' },
    { title: 'Информация', href: '/info' },
    { title: 'Настройки', href: '/settings' },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Открыть меню</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <div className="py-4">
          <div className="mb-8">
            <SheetTitle>NFT D&D</SheetTitle>
          </div>
          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-2 py-1 hover:bg-secondary rounded-md transition-colors"
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const UserMenu = () => {
  const { isConnected, address, disconnect } = useWeb3();

  if (!isConnected) {
    return <WalletConnectButton />;
  }

  const addressDisplay = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/upload/character-portraits/ralina.png" alt="Avatar" className="object-cover rounded-full max-w-10 max-h-10 overflow-hidden" />
            <AvatarFallback>NFT</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel>Мой аккаунт</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex-col items-start">
          <p className="text-sm font-medium">Кошелек</p>
          <p className="text-xs text-muted-foreground">{addressDisplay}</p>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href="/profile" className="w-full">Профиль</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/settings" className="w-full">Настройки</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => disconnect()}>Отключить кошелек</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-card shadow-sm">
      <div className="container max-w-7xl flex items-center justify-between h-16 mx-auto px-4">
        <div className="flex items-center gap-4">
          <MobileNav />
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl hidden sm:inline-block">NFT D&D</span>
          </Link>
          <MainNav />
        </div>
        <div className="flex items-center gap-2">
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
