(function() {
	var $j = jQuery.noConflict(true);
	var app = new Vue({
		el: '#app',
		data: {
			isBtn1:'',	//成为经销商
			isBtn2:'',	//成为线上店主
			isChoosePay:1,
			isShowDiv:false,	//支付页面
			isTypeNum:'',		//支付类型  1经销商 2.线上店主
			zfid1:'',
			zfid2:'',
			image1:'',		//分销商图片
			image2:'',		//线上店主图片
		},
		methods: {
			/*跳转*/
			turnTo: function(name,id,type) {
				mui.openWindow({
					url: name + '.html?type='+type,
					id: id + '.html',
					styles: {
						popGesture: 'close'
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
			//跳转支付
			turnToPay:function(name,id,data,isChoosePay){
				mui.openWindow({
				    url:name+'.html?data='+data+'&&isChoosePay='+isChoosePay,
				    id:id+'.html',
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
			//选择支付模式
			choosePay:function(index){
				this.isChoosePay = index;
			},
			//关闭支付弹框
			closeShowDiv:function(){
				this.isShowDiv = false;
			},
			//选择支付方式
			choosePayShow:function(type){
				if(type == '1'){
					if($j('.checkxieyi1').is(':checked')==true){
						app.isShowDiv = true;
					}else{
						mui.alert('请先勾选我已阅读并同意经销商协议',function(){},'div');
					}
				}else{
					if($j('.checkxieyi2').is(':checked')==true){
						app.isShowDiv = true;
					}else{
						mui.alert('请先勾选我已阅读并同意线上店主协议',function(){},'div');
					}
				}
				this.isTypeNum = type;
			},
			//接收数据
			loadding:function(){
				var time = new Date().getTime()
				console.log("开始时间:"+time)
				NetUtil.ajax('/MyItCooperation',{
					uname:localStorage.getItem('uname'),
					UID:localStorage.getItem('uuid')
				},function(r){
//					console.log(r);
						app.image1 = "http://www.bming.net:8091/"+r.data.image1[0].path;	//分销商图片
						app.image2 = "http://www.bming.net:8091/"+r.data.image2[0].path; //线上店主图片
					if(r.status  == '200'){
						var times = new Date().getTime()
						console.log("结束时间:"+time)
						app.isBtn1 = r.data.type1;	//分销商
						app.isBtn2 = r.data.type2;	//线上店主
						app.zfid1= r.data.obj1;
						app.zfid2= r.data.obj2;
//						console.log(app.zfid1);
//						console.log(app.zfid2);
					}else{
						mui.alert(r.message,function(){},'div');
					}
				})
			},
			//去支付
			goPayBtn:function(){
				//isChoosePay ->0是微信 1是支付宝
				console.log(this.isChoosePay);
				console.log(this.isTypeNum);
				NetUtil.ajax('/zsh/xd',{
					type:this.isTypeNum,
					uname:localStorage.getItem('uname'),
					UID:localStorage.getItem('uuid')
				},function(r){
					console.log(r);
					if(r.status  == '200'){
						app.isShowDiv = false;
						app.turnToPay('zshPay','zshPay',r.data,app.isChoosePay);
					}else{
						mui.alert(r.message,function(){},'div');
					}
				})
			}
		},
		created: function() {
			this.loadding();
			window.addEventListener('paySuccess',function(event){	  
	       		app.loadding();
	       		console.log('支付刷新');
	       },false);
		},
		mounted: function() {
			mui('.mui-scroll-wrapper').scroll({
				deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
			});
		}
	});
})();