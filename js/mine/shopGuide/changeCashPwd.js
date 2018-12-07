(function(){	
	var $j = jQuery.noConflict(true);		
	var app = new Vue({
		el:'#app',
		data:{
			isBtn:false,
			oldPwd:'',	//老密码
			newPwd:'',	//新密码
			aginPwd:'',	//确认新密码
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
			
			//手机号和验证码都失去焦点
			blurS:function(){
				if(!this.oldPwd){
					this.isBtn = false;
					mui.toast('请输入您的原始密码');
					return false;
				}else if(!this.newPwd){
					this.isBtn = false;
					mui.toast('请输入新密码');
					return false;
				}else if(!this.aginPwd){
					this.isBtn = false;
					mui.toast('请再次输入新密码');
					return false;
				}else if(this.newPwd != this.aginPwd){
					this.isBtn = false;
					mui.toast('两次密码输入不一致,请检查后重新输入');
					return false;
				}else{
					this.isBtn = true;
				}
			},
			//提交
			submitBtn:function(){
				this.blurS();
				if(this.isBtn == true){
					
				}else{
					return; 
				}
			},
			
		},
		created:function(){

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
