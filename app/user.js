


class user{
    
    constructor(handle,_sock){
        
        var session = require("./sessions.js");
        
        this.handler = handle;
        this.sock = _sock;
        this.authenticated = false;
        this.session = new session();;
        this.handler.create_session(this.session.getID(),this.session);
        
        this.permissions = null;
        
        
        
        
        
        var self = this;
        this.sock.on("auth",function(data){
            self.authenticate(data,self);
        });
        this.sock.on("request_server",function(data){
            self.serverRequest(data,self);
        });
        this.sock.on("request_serverlist",function(data){
            self.serverList(data,self);
        });
        this.sock.on("server_change_state",function(data){
            self.changeServerState(data,self);
        });
        this.sock.on("server_edit_settings",function(data){
            self.editServer(data,self);
        });
        
        
        this.sock.on("console_register",function(data){
            self.console_register(self,data);
        });
        
        this.sock.on("console_unregister",function(data){
            self.console_unregister(self,data);
        });
        
        this.sock.on("console_input",function(data){
           self.console_Input(data); 
        });
        
        
        this.sock.on("register_user",function(data){
            self.register_user(data);
        });
        
        
        
        var timer = setInterval(function(){
            if(self.authenticated === false){
                self.sock.emit("authenticateRequest");
            }else{
                clearInterval(timer);
            }
        },1000);
            
           
        
    }
    
    hasPermission(type){
        console.log(this.permissions.permissions[type]);
        return this.permissions.permissions[type];
    }
    
    console_register(self,data){
        var s = self.handler.get_server(data.id);
        //console.log(data);
        if(s){
            s.registerClient(self.sock);
        }
    }
    
    console_unregister(self,data){
        var s = self.handler.get_server(data.id);
        
        if(s){
            s.unregisterClient(self.sock);
        }
    }
    
    console_Input(data){
        if(this.authenticated){
            var sID = data.id;
            var inputText = data.text;
            var serv = this.handler.get_server(sID);
            
            if(serv){
                serv.consoleInput(inputText);
            }
        }
    }
    
    
    //Authenticate
    authenticate(data,self){
        
        if(self.authenticated === false){
            var pem = require("./permission.js");
            if(data.cookie != null){
                //load up session data
                var ses = self.handler.get_session(data.cookie);
                
                if(ses != null){
                    self.session = ses;
                    
                    
                    if(self.session.data.userData != null){
                        self.authenticated = true;
                        
                        self.permissions = new pem(self.handler,self.session.data.userData.id);
                        var sesid = self.session.getID();
                        self.sendNotification("authed",{auth: self.authenticated,sessionID:sesid});
                    }
                }
            }else{
                //attempt login
                
                //query DB for Username + Password
                self.handler.user_login(data.username,data.password,function(error,results,fields){
                    if(error){
                        console.log(error);
                        return;
                    }
                    
                    if(results.length > 0){
                        results = results[0];
                        self.authenticated = true;
                        self.session.data["userData"] = results;
                        var sesid = self.session.getID();
                        self.permissions = new pem(self.handler,results.id);
                        self.sendNotification("authed",{auth: self.authenticated,sessionID:sesid});
                    }
                    
                });
                
                
            }
            //console.log(self.permissions);
        }
    }//end Authenticate
    
    
    register_user(data){
        var usrName  =   data.username;
        var pass     =   data.passwd;
        var email    =   data.email;
    }
    
    
    
    /*
    Change Server State
    0: Stop Server
    1: Start Server
    2: Restart Server
    */
    changeServerState(data,self){
        if(self.authenticated === true){
            var serverID = data.id;
            var state = data.state;
            //console.log(data);
            
                var isAdminServ = 0;
                var canEditServ = 0;
                
                
                if(self.permissions.permissions[serverID]){
                    isAdminServ = self.permissions.permissions[serverID].isAdmin;
                    canEditServ = self.permissions.permissions[serverID].canManage;
                }
                
                if(self.permissions.permissions["global"].isAdmin || self.permissions.permissions["global"].canManage || isAdminServ || canEditServ){
                    console.log("Perms");
                    if(state === 0){ //ShutDown
                        var serv =  self.handler.get_server(serverID);
                        serv.stop(function(){
                            self.sendServerDetails(serv);
                        });
                    }else if(state === 1){ //Start
                        var serv =  self.handler.get_server(serverID);
                        serv.start(function(){
                            self.sendServerDetails(serv);
                        });
                    }else if(state === 2){ //Restart
                        var serv =  self.handler.get_server(serverID);
                        serv.restart();
                    }
                }
        }
    }//end ChangeServerState
    
    
    
