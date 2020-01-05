// Enabling Web3 in Browser
window.ethereum.enable();

// Address of the Voting Contract
// https://ropsten.etherscan.io/address/0xd2BeaCfDBd8A72BE204052E28F89963b9A634035
var addr = "0xd2BeaCfDBd8A72BE204052E28F89963b9A634035";

// Show the Hash in the console.
console.log("Events by Address: " + addr);

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
// Define the contract ABI and Address
var contract = web3.eth
    .contract(abi)
    .at("0x3e3556b06352394E8b56fb86b9d142922946c0f7");

// Constants for updating table values
const tableElem = document.getElementById("table-body");
const candidateOptions = document.getElementById("candidate-options");
const voteForm = document.getElementById("vote-form");

console.log("-----------------------------------");
console.log("Matching Smart Contract Events");
console.log("-----------------------------------");

// Getting lists of candidates
contract.getCandidateList(function(err, res) {
    // Iterating over each canidate
    res.forEach(candidate => {
        const candidateName = web3.toUtf8(candidate);
        console.log("Canidate: " + candidateName);

        // Getting votes for each canidate and updating table
        contract.votesReceived(candidate, function(err, res) {
            console.log("Votes: " + web3.toDecimal(res));
            // Creates a row element.
            var rowElem = document.createElement("tr");

            // Creates a cell element for the name.
            var nameCell = document.createElement("td");
            nameCell.innerText = candidateName;
            rowElem.appendChild(nameCell);

            // Creates a cell element for the votes.
            var voteCell = document.createElement("td");
            voteCell.id = "vote-" + candidate;
            voteCell.innerText = web3.toDecimal(res);
            rowElem.appendChild(voteCell);

            // Adds the new row to the voting table.
            tableElem.appendChild(rowElem);

            // Creates an option for each candidate
            var candidateOption = document.createElement("option");
            candidateOption.value = candidate;
            candidateOption.innerText = candidateName;
            candidateOptions.appendChild(candidateOption);
        });
    });
});

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

voteForm.addEventListener("submit", handleVoteForCandidate, false);