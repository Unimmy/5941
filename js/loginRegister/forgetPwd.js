(function(){	
	var $j = jQuery.noConflict(true);		
	var app = new Vue({
		el:'#app',
		data:{
			infos:{
				memberAccount: '', //电话号码
				phoneCode:'',
				newPassword:''		
			},
			newpsd:'',
			isDisabled:false,
			isShow:true,
			isActive:false,
		},
		methods:{
			turnTo:function(name){
				mui.openWindow({
				    url:name+'.html',
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
						type:'1'
					}, function(r) {
						if(r.status == 200) {
							mui.alert(r.message,function(){
								var time = 60;
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
			getUrlObj:function () { //获取url？号后面的值，以对象的形式存在
				var strs = location.search.substr(1).split("&&");	
				var Obj = {}; 
				strs.forEach(function(v,k){
					Obj[v.split("=")[0]]=decodeURI(v.split("=")[1]); 
				});
				return Obj; 
			},
			//填写内容
//			blurInput:function(){
//				if(!app.infos.memberAccount || !app.infos.){
//					app.isActive = true;
//				}
//			}
		},
		created:function(){
			mui.init({
				swipeBack: false
			});
		},
		mounted:function(){
			this.infos.memberAccount = this.getUrlObj().phoneNum;
			/*手机验证*/
			$j("#forgetPhone").Validform({
				tiptype: function(msg, o, cssctl) {
					//msg：提示信息;
					//o:{obj:*,type:*,curform:*},
					//obj指向的是当前验证的表单元素（或表单对象，验证全部验证通过，提交表单时o.obj为该表单对象），
					//type指示提示的状态，值为1、2、3、4， 1：正在检测/提交数据，2：通过验证，3：验证失败，4：提示ignore状态, 
					//curform为当前form对象;
					//cssctl:内置的提示信息样式控制函数，该函数需传入两个参数：显示提示信息的对象 和 当前提示的状态（既形参o中的type）;
					if(!(msg == "")) {
						mui.toast(msg);
					}
				},
				btnSubmit: ".next",
				datatype: extdatatype,
				ajaxPost: true,
				tipSweep: true,
				postonce: true,
				tipSweep: true,
				beforeCheck: function() {
					
				},
				beforeSubmit: function() {
					NetUtil.ajax("member/resetPawwsord",{
						phone:app.infos.memberAccount,
						code:app.infos.phoneCode,
						newpassword:app.newpsd
					}, function(r) {
						if(r.status == 200) {
//							app.isShow=false;
							mui.alert(r.message,function(){
								plus.webview.currentWebview().close();
							},'div')
						} else {
							mui.alert(r.message,function(){},'div')
						}
					});
					return false;
				}
			});
			/*修改密码*/
			$j("#updataPwd").Validform({
				tiptype: function(msg, o, cssctl) {
					if(!(msg == "")) {
						mui.alert(msg,function(){},'div');
					}
				},
				btnSubmit: ".modify",
				datatype: extdatatype,
				ajaxPost: true,
				tipSweep: true,
				postonce: true,
				tipSweep: true,
				beforeCheck: function() {
					
				},
				beforeSubmit: function() {
					app.infos.newPassword =  hex_md5(app.newpsd);
					NetUtil.ajax("appLoginRegister/updatePassword", {
						memberAccount: app.infos.memberAccount,
						password:app.infos.newPassword
					}, function(r) {
						console.log(r)
						if(r.resCode == 0) {
							mui.alert(r.resDesc,function(){
								plus.webview.currentWebview().close();
							},'div')
						} else {
							mui.alert(r.resDesc,function(){},'div')
						}
					});
					return false;
				}
			});
		}
	});		 
})();
