(function() {
	var $j = jQuery.noConflict(true);
	var app = new Vue({
		el: '#app',
		data: {
			infos:[],
			sendInfo:{
				pageNo:1,
				pageAll:0,
				pageSize:10
			},
			identityC:false,		//选择身份
			identityName:'普通用户',		//标题名
			status:'4', 			//状态码
			infosStr:[],
			
		},
		methods: {
			pulldownRefresh: function() { //下拉刷新具体业务实现
				this.sendInfo.pageNo = 1;
				this.getInfo();
				console.log(this.status)
			},
			pullupRefresh: function() { //上拉加载具体业务实现
				this.sendInfo.pageNo++;
				this.getInfo('up');
			},
			getInfo:function(type){
//				plus.nativeUI.showWaiting();
				NetUtil.ajax("/Identity/FriendsBytype",{
					page:this.sendInfo.pageNo,
					rows:this.sendInfo.pageSize,
					type:this.status,
					uname:localStorage.getItem('uname'),
					UID:localStorage.getItem('uuid')
				}, function(r) {
					console.log(r);
					//plus.nativeUI.closeWaiting();
					if(r.status == 200) {
					 	var data = r.data;
					 	if(type == 'up'){
					 		app.infos = app.infos.concat(r.data);
					 		console.log(r.data.length);
					 		if(r.data.length<=0){
					 			mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
							}else{
								mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
							}
//							app.sendInfo.pageAll = ~~(r.resData.count / app.sendInfo.pageSize) + 1;
//							mui('#pullrefresh').pullRefresh().endPullupToRefresh(app.sendInfo.pageNo > app.sendInfo.pageAll);
					 	}else{
					 		app.infos = r.data;	
					 		mui('#pullrefresh').pullRefresh().refresh(true);
//							mui('#pullrefresh').pullRefresh().refresh(false);
					 		mui('#pullrefresh').pullRefresh().endPulldownToRefresh(r.data.length<=0); 
//					 		mui('#pullrefresh').pullRefresh().endPulldownToRefresh(app.sendInfo.pageNo > app.sendInfo.pageAll); //refresh completed
					 		mui('#pullrefresh').pullRefresh().endPullupToRefresh(false); //参数为true代表没有更多数据了。
					 	}
					} else {
						mui.alert(r.message,function(){},'div')
					}
				});
			},
			//时间戳转时间
			timestampToTime:function(timestamp){
//				var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
		        var date = new Date(timestamp);
		        Y = date.getFullYear() + '-';
		        M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
		        D = date.getDate() + ' ';
		        h = date.getHours() + ':';
		        m = date.getMinutes();
		        s = date.getSeconds();
		        return Y+M+D+h+m;
			},
			modifyName:function(id){
				var btnArray = ['取消', '确定'];
				mui.prompt('修改备注名','请输入您想要修改的备注名称',btnArray,function(e){
					if(e.index == 1){
						var bzName = e.value;
						console.log(id);
						console.log(bzName);
						console.log(bzName.length);
						if(bzName.length>6){
							mui.alert('备注名长度要小于6位',function(){},'div');
						}else{
							NetUtil.ajax('/FriendsBz',{
								id:id,
								bz:bzName,
								uname:localStorage.getItem('uname'),
								UID:localStorage.getItem('uuid')
							},function(r){
								console.log(r);
								if(r.status == 200){
									mui.alert(r.message,function(){
										app.pulldownRefresh();
									},'div');
								}else{
									mui.alert(r.message,function(){},'div');
								}
							})
						}
					}else{
						console.log('取消了的');
					}
				},'div');
			},
			//身份选择
			chooseIdentity:function(){
				this.identityC = true;
				NetUtil.ajax('/Identity/FriendsType',{
					page:this.sendInfo.pageNo,
					rows:this.sendInfo.pageSize,
					uname:localStorage.getItem('uname'),
					UID:localStorage.getItem('uuid')
				},function(r){
					if(r.status == 200){
						app.infosStr = r.data;
					}else{
						mui.alert(r.message,function(){},'div');
					}
				})
			},
			//去掉遮罩层
			hideIdentity:function(){
				this.identityC = false;
				console.log('取消遮罩');
			},
			//选择
			chooseIden:function(status,str){
				this.identityName = str;
				this.status = status;
				NetUtil.ajax('/Identity/FriendsBytype',{
					type:status,
					uname:localStorage.getItem('uname'),
					UID:localStorage.getItem('uuid')
				},function(r){
					if(r.status == 200){
						app.infos = r.data;
						app.identityC = false;
					}else{
						mui.alert(r.message,function(){
							app.identityC = false;
						},'div');
					}
				})
			}
		},
		created: function() {
			this.getInfo();
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
					up: {
						auto: false,
						contentrefresh: '正在加载...',
						callback: this.pullupRefresh
					}
				}
			});
		},
		mounted: function() {

		}
	});
})();