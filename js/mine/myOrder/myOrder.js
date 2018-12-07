(function(){	
	var $j = jQuery.noConflict(true);		
	var app = new Vue({
		el:'#app',
		data:{
			id:location.search.split('=')[1],
			isShowReturnGoods:localStorage.getItem('isShowReturnGoods'),
			sendInfo:{
				pageNo:1,
				pageAll:0,
				pageSize:10,
				type:'',			//0 全部  1待付款 2.待发货 3.待收货 4.已完成
				dataLength:'2',
				
			},
			orderType:'',			//区分是个人还是商家
			infos: [],
			titleNum_pay:'1',		//导航栏数字   待付款
			titleNum_fah:'5',		//待发货
			titleNum_pj:'2',		//待评价
			titleNum_th:'3',		//待退货
			isNoMyOrder:false,		//有没有商品 没有商品的时候为false
		},
		methods:{
			turnTo:function(name,id,noXiaDan,orderId,orderType,couponId){
				mui.openWindow({
				    url:name+'.html?id='+id+'&&noXiaDan='+noXiaDan+'&&orderId='+orderId+'&&orderType='+this.orderType+'&&couponId='+couponId,
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
			getInfo:function(type){
				NetUtil.ajax("/orders/selectbymemberid",{
					rows:this.sendInfo.pageSize,
					page:this.sendInfo.pageNo,
					status:this.sendInfo.type,
					type:this.orderType,
					uname:localStorage.getItem('uname'),
					UID:localStorage.getItem('uuid')
				}, function(r) {
					console.log(r);
					console.log(JSON.stringify(r));
					if(r.status == 200) {
//						console.log(app.infos);
						if(r.data.length == 0 && app.infos.length == 0){
							app.isNoMyOrder = false;
						}else{
							app.isNoMyOrder = true;
							if(type == 'up'){
					 			app.infos = app.infos.concat(r.data);
					 			app.sendInfo.dataLength = r.data.length;
	//							app.sendInfo.pageAll = ~~(r.resData.canNotUseTicketPage.count / app.sendInfo.pageSize) + 1;
						 	}else{
	//					 		app.infos.canNotUseTicketPage = r.resData.canNotUseTicketPage.list;
								app.infos = r.data;	
	//					 		mui('#pullrefresh').pullRefresh().endPulldownToRefresh(app.sendInfo.pageNo > app.sendInfo.pageAll); //refresh completed
						 	}
						}
						
					} else {
						mui.alert(r.resDesc,function(){},'div')
					}
				});
			},
			//获取URL参数
			getUrlObj:function () { //获取url？号后面的值，以对象的形式存在
				var strs = location.search.substr(1).split("&");			
				var Obj = {}; 
				strs.forEach(function(v,k){
					Obj[v.split("=")[0]]=decodeURI(v.split("=")[1]); 
				});
				console.log(Obj.orderType);
				this.sendInfo.type = Obj.type;
				this.orderType = Obj.orderType;
				var width = $j('#sliderProgressBar').width() * Obj.type;
				return Obj; 
			},
			//删除订单
			deleteOrder:function(id){
				console.log(id);
				plus.nativeUI.showWaiting();
				NetUtil.ajax('/orders/delete',{
					id:id,
					uname:localStorage.getItem('uname'),
					UID:localStorage.getItem('uuid')
				},function(r){
					plus.nativeUI.closeWaiting();
					if(r.status == 200){
						mui.alert(r.message,function(){
							app.getInfo();
						},'div')
					}else{
						mui.alert(r.message,function(){},'div');
					}
				})
			},
			//立即付款			-->先调用订单详情页面查询各个商品id 然后弄成JSONArray存起来
			ImmediatePayment:function(id,couponId){
				//plus.nativeUI.showWaiting();
				NetUtil.ajax('/Orderrelevance/selectbyorderid',{
					orderid:id,
					uname:localStorage.getItem('uname'),
					UID:localStorage.getItem('uuid')
				},function(r){
					//plus.nativeUI.closeWaiting();
					console.log(r);
					if(r.status == 200){
						var data = r.data;
						var chooseIdArray = new Array;
						data.forEach(function(v,i){
							var id = JSON.stringify(v.id);
							console.log(id);
							chooseIdArray.push(id);
						})
						chooseIdArray = JSON.stringify(chooseIdArray);
						localStorage.setItem('settlementGoods',chooseIdArray);
						app.turnTo('../../shoppingCart/shopSettlement','','noXiaDan',id,'',couponId);
					}else{
						mui.alert(r.message,function(){},'div');
					}
				})
			},
			//再次购买
			buyAgain:function(id){
				console.log(id);
			},
			//确认收货
			confirmationReceipt:function(id){
				console.log(id);
				var btnArray = ['取消','确定'];
				mui.confirm('你确定已收到货了吗？','',btnArray,function(e){
					if(e.index == 1){
						//plus.nativeUI.showWaiting();
						NetUtil.ajax('/orders/Collectgoods',{
							id:id,
							uname:localStorage.getItem('uname'),
							UID:localStorage.getItem('uuid')
						},function(r){
						//plus.nativeUI.closeWaiting();
							console.log(JSON.stringify(r));
							if(r.status==200){
								mui.alert(r.message,function(){
									app.getInfo();
								},'div');
							}else{
								mui.alert(r.message,function(){},'div');
							}
						})
					}else{
						
					}
				},'div')
			},
			//商家确认收货
			Arrival:function(id){
				console.log(id);
				var btnArray = ['取消','确定'];
				mui.confirm('你确定已收到货了吗？','',btnArray,function(e){
					if(e.index == 1){
						//plus.nativeUI.showWaiting();
						NetUtil.ajax('/orders/Collectgoods1',{
							id:id,
							uname:localStorage.getItem('uname'),
							UID:localStorage.getItem('uuid')
						},function(r){
						//plus.nativeUI.closeWaiting();
							console.log(JSON.stringify(r));
							if(r.status==200){
								mui.alert(r.message,function(){
									app.getInfo();
								},'div');
							}else{
								mui.alert(r.message,function(){},'div');
							}
						})
					}else{
						
					}
				},'div')
			},
			//商家确认发货
			sendDeliver:function(id){
				console.log(id);
				var btnArray = ['取消','确定'];
				mui.confirm('是否确定发货？','',btnArray,function(e){
					if(e.index == 1){
						//plus.nativeUI.showWaiting();
						NetUtil.ajax('/orders/Delivergoods',{
							id:id,
							uname:localStorage.getItem('uname'),
							UID:localStorage.getItem('uuid')
						},function(r){
						//plus.nativeUI.closeWaiting();
							console.log(JSON.stringify(r));
							if(r.status==200){
								mui.alert(r.message,function(){
									app.getInfo();
								},'div');
							}else{
								mui.alert(r.message,function(){},'div');
							}
						})
					}else{
						
					}
				},'div')
			},
			//支付完成，未发货时退单
			deleteRefund:function(id){
				var ajaxUrl = '/orders1/'+id;
				NetUtil.ajax(ajaxUrl,{
					uname:localStorage.getItem('uname'),
					UID:localStorage.getItem('uuid')
				},function(r){
					if(r.status == 200){
						mui.alert(r.message,function(){
							app.getInfo();
						},'div');
					}else{
						mui.alert(r.message,function(){},'div');
					}
				})
			},
			//退货
			returnGoods:function(id){
				var btnArray = ['取消', '确定'];
				mui.prompt('申请退货','请输入申请退货的原因',btnArray,function(e){
					if(e.index == 1){
						var refuse = e.value;
						console.log(id);
						console.log(refuse);
						NetUtil.ajax('/orders/Return',{
							id:id,
							buyermesege:refuse,
							uname:localStorage.getItem('uname'),
							UID:localStorage.getItem('uuid')
						},function(data){
							console.log(data);
							if(data.data == 200){
								mui.alert(data.message,function(){
									app.getInfo();
								},'div');
							}else{
								mui.alert(data.message,function(){},'div');
							}
						})
					}else{
						console.log('取消了的');
					}
				},'div');
			}
		},
		created:function(){
			mui.init({
				swipeBack: false
			});
			this.getUrlObj();
			this.getInfo();
			mui.ready(function() {
				//循环初始化所有下拉刷新，上拉加载。
				mui.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function(index, pullRefreshEl) {
					mui(pullRefreshEl).pullToRefresh({
						down: {
							callback: function() {
								var self = this;
								app.sendInfo.pageNo = 1;
								setTimeout(function() {
									app.getInfo();
									self.endPullDownToRefresh();
									self.endPullUpToRefresh(false);
									self.refresh(true);
								}, 1000);
							}
						},
						up: {
							callback: function() {
								var self = this;
								app.sendInfo.pageNo++;
								setTimeout(function() {		
									self.endPullUpToRefresh(app.sendInfo.dataLength<=0);
									if(app.sendInfo.dataLength>0) {
										app.getInfo('up');
									}	
								}, 1000);
							}
						}
					});
				});
//				mui.back = function() {
//				   	if(this.id != 'fromFriend'){
//				   		var opener = plus.webview.getWebviewById('loanApplication.html')
//				   		mui.fire(opener,'sendTicekdId',app.checkedTicked);
//				   		plus.webview.currentWebview().close();
//				   	}
//				}
			});
		},
		mounted:function(){
			//阻尼系数
//			var deceleration = mui.os.ios?0.003:0.0009;
//			mui('.mui-scroll-wrapper').scroll({
//				bounce: false,
//				indicators: true, //是否显示滚动条
//				deceleration:deceleration
//			});		
			mui('.mui-scroll-wrapper').scroll({
				deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
			});
			document.getElementById('slider').addEventListener('slide', function(e) {
				app.sendInfo.type = e.detail.slideNumber;
				mui.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function(index, pullRefreshEl) {
					mui(this).pullToRefresh().refresh(true)
				});
//				console.log(app.sendInfo.type)
				var data ={
				 		pageNo:1,
						pageAll:0,
						pageSize:10,
						type:app.sendInfo.type    //0 全部  1待付款 2.待发货 3.待收货 4.已完成
				}
				NetUtil.ajax("/orders/selectbymemberid",{
					rows:data.pageSize,
					page:data.pageNo,
					status:app.sendInfo.type,
					type:app.orderType,
					uname:localStorage.getItem('uname'),
					UID:localStorage.getItem('uuid')
				}, function(r) {
					console.log(r);
					if(r.status == 200) {
						if(r.data.length == 0){
							app.isNoMyOrder = false;
						}else{
							app.isNoMyOrder = true;
							app.infos=r.data;
							console.log(app.infos);
						}
					} else {
						mui.alert(r.message,function(){},'div')
					}
				});
			});
//			if(this.id != 'fromFriend'){
//				$j("#item1mobile").on("tap","li",function(){
//					var this_check=$j(this).find("div.checkIcon");
//					app.checkedTicked.id = $j(this).attr('data-id')  ;
//					app.checkedTicked.money = $j(this).attr('data-money')  ;
//					this_check.addClass("checkedIcon").parents().siblings().find("div.checkIcon").removeClass("checkedIcon");
//				});
//			}			
		}

	});		 
})();
