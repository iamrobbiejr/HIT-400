import Web3 from 'web3';
import {supply_chain_abi, supply_chain_contract_address} from "../configs/supply_chain.config";


async function loadBlockchainData() {
    const web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:8545");
    // const network = await web3.eth.net.getNetworkType();
    // const accounts = await web3.eth.getAccounts();
    const supplyChain = new web3.eth.Contract(supply_chain_abi,supply_chain_contract_address);
    console.log(supplyChain);
}


/*****************************************Functions**********************************/
//check products(returns product where_abouts)

    const check_product = async (batchId) => {
    const web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:8545");
    const accounts = await web3.eth.getAccounts();

    const supplyChain = new web3.eth.Contract(supply_chain_abi, supply_chain_contract_address);

    let hexBatchId = web3.utils.asciiToHex(batchId);
    hexBatchId = web3.utils.padRight(hexBatchId,64);

    let index = await supplyChain.methods.checkProduct(hexBatchId).call({from: accounts[0]});
    console.log("index: ", index);

    let response;
    if(index === '-1')
    {
        response = {
            "success": false,
            "message": "No batch found",
            "data": {}
        }
    }
    else
    {
        let batchResponse = await supplyChain.methods.getBatchByIndex(index).call({from: accounts[0]});
        console.log("batch: ",batchResponse, ", date: ", web3.utils.hexToUtf8(batchResponse.expiryDate));
        let batch = {
            "batchId": web3.utils.hexToUtf8(batchResponse.batchId),
            "name" : web3.utils.hexToUtf8(batchResponse.name),
            "shipper": web3.utils.hexToUtf8(batchResponse.shipper),
            "receiver": web3.utils.hexToUtf8(batchResponse.receiver),
            "receiverType": web3.utils.hexToUtf8(batchResponse.receiverType),
            "location": web3.utils.hexToUtf8(batchResponse.location),
            "status": web3.utils.hexToUtf8(batchResponse.status),
            "expiry_date": web3.utils.hexToUtf8(batchResponse.expiryDate),
            "notes": web3.utils.hexToUtf8(batchResponse.note),
            "chain": web3.utils.hexToUtf8(batchResponse.chain)
        }
        console.log("batch: ",batch);

        response = {
            "success": true,
            "message": "batch found",
            "data": batch
        }
    }

    console.log(response);
    return response;

};

//Ship Batch
const shipBatch = async (batchId,name,shipper,receiver,receiverType,location,expiry_date) => {
    const web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:8545");
    const accounts = await web3.eth.getAccounts();

    const supplyChain = new web3.eth.Contract(supply_chain_abi, supply_chain_contract_address);

    let chain = shipper+"->"+receiver;
    //convert variables to hex
    let hexBatchId = web3.utils.asciiToHex(batchId);
    let hexName = web3.utils.asciiToHex(name);
    let hexShipper = web3.utils.asciiToHex(shipper);
    let hexReceiver = web3.utils.asciiToHex(receiver);
    let hexReceiverType = web3.utils.asciiToHex(receiverType);
    let hexLocation = web3.utils.asciiToHex(location);
    let hexExpiryDate = web3.utils.asciiToHex(expiry_date);
    let hexChain = web3.utils.asciiToHex(chain);

    //call method ship
    await supplyChain.methods
        .manufactureShipProduct(hexBatchId,hexName,hexShipper,hexReceiver,hexReceiverType,hexLocation,hexExpiryDate,hexChain)
        .send({from: accounts[0]})
        .on('transactionHash', function(hash){
            console.log('hash: ', hash);
        })
        .on('confirmation', function(confirmationNumber, receipt){
            console.log('confirmNumber: ', confirmationNumber);
        })
        .on('receipt', function(receipt) {
            // receipt example
            console.log("receipt: ",receipt);
        })
        .on('error', function(error, receipt) { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
            console.log('error: ' ,error);

        });
}

//wholesaler and distributor
const wd_ship_batch = async(batchId,receiver,userAddress) =>
{
    const web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:8545");
    // const accounts = await web3.eth.getAccounts();

    const supplyChain = new web3.eth.Contract(supply_chain_abi, supply_chain_contract_address);

    //get supplychain and update
    let final_chain = "Manufacturer->Wholesaler->Distributor->"+receiver;

    let hexBatchId = web3.utils.asciiToHex(batchId);
    let hexReceiver = web3.utils.asciiToHex(receiver);
    let hexChain = web3.utils.asciiToHex(final_chain);

    //call method ship
    await supplyChain.methods
        .wholesalerDistributorShipProduct(hexBatchId,hexReceiver,hexChain)
        .send({from: userAddress})
        .on('transactionHash', function(hash){
            console.log('hash: ', hash);
        })
        .on('confirmation', function(confirmationNumber, receipt){
            console.log('confirmNumber: ', confirmationNumber);
        })
        .on('receipt', function(receipt) {
            // receipt example
            console.log("receipt: ",receipt);
        })
        .on('error', function(error, receipt) { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
            console.log('error: ' ,error);

        });

}


