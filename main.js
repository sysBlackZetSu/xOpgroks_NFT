const { Web3 } = require('web3');
const web3 = new Web3('http://127.0.0.1:8545'); // Replace with your Infura provider

/* config wallet */
const walletKeys = [
    {
        privateKey: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
        address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
    },
    {
        privateKey: '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d',
        address: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'
    },
    {
        privateKey: '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a',
        address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC'
    }
]

const contractABI = require('./ABI.json');

/* Connect smart contract */
const contractAddress = '0x883fc80b99fde43fa8588c41bbd78f6214c5e657'; // Contract mint
const contract = new web3.eth.Contract(contractABI, contractAddress);


/* Connect to the wallet */
function connectWallet(wallet) {
    const account = web3.eth.accounts.privateKeyToAccount(wallet.privateKey);
    web3.eth.accounts.wallet.add(account);
    return account;
}

// Minting function
/**
 * 
 * @param {*} categoryId [values: 1, 2, 3]
 * @param {*} valueToSend [price of one NFT]
 * @returns
 */
async function mintMulti() {

    for (let index = 0; index < walletKeys.length; index++) {
        const wallet = walletKeys[index];
        const accountTmp = connectWallet(wallet);
        // Dynamically estimate gas for the transaction
        const gas = await contract.methods.mint('1').estimateGas({ from: accountTmp.address });
        // Set a custom gas price or use the network gas price
        const gasPrice = await web3.eth.getGasPrice();
        try {
            // Call the mint function with dynamic gas parameters
            const result = await contract.methods.mint('1').send({
                from: accountTmp.address,
                value: web3.utils.toWei('0.01'.toString(), 'ether'),
                gas,
                gasPrice,
            });

            console.log('Minting successful. Transaction hash:', result);
        } catch (error) {
            console.error('[callMint] :', error);
        }
    }
}

// Run
mintMulti();



async function getWalletInfo(wallet) {
    try {
        const balance = await web3.eth.getBalance(wallet.address);
        return web3.utils.fromWei(balance, 'ether');
    } catch (error) {
        console.error(`Lỗi khi kiểm tra thông tin của địa chỉ ${wallet.address}:`, error);
    }
}

async function getAllWalletsInfo() {
    for (const wallet of walletKeys) {
        const balance = await getWalletInfo(wallet);
        console.log('address : ', wallet.address);
        console.log('balance: ', balance);
    }
}

getAllWalletsInfo().then();
