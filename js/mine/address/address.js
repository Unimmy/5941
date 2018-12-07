(function() {
	var $j = jQuery.noConflict(true);
	var app = new Vue({
		el: '#app',
		data: {
			infos:[],
			typeId:'',	//如果是确定订单页面过来的话回去需要处理
		},
		methods: {
			/*跳转*/
			turnTo: function(name, id) {
				mui.openWindow({
					url: name + '.html?id=' + id,
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
			//进来的时候接收数据
			loadding:function(){
//				var memberId = localStorage.getItem('memberId');
//				plus.nativeUI.showWaiting();
				NetUtil.ajax(
				"/myaddress/selectall",
				{
					uname:localStorage.uname,
					UID:localStorage.getItem('uuid')
				}, function(r) {
					//plus.nativeUI.closeWaiting();
					console.log(r);
					console.log(JSON.stringify(r));
					var data = r.data;
					data.forEach(function(v,i){
						v.phone = v.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
					})
					app.infos=r.data;
				});
			},
			changeChoose:function(id,index){
				$j('.leftImg').removeClass('active').eq(index).addClass('active');
				$j('.leftImg').eq(index).addClass('active');
//				plus.nativeUI.showWaiting();
				NetUtil.ajax('/myaddress/updatedefault',{
					id:id,
					uname:localStorage.getItem('uname'),
					UID:localStorage.getItem('uuid')
				},function(r){
//					plus.nativeUI.closeWaiting();
					console.log(r);
					if(r.status='200'){
						mui.toast('默认收货地址设置成功');
					}else{
						mui.alert(r.message,function(){},'div');
					}
				});	
			},
//			ensure:function(){
//				var qtype = $location.search('qtype');
//				switch(+qtype){
//					case 1 ://返回购物车
//						/*var commUUId = $location.search("commUUId");
//						var payUUId = $location.search('payUUId');
//						var obj = {};
//						obj.url='../../../shoppingMall/shoppingCart/confirmOrder/confirmOrder.html?commUUId='+commUUId+'&payUUId='+payUUId;
//						obj.id='confirmOrder';
//						app.goPage(obj);*/
//						var data1 = {};
//						app.infos.forEach(function(info){
//							if(info.isDefault == 0){
//								data1 = info;
//							}
//						});
//						mui.fire(plus.webview.currentWebview().opener(),'backOrder',data1);
//						plus.webview.getWebviewById('addressManager').close();
//					break;
//					case 2 ://返回退换货-发货
//						var data = {};
//						app.infos.forEach(function(info){
//							if(info.isDefault == 0){
//								data = info;
//							}
//						});
//						mui.fire(plus.webview.currentWebview().opener(),'backAddress',data);
//						plus.webview.currentWebview().close();
//					break;
//					case 3: // 返回品鉴活动-地址设置
//						var data = {
//						};
//						app.infos.forEach(function(info){
//							if(info.isDefault == 0){
//								data = info;
//								data.judgeAppId = app.getUrlObj().id;
//							}
//						});
//						mui.fire(plus.webview.currentWebview().opener(),'backAddress',data);
//						plus.webview.currentWebview().close();
//						break;
//					default:
//						plus.webview.currentWebview().close();
//					break;
//				}
//			},
			getUrlObj:function () { //获取url？号后面的值，以对象的形式存在
				var strs = location.search.substr(1).split("&");			
				var Obj = {}; 
				strs.forEach(function(v,k){
					Obj[v.split("=")[0]]=decodeURI(v.split("=")[1]); 
				})
				return Obj; 
			},
		},
		created: function() {
			mui.init();
			var app = this;
			this.loadding();
			window.addEventListener('getData', function(event) {
//				console.log('sdfsdf')
				app.loadding();
			});
		},
		mounted: function() {
			mui.init({
				beforeback:function(){
					//获得父页面的webview
				    var list = plus.webview.currentWebview().opener();
				    console.log(JSON.stringify(list));
				    //触发父页面的自定义事件(refresh),从而进行刷新
				    mui.fire(list, 'changeRefresh');
				    //返回true,继续页面关闭逻辑
				    return true;
				}
			});
			mui('.mui-scroll-wrapper').scroll({
				deceleration: 0.0006, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
				bounce: false,
				indicators: false
			});
		}
	});
}());