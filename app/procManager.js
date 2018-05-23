

var childProc = require('child_process');
var exec = childProc.execFile;

class procManager{
    
    constructor(file,args,errFn = null){
        
        
        try{
            this.proc = exec(file,args,function(err,data){
                if(errFn){
                    errFn(err);
                }
                //console.log(err);
                //console.log(data);
            })
        }catch(error){
            console.log(error);   
        }
        
    }
    
    pipe(callbk){
        if(callbk){
            try{
                this.proc.stdout.on("data",function(data){
                   callbk(data); 
                });
            }catch(error){
                console.log(error);
            }
        }
    }
 

    terminate(){
        this.proc.kill();
    }
    
}


module.exports = procManager;