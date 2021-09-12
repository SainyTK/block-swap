import hre from 'hardhat';
import address from '../utils/address';
import { BNB__factory } from '../typechain/factories/BNB__factory';

async function main() {
    const [owner] = await hre.ethers.getSigners();
    const BNB = await hre.ethers.getContractFactory("BNB") as BNB__factory;;
    const bnb = await BNB.deploy();
    await bnb.deployTransaction.wait();
    console.log("BNB deployed to:", bnb.address);

    await address.saveAddresses(hre.network.name, { bnb: bnb.address });

    await bnb.mint(owner.address, hre.ethers.utils.parseEther('10000000')).then(tx => tx.wait());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
