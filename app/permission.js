

/*Permission List
isAdmin
canView         //View Server
canManage       //Stop/Stop server
canEdit         //Edit server settings
canViewConsole  //View Server Console
*/
class permission{
    
    constructor(handle,userID){
        this.handler = handle;
        this.userID = userID;
        
        this.permissions = {};
        
        var self = this;
        this.handler.database.select("*","permissions WHERE userid="+userID,function(results,fields){
            for(var i =0;i<results.length;i++){
                var r = results[i];
                self.permissions[r.type] = r;
            }
        });
    }
    
}

module.exports = permission;