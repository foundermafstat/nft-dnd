'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Shield, 
  Swords, 
  Brain, 
  HeartPulse,
  User2,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

type CharacterProps = {
  id: number;
  name: string;
  class: string;
  level: number;
  race: string;
  gender?: string; // Добавляем поле пола
  image?: string;
  stats?: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  isLoading?: boolean;
};

const StatIndicator = ({ value, icon, label }: { value: number, icon: React.ReactNode, label: string }) => {
  // Определяем цвет индикатора в зависимости от значения
  const getColorClass = (val: number) => {
    if (val >= 16) return "text-green-500";
    if (val >= 12) return "text-blue-500";
    if (val >= 10) return "text-gray-300";
    if (val >= 8) return "text-yellow-500";
    return "text-red-500";
  };
  
  return (
    <HoverCard openDelay={300} closeDelay={100}>
      <HoverCardTrigger asChild>
        <div className={cn("flex items-center gap-1", getColorClass(value))}>
          {icon}
          <span>{value}</span>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-auto p-2">
        <p className="text-sm">{label}: {value}</p>
        <p className="text-xs text-muted-foreground">Модификатор: {Math.floor((value - 10) / 2)}</p>
      </HoverCardContent>
    </HoverCard>
  );
};

export function CharacterCard({ 
  id, 
  name, 
  class: characterClass, 
  level, 
  race, 
  gender = 'Male',
  image, 
  stats,
  isLoading = false
}: CharacterProps) {

  if (isLoading) {
    return (
      <Card className="overflow-hidden h-full">
        <div className="aspect-[4/3] relative">
          <Skeleton className="h-full w-full" />
        </div>
        <CardHeader>
          <Skeleton className="h-6 w-2/3 mb-2" />
          <Skeleton className="h-4 w-full" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-9 w-full" />
        </CardFooter>
      </Card>
    );
  }

  return (
    <Link href={`/character?id=${id}`} className="block h-full">
      <Card className="overflow-hidden h-full transition-all hover:shadow-lg hover:border-primary cursor-pointer neon-border-hover">
        <div className="aspect-[4/3] relative bg-muted w-full">
          {/* Используем существующее изображение или генерируем путь на основе расы и пола */}
          <Image 
            src={
              image || 
              `/upload/character-portraits/${race.toLowerCase().replace(' ', '_').replace('-', '_')}${gender === 'Female' ? '_female' : ''}.png`
            }
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
            alt={name}
            className="object-cover w-full h-full"
            onError={(e) => {
              // Если изображение не найдено, показываем заглушку
              // @ts-ignore - игнорируем ошибку типа для currentTarget.src
              e.currentTarget.src = '/upload/character-portraits/placeholder.png';
              console.log('Image not found:', e.currentTarget.src);
            }}
          />
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="opacity-90">
              {level} уровень
            </Badge>
          </div>
        </div>
        <CardHeader className="p-4">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl neon-text">{name}</CardTitle>
          </div>
          <CardDescription className="text-sm">
            {race} • {characterClass}
          </CardDescription>
        </CardHeader>
        
        {stats && (
          <CardContent className="p-4 pt-0">
            <div className="grid grid-cols-4 gap-2">
              <StatIndicator 
                value={stats.strength} 
                icon={<Swords className="h-4 w-4" />} 
                label="Сила"
              />
              <StatIndicator 
                value={stats.dexterity} 
                icon={<Shield className="h-4 w-4" />} 
                label="Ловкость"
              />
              <StatIndicator 
                value={stats.constitution} 
                icon={<HeartPulse className="h-4 w-4" />} 
                label="Телосложение"
              />
              <StatIndicator 
                value={stats.intelligence} 
                icon={<Brain className="h-4 w-4" />} 
                label="Интеллект"
              />
            </div>
          </CardContent>
        )}
        
        <CardFooter className="p-4 pt-0">
          <Button variant="outline" size="sm" className="w-full hover:bg-primary/20 hover:text-primary">
            Подробнее <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
