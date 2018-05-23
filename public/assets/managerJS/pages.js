registerPage("home",function(_GET){
            var page = "home";
            showElement(page);
            
        },function(_GET){
            var page = "home";
            //console.log(page);
            hideElement(page);
        });
        
        
        registerPage("servers",function(_GET){
            var page = "servers";
            request_servers();
            showElement(page);
        },function(_GET){
            var page = "servers";
            //console.log(page);
            hideElement(page);
        });
        
        registerPage("serveredit",function(_GET){
            var page = "serveredit";
            showElement(page);
            //console.log(_GET);
            var servUsers = document.getElementById("servereditUsers");
            servUsers.href = "#page=serveruser&server="+_GET['server']+"&users=list";
            request_server_data(_GET['server']);
            
            var con = document.getElementById("servereditConsole");
            con.href = "#page=console&server="+_GET['server'];
            
            
        },function(_GET){
            var page = "serveredit";
            //console.log(page);
            hideElement(page);
            
        });
        
        registerPage("users",function(_GET){
            var page = "users";
            showElement(page);
        },function(_GET){
            var page = "users";
            //console.log(page);
            hideElement(page);
        });
        
        
        registerPage("serveruser",function(_GET){
            var page = "serveruser";
            showElement(page);
        },function(_GET){
            var page = "serveruser";
            //console.log(page);
            hideElement(page);
        });
        
        registerPage("login",function(_GET){
            var page = "login";
            showElement(page);
        },function(_GET){
            var page = "login";
            //console.log(page);
            hideElement(page);
        });
        
        registerPage("register",function(_GET){
            var page = "register";
            showElement(page);
        },function(_GET){
            var page = "register";
            //console.log(page);
            hideElement(page);
        });
        
        var consoleID =0;
        registerPage("console",function(_GET){
            var page = "console";
            showElement(page);
            consoleRegister(_GET['server']);
            consoleID = _GET['server'];
        },function(_GET){
            var page = "console";
            //console.log(page);
            hideElement(page);
            consoleUnregister(consoleID);
        });