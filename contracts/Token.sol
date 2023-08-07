// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.18;

import { UUPSUpgradeable } from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import { ERC20Upgradeable } from "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import { OwnableUpgradeable } from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract Token is UUPSUpgradeable, OwnableUpgradeable, ERC20Upgradeable {
    function initialize(
        string calldata _name,
        string calldata _symbol,
        address _owner,
        uint256 _initialSupply
    ) public initializer {
        __ERC20_init_unchained(_name, _symbol);
        _transferOwnership(_owner);
        _mint(_owner, _initialSupply);
    }

    function _authorizeUpgrade(address) internal view override {
        _checkOwner();
    }
}
