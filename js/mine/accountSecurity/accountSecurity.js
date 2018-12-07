(function(){	
	var $j = jQuery.noConflict(true);		
	var app = new Vue({
		el:'#app',
		data:{
			isPhone:'0',		//0 未绑定 1绑定
			isWechart:'0',		//0 未绑定 1绑定
			phoneNum:'',		//手机号
			phone:'',			//中间没有星号的
			wechartName:'',		//微信名字
		},
		methods:{
			turnTo:function(name,phone){
				mui.openWindow({
				    url:name+'.html?phone='+phone,
				    id:name+'.html',
				    styles:{
				    	popGesture: 'close',
				    },
				    extras:{
				      //自定义扩展参数，可以用来处理页面间传值
				    },
				    createNew:false,//是否重复创建同样id的webview，默认为false:不重复创建，直接显示
				    show:{
				      autoShow:true,//页面loaded事件发生后自动显示，默认为true
				      aniShow:'slide-in-right',//页面显示动画，默认为”slide-in-right“；
				      duration:200,//页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
				      event:'titleUpdate',//页面显示时机，默认为titleUpdate事件时显示
				      extras:{}//窗口动画是否使用图片加速
				    },
				    waiting:{
				      autoShow:true,//自动显示等待框，默认为true
				      title:'加载中',//等待对话框上显示的提示内容
				      options:{
				        //width:120,等待框背景区域宽度，默认根据内容自动计算合适宽度
				        //height:100,等待框背景区域高度，默认根据内容自动计算合适高度
				      }
				    }
				})
			},
			loadding:function(){
				var bindPhone = localStorage.getItem('bindPhone');
				var bindWxName = localStorage.getItem('bindWxName');
				if(bindPhone!='' && bindPhone!=null && bindPhone!=undefined){
					this.phone = bindPhone;
					bindPhone = bindPhone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
					this.phoneNum = bindPhone;
					this.isPhone = 1;
				}else{
					this.isPhone = 0;
				}
				if(bindWxName!='' && bindWxName!=null && bindWxName!=undefined){
					this.wechartName = bindWxName;
					this.isWechart = 1;
				}else{
					this.isWechart = 0;
				}
				console.log(bindPhone);
			},
			
		},
		created:function(){
 			this.loadding();
 			window.addEventListener('reload',function(event){	  
	       		app.loadding();
	       		console.log('success刷新');
	       },false);
		},
		mounted:function(){
			//阻尼系数
			var deceleration = mui.os.ios?0.003:0.0009;
			mui('.mui-scroll-wrapper').scroll({
				bounce: false,
				indicators: true, //是否显示滚动条
				deceleration:deceleration
			});
			
			mui.plusReady(function(){
				plus.oauth.getServices(function(services) {
	                auths = services;
	            }, function(e) {
	                alert("获取登录服务列表失败：" + e.message + " - " + e.code);
	            });
			});
			//绑定微信按钮点击 调用登录操作
			document.getElementById('wxLogin').addEventListener('tap',function(){
				authLogin('weixin');
			});
			//登录操作
			function authLogin(type){
				var s;
				for(var i=0;i<auths.length;i++){
					if(auths[i].id == type){
						s = auths[i];
						break;
					}
				}
				if(!s.authResult){
					s.login(function(e){
						mui.toast('授权绑定成功！');
						authUserInfo(type);
					},function(e){
						mui.toast('授权绑定失败！');
					})
				}else{
					mui.toast('已经授权绑定');
				}
			};
			//注销
			function authLogout(){
				for(var i in auths){
					var s = auths[i];
					if(s.authResult){
						s.logout(function(e){
							console.log('注销认证成功');
						},function(e){
							console.log('注销认证失败');
						})
					}
				}
			};
			//微信登录认证信息
			function authUserInfo(type){
				var s;
	            for (var i = 0; i < auths.length; i++) {
	                if (auths[i].id == type) {
	                    s = auths[i];
	                    break;
	                }
	            }
	            if (!s.authResult) {
	                mui.toast("未授权认证！");
	            } else {
	                s.getUserInfo(function(e) {
	                    var josnStr = JSON.stringify(s.userInfo);
	                    var jsonObj = s.userInfo;
	                    console.log("获取用户信息成功：" + josnStr);
	                    showData(type,jsonObj);
	                    authLogout();
	                }, function(e) {
	                    mui.alert("获取用户信息失败：" + e.message + " - " + e.code,function(){},'div');
	                });
	            }
			};
			//显示信息并给后台传值
			function showData(type,data){
				NetUtil.ajax('/member/bindingweixin',{
					weiid:data.openid,
					uname:localStorage.getItem('uname'),
					UID:localStorage.getItem('uuid')
				},function(r){
					if(r.status == 200){
						mui.toast('微信绑定成功');
						localStorage.bindWxName = data.nickname;
						app.loadding();
					}else{
						mui.alert(r.message,function(){},'div');
					}
				})
			}
			
			
			
			
		}

	});		 
})();
