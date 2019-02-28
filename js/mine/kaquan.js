 (function(){
	var $j = jQuery.noConflict(true);
	var app = new Vue({
		el:'#app',
		data:{
			infos:[],
			page:1,
			showopen:false,
			usercode:'',//实体卡卡号
			userpwd:''//实体卡密码
		},
		methods:{
			//跳转
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
			//查询卡片数量
			selectTickets:function(){
				NetUtil.ajax("/OrdersCard/list",{
					page:this.page,
					uname:localStorage.getItem('uname'),
					UID:localStorage.getItem('uuid')
				},function(r) {
					// console.log(JSON.stringify(r))
					app.infos =r.data;
				})
			},
			//下拉刷新
			pulldownRefresh:function(){
				this.page =1
				this.selectTickets();
				setTimeout(function(){
					mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
				},1000)
			},
			//上拉加载跟多
			pullupRefresh:function(){
				this.page++;
				NetUtil.ajax("/OrdersCard/list",{
					page:this.page,
					uname:localStorage.getItem('uname'),
					UID:localStorage.getItem('uuid')
				},function(r) {
					app.infos =app.infos.concat(r.data);
					if(r.data.length<=0){
					 	mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
					}else{
						mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
					}
				})
				mui('#pullrefresh').pullRefresh().disablePullupToRefresh();
			},
			hidediv:function(type){
				if(type=='open'){
					this.showopen = true
				}
				if(type=='close'){
					this.showopen = false
				}
			},
			// 实体卡绑定
			binding:function(){
				NetUtil.ajax('/OrdersCard/binding',{
					code:this.usercode,
					pwd:this.userpwd,
					uname:localStorage.getItem('uname'),
					UID:localStorage.getItem('uuid')
				},function(r){
					console.log(JSON.stringify(r))
					mui.alert(r.message,function(){
						if(r.message=='卡号不可为空'){
							return
						}else{
							var page = plus.webview.currentWebview();
							 page.reload(true);
						}
						app.showopen = false
					},'div')
				})
			}
		},
		created:function(){
				this.selectTickets() 
				mui.init({
				swipeBack: false,
				pullRefresh: {
					container: '#pullrefresh',
					down: {
						style:'circle',
						color:'#ff5930',
						offset:'44px',
						contentdown: "下拉可以刷新", //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
						contentover: "释放立即刷新", //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
						contentrefresh: "正在刷新...", //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
						auto: false,
						callback: this.pulldownRefresh
					},
					up: {
						auto: false,
						contentrefresh: '正在加载...',
						contentnomore:'没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
						callback: this.pullupRefresh
					}
				}
			});
		},
		mounted: function() {
		
		}
	})
})()
