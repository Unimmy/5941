(function() {
	var $j = jQuery.noConflict(true);
	var app = new Vue({
		el: '#app',
		data: {
			isTitle:'0',	//导航
			top:[],		   //banner
			advertisement:[],	//广告
			shops:[],		//商品
			type:[],		//上面导航类型
			topBelow:[],	//广告banner
			locationPosition:'定位中',	//定位
			Eject:[],		
			isImgTu:false,
		},
		methods: {
			/*跳转*/
			turnTo: function(name,id,mk) {
				mui.openWindow({
					url: name + '.html?id=' + id + '&&mk='+mk,
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
			/*跳转详情页面*/
			turnToX: function(name,id,type,index) {
				if(name == '1'){//name传1则不跳转
					return
				}
				if(name == 'null'){	
				mui.openWindow({
					url:'../mine/myCopperate/myCopperate.html',
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
				}else{
				mui.openWindow({
					url: name + '.html?type=' + type,
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
			  }
			},
			//导航点击
			chooseTitle:function(index,name){
				this.isTitle = index;
				if(name == '推荐'){
					app.netAjAx();
				}else{
					NetUtil.ajax('/commodity/selectBySelect',{
						largeclass:name,
						type:1,
						mk:'mk',
						rows:'10000'
					},function(msg){
						console.log(msg);
						app.shops = msg.data;
					})
				}
			},
			//进来请求后台数据
			netAjAx:function(){
//					plus.nativeUI.showWaiting();
				NetUtil.ajax("/index",{
					mk:'mk'
				},function(r) {
//					console.log(JSON.stringify(r));
					console.log(r);
					//plus.nativeUI.closeWaiting();
					if(r.status == '200'){
						app.top = r.data.TOP;
						app.advertisement = r.data.SYSTEMADVERTISEMENT;
						app.shops = r.data.COMMODITY;
						app.type = r.data.TYPE;
						app.Eject = r.data.Eject;
						app.topBelow = r.data.TOPBelow;
					}else{
						localStorage.memberId = undefined;
						mui.alert(r.message,function(){},'div');
					}
					if(localStorage.getItem('memberLoginSize')>0){
						app.closeImg();
					}else{
						app.isImgTu = true;
					}
				});
				
			},
			//广告轮播
			tipsScroll: function(selector, speed) {
				$j(selector).css({
					left: 0
				});
				$j(selector).stop().animate({
					left: 0 - $j(selector).width()
				}, speed, 'linear', function() {
					app.tipsScroll(selector, speed);
				});
			},
			//判断是否登陆了的 登录了 跳转详情页面  没有登录 跳转登录页面
			portrait:function(id){
				var _this = this;
//				console.log(id);
				this.turnToX('../shoppingCart/commodityDetails','commodityDetails',id);
			},
			//关闭刚刚进来时打开的图片
			closeImg:function(){
				this.isImgTu = false;
				mui.plusReady(function(){ 
				    plus.runtime.getProperty(plus.runtime.appid, function(inf) {
				    	var ver = inf.version;
				    	console.log('当前版本：'+ver);
				    	NetUtil.ajax('/version/select',{},function(r){
				    		if(r.status == 200){
				    			if(r.data[0].CODE>ver){
				    				var btnArray = ['取消','确定'];
				    				console.log(r.data[0].CODE);
				    				mui.confirm("发现新版本:V"+r.data[0].CODE+"是否立即更新",'',btnArray,function(e){
				    					if(e.index == 1){
				    						app.turnToX('../mine/setting','setting','clickOpen');
				    					}else{
				    						plus.runtime.quit();
				    						console.log('取消了的');
				    					}
                                    },'div');
				    			}else{
				    				console.log('版本没有更新');
				    			}
				    		}
				    	})
				    });
				});
			},
			pulldownRefresh:function(){
				setTimeout(function(){
					app.netAjAx();
					app.isTitle = '0';
					mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
				},1000)
			}
		},
		created: function() {
//			mui.init({
//				swipeBack: false
//			});
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
			this.netAjAx();
			window.addEventListener('changeP', function(event) {
				app.netAjAx();
				console.log('login homeIndex刷新');
			}, false);
			window.addEventListener('changeAddress',function(event){
				app.locationPosition = localStorage.getItem('address');
			},false);
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
//              	if(address!='' && address!=null && address!=undefined){
                		localStorage.setItem('address',address);
//              	}else{
//              		localStorage.setItem('address','定位中');
//              	}
                }, function(e) {
                    mui.toast("异常:" + e.message);
                });
            });

			
			/*轮播*/
			var swiper = new Swiper('.swiper-container', {
				pagination: '.swiper-pagination',
				grabCursor: true,
//				loop: true,
				observer: true, //修改swiper自己或子元素时，自动初始化swiper
				observeParents: true, //修改swiper的父元素时，自动初始化swiper
				autoplay: 5000,
				effect: 'fade',
				fade: {
					crossFade: true,
				}
			});
		},
		updated: function() {
			/*提示信息滚动*/
			this.tipsScroll(".advertisement .rightWord i", 20000);
		},
		components: {}
	});
})();