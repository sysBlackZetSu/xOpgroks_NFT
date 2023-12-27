const Web3 = require('web3');
const web3 = new Web3('your_web3_provider'); // Replace with your Infura provider
const privateKey = 'your_private_key';
let lastCheckedBlock = 0;

const contractABI = require('./ABI.json');

/* Connect to the contract for minting tokens */
const contractAddress = '0x883fc80b99fde43fa8588c41bbd78f6214c5e657'; // Token: OPGROKS
const contract = new web3.eth.Contract(contractABI, contractAddress);

/* Connect to the wallet */
const account = web3.eth.accounts.privateKeyToAccount(privateKey);
web3.eth.accounts.wallet.add(account);

/**
 * Check if the specified category is out of stock
 * @param {*} categoryId 
 * @returns 
 */
async function isOutOfStock(categoryId) {
    try {
        const result = await contract.methods.isOutOfStock(categoryId).call();
        return result;
    } catch (error) {
        console.error('[isOutOfStock] ', error);
        return false;
    }
}

// Minting function
/**
 * 
 * @param {*} categoryId [values: 1, 2, 3]
 * @param {*} valueToSend [price of one NFT]
 * @returns
 */
async function callMint(categoryId, valueToSend) {
    const accounts = await web3.eth.getAccounts();
    const senderAddress = accounts[0];

    try {
        const outOfStock = await isOutOfStock(categoryId);
        if (outOfStock) {
            console.log('[callMint]: Category is out of stock.');
            return;
        }

        // Dynamically estimate gas for the transaction
        const gas = await contract.methods.mint(categoryId).estimateGas({ from: senderAddress });

        // Set a custom gas price or use the network gas price
        const gasPrice = await web3.eth.getGasPrice();

        // Call the mint function with dynamic gas parameters
        const result = await contract.methods.mint(categoryId).send({
            from: senderAddress,
            value: web3.utils.toWei(valueToSend.toString(), 'ether'),
            gas,
            gasPrice,
        });

        console.log('Minting successful. Transaction hash:', result.transactionHash);
    } catch (error) {
        console.error('[callMint] :', error);
    }
}

/**
 * Check mint
 */
async function checkForSuccessfulMinting() {
    try {
        const currentBlock = await web3.eth.getBlockNumber();

        if (currentBlock > lastCheckedBlock) {
            console.log(`[checkForSuccessfulMinting] New blocks detected from block ${lastCheckedBlock + 1} to ${currentBlock}`);
            const block = await web3.eth.getBlock(currentBlock, true);

            if (block && block.transactions && block.transactions.length > 0) {
                for (const tx of block.transactions) {
                    const receipt = await web3.eth.getTransactionReceipt(tx.hash);

                    if (receipt && receipt.status) {
                        await callMint('1', '0.5');
                    }
                }
            }
            lastCheckedBlock = currentBlock;
        }
    } catch (error) {
        console.error('[checkForSuccessfulMinting] Error:', error);
    }
}

// Run
setInterval(checkForSuccessfulMinting, 10000); /* Run every 10 seconds */