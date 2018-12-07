(function() {
	var $j = jQuery.noConflict(true);
	var app = new Vue({
		el: '#app',
		data: {
			name:'',		//姓名
			idCard:'',		//身份证号
			bankCard:'',	//银行卡
			openBank:'',	//开户行
			cardNum:'',		//卡号
			phone:localStorage.getItem('uname'),		//手机号码
			codeNum:'',		//验证码
			isTure:false,		//true 输入都正确  false 不正确
		},
		methods: {
			/*跳转*/
			turnTo: function(name, id,bys) {
				mui.openWindow({
					url: name + '.html?id=' + id +'&&bys='+bys,
					id: name + '.html',
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
			//点击确定按钮判断是否输入合理
			isBtn:function(){
				var idCardReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
				if(!this.name){
					this.isTure = false;
					mui.toast('用户姓名不能为空');
					return false;
				}else if(!this.idCard){
					this.isTure = false;
					mui.toast('身份证号码不能为空');
					return false;
				}else if(idCardReg.test(this.idCard) == false){
					this.isTure = false;
					mui.toast('身份证号码输入有误');
					return false;
				}else if(!this.bankCard){
					this.isTure = false;
					mui.toast('所属银行不能为空');
					return false;
				}else if(!this.openBank){
					this.isTure = false;
					mui.toast('开户行不能为空');
					return false;
				}else if(!this.cardNum){
					this.isTure = false;
					mui.toast('卡号不能为空');
					return false;
				}else if(!this.codeNum){
					this.isTure = false;
					mui.toast('验证码不能为空');
					return false;
				}else{
					this.isTure = true;
					this.submitBtn();
				}
			},
			submitBtn:function(){
				console.log('success');
			},
			sendCode:function(){
				console.log(123123);
			}
			
			
		},
		created: function() {
			
		},
		mounted: function() {
			mui('.mui-scroll-wrapper').scroll({
				deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
			});
		}
	});
})();