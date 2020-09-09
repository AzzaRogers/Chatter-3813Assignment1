const { Socket } = require("dgram");

module.exports = {
    connect: function (io, PORT) {
        var rooms = [];
        var socketsConnectedToRoom = [];
        var socketsPerRoom = [];

        io.on("connection", (socket) => {
            console.log("connection: " + socket.id);

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

