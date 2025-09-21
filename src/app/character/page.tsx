'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getAllCharacters } from '@/services/characterService';
import { motion } from 'framer-motion';
import { useWeb3 } from '@/hooks/useWeb3';
import WalletConnectButton from '@/components/WalletConnectButton';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronRight, Plus, User2 } from 'lucide-react';

export default function CharacterPage() {
  const { isConnected } = useWeb3();
  const router = useRouter();
  const [characters, setCharacters] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCharacters = async () => {
      if (!isConnected) return;
      
      try {
        setIsLoading(true);
        const data = await getAllCharacters();
        setCharacters(data);
      } catch (error) {
        console.error('Error fetching characters:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCharacters();
  }, [isConnected]);

  const handleCreateCharacter = () => {
    // Here will be a transition to the character creation page
    router.push('/character/create');
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-bold mb-6">
          Connect wallet to access characters
        </h1>
        <WalletConnectButton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Characters</h1>
        <Button variant="outline" onClick={handleCreateCharacter} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Create character
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-[4/3] relative">
                <Skeleton className="h-full w-full" />
              </div>
              <CardHeader>
                <Skeleton className="h-6 w-2/3 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {characters.map((character) => (
            <motion.div
              key={character.id}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Link href={`/character/${character.id}`} className="block h-full">
                <Card className="overflow-hidden h-full hover:shadow-md hover:border-primary transition-all cursor-pointer">
                  <div className="aspect-[4/3] relative bg-card">
                    {character.image ? (
                      <Image 
                        src={character.image}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority
                        alt={character.name}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <User2 className="h-12 w-12" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="opacity-90">
                        {character.level} level
                      </Badge>
                    </div>
                  </div>
                  
                  <CardHeader className="py-3">
                    <CardTitle className="text-xl">{character.name}</CardTitle>
                    <CardDescription>
                      {character.race} • {character.class}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardFooter className="py-3 border-t border-border">
                    <Button variant="ghost" size="sm" className="w-full">
                      Details <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}