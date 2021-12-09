const fs = require('fs'); // Built-in dependency for file streaming.
const solc = require('solc'); // Our Solidity compiler
// Import the Web3 library at the top of your file
const Web3 = require('web3');

const content = fs.readFileSync('HelloWorld.sol', 'utf-8'); // Read the file...

// Format the input for solc compiler:
const input = {
  language: 'Solidity',
  sources: {
    'HelloWorld.sol' : {
      content, // The imported content
    }
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*']
      }
    }
  }
}; 

const output = JSON.parse(solc.compile(JSON.stringify(input)));

// console.log(output); // Log the result
// Set up a provider
const provider = new Web3.providers.HttpProvider("http://localhost:8545");

// Connect to the network and save it as "web3"
const web3 = new Web3(provider);
// Get the compiled contract's abi (interface)
const { HelloWorld } = output.contracts["HelloWorld.sol"]
const { abi, evm } = HelloWorld // We'll use the "evm" variable later



// Initialize a new contract object:
const contract = new web3.eth.Contract(abi);

// console.log(contract);
const deployAndRunContract = async () => {
  // Get the addresses of Ganache's fake wallet:
  const addresses = await web3.eth.getAccounts();
  
  // Get the current price of gas
  const gasPrice = await web3.eth.getGasPrice();

  // Deploy the HelloWorld contract (its bytecode) 
  // by spending some gas from our first address
  contract.deploy({
    data: evm.bytecode.object,
  })
  .send({
    from: addresses[0],
    gas: 1000000,
    gasPrice,
  })
  .on('confirmation', async (confNumber, receipt) => {
    const { contractAddress } = receipt
    console.log("Deployed at", contractAddress);

    // Get the deployed contract instance:
    const contractInstance = new web3.eth.Contract(abi, contractAddress)

    // Call the "getMyName" function and log the result:
    const myName = await contractInstance.methods.getMyName().call();
    console.log("Result from blockchain:", myName);
  })
  .on('error', (err) => {
    console.log("Failed to deploy:", error) 
  })
}

deployAndRunContract(); // Call the function