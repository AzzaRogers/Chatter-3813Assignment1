import { Component, OnInit } from '@angular/core';
import { SocketService } from "../services/socket.service"

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
    // User Variables

    isLoggedIn = false;

    currentUser = "";

    // input vars
    loginUsername = "";

    constructor(private socketService: SocketService) { }

    ngOnInit(): void {
    }


    login() {
        if (this.loginUsername) {
            this.socketService.ReqLogin(this.loginUsername);
            this.socketService.GetLogin((res) => {                
                this.currentUser = res
                console.log(this.currentUser);
                if (this.currentUser == "BadLogin") {
                    alert("Invalid Username, please try again");
                } else {
                    this.isLoggedIn = true;
                }
            });

        } else {
            alert("Please enter a username.");
        }
    }
}
