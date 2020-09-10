# Chatter

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.1.0.

This project is a web app that was made for University Assignment. The goal of the project was to make a simple chat app with a specific set of Functionality.

## Development server

To Run the client webapp use `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
TO Run the server use npm run start:dev, this will also start nodemon.

## Documention - Git
The github repo is a single branch that has had functionality added each commit. Only functioning changes were saved and commited. A bottom up approach was used in the devolopment of this web app.

## Documention - Data Structures
The webapp makes use of two services:
	1. A data service that handles the clients storage. It also handles logic for channel lists, this is because all the information needed to produce a filtered channel list was already present in the data service.
	2. A socket Service that handles sockets/data transmission. This service makes use of socket.io to communicate with all clients. Namespaces could be used here to improve code readability, but due to time restrictions these were not implemented. 

## Documention - Angular Architecture 
The web app makes use of the previously mentioned services as well as two components. These two components are used to control the chat and user functionality.
	1. app-chat: controls and displays all of the functionality needed for chatting. If is the simpler of the two as most of the functionality of the web app is used to control users.
	2. app-users: controls and displays all of the functionality needed for user interactions. This includes logging in and out, creating and deleting users, creating and controlling groups and channels.


## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
