import { Injectable } from '@angular/core';

//var fs = require('fs');

@Injectable({
  providedIn: 'root'
})
export class DatastorageService {
    jsonData = {};

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
    // WriteData() {
    //     fs.writeFile("ClientData.txt", this.jsonData, function(err) {
    //         if (err) {
    //             console.log(err);
    //         }
    //     });
    // }
}
