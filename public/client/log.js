function jCatchListener(){var user_id=function(){for(var scripts=document.querySelectorAll("script[src]"),user_id=null,i=0;i<scripts.length;i++)if(-1!==scripts[0].src.indexOf("jcatch.io")){var script_src=scripts[0].src;user_id=decodeURIComponent(script_src.replace(new RegExp("^(?:.*[&\\?]"+encodeURIComponent("u").replace(/[\.\+\*]/g,"\\$&")+"(?:\\=([^&]*))?)?.*$","i"),"$1"));break}return user_id}(),_domain=window.location.hostname,_token=null,_errors=[],_api=null,_endpoints={log:"http://jcatch.io/api/log/add/",auth:"http://jcatch.io/api/auth/"},_queue=[];function jCatchAPI(credentials){function log(_err){(function(){for(var token=null,cookies=decodeURIComponent(document.cookie).split(";"),i=0;i<cookies.length;i++){for(var c=cookies[i];" "==c.charAt(0);)c=c.substring(1);0==c.indexOf("_jcatch_=")&&(token=c.substring("_jcatch_=".length,c.length))}return token})()?_ajax(function(res){console.log(res)},_err):_queue.push(_err)}function _ajax(callback,data,url,method){url=url||_endpoints.log,method=method||"POST",data=data||null;var xhr=new XMLHttpRequest;xhr.onreadystatechange=function(){if(4===this.readyState&&200==this.status)return callback(this.response)},xhr.open(method,url,!0),xhr.setRequestHeader("Content-Type","application/json; charset=UTF-8"),"POST"===method&&"string"!=typeof data&&(data=JSON.stringify({user:user_id,domain:_domain,error:data.error})),xhr.send(data)}return _ajax(function(res){var _res=JSON.parse(res);_token=_res.token;var date=new Date;date.setTime(date.getTime()+864e5);var expires="expires="+date.toUTCString();document.cookie="_jcatch_="+_token+";"+expires+";path=/",_queue.length&&_queue.forEach(function(_err){log(_err),delete _queue[_err]})},credentials,_endpoints.auth),{log:log}}!function(){if(!user_id)return console.log("jCatch ERROR: user id not set");window.addEventListener("error",function(error){!function(event){var client=function(mode,keys){mode=mode||"",keys=keys||{};var defaults=["userAgent"],nav=window.navigator,client={};switch(mode){case"all":for(var key in nav)client[key]=nav[key];break;default:for(var i=0,size=defaults.length;i<size;i++)defaults[i]in nav&&(client[defaults[i]]=nav[defaults[i]])}return client}(),error_data={eid:_errors.length,error:{url:event.filepath,line:event.lineno,column:event.colno,message:event.message,file:event.filename,time:(new Date).getTime(),client:{userAgent:client.userAgent,cookie:!0}}};if(_errors.push(error_data),!_api){console.log(_endpoints.auth);var credentials={user:user_id,domain:_domain};_api=new jCatchAPI(credentials)}_api.log(error_data)}(error)})}()}jCatchListener();