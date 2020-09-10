import { Component, OnInit } from '@angular/core';
import { SocketService } from "../services/socket.service"
import { DatastorageService } from "../services/datastorage.service"
import { FormsModule } from "@angular/forms"


@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css']
})

export class ChatComponent implements OnInit {
    ioConnection:any;

    messages:string[] = [];
    isInRoom = false;
    rooms = [];
    currentRoom:string = "";
    numberOfUsers:number = 0;

    selectedRoom:string = "";
    messageContent:string = "";
    newRoomName:string = "";

    isLoggedIn;
    currentUser;

    constructor(private socketService:SocketService, private dataService: DatastorageService) { }

    ngOnInit() {        
        this.initIoConnection();
        this.isLoggedIn = this.dataService.GetItem("isLoggedIn");
        this.currentUser = this.dataService.GetItem("currentUser");
        this.rooms = this.dataService.rooms;
        console.log("ngOnInit chat: " + JSON.stringify(this.dataService.rooms) + " - " + this.rooms);
    }

    

    private initIoConnection() {
        this.socketService.InitSocket();
        this.socketService.GetMessage((msg) => {this.messages.push(msg)});
        //this.socketService.RequestRoomList();
        //this.socketService.GetRoomList((msg) => {this.rooms = JSON.parse(msg)});
        this.rooms = this.dataService.rooms;

        this.socketService.Joined((msg) => {
            this.currentRoom = msg;
            if (this.currentRoom != "") {
                this.isInRoom = true;
            } else {
                this.isInRoom = false;
            }
        })
    }
    public Chat() {
        if (this.messageContent) {
            this.socketService.SendMessage(this.messageContent);
            this.messageContent = null;
        } else {
            console.log("empty chat input");
        }
    }

    JoinRoom() {
        this.socketService.JoinRoom(this.selectedRoom);
        this.socketService.ReqNumberOfUsers(this.selectedRoom);
        this.socketService.GetNumberOfUsers((res)=>(this.numberOfUsers = res));
    }
    LeaveRoom() {
        this.socketService.LeaveRoom(this.currentRoom);
        this.socketService.ReqNumberOfUsers(this.selectedRoom);
        this.socketService.GetNumberOfUsers((res)=>(this.numberOfUsers = res));
        this.currentRoom = "";
        this.selectedRoom = "";
        this.isInRoom = false;
        this.numberOfUsers = 0;
        this.messages = []
    }
    RefreshRooms() {
        this.rooms = this.dataService.rooms;
        console.log("RefreshRooms Chat: " + JSON.stringify(this.dataService.rooms) + " - " + this.rooms);
        window.location.reload();
    }

}
