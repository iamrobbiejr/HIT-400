// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 <0.9.0;


contract User {
    mapping(address => uint) private addressToIndex;
    mapping(bytes32 => uint) private nameToIndex;
    mapping(bytes32 => uint) private emailToIndex;

    address[] private addresses;
    bytes32[] private names;
    bytes32[] private emails;
    bytes32[] private passwords;
    bytes32[] private roles;


    constructor () public {

        // mappings are virtually initialized to zero values so we need to "waste" the first element of the arrays
        // instead of wasting it we use it to create a user for the contract itself
        addresses.push(msg.sender);
        names.push('MCAZ');
        emails.push('admin@example.com');
        passwords.push('123456');
        roles.push('admin');


    }

    function hasUser(address userAddress) public view returns(bool hasIndeed)
    {
        return (addressToIndex[userAddress] > 0 || userAddress == addresses[addressToIndex[userAddress]]);
    }

    function nameTaken(bytes32 name) public view returns(bool takenIndeed)
    {
        return (nameToIndex[name] > 0 || name == 'MCAZ');
    }

    function emailTaken(bytes32 email) public view returns(bool takenIndeed)
    {
        return (emailToIndex[email] > 0 || email == 'admin@example.com');
    }

    function createUser(bytes32 name,bytes32 email, bytes32 password,bytes32 role ) public returns(bool success)
    {
//        require(hasUser(msg.sender));

        if(!nameTaken(name) && !emailTaken(email)){
            addresses.push(msg.sender);
            names.push(name);
            emails.push(email);
            passwords.push(password);
            roles.push(role);


            addressToIndex[msg.sender] = addresses.length - 1;
            nameToIndex[name] = names.length - 1;
            emailToIndex[email] = emails.length-1;

            return true;
        }

        return false;
    }

    function updateUser(bytes32 password) public returns(bool success)
    {
        require(hasUser(msg.sender));

        passwords[addressToIndex[msg.sender]] = password;
        return true;
    }

    function getUserCount() public view returns(uint count)
    {
        return addresses.length;
    }


    // get by index
    function getUserByIndex(uint index) public view returns(address userAddress, bytes32 name,bytes32 email,bytes32 role,bytes32 password) {
        require(index < addresses.length);

        return(addresses[index], names[index], emails[index], roles[index],passwords[index]);
    }

    function getAddressByIndex(uint index) public view returns(address userAddress)
    {
        require(index < addresses.length);

        return addresses[index];
    }

    function getNameByIndex(uint index) public view returns(bytes32 name)
    {
        require(index < addresses.length);

        return names[index];
    }



    // get by address
    function getUserByAddress(address userAddress) public view returns(uint index, bytes32 name) {
        require(index < addresses.length);

        return(addressToIndex[userAddress], names[addressToIndex[userAddress]]);
    }

    function getIndexByAddress(address userAddress) public view returns(uint index)
    {
        require(hasUser(userAddress));

        return addressToIndex[userAddress];
    }

    function getNameByAddress(address userAddress) public view returns(bytes32 name)
    {
        require(hasUser(userAddress));

        return names[addressToIndex[userAddress]];
    }



    // get by name
    function getUserByName(bytes32 name) public view returns(uint index, address userAddress) {
        require(index < addresses.length);

        return(nameToIndex[name], addresses[nameToIndex[name]]);
    }

    function getIndexByName(bytes32 name) public view returns(uint index)
    {
        require(nameTaken(name));

        return nameToIndex[name];
    }

    function getAddressByName(bytes32 name) public view returns(address userAddress)
    {
        require(nameTaken(name));

        return addresses[nameToIndex[name]];
    }



    // get by email
    function getUserByEmail(bytes32 email) public view returns(int index, address userAddress,bytes32 name,bytes32 password,bytes32 role) {
       // require(index < addresses.length);
        if(email == emails[emailToIndex[email]]){
                    return
                    (
                    int(emailToIndex[email]), addresses[emailToIndex[email]],
                    names[emailToIndex[email]], passwords[emailToIndex[email]],
                    roles[emailToIndex[email]]
                    );
        }
        else
        {
        return (-1, addresses[emailToIndex[email]],
                                    names[emailToIndex[email]], passwords[emailToIndex[email]],
                                    roles[emailToIndex[email]]);
        }

    }

    function getIndexByEmail(bytes32 email) public view returns(uint index)
    {
        require(emailTaken(email));

        return emailToIndex[email];
    }

    function getAddressByEmail(bytes32 email) public view returns(address userAddress)
    {
        require(emailTaken(email));

        return addresses[emailToIndex[email]];
    }


}