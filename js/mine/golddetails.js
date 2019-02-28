(function(){
	var $j = jQuery.noConflict(true);
	var app = new Vue({
		el:'#app',
		data:{
			goldcoin:'' , 	//积分
			cards:[],		//兑换券组
			infos:[],       //积分明细
			page:1			//分页
		},
		methods:{
			//查询积分
			selectTickets:function(){
				NetUtil.ajax("/member/selectinfo",{
					uname:localStorage.getItem('uname'),
					UID:localStorage.getItem('uuid')
				},function(r) {
					if(r.status == 200){
						app.goldcoin = r.data.goldcoin;
					}
				})
			},
			//查询明细
			selectCards:function(){
				NetUtil.ajax("/GoldcoinV/select_my",{
					page:this.page,
					uname:localStorage.getItem('uname'),
					UID:localStorage.getItem('uuid')
				},function(r) {
					app.infos =r.data;
				})
			},
			//下拉刷新
			pulldownRefresh:function(){
				this.selectCards();
				setTimeout(function(){
					mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
				},1000)
			},
			//上拉加载
			pullupRefresh:function(){
				this.page++;
				NetUtil.ajax("/GoldcoinV/select_my",{
					page:this.page,
					rows:10,
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
		},
		created:function(){
				this.selectTickets()
				this.selectCards()
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
					up : {
//					      height:50,//可选.默认50.触发上拉加载拖动距离
//					      auto:true,//可选,默认false.自动上拉加载一次
					      contentrefresh : "正在加载...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
					      contentnomore:'没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
					      callback : this.pullupRefresh//必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
					    }
				}
			});
		},
		mounted: function() {
		
		},
		filters:{
	　　　　　　myCurrency:function(str){
			 var addZero=function(num){
			    if(parseInt(num) < 10){
			        num = '0'+num;
			    }
			    return num;
			 }
			  var oDate = new Date(str),
			    oYear = oDate.getFullYear(),
			    oMonth = oDate.getMonth()+1,
			    oDay = oDate.getDate(),
			    oHour = oDate.getHours(),
			    oMin = oDate.getMinutes(),
			    oTime = oYear +'-'+ addZero(oMonth) +'-'+ addZero(oDay) +' '+ addZero(oHour) +':'+addZero(oMin)
	　　　　　　　　return oTime
	　　　　　　},
			jfdetail:function(str){
				if(str>0){return "+"+str}
				else {
					return str
				}
			}
　　　　}
	})
})()
