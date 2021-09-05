const hre = require("hardhat");

const INTERVAL = 5 * 60 * 1000;

function formatEther(data) {
    return hre.ethers.utils.formatEther(data.toString());
}

function formatUnits(data, unit) {
    return hre.ethers.utils.formatUnits(data.toString(), unit);
}

function parseEther(data) {
    return hre.ethers.utils.parseEther(data.toString());
}

function parseUnits(data, unit) {
    return hre.ethers.utils.parseUnits(data.toString(), unit);
}

async function main() {
    const [owner] = await hre.ethers.getSigners();
    const provider = owner.provider;

    const FoodcourtFactory = await hre.ethers.getContractFactory("FoodcourtFactory");
    const foodcourtFactory = await FoodcourtFactory.deploy(owner.address);
    await foodcourtFactory.deployed();
    console.log("FoodcourtFactory deployed to:", foodcourtFactory.address);

    console.log("init code hash: ", await foodcourtFactory.INIT_CODE_PAIR_HASH());

    const WKUB = await hre.ethers.getContractFactory("WKUB");
    const wkub = await WKUB.deploy();
    await wkub.deployed();
    console.log("WKUB deployed to:", wkub.address);

    const FoodcourtRouter = await hre.ethers.getContractFactory("FoodcourtRouter");
    const foodcourtRouter = await FoodcourtRouter.deploy(foodcourtFactory.address, wkub.address);
    await foodcourtRouter.deployed();
    console.log("FoodcourtRouter deployed to:", foodcourtRouter.address);

    const DAI = await hre.ethers.getContractFactory("DAI");
    const dai = await DAI.deploy();
    await dai.deployed();
    console.log("DAI deployed to:", dai.address);

    console.log("DAI of owner: ", await dai.balanceOf(owner.address).then(formatEther));
    await dai.mint(parseEther(2000));
    console.log("DAI of owner: ", await dai.balanceOf(owner.address).then(formatEther)); // 2000

    const deadline = Math.floor((new Date().valueOf() + INTERVAL) / 1000);

    console.log("Current KUB: ", await provider.getBalance(owner.address).then(formatEther)) // x

    await dai.approve(foodcourtRouter.address, parseEther(1000));

    // KUB-DAI 100:1000
    console.log("=== Add liquidity ===")
    await foodcourtRouter.addLiquidityETH(dai.address, parseEther(1000), parseEther(990), parseEther(100), owner.address, deadline, { value: parseEther(100) });

    console.log("DAI of owner: ", await dai.balanceOf(owner.address).then(formatEther)); // 1000
    console.log("Current KUB: ", await provider.getBalance(owner.address).then(formatEther)); // x - 100 - gas

    // Swap 1 KUB -> 10 DAI
    console.log("=== SWAP ===")
    await foodcourtRouter.swapExactETHForTokens(parseEther(9), [wkub.address, dai.address], owner.address, deadline + INTERVAL, { value: parseEther(1) })

    console.log("DAI of owner: ", await dai.balanceOf(owner.address).then(formatEther)); //  1010
    console.log("Current KUB: ", await provider.getBalance(owner.address).then(formatEther)); //  x - 10 - gas - 1
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
