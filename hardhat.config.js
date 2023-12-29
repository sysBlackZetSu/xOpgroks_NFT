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
      url: "http://127.0.0.1:8545",
      accounts: ['fd6d2d9d0fd9f12f890284749862c8793fc7312078b4ba2758acbf3d8e20f75a'],
      gasPrice: 10000000000,
      blockGasLimit: 1000000
    },
    localhost: {
      url: "http://127.0.0.1:8545", // The default Hardhat Network URL
      accounts: ['0xc526ee95bf44d8fc405a158bb884d9d1238d99f0612e9f33d006bb0789009aaa'],
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