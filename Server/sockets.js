const { Socket } = require("dgram");

module.exports = {
    connect: function (io, PORT) {
        var rooms = [];
        var socketsConnectedToRoom = [];
        var socketsPerRoom = [];

        users = [{name: "super", email: "super@chatter.com", id: "", role: "superAdmin", loggedIn: false}];

        io.on("connection", (socket) => {
            console.log("connection: " + socket.id);

            //
            //  User
            //
            socket.on("login", (username) => {
                validLogin = false;
                console.log("Login attempt by " + username)
                for (i=0; i<users.length; i++) {
                    if (users[i].name == username) {      
                        console.log(" Already Logged in?: " + users[i].loggedIn)                  
                        users[i].id = socket.id;
                        console.log("Emitted: " + JSON.stringify(users[i]))                        
                        io.to(socket.id).emit("login", users[i]);
                        users[i].loggedIn = true;
                        console.log(username + " has logged in with an ID of: " + socket.id);
                        validLogin = true;                        
                    }                    
                }
                if (validLogin == false) {
                    console.log("bad Login");
                    io.emit("login", "BadLogin");
                }
            });

            socket.on("Logout", (username) => {
                for (i=0; i<users.length; i++) {
                    if (users[i].name == username) {                        
                        users[i].id = "";
                        users[i].loggedIn = false;
                        console.log(username + " has logged out");
                    
                    }                    
                }
            });

            //
            //  Chat
            //

            socket.on("message", (message) => {
                for (i=0; i<socketsConnectedToRoom.length; i++) {
                    if (socketsConnectedToRoom[i][0] == socket.id) {
                        io.to(socketsConnectedToRoom[i][1]).emit("message", message);
                        console.log("socket: " + socket.id + " has sent message: " + message);
                    }
                }
            });

            socket.on("newRoom", (newRoom) => {
                if (rooms.indexOf(newRoom) == -1) {
                    rooms.push(newRoom);
                    io.emit("roomList",JSON.stringify(rooms));
                    console.log(newRoom + " was added.");
                }
            });

            socket.on("roomList", (unUsed) => {
                io.emit("roomList", JSON.stringify(rooms));
                console.log("Room List emitted: " + JSON.stringify(rooms));
            });

            socket.on("numberOfUsers", (room) => {
                var userCount = 0;
                for (i=0; i<socketsConnectedToRoom.length; i++) {
                    
                    if (socketsConnectedToRoom[i][1] == room) {
                        userCount++;
                    }
                }

                io.in(room).emit("numberOfUsers", userCount);
                console.log("Emitted " + userCount +  " number of users for room: " + room)
            });

            socket.on("joinRoom", (room) => {
                if(rooms.includes(room)) {
                    socket.join(room, () => {
                        var isAlreadyInRoom = false;
                        for (i=0; i<socketsConnectedToRoom.length; i++) {
                            if (socketsConnectedToRoom[i][0] == socket.id) {
                                socketsConnectedToRoom[i][1] = room;
                                isAlreadyInRoom = true;
                            }
                        }

                        if (isAlreadyInRoom == false) {
                            socketsConnectedToRoom.push([socket.id, room]);
                            console.log(socketsConnectedToRoom);
                            var isRoomCounted = false;


                        }
                        console.log("User(socket): " + socket.id + " has joined room: " + room + ".");
                    });
                    return io.in(room).emit("joined", room);
                }
            });

            socket.on("leaveRoom", (room) => {
                for (i=0; i<socketsConnectedToRoom.length; i++) {
                    if (socketsConnectedToRoom[i][0] == socket.id) {
                        socketsConnectedToRoom.splice(i,1);
                        socket.leave(room);
                        console.log("User(socket): " + socket.id + " has left room: " + room + ".");
                    }
                }

            });

            socket.on("disconnect", () => {
                io.emit("disconnect");
                for (i=0; i<socketsConnectedToRoom.length; i++) {
                    if (socketsConnectedToRoom[i][0] == socket.id) {
                        socketsConnectedToRoom.splice(i,1);
                    }
                }

                console.log("Client Disconnected.")
            });
        });
    }
}

