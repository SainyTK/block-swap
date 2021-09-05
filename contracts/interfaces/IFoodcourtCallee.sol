pragma solidity >=0.5.0;

interface IFoodcourtCallee {
    function foodcourtCall(address sender, uint amount0, uint amount1, bytes calldata data) external;
}