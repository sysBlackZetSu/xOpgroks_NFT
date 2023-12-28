const { ethers } = require("hardhat");

async function main() {
  try {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance :", deployer);

    const NFT = await ethers.getContractFactory("BabyHood");

    // Provide values for constructor arguments
    // const name = "BabyHood";
    // const symbol = "BHD";
    // const adminAddress = "0xacFDE89969a32aA3af8A80734b6C28AF95E402f2"; // address owner
    // const mintFee = ethers.parseEther("0.05"); // price usdt =  mintFee * current ETH price
    // const nft = await NFT.deploy(name, symbol, adminAddress, mintFee);


    const nft = await NFT.deploy();
    console.log("NFT deployed to:", nft.target);
  } catch (error) {
    console.log(error);
  }
}

main().then(() => process.exit(0)).catch(error => {
  console.error(error);
  process.exit(1);
});