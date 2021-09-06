pragma solidity >=0.5.16;

import "./interfaces/IBlockSwapFactory.sol";
import "./interfaces/IBlockSwapPair.sol";
import "./interfaces/IBlockSwapERC20.sol";
import "./interfaces/IERC20.sol";
import "./libraries/SafeMath.sol";
import "./BlockSwapPair.sol";

contract BlockSwapFactory is IBlockSwapFactory {
    bytes32 public override constant INIT_CODE_PAIR_HASH = keccak256(abi.encodePacked(type(BlockSwapPair).creationCode));

    address public override feeTo;
    address public override feeToSetter;

    mapping(address => mapping(address => address)) public override getPair;
    address[] public override allPairs;

    constructor(address _feeToSetter) public {
        feeToSetter = _feeToSetter;
    }

    function allPairsLength() external override view returns (uint) {
        return allPairs.length;
    }

    function createPair(address tokenA, address tokenB) external override returns (address pair) {
        require(tokenA != tokenB, 'BlockSwap: IDENTICAL_ADDRESSES');
        (address token0, address token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        require(token0 != address(0), 'BlockSwap: ZERO_ADDRESS');
        require(getPair[token0][token1] == address(0), 'BlockSwap: PAIR_EXISTS'); // single check is sufficient
        bytes memory bytecode = type(BlockSwapPair).creationCode;
        bytes32 salt = keccak256(abi.encodePacked(token0, token1));
        assembly {
            pair := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }
        IBlockSwapPair(pair).initialize(token0, token1);
        getPair[token0][token1] = pair;
        getPair[token1][token0] = pair; // populate mapping in the reverse direction
        allPairs.push(pair);
        emit PairCreated(token0, token1, pair, allPairs.length);
    }

    function setFeeTo(address _feeTo) external override {
        require(msg.sender == feeToSetter, 'BlockSwap: FORBIDDEN');
        feeTo = _feeTo;
    }

    function setFeeToSetter(address _feeToSetter) external override {
        require(msg.sender == feeToSetter, 'BlockSwap: FORBIDDEN');
        feeToSetter = _feeToSetter;
    }
}