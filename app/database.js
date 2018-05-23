

class db{
    
    constructor(dataBaseCon){
        this.con = dataBaseCon;
    }
    
    select(fields,table,callbk = null){
        this.con.query("SELECT " + fields + " FROM " + table,function(error,results,fields){
            if(error){
                console.log("MYSQL->"+error);
                return;
            }
            if(callbk != null){
                callbk(results,fields);
            }
        });
    }

    insert(table,fields,values,callbk = null){
        this.con.query("INSERT INTO "+table+" ("+fields+") VALUES ("+values+")",function(error,results,fields){
            if(error){
                console.log("MYSQL->"+error);
                return;
            }
            if(callbk != null){
                callbk(results,fields);
            }
        });
    }

    update(table,values,condition,callbk = null){
        this.con.query("UPDATE "+table+" "+values+" WHERE "+condition,function(error,results,fields){
            if(error){
                console.log("MYSQL->"+error);
                return;
            }
            if(callbk != null){
                callbk(results,fields);
            }
        });
    }
    
}


module.exports = db;