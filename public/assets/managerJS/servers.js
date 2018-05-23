        function clearServerList(){
            var serverList = document.getElementById("servers");
            serverList.innerHTML = "";
        }
        function createServerCard(serverid,serverName,game,status,players,maxPlayers){
        
            var html = '<a href="#page=serveredit&server='+serverid+'">'+ 
                            '<div class="well well-sm row servercard" style="margin:5px;">'+
                            
                                '<div class="col-md-4">'+
                                   '<p> ' + serverName + ' </p>'+
                                '</div>'+
                                
                                '<div class="col-md-4">'+
                                '</div>'+
                                
                                '<div class="col-md-1">'+
                                    '<p>' + game + '</p>'+
                                '</div>'+
                                
                                '<div class="col-md-1">'+
                                '</div>'+
                                
                                '<div class="col-md-1 '+status+'">'+
                                    '<p> ' + status + ' </p>'+
                                '</div>'+
                                
                                '<div class="col-md-1">'+
                                    '<p> ' + players + '/' + maxPlayers + ' </p>'+
                                '</div>'+
                            
                            '</div>'+
                    '   </a>';
                    
            var serverList = document.getElementById("servers");
            serverList.innerHTML += html;
        
        }
        
        clearServerList();
        createServerCard(1,"★ ZARPGAMING.COM - Murder ","Gmod","Online","0","42");
        createServerCard(2,"★ ZARPGAMING.COM - DarkRP Server 1 ","Gmod","Online","27","128");
        
        
        
        
        
        
        
        
        
        
        
         registerNotification("serverlist",function(data){
            //console.log(data);
            //createServerCard(2,"★ ZARPGAMING.COM - DarkRP Server 1 ","Gmod","Online","27","128");
            clearServerList();
            for(var i = 0; i < data.length; i++){
                var s = data[i];
                //console.log(s);
                
                var name = s.name;
                var game = s.game;
                var players = s.players;
                var maxPlayers = s.maxPlayers;
                var id = s.id;
                var state = "Online";
                if(s.state != 1){
                    state = "Offline";
                }
                
                createServerCard(id,name,game,state,players,maxPlayers);
            }
            
        },true);
        
        registerNotification("serverData",function(data){
            console.log(data);
            
            var name = document.getElementById("edit_name");
            var maxPlayers = document.getElementById("edit_maxplayers");
            var players = document.getElementById("edit_players");
            var state = document.getElementById("edit_state");
            var game = document.getElementById("edit_game");
            var idSer= document.getElementById("serverid");
            
            maxPlayers.value = data.maxPlayers;
            name.value = data.name;
            players.innerHTML = data.players+"/"+data.maxPlayers;
            game.value = data.game;
            idSer.value = data.id;
            
            var stateStr = "Online";
            
            if(data.state != 1){
                stateStr = "Offline";
            }
            
            state.innerHTML = stateStr;
            state.className = stateStr
            
        },true);
        
        
        
        
        
        function request_server_data(serverID){
            console.log(serverID);
            socket.emit("request_server",{id:serverID});
        }
        
        function request_servers(){
            socket.emit("request_serverlist",{});
        }
        
        function changeServerState(serverID,state){
            socket.emit("server_change_state",{id:serverID,state:state});
        }
        
        function startServer(){
            var serverID = document.getElementById("serverid").value;
            changeServerState(serverID,1);
        }
        
        function stopServer(){
            var serverID = document.getElementById("serverid").value;
            changeServerState(serverID,0);
        }
        
        
        function serverEdit(){
            /*
            get forum data
            */
            
            var serverID = document.getElementById("serverid").value;
            
            var maxPlayers = document.getElementById("edit_maxplayers").value;
            var name = document.getElementById("edit_name").value;
            var launch = document.getElementById("edit_launch").value;
            var game = document.getElementById("edit_game").value;
            
            
            socket.emit("server_edit_settings",{id:serverID,maxPlayers:maxPlayers,name:name,launchArgs:launch,game:game});
        }
        