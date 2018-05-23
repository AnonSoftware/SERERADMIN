


class server{
    
    constructor(id,name,game,maxPlayers,players,state,path="C:/Users/Shawn/source/repos/ConsoleApp2/ConsoleApp2/bin/Debug/ConsoleApp2.exe",args=[]){
        
        
        this.id = id
        this.name = name;
        this.game = game;
        this.state = state;
        this.maxPlayers = maxPlayers;
        this.players = players;
        this.launchArgs = "";
        
        this.path = path
        this.args = args;
        
        this.procHandle = require("./procManager.js");
        
        this.procManager = null;
        this.consoleList = [];
        this.update = true;
    }
    
    
    processListen(self){
        self.state = 0;
        console.log("Process Closed");
        self.procManager = null;
    }
    
    
    
    start(callbk=null){
        if(this.procManager == null){
            try{
                var self = this;
                this.procManager = new this.procHandle(this.path,this.args);
                
                this.procManager.pipe(function(data){
                    self.consolePipe(self,data);
                });
                
                this.procManager.proc.on("SIGTERM",function(){
                    self.processListen(self);
                });
                this.procManager.proc.on("exit",function(){
                    self.processListen(self);
                });
                
                this.state = 1;
                if(callbk){
                    callbk();
                }
            }catch(error){
                console.log(error);
            }
        }
    }
    
    stop(callbk=null){
        if(this.procManager){
            this.procManager.terminate();
            this.state = 0;
            this.procManager = null;
            if(callbk){
                callbk();
            }
        }
    }
    
    restart(callbk=null){
        this.stop();
        this.start(callbk);
        
    }
    
    
    
    
    registerClient(sock){
        this.consoleList.push(sock);
        //console.log("registerClient");
    }
    
    unregisterClient(sock){
        var idx = this.consoleList.indexOf(sock);
        this.consoleList.splice(idx,1);
    }
    
    consolePipe(self,data){
        //console.log(data);
        for(var i =0; i < self.consoleList.length;i++){
            var c = self.consoleList[i];
            //console.log("Send To Client");
            c.emit("console",{str: data});
        }
    }
    
    consoleInput(data){
        if(this.procManager){
            if(this.procManager.proc){
                this.procManager.proc.stdin.write(data+"\n");
            }
        }
    }
    
}

module.exports = server;