// Define the contract ABI
var abi = [{
        constant: false,
        inputs: [{
            name: "candidate",
            type: "bytes32"
        }],
        name: "totalVotesFor",
        outputs: [{
            name: "",
            type: "uint8"
        }],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        constant: false,
        inputs: [{
            name: "candidate",
            type: "bytes32"
        }],
        name: "validCandidate",
        outputs: [{
            name: "",
            type: "bool"
        }],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        constant: true,
        inputs: [{
            name: "",
            type: "bytes32"
        }],
        name: "votesReceived",
        outputs: [{
            name: "",
            type: "uint8"
        }],
        payable: false,
        stateMutability: "view",
        type: "function"
    },
    {
        constant: true,
        inputs: [{
            name: "",
            type: "uint256"
        }],
        name: "candidateList",
        outputs: [{
            name: "",
            type: "bytes32"
        }],
        payable: false,
        stateMutability: "view",
        type: "function"
    },
    {
        constant: false,
        inputs: [{
            name: "candidate",
            type: "bytes32"
        }],
        name: "voteForCandidate",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        constant: true,
        inputs: [],
        name: "getCandidateList",
        outputs: [{
            name: "",
            type: "bytes32[]"
        }],
        payable: false,
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [{
            name: "candidateNames",
            type: "bytes32[]"
        }],
        payable: false,
        stateMutability: "nonpayable",
        type: "constructor"
    }
];

// Enabling Web3 in Browser
window.ethereum.enable();
// Base contract addr
var contractAddr = "0xd2BeaCfDBd8A72BE204052E28F89963b9A634035";

// Show the Hash in the console.
console.log("Contract: " + contractAddr);

// Define the contract ABI and Address
var contract = web3.eth
    .contract(abi)
    .at(contractAddr);

// Constants for updating table values
const tableElem = document.getElementById("table-body");
const candidateOptions = document.getElementById("candidate-options");
const voteForm = document.getElementById("vote-form");
const contractForm = document.getElementById("contract-input-btn");
const newContractForm = document.getElementById("create-contract-input-btn");

console.log("-----------------------------------");
console.log("Matching Smart Contract Events");
console.log("-----------------------------------");

getCandidates();

// Getting lists of candidates
function getCandidates() {
    contract.getCandidateList(function(err, res) {
        // Iterating over each canidate
        res.forEach(candidate => {
            const candidateName = web3.toUtf8(candidate);
            console.log("Candidate: " + candidateName);

            // Removing all options before adding new contract's options
            var i;
            for (
                i = candidateOptions.options.length - 1; i >= 0; i--
            ) {
                candidateOptions.remove(i);
            }

            // Getting votes for each canidate and updating table
            contract.votesReceived(candidate, function(
                err,
                res
            ) {
                console.log(
                    "Votes: " + web3.toDecimal(res)
                );
                // Creates a row element.
                var rowElem = document.createElement("tr");

                // Creates a cell element for the name.
                var nameCell = document.createElement(
                    "td"
                );
                nameCell.innerText = candidateName;
                rowElem.appendChild(nameCell);

                // Creates a cell element for the votes.
                var voteCell = document.createElement(
                    "td"
                );
                voteCell.id = "vote-" + candidate;
                voteCell.innerText = web3.toDecimal(res);
                rowElem.appendChild(voteCell);

                // Adds the new row to the voting table.
                tableElem.appendChild(rowElem);

                // Creates an option for each candidate
                var candidateOption = document.createElement(
                    "option"
                );
                candidateOption.value = candidate;
                candidateOption.innerText = candidateName;
                candidateOptions.appendChild(
                    candidateOption
                );
            });
        });
    });
}

// Handles voting for a candidate
function handleVoteForCandidate(evt) {
    console.log("Handling Vote");
    const candidate = new FormData(evt.target).get("candidate");
    contract.voteForCandidate(
        candidate, {
            from: web3.eth.accounts[0]
        },
        function() {
            const votes = contract.votesReceived(candidate, function(err, res) {
                document.getElementById("vote-" + candidate).innerText = votes;
            });
        }
    );
}

// For creating a new contract 
async function createContract() {
    var abi;
    var gasEstimate;
    var bytecode;
    await fetch("/contract")
        .then(response => {
            return response.json();
        })
        .then(json => {
            abi = json.abi
            gasEstimate = json.gasEstimate
            bytecode = json.bytecode
        });

    console.log(abi)
    console.log(gasEstimate)
    console.log(bytecode)

    // Getting candidate values
    var candidates = document.getElementById("input-candidates").value;
    // Stripping spaces
    candidates = candidates.replace(/\s/g, "")
    var candidateList = candidates.split(",")
    console.log(candidateList)

    let contract = web3.eth.contract(JSON.parse(abi));
    contract.new(
        candidateList, {
            from: web3.eth.accounts[0],
            data: "0x" + bytecode,
            gas: gasEstimate + 3000000
        },
        function(err, contract) {
            // Clearing input
            document.getElementById("input-candidates").value = ""
            document.getElementById("input-candidates").placeholder = candidates
            if (!err) {
                // NOTE: The callback will fire twice!
                // Once the contract has the transactionHash property set and once its deployed on an address.
                // e.g. check tx hash on the first call (transaction send)
                if (!contract.address) {
                    console.log(contract.transactionHash); // The hash of the transaction, which deploys the contract

                    var etherscanURL = "https://ropsten.etherscan.io/tx/" + contract.transactionHash
                    document.getElementById("tx-hash").innerHTML =
                        "Transaction Hash: <a href=" + etherscanURL + ">" +
                        contract.transactionHash +
                        "</a>";
                    // check address on the second call (contract deployed)
                } else {
                    console.log(contract.address); // the contract address
                    var etherscanURL =
                        "https://ropsten.etherscan.io/tx/" +
                        contract.transactionHash;
                    document.getElementById("contract-hash").innerHTML =
                        "Contract Hash: <a href=" + etherscanURL + ">" + contract.address + "</a>";
                }
            }
        }
    );
}

// Handles new contract
function handleContractChange() {
    // Removing table body
    tableElem.innerHTML = "";
    // Getting new contract addr
    contractAddr = document.getElementById(
        "contract-input-addr"
    ).value;

    // Creating new contract
    // Define the contract ABI and Address
    contract = web3.eth
        .contract(abi)
        .at(contractAddr);

    console.log(
        "Handling new Contract at " +
        JSON.stringify(contractAddr)
    );
    // Updating placeholder
    document.getElementById(
        "contract-input-addr"
    ).placeholder = contractAddr;
    document.getElementById(
        "contract-input-addr"
    ).value = "";
    getCandidates();
}

// Event Listeners
voteForm.addEventListener("submit", handleVoteForCandidate, false);
contractForm.addEventListener("click", handleContractChange, false);
newContractForm.addEventListener("click", createContract, false);