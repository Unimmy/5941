(function() {
	var $j = jQuery.noConflict(true);
	var app = new Vue({
		el: '#app',
		data: {
			infos: {
//				memberType: '0', //0为个人 1为企业
				memberAccount: '', //电话号码
				memberPassword: '', //密码
				phoneCode: '', //验证码
				invitateCode: '', //邀请码    选填
				isAgree: true,
				isWxChart:0,	//0基本注册  1 微信进来的注册
			},
			psd:'',
			isDisabled:false,
			wxChartData:{},		//微信信息
		},
		methods: {
			turnTo: function(name,id,templateId) {
				mui.openWindow({
					url: name + '.html?templateId='+templateId,
					id: id +'.html',
					styles: {
						popGesture: 'close',
					},
					extras: {
						//自定义扩展参数，可以用来处理页面间传值
					},
					createNew: false, //是否重复创建同样id的webview，默认为false:不重复创建，直接显示
					show: {
						autoShow: true, //页面loaded事件发生后自动显示，默认为true
						aniShow: 'slide-in-right', //页面显示动画，默认为”slide-in-right“；
						duration: 200, //页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
						event: 'titleUpdate', //页面显示时机，默认为titleUpdate事件时显示
						extras: {} //窗口动画是否使用图片加速
					},
					waiting: {
						autoShow: true, //自动显示等待框，默认为true
						title: '加载中', //等待对话框上显示的提示内容
						options: {
							//width:120,等待框背景区域宽度，默认根据内容自动计算合适宽度
							//height:100,等待框背景区域高度，默认根据内容自动计算合适高度
						}
					}
				})
			},
			//获取URL后面的值
			getUrlObj:function () { //获取url？号后面的值，以对象的形式存在
				var strs = location.search.substr(1).split("&");			
				var Obj = {}; 
				strs.forEach(function(v,k){
					Obj[v.split("=")[0]]=decodeURI(v.split("=")[1]); 
				});
				console.log(Obj.dataType);
				if(Obj.dataType == 'weixin'){
					this.isWxChart = 1;
				}else{
					this.isWxChart = 0;
				}
//				this.JsonArray.push(Obj.id);
//				this.sizeNum=Obj.size;
				return Obj; 
			},
			/*获取手机验证码*/
			imgCode: function() {
				var phone_txt = /^((\d{3}-\d{8}|\d{4}-\d{7,8})|(1[3|4|5|7|8|9][0-9]{9}))$/;
				if(!app.infos.memberAccount){
					app.isDisabled = false;
					mui.toast('请输入您的手机号');
				}else if(!phone_txt.test(app.infos.memberAccount)){
					app.isDisabled = false;
					mui.toast('请输入正确11位手机号');
				}else{
					app.isDisabled = true;
					NetUtil.ajax("phonemessage/send",{
						phone: app.infos.memberAccount,
						type:'0'
					}, function(r) {
						if(r.status == 200) {
							mui.alert(r.message,function(){
								var time = 59;
								$j('.codeBox').html((time--) + '秒后可获取');
								var timeInterval = setInterval(function() {
									$j('.codeBox').html((time--) + '秒后可获取');
									if(time == -1) {
										$j('.codeBox').html('获取验证码');
										app.isDisabled = false;
										clearInterval(timeInterval)
									}
								}, 1000)
							},'div')
						}else{
							mui.alert(r.message,function(){},'div');
							app.isDisabled = false;
						}
					});
				}
			},
//			/*个人，企业切换*/
//			silidActive:function(event,num){
//				$j(event.target).addClass("active").siblings().removeClass("active");
//				app.infos.memberType = num;
//			}
		},
		created: function() {
			mui.init({
				swipeBack: false
			});
			this.getUrlObj();
		},
		mounted: function() {
			mui.plusReady(function(){
                var self = plus.webview.currentWebview();
                var name = self.data;
                app.wxChartData = name;
                //关闭等待框
                plus.nativeUI.closeWaiting();
                //显示当前页面
                mui.currentWebview.show();
           });
			$j('.mui-checkbox').on('change', 'input', function() {
				var value = this.checked ? true : false;
				app.infos.isAgree = value;
			});
			/*表单验证*/
			$j("#formRegister").Validform({
				tiptype: function(msg, o, cssctl) {
					//msg：提示信息;
					//o:{obj:*,type:*,curform:*},
					//obj指向的是当前验证的表单元素（或表单对象，验证全部验证通过，提交表单时o.obj为该表单对象），
					//type指示提示的状态，值为1、2、3、4， 1：正在检测/提交数据，2：通过验证，3：验证失败，4：提示ignore状态, 
					//curform为当前form对象;
					//cssctl:内置的提示信息样式控制函数，该函数需传入两个参数：显示提示信息的对象 和 当前提示的状态（既形参o中的type）;
					mui.toast(msg);
					console.log(app.isWxChart);
					console.log(JSON.stringify(app.wxChartData));
				},
				btnSubmit: ".sureBtn",
				datatype: extdatatype,
				ajaxPost: true,
				tipSweep: true,
				postonce: true,
				beforeCheck: function() {
					if(!app.infos.isAgree) {
						mui.alert('请勾选同意注册协议',function(){},'div');
						return false;
					};
				},
				beforeSubmit: function() {
					mui('#loadingB').button('loading');				
//					app.infos.memberPassword =  hex_md5(app.psd);
					NetUtil.ajax("member/add",{
						'uname':app.infos.memberAccount,
						'password':app.psd,
						'code':app.infos.phoneCode,
						'recommend':app.infos.invitateCode,
						'type':'1'
					}, function(r) {
						console.log(r)
						if(r.status == 200) {
							if(app.isWxChart == 1){
								console.log('进入绑定微信接口');
								NetUtil.ajax("/member/bindingweixin",{
									weiid:app.wxChartData.openid,
									uname:app.infos.memberAccount,
									UID:localStorage.getItem('uuid')
								},function(msgD){
									console.log(JSON.stringify(msgD));
									console.log(app.wxChartData.openid);
									if(r.status == '200'){
										mui('#loadingB').button('reset');
										var loginData = {			
											uname:app.infos.memberAccount,
											password:app.psd,
											type:'2',
											UID:localStorage.getItem('uuid')
										};
										NetUtil.ajax("member/login",loginData, function(r) {
											if(r.status == '200'){
												localStorage.uname = app.infos.memberAccount;
												localStorage.memberId = r.data.id;
												localStorage.bindPhone = r.data.phone;
												localStorage.bindWxName = app.wxChartData.nickname;
												var mine = plus.webview.getWebviewById('views/mine/mine.html');
												var home = plus.webview.getWebviewById('views/homePage/homeIndex.html');
												var classification = plus.webview.getWebviewById('views/classification/classification.html');
												var shopCart = plus.webview.getWebviewById('views/shoppingCart/shoppingCart.html');
												var index = plus.webview.getLaunchWebview();
												mui.fire(mine, 'changeP', {  
									                name: 'name2'  //传往second.html的值  
									           	});
												mui.fire(home, 'changeP', {  
									                name: 'name2'  //传往second.html的值  
									           	});
									           	mui.fire(classification, 'changeP', {  
									                name: 'name2'  //传往second.html的值  
									           	});
									           	mui.fire(shopCart, 'changeP', {  
									                name: 'name2'  //传往second.html的值  
									           	});
									           	mui.fire(index, 'locationToMine', {  
											        name: mine  //传往second.html的值  
											    });
					//							var ws = plus.webview.getLaunchWebview().id;
					//							app.turnTo('../../index',ws);
												var ws = plus.webview.currentWebview();
												var login = plus.webview.getWebviewById('login');
												plus.webview.close(login);
												plus.webview.close(ws);
												var all = plus.webview.all();
												console.log(JSON.stringify(all));
											}else{
												mui.alert(r.message,function(){
													app.psd = '';
												},'div');
											}
										});
									}else{
										mui.alert(r.message,function(){},'div');
									}
								})
							}else{
								mui('#loadingB').button('reset');
								var loginData = {			
									uname:app.infos.memberAccount,
									password:app.psd,
									type:'2',
									UID:localStorage.getItem('uuid')
								};
								console.log('没有进入绑定微信接口');
								NetUtil.ajax("member/login",loginData, function(r) {
									if(r.status == '200'){
										localStorage.uname = app.infos.memberAccount;
										localStorage.memberId = r.data.id;
										localStorage.bindPhone = r.data.phone;
										localStorage.bindWxName = '';
										var mine = plus.webview.getWebviewById('views/mine/mine.html');
										var home = plus.webview.getWebviewById('views/homePage/homeIndex.html');
										var classification = plus.webview.getWebviewById('views/classification/classification.html');
										var shopCart = plus.webview.getWebviewById('views/shoppingCart/shoppingCart.html');
										var index = plus.webview.getLaunchWebview();
										mui.fire(mine, 'changeP', {  
							                name: 'name2'  //传往second.html的值  
							           	});
										mui.fire(home, 'changeP', {  
							                name: 'name2'  //传往second.html的值  
							           	});
							           	mui.fire(classification, 'changeP', {  
							                name: 'name2'  //传往second.html的值  
							           	});
							           	mui.fire(shopCart, 'changeP', {  
							                name: 'name2'  //传往second.html的值  
							           	});
							           	mui.fire(index, 'locationToMine', {  
									        name: mine  //传往second.html的值  
									    });
			//							var ws = plus.webview.getLaunchWebview().id;
			//							app.turnTo('../../index',ws);
										var ws = plus.webview.currentWebview();
										var login = plus.webview.getWebviewById('login');
										plus.webview.close(login);
										plus.webview.close(ws);
										var all = plus.webview.all();
										console.log(JSON.stringify(all));
									}else{
										mui.alert(r.message,function(){
											app.psd = '';
										},'div');
									}
								});
							}
							/*if(window.plus) {
								plus.webview.close(plus.webview.currentWebview())
							} else {
								document.addEventListener('plusready', function() {
									plus.webview.close(plus.webview.currentWebview())
								}, false)
							}
							mui('#loadingB').button('reset');
							mui.alert(r.resDesc,function(){
								app.turnTo('login');
							})*/
							
						} else {							
							mui.alert(r.message,function(){
								mui('#loadingB').button('reset');
							},'div')
						}
					});
					return false;
				}
			});
			
		}
	});
})();