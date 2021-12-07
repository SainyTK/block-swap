import * as dotenv from "dotenv";

import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";

dotenv.config();

const getAccounts = () => {
  const arr = Object.entries(process.env);
  const privateKeys = arr.filter(([key,val]) => key.includes(`PRIVATE_KEY`)).map(([key, val]) => val || '');
  return privateKeys;
}

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.6.7",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        }
      },
      {
        version: "0.8.0",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        }
      }
    ]
  },
  networks: {
    ropsten: {
      url: process.env.ROPSTEN_URL || "",
      accounts: getAccounts()
    },
    kubchain_test: {
      url: `https://rpc-testnet.bitkubchain.io`,
      accounts: getAccounts(),
    },
    kubchain: {
      url: `https://rpc.bitkubchain.io`,
      accounts: getAccounts(),
    }
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  }
};

export default config;