    /*
    Edit serevr settings
    Name: (string)
    Player Count: (int)
    Map: (string)
    Game: (int)
    */
    editServer(data,self){
        if(this.authenticated === true){
            var servId = data.id;
            var serv = self.handler.get_server(servId);
            
            if(serv){
                var isAdminServ = 0;
                var canEditServ = 0;
                
                
                if(self.permissions.permissions[servId]){
                    isAdminServ = self.permissions.permissions[servId].isAdmin;
                    canEditServ = self.permissions.permissions[servId].canEdit;
                }
                
                if(self.permissions.permissions["global"].isAdmin || self.permissions.permissions["global"].canEdit || isAdminServ || canEditServ){
            
                    serv.maxPlayers = data.maxPlayers;
                    serv.name = data.name;
                    serv.launchArgs = data.launchArgs;
                    serv.game = data.game;
                }
            }
            
            
        }
    }//end editServer
    
    
    sendServerDetails(s){
        if(s != null){
                    var newServ ={};
                    newServ.name = s.name;
                    newServ.state = s.state;
                    newServ.id =s.id;
                    newServ.game= s.game;
                    newServ.maxPlayers = s.maxPlayers;
                    newServ.players = s.players;
                    newServ.launchArgs = s.launchArgs;
            
                    this.sendNotification("serverData",newServ);
        }
    }
    
    serverRequest(data,self){
        if(self.authenticated === true){
            //handle request
            var s = self.handler.get_server(data.id);
            
            
                var isAdminServ = 0;
                var canViewServ = 0;
                
                
                if(self.permissions.permissions[s.id]){
                    isAdminServ = self.permissions.permissions[s.id].isAdmin;
                    canViewServ = self.permissions.permissions[s.id].canView;
                }
                
                if(self.permissions.permissions["global"].isAdmin || self.permissions.permissions["global"].canView || isAdminServ || canViewServ){
                    /*
                    var newServ ={};
                    newServ.name = s.name;
                    newServ.state = s.state;
                    newServ.id =s.id;
                    newServ.game= s.game;
                    newServ.maxPlayers = s.maxPlayers;
                    newServ.players = s.players;
                    newServ.launchArgs = s.launchArgs;
            
                    self.sendNotification("serverData",newServ);*/
                    
                    self.sendServerDetails(s);
                }
        }
        
    }//end serverRequest
    
    serverList(data,self){
        if(self.authenticated === true){
            //handle request
            //console.log("serevr list");
            
            
            
            
            
            var servs = self.handler.servers;
            
            
            var servFormat = [];
            
            for(var i = 0;i< servs.length; i++){
                var s = servs[i];
                
                var isAdminServ = 0;
                var canViewServ = 0;
                
                
                if(self.permissions.permissions[s.id]){
                    isAdminServ = self.permissions.permissions[s.id].isAdmin;
                    canViewServ = self.permissions.permissions[s.id].canView;
                }
                
                if(self.permissions.permissions["global"].isAdmin || self.permissions.permissions["global"].canView || isAdminServ || canViewServ){
                    
                    var newServ ={};
                    newServ.name = s.name;
                    newServ.state = s.state;
                    newServ.id =s.id;
                    newServ.game= s.game;
                    newServ.maxPlayers = s.maxPlayers;
                    newServ.players = s.players;
                    newServ.launchArgs = s.launchArgs;
                    servFormat.push(newServ);
                }
            }
            
            
            self.sendNotification("serverlist",servFormat);
        }
    }
    
    
    
    
    
    
    sendNotification(head,data){
        this.sock.emit("notification",{header:head,val:data});
    }
    
    
    
    disconnect(){
        if(this.authenticated == true){
            //handle request
        }
    }
    
}

module.exports = user;