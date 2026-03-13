const fs = require("fs");
const path = require("path");
const hre = require("hardhat");

async function main() {
  const { ethers, network } = hre;
  const [deployer, logger] = await ethers.getSigners();

  console.log(`Network: ${network.name}`);
  console.log(`Deployer: ${deployer.address}`);
  console.log(`Logger: ${logger.address}`);

  const DocumentStorage = await ethers.getContractFactory("DocumentStorage");
  const documentStorage = await DocumentStorage.deploy();
  await documentStorage.deployed();

  const AnalyticsAuditLog = await ethers.getContractFactory("AnalyticsAuditLog");
  const analyticsAuditLog = await AnalyticsAuditLog.deploy(logger.address);
  await analyticsAuditLog.deployed();

  const deployment = {
    network: network.name,
    timestamp: new Date().toISOString(),
    deployer: deployer.address,
    loggerAddress: logger.address,
    documentStorage: documentStorage.address,
    analyticsAuditLog: analyticsAuditLog.address,
  };

  const outDir = path.join(__dirname, "..", "deployments");
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, `${network.name}.mvp.json`);
  fs.writeFileSync(outFile, JSON.stringify(deployment, null, 2), "utf8");

  console.log("\nMVP deployment complete:");
  console.log(JSON.stringify(deployment, null, 2));
  console.log(`\nSaved: ${outFile}`);

  console.log("\nUse these backend env vars (PowerShell):");
  console.log(`$env:DOCUMENT_STORAGE_ADDRESS="${documentStorage.address}"`);
  console.log(`$env:ANALYTICS_AUDIT_LOG_ADDRESS="${analyticsAuditLog.address}"`);
  console.log('$env:EVM_RPC_URL="http://127.0.0.1:8545"');
  console.log('$env:ANALYTICS_LOGGER_PRIVATE_KEY="<paste logger private key from hardhat node output>"');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
