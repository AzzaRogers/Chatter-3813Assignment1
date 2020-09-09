const express = require("express"); 
const app = express();
const cors = require("cors"); //import the cors package.
const http = require("http").Server(app); 
const io = require("socket.io")(http);

app.use(cors()); // Add cors middleware to the express application

//var bodyParser = require("body-parser");
//app.use(bodyParser.json());
//app.use(express.static(__dirname + "/../dist/Chatter/"));

io.on("connection", (socket) => {
    console.log("connection: " + socket.id);
    socket.on("message",(message) => {
        io.emit("message", message);
    });
});

// Start server, listen to port 3000 and log host, port and date
let server = http.listen(3000, function () {
    let host = server.address().address;
    let port = server.address().port;
    var date = new Date();
    console.log("Server listening on: " + host + " port: " + port + " At: " + date);
});

