# BLOCK Swap

## Note
1. Please edit the `.env-example.json` file name to `.env` and fill up your private keys to interact with the smart contracts. Multiple private keys are also supported. You can define them by using the `PRIVATE_KEY` prefix follows by the running number (e.g., PRIVATE_KEY1=xxx).
2. Don't forget to edit the init code hash in `/contracts/libraries/BlockSwapLibrary.sol`. The init code hash can be retrived from `blockSwapFactory.INIT_CODE_PAIR_HASH()`. 

## Getting started
1. run `npm i`
2. run `npx hardhat compile`