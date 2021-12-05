import { formatEther, parseEther } from "@ethersproject/units";
import { constants } from "ethers";
import { ethers } from "hardhat";
import { BlockSwapPair__factory } from "../../typechain";
import timeUtils from "../../utils/timeUtils";

async function main() {
    const [signer] = await ethers.getSigners();

    const BlockSwapFactory = await ethers.getContractFactory('BlockSwapFactory');
    const factory = await BlockSwapFactory.deploy(signer.address);

    console.log(`Init code hash: `, await factory.INIT_CODE_PAIR_HASH());

    const WKUB = await ethers.getContractFactory('WKUB');
    const wkub = await WKUB.deploy();

    const BlockSwapRouter = await ethers.getContractFactory('BlockSwapRouter');
    const router = await BlockSwapRouter.deploy(factory.address, wkub.address);

    const Token = await ethers.getContractFactory('MintableToken');
    const usdt = await Token.deploy("USD Tether", "USDT");
    const usdc = await Token.deploy("USD coin", "USDC");


    await usdt.mint(signer.address, parseEther('1000000'));
    await usdc.mint(signer.address, parseEther('1000000'));

    await usdt.approve(router.address, constants.MaxUint256);
    await usdc.approve(router.address, constants.MaxUint256);

    const deadline = timeUtils.now() + timeUtils.duration.minutes(20);

    const amountIn = parseEther('100');
    const amountInETH = parseEther('1');

    await router.addLiquidityETH(usdt.address, amountIn, '0', '0', signer.address, deadline, { value: amountInETH });

    const usdtETHPairAddr = await factory.getPair(wkub.address, usdt.address);
    const usdtETHPair = BlockSwapPair__factory.connect(usdtETHPairAddr, signer);

    console.log(`Added USDT-ETH liquidity: `, await usdtETHPair.balanceOf(signer.address).then(res => formatEther(res)));

    await router.addLiquidity(usdt.address, usdc.address, amountIn, amountIn, '0', '0', signer.address, deadline);

    const usdtUSDCPairAddr = await factory.getPair(usdt.address, usdc.address);
    const usdtUSDCPair = BlockSwapPair__factory.connect(usdtUSDCPairAddr, signer);

    console.log(`Added USDT-USDC liquidity: `, await usdtUSDCPair.balanceOf(signer.address).then(res => res.toString()));

    console.log(`Before swap ETH to USDT: `, await usdt.balanceOf(signer.address).then(res => formatEther(res)))

    const swapETHInput = parseEther('0.1');
    await router.swapExactETHForTokens(0, [wkub.address, usdt.address], signer.address, deadline, { value: swapETHInput });

    console.log(`After swap ETH to USDT: `, await usdt.balanceOf(signer.address).then(res => formatEther(res)))

    console.log(`Before swap USDC to USDT: `, await usdt.balanceOf(signer.address).then(res => formatEther(res)))

    const swapUSDCInput = parseEther('1');
    await router.swapExactTokensForTokens(swapUSDCInput, 0, [usdc.address, usdt.address], signer.address, deadline);

    console.log(`After swap USDC to USDT: `, await usdt.balanceOf(signer.address).then(res => formatEther(res)))

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
