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

    public GetID() {
        return this.socket.id;
    }
    constructor() { }

    // TODO: change user and chat functionality to namespaces for easy of use and understandability


    //
    //  User
    //  
    public ReqLogin(username) {
        this.socket.emit("login", username);
        console.log("Login Request emited with username: " + username);
    }

    public GetLogin(callback) {
        console.log("Login Request recieved");
        this.socket.on("login", res => callback(res));
    }

    public UserLogout(username) {
        this.socket.emit("Logout", username);
        console.log("Logout username: " + username);
    }

    public CreateNewUser(user) {
        this.socket.emit("CreateNewUser", user);
        console.log("CreateNewUser emitted: " + JSON.stringify(user));
    }

    public DeleteUser(username) {
        this.socket.emit("DeleteUser", username);
        console.log("Delete User emitted: " + JSON.stringify(username));
    }

    public CreateNewGroup(groupName) {
        this.socket.emit("CreateNewGroup", groupName);
        console.log("CreateNewGroup emitted: " + groupName);
    }
    public CreateNewRoom(newRoomName, addToGroup){ 
        this.socket.emit("CreateNewRoom", newRoomName, addToGroup);
        console.log("CreateNewRoom emitted: " + newRoomName + "  -  " + addToGroup);
    }

    public AddUserToGroup(userName, groupName) {
        this.socket.emit("AddUserToGroup", userName, groupName);
    }

    public ReqGroupList() {
        this.socket.emit("GetGroupList", "");
    }

    public GetGroupList(callback) {
        this.socket.on("GetGroupList", res => callback(res));
    }
    
    public ReqTheGroupList() {
        this.socket.emit("GetTheGroupList", "");
    }
    public GetTheGroupList(callback) {
        this.socket.on("GetTheGroupList", res => callback(res));
    }
    public ReqUserList() {
        this.socket.emit("GetUserList", "");
    }

    public GetUserList(callback) {
        this.socket.on("GetUserList", res => callback(res));
    }
    
    public ReqError() {
        this.socket.emit("ErrorMessage", "");
    }

    public GetError(callback) {
        this.socket.on("ErrorMessage", res => callback(res));
    }
    //
    //  Chat
    //
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
