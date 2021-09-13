const dotenv = require('dotenv')
dotenv.config({ path: '.local-env' })

const HDWalletProvider = require('@truffle/hdwallet-provider')

const { API_URL, PUBLIC_KEY, PRIVATE_KEY } = process.env;

module.exports = {
    networks: {
        kovan: {
            provider: () => {
                return new HDWalletProvider(PRIVATE_KEY, API_URL)
            },
            from: PUBLIC_KEY,
            network_id: '42',
            gas: 8000000,
            gasPrice: 10000000000,
        },
        local: {
            host: "127.0.0.1",    
            port: 8545,           
            network_id: "1024",    
        }
    },
    compilers: {
        solc: {
            version: "0.8.6",
            docker: false,
            settings: {
                optimizer: {
                    enabled: true,
                    runs: 200
                },
                evmVersion: "istanbul"
            }
        }
    }
}
