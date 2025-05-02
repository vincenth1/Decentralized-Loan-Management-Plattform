const hre = require("hardhat");

async function main() {
    const pool = await hre.ethers.deployContract("LiquidityPool");

    await pool.waitForDeployment();

    console.log("LiquidityPool deployed to:", await pool.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
