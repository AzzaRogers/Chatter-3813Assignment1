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

    // input vars
    loginUsername = "";

    constructor(private socketService: SocketService, private dataService: DatastorageService) { }

    ngOnInit(): void {
        console.log("isLoggedIn: " + this.isLoggedIn);
        console.log("currentUser: " + JSON.stringify(this.currentUser));
        this.isLoggedIn = this.dataService.GetItem("isLoggedIn");
        this.currentUser = JSON.parse(this.dataService.GetItem("currentUser"));
        if (this.currentUser != null) {
            this.isLoggedIn = true;
            console.log("    1: " + JSON.stringify(this.currentUser));
            console.log("    1: " + this.isLoggedIn);
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

    }
}
