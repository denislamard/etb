// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract Role is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN");
    bytes32 public constant PRODUCER_ROLE = keccak256("PRODUCER");
    bytes32 public constant CONSUMER_ROLE = keccak256("CONSUMER");
    bytes32 public constant OWNER_ROLE = keccak256("OWNER");

    constructor() {

        _setRoleAdmin(ADMIN_ROLE, ADMIN_ROLE);
        _setupRole(ADMIN_ROLE, _msgSender());

        _setRoleAdmin(PRODUCER_ROLE, ADMIN_ROLE);
        _setRoleAdmin(CONSUMER_ROLE, ADMIN_ROLE);

        _setupRole(PRODUCER_ROLE, _msgSender());
        _setupRole(CONSUMER_ROLE, _msgSender());
    }

    modifier onlyAdmin() {
        require(isAdmin(msg.sender), "Restricted to admins");
        _;
    }

    function isAdmin(address account) public view virtual returns (bool) {
        return hasRole(ADMIN_ROLE, account);
    }

    modifier onlyProducer() {
        require(isProducer(msg.sender), "Restricted to producers");
        _;
    }

    function addAdmin(address account) public virtual onlyAdmin {
        grantRole(ADMIN_ROLE, account);
    }

    function isProducer(address account) public view virtual returns (bool) {
        return hasRole(PRODUCER_ROLE, account);
    }

    function addProducer(address account) public virtual onlyAdmin {
        grantRole(PRODUCER_ROLE, account);
    }

    function removeProducer(address account) public virtual onlyAdmin {
        revokeRole(PRODUCER_ROLE, account);
    }

    modifier onlyConsumer() {
        require(isConsumer(msg.sender), "Restricted to consumers");
        _;
    }

    function isConsumer(address account) public view virtual returns (bool) {
        return hasRole(CONSUMER_ROLE, account);
    }

    function addConsumer(address account) public virtual onlyAdmin {
        grantRole(CONSUMER_ROLE, account);
    }

    function removeConsumer(address account) public virtual onlyAdmin {
        revokeRole(CONSUMER_ROLE, account);
    }
}
