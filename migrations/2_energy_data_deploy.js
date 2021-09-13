const fs = require('fs');
const EnergyTokenData = artifacts.require("EnergyTokenData")

module.exports = function (deployer) {
    deployer.deploy(EnergyTokenData)
        .then(function () {
            fs.writeFileSync('./contract.addr/EnergyTokenData', EnergyTokenData.address)
        })
}
