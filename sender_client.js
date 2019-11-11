var net = require('net');
var client = new net.Socket();

const Caver = require('caver-js');
const caver = new Caver('https://api.cypress.klaytn.net:8651');
const senderPrivateKey = "0xd2c5eaef03005f6378a54174b9f734c9dc174155f541f37ab2937ac15a2fe3a6";
const sender = caver.klay.accounts.wallet.add(senderPrivateKey);
const LoonGEM = require('./build/contracts/LoonGEM.json') // compiled output

sendFeeDelegateTx = async() => {
    // sign transaction with private key of sender
    const contract = new caver.klay.Contract(LoonGEM.abi);
    console.log(`contract`)
    // console.log(contract)
//     const data = await caver.klay.abi.encodeContractDeploy(LoonGEM.abi, contract);
    const bytecode = await contract.deploy({data: LoonGEM.bytecode, arguments: ['Loon GEM', 'GEM', 18]}).encodeABI();
    try {
    const { rawTransaction: senderRawTransaction } = await caver.klay.accounts.signTransaction({
        type: 'FEE_DELEGATED_SMART_CONTRACT_DEPLOY',
        from: sender.address,
        gas: '5000000',
        data: bytecode,
        value: 0,
      }, senderPrivateKey);

    // send signed raw transaction to fee payer's server
    client.connect(1337, '127.0.0.1', function() {
            console.log('Connected to fee delegated service');
    });
    client.write(senderRawTransaction);

    client.on('data', function(data) {
            console.log('Received data from server: ' + data);
    });

    client.on('close', function() {
            console.log('Connection closed');
    });
} catch(error) {
    console.log(error)
}
}

sendFeeDelegateTx();