


class session{
    
   
   constructor(){
       
       
       var id = this.makeid();
       
       this.getID = function() { return id; }
       
       this.endTime = (Math.floor(Date.now() / 1000) + (60 * 60));
       
       this.data = {};
       
   }
   
   
   makeid(){
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      for (var i = 0; i < 40; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

      return text;
   }
   

   
}



module.exports = session;