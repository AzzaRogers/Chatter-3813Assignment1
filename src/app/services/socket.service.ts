import { Injectable } from '@angular/core';
import { Observable } from "rxjs";

import * as io from "socket.io-client";
import { nextTick } from 'process';

const SERVER_URL = "http://localhost:3000";

@Injectable({
    providedIn: 'root'
})

export class SocketService {
    private socket;
    constructor() { }

    public InitSocket(): void {
        this.socket = io(SERVER_URL);
    }

    public JoinRoom(selectedRoom) {
        this.socket.emit("joinRoom", selectedRoom);
    }

    public LeaveRoom(selectedRoom) {
        this.socket.emit("leaveRoom", selectedRoom);
    }

    public Joined(callback) {
        this.socket.on("joined", res => callback(res)); 
    }

    public CreateRoom(newRoom) {
        this.socket.emit("newRoom", newRoom);
        
    }

    public ReqNumberOfUsers(selectedRoom) {
        this.socket.emit("numberOfUsers", selectedRoom);
    }

    public GetNumberOfUsers(callback) {
        this.socket.on("numberOfUsers", res => callback(res));
    }

    public RequestRoomList() {
        this.socket.emit("roomList","")
    }

    public GetRoomList(callback) {
        this.socket.on("roomList", res => callback(res));
    }

    public SendMessage(message:string): void {
        this.socket.emit("message",message);
    }

    public GetMessage(callback) {
        this.socket.on("message", res => callback(res));
    }

    // public OnMessage(): Observable<any> {
    //     let observable = new Observable(observer=>{
    //         this.socket.on("message", (data:string) => observer.next(data));
    //     });
    //     return observable;
    // }
}
