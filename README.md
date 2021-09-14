# Energy Token on Blockchain

This project aims to demonstrate the power of blockchain in a market context. The **ETB** token *(**E**nergy **T**oken on **B**lockchain)* based on Ethereum standard **ERC20** is used as a currency and as a market manager.

More information are given into this [pdf file](https://github.com/denislamard/etb/blob/main/Denis_LAMARD_EnergyTokenOnBlockchain.pdf).

## Files and Folders

| Name          | Type           | Comments  |
|:-------------:|:--------------:| --------|
|cli/|folder|client application written in nodejs|
|contract.addr/|folder|this contains the addresses of contracts|
|contracts/|folder|this contains all smart contracts written in solididy|
|deploy|file|script bash used for the deployment of the smart contracts|
|documents/|folder|all documents|
|local-env|file|environment variables for local blockchain|
|migrations/|folder|used for the truffle deployment|
|package.json|file|list of all necessary modules nodejs|
|start-blockchain|file|bash script used to start the local blockchain|
|truffle-config.js|file|parameters for truffle|

## Clone the repository
Firstly , it is mandatory to clone the git repo.
```bash
git clone git@github.com:denislamard/etb.git
```
## Setup the environment
Install all node modules on the development environment.
```bash
cd etb
npm install
```

Install all node modules on the cli applications.
```bash
cd etb/cli
npm install
```

## Start the local blockchain
Before using the project, it is necessary to start the blockchain. a new folder named **ganache-db** will be created. This folder stores data from the blockchain.
```bash
cd etb
./start-blockchain
```

## Deploy the contracts
The contracts must be deployed on the local blockchain before using the cli applications. The new addresses of contracts are stored in **contract.addr**. Each file contains the contract address.
```bash
cd etb
./deploy
```

## Using the cli applications
To execute these 4 cli applications, nodejs must be used.
> ex.: **node admin.js**

1. Enable roles with **admin.js**
![alt admin](https://github.com/denislamard/etb/blob/main/img/admin.png)

2. Buy some tokens ETB for consumer accounts with **account-manager.js**
![alt admin](https://github.com/denislamard/etb/blob/main/img/account-manager.png)

3. Sell amount of energy with **producer.js**
![alt admin](https://github.com/denislamard/etb/blob/main/img/producer.png)

4. buy amount of energy **consumer.js**
![alt admin](https://github.com/denislamard/etb/blob/main/img/consumer.png)

## Available Accounts
The 4 given accounts are used for only testing environment **(local blockchain)**.  These accounts are unknown on all **public blockchain**.

1. 0x84bb9Eb7d0118af72617766d2d75acf8259A045c
	> 0xd5187245244eb865d569e1993cea090a9761ce494580fc7cc422486344d77304

2. 0x83c31BE73AcF0E4189Dc972Bb4A1F872f853D5cB (5 ETH)
	> 0xdd2be06b29734df399c0e7daa0fd15e34bc64e721ddd9ae7412b861a229eb773

3. 0x037BFcA5aDa42FEEe729D7Af7c9E2d9aC0625f64 (5 ETH)
	> 0x0598b11da9a97d81e2be6e5670b7f3bfb0cece5033b8f460af0807491f53c96d

4. 0xE8fDa87be1Adbd3b3253e868534A38eA17eF2C40 (5 ETH)
	> 0xa955ca28fb26a3ca2b7fd9dcc7eb63107825efce5092147a803ca3e5b3c1503b
	
