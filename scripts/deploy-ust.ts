import hre from 'hardhat';
import address from '../utils/address';
import { UST__factory } from '../typechain/factories/UST__factory';

async function main() {
    const UST = await hre.ethers.getContractFactory("UST") as UST__factory;
    const ust = await UST.deploy();
    await ust.deployTransaction.wait();
    console.log("UST deployed to:", ust.address)

    await address.saveAddresses(hre.network.name, { ust: ust.address });

    await ust.mint(hre.ethers.utils.parseEther('10000000')).then(tx => tx.wait());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
