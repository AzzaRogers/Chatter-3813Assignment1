import { Injectable } from '@angular/core';
import { SocketService } from "../services/socket.service"

@Injectable({
  providedIn: 'root'
})
export class DatastorageService {
    jsonData = {};
    users = [];
    groups = [];
    rooms = [];

    constructor(private socketService: SocketService) { }

    public GetUserList() {
        this.socketService.ReqUserList();
        this.socketService.GetUserList((msg) => {this.users = msg});
        console.log("users: " + JSON.stringify(this.users))
    }

    public GetGroupList() {
        this.socketService.ReqGroupList();
        this.socketService.GetGroupList((msg) => {this.groups = msg});
        console.log("groups: " + JSON.stringify(this.groups))
    }

    public GetValidRooms(userName) {
        this.socketService.ReqTheGroupList();
        console.log("Getting Valid Rooms for " + userName);
        this.socketService.GetTheGroupList((msg) => {
            this.groups = msg

            for (let i=0; i<this.groups.length; i++) {

                console.log("-----checking group: " + this.groups[i].name + " - " + i);

                for (let j=0; j<this.groups[i].members.length; j++) {

                    console.log("checking member: " + this.groups[i].members[j] + " against " + userName + " - " + i);

                    if(this.groups[i].members[j] == userName) {
                        for (let k=0; k<this.groups[i].rooms.length; k++) {
                            let isValid = true;
                            for (let l=0; l<this.rooms.length; l++) {
                                console.log("another check: " + this.rooms[l] + " against " + this.groups[i].rooms[k])
                                if (this.rooms[l] == this.groups[i].rooms[k]) {
                                    let isValid = false;
                                    
                                    console.log("already there")
                                } else {

                                }                               
                            }
                            if (isValid) {
                                this.rooms.push(this.groups[i].rooms[k]);
                            }
                        }
                        
                        console.log("updated rooms: " + JSON.stringify(this.rooms))
                    }
                }
            }
            console.log("valid rooms: " + JSON.stringify(this.rooms));
        });
        

    }

    SetItem(key, value) {
        if (typeof(Storage) !== "undefined") {
            localStorage.setItem(key, value);
        } else {
            console.log("Storage Undefined");
        }
    }

    GetItem(key) {
        if (typeof(Storage) !== "undefined") {
            return localStorage.getItem(key);
        } else {
            console.log("Storage Undefined");
        }
    }
    RemoveItem(key) {
        if (typeof(Storage) !== "undefined") {
            return localStorage.removeItem(key);
        } else {
            console.log("Storage Undefined");
        }     
    }

}
