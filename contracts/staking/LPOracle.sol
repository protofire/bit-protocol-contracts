// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import "../core/PriceFeed.sol";
import "../staking/TWAPOracle.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

/**
 * @title LP token Oracle
 * @notice Oracle responsible for provide LP price for the DLP staking contract
 */

contract LPOracle {
    using SafeMath for uint;

    address public immutable priceFeed;
    uint256 public constant PRECISION = 1e18;

    TWAPOracle public oracle;
    address public immutable token0;
    address public immutable token1;
    address public immutable ROSE = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;
    address public immutable WrappedROSE;

    constructor(address _priceFeed, TWAPOracle _oracle, address _wrappedROSE) {
        priceFeed = _priceFeed;
        oracle = _oracle;
        token0 = _oracle.token0();
        token1 = _oracle.token1();
        WrappedROSE = _wrappedROSE;
    }

    // NET ASSET VALUE
    function getLPPrice() external view returns (uint price) {
        (uint112 reserve0, uint112 reserve1, ) = oracle.pair().getReserves();
        uint totalSupply = IERC20(address(oracle.pair())).totalSupply();

        uint price1 = oracle.consult(token1, PRECISION);

        uint price0InUsd;
        if (token0 == WrappedROSE) {
            price0InUsd = PriceFeed(priceFeed).loadPrice(ROSE);
        } else {
            price0InUsd = PriceFeed(priceFeed).loadPrice(token0);
        }
        uint price1InUsd = price1.mul(price0InUsd).div(PRECISION);

        uint256 reserve0InUsd = uint256(reserve0).mul(price0InUsd).div(
            PRECISION
        );
        uint256 reserve1InUsd = uint256(reserve1).mul(price1InUsd).div(
            PRECISION
        );

        uint256 totalValueInUsd = reserve0InUsd.add(reserve1InUsd);

        price = totalValueInUsd.mul(PRECISION).div(totalSupply);
    }
}
