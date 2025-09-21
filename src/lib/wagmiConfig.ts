import { createConfig, http } from 'wagmi';
import { mainnet, sepolia, goerli } from 'wagmi/chains';
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors';

// Проверяем наличие ключей 
const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';

// Создаем конфигурацию wagmi
export const wagmiConfig = createConfig({
  chains: [mainnet, sepolia, goerli],
  connectors: [
    injected(),
    walletConnect({ projectId: walletConnectProjectId }),
    coinbaseWallet({ appName: 'NFT D&D Character Sheet' }),
  ],
  transports: {
    [mainnet.id]: http(
      alchemyApiKey 
        ? `https://eth-mainnet.g.alchemy.com/v2/${alchemyApiKey}`
        : undefined
    ),
    [sepolia.id]: http(
      alchemyApiKey 
        ? `https://eth-sepolia.g.alchemy.com/v2/${alchemyApiKey}`
        : undefined
    ),
    [goerli.id]: http(
      alchemyApiKey 
        ? `https://eth-goerli.g.alchemy.com/v2/${alchemyApiKey}`
        : undefined
    ),
  },
  ssr: true,
});

// Адреса контрактов
export const contractAddresses = {
  soulboundToken: process.env.NEXT_PUBLIC_SBT_CONTRACT_ADDRESS || '',
  diceGame: process.env.NEXT_PUBLIC_DICE_GAME_CONTRACT_ADDRESS || '',
};