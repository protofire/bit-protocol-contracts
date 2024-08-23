// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;

import "./Imports.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

interface ILuminexV1Callee {
    function illuminexV1Call(
        address sender,
        uint amount0,
        uint amount1,
        bytes calldata data
    ) external;
}

interface ILuminexV1Pair {
    event Mint(address sender, uint amount0, uint amount1);
    event Burn(address sender, uint amount0, uint amount1, address to);
    event Swap(
        address sender,
        uint amount0In,
        uint amount1In,
        uint amount0Out,
        uint amount1Out,
        address to
    );
    event Sync(uint112 reserve0, uint112 reserve1);

    function MINIMUM_LIQUIDITY() external pure returns (uint);

    function factory() external view returns (address);

    function token0() external view returns (address);

    function token1() external view returns (address);

    function getReserves()
        external
        view
        returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast);

    function price0CumulativeLast() external view returns (uint);

    function price1CumulativeLast() external view returns (uint);

    function kLast() external view returns (uint);

    function mint(address to) external returns (uint liquidity);

    function burn(address to) external returns (uint amount0, uint amount1);

    function swap(
        uint amount0Out,
        uint amount1Out,
        address to,
        bytes calldata data
    ) external;

    function skim(address to) external;

    function sync() external;

    function initialize(address, address) external;
}

interface ILuminexV1Factory {
    event PairCreated(
        address indexed token0,
        address indexed token1,
        address pair,
        uint
    );

    function feeFreePairs(address pair) external view returns (bool);

    function feeTo() external view returns (address);

    function feeToSetter() external view returns (address);

    function getPair(
        address tokenA,
        address tokenB
    ) external view returns (address pair);

    function allPairs(uint) external view returns (address pair);

    function allPairsLength() external view returns (uint);

    function createPair(
        address tokenA,
        address tokenB
    ) external returns (ILuminexV1Pair pair);

    function setFeeTo(address) external;

    function setFeeToSetter(address) external;
}

contract LuminexV1Factory is ILuminexV1Factory {
    address public feeTo;
    address public feeToSetter;

    mapping(address => bool) public feeFreePairs;

    mapping(address => mapping(address => address)) public getPair;
    address[] public allPairs;

    address public immutable ixToken;

    constructor(address _feeToSetter, address _ixToken) {
        feeToSetter = _feeToSetter;
        ixToken = _ixToken;
    }

    function allPairsLength() external view returns (uint) {
        return allPairs.length;
    }

    function createPair(
        address tokenA,
        address tokenB
    ) external returns (ILuminexV1Pair pair) {
        require(tokenA != tokenB, "LuminexV1: IDENTICAL_ADDRESSES");
        (address token0, address token1) = tokenA < tokenB
            ? (tokenA, tokenB)
            : (tokenB, tokenA);
        require(token0 != address(0), "LuminexV1: ZERO_ADDRESS");
        require(
            getPair[token0][token1] == address(0),
            "LuminexV1: PAIR_EXISTS"
        ); // single check is sufficient

        if (token0 == ixToken || token1 == ixToken) {
            LuminexV1PairIX ixPair = new LuminexV1PairIX(ixToken);
            ixPair.transferOwnership(feeToSetter);

            pair = ixPair;
        } else {
            pair = new LuminexV1Pair();
        }

        pair.initialize(token0, token1);
        getPair[token0][token1] = address(pair);
        getPair[token1][token0] = address(pair); // populate mapping in the reverse direction
        allPairs.push(address(pair));

        emit PairCreated(token0, token1, address(pair), allPairs.length);
    }

    function setPairFeeDisabled(address pair, bool disabled) public {
        require(msg.sender == feeToSetter, "LuminexV1: FORBIDDEN");
        feeFreePairs[pair] = disabled;
    }

    function setFeeTo(address _feeTo) external {
        require(msg.sender == feeToSetter, "LuminexV1: FORBIDDEN");
        feeTo = _feeTo;
    }

    function setFeeToSetter(address _feeToSetter) external {
        require(msg.sender == feeToSetter, "LuminexV1: FORBIDDEN");
        feeToSetter = _feeToSetter;
    }
}
