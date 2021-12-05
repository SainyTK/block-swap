import hre, { ethers } from "hardhat";
import addressUtils from '../../utils/addressUtils';

export async function deployRouter() {
    const addressList = await addressUtils.getAddressList(hre.network.name);

    const BlockSwapRouter = await ethers.getContractFactory('BlockSwapRouter');
    const router = await BlockSwapRouter.deploy(addressList['SwapFactory'], addressList['WKUB']);

    console.log(`SwapRouter deployed to:`, router.address);

    await addressUtils.saveAddresses(hre.network.name, { SwapRouter: router.address });

    return router;
}