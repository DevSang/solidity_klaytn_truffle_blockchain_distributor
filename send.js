const Caver = require('caver-js');
const caver = new Caver('https://api.cypress.klaytn.net:8651/');

const sender = caver.klay.accounts.wallet.add('0xd2c5eaef03005f6378a54174b9f734c9dc174155f541f37ab2937ac15a2fe3a6'); // loon ai 
const receiverAddress = '0xa019f831c4406fe70fd97a57be8131ac7b4f8c94' //receiver
const payer = caver.klay.accounts.wallet.add('0x00da4ef5afffb5c549ef783776b6da2de8c9a75b05866a5e242cb5f800c66905', '0xa386fd4a096f36420e821774d13972d9ea89dd9f'); // klaytn
const LoonGEM = require('./build/contracts/LoonGEM.json')

// an arbitrary contract is used
async function send() {
    // make sure `data` starts with 0x
    const contract = new caver.klay.Contract(LoonGEM.abi, '0x5B30A206Fb33256e92BB43F715F5FeCCb66383eF');
    const pebToken = caver.utils.toPeb(50000000, 'KLAY');
    const data = await contract.methods.transfer(receiverAddress, pebToken).encodeABI();

    const { rawTransaction: senderRawTransaction } = await caver.klay.accounts.signTransaction({
        type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
        from: sender.address,
        to: '0x5B30A206Fb33256e92BB43F715F5FeCCb66383eF',
        data: data,
        gas: '3000000',
        value: 0,
    }, sender.privateKey);

    // signed raw transaction
    console.log("Raw TX:\n", senderRawTransaction);
    
    // send fee delegated transaction with fee payer information
    caver.klay.sendTransaction({
        senderRawTransaction: senderRawTransaction,
        feePayer: payer.address
    })
        .on('transactionHash', function (hash) {
            console.log(">>> tx_hash for deploy =", hash);
        })
        .on('receipt', function (receipt) {
            console.log(">>> receipt arrived: ", receipt);
        })
        .on('error', function (err) {
            console.error(">>> error: ", err);
        });
}

send();