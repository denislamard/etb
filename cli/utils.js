const fs = require('fs');
const dotenv = require('dotenv')
dotenv.config({ path: '../.local-env' })
const { createAlchemyWeb3 } = require("@alch/alchemy-web3")

const API_URL = process.env.API_URL
const GAS = process.env.GAS
const CONTRACT_FILENAME = process.env.CONTRACT_ETB_FILENAME

const WEB3 = createAlchemyWeb3(API_URL)
const PUBLIC_KEY = process.env.PUBLIC_KEY
const PRIVATE_KEY = process.env.PRIVATE_KEY

const CONTRACT = fs.readFileSync(CONTRACT_FILENAME, 'utf8').toString().trim()
const ABI = require('../build/contracts/EnergyToken.json').abi
const OPTIONS = { from: PUBLIC_KEY, gas: GAS }

const transactionData = async (method, publicKey) => {
    return {
        to: CONTRACT,
        nonce: await WEB3.eth.getTransactionCount(publicKey, 'latest'),
        gas: GAS,
        data: method.encodeABI()
    }
}

const list_account = [
    { public: '0x84bb9Eb7d0118af72617766d2d75acf8259A045c', private: '0xd5187245244eb865d569e1993cea090a9761ce494580fc7cc422486344d77304' },
    { public: '0x83c31BE73AcF0E4189Dc972Bb4A1F872f853D5cB', private: '0xdd2be06b29734df399c0e7daa0fd15e34bc64e721ddd9ae7412b861a229eb773' },
    { public: '0x037BFcA5aDa42FEEe729D7Af7c9E2d9aC0625f64', private: '0x0598b11da9a97d81e2be6e5670b7f3bfb0cece5033b8f460af0807491f53c96d' },
    { public: '0xE8fDa87be1Adbd3b3253e868534A38eA17eF2C40', private: '0xa955ca28fb26a3ca2b7fd9dcc7eb63107825efce5092147a803ca3e5b3c1503b' },
]

const extractPrivateKey = (account) => {
    const result =list_account.filter(item => item.public == account)
    if (result.length > 0) {
        return result[0].private
    }
    log(chalk.red(`account ${account} is unknown`))
    process.exit(-1)
}


const which_account = {
    name: 'ACCOUNT',
    type: 'list',
    message: 'Which account ?',
    choices: () => {
        let list = []
        list_account.map(account => {
            list.push(account.public)
        })
        return list
    }
}


module.exports = {
    WEB3: WEB3,
    PUBLIC_KEY: PUBLIC_KEY,
    PRIVATE_KEY: PRIVATE_KEY,
    CONTRACT: CONTRACT,
    ABI: ABI,
    OPTIONS: OPTIONS,
    GAS: GAS,
    createToken: (options = OPTIONS) => {
        return new WEB3.eth.Contract(ABI, CONTRACT, OPTIONS)
    },
    sendTransaction: async (method, publicKey, privateKey) => {
        return await WEB3.eth.sendSignedTransaction((await WEB3.eth.accounts.signTransaction(await transactionData(method, publicKey), privateKey)).rawTransaction)
    },
    WHICH_ACCOUNT: which_account,
    LIST_ACCOUNT: list_account,
    EXTRACT_PRIVATE_KEY: extractPrivateKey
}