//update status, (accept or reject) returns with message
const accept_shipment = async(batchId,location,userAddress) =>
{
    const web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:8545");
    // const accounts = await web3.eth.getAccounts();

    const supplyChain = new web3.eth.Contract(supply_chain_abi, supply_chain_contract_address);
    let hexBatchId = web3.utils.asciiToHex(batchId);
    hexBatchId = web3.utils.padRight(hexBatchId,64);
    let hexLocation = web3.utils.asciiToHex(location);

    await supplyChain.methods
        .AcceptShipment(hexBatchId,hexLocation)
        .send({from: userAddress})
        .on('transactionHash', function(hash){
            console.log('hash: ', hash);
        })
        .on('confirmation', function(confirmationNumber, receipt){
            console.log('confirmNumber: ', confirmationNumber);
        })
        .on('receipt', function(receipt) {
            // receipt example
            console.log("receipt: ",receipt);
        })
        .on('error', function(error, receipt) { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
            console.log('error: ' ,error);

        });

}

const reject_shipment = async(batchId,note,userAddress) =>
{
    const web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:8545");


    const supplyChain = new web3.eth.Contract(supply_chain_abi, supply_chain_contract_address);

    let hexBatchId = web3.utils.asciiToHex(batchId);
    hexBatchId = web3.utils.padRight(hexBatchId,64);

    let index = await supplyChain.methods.checkProduct(hexBatchId)
        .call({from: userAddress});

    let res;
    let b
    if(index === '-1')
    {
        res = {
            "success": false,
            "message": "No batch found,Check Your BatchId And Try Again ",
        }
        return res;
    }
    else
    {
        let bat = await supplyChain.methods.getBatchByIndex(index).call({from: userAddress});
        console.log("batch: ",bat);
        b = {
            "shipper": web3.utils.hexToUtf8(bat.shipper),
            "chain": web3.utils.hexToUtf8(bat.chain)
        }
        console.log("batch: ",b);
    }

    let initial_chain = b.chain;
    let final_chain = initial_chain+"->"+b.shipper;

    let hexNote = web3.utils.asciiToHex(note);
    let hexChain = web3.utils.asciiToHex(final_chain);

    await supplyChain.methods
        .returnShipment(hexBatchId,hexNote,hexChain)
        .send({from: userAddress})
        .on('transactionHash', function(hash){
            console.log('hash: ', hash);
        })
        .on('confirmation', function(confirmationNumber, receipt){
            console.log('confirmNumber: ', confirmationNumber);
        })
        .on('receipt', function(receipt) {
            // receipt example
            console.log("receipt: ",receipt);
        })
        .on('error', function(error, receipt) { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
            console.log('error: ' ,error);

        });
}


//getAllBatches
const getAllBatches = async() => {
    const web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:8545");
    const accounts = await web3.eth.getAccounts();

    const supplyChain = new web3.eth.Contract(supply_chain_abi, supply_chain_contract_address);

    let batchesCount = await supplyChain.methods.getBatchesCount().call({from: accounts[0]});

    let i;
    let batches = [];
    for(i = 0;i < batchesCount; i++)
    {
        let batch = await supplyChain.methods.getBatchByIndex(i).call({from: accounts[0]});

        let data = {
            "batchId": web3.utils.hexToUtf8(batch.batchId),
            "name" : web3.utils.hexToUtf8(batch.name),
            "shipper": web3.utils.hexToUtf8(batch.shipper),
            "receiver": web3.utils.hexToUtf8(batch.receiver),
            "receiverType": web3.utils.hexToUtf8(batch.receiverType),
            "location": web3.utils.hexToUtf8(batch.location),
            "status": web3.utils.hexToUtf8(batch.status),
            "expiry_date": web3.utils.hexToUtf8(batch.expiryDate),
            "notes": web3.utils.hexToUtf8(batch.note),
            "chain": web3.utils.hexToUtf8(batch.chain),
            "batchOwner": web3.utils.hexToUtf8(batch.batchOwner)
        }

        batches.push(data);
    }


    return batches;
}

//getAllBatches
const getAllBatchesByOwner = async(bOwner) => {
    const web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:8545");
    const accounts = await web3.eth.getAccounts();

    const supplyChain = new web3.eth.Contract(supply_chain_abi, supply_chain_contract_address);

    let batchesCount = await supplyChain.methods.getBatchesCount().call({from: accounts[0]});

    let i;
    let batches = [];
    for(i = 0;i < batchesCount; i++)
    {
        let batch = await supplyChain.methods.getBatchByIndex(i).call({from: accounts[0]});
        let batchOwner =  web3.utils.hexToUtf8(batch.batchOwner);
        if(batchOwner === bOwner){
            let data = {
                "batchId": web3.utils.hexToUtf8(batch.batchId),
                "name" : web3.utils.hexToUtf8(batch.name),
                "shipper": web3.utils.hexToUtf8(batch.shipper),
                "receiver": web3.utils.hexToUtf8(batch.receiver),
                "receiverType": web3.utils.hexToUtf8(batch.receiverType),
                "location": web3.utils.hexToUtf8(batch.location),
                "status": web3.utils.hexToUtf8(batch.status),
                "expiry_date": web3.utils.hexToUtf8(batch.expiryDate),
                "notes": web3.utils.hexToUtf8(batch.note),
                "chain": web3.utils.hexToUtf8(batch.chain),
                "batchOwner": web3.utils.hexToUtf8(batch.batchOwner)
            }

            batches.push(data);
        }

    }


    return batches;
}

export default {
    loadBlockchainData,
    shipBatch,
    check_product,
    getAllBatches,
    accept_shipment,
    reject_shipment,
    getAllBatchesByOwner,
    wd_ship_batch
}
