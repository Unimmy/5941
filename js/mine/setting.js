(function(){	
	var $j = jQuery.noConflict(true);	
	var app = new Vue({
		el:'#app',
		data:{
			
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
			//退出当前账号
			goLogin:function(){		
				localStorage.removeItem('memberId');
				localStorage.removeItem('uname');
				localStorage.removeItem('bindWxName');
				localStorage.removeItem('memberLoginSize');
				mui.plusReady(function() {
					var all = plus.webview.all();
					var index = plus.webview.getWebviewById('index.html').id;
					var wsHome = plus.webview.getWebviewById('views/homePage/homeIndex.html').id;
					var wsClassification = plus.webview.getWebviewById('views/classification/classification.html').id;
					var wsShoppingCart = plus.webview.getWebviewById('views/shoppingCart/shoppingCart.html').id;
					var wsMine = plus.webview.getWebviewById('views/mine/mine.html').id;
					all.forEach(function(v,k,arr){
						if(v.id != index && v.id !=wsHome && v.id !=wsClassification && v.id != wsShoppingCart && v.id != wsMine){
							v.close();
						}
					})
					plus.webview.open('../../views/loginRegister/login.html');
				});
			},
			
		},
		created:function(){
			
		},
		mounted:function(){
			mui('.mui-scroll-wrapper').scroll({
				deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
			});
			
		}
	});		 
})();
