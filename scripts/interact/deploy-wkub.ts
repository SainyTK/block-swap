import hre from 'hardhat';
import address from '../utils/address';

async function main() {
    const WKUB = await hre.ethers.getContractFactory("WKUB");
    const wkub = await WKUB.deploy();
    await wkub.deployTransaction.wait();
    console.log("WKUB deployed to:", wkub.address);

    await address.saveAddresses(hre.network.name, { wkub: wkub.address });
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
