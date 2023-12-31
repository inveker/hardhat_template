import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import '@nomiclabs/hardhat-etherscan'
import 'hardhat-deploy'
import 'hardhat-gas-reporter'
import 'hardhat-tracer'
import 'hardhat-abi-exporter'
import '@nomicfoundation/hardhat-chai-matchers'
import 'hardhat-contract-sizer'

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: '0.8.18',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
          viaIR: true,
        },
      },
    ],
  },
  networks: {
    hardhat: {
      chainId: 1337,
      forking: {
        url: 'https://rpc.ankr.com/bsc',
        blockNumber: 28951238,
      },
      blockGasLimit: 30000000,
      accounts: {
        count: 10,
        accountsBalance: '1000000000000000000000000000',
      },
      loggingEnabled: true,
      // mining: {
      //   auto: false,
      //   interval: 2000,
      // }
    }
  },
  abiExporter: {
    path: './abi',
  },
  gasReporter: {
    enabled: true,
    currency: 'USD',
    gasPrice: 30,
  },
  mocha: {
    timeout: 100000000,
  },
  tracer: {
    tasks: ['deploy'],
  },
}

export default config