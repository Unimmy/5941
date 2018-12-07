(function(){	
	var $j = jQuery.noConflict(true);		
	var app = new Vue({
		el:'#app',
		data:{
			customer:[],
			sendInfo:{
				pageNo:1,
				pageAll:0,
				pageSize:10
			}
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
			pulldownRefresh: function() { //下拉刷新具体业务实现
				this.sendInfo.pageNo = 1;
//				this.getInfo();
				this.getInfo();
			},
			pullupRefresh: function() { //上拉加载具体业务实现
				this.sendInfo.pageNo++;
//				this.getInfo('up');
				this.getInfo('up');
			},
			getInfo:function(type){
				//plus.nativeUI.showWaiting();
				NetUtil.ajax("/Returngoods/selectallbymemberid1",{
					page:this.sendInfo.pageNo,
					rows:this.sendInfo.pageSize,
					uname:localStorage.getItem('uname'),
					UID:localStorage.getItem('uuid')
				}, function(r) {
					console.log(r);
//					console.log(r.data.length);
					//plus.nativeUI.closeWaiting();
					if(r.status == 200) {				 	
					 	if(type == 'up'){
					 		app.customer = app.customer.concat(r.data);
					 		console.log(app.customer);
							if(r.data.length<=0){
					 			mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
							}else{
								mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
							}
					 	}else{
					 		app.customer = r.data;	
					 		mui('#pullrefresh').pullRefresh().refresh(true);
					 		mui('#pullrefresh').pullRefresh().endPulldownToRefresh(r.data.length<=0); //refresh completed
					 		mui('#pullrefresh').pullRefresh().endPullupToRefresh(false); //参数为true代表没有更多数据了。
					 	}
					}else {
						mui.alert(r.message,function(){},'div')
					}
				});
			},
			
		},
		created:function(){
			this.getInfo();
			mui.init({
				swipeBack: false,
				pullRefresh: {
					container: '#pullrefresh',
					down: {//下拉刷新
						style: 'circle',
						color:'#ff4200',
						offset: '44px',
						contentdown: "下拉可以刷新", //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
						contentover: "释放立即刷新", //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
						contentrefresh: "正在刷新...", //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
						auto: false,
						callback: this.pulldownRefresh
					},
					up: {//上拉加载
						auto: false,
						contentrefresh: '正在加载...',
						contentnomore:'没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
						callback: this.pullupRefresh
					}
				}
			});
		},
		mounted:function(){
			mui('.mui-scroll-wrapper').scroll({
				deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006

			});
			
			/*轮播*/
			var swiper = new Swiper('.swiper-container', {
				pagination: '.swiper-pagination',
				grabCursor: true,
//				loop: true,
				observer: true, //修改swiper自己或子元素时，自动初始化swiper
				observeParents: true, //修改swiper的父元素时，自动初始化swiper
				autoplay: false,
				fade: {
					crossFade: true,
				}
			})
			
		}
	});		 
})();
