import hre, { ethers } from "hardhat";
import addressUtils from '../../utils/addressUtils';

export async function deployFactory() {
    const [signer] = await ethers.getSigners();

    const BlockSwapFactory = await ethers.getContractFactory('BlockSwapFactory');
    const factory = await BlockSwapFactory.deploy(signer.address);

    console.log(`SwapFactory deployed to:`, factory.address);

    console.log(`Init code hash: `, await factory.INIT_CODE_PAIR_HASH());

    await addressUtils.saveAddresses(hre.network.name, { SwapFactory: factory.address });

    return factory;
}