// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract DataStore {
    using EnumerableSet for EnumerableSet.Bytes32Set;
    struct Map {
        EnumerableSet.Bytes32Set _keys;
        mapping(bytes32 => bytes32) _values;
    }

    Map private _map;

    function _set(bytes32 key, bytes32 value) internal returns (bool) {
        _map._values[key] = value;
        return _map._keys.add(key);
    }

    function _at(uint256 index) internal view returns (bytes32, bytes32) {
        bytes32 key = _map._keys.at(index);
        return (key, _map._values[key]);
    }

    function _get(bytes32 key) internal view returns (bytes32) {
        bytes32 value = _map._values[key];
        require(value != 0 || _contains(key), "EnumerableMap: nonexistent key");
        return value;
    }

    function _remove(bytes32 key) internal returns (bool) {
        delete _map._values[key];
        return _map._keys.remove(key);
    }

    function _contains(bytes32 key) internal view returns (bool) {
        return _map._keys.contains(key);
    }

    function _length() internal view returns (uint256) {
        return _map._keys.length();
    }

    function hash(string memory value) internal pure returns (bytes32) {
        return keccak256(abi.encode(value));
    }

    function toBytes32(uint256 value) internal pure returns (bytes32) {
        return bytes32(uint256(value));
    }
}
