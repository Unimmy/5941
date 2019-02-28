(function() {
	var $j = jQuery.noConflict(true);
	var app = new Vue({
		el: '#app',
		data: {
			infos:[],
			sendInfo:{
				pageNo:1
			},
			showdiv:false,
			price_infos:[]  //实体奖品信息
		},
		methods: {
			pulldownRefresh: function() { //下拉刷新具体业务实现
				this.sendInfo.pageNo = 1;
				this.getInfo();	
			setTimeout(function(){
				mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
			},1000)
			},
			pullupRefresh: function() { //上拉加载具体业务实现
				this.sendInfo.pageNo++;
				NetUtil.ajax('/cj/select',{
						page:this.sendInfo.pageNo,
						uname:localStorage.getItem('uname'),
						UID:localStorage.getItem('uuid')
					},function(r){
						// console.log(JSON.stringify(r))
						if(r.status==200){
							if(r.data.length<=0){
							mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
							}else{
								mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
							}
							app.infos =app.infos.concat(r.data)
						}else{
							mui.alert(r.message,function () {},'div')
						}
					})
				
			
			},
			getInfo:function(){
				NetUtil.ajax('/cj/select',{
					page:this.sendInfo.pageNo,
					uname:localStorage.getItem('uname'),
					UID:localStorage.getItem('uuid')
				},function(r){
					// console.log(JSON.stringify(r))
					if(r.status==200){
						app.infos = r.data
					}else{
						mui.alert(r.message,function () {},'div')
					}
				})
			},
			// 获取实体奖品信息
			getTrueThing:function(){
					NetUtil.ajax('/Cj_address/select_jp',{
					rows:100,
					uname:localStorage.getItem('uname'),
					UID:localStorage.getItem('uuid')
				},function(r){
					console.log(JSON.stringify(r))
					if(r.status == 200){
						app.price_infos = r.data
					}else{
						mui.alert(r.message,function(){},'div')
					}
				})
			},
			// 显示隐藏的div并获取数据
			showhidediv:function(val){
				console.log(val)
				if(val==1){
					this.getTrueThing()
					this.showdiv = true
				}else{
					this.showdiv = false
				}
			}
		},
		created: function() {
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
		mounted: function() {
			mui('.mui-scroll-wrapper').scroll({
				deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
			});
		},
		filters: {
			getMyDate:function (str) {
		    var oDate = new Date(str),
		    oYear = oDate.getFullYear(),
		    oMonth = oDate.getMonth()+1,
		    oDay = oDate.getDate(),
		    oHour = oDate.getHours(),
		    oMin = oDate.getMinutes(),
		    oSen = oDate.getSeconds(),
		    oTime = oYear +'-'+oMonth +'-'+oDay +' '+oHour +':'+
			oMin +':'+oSen;
		    return oTime;
		},
		getType:function(val){
			if(val==1){
				return '积分抽奖';
			}else if(val == 2){
				return '活动抽奖';
			}else{
				return '资格获取';
			}
		}
		}
	});
})();