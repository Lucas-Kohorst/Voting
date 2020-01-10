var express = require("express");
const fs = require("fs");
const solc = require("solc");
const Web3 = require("web3");

// Connect to Infura Node
const web3 = new Web3(
    new Web3.providers.HttpProvider(
        "https://ropsten.infura.io/v3/f1dbd564c9354aa1a1bebfa903d37932"
    )
);

var app = express();
app.use(express.static("public"));

app.get("/", function(request, response) {
    response.sendFile("index.html", { root: __dirname });
});

app.get('/contract', function(req, res) {
    let source = fs.readFileSync('contracts/Voting.sol', 'utf8');
    let compiledContract = solc.compile(source, 1);
    let abi = compiledContract.contracts[':Voting'].interface;
    let bytecode = compiledContract.contracts[':Voting'].bytecode;
    let gasEstimate = web3.eth.estimateGas({ data: '0x' + bytecode });

    res.json({
        abi: abi,
        gasEstimate: gasEstimate,
        bytecode: bytecode,
    });

})

var PORT = process.env.PORT || 8080;

app.listen(PORT, function() {
    console.log("Running on http://127.0.0.1:" + PORT);
});