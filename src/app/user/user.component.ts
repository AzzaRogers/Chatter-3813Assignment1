import { Component, OnInit } from '@angular/core';
import { SocketService } from "../services/socket.service"
import { DatastorageService } from "../services/datastorage.service"

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
    // User Variables
    isLoggedIn;
    currentUser;

    ErrorMessage = "";

    // input vars
    loginUsername:string = "";
    newUserName:string = "";
    newUserEmail:string = "";
    newUserRole:string = "";
    newGroupName:string = "";

    userToAdd:string = "";
    addToGroup:string = "";

    userToDelete:string = "";

    newRoomName:string = "";

    constructor(private socketService: SocketService, private dataService: DatastorageService) { }

    ngOnInit(): void {
        this.isLoggedIn = this.dataService.GetItem("isLoggedIn");
        this.currentUser = JSON.parse(this.dataService.GetItem("currentUser"));        
        if (this.currentUser != null) {
            this.dataService.GetValidRooms(this.currentUser.name);
            this.isLoggedIn = true;
            if(this.currentUser.role == "groupAdmin" || this.currentUser.role == "superAdmin") {
                this.dataService.GetUserList();
                this.dataService.GetGroupList();
            }
        } 
    }

    login() {
        if (this.loginUsername) {
            this.socketService.ReqLogin(this.loginUsername);
            this.socketService.GetLogin((res) => {                
                this.currentUser = res
                console.log("current: " + JSON.stringify(this.currentUser));
                if (this.currentUser == "BadLogin") {
                    alert("Invalid Username, please try again");

                } else {
                    console.log(this.currentUser.loggedIn);
                    if (this.currentUser.loggedIn == false) {
                        this.isLoggedIn = true;
                        this.dataService.SetItem("isLoggedIn",this.isLoggedIn);
                        this.dataService.SetItem("currentUser",JSON.stringify(this.currentUser));
                        console.log("ID: " + this.socketService.GetID())
                        this.dataService.GetGroupList();
                        window.location.reload();
                    } else {
                        alert("This user is already Loggedin")
                    }
                }
            });

        } else {
            alert("Please enter a username.");
        }
    }
    Logout(){
        this.socketService.UserLogout(this.currentUser.name);
        this.isLoggedIn = false;
        this.currentUser = [];
        this.dataService.RemoveItem("isLoggedIn");
        this.dataService.RemoveItem("currentUser");
        window.location.reload();
    }

    CreateUser() {
        var newUser = {name: this.newUserName, email: this.newUserEmail, id: "", role: this.newUserRole, loggedIn: false};
        this.socketService.CreateNewUser(newUser);
        this.socketService.ReqError();
        this.socketService.GetError((msg) => {this.ErrorMessage = msg});
        this.dataService.GetUserList();
        this.newUserName= "";
        this.newUserEmail = "";
        this.newUserRole= "";
    }

    CreateGroup() {
        this.socketService.CreateNewGroup(this.newGroupName);
        this.socketService.ReqError();
        this.socketService.GetError((msg) => {this.ErrorMessage = msg});
        this.dataService.GetGroupList();
        this.newGroupName= "";
    }

    AddUserToGroup() {        
        console.log("addtogroup" + this.userToAdd + "    " + this.addToGroup)
        this.socketService.AddUserToGroup(this.userToAdd, this.addToGroup)
        this.socketService.ReqError();
        this.socketService.GetError((msg) => {this.ErrorMessage = msg});
        this.ErrorMessage = "User: " + this.userToAdd + " was added too " + this.addToGroup;
    }

    CreateRoom() {
        
        this.ErrorMessage = "Room: " + this.userToAdd + " was added too " + this.addToGroup;
        console.log("createRoom" + this.userToAdd + "    " + this.addToGroup);

        this.socketService.CreateNewRoom(this.newRoomName, this.addToGroup);

        this.newRoomName = "";
        this.addToGroup = "";

        this.socketService.ReqError();
        this.socketService.GetError((msg) => {this.ErrorMessage = msg});
    }

    DeleteUser() {
        this.socketService.DeleteUser(this.userToDelete)
        this.socketService.ReqError();
        this.socketService.GetError((msg) => {this.ErrorMessage = msg});
    }
}
