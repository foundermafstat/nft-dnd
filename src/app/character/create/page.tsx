'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useWeb3 } from '@/hooks/useWeb3';
import { useSoulboundToken } from '@/hooks/useSoulboundToken';
import { useCharacterStore } from '@/store/characterStore';
import CreateCharacterCard from '@/components/CreateCharacterCard';
import WalletConnectButton from '@/components/WalletConnectButton';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function CreateCharacterPage() {
  const { isConnected } = useWeb3();
  const router = useRouter();
  const { character } = useCharacterStore();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleGoBack = () => {
    router.back();
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-bold mb-6">
          Connect wallet to create a character
        </h1>
        <WalletConnectButton />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center">
        <Button variant="outline" size="sm" onClick={handleGoBack} className="mr-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <h1 className="text-2xl font-bold">Character Creation</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-1 md:col-span-2"
        >
          <CreateCharacterCard />
        </motion.div>
      </div>
    </div>
  );
}

