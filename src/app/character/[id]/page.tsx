'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Character } from '@/types/character';
import { getCharacterById } from '@/services/characterService';
import CharacterSheet from '@/components/character/CharacterSheet';
import DiceRoller from '@/components/DiceRoller';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function CharacterDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [character, setCharacter] = useState<Character | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCharacter = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const id = parseInt(params.id as string);
        if (isNaN(id)) {
          throw new Error('Invalid character identifier');
        }

        const data = await getCharacterById(id);
        if (!data) {
          throw new Error('Character not found');
        }
        
        setCharacter(data);
      } catch (err) {
        console.error('Error fetching character:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while loading character');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCharacter();
  }, [params.id]);

  const handleGoBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
        <p className="text-muted-foreground">Loading character...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-red-500 mb-4 text-2xl">⚠️</div>
        <h2 className="text-xl font-bold mb-4">Error</h2>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button onClick={handleGoBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Go back
        </Button>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-xl font-bold mb-4">Character not found</h2>
        <p className="text-muted-foreground mb-6">The requested character does not exist or has been deleted</p>
        <Button onClick={handleGoBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Go back
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center">
        <Button variant="outline" size="sm" onClick={handleGoBack} className="mr-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <h1 className="text-2xl font-bold">{character.name}</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="col-span-1 md:col-span-2"
        >
          {/* Using the same CharacterSheet component, 
              but passing character as a parameter instead of using the store */}
          <CharacterSheet externalCharacter={character} isStatic />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="col-span-1"
        >
          <DiceRoller characterName={character.name} />
        </motion.div>
      </div>
    </div>
  );
}

