const Caver = require("caver-js");
// const caver = new Caver("https://api.baobab.klaytn.net:8651") // for cypress, use "https://api.cypress.klaytn.net:8651"
const caver = new Caver("https://api.cypress.klaytn.net:8651") // for cypress, use "https://api.cypress.klaytn.net:8651"
caver.klay.getNodeInfo().then(console.log)
// const walletInstance = caver.klay.accounts.privateKeyToAccount(
//   '0x3de0c9...' // enter your private key to deploy contract with
// );
// caver.klay.accounts.wallet.add(walletInstance);
const feePayerPKey = '0x00da4ef5afffb5c549ef783776b6da2de8c9a75b05866a5e242cb5f800c66905';
const feePayer = caver.klay.accounts.wallet.add(feePayerPKey); 
const LoonGEM = require('./build/contracts/LoonGEM.json') // compiled output

var net = require('net');

feePayerSign = (senderRawTransaction, socket) => {
    // fee payer
    caver.klay.sendTransaction({
        type: 'FEE_DELEGATED_SMART_CONTRACT_DEPLOY',
        senderRawTransaction,
        feePayer: feePayer.address,
    })
    .on('transactionHash', function(hash){
        console.log('transactionHash', hash);
    })
    .on('receipt', function(receipt){
        console.log('receipt', receipt);
        socket.write('Tx hash is '+ receipt.transactionHash);
        socket.write('Sender Tx hash is '+ receipt.senderTxHash);
    })
    .on('error', console.error); // If an out-of-gas error, the second parameter is the receipt.
}

var server = net.createServer(function(socket) {
    console.log('Client is connected ...');
    socket.write('This is fee delegating service');
    socket.write('Fee payer is ' + feePayerPKey);
     socket.on('data', function(data) {
        //  console.log('Received data from client:', data.toString());
         feePayerSign(data.toString(), socket);
     });
});

server.listen(1337, '127.0.0.1');
console.log('Fee delegate service started ...');