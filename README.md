# Swap fork 

## Note
1. Please edit the `secrets-example.json` file name to `secrets.json` and fill up your private keys to interact with the smart contracts.
2. Don't forget to edit the init code hash in `/contracts/libraries/BlockSwapLibrary.sol`. The init code hash can be retrived from `blockSwapFactory.INIT_CODE_PAIR_HASH()`. 

## Getting started
1. run `npm i`
2. run `npx hardhat run scripts/deploy.js`