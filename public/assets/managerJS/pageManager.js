        var pageVars = {};
    
        function registerPage(pageName,func,func2){
            pageVars[pageName] = {show: func,hide:func2};
        }
        function removePage(pageName){
            pageVars[pageName] = null;
        }
        function showPage(page,args){
            window.location.hash = "#page="+page;
            for(var item in pageVars){
                if(item !== page){
                    pageVars[item].hide(args);
                }
            }
            if(pageVars[page]){
                pageVars[page].show(args);
            }
        }
        
        function autoPage(page,args){
            for(var item in pageVars){
                if(item !== page){
                    pageVars[item].hide(args);
                }
            }
            if(pageVars[page]){
                pageVars[page].show(args);
            }
        }
        
        function hideElement(page){
            //console.log("hide->"+page);
            var sidebar = document.getElementById("sidebar_"+page);
            var content = document.getElementById("page_"+page);
            
            sidebar.setAttribute("hidden",true);
            content.setAttribute("hidden",true);
        }
        function showElement(page){
            //console.log("show->"+page);
            var sidebar = document.getElementById("sidebar_"+page);
            var content = document.getElementById("page_"+page);
            
            sidebar.removeAttribute("hidden");
            content.removeAttribute("hidden");
        }
        
        
        
        
        var _GET = {}
        function pagehandler(anchor){
            _GET = getFormat(anchor);
            
            if(_GET['page']){
                var page = _GET['page'];
                autoPage(page,_GET);
                /*
                if(pageVars[page]){
                    pageVars[page](_GET);
                }*/
            }
            
        }
        
        function getFormat(str){
            var _GET = {};
            var tmpGet = str.split("&");
            for(var i = 0; i < tmpGet.length;i++){
                var t = tmpGet[i].split("=");
                _GET[t[0]] = t[1];
            }
            return _GET;
        }
    
        var prevHash = "";
        setInterval(function(){
            if(window.location.hash) {
                var hash = window.location.hash;
                hash = hash.replace("#","");
                if(hash != prevHash){
                    prevHash = hash;
                    pagehandler(hash);
                }
              // Fragment exists
            } else {
              // Fragment doesn't exist
            }
        },50);