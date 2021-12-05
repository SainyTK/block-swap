import hre, { ethers } from 'hardhat';
import { UST__factory } from '../typechain/factories/UST__factory';
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
    const UST = await hre.ethers.getContractFactory("UST") as UST__factory;

    const swapRouter = await BlockSwapRouter.attach(addressList.swapRouter);
    const swapFactory = await BlockSwapFactory.attach(addressList.swapFactory);
    const dai = await DAI.attach(addressList.dai);
    const ust = await UST.attach(addressList.ust);

    const pairAddr = await swapFactory.getPair(dai.address, ust.address);
    const daiustPair = await BlockSwapPair.attach(pairAddr);

    const lp = await daiustPair.balanceOf(owner.address);

    await daiustPair.approve(swapRouter.address, hre.ethers.constants.MaxUint256);

    await swapRouter.removeLiquidity(
        dai.address,
        ust.address,
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
