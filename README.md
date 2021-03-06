# Basic Voting dApp
### Adapted from [madrona-labs](https://github.com/madrona-labs/voting)

Voting on the Ethereum. 
Using Web3.js 0.x (I would like to upgrade to Solidity 0.6 and Web3.js 1.0)

### Features
- Vote for Candidates
- Load a new Poll via Smart Contract Address
- Create a new Poll

## Usage
Deploy ```Voting.sol``` to Ethereum via [Remix](https://remix.ethereum.org/) or on a local private chain like [Ganache](https://www.trufflesuite.com/ganache)

Copy the ABI and paste it into line 12 in ```contract.js```
Copy the address of the Voting.sol smart contract and paste it into line 6 of ```contract.js```

Build and Run!

```
npm i && npm start
```

## Deploying the contract with Remix
You can create your own contracts within the dApp by entering who you want in the election and pressing "Create" the transaction hash and contract hash will be outputted so that you can use them

However if you want to deploy the ```Voting.sol``` contract in remix yourself follow these steps

When you are deploying the ```Voting.sol``` smart contract you will have to enter the candidates in a bytes32 array. [Here](https://ethereum.stackexchange.com/questions/50310/how-to-pass-the-value-in-bytes32-array) is a helpful answer on how to incorporate the translation in a smart contract (possible future improvement). You can hardcode the values you want to translate. After deploying and running the contract inspect the output. You should see something like this

```
CALL
[call]from:0x8a70cccf7a84fbb97e8c9154b43ea96470c6dc9cto:ConvertBytes32.getBytes32ArrayForInput()data:0x006...5f9b5
 transaction hash 	call0x8a70cccf7a84fbb97e8c9154b43ea96470c6dc9c0xC4cAb4cc9dBb2ecce1Eac1C65FC78346a8d92A1C0x0065f9b5
 from 	0x8a70cccf7a84fbb97e8c9154b43ea96470c6dc9c
 to 	ConvertBytes32.getBytes32ArrayForInput() 0xC4cAb4cc9dBb2ecce1Eac1C65FC78346a8d92A1C
 hash 	call0x8a70cccf7a84fbb97e8c9154b43ea96470c6dc9c0xC4cAb4cc9dBb2ecce1Eac1C65FC78346a8d92A1C0x0065f9b5
 input 	0x006...5f9b5
 decoded input 	{}
 decoded output 	{
	"0": "bytes32[3]: b32Arr 0x457468616e000000000000000000000000000000000000000000000000000000,0x486563746f720000000000000000000000000000000000000000000000000000,0x53657267696f0000000000000000000000000000000000000000000000000000"
}
 logs 	[]
```

Copy the decoded output and format it so it looks like

```
["0x457468616e000000000000000000000000000000000000000000000000000000,0x486563746f720000000000000000000000000000000000000000000000000000,0x53657267696f0000000000000000000000000000000000000000000000000000"]
```

**this byte32[] is "Ethan", "Hector", "Sergio"**

Bytes are used instead of Strings to save on space which saves on gas costs

### Resources
[github.com/ethereum/wiki/wiki/JavaScript-API#web3ethcontract](https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethcontract)
