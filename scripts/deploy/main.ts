import { deployFactory } from "./factory";
import { deployRouter } from "./router";

async function main() {
    // await deployFactory();
    await deployRouter();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
