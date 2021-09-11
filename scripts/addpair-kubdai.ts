import hre, { ethers } from 'hardhat';
import { DAI__factory } from '../typechain/factories/DAI__factory';
import { BlockSwapRouter__factory } from '../typechain/factories/BlockSwapRouter__factory';
import address from '../utils/address';

const kubDAI = [
    '5',
    '3.852095'
]

async function main() {
    const [owner] = await hre.ethers.getSigners();

    const addressList = await address.getAddressList(hre.network.name);

    const BlockSwapRouter = await hre.ethers.getContractFactory("BlockSwapRouter") as BlockSwapRouter__factory;
    const DAI = await hre.ethers.getContractFactory("DAI") as DAI__factory;

    const swapRouter = await BlockSwapRouter.attach(addressList.swapRouter);
    const dai = await DAI.attach(addressList.dai);

    await dai.approve(swapRouter.address, ethers.constants.MaxUint256).then(tx => tx.wait());

    await swapRouter.addLiquidityETH(
        dai.address, 
        hre.ethers.utils.parseEther(kubDAI[1]), 
        "0", 
        "0", 
        owner.address, 
        Math.floor(new Date().valueOf()),
        {
            value: hre.ethers.utils.parseEther(kubDAI[0])
        }
    );
    
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
