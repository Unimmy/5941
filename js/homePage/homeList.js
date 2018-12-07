(function() {
	var $j = jQuery.noConflict(true);
	var app = new Vue({
		el: '#app',
		data: {
			title:'',
			bannerImg:'',
			infos: {},
			shops:[],
			sendInfo:{
				pageNo:1,
				pageAll:0,
				pageSize:10
			}
		},
		methods: {
			turnTo:function(name,id,type){
				mui.openWindow({
				    url:name+'.html?type='+type,
				    id:id+'.html',
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
				this.getUrlObj();
			},
			pullupRefresh: function() { //上拉加载具体业务实现
				this.sendInfo.pageNo++;
//				this.getInfo('up');
				this.getUrlObj('up');
			},
			//获取Url拼的参数
			getUrlObj:function (type) { //获取url？号后面的值，以对象的形式存在
				var strs = location.search.substr(1).split("&&");	
//				console.log(strs)
				var Obj = {}; 
				strs.forEach(function(v,k){
					Obj[v.split("=")[0]]=decodeURI(v.split("=")[1]); 
				});
				if(Obj.id=='homeList'){
					this.getInfo(type,'homeList',Obj.mk);
					this.getBannerAjax('3',Obj.mk,'');
					this.title = Obj.mk;
				}else if(Obj.id=='shopCart'){
					this.getInfo(type,'shopCart',Obj.mk);
					this.getBannerAjax('3',Obj.mk,'');
					this.title = '推荐商品';
				}else{
					this.title = Obj.id;
					this.getInfo(type,Obj.id);
					this.getBannerAjax('3',Obj.id,Obj.bys);
//					this.getBannerAjax('3','','');
				}
				return Obj; 
			},
			
			getInfo:function(type,name,indexs){
				if(name == 'homeList'){
					name = '';
					indexs = indexs;
				}else if(name == 'shopCart'){
					name = '';
					indexs = '';
				}else{
					name = name;
					indexs = '';
				}
				//plus.nativeUI.showWaiting();
				NetUtil.ajax("/commodity/selectBySelect",{
					page:this.sendInfo.pageNo,
					rows:this.sendInfo.pageSize,
					type:1,
					fineclass:name,
					indexs:indexs
				}, function(r) {
					console.log(r);
//					console.log(r.data.length);
					//plus.nativeUI.closeWaiting();
					if(r.status == 200) {				 	
					 	if(type == 'up'){
					 		app.shops = app.shops.concat(r.data);
					 		console.log(app.shops);
//							app.sendInfo.pageAll = ~~(r.resData.count / app.sendInfo.pageSize) + 1;
//							mui('#pullrefresh').pullRefresh().endPullupToRefresh(app.sendInfo.pageNo > app.sendInfo.pageAll);
//							mui('#pullrefresh').pullRefresh().endPullupToRefresh(r.data.length<=0);
							if(r.data.length<=0){
					 			mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
							}else{
								mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
							}
					 	}else{
					 		app.shops = r.data;	
					 		mui('#pullrefresh').pullRefresh().refresh(true);
					 		mui('#pullrefresh').pullRefresh().endPulldownToRefresh(r.data.length<=0); //refresh completed
					 		mui('#pullrefresh').pullRefresh().endPullupToRefresh(false); //参数为true代表没有更多数据了。
					 	}
					}else if(r.status == '-3'){
						mui.alert(r.message+'请重新登录',function(){
							app.turnTo('../../views/loginRegister/login','login');
						},'div');
					} else {
						mui.alert(r.message,function(){},'div')
					}
				});
			},
			getBannerAjax:function(key,name,bys){
				NetUtil.ajax('/Advertisement/select',{
					key:key,
					describe:name,
					bys:bys
				},function(msg){
					console.log(JSON.stringify(msg));
					if(msg.status == 200){
						app.bannerImg = server+msg.data[0].path;
					}else if(r.status == '-3'){
						mui.alert(r.message+'请重新登录',function(){
							app.turnTo('../../views/loginRegister/login','login');
						},'div');
					}else{
						
					}
				})
			},
			//判断是否登陆了的 登录了 跳转详情页面  没有登录 跳转登录页面
			isLogin:function(id){
				this.turnTo('../shoppingCart/commodityDetails','commodityDetails',id);
			}
		},
		created: function() {
			this.getUrlObj();
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
		mounted: function() {
			mui('.mui-scroll-wrapper').scroll({
				deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
			});
		}
	});
})();