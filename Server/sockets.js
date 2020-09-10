const { Socket } = require("dgram");

module.exports = {
    connect: function (io, PORT) {
        var rooms = [];
        var socketsConnectedToRoom = [];
        var socketsPerRoom = [];

        var lastErrorMessage = "";

        users = [{name: "super", email: "super@chatter.com", id: "", role: "superAdmin", loggedIn: false}];

        var groups = [];

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
            
            socket.on("ErrorMessage", () => {
                io.to(socket.id).emit("ErrorMessage", lastErrorMessage);
                if(lastErrorMessage != "") {
                    //console.log("Emitted Error Message" + lastErrorMessage);
                }                                
                lastErrorMessage = "";
            });
            
            socket.on("GetUserList", () => {
                io.emit("GetUserList", users);
                //console.log("Emitted GetUserList" + JSON.stringify(users));
            });

            socket.on("GetGroupList", () => {
                io.to(socket.id).emit("GetGroupList", groups);
                //console.log("Emitted GetUserList" + JSON.stringify(users));
            });
            socket.on("GetTheGroupList", () => {
                io.to(socket.id).emit("GetTheGroupList", groups);
                //console.log("Emitted GetTheUserList" + JSON.stringify(users));
            });

            socket.on("CreateNewGroup", (groupName) => {
                let isValid = true;
                for (i=0; i<groups.length; i++) {
                    if (groups[i].name == groupName) {  
                        isValid = false;     
                        lastErrorMessage = "That Group name is already taken, please try another name";                 
                    }                    
                }
                if (isValid) {
                    console.log("Create New Group: " + groupName);

                    var tgroups = {name: groupName, members: [], rooms: [] };

                    groups.push(tgroups);
                }
            });
            

            socket.on("CreateNewRoom", (roomName, addToGroup) => {                
                for (i=0; i<groups.length; i++) {
                    if (groups[i].name == addToGroup) {                          
                        groups[i].rooms.push(roomName);  
                        rooms.push(roomName);  
                        lastErrorMessage = "Added room: " + roomName + " to group: " + addToGroup;                                         
                    }                    
                }
                console.log("group updated: " + JSON.stringify(groups))
            });

            socket.on("AddUserToGroup", (userName, groupName) => {
                for (i=0; i<groups.length; i++) {
                    if (groups[i].name == groupName) { 
                        let isValid = true;
                        for (j=0; j < groups[i].members.length; j++) {
                            if (groups[i].members[j] == userName) {
                                console.log("User already part of group")
                                lastErrorMessage = userName + " is already part of " + groupName;  
                                isValid = false;                                
                            }
                        } 
                        if(isValid) {
                            groups[i].members.push(userName)
                            console.log("group updated: " + JSON.stringify(groups[i]))
                            break;
                        }
                    }                    
                }
                
            });

            socket.on("CreateNewUser", (user) => {
                let isValid = true;
                for (i=0; i<users.length; i++) {
                    if (users[i].name == user.name) {  
                        isValid = false;     
                        lastErrorMessage = "That user name is already taken, please try another name";                 
                    }                    
                }
                if (isValid) {
                    console.log("Create New User: " + JSON.stringify(user))
                    users.push(user);
                }
            });

            socket.on("DeleteUser", (username) => {
                for (i=0; i<users.length; i++) {
                    if (users[i].name == username) {  
                        console.log("--->"+users[i].LoggedIn)
                        if(users[i].loggedIn) {
                            lastErrorMessage = "User: " + username + "cant be deleted while logged in.";     
                        } else {
                            //delete users[i];
                            users.splice(i,1);
                            console.log("allusers: " + JSON.stringify(users))
                            lastErrorMessage = "User: " + username + " is deleted.";     
                        }
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

