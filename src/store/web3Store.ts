import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SBTMetadata } from '@/types/web3';

interface Web3State {
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  hasSBT: boolean;
  sbtMetadata: SBTMetadata | null;
  isLoading: boolean;
  error: string | null;
  setConnected: (isConnected: boolean) => void;
  setAddress: (address: string | null) => void;
  setChainId: (chainId: number | null) => void;
  setHasSBT: (hasSBT: boolean) => void;
  setSbtMetadata: (metadata: SBTMetadata | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  resetState: () => void;
}

export const useWeb3Store = create<Web3State>()(
  persist(
    (set) => ({
      isConnected: false,
      address: null,
      chainId: null,
      hasSBT: false,
      sbtMetadata: null,
      isLoading: false,
      error: null,
      setConnected: (isConnected) => set({ isConnected }),
      setAddress: (address) => set({ address }),
      setChainId: (chainId) => set({ chainId }),
      setHasSBT: (hasSBT) => set({ hasSBT }),
      setSbtMetadata: (metadata) => set({ sbtMetadata: metadata }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      resetState: () =>
        set({
          isConnected: false,
          address: null,
          chainId: null,
          hasSBT: false,
          sbtMetadata: null,
          isLoading: false,
          error: null,
        }),
    }),
    {
      name: 'nft-dnd-web3-storage',
    }
  )
);
