import { Component, OnInit } from '@angular/core';
import { SocketService } from "../services/socket.service"
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

    constructor(private socketService:SocketService) { }

    ngOnInit() {        
        this.initIoConnection();
    }

    private initIoConnection() {
        this.socketService.InitSocket();
        this.socketService.GetMessage((msg) => {this.messages.push(msg)});
        this.socketService.RequestRoomList();
        this.socketService.GetRoomList((msg) => {this.rooms = JSON.parse(msg)});
        this.socketService.Joined((msg) => {
            this.currentRoom = msg;
            if (this.currentRoom != "") {
                this.isInRoom = true;
            } else {
                this.isInRoom = false;
            }
        })


        // this.ioConnection = this.socketService.OnMessage().subscribe((message:string) => {
        //     this.messages.push(message);
        // });
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
    CreateRoom() {
        this.socketService.CreateRoom(this.newRoomName);
        this.socketService.RequestRoomList();
        this.newRoomName = "";
    }

}
