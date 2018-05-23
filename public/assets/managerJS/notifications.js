//Notification Manager
        var notificationList = [];

        function registerNotification(headerName,callback,perm=false){
            notificationList.push({header:headerName,callbk:callback,keep:perm});
        }

        function callNotification(headerName,val){
            for(var i = 0; i<notificationList.length;i++){
                var notif =  notificationList[i];
                if(notif.header.toLowerCase() == headerName.toLowerCase()){
                    notif.callbk(val);
                    if(notif.keep == false){
                        notificationList.splice(i,1);
                    }
                }
            }
        }

        socket.on("notification",function(data){
            callNotification(data.header,data.val);
        });