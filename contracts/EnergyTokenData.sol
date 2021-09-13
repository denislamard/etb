// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "./DataStore.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EnergyTokenData is DataStore, Ownable {
    bool private _initialized;
    address private _contract;

    constructor() {
        _set(hash("BASE_PRICE"), toBytes32(0.163 ether));
        _set(hash("COEFFICIENT"), toBytes32(0.001 ether));
        _set(hash("MIN_PRICE"), toBytes32(0.05 ether));
        _set(hash("MARKUP"), toBytes32(0.03 ether));

        _set(hash("PRODUCED"), toBytes32(0));
        _set(hash("CONSUMED"), toBytes32(0));
    }

    modifier initialized() {
        require(_initialized, "StoreData has not be initialized");
        _;
    }

    modifier checkSender() {
        require(
            _msgSender() == _contract || _msgSender() == owner(),
            "sender is not authorized"
        );
        _;
    }

    function checkOwner(address addr) public {
        require(owner() == addr);
        _contract = _msgSender();
        _initialized = true;
    }

    function set(string memory key, uint256 value)
        public
        initialized()
        checkSender()
        returns (bool)
    {
        return _set(hash(key), bytes32(value));
    }

    function get(string memory key)
        public
        view
        initialized()
        checkSender()
        returns (uint256)
    {
        return uint256(_get(hash(key)));
    }

    function contains(string memory key)
        public
        view
        initialized()
        checkSender()
        returns (bool)
    {
        return _contains(hash(key));
    }

    function length()
        public
        view
        initialized()
        checkSender()
        returns (uint256)
    {
        return _length();
    }
}
