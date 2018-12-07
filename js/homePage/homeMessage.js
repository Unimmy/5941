(function(){	
	var $j = jQuery.noConflict(true);		
	var app = new Vue({
		el:'#app',
		data:{
			NumId:'',
			infos:[],
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
			getUrlObj:function () { //获取url？号后面的值，以对象的形式存在
				var strs = location.search.substr(1).split("&&");	
//				console.log(strs)
				var Obj = {}; 
				strs.forEach(function(v,k){
					Obj[v.split("=")[0]]=decodeURI(v.split("=")[1]); 
				});
				console.log(Obj)
				this.NumId = Obj.NumId;
				return Obj; 
			},
			//查询详细消息
			messageAjax:function(){
//					plus.nativeUI.showWaiting();
				NetUtil.ajax('/SystemMessage/selectallByid',{
					id:this.NumId,
					uname:localStorage.getItem('uname'),
					UID:localStorage.getItem('uuid')
				},function(msg){
					console.log(msg);
//					plus.nativeUI.closeWaiting();
					app.infos = msg.data;
					var str = msg.data.content;
					var arr = str.split("&lt;");
						str=arr.join("<");
				        arr=str.split("&gt;")
				        str=arr.join(">");
				        arr=str.split("&amp;");
				        str=arr.join("&");
				        arr=str.split("&nbsp;");
				        str=arr.join(" ");
				        arr=str.split("&quot;");
				        str=arr.join("'");
				    app.infos.content = str;   
				})
			},
			
		},
		created:function(){
			this.getUrlObj();
			this.messageAjax();
		},
		mounted:function(){
			mui('.mui-scroll-wrapper').scroll({
				deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
			});
			mui.init({
				beforeback: function() {
					console.log(111111);
					var Scanner = plus.webview.getWebviewById('messageIndex.html');
					mui.fire(Scanner, 'refresh');
					console.log(plus.webview.getWebviewById('messageIndex.html'))
					return true;
				}
			});
			
		}
	});		 
})();
