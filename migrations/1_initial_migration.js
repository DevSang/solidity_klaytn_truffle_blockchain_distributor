const Migrations = artifacts.require("./Migrations.sol");
const LoonGEM = artifacts.require("./token/LoonGEM.sol")

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(LoonGEM, 'Loon GEM', 'GEM', 18);
};
