// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "./Role.sol";
import "./IEnergyTokenData.sol";

contract EnergyToken is ERC20, Role, Ownable {
    using Address for address;

    IEnergyTokenData private _energyData;

    uint256 private _coef;
    uint256 private _minPrice;
    uint256 private _markup;

    uint256 private _basePriceKWh;
    uint256 private _produced;
    uint256 private _consumed;

    constructor(address AddressEnergyData)
        ERC20("Energy Token on blockchain", "ETB")
        Role()
    {
        _energyData = IEnergyTokenData(AddressEnergyData);
        try _energyData.checkOwner(msg.sender) {
            updateData();
            _mint(address(this), 1000 ether);
        } catch {
            revert("invalid contract address of EnergyData");
        }
    }

    function updateData() public onlyAdmin {
        _basePriceKWh = _energyData.get("BASE_PRICE");
        _coef = _energyData.get("COEFFICIENT");
        _minPrice = _energyData.get("MIN_PRICE");
        _markup = _energyData.get("MARKUP");
        _produced = _energyData.get("PRODUCED");
        _consumed = _energyData.get("CONSUMED");
    }

    function buyToken(address account, uint256 amount) public onlyAdmin {
        require(amount > 0, "amount must be greater than 0");
        this.transfer(account, amount);
    }

    function getproducedPriceKWh() public view returns (uint256) {
        int256 delta = calcDeltaPrice();
        if ((int256(_basePriceKWh - _markup) + delta) > int256(_minPrice)) {
            return uint256(int256(_basePriceKWh - _markup) + delta);
        }
        return _minPrice;
    }

    function getconsumedPriceKWh() public view returns (uint256) {
        int256 delta = calcDeltaPrice();
        if ((int256(_basePriceKWh) + delta) > int256(_minPrice + _markup)) {
            return uint256(int256(_basePriceKWh) + delta);
        }
        return _minPrice + _markup;
    }

    function produce(uint256 kw) public onlyProducer {
        require(kw > 0, "amount must be greater than 0");
        this.transfer(msg.sender, getproducedPriceKWh() * kw);
        _produced += kw;
        _energyData.set("PRODUCED", _produced);
    }

    function consume(uint256 kw) public onlyConsumer {
        require(kw > 0, "amount must be greater than 0");
        require(_produced >= kw, "not enough energy produced");
        this.transferFrom(
            msg.sender,
            address(this),
            getconsumedPriceKWh() * kw
        );
        _consumed += kw;
        _energyData.set("CONSUMED", _consumed);
    }

    function producedKW() public view onlyAdmin returns (uint256) {
        return _produced;
    }

    function consumedKW() public view onlyAdmin returns (uint256) {
        return _consumed;
    }

    function calcDeltaPrice() private view returns (int256) {
        return
            (
                ((int256(_consumed * 1 ether) - int256(_produced * 1 ether)) *
                    int256(_coef))
            ) / 1 ether;
    }
}
