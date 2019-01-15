(function() {
	var $j = jQuery.noConflict(true);
	var app = new Vue({
		el: '#app',
		data: {
			isChoosePay:1,	//0 微信支付   1 支付宝支付
			JsonArray:[],
			modelId:'2',	//配送方式 1自提 2送货上门
			address:[],		//收货地址
			infos:[],		//商品
			sizeNum:'',		//上一个页面传过来的商品数量
			moneyAll:'',	//总金额
			moneyAllJisuan:'',	//总金额计算
			itemId:[],		//id
			itemIdCoupon:[],	//优惠券需要的id
			addressId:'',	//收货地址id
			addressIsTrue:'0',	//0代表有地址  1代表没有地址
			shopaddress:[],		//商铺收货地址
			orderId:'',		//订单ID
			isfreightRisk:false,	//是否选中运费险 
			freightMoney:'',		//运费
			freightMoneykouchu:'',		//运费扣除
			commodityPrice:'',		//商品总价
			couponTitle:'',			//优惠券
			couponid:'',
			couponArrayId:[],		//优惠券id组
			couponShow:true,		//优惠券显示
			qufenCouPonId:'',		//立即支付和普通
			isChooseModey:'1',		//选取配送方式
			postFeePostFee:'',		//所有运费钱
		},
		methods: {
			turnTo:function(name,id,data,isChoosePay){
				mui.openWindow({
				    url:name+'.html?data='+data+'&&isChoosePay='+isChoosePay,
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
			turnToAdd:function(name,id,typeId,onephone){
				mui.openWindow({
				    url:name+'.html?typeId='+typeId+'&&onephone='+onephone,
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
			//选择支付模式
			choosePay:function(index){
				this.isChoosePay = index;
//				console.log(index)
			},
			//获取URL后面的值
			getUrlObj:function () { //获取url？号后面的值，以对象的形式存在
				var strs = location.search.substr(1).split("&");			
				var Obj = {}; 
				strs.forEach(function(v,k){
					Obj[v.split("=")[0]]=decodeURI(v.split("=")[1]); 
				});
				if(Obj.id!=''&&Obj.id!=null&&Obj.id!=undefined){								//直接购买
					this.JsonArray.push(Obj.id);
					this.sizeNum=Obj.size;
					this.couponShow = true;
					this.qufenCouPonId = '';
				}else if(Obj.noXiaDan == 'noXiaDan'){
					this.JsonArray = JSON.parse(localStorage.getItem('settlementGoods'));			//我的订单页面过来的
					this.orderId = Obj.orderId;
					this.couponShow = false;
					this.qufenCouPonId = Obj.couponId;
				}else{
					this.JsonArray = JSON.parse(localStorage.getItem('settlementGoods'));			//购物车过来的
					this.couponShow = true;
					this.qufenCouPonId = '';
				}
//				this.JsonArray.push(Obj.id);
//				this.sizeNum=Obj.size;
				return Obj; 
			},
			//加载数据
			loadding:function(){
//				console.log(JSON.stringify(this.JsonArray));
//				plus.nativeUI.showWaiting();
				NetUtil.ajax('/Orderrelevance/selectbyCommodityid2',{
					JsonArray:JSON.stringify(this.JsonArray),
					size:this.sizeNum,
					couponid:this.qufenCouPonId,
					uname:localStorage.getItem('uname'),
					UID:localStorage.getItem('uuid')
				},function(r){
					console.log(r);
					if(r.status==200){
						app.infos = r.data.Array;
						app.moneyAll = r.data.numall;
						app.moneyAllJisuan = r.data.numall;
						app.shopaddress = r.data.shopaddress;
//						app.freightMoney = r.data.postfee;
//						app.freightMoneykouchu = r.data.postfee;
						app.commodityPrice = (r.data.numall-r.data.postfee).toFixed(2);
						var data = r.data.Array;
						var item = new Array;
						data.forEach(function(v,i){
							var itemData = v.data;
							itemData.forEach(function(a,s){
								item.push(a.itemid);
							})
						});
//						console.log(JSON.stringify(item));
						app.itemId = JSON.stringify(item);
						app.distributionMode('2');
					}else{
						mui.alert(r.message,function(){},'div');
					}
				})
			},
			//配送方式修改
			distributionMode:function(id){
				console.log(this.moneyAll);
				this.modelId = id;
				if(this.modelId == 2){
//					plus.nativeUI.showWaiting();
					NetUtil.ajax('/myaddress/selectdefault',{
						uname:localStorage.getItem('uname'),
						UID:localStorage.getItem('uuid')
					},function(r){
						console.log(JSON.stringify(r));
						if(r.status==200){
							if(r.data.length == 0){
								app.addressIsTrue = 1;
							}else{
								app.addressIsTrue = 0;
								r.data.forEach(function(v,i){
									v.phone = v.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
									app.addressId = v.id;
								});
								app.address = r.data;
							}
						}else{
							mui.alert(r.message,function(){},'div');
						}
					})
					this.isChooseModey = 1;
//					this.moneyAll = this.moneyAllJisuan;
				}else if(this.modelId == 3){
					mui.alert('请与导购确认门店是否有货,如无货此单为无效订单',function(e){
							app.isChooseModey = 3;
							var postFee = 0;
							for(var i=0;i<$j('.message').length;i++){
								postFee += parseFloat($j('.postFeessee').eq(i).html())
							}
							console.log(postFee);
							app.postFeePostFee = postFee;
//							app.moneyAll = parseFloat(app.moneyAllJisuan - postFee).toFixed(2);
					},'div');
				}else{
					this.isChooseModey = 1;
//					this.moneyAll = this.moneyAllJisuan;
				}
				console.log(this.isChooseModey);
			},
			//去支付
			goPayBtn:function(){
				if(this.orderId == ''){
					console.log(this.couponArrayId);
					console.log(this.infos[0].data[0].num);
					//支付宝或者微信下单
					//plus.nativeUI.showWaiting();
					NetUtil.ajax('/orders/orderrelevanceAdd2',{
						JsonArray:this.itemId,
						paymenttype:1,
						shippingtype:this.modelId,
						myaddressid:this.addressId,
						numsize:this.infos[0].data[0].num,
						couponArray:this.couponArrayId,
						uname:localStorage.getItem('uname'),
						UID:localStorage.getItem('uuid')
					},function(r){
						//plus.nativeUI.closeWaiting();
						console.log(r);
						if(r.status == 200){
							NetUtil.ajax('/orders/'+r.data+'',{
								uname:localStorage.getItem('uname'),
								UID:localStorage.getItem('uuid')
							},function(msg){
								if(msg.status==200){
									if(app.isChoosePay == 0 || app.isChoosePay == 1 ){
									app.turnTo('pay','pay',msg.data,app.isChoosePay);
									}else{
									app.turnTo('payHappy','payHappy',msg.data,app.isChoosePay);
							}
							}else{
								mui.alert(r.message,function(){},'div');
									}
								})
							}else{
								mui.alert(r.message,function(){},'div');
							}
								})
							}
				else if(app.isChoosePay == 0 || app.isChoosePay == 1 ){
					app.allpay()
				}else{
					app.happyPay()
				}
						},
						//订单号存在支付宝支付
						allpay:function(){
						NetUtil.ajax('/orders/'+this.orderId+'',{
							uname:localStorage.getItem('uname'),
							UID:localStorage.getItem('uuid')
						},function(msg){
						if(msg.status==200){
							console.log(msg);
							app.turnTo('pay','pay',msg.data,app.isChoosePay);
						}else{
							mui.alert(r.message,function(){},'div');
						}
					})
						},
						//快乐币支付
						happyPay:function(){
						NetUtil.ajax('/orders/'+this.orderId+'',{
						uname:localStorage.getItem('uname'),
						UID:localStorage.getItem('uuid')
					},function(msg){
						if(msg.status==200){
						app.turnTo('payHappy','payHappy',msg.data,app.isChoosePay);
//							console.log(msg);
//
//									NetUtil.ajax('/pay/'+msg.data+'',{
//										uname:localStorage.getItem('uname'),
//										UID:localStorage.getItem('uuid')
//									},function(data){
//										if(data.status==200){
////											console.log(data);
//											mui.alert(data.message,function(){},'div');
//										}else{
//											mui.alert(data.message);
//										}
//									})
						}else{
							mui.alert(r.message,function(){},'div');
						}
					})
				},
						
			//是否选中运费险
//			freightRisk:function(){
//				this.isfreightRisk = !this.isfreightRisk;
//				if(this.isfreightRisk == true){
//					this.moneyAll = this.moneyAll + this.freightMoney;
//				}else{
//					this.moneyAll = this.moneyAll;
//				}
//			},
			//选择优惠券
			goShopCoupon:function(data){
				console.log(data);
				var numberMoney = parseFloat(data.numall) - parseFloat(data.postfee);		//优惠券接口需要的订单金额
				console.log(data.onephone);
				console.log(numberMoney);
				var itemCoupon = new Array;
				data.data.forEach(function(v,i){
					itemCoupon.push(v.itemid);
				});
				this.itemIdCoupon = JSON.stringify(itemCoupon);
				localStorage.setItem('JsonArray',this.itemIdCoupon);
				this.turnToAdd('shopCoupon','shopCoupon',numberMoney,data.onephone);
			},
		},
		created: function() {
			this.getUrlObj();
			this.loadding();
			console.log(this.orderId)
			window.addEventListener('changeRefresh', function(e){//执行刷新
//			    location.reload();
				app.distributionMode('2');
			});
			window.addEventListener('chooseCouPon',function(e){
				var moneyAll = parseFloat(app.moneyAll).toFixed(2);
				console.log(app.isChooseModey);
				var moneyAllJisuan = parseFloat(app.moneyAllJisuan).toFixed(2);
				var moneyAllJisuan = parseFloat(app.moneyAllJisuan).toFixed(2);
				var numbera = e.detail.numbera;
//				app.couponid = e.detail.couponId;
//				app.couponTitle = e.detail.couponTitle;
				$j('.'+e.detail.onephone).html(e.detail.couponTitle);
				$j('.num'+e.detail.onephone).html(e.detail.couponId);
				$j('.numbera'+e.detail.onephone).val(e.detail.numbera);
				$j('.oneone'+e.detail.onephone).html(e.detail.onephone);
				var couponArrayId = new Array();
				var numberaMoney=0;
				for(var i=0;i<$j('.message').length;i++){
					if($j('.couponIdA').eq(i).html()!='' && $j('.couponIdA').eq(i).html() != null && $j('.couponIdA').eq(i).html() !=undefined){
						var arr ={
							"onephone":$j('.oneA').eq(i).html(),
							"couponid":$j('.couponIdA').eq(i).html()
						}
						couponArrayId.push(arr);
					}
//					console.log($j('.numberaA').eq(i).val());
					if($j('.numberaA').eq(i).val()!='' && $j('.numberaA').eq(i).val()!=null &&$j('.numberaA').eq(i).val()!=undefined){	
						numberaMoney += parseFloat($j('.numberaA').eq(i).val()); 
					}
				}
//				console.log(couponArrayId);
				app.couponArrayId = JSON.stringify(couponArrayId);
//				console.log(app.couponArrayId);
				app.moneyAll = (moneyAllJisuan - parseFloat(numberaMoney)).toFixed(2);
			})
		},
		/*金额过滤器*/
		filters:{
			moneyFiler:function(value){
				return "￥"+Number(value).toFixed(2);
			}
		},
		mounted: function() {
			mui.init();
			mui('.mui-scroll-wrapper').scroll({
				deceleration: 0.0006, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
				bounce: false,
				indicators: false
			});
		}
	});
}());