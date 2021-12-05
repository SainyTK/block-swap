import hre from 'hardhat';
import address from '../utils/address';

async function main() {
    const [owner] = await hre.ethers.getSigners();

    const BlockSwapFactory = await hre.ethers.getContractFactory("BlockSwapFactory");
    const swapFactory = await BlockSwapFactory.deploy(owner.address);
    await swapFactory.deployTransaction.wait();

    console.log("BlockSwapFactory deployed to:", swapFactory.address);
    console.log("init code hash: ", await swapFactory.INIT_CODE_PAIR_HASH());

    await address.saveAddresses(hre.network.name, { swapFactory: swapFactory.address });
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
