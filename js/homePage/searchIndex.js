(function() {
	var $j = jQuery.noConflict(true);
	var app = new Vue({
		el: '#app',
		data: {
			title:'新品童鞋',
			bannerImg:'../../img/homePage/banner.png',
			infos: [],
			shops:[],
			sendInfo:{
				pageNo:1,
				pageAll:0,
				pageSize:10,
				orderbykey:'',
				orderbytype:0,
				name:''
			},
			isDown:true,
			searchName:'',
		},
		methods: {
			/*跳转详情页面*/
			turnTo: function(name,id,type) {
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
			},
			pulldownRefresh: function() { //下拉刷新具体业务实现
				this.sendInfo.pageNo = 1;
				this.getInfo();
			},
			pullupRefresh: function() { //上拉加载具体业务实现
				this.sendInfo.pageNo++;
				this.getInfo('up');
			},
			getInfo:function(type){
				NetUtil.ajax("/commodity/selectByName",{
					rows:this.sendInfo.pageSize,
					page:this.sendInfo.pageNo,
					orderbykey:this.sendInfo.orderbykey,
					orderbytype:this.sendInfo.orderbytype,
					name:this.sendInfo.name
				}, function(r) {
					console.log(r);
					if(r.status == 200) {
						if(type == 'up'){
				 			app.infos = app.infos.concat(r.data);
				 			app.sendInfo.dataLength = r.data.length;
//							app.sendInfo.pageAll = ~~(r.resData.canNotUseTicketPage.count / app.sendInfo.pageSize) + 1;
					 	}else{
//					 		app.infos.canNotUseTicketPage = r.resData.canNotUseTicketPage.list;
							app.infos = r.data;	
							app.sendInfo.dataLength = r.data.length;
//					 		mui('#pullrefresh').pullRefresh().endPulldownToRefresh(app.sendInfo.pageNo > app.sendInfo.pageAll); //refresh completed
					 	}
					} else {
						mui.alert(r.resDesc,function(){},'div')
					}
				});
			},
			//价格排序
			priceSort:function(){
				this.isDown = !this.isDown;
				if(this.isDown == true){
					this.sendInfo.orderbytype=0;
					this.getInfo();
				}else{
					this.sendInfo.orderbytype=1;
					this.getInfo();
				}
			},
			//获取URL参数
			getUrlObj:function () { //获取url？号后面的值，以对象的形式存在
				var strs = location.search.substr(1).split("&");			
				var Obj = {}; 
				strs.forEach(function(v,k){
					Obj[v.split("=")[0]]=decodeURI(v.split("=")[1]); 
				})
				this.sendInfo.name = Obj.searchName;
				console.log(this.sendInfo.name);
//				var width = $j('#sliderProgressBar').width() * Obj.type;
				return Obj; 
			},
			//搜索
			searchBtn:function(){
				this.sendInfo.name = this.searchName;
				this.getInfo();
			},
			//判断是否登陆了的 登录了 跳转详情页面  没有登录 跳转登录页面
			isLogin:function(id){
				console.log(id);
				this.turnTo('../shoppingCart/commodityDetails','commodityDetails',id);
			}
		},
		created: function() {
			mui.init({
				swipeBack: false
			});
			this.getUrlObj();
			this.getInfo();
			mui.ready(function() {
				//循环初始化所有下拉刷新，上拉加载。
				mui.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function(index, pullRefreshEl) {
					mui(pullRefreshEl).pullToRefresh({
						down: {
							callback: function() {
								var self = this;
								app.sendInfo.pageNo = 1;
								setTimeout(function() {
									app.getInfo();
									self.endPullDownToRefresh();
									self.endPullUpToRefresh(false);
									self.refresh(true);
								}, 1000);
							}
						},
						up: {
							callback: function() {
								var self = this;
								app.sendInfo.pageNo++;
								setTimeout(function() {	
									console.log(app.sendInfo.dataLength);
									self.endPullUpToRefresh(app.sendInfo.dataLength<=0);
									if(app.sendInfo.dataLength>0) {
										app.getInfo('up');
									}	
								}, 1000);
							}
						}
					});
				});
			});	
		},
		mounted: function() {
			//阻尼系数
			var deceleration = mui.os.ios?0.003:0.0009;
			mui('.mui-scroll-wrapper').scroll({
				bounce: false,
				indicators: true, //是否显示滚动条
				deceleration:deceleration
			});		
			document.getElementById('slider').addEventListener('slide', function(e) {
//				app.sendInfo.type = e.detail.slideNumber;
				console.log(e.detail.slideNumber);
				if(e.detail.slideNumber == 0){
					app.sendInfo.orderbykey='';
					app.sendInfo.orderbytype=0;
				}else if(e.detail.slideNumber == 1 && app.isDown == true){
					app.sendInfo.orderbykey='price';
					app.sendInfo.orderbytype=0;
				}else if(e.detail.slideNumber == 1 && app.isDown == false){
					app.sendInfo.orderbykey='price';
					app.sendInfo.orderbytype=1;
				}else{
					app.sendInfo.orderbykey='';
					app.sendInfo.orderbytype=2;
				}
				mui.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function(index, pullRefreshEl) {
					mui(this).pullToRefresh().refresh(true)
				});
				var data ={
				 		pageNo:1,
						pageAll:0,
						pageSize:10,
						orderbykey:'',
						orderbytype:0,
						name:''
				}
				NetUtil.ajax("/commodity/selectByName",{
					rows:data.pageSize,
					page:data.pageNo,
					orderbykey:app.sendInfo.orderbykey,
					orderbytype:app.sendInfo.orderbytype,
					name:app.sendInfo.name
				}, function(r) {
					console.log(r);
					if(r.status == 200) {
						app.infos=r.data;
					} else {
						mui.alert(r.message,function(){},'div')
					}
				});
			});
		}
	});
})();