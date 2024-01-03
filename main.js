const { Web3 } = require('web3');
const web3 = new Web3('https://bsc-dataseed3.bnbchain.org');

const walletKeys = [
    {
        privateKey: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
        address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
    },
    {
        privateKey: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
        address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
    },
    {
        privateKey: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
        address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
    }
];

const contractABI = require('./ABI.json');
const contractAddress = '0x6ea7faaf6a45dada4420f7b1d30f68a5699ba090';
const contract = new web3.eth.Contract(contractABI, contractAddress);

async function mintMulti() {
    for (let index = 0; index < walletKeys.length; index++) {
        const wallet = walletKeys[index];
        const account = web3.eth.accounts.privateKeyToAccount(wallet.privateKey);
        // Truyền giá trị cho các tham số
        const quantity = 1;
        const rareParam = 123; // ????
        const name = "TokenName"; // ????
        const userAddress = walletKeys[address];
        try {
            const gasPrice = await web3.eth.getGasPrice();
            const gasLimit = 300000; // Set an appropriate gas limit for your contract

            const transactionData = contract.methods.mintNFTBatch(quantity, rareParam, name, userAddress).encodeABI();

            const transactionObject = {
                from: account.address,
                to: contractAddress,
                gasPrice: gasPrice,
                gas: gasLimit,
                data: transactionData
            };

            const signedTransaction = await web3.eth.accounts.signTransaction(transactionObject, wallet.privateKey);
            const result = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);

            console.log('Minting successful. Transaction hash:', result.transactionHash);
        } catch (error) {
            console.error('[callMint] :', error);
        }
    }
}

mintMulti().then();
