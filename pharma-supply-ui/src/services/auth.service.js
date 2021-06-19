import Web3 from 'web3';
import {auth_abi, auth_contract_address} from "../configs/auth.config";

async function loadBlockchainData() {
    const web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:8545");
    // const network = await web3.eth.net.getNetworkType();
    // const accounts = await web3.eth.getAccounts();
    const auth = new web3.eth.Contract(auth_abi,auth_contract_address);
    console.log(auth);
}

//register function
const register = async (name,email,password,role) => {
    const web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:8545");
    const accounts = await web3.eth.getAccounts();
    const auth = new web3.eth.Contract(auth_abi, auth_contract_address);
    let hexName = web3.utils.asciiToHex(name);
    let hexEmail = web3.utils.asciiToHex(email);
    let hexPassword = web3.utils.asciiToHex(password);
    let hexRole = web3.utils.asciiToHex(role);

    await auth.methods.createUser(hexName,hexEmail,hexPassword,hexRole).send({from: accounts[0]})
        .on('transactionHash', function(hash){
        console.log('hash: ', hash);
        })
        .on('confirmation', function(confirmationNumber, receipt){
            console.log('confirmNumber: ', confirmationNumber);
        })
        .on('receipt', function(receipt) {
            // receipt example
            console.log("receipt: ",receipt);
        })
        .on('error', function(error, receipt) { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
            console.log('error: ' ,error);
        });
};

//login function
const login = async (email,password) => {
    const web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:8545");
    const accounts = await web3.eth.getAccounts();
    const auth = new web3.eth.Contract(auth_abi, auth_contract_address);

    let hexEmail = web3.utils.asciiToHex(email);
    let hexPassword = web3.utils.asciiToHex(password);

    hexEmail = web3.utils.padRight(hexEmail,64);
    hexPassword = web3.utils.padRight(hexPassword,64);

    let user = await auth.methods.getUserByEmail(hexEmail).call({from: accounts[0]});
    console.log("user: ", user);
    let response;



    if(user.index === "-1"){
        response = {
            "success": false,
            "message": "Login failed! User with Email provided not found!"
        }
    }
    else {
        if (user.password === hexPassword)
        {
            let AuthUser = await auth.methods.getUserByIndex(user.index).call({from: accounts[0]});
            let data = {
                "name": web3.utils.hexToUtf8(AuthUser.name),
                "email": web3.utils.hexToUtf8(AuthUser.email),
                "address": AuthUser.userAddress,
                "role": web3.utils.hexToUtf8(AuthUser.role)
            };
            response = {
                "success": true,
                "message": "Login Successful",
                "data": data
            }
            localStorage.setItem('user',JSON.stringify(data));

        }
        else
        {
            response = {
                "success": false,
                "message": "Login failed! Check your password and try again"
            }
        }
    }

    console.log(response);
    return response;
    
};



//logout
const logout = () => {
    localStorage.removeItem('user');
};

//get currentUser
const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};

const getUsers = async () => {
    const web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:8545");
    const accounts = await web3.eth.getAccounts();
    const auth = new web3.eth.Contract(auth_abi, auth_contract_address);

    let UserCount = await auth.methods.getUserCount().call({from: accounts[0]});

    let i;
    let users = [];
    for(i = 1;i < UserCount; i++){
        let User = await auth.methods.getUserByIndex(i).call({from: accounts[0]});
        let data = {
            "name": web3.utils.hexToUtf8(User.name),
            "email": web3.utils.hexToUtf8(User.email),
            "address": User.userAddress,
            "role": web3.utils.hexToUtf8(User.role)
        };
        users.push(data);
    }

    return users;

}

export default {
    register,
    login,
    logout,
    getCurrentUser,
    loadBlockchainData,
    getUsers
};