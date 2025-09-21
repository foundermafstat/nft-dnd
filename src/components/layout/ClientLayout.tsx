'use client';

import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig } from '@/lib/wagmiConfig';
import { useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
import Header from '@/components/layout/Header';
import MobileNavbar from '@/components/layout/MobileNavbar';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  // Создаем экземпляр QueryClient для React Query
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
      },
    },
  }));
  
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <Header />
        <main className="min-h-screen pt-16 pb-16 md:pb-0 bg-background">
          <div className="container max-w-7xl mx-auto px-4 py-6 w-full">
            {children}
          </div>
        </main>
        <MobileNavbar />
        <Toaster position="bottom-left" />
      </WagmiProvider>
    </QueryClientProvider>
  );
}