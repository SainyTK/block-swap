import hre, { ethers } from 'hardhat';
import { BNB__factory } from '../typechain/factories/BNB__factory';
import { DAI__factory } from '../typechain/factories/DAI__factory';
import { BlockSwapRouter__factory } from '../typechain/factories/BlockSwapRouter__factory';
import address from '../utils/address';

const daiBNB = [
    '320267',
    '1000'
]

async function main() {
    const [owner] = await hre.ethers.getSigners();

    const addressList = await address.getAddressList(hre.network.name);

    const BlockSwapRouter = await hre.ethers.getContractFactory("BlockSwapRouter") as BlockSwapRouter__factory;
    const DAI = await hre.ethers.getContractFactory("DAI") as DAI__factory;
    const BNB = await hre.ethers.getContractFactory("BNB") as BNB__factory;

    const swapRouter = await BlockSwapRouter.attach(addressList.swapRouter);
    const dai = await DAI.attach(addressList.dai);
    const bnb = await BNB.attach(addressList.bnb);

    await dai.approve(swapRouter.address, ethers.constants.MaxUint256).then(tx => tx.wait());
    await bnb.approve(swapRouter.address, ethers.constants.MaxUint256).then(tx => tx.wait());

    await swapRouter.addLiquidity(
        dai.address, 
        bnb.address, 
        hre.ethers.utils.parseEther(daiBNB[0]), 
        hre.ethers.utils.parseEther(daiBNB[1]), 
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
