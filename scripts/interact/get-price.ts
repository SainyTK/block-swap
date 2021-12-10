import { parseEther } from '@ethersproject/units';
import { formatEther } from 'ethers/lib/utils';
import hre, { ethers } from 'hardhat';
import { BlockSwapRouter__factory } from '../../typechain';

// 1 KUB = 8.85 LUMI
// 1 TOMATO = 0.094511063201422919 LUMI
// 1 CORN = 0.020142366435514442 LUMI
// 1 CABBAGE = 0.032899801635557584 LUMI
// TOMATO-KKUB:  0.011116450834153495
// CORN-KKUB:  0.014264849733369121
// CABBAGE-KKUB:  0.011064957287138653

// 1 KUB = 8.85 LUMI
// 1 KUB = 89.9567690191 TOMATO = 8.5019098822 LUMI

async function main() {
    const [owner] = await ethers.getSigners();

    const KKUB = '0x67eBD850304c70d983B2d1b93ea79c7CD6c3F6b5';

    const tokens = {
        LUMI: '0x95013Dcb6A561e6C003AED9C43Fb8B64008aA361',
        TOMATO: '0x9Ea7E0435B5E50e1DCBB8Eacd63F0dbD3003BdAA',
        CORN: '0x4fA393FC50BcDF367145163b920bB37C21e596ec',
        CABBAGE: '0xE3bee928D481b40BB6D0F0EDbfD888a7845CF622',
        TOMATO_SEED: '0xe991151Bf43bD712beAC33e5cFF2580841c9b440',
        CORN_SEED: '0xe27aEbED61Be207E83Fc05fBC408420c737881DA',
        CABBAGE_SEED: '0x1F8B5AF0eC97c44b24366b36C40F2d4ACa2c73e2',
        KUSDT: '0x7d984C24d2499D840eB3b7016077164e15E5faA6',
        KBTC: '	0x726613C4494C60B7dCdeA5BE2846180C1DAfBE8B',
    }

    const Router = '0xab30a29168d792c5e6a54e4bcf1aec926a3b20fa';

    const router = BlockSwapRouter__factory.connect(Router, owner)

    const perms: { names: string[], addresses: string[] }[] = [];

    Object.entries(tokens).forEach(([key1, value1]) => {
        Object.entries(tokens).forEach(([key2, value2]) => {
            if (key1 !== key2) {
                perms.push({
                    names: [key1, key2],
                    addresses: [value1, value2]
                })
            }
        })
    })

    const amountIn = parseEther('1');

    for (let i = 0; i < perms.length; i++) {
        const item = perms[i];
        const { names, addresses } = item;
        try {
            // USDT -> CDS -> BTC -> USDT
            let result = await router.getAmountsOut(amountIn, [KKUB, ...addresses, KKUB]);

            const output = result[result.length - 1];
            const formatIn = formatEther(amountIn);
            const formatOut = formatEther(output);

            const profit = Number(formatOut) - Number(formatIn);
            const percent = profit / Number(formatIn) * 100;

            console.log(`[KKUB, ${names.join(', ')}, KKUB]: ${profit} KKUB (${percent.toFixed(2)}%)`);
            
        } catch (e) {
            console.log(`No route for [KKUB, ${names.join(', ')}, KKUB]`)
        }
    }

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
