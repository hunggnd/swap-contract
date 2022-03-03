const Swap = artifacts.require("Swap");
const TokenY = artifacts.require("TokenY");
const TokenZ = artifacts.require("TokenZ");


module.exports = async function (deployer) {
  
  await deployer.deploy(TokenY);
  await deployer.deploy(TokenZ);
  await deployer.deploy(Swap);
};
