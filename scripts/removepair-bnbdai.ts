import hre, { ethers } from 'hardhat';
import { BNB__factory } from '../typechain/factories/BNB__factory';
import { DAI__factory } from '../typechain/factories/DAI__factory';
import { BlockSwapRouter__factory } from '../typechain/factories/BlockSwapRouter__factory';
import { BlockSwapFactory__factory } from '../typechain/factories/BlockSwapFactory__factory';
import { BlockSwapPair__factory } from '../typechain/factories/BlockSwapPair__factory';
import address from '../utils/address';

async function main() {
    const [owner] = await hre.ethers.getSigners();

    const addressList = await address.getAddressList(hre.network.name);

    const BlockSwapRouter = await hre.ethers.getContractFactory("BlockSwapRouter") as BlockSwapRouter__factory;
    const BlockSwapFactory = await hre.ethers.getContractFactory("BlockSwapFactory") as BlockSwapFactory__factory;
    const BlockSwapPair = await hre.ethers.getContractFactory("BlockSwapPair") as BlockSwapPair__factory;
    const DAI = await hre.ethers.getContractFactory("DAI") as DAI__factory;
    const BNB = await hre.ethers.getContractFactory("BNB") as BNB__factory;

    const swapRouter = await BlockSwapRouter.attach(addressList.swapRouter);
    const swapFactory = await BlockSwapFactory.attach(addressList.swapFactory);
    const dai = await DAI.attach(addressList.dai);
    const bnb = await BNB.attach(addressList.bnb);

    const pairAddr = await swapFactory.getPair(dai.address, bnb.address);
    const daibnbPair = await BlockSwapPair.attach(pairAddr);

    const lp = await daibnbPair.balanceOf(owner.address);

    await daibnbPair.approve(swapRouter.address, hre.ethers.constants.MaxUint256);

    await swapRouter.removeLiquidity(
        dai.address, 
        bnb.address, 
        lp,
        "0", 
        "0", 
        owner.address,
        Math.floor(new Date().valueOf() 
    ));
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
