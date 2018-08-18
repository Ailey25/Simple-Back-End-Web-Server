# Simple Back-End Web Server

A simple backend server that accepts http requests and performs different actions based on endpoints

`Node.js` `TypeScript` `Hapi.js`

### File manipulation
- File name: storage.txt

###### /write
- POST method
[//]: # (end list)
Accepts data (string) in the form of a POST request and writes the string to the end of file

###### /read
- GET method
[//]: # (end list)
Displays the content of the file

###### /delete/{number}
- DELETE method
[//]: # (end list)
Deletes text at line number `number` from the file and returns `{success: true}` if successful and `{success: false}` if line number is outside of valid range

### To run the repository
- Clone and download the repository
- In the command line, type `npm install` to install the dependencies
- In the command line, type `npm run startServer` to run the project 
