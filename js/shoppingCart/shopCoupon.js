(function(){	
	var $j = jQuery.noConflict(true);		
	var app = new Vue({
		el:'#app',
		data:{
			shopMoney:'',	//金额
			onephone:'',	//供应商账号
			infos:[],		
			isNoMyOrder:true,
		},
		methods:{
			//获取URL后面的值
			getUrlObj:function () { //获取url？号后面的值，以对象的形式存在
				var strs = location.search.substr(1).split("&");			
				var Obj = {}; 
				strs.forEach(function(v,k){
					Obj[v.split("=")[0]]=decodeURI(v.split("=")[1]); 
				});
				this.shopMoney = Obj.typeId;
				this.onephone = Obj.onephone;
				return Obj; 
			},
			//接受数据
			loadding:function(){
				console.log(this.shopMoney);
				console.log(localStorage.getItem('JsonArray'));
				NetUtil.ajax('/Coupon/istrue',{
					JsonArray:localStorage.getItem('JsonArray'),
					number:this.shopMoney,
					onephone:this.onephone,
					uname:localStorage.getItem('uname'),
					UID:localStorage.getItem('uuid')
				},function(r){
					console.log(r);
					if(r.status == 200){
						if(r.data.length == 0){
							app.isNoMyOrder = false;
						}else{
							app.isNoMyOrder = true;
							app.infos = r.data;
						}
					}else{
						mui.alert(r.message,function(){},'div');
					}
				})
			},
			//下拉刷新
			pulldownRefresh:function(){
				setTimeout(function(){
					app.loadding();
					mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
				},1500)
			},
			//选中
			chooseCouPon:function(couponId,couponTitle,numbera){
				var shopCoupon = plus.webview.getWebviewById('shopCoupon.html');
				var shopSettlement = plus.webview.getWebviewById('shopSettlement.html');
				mui.fire(shopSettlement, 'chooseCouPon', {  
	                couponId: couponId,
	                couponTitle:couponTitle,
	                numbera:numbera,
	                onephone:this.onephone
	           	});
	           	plus.webview.close(shopCoupon);
	           	console.log(shopSettlement);
			}
		},
		created:function(){
  			mui.init({
  				swipeBack: false,
                pullRefresh: {
                    container: '#pullrefresh',
                    down: {
//                      style: 'circle',
						color:'#ff4200',
						offset: '44px',
						contentdown: "下拉可以刷新", //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
						contentover: "释放立即刷新", //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
						contentrefresh: "正在刷新...", //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
						auto: false,
						callback: this.pulldownRefresh
                    },
                }
          	});
			this.getUrlObj();
			this.loadding();
		},
		/*金额过滤器*/
		filters:{
			moneyFiler:function(value){
				return "￥"+Number(value);
			}
		},
		mounted:function(){
			mui('.mui-content').scroll({
				deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
			});
			
		}
	});		 
})();
