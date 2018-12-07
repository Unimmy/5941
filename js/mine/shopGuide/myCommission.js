(function(){	
	var $j = jQuery.noConflict(true);		
	var app = new Vue({
		el:'#app',
		data:{
			commissionMoney:'',		//已入账金额
			nocommissionMoney:'',	//未入账金额
			jiesuanMoney:'',		//结算金额
			mdCommissionMoney:'',	//门店已入账金额
			mdNocommissionMoney:'',	//门店未入账金额
			mdJiesuanMoney:'',		//门店已结算金额
			jxsCommissionMoney:'',	//经销商已入账金额
			jxsNocommissionMoney:'',	//经销商未入账金额
			jxsJiesuanMoney:'',		//经销商已结算金额
			xsdzCommissionMoney:'',	//线上店主已入账金额
			xsdzNocommissionMoney:'',	//线上店主未入账金额
			xsdzJiesuanMoney:'',		//线上店主已结算金额
			infos:[],
			identityType:'',		//身份状态 0门店店主 1.经销商 2.线上店主 3.导购
		},
		methods:{
			turnTo:function(name,id,type,key,typeName){//id是下面113行跳转用的，避免重复创建
				mui.openWindow({
				    url:name+'.html?type='+type+'&&key='+key+'&&typeName='+typeName,
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
				this.getInfo();
			},
			getInfo:function(type){
//				plus.nativeUI.showWaiting();
				NetUtil.ajax("/Recommend2",{
					uname:localStorage.getItem('uname'),
					UID:localStorage.getItem('uuid')
				}, function(r) {
					console.log(r);
					var data = r.data;
					//plus.nativeUI.closeWaiting();
					if(r.status == 200) {
						app.commissionMoney = data.a;
						app.nocommissionMoney = data.b;
						app.jiesuanMoney = data.c;
						app.mdCommissionMoney = data.suma;
						app.mdNocommissionMoney = data.sumb;
						app.mdJiesuanMoney = data.sumc;
						app.jxsCommissionMoney = data.sum1a;
						app.jxsNocommissionMoney = data.sum1b;
						app.jxsJiesuanMoney = data.sum1c;
						app.xsdzCommissionMoney = data.sum2a;
						app.xsdzNocommissionMoney = data.sum2b;
						app.xsdzJiesuanMoney = data.sum2c;
						app.identityType = data.type;
				 		mui('#pullrefresh').pullRefresh().refresh(true);
				 		mui('#pullrefresh').pullRefresh().endPulldownToRefresh(data.data.length<=0); 
				 		mui('#pullrefresh').pullRefresh().endPullupToRefresh(false); //参数为true代表没有更多数据了。
					} else {
						mui.alert(r.message,function(){
							mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
							mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
						},'div')
					}
				});
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
					}
				}
			});
		},
		filters:{
			moneyFiler:function(value){
				return "￥"+Number(value).toFixed(2);
			}
		},
		mounted:function(){
			mui('.mui-scroll-wrapper').scroll({
				deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006

			});
			
		}
	})		 
})();
