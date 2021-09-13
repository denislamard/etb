// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

interface IEnergyTokenData {
    function checkOwner(address addr) external;

    function set(string memory key, uint256 value) external returns (bool);

    function get(string memory key) external returns (uint256);

    function contains(string memory key) external returns (bool);

    function length() external view returns (uint256);
}
