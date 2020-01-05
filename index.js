var express = require("express");

var app = express();
app.use(express.static("public"));

app.get("/", function(request, response) {
    response.sendFile("index.html", { root: __dirname });
});

var PORT = process.env.PORT || 8080;

app.listen(PORT, function() {
    console.log("Running on http://127.0.0.1:" + PORT);
});
