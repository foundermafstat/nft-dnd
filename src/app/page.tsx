'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { CharacterCard } from '@/components/character/CharacterCard';
import { Button } from '@/components/ui/button';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, ChevronRight, Dices } from 'lucide-react';
import { useWeb3 } from '@/hooks/useWeb3';
import { toast } from 'sonner';

export default function Home() {
  const { isConnected } = useWeb3();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateCharacter = () => {
    if (!isConnected) {
      toast.error('Connect wallet to create a character');
      return;
    }
    
    // Redirect to character creation page
    router.push('/character/create');
  };

  const handlePlayGame = () => {
    if (!isConnected) {
      toast.error('Connect wallet to play');
      return;
    }
    
    toast('Preparing for game...', {
      description: 'Connecting to game server...',
      action: {
        label: 'Cancel',
        onClick: () => toast.dismiss(),
      },
    });
  };

  const characters = [
    { 
      id: 1, 
      name: 'Ralina', 
      class: 'Wizard', 
      level: 5, 
      race: 'Elf',
      gender: 'Female',
      image: '', // Removing fixed image and using path generation logic
      stats: {
        strength: 8,
        dexterity: 14,
        constitution: 12,
        intelligence: 17,
        wisdom: 13,
        charisma: 10
      }
    },
    { 
      id: 2, 
      name: 'Thorn', 
      class: 'Warrior', 
      level: 7, 
      race: 'Human',
      gender: 'Male',
      image: '',
      stats: {
        strength: 16,
        dexterity: 12,
        constitution: 15,
        intelligence: 8,
        wisdom: 10,
        charisma: 14
      }
    },
    {
      id: 3,
      name: 'Grokk',
      class: 'Barbarian',
      level: 6,
      race: 'Half-Orc',
      gender: 'Male',
      image: '',
      stats: {
        strength: 18,
        dexterity: 12,
        constitution: 16,
        intelligence: 7,
        wisdom: 10,
        charisma: 8
      }
    },
    {
      id: 4,
      name: 'Lilia',
      class: 'Druid',
      level: 5,
      race: 'Halfling',
      gender: 'Female',
      image: '',
      stats: {
        strength: 10,
        dexterity: 16,
        constitution: 12,
        intelligence: 13,
        wisdom: 17,
        charisma: 14
      }
    },
  ];

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold neon-text">NFT D&D</h1>
          {isConnected ? (
            <Button onClick={handlePlayGame} className="group bg-primary/20 border-primary neon-border hover:bg-primary/30 text-primary hover:text-primary">
              <Dices className="mr-2 h-4 w-4 group-hover:animate-spin" /> Play now
            </Button>
          ) : null}
        </div>
        
        <p className="text-muted-foreground">
          Manage your D&D characters as NFTs on blockchain
        </p>
      </section>

      <Tabs defaultValue="characters" className="w-full space-y-4">
        <TabsList className="grid grid-cols-2 w-full md:w-[400px] border border-border">
          <TabsTrigger value="characters">Characters</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="characters" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {characters.map(character => (
              <CharacterCard 
                key={character.id}
                id={character.id}
                name={character.name}
                class={character.class}
                level={character.level}
                race={character.race}
                gender={character.gender}
                image={character.image}
                stats={character.stats}
              />
            ))}
            
            <Card className="overflow-hidden border-dashed h-full flex flex-col items-center justify-center p-6 neon-border-hover">
              <Button 
                variant="ghost" 
                className="h-32 w-full flex flex-col gap-2 hover:bg-primary/10 hover:text-primary" 
                onClick={handleCreateCharacter}
              >
                <PlusCircle className="h-10 w-10" />
                <span>Create new character</span>
              </Button>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="history" className="mt-4">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Game History</CardTitle>
                <CardDescription>Recent game sessions and dice rolls</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-muted p-4">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-medium">Session #12 - Forgotten Dungeon</h4>
                      <p className="text-sm text-muted-foreground">September 15, 2025</p>
                    </div>
                    <Badge variant="outline">Completed</Badge>
                  </div>
                </div>
                <div className="rounded-lg bg-muted p-4">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-medium">Session #11 - Battle with Goblins</h4>
                      <p className="text-sm text-muted-foreground">September 10, 2025</p>
                    </div>
                    <Badge variant="outline">Completed</Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/history">
                  <Button variant="outline" size="sm">
                    Full History <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}