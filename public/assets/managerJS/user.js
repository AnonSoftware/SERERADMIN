        socket.on("authenticateRequest",function(){
            if(_GET['page']){
                if(_GET['page'] != "login" && _GET['page'] != "register"){
                    showPage("login",{page:"login"});
                }
            }else{
                showPage("login",{page:"login"});
            }
        });
        
        
        registerNotification("authed",function(data){
            setCookie("sessionID",data.sessionID);
            showPage("servers",{page:"servers"});
        },true);
        
        
        
        
        function authenticate(){
            var user = document.getElementById("login_username").value;
            var pass = document.getElementById("login_pass").value;
            socket.emit("auth",{username:user,password:pass});
        }
        
        function register(){
            var user = document.getElementById("register_username").value;
            var pass = document.getElementById("register_pass").value;
            var eml = document.getElementById("register_email").value;
            socket.emit("register",{username:user,password:pass,email:eml});
        }
        
        function cookieAuth(){
            var cookie = getCookie("sessionID");
            if(cookie != "" && cookie != null){
                socket.emit("auth",{cookie:cookie});
            }
        }
        
        cookieAuth();