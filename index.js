var express = require("express");

var socket = require("socket.io");

var app = express();

var server = app.listen(81,function(){
   console.log("Server listener started");   
});

app.use(express.static("public"));


var io = socket(server);


//Imports
var mysql = require("mysql");
var dataBase = require("./app/database.js");
var permission = require("./app/permission.js");
var user = require("./app/user.js");
var server = require("./app/server.js");
var session = require("./app/sessions.js");
var handler = require("./app/handler.js");
//end Imports




var connection = mysql.createConnection({
    host     :      "localhost",
    user     :      "anon",
    password :      "streetdance3d",
    database :      "serveradmin"
});

connection.connect(function(err){
    if(err){
        console.log(err);
        return;
    }
});

dataBase = new dataBase(connection);


var handle = new handler(server,session,dataBase);



//User Interaction

var connected_users = [];

function user_connected(handle,sock){
    var newUsr = new user(handle,sock);
    connected_users.push(newUsr);
}

function user_disconnect(sock){
    for(var i = 0; i < connected_users.length;i++){
        var usr = connected_users[i];
        if(usr.sock.id === sock.id){
            usr.disconnect();
            connected_users.splice(i,1);
        }
    }
}





io.on("connection",function(sock){
    
    user_connected(handle,sock);
    
    
    sock.on("disconnect",function(){
        user_disconnect(sock);
    });
    
});


//end User Interaction