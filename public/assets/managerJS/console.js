        function consoleRegister(servID){
            console.log("Register");
            document.getElementById("console-view").innerHTML = "";
            socket.emit("console_register",{id:servID});
        }
        
        function consoleUnregister(servID){
            socket.emit("console_unregister",{id:servID});
        }
        
        
        function console_input(svID,txt){
            socket.emit("console_input",{id:svID,text:txt});
        }
        
        
        
        socket.on("console",function(data){
            console.log(data);
            document.getElementById("console-view").innerHTML += "<p> "+data.str+" </p>";
        });