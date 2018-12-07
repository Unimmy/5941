(function(){	
	var $j = jQuery.noConflict(true);		
	var app = new Vue({
		el:'#app',
		data:{
			id:location.search.split('=')[1],
			sendInfo:{
				pageNo:1,
				pageAll:0,
				pageSize:10,
				type:'',			//0未使用 1 已使用
				carddate:'0',		//0未过期  1已过期
				dataLength:'2',
			},
			infos: [],
			isNoMyOrder:false,		//有没有商品 没有商品的时候为false
		},
		methods:{
			turnTo:function(name,id,noXiaDan,orderId){
				mui.openWindow({
				    url:name+'.html?id='+id+'&&noXiaDan='+noXiaDan+'&&orderId='+orderId,
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
			getInfo:function(type){
				console.log(this.sendInfo.type);
				NetUtil.ajax("/Coupon/select",{
					rows:this.sendInfo.pageSize,
					page:this.sendInfo.pageNo,
					state:this.sendInfo.type,
					carddate:this.sendInfo.carddate,
					web:'2',
					uname:localStorage.getItem('uname'),
					UID:localStorage.getItem('uuid')
				}, function(r) {
					console.log(r);
//					console.log(JSON.stringify(r));
					if(r.status == 200) {
						if(r.data.length == 0 && app.infos.length == 0){
							app.isNoMyOrder = false;
						}else{
							app.isNoMyOrder = true;
							if(type == 'up'){
					 			app.infos = app.infos.concat(r.data);
					 			app.sendInfo.dataLength = r.data.length;
	//							app.sendInfo.pageAll = ~~(r.resData.canNotUseTicketPage.count / app.sendInfo.pageSize) + 1;
						 	}else{
	//					 		app.infos.canNotUseTicketPage = r.resData.canNotUseTicketPage.list;
								app.infos = r.data;	
	//					 		mui('#pullrefresh').pullRefresh().endPulldownToRefresh(app.sendInfo.pageNo > app.sendInfo.pageAll); //refresh completed
						 	}
						}
						
					} else {
						mui.alert(r.resDesc,function(){},'div')
					}
				});
			},
			//获取URL参数
			getUrlObj:function () { //获取url？号后面的值，以对象的形式存在
				var strs = location.search.substr(1).split("&");			
				var Obj = {}; 
				strs.forEach(function(v,k){
					Obj[v.split("=")[0]]=decodeURI(v.split("=")[1]); 
				})
				this.sendInfo.type = Obj.type;
				var width = $j('#sliderProgressBar').width() * Obj.type;
				return Obj; 
			},
		},
		created:function(){
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
									self.endPullUpToRefresh(app.sendInfo.dataLength<=0);
									if(app.sendInfo.dataLength>0) {
										app.getInfo('up');
									}	
								}, 1000);
							}
						}
					});
				});
//				mui.back = function() {
//				   	if(this.id != 'fromFriend'){
//				   		var opener = plus.webview.getWebviewById('loanApplication.html')
//				   		mui.fire(opener,'sendTicekdId',app.checkedTicked);
//				   		plus.webview.currentWebview().close();
//				   	}
//				}
			});
		},
		mounted:function(){
			//阻尼系数
//			var deceleration = mui.os.ios?0.003:0.0009;
//			mui('.mui-scroll-wrapper').scroll({
//				bounce: false,
//				indicators: true, //是否显示滚动条
//				deceleration:deceleration
//			});		
			mui('.mui-scroll-wrapper').scroll({
				deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
			});
			document.getElementById('slider').addEventListener('slide', function(e) {
				app.sendInfo.type = e.detail.slideNumber;
				if(e.detail.slideNumber == '0'){
					app.sendInfo.type = 0;
					app.sendInfo.carddate = 0;
				}else if(e.detail.slideNumber == '1'){
					app.sendInfo.type = 1;
					app.sendInfo.carddate = -1;
				}else{
					app.sendInfo.type = -1;
					app.sendInfo.carddate = 1;
				}
				mui.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function(index, pullRefreshEl) {
					mui(this).pullToRefresh().refresh(true)
				});
				var data ={
				 		pageNo:1,
						pageAll:0,
						pageSize:10,
						type:app.sendInfo.type,    //0未使用 1 已使用
						carddate:app.sendInfo.carddate		//0未过期  1已过期
				}
				NetUtil.ajax("/Coupon/select",{
					rows:data.pageSize,
					page:data.pageNo,
					state:app.sendInfo.type,
					carddate:app.sendInfo.carddate,
					web:'2',
					uname:localStorage.getItem('uname'),
					UID:localStorage.getItem('uuid')
				}, function(r) {
					console.log(r);
					if(r.status == 200) {
						if(r.data.length == 0){
							app.isNoMyOrder = false;
						}else{
							app.isNoMyOrder = true;
							app.infos=r.data;
//							console.log(app.infos);
						}
					} else {
						mui.alert(r.message,function(){},'div')
					}
				});


			});			
		}

	});		 
})();
