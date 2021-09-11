import hre from 'hardhat';
import address from '../utils/address';
import { BlockSwapFactory__factory } from '../typechain/factories/BlockSwapFactory__factory';
import { BlockSwapRouter__factory } from '../typechain/factories/BlockSwapRouter__factory';
import { WKUB__factory } from '../typechain/factories/WKUB__factory';

async function main() {
    const addressList = await address.getAddressList(hre.network.name);

    const BlockSwapFactory = await hre.ethers.getContractFactory("BlockSwapFactory") as BlockSwapFactory__factory;
    const BlockSwapRouter = await hre.ethers.getContractFactory("BlockSwapRouter") as BlockSwapRouter__factory;
    const WKUB = await hre.ethers.getContractFactory('WKUB') as WKUB__factory;

    const blockswapFactor = await BlockSwapFactory.attach(addressList.swapFactory);
    const wkub = await WKUB.attach(addressList.wkub);

    const blockswapRouter = await BlockSwapRouter.deploy(blockswapFactor.address, wkub.address);
    await blockswapRouter.deployTransaction.wait();

    await address.saveAddresses(hre.network.name, { swapRouter: blockswapRouter.address });
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
