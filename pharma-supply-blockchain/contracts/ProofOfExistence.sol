// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 <0.9.0;

contract ProofOfExistence {

    mapping(bytes32 => uint) private batchIdToIndex;
    mapping(bytes32 => uint) private batchOwnerToIndex;


    bytes32[] private batchIds;
    bytes32[] private batchOwners;
    bytes32[] private names;
    bytes32[] private shippers;
    bytes32[] private receivers;
    bytes32[] private receiverTypes;
    bytes32[] private statuses; //shipped, delivered , Accepted/Rejected
    bytes32[] private locations;
    bytes32[] private expiryDates;
    bytes32[] private notes;
    string[] private supplyChain;

    // Store Shipped Batched On The Distributed Ledger
    function manufactureShipProduct
    (
    bytes32 batchId,bytes32 name,bytes32 shipper,bytes32 receiver, bytes32 receiverType,
        bytes32 location,bytes32 expiryDate,string memory chain
    )
    public returns(bool success)
    {
        batchIds.push(batchId);
        batchOwners.push(shipper);//shipper
        names.push(name);

        shippers.push(shipper);
        receivers.push(receiver);
        receiverTypes.push(receiverType);
        locations.push(location);
        expiryDates.push(expiryDate);
        statuses.push('Shipped');
        notes.push(' ');
        supplyChain.push(chain);

        batchIdToIndex[batchId] = batchIds.length - 1;
        batchOwnerToIndex[shipper] = batchOwners.length - 1;

        return true;

    }

    function wholesalerDistributorShipProduct (bytes32 batchId, bytes32 receiver,bytes32 receiverType, string memory chain) public returns(bool success)
    {
        require(hasBatch(batchId));


        statuses[batchIdToIndex[batchId]] = "In Transit";
        shippers[batchIdToIndex[batchId]] = batchOwners[batchIdToIndex[batchId]];
        receivers[batchIdToIndex[batchId]] = receiver;
        receiverTypes[batchIdToIndex[batchId]] = receiverType;
        supplyChain[batchIdToIndex[batchId]] = chain;

        return true;
    }

    //Proof of Existence
    function hasBatch(bytes32 batchId) public view returns(bool hasIndeed)
    {
        if(batchIdToIndex[batchId] >= 0){
            return true;
        }
        else
        {
        return false;
        }
        //return batchIdToIndex[batchId] >= 0;
    }

    //find batches by batchOwner address
    function hasBatches(bytes32 batchOwner) public view returns(bool hasIndeed)
    {
        return (batchOwnerToIndex[batchOwner] >= 0 || batchOwner == batchOwners[batchOwnerToIndex[batchOwner]]);
    }

    //check for whereabouts of the batch
    function checkProduct(bytes32 batchId) public view returns(int index)
    {
        //require(hasBatch(batchId));
        //require(batchIdToIndex[batchId] < batchIds.length);

        if(batchId == batchIds[batchIdToIndex[batchId]])
        {
            return int(batchIdToIndex[batchId]);
        }
        else
        {
            return -1;
        }

    }

    //get batchByIndex
    function getBatchByIndex(uint index) public view returns(bytes32 batchId,bytes32 batchOwner,bytes32 name,bytes32 shipper,bytes32 receiver, bytes32 receiverType, bytes32 status,bytes32 location,
        bytes32 note,bytes32 expiryDate,string memory chain)
    {
        require(index < batchIds.length);
        uint i = index;

        return (batchIds[index],batchOwners[index],names[i],shippers[i],receivers[i],
        receiverTypes[i], statuses[i],locations[i]
        ,notes[i],expiryDates[i],supplyChain[i]);
    }

    //get batches count
    function getBatchesCount() public view returns(uint count)
    {
        return batchIds.length;
    }

    //Receive Product


    //reject batch
    function returnShipment(bytes32 batchId,bytes32 note,string memory chain) public returns(bool success)
    {
        require(hasBatch(batchId));


        //update batch details
        bytes32 shipper = receivers[batchIdToIndex[batchId]];
        bytes32 receiver = shippers[batchIdToIndex[batchId]];

        statuses[batchIdToIndex[batchId]] = "Rejected";
        notes[batchIdToIndex[batchId]] = note;
        shippers[batchIdToIndex[batchId]] = shipper;
        receivers[batchIdToIndex[batchId]] = receiver;
        receiverTypes[batchIdToIndex[batchId]] = "batchOwner";
        supplyChain[batchIdToIndex[batchId]] = chain;

        return true;
    }

    //accept batch
    function AcceptShipment(bytes32 batchId,bytes32 location) public returns(bool success)
    {
        require(hasBatch(batchId));

        //update batch details
        statuses[batchIdToIndex[batchId]] = "Delivered";
        batchOwners[batchIdToIndex[batchId]] = receivers[batchIdToIndex[batchId]];
        locations[batchIdToIndex[batchId]] = location;

        return true;

    }

    //return all batches owned by user
    function getBatchesByBatchOwnerAddress(bytes32 batchOwner) public view returns
    (
    uint index,bytes32 batchId,bytes32 name,bytes32 status,bytes32 location,
        bytes32 note,bytes32 expiryDate,string memory chain
        )
    {
        require(hasBatches(batchOwner));
        require(batchOwnerToIndex[batchOwner] > batchOwners.length);
        uint b = batchOwnerToIndex[batchOwner];


        return (
        batchOwnerToIndex[batchOwner],batchIds[batchOwnerToIndex[batchOwner]],
        names[b],statuses[b],locations[b]
        ,notes[b],expiryDates[b],supplyChain[b]
        );

    }

    //return complete chain of batch
    function getChain(uint index) public view returns(string memory chain)
    {
        require(index < batchIds.length);

        return (supplyChain[index]);
    }

}