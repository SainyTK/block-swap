import hre from 'hardhat';
import address from '../utils/address';
import { DAI__factory } from '../typechain/factories/DAI__factory';

async function main() {
    const [owner] = await hre.ethers.getSigners();
    const DAI = await hre.ethers.getContractFactory("DAI") as DAI__factory;;
    const dai = await DAI.deploy();
    await dai.deployTransaction.wait();
    console.log("DAI deployed to:", dai.address);

    await address.saveAddresses(hre.network.name, { dai: dai.address });

    await dai.mint(owner.address, hre.ethers.utils.parseEther('10000000')).then(tx => tx.wait());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
