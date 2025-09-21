const hre = require("hardhat");

async function main() {
  console.log("Deploying contracts to", network.name, "network...");

  // Deploy the SoulboundToken contract
  const SoulboundToken = await hre.ethers.getContractFactory("SoulboundToken");
  const soulboundToken = await SoulboundToken.deploy("NFT D&D Character", "DNDSBT");
  await soulboundToken.waitForDeployment();
  const soulboundTokenAddress = await soulboundToken.getAddress();
  console.log(`SoulboundToken deployed to: ${soulboundTokenAddress}`);

  // Deploy the DiceGame contract
  const DiceGame = await hre.ethers.getContractFactory("DiceGame");
  const diceGame = await DiceGame.deploy();
  await diceGame.waitForDeployment();
  const diceGameAddress = await diceGame.getAddress();
  console.log(`DiceGame deployed to: ${diceGameAddress}`);

  console.log("----------------------------------------------------");
  console.log("Deployment completed successfully!");
  console.log("Add these contract addresses to your .env.local file:");
  console.log(`NEXT_PUBLIC_SBT_CONTRACT_ADDRESS=${soulboundTokenAddress}`);
  console.log(`NEXT_PUBLIC_DICE_GAME_CONTRACT_ADDRESS=${diceGameAddress}`);
  console.log("----------------------------------------------------");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
