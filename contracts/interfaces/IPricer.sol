// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.18;

interface IPricer  {
    event SetPrice(int256 oldPrice, int256 newPrice);

    function decimals() external pure returns (uint8);

    function latestRoundData()
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        );

    function setCurrentPrice(int256 _newPrice) external;
}
