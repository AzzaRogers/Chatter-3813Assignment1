

var express = require("express"); 
var app = express();
var http = require("http").Server(app); 
var bodyParser = require("body-parser");
var cors = require("cors") //import the cors package.

app.use(cors()); // Add cors middleware to the express application
app.use(bodyParser.json());
app.use(express.static(__dirname + "/../dist/Chatter/"));

// Start server, listen to port 3000 and log host and port
let server = http.listen(3000, function () {
    let host = server.address().address;
    let port = server.address().port;
    var date = new Date();
    console.log("Server listening on: " + host + " port: " + port + " At: " + date);
});


app.get("/test", function (req, res) {
    console.log("/test");
    if (!req.body) {
        return res.sendStatus(400);        
    }

    var user = {}
    user.email = req.body.email;
    user.upwd = req.body.upwd;
    
    res.send(user);
});
