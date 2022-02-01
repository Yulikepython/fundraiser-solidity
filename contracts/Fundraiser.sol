// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.9.0;

contract Fundraiser {
    string public name;
    string public url;
    string public imageURL;
    string public description;
    address payable public beneficiary; //受取人
    address public custodian;

    constructor (
        string memory _name,
        string memory _url,
        string memory _imageURL,
        string memory _description,
        address payable _beneficiary,
        address _custodian
        ) public {
        name = _name;
        url = _url;
        imageURL = _imageURL;
        description = _description;
        beneficiary = _beneficiary;
        custodian = _custodian;
    }
}