(function() {
	var $j = jQuery.noConflict(true);
	var app = new Vue({
		el: '#app',
		data: {
			typeCard:'',		//身份 1.线上店主  2.经销商
			infos:[],
		},
		methods: {
			/*跳转*/
			turnTo: function(name,id) {
				mui.openWindow({
					url: name + '.html',
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
			//获取URL后面的值
			getUrlObj:function () { //获取url？号后面的值，以对象的形式存在
				var strs = location.search.substr(1).split("&");			
				var Obj = {}; 
				strs.forEach(function(v,k){
					Obj[v.split("=")[0]]=decodeURI(v.split("=")[1]); 
				})
				this.typeCard = Obj.type;
				return Obj; 
			},
			//接收数据
			loadding:function(){
				NetUtil.ajax('/MyItCooperation',{
					uname:localStorage.getItem('uname'),
					UID:localStorage.getItem('uuid')
				},function(r){
					console.log(r);
					if(r.status  == '200'){
						var infoList={
							content:'',			//内容
						};
						if(app.typeCard == '1'){
							var str = r.data.shopkeeper;
						}else{
							var str = r.data.Distributor;
						}
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
						infoList.content = str;    
						app.infos.push(infoList);
						console.log(app.infos);
					}else{
						mui.alert(r.message,function(){},'div');
					}
				})
			},
		},
		created: function() {
			this.getUrlObj();
			this.loadding();
		},
		mounted: function() {
			mui('.mui-scroll-wrapper').scroll({
				deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
			});
		}
	});
})();