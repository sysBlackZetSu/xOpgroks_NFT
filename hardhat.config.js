require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.6"
      }
    ]
  },
  defaultNetwork: "bsctest",
  networks: {
    bsctest: {
      url: "https://data-seed-prebsc-2-s1.binance.org:8545",
      accounts: ['your private key of wallet'],
      gasPrice: 10000000000,
      blockGasLimit: 1000000
    },
  },

  etherscan: {
    apiKey: 'KTZ76YFHR7AZSF6C9B3T6435ED5SF4AM3S'
  },

  sourcify: {
    enabled: false,
  }
}