const fs = require('fs');
const EnergyToken = artifacts.require("EnergyToken")

module.exports = function (deployer) {
  const address = fs.readFileSync('./contract.addr/EnergyTokenData', 'utf8').toString().trim();
  deployer.deploy(EnergyToken, address)
    .then(function () {
      fs.writeFileSync('./contract.addr/EnergyToken', EnergyToken.address)
    })
}
