(function(){	
	var $j = jQuery.noConflict(true);		
	var app = new Vue({
		el:'#app',
		data:{
			isBtn:false,
			alipayNum:'',
			isEstablish:'0',
			userName:'',
			tixianPwd:'',
			yzNum:'',		//验证码
			phoneNum:localStorage.getItem('uname'),	//手机号码
			isDisabled:false,
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
				this.alipayNum = Obj.alipayNum;
				if(Obj.alipayNum == '' || Obj.alipayNum == null || Obj.alipayNum == undefined){
					this.isEstablish = '0';
				}else{
					this.isEstablish = '1';
				}
				console.log(this.isEstablish);
				return Obj; 
			},
			//发送验证码
			postCode:function(phoneNum){
				console.log(phoneNum);
				if(phoneNum == '' || phoneNum == null || phoneNum == undefined){
					mui.toast('请退出当前账户并重新登录账户后，再次点击');
					return;
				}else{
					NetUtil.ajax('/phonemessage/send',{
						phone:phoneNum,
						type:'4'
					},function(r){
						console.log(r);
						app.isDisabled = true;
						if(r.status == 200){
							mui.alert(r.message,function(){
								var time = 60;
								$j('.getYzNumBtn').html((time--) + '秒后可获取');
								var timeInterval = setInterval(function() {
									$j('.getYzNumBtn').html((time--) + '秒后可获取');
									if(time == -1) {
										$j('.getYzNumBtn').html('点击获取验证码');
										app.isDisabled = false;
										clearInterval(timeInterval)
									}
								}, 1000)
							},'div')
						}else{
							mui.toast(r.message);
						}
					})
				}
			},
			blurs:function(){
				if(!this.userName){
					mui.toast('真实姓名不能为空');
					return false;
				}else if(!this.alipayNum){
					mui.toast('支付宝账户不能为空');
					return false;
				}else if(!this.yzNum){
					mui.toast('验证码不能为空');
					return false;
				}else{
					this.submitBtn();
				}
			},
			//提交
			submitBtn:function(){
				NetUtil.ajax('/zfb/add',{
					name:this.userName,
					zfb:this.alipayNum,
					message:this.yzNum,
					uname:localStorage.getItem('uname'),
					UID:localStorage.getItem('uuid')
				},function(r){
					console.log(JSON.stringify(r));
					if(r.status==200){
						mui.alert(r.message,function(){
							var cashAccountManagement = plus.webview.getWebviewById('cashAccountManagement.html');
							mui.fire(cashAccountManagement,'reload',{});
							var ws = plus.webview.currentWebview();
							plus.webview.close(ws);
						},'div');
					}else{
						mui.alert(r.message,function(){},'div');
					}
				})
			},
			//进来接受数据
			loadding:function(){
				NetUtil.ajax('/member/selectinfo',{
					uname:localStorage.getItem('uname'),
					UID:localStorage.getItem('uuid')
				},function(r){
					console.log(r);
					if(r.status==200){
						if(r.data.zfb!='' && r.data.zfb!=null && r.data.zfb!=undefined){
							app.alipayNum = r.data.zfb;
						}else{
							app.alipayNum = '';
						}
						if(r.data.membername!='' && r.data.membername!=null && r.data.membername!=undefined){
							app.userName = r.data.membername;
						}else{
							app.userName = '';
						}
					}else{
						mui.alert(r.message,function(){},'div');
					}
				})
			}
			
		},
		created:function(){
 			this.getUrlObj();
 			this.loadding();
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
