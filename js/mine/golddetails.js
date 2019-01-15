(function(){
	var $j = jQuery.noConflict(true);
	var app = new Vue({
		el:'#app',
		data:{
			goldcoin:'' , 	//积分
			cards:[],		//兑换券组
			infos:[]       //积分明细
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
			showMessage:function(){
				var message = '积分规则,积分规则,积分规则,积分规则,积分规则,积分规则,积分规则'
				mui.alert(message,function(){},'div')
			}
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
