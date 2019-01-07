(function(){	
	var $j = jQuery.noConflict(true);		
	var app = new Vue({
		el:'#app',
		data:{
			ketixianMoney:'',		//可提现金额
			shenqingMoney:'',	//申请提现金额
			lishiMoney:'',		//历史提现金额
			infos:[],
			sendInfo:{
				pageNo:1,
				pageAll:0,
				pageSize:10
			},
		},
		methods:{
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
			pulldownRefresh: function() { //下拉刷新具体业务实现
				NetUtil.ajax('/member/updatememberinfo',{
					uname:localStorage.getItem('uname'),
					UID:localStorage.getItem('uuid')
				},function(r){
					if(r.status==200){
							console.log("用户数据刷新成功")
					}
				})
				this.sendInfo.pageNo = 1;
				this.getInfo();
			},
			pullupRefresh: function() { //上拉加载具体业务实现
				this.sendInfo.pageNo++;
				this.getInfo('up');
			},
			getInfo:function(type){
//				plus.nativeUI.showWaiting();
				NetUtil.ajax("/Putforward/list",{
					page:this.sendInfo.pageNo,
					rows:this.sendInfo.pageSize,
					uname:localStorage.getItem('uname'),
					UID:localStorage.getItem('uuid')
				}, function(r) {
					console.log(r);
					var data = r.data;
					//plus.nativeUI.closeWaiting();
					if(r.status == 200) {
						app.ketixianMoney = data.suma;
						app.shenqingMoney = data.sumb;
						app.lishiMoney = data.sumc;
					 	if(type == 'up'){
					 		app.infos = app.infos.concat(data.list);
					 		console.log(data.list.length);
					 		if(data.list.length<=0){
					 			mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
							}else{
								mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
							}
//							app.sendInfo.pageAll = ~~(r.resData.count / app.sendInfo.pageSize) + 1;
//							mui('#pullrefresh').pullRefresh().endPullupToRefresh(app.sendInfo.pageNo > app.sendInfo.pageAll);
					 	}else{
					 		app.infos = data.list;	
					 		mui('#pullrefresh').pullRefresh().refresh(true);
					 		mui('#pullrefresh').pullRefresh().endPulldownToRefresh(data.list.length<=0); 
//					 		mui('#pullrefresh').pullRefresh().endPulldownToRefresh(app.sendInfo.pageNo > app.sendInfo.pageAll); //refresh completed
					 		mui('#pullrefresh').pullRefresh().endPullupToRefresh(false); //参数为true代表没有更多数据了。
					 	}
					} else {
						mui.alert(r.message,function(){
							mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
							mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
						},'div')
					}
				});
			},
			//提现
			putForward:function(){
				var btnArray = ['取消', '确定'];
				mui.prompt('提现金额','请输入您想提现的金额（整数）',btnArray,function(e){
					if(e.index == 1){
						var tMoney = e.value;
						var re = /^[0-9]+$/ ;	
						if(re.test(tMoney)){
							NetUtil.ajax('/Putforward/add',{
								num:tMoney,
								uname:localStorage.getItem('uname'),
								UID:localStorage.getItem('uuid')
							},function(r){
								console.log(r);
								if(r.status == 200){
									mui.alert(r.message,function(){
										app.pulldownRefresh();
									},'div');
								}else if(r.status == -2){
									mui.alert(r.message,function(){
										app.turnTo('cashAccountManagement','cashAccountManagement');
									},'div');
								}else{
									mui.alert(r.message,function(){},'div');
								}
							})
						}else{
							mui.toast('输入有误，请输入正整数');
						}
					}else{
						console.log('取消了的');
					}
				},'div');
			}
		},	
		created:function(){
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
						auto: true,
						callback: this.pulldownRefresh
					},
					up: {
						auto: false,
						contentrefresh: '正在加载...',
						callback: this.pullupRefresh
					}
				}
			});
		},
		filters:{
			moneyFiler:function(value){
				return "￥"+Number(value).toFixed(2);
			},
			timeFiler:function(str){
				var date = new Date(str);
				var dateTime ="";
				Y = date.getFullYear()+'-';
	            M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)+'-';
	            D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
	            h = date.getHours() + ':';
	            m = date.getMinutes();
	            s = date.getSeconds();
                dateTime = (Y + M + D + h + m);
            	return dateTime;
			}
		},
		mounted:function(){
			mui('.mui-scroll-wrapper').scroll({
				deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006

			});
			
		}
	})		 
})();
