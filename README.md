# NFT D&D Character Sheet

A Next.js web application for synchronizing D&D character attributes with blockchain through Soulbound tokens (SBT).

## Features

- Authentication via MetaMask/WalletConnect
- D&D character creation and editing
- Blockchain synchronization through SBT tokens
- Virtual dice rolling (d4, d6, d20)
- Roll history and actions
- Dark theme with neon accents

## Technologies

- Next.js 15 with App Router and TypeScript
- Tailwind CSS 4
- Ethers.js v6
- wagmi + viem for Web3 integration
- Zustand for state management
- Framer Motion for animations

## Smart Contracts

The project uses two main contracts:

1. **SoulboundToken** — non-transferable token with character attributes stored as metadata
2. **DiceGame** — random number generation and history storage for dice rolls

## Installation and Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/nft-dnd.git
cd nft-dnd
```

2. Install dependencies:

```bash
npm install
```

3. Copy the environment variables file and fill it out:

```bash
cp example.env .env.local
```

4. Launch the project in development mode:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
  ├── app/               # Next.js App Router
  │    ├── character/    # Character page
  │    ├── history/      # Action history
  │    └── page.tsx      # Main page
  ├── components/        # React components
  │    ├── character/    # Character components
  │    ├── history/      # History components
  │    └── layout/       # Layout components
  ├── contracts/         # Smart contracts and their ABIs
  ├── hooks/             # Custom hooks
  ├── lib/               # Helper functions
  ├── store/             # Zustand stores
  ├── types/             # TypeScript types
  └── utils/             # Utilities
```

## API Keys and Configuration

To use this application, you need to obtain API keys and configure the Kaia Testnet:

### 1. Alchemy API Key

1. Go to [Alchemy](https://www.alchemy.com/) and sign up or log in
2. After logging in, click "Create App" on the dashboard
3. Fill in the form:
   - Name: "NFT DND App" (or any other name)
   - Description: Brief description of your application
   - Chain: Select "Ethereum"
   - Network: Select "Kaia Testnet" (if Kaia isn't explicitly listed, select "Custom")
   - Team: Choose your team or create a new one
4. Click "Create App"
5. On the created app's page, click "View Key" and copy the API Key
6. Paste the obtained key into `.env.local` in the `NEXT_PUBLIC_ALCHEMY_API_KEY` field

### 2. WalletConnect Project ID

1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Register or log in
3. Click "Create a new Project"
4. Enter a project name, such as "NFT DND App"
5. Select Kaia Testnet (if available) or another suitable network
6. After creating the project, copy the Project ID
7. Paste the obtained ID into `.env.local` in the `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` field

### 3. Kaia Testnet Configuration in MetaMask

1. Open MetaMask and click on the network name (usually "Ethereum Mainnet")
2. Select "Add Network" > "Add a network manually"
3. Fill in the data:
   - Network Name: Kaia Testnet
   - New RPC URL: https://rpc-testnet.kaiachain.io
   - Chain ID: 999
   - Currency Symbol: KAIA
   - Block Explorer URL: https://explorer-testnet.kaiachain.io
4. Click "Save"

## Smart Contract Deployment

For deploying contracts to the Kaia Testnet, use Hardhat:

```bash
# Note: This instruction assumes Hardhat is already configured
npx hardhat compile
npx hardhat run scripts/deploy.js --network kaia
```

After deployment, update the contract addresses in the `.env.local` file:
```
NEXT_PUBLIC_SBT_CONTRACT_ADDRESS=0x... (your deployed address)
NEXT_PUBLIC_DICE_GAME_CONTRACT_ADDRESS=0x... (your deployed address)
```

You'll need to modify the Hardhat configuration to work with Kaia Testnet by adding this to your `hardhat.config.js`:

```javascript
module.exports = {
  networks: {
    kaia: {
      url: "https://rpc-testnet.kaiachain.io",
      chainId: 999,
      accounts: [process.env.PRIVATE_KEY]
    },
    // other networks...
  },
  // other configs...
};
```

## License

MIT