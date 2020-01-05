pragma solidity ^0.4.6; //We have to specify what version of compiler this code will use

contract ConvertBytes32 {

function getBytes32ArrayForInput() pure public returns (bytes32[3] b32Arr) {
    b32Arr = [bytes32("Ethan"), bytes32("Hector"), bytes32("Sergio")];
}

}