(function() {
	var $j = jQuery.noConflict(true);
	var app = new Vue({
		el: '#app',
		data: {
			infosLeft:[],		//左边导航
			infosRight:[],		//右边导航
			infosTop:[],		//上边导航
			locationPosition:localStorage.address,	//定位
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
			//接受数据
			ificationAjax:function(){
//				plus.nativeUI.showWaiting();
				NetUtil.ajax('/appIndexType',{},function(msg){
					console.log(msg);
//					console.log(JSON.stringify(msg));
//					plus.nativeUl.closeWaiting();
					app.infosLeft = msg.data.LEFT;
					app.infosRight = msg.data.BELOW;
					app.infosTop = msg.data.TOP;
				})
			},
			//点击左边导航
			chooseShop:function(name){
//				plus.nativeUl.showWaiting();
				NetUtil.ajax('/appIndexType',{
					largeclass:name
				},function(msg){
//					plus.nativeUl.closeWaiting();
					app.infosRight = msg.data.BELOW;
					app.infosTop = msg.data.TOP;
				})
			},
			//下拉刷新
			pulldownRefresh:function(){
				setTimeout(function(){
					app.ificationAjax();
					$j('.leftClickD').removeClass('mui-active');
					$j('.leftClickD').eq(0).addClass('mui-active');
					mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
				},1500)
			}
		},
		created: function() {
			mui.init({
  				swipeBack: false,
                pullRefresh: {
                    container: '#pullrefresh',
                    down: {
                        style: 'circle',
						color:'#ff4200',
						offset: '44px',
						contentdown: "下拉可以刷新", //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
						contentover: "释放立即刷新", //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
						contentrefresh: "正在刷新...", //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
						auto: false,
						callback: this.pulldownRefresh
                    },
                }
            });
			this.ificationAjax();
			window.addEventListener('changeP', function(event) {
				app.ificationAjax();
				console.log('classification刷新');
			}, false);
		},
		mounted: function() {
			mui('.mui-scroll-wrapper').scroll({
				deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006

			});
			
			//获取当前城市
			mui.plusReady(function() {
                plus.geolocation.getCurrentPosition(function(position){
                	var address = position.address.city;
                	app.locationPosition = address;
                }, function(e) {
                    mui.toast("异常:" + e.message);
                });
            });
            
			mui.init({
//				beforeback: function() {
//					var Scanner = plus.webview.getWebviewById('modules/index/index.html');
//					mui.fire(Scanner, 'AddNew');
//					return true;
//				}
			});

			$j("#segmentedControls .mui-control-item:first-child").addClass('mui-active');
			$j("#segmentedControlContents .mui-control-content:first-child").addClass('mui-active');
		},
		components: {}
	});
})();