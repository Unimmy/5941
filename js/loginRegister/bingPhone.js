(function(){	
	var $j = jQuery.noConflict(true);		
	var app = new Vue({
		el:'#app',
		data:{
			isDisabled:false,
			isBtn:false,
			yz_num:'',
			isYzNum:true,
			phone:'',		//中间没星
			phoneX:'',		//中间加星
			phoneNew:'',	//新手机号
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
			//获取Url拼的参数
			getUrlObj:function (type) { //获取url？号后面的值，以对象的形式存在
				var strs = location.search.substr(1).split("&&");	
				var Obj = {}; 
				strs.forEach(function(v,k){
					Obj[v.split("=")[0]]=decodeURI(v.split("=")[1]); 
				});
				this.phone = Obj.phone;
				this.phoneX = Obj.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
				return Obj; 
			},
			
			//手机号和验证码都失去焦点
			blurS:function(){
				var phone_txt = /^((\d{3}-\d{8}|\d{4}-\d{7,8})|(1[3|4|5|7|8|9][0-9]{9}))$/;
				if(!this.phoneNew){
					this.isBtn = false;
					mui.toast('请输入您的手机号');
					return false;
				}else if(!phone_txt.test(this.phoneNew)){
					this.isBtn = false;
					mui.toast('请输入正确11位手机号');
					return false;
				}else if(!this.yz_num){
					this.isBtn = false;
					this.isYzNum = true;
					mui.toast('请输入验证码');
					return false;
				}else{
					this.isBtn = true;
				}
			},
			/*获取手机验证码*/
			imgCode: function() {
				var phone_txt = /^((\d{3}-\d{8}|\d{4}-\d{7,8})|(1[3|4|5|7|8|9][0-9]{9}))$/;
//				if(!app.phone){
//					app.isDisabled = false;
//					mui.toast('请输入您的手机号');
//				}else if(!phone_txt.test(app.phone)){
//					app.isDisabled = false;
//					mui.toast('请输入正确11位手机号');
//				}else{
					app.isDisabled = true;
//					plus.nativeUI.showWaiting();
					NetUtil.ajax("phonemessage/send",{
						phone: app.phone,
						type:'2'
					}, function(r) {
//						plus.nativeUI.closeWaiting();
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
//				}
			},
			//提交
			submitBtn:function(){
//				plus.nativeUI.showWaiting()
				NetUtil.ajax('/member/binding',{
					phone:this.phoneNew,
					code:this.yz_num,
					uname:localStorage.getItem('uname'),
					UID:localStorage.getItem('uuid')
				},function(r){
//					plus.nativeUI.closeWaiting();
					console.log(r);
					if(r.status == 200){
						app.turnTo('changePhoneSuccess');
					}else{
						mui.alert(r.message,function(){},'div');
					}
				})
			},
			
		},
		created:function(){
 			this.getUrlObj();
		},
		mounted:function(){
			//阻尼系数
			var deceleration = mui.os.ios?0.003:0.0009;
			mui('.mui-scroll-wrapper').scroll({
				bounce: false,
				indicators: true, //是否显示滚动条
				deceleration:deceleration
			});			
		}

	});		 
})();
