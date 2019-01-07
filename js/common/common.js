/**
 * 设置服务器地址
 */
//var serverUrl = "http://PC-20180516EPXK/";//
var serverUrl = "http://192.168.1.254:8091/";  //罗玉波 
//var serverUrl = "http://www.bming.net:8091/";  //正式服域名
//var serverUrl = "http://114.116.88.94:8091/"	//测试服务器
//var serverUrl = "http://PC-20180516EPXK/"	//api
//var serverUrl = "http://123.207.147.134:8091/"	//服务器地址
//var serverUrl = "http://1y74625t01.iok.la:19023/"
//var baseUrl = serverUrl + "f/";

var baseUrl = serverUrl;
//var server = serverUrl +"UpdateBsnLicense";//图片服务器路径
var server = serverUrl;//图片服务器路径
var baseFtp = "";//文件服务器地址
var baseUrlWEB = baseUrl;
var baseUrlAPP = baseUrl;
var baseProJectApp = baseUrl;
/**
 * 防篡改js封装
 * 
 */
var NetUtil = {
    postRequest: function (str_Url, json_Data,sign,fnOnSuccess,fnBefore, fnComplete) {
    	json_Data.sign = sign;
        if (str_Url) {
        	if(mui.os.plus == undefined){
        		mui.ajax({
	                url: baseUrlWEB + str_Url,
				    data: json_Data,
				    async: true,
				    dataType: 'json',
				    type: 'post',
				    timeout: 3000,
				    headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
	                beforeSend: fnBefore,
				    success: fnOnSuccess,
				    error: function (XMLHttpRequest, textStatus, errorThrown) {
	                	if (XMLHttpRequest.status==600||XMLHttpRequest.status==601){
							localStorage.removeItem("memberId");
							localStorage.removeItem("token");
	                		mui.plusReady(function(){
								mui.openWindow({url:"/views/loginRegister/login.html"});
								return false;
							})
	                	}else{
		                	return false;  
	                	}
	                }, 
	                complete:fnComplete
	            });
        	}else{
        		mui.ajax({
	                url: baseUrlAPP + str_Url,
				    data: json_Data,
				    async: true,
				    dataType: 'json',
				    crossDomain: true, //强制使用5+跨域
				    type: 'post',
				    timeout: 3000,
				    headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
	                beforeSend: fnBefore,
				    success: fnOnSuccess,
				    error: function (XMLHttpRequest, textStatus, errorThrown) {
	                	if (XMLHttpRequest.status==600||XMLHttpRequest.status==601){
	                		if(localStorage.memberId!=undefined){
	                			localStorage.removeItem("memberId");
	                		}
	                		if(localStorage.token!=undefined){
	                			localStorage.removeItem("token");
	                		}	
                			mui.plusReady(function(){
                				/*if(plus.webview.getWebviewById('login')==null||plus.webview.getWebviewById('login')==undefined){
                					console.log(1)
                					mui.openWindow({url:"/views/loginRegister/login.html",id:'login'});
									return false;
                				}*/
							})
	                	}else{
		                	return false;  
	                	}
	                }, 
	                complete:fnComplete
	            });
        	}
        } else {
            mui.alert("请求地址无效");
        }
    },
    getRequest: function (str_Url, json_Data,sign,fnOnSuccess,fnBefore, fnComplete) {
    	json_Data.sign = sign;
        if (str_Url) {
        	if(mui.os.plus == undefined){
        		mui.ajax({
	                url: baseUrlWEB + str_Url,
				    data: json_Data,
				    async: true,
				    dataType: 'json',
				    type: 'get',
				    timeout: 3000,
	                beforeSend: fnBefore,
				    success: fnOnSuccess,
				    error: function (XMLHttpRequest, textStatus, errorThrown) {
	                	if (XMLHttpRequest.status==600||XMLHttpRequest.status==601){
							localStorage.removeItem("memberId");
							localStorage.removeItem("token");
	                		mui.plusReady(function(){
								mui.openWindow({url:"/views/loginRegister/login.html"});
							})
	                	}else{
		                	return false;  
	                	}
	                }, 
	                complete:fnComplete
	            });
        	}else{
	            mui.ajax({
	                url: baseUrlAPP + str_Url,
				    data: json_Data,
				    async: true,
				    dataType: 'json',
				    crossDomain: true, //强制使用5+跨域
				    type: 'get',
				    timeout: 3000,
	                beforeSend: fnBefore,
				    success: fnOnSuccess,
				    error: function (XMLHttpRequest, textStatus, errorThrown) {
	                	if (XMLHttpRequest.status==600||XMLHttpRequest.status==601){
							localStorage.removeItem("memberId");
							localStorage.removeItem("token");
	                		mui.plusReady(function(){
								mui.openWindow({url:"/views/loginRegister/login.html"});
							})
	                	}else{
		                	return false;  
	                	}
	                },
	                complete:fnComplete
	            });
        	}
        } else {
            mui.alert("请求地址无效.");
        }
    },
    //创建秘钥
    createSign: function (params) {
        if (params) {
            var code ="";
            var keys = [];
            for (var x in params) {
                keys.push(x);
            }
            keys.sort();
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                code += key;
                if(params[key]!=null){
                	code += params[key];
                }
            }
           
            var md5_value = hex_md5(code).toUpperCase();
            return md5_value;
        }
        return null;
    },
    //签名（复杂算法用）
    signData: function (dataJson) {
        var args =JSON.stringify(dataJson);
        var sign = NetUtil.createSign(args);
        return sign;
    },
    ajax: function (url,data,fnOnSuccess,fnBefore, fnComplete,type) {
    	/*if(url.indexOf("login") != -1 || url.indexOf("register") != -1 || url.indexOf("reset") != -1){
    	}*/
    		data = NetUtil.setToken(data);
//      var sign = NetUtil.signData(data);//复杂算法
      /*  var sign = NetUtil.createSign(data);//简单算法*/
     var sign = '';
		/*data.random = Math.random();*/
        if(type == "undefined" || type == "" || type== undefined){
	        NetUtil.postRequest(url,data,sign, fnOnSuccess,fnBefore, fnComplete);
        }else{
	        NetUtil.getRequest(url,data,sign, fnOnSuccess,fnBefore, fnComplete);
        }
    },
    setToken: function(data){
    	data.check="no";
    	if(localStorage.memberId!=null && localStorage.memberId!=undefined){
    		data.memberId = localStorage.memberId;
    	}
    	if(localStorage.token!=null || localStorage.token!=undefined){
    		data.token = localStorage.token;
    	}
    	return data;
    }
};
mui.plusReady(function(){

	setInterval(function(){//每分钟检查一次是否断网
		/*判断是否断网*/
		if(window.plus && plus.networkinfo.getCurrentType() === plus.networkinfo.CONNECTION_NONE) {
			plus.nativeUI.toast('已断开与互联网的连接', {
				verticalAlign: 'top'
			});
			return false;
		}
	},60000);
});
function GetRequest() {
	var url = location.search; //获取url中"?"符后的字串 
	var theRequest = new Object();
	if(url.indexOf("?") != -1) {
		var str = url.substr(1);
		strs = str.split("&");
		for(var i = 0; i < strs.length; i++) {
			theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
		}
	}
	return theRequest;
}

