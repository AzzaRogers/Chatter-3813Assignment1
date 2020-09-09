import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatComponent } from './chat/chat.component';
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { SocketService } from "./services/socket.service";
import { Router } from "@angular/router";

@NgModule({
    declarations: [
        AppComponent,
        ChatComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        CommonModule
    ],
    providers: [SocketService],
    bootstrap: [AppComponent]
})
export class AppModule { }
