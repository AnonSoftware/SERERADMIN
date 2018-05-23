


class handler{
    
    
    
    constructor(serverClass,sessionClass,database){
        this.server = serverClass;
        this.session = sessionClass;
        this.database = database;
        
        //handleVars
        this.servers = [];
        this.sessions = {};
        var self = this;
        this.database.con.query("SELECT * FROM servers",function(error,result,fields){
            if(error){
                console.log(error);
                return;
            }
            for(var i = 0; i < result.length;i++){
                var s = result[i];
                self.add_server(s);
            }
        });
        
        
        var updateTimer = setInterval(function(){
            self.update_servers();
        },500);
        
        
        var updateServers = setInterval(function(){
            self.update_servers_force();
        },10*1000);
    }
    
    
    update_servers_force(){
        var self = this;
        //console.log("Updateing All Server Data");
        for(var i = 0; i < this.servers.length;i++){
            var s = this.servers[i];
            this.edit_server_mysql(s);
        }
    }
    
    update_servers(){
        var self = this;
        for(var i = 0; i < this.servers.length;i++){
            var s = this.servers[i];
            if(s.update === true){
                s.update = false;
                this.server_query_db(s.id,function(result){
                    result = result[0];
                    s.name = result.name;
                    s.players = result.players;
                    s.maxPlayers = result.maxPlayers;
                    s.state = result.state;
                    s.game = result.game;
                });
            }
        }
    }
    
    server_query_db(serverID,callbk=null){
        this.database.con.query("SELECT * FROM servers WHERE id="+serverID,function(error,result,fields){
            if(error){
                console.log(error);
                return;
            }
            
            if(callbk){
                callbk(result);
            }
            
        });
    }
    /*
        Server Class Handler
    */
    add_server(mysql_result){
        if(mysql_result.id != null && mysql_result.name != null, mysql_result.game != null){
            if(this.get_server(mysql_result.id) == null){
                var newServer = new this.server(mysql_result.id,mysql_result.name,mysql_result.game,mysql_result.maxPlayers,mysql_result.players,mysql_result.state);
                this.servers.push(newServer);
            }
        }
    }
    
    remove_server(id){
        if(typeof id == int){//Server ID
            var serv = this.get_server(id);
            if(serv == null){
                return;
            }
        }
    }
    
    start_server(id){
        if(typeof id == int){//Server ID
            var serv = this.get_server(id);
            if(serv == null){
                return;
            }
            serv.start();
        }
    }
    
    stop_server(id){
        if(typeof id == int){//Server ID
            var serv = this.get_server(id);
            if(serv == null){
                return;
            }
            serv.stop();
        }
    }
    
    restart_server(id){
        if(typeof id == int){//Server ID
            var serv = this.get_server(id);
            if(serv == null){
                return;
            }
            serv.restart();
        }
    }
    
    get_server(id){
            for(var i = 0; i < this.servers.length;i++){
                var serv = this.servers[i];
                if(serv.id == id){
                    return serv;
                }
            }
        return null;
    }
    
    edit_server_mysql(data){
        this.database.con.query("UPDATE servers SET name='"+data.name+"', launchargs='"+data.launchArgs+"',maxPlayers="+data.maxPlayers+",state="+data.state+",players="+data.players+",game='"+data.game+"' WHERE id="+data.id,function(err,results,fields){
           if(err){
                console.log(err);
           }           
        });
    }
    
    //End Server Class Handler
 

    /*
    Session Manager
    */
    
    get_session(id){
        if(this.sessions[id] !=null){
            if(this.sessions[id].endTime > Math.floor(Date.now() / 1000)){
                return this.sessions[id];
            }
        }
        return null;
    }
    
    set_session(id,data){
        if(this.sessions[id] != null){
            this.sessions[id].data = data;
        }
    }
    
    set_session_element(id,data_id,data){
        if(this.sessions[id] != null){
            this.sessions[id].data[data_id] = data;
        }
    }
    
    create_session(id,sess){
        this.sessions[id] = sess;
    }
    
    destroy_session(id){
        if(this.sessions[id] != null){
            this.sessions[id] = null;
        }
    }
    
    //end Session Manager
    
    
    
    /*
        user Functions
    */
    
    /*
    Error Codes
    10: Username/Password Incorrect
    12: Multiple Responses
    */
    user_login(user,pass,callbk=null){
        this.database.con.query("SELECT * FROM user WHERE username='"+user+"' AND password='"+pass+"' ",function(error,results,fields){
            if(error){
                connsole.log(error);
                return;
            }
            
            if(results.length > 0){
                if(results.length == 1){
                    if(callbk != null){
                       callbk(null,results,fields);
                    }
                }else{
                    if(callbk != null){
                       callbk(12,null,null);
                    }
                }
            }else{
                if(callbk != null){
                   callbk(10,null,null);
                }
            }
            
        });
    }
    
    user_register(username,password,email){
        
    }
    
    perm_set(type,perms){
        
    }
    
    
    
    console_register_user(sock,serverID){
        
    }
    console_unregister_user(sock){
        
    }
    
}



module.exports = handler;