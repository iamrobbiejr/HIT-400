# Blockchain : Pharmaceutical SupplyChain
This project showcases the journey of Medicine on blockchain.

The Pharmaceutical supply chain is the sequence of activities and process to bring drugs from Manufacturer to processed medicine in Pharmacies.

#### Problems in Exixting System
---
- Shipment visibility
- Expiration
- Slow Process and Error prone paper work
- Mutable and Invalid source
- Lack of coordination

#### What the system is providing
---
- Accurate information across the entire chain at any point and at any location
- Instant access to real-time updates and alerts if issues are detected
- Visibility of all handovers in the supply chain
- Traceability back to source of all materials
- Seamless collaboration between all parties
- Reduce paper work and Speedup process

#### Roles
---
1. Admin
2. Manufacturer
3. Wholesaler
4. Distributer
5. Retailer / Pharma

**Admin :** Admin oversees who's registered on the blockchain and batches being transported at any given time.
**Manufacturer :** Manufacturer is responsible to manufacturer new medicine batches for shipping to either Wholesaler or Distributor
**Wholesaler :** Wholesaler is reponsible to receive medicine from Manufacturer and validate medicine quality, then transfer to Distributor.
**Distrubutor :** Distributer is reponsible to distribute medicne to pharmas and do verification on medicine quality and condition.
**Pharma :** Pharma is reponsible to verify and validate medicine quality and update medicine status.

#### Tools and Technologies
---
- Solidity (Ethereum Smart Contract Language)
- Metamask (Ethereum wallet)
- Pharma-Supply network (Custom RPC )
- Truffle
- Web3JS
- ReactJS

#### Prerequisites
---
- Nodejs v8.12 or above
- Truffle v5.0.0 (core: 5.0.0) (http://truffleframework.com/docs/getting_started/installation)
- Solidity v0.5.0
- Metamask (https://metamask.io)
- Ganache (https://truffleframework.com/docs/ganache/quickstart)

#### Contract Deployment Steps:
---
**Setting up Ethereum Smart Contract:**

```
git clone https://github.com/iamrobbiejr/HIT-400.git
cd pharma-supply-blockchain/
```
**Update truffle-config.js **

```
module.exports =
{
    networks:
    {
	      development:
		   {
	   	 	host: "localhost",
	   		port: 8545,
	   		network_id: "*" // Match any network id
		    }
    },
    
};
```
Go to your project folder in terminal then execute :

```
rm -rf build/
truffle compile
truffle migrate
```
**Please note:**
1. After successfully deployment you will get response in bash terminal like below
```
Starting migrations...
======================
> Network name:    'development'
> Network id:      5777
> Block gas limit: 6721975 (0x6691b7)


1_initial_migration.js
======================

   Deploying 'Migrations'
   ----------------------
   > transaction hash:    0x29ed5cb5de76f2da10bfe82215a8e1221ea00a24ba6f8326aaba8af7cfe25723
   > Blocks: 1            Seconds: 15
   > contract address:    0xA218b5221497CDd926c795e563e48c1fdCf0886A
   > block number:        97
   > block timestamp:     1620979860
   > account:             0xCB5078fe5C0E384272348AA77d6E3293358A0855
   > balance:             99.40278238
   > gas used:            205287 (0x321e7)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.00410574 ETH


   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:          0.00410574 ETH


2_deploy_user.js
================

   Deploying 'User'
   ----------------
   > transaction hash:    0xad1b9c45403b28dd552bc91a2f600bcc91da7795401cf9e34dc38b0e2725f99e
   > Blocks: 1            Seconds: 14
   > contract address:    0x3fAF0fAE7fAE679f3Da919E729289f8DF297438a
   > block number:        99
   > block timestamp:     1620979898
   > account:             0xCB5078fe5C0E384272348AA77d6E3293358A0855
   > balance:             99.37550366
   > gas used:            1321587 (0x142a73)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.02643174 ETH


   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:          0.02643174 ETH


3_deploy_proofofexistence.js
============================

   Deploying 'ProofOfExistence'
   ----------------------------
   > transaction hash:    0x03b3e9771250bbaa22111555c59127c9662cc7dd02ef71e757c8ed378bf95622
   > Blocks: 0            Seconds: 0
   > contract address:    0xA27013ceec2d5C1e509311681D05fDB141F0ea24
   > block number:        101
   > block timestamp:     1620979918
   > account:             0xCB5078fe5C0E384272348AA77d6E3293358A0855
   > balance:             99.3566744
   > gas used:            914114 (0xdf2c2)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.01828228 ETH


   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:          0.01828228 ETH


Summary
=======
> Total deployments:   3
> Final cost:          0.04881976 ETH

```

#### Blockchain SupplyChain UI:
---
**Setting up SupplyChain UI:**

```
cd pharma-supply-ui
yarn install
yarn start
```
