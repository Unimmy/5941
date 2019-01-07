(function(){	
	var $j = jQuery.noConflict(true);		
	var app = new Vue({
		el:'#app',
		data:{
			store:[],		//购物车商品
			shops:[],		//推荐商品
			ischeckedAll:false,
			num:0,
			editValue:true,		//编辑 
			totalMoney:0,		//总金额
			xiaoji:0,			//小计
			chooseNum:"",		//选中的个数
			settlementGoods:'',		//结算商品
			isNoShop:'',		//没有商品 true   有商品 false
			isShowshopCart:'0',	//0没有返回箭头  1有返回箭头
			isCheckS:false,
			page:1
		
		},
		methods:{
			turnTo:function(name,id,mk){
				mui.openWindow({
				    url:name+'.html?id='+id+'&&mk='+mk,
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
			/*跳转详情页面*/
			turnToX: function(name,id,type) {
				mui.openWindow({
					url: name + '.html?type=' + type,
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
			//获取URL后面的值
			getUrlObj:function () { //获取url？号后面的值，以对象的形式存在
				var strs = location.search.substr(1).split("&");			
				var Obj = {}; 
				strs.forEach(function(v,k){
					Obj[v.split("=")[0]]=decodeURI(v.split("=")[1]); 
				});
				if(Obj.isShowshopCart!=null && Obj.isShowshopCart!=undefined && Obj.isShowshopCart!=''){
					this.isShowshopCart=1;
				}else{
					this.isShowshopCart=0;
				}
				return Obj; 
			},
			/*商品数量增加减少函数*/
			goodNum:function(item,way,itemId){
				console.log(itemId);
				if(way == 1){
					 item.NUM++;
					 app.countTotalMoney();
					 NetUtil.ajax('/card/itemadd',{
					 	itemid:itemId,
					 	uname:localStorage.getItem('uname'),
					 	UID:localStorage.getItem('uuid')
					 },function(r){
//					 	console.log(r);
					 })
				}else{
					if(item.NUM < 2){
						item.NUM =1;
					}else{
						item.NUM--;
						app.countTotalMoney();
						NetUtil.ajax('/card/itemasubtract',{
							itemid:itemId,
						 	uname:localStorage.getItem('uname'),
						 	UID:localStorage.getItem('uuid')
						},function(r){
//						 	console.log(r);
						})
					}
					
				}
			},
			/*单选函数*/
			checkedRadioBtn:function(tabledatas,onephone){
				this.countTotalMoney();
				var length = $j("input[type='checkbox'][name='subcheck']:checked").length;
			   	var lengthSum = $j("input[type='checkbox'][name='subcheck']").length;
			   	var smaCheSum = $j('.checkInput'+onephone).length;
			   	var checkItems = $j('.checkInput'+onephone);
			   	var i = 0;
			   	for(var j=0; j<checkItems.length; j++){
				       if(checkItems[j].checked){               //如果该复选框被选中
				            i++;                            //统计被选中的个数
				      }
				
				}
			   	if(onephone != null && onephone != undefined){
			   		if(i == smaCheSum){
				   		tabledatas.checked = true;
				   	}else{
				   		tabledatas.checked = false;
				   	}
			   	}
			   	
			   	if(length == lengthSum){
			   		this.ischeckedAll = true;
			   		console.log(this);
			   	}else{
			   		this.ischeckedAll = false;
			   	}
			   	this.chooseNumFF(length);
			},
			/*全选函数*/
			checkedAllBtn:function(checkedAll){
				var _this= this;
				var lengthSum = $j("input[type='checkbox'][name='subcheck']").length;
				var checkcc = this.store;
				checkcc.forEach(function(v,k){
					/*全选计算商品或服务数量*/
					if(checkedAll == true){
						$j('.checkSmallAll').attr('checked','checked');
						v.checked = true;
						for(x in v.listmap){
							v.listmap[x].checked = true;
							if(_this.editValue == true){
						   		_this.chooseNum = "去结算("+lengthSum+")";
						   	}else{
						   		_this.chooseNum = "删除("+lengthSum+")";
						   	}
						}
					}else{
						$j('.checkSmallAll').removeAttr("checked");
						v.checked = false;
						for(y in v.listmap){
							v.listmap[y].checked = false;
							if(_this.editValue == true){
						   		_this.chooseNum = "去结算("+0+")";
						   	}else{
						   		_this.chooseNum = "删除("+0+")";
						   	}
						}
						
					}
				})
				this.countTotalMoney();
			},
			//小类全选
			checkedSmallBtn:function(data,classN){
				var listmap = data.listmap;
				console.log(data);
				if($j('.'+classN).prop("checked") == true){
					listmap.forEach(function(v,k){
						v.checked = true;
					})
					setTimeout(function(){
						var length = $j("input[type='checkbox'][name='subcheck']:checked").length;
						app.chooseNumFF(length);
						app.checkedRadioBtn();
					},0)
				}else{
					listmap.forEach(function(v,k){
						v.checked = false;
					})
					setTimeout(function(){
						var length = $j("input[type='checkbox'][name='subcheck']:checked").length;
						app.chooseNumFF(length);
						app.checkedRadioBtn();
					},0)
				}
				
			},
			/*计算商品总价函数*/
			countTotalMoney:function(){
				var _this = this;
				_this.totalMoney = 0;
				this.store.forEach(function(item,index){
					item.listmap.forEach(function(v,k){
						setTimeout(function(){
							if(v.checked == true){
								_this.totalMoney += v.NUM*v.PRICE;
							}
						},0)
					})
				})
			},
			//选中条数
			chooseNumFF:function(length){
			   	if(this.editValue == true){
			   		return this.chooseNum = "去结算("+length+")";
			   	}else{
			   		return this.chooseNum = "删除("+length+")";
			   	}
			},
			//编辑
			edit:function(){
				this.editValue = !this.editValue;
				var length = $j("input[type='checkbox'][name='subcheck']:checked").length;
				this.chooseNumFF(length);
			},
			//进来接收数据
			loadding:function(type,index){
//				plus.nativeUI.showWaiting();
				NetUtil.ajax('/card/select2',{
					page:'1',
					rows:'10',
					uname:localStorage.getItem('uname'),
					UID:localStorage.getItem('uuid')
				},function(r){
//					plus.nativeUI.closeWaiting();
//					console.log(r);
//					console.log(JSON.stringify(r));
					if(r.status==200){
						setTimeout(function(){
							mui('.mui-numbox').numbox();
						},0)
						app.store = r.data.data;
						var length = r.data.data.length;
						if(length == 0){
							app.isNoShop = true;
						}else{
							app.isNoShop = false;
						}
					}else{
						mui.alert(r.message,function(){},'div');
					}
				})
			},
			addClassName:function(index){
				return "mui-numbox" +index
			},
			//删除购物车
			delShop:function(){
				console.log(this.ischeckedAll);
				if(this.ischeckedAll == true){
					var btnArray = ['取消', '确定'];
					mui.confirm('你确定要清空购物车吗？','',btnArray,function(e){
						if(e.index == 1){
//							plus.nativeUI.showWaiting();
							NetUtil.ajax('/card/deleteall',{
								uname:localStorage.getItem('uname'),
								UID:localStorage.getItem('uuid')
							},function(r){
//								plus.nativeUI.closeWaiting();
								if(r.status==200){
									mui.alert(r.message,function(){
										app.loadding();	
										app.totalMoney=0;
										app.editValue = true;
										app.ischeckedAll=false;
										app.chooseNum = "去结算("+0+")";
									},'div');
								}else{
									mui.alert(r.message,function(){},'div');
								}
							})
						}else{
							
						}

					},'div')
				}else{
					var checkboxs = $j("input[type='checkbox'][name='subcheck']:checked");
					var chooseIdArray = new Array;
					checkboxs.each(function(v,i){
						var id = checkboxs[v].id;
						console.log(id);
						chooseIdArray.push(id);
					});
					console.log(chooseIdArray);
					if(checkboxs.length == 0){
						mui.alert('请选择要删除的商品',function(){},'div');
					}else{
						var btnArray = ['取消','确定'];
						mui.confirm('你确定要删除吗？','',btnArray,function(e){
							if(e.index == 1){
//								plus.nativeUI.showWaiting();
								NetUtil.ajax('/card/deletejson',{
									uname:localStorage.getItem('uname'),
									UID:localStorage.getItem('uuid'),
									JsonArray:JSON.stringify(chooseIdArray)
								},function(r){
									console.log(123);
									console.log(r);
//									plus.nativeUI.closeWaiting();
									if(r.status==200){
										mui.alert(r.message,function(){
//											location.reload(); 
											app.loadding();
											app.totalMoney=0;
											app.editValue = true;
											app.chooseNum = "去结算("+0+")";
										},'div');
									}else{
										mui.alert(r.message,function(){},'div');
									}
								})
							}else{
								
							}
						},'div')
					}
				}
			},
			//刷新购物车
			shopCartShuaXin:function(){
//				plus.nativeUI.showWaiting();
				NetUtil.ajax('/card/auto',{
					uname:localStorage.getItem('uname'),
					UID:localStorage.getItem('uuid')
				},function(r){
//					plus.nativeUI.closeWaiting();
					if(r.status == 200){
						app.loadding();
						app.pickWeek();
						app.ischeckedAll = false;
						app.totalMoney = 0;
					}else{
//						mui.alert(r.message);
					}
				})
			},
			//去结算 
			toSettleAccounts:function(){
				var checkboxs = $j("input[type='checkbox'][name='subcheck']:checked");
				var chooseIdArray = new Array;
				checkboxs.each(function(v,i){
					var id = checkboxs[v].id;
					chooseIdArray.push(id);
				});
				if(checkboxs.length == 0){
					mui.alert('请选择要结算的商品',function(){},'div');
				}else{
					chooseIdArray = JSON.stringify(chooseIdArray);
					console.log(chooseIdArray);
					localStorage.setItem('settlementGoods',chooseIdArray);
					this.turnTo('shopSettlement','');
				}
			},
			//底下推荐商品
			pickWeek:function(){
				//plus.nativeUI.showWaiting();
				NetUtil.ajax('/commodity/selectBySelect',{
					type:1,
					page:this.page,
					rows:20
				},function(r){
//					plus.nativeUI.closeWaiting();
					console.log(r);
					if(r.status == 200){
						app.shops =app.shops.concat(r.data) ;
					}else{
						mui.alert(r.message,function(){},'div');
					}
				})
			},
			//购物车返回详情页面刷新
			backCommodityDetail:function(id){
				this.turnToX('commodityDetails','commodityDetails',''+id+'');
				var comId = plus.webview.getWebviewById('commodityDetails.html');
				console.log(JSON.stringify(comId));
				console.log(JSON.stringify(id));
				mui.fire(comId,'comDetail',{
					"id":id
				});
			},
			//下拉刷新
			pulldownRefresh:function(){
				setTimeout(function(){
					app.shopCartShuaXin();
					mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
				},1500)
			},
//			pullupRefresh:function(){
//				this.page++
//				app.pickWeek()
//			}
			
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
						auto: false,
						callback: this.pulldownRefresh
                    },
//                  up: {
//                  	auto: false,
//						contentrefresh: '正在加载...',
//						contentnomore:'没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
//						callback: this.pullupRefresh
//                  }
                }
           });
//         this.shopCartShuaXin();
			mui.plusReady(function(){
				app.shopCartShuaXin();
			})
//			this.pickWeek();
			this.getUrlObj();
			if(this.editValue == true){
				this.chooseNum="去结算(0)";
			}else{
				this.chooseNum="删除(0)";
			}
			window.addEventListener('changeP', function(event) {
				app.shopCartShuaXin();
				console.log('shopCart刷新');
			}, false);
			//底部导航点击刷新
			window.addEventListener('shuaxinShopCart', function(event) {
				app.shopCartShuaXin();
				console.log('shopCart刷新');
			}, false);
//			console.log(this.store);
		},
		/*金额过滤器*/
		filters:{
			moneyFiler:function(value){
				return "￥"+Number(value).toFixed(2);
			}
		},
		mounted:function(){
			mui('.mui-scroll-wrapper').scroll({
				deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
			});
			mui('.mui-content').scroll({
				deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
			});
			
		}
	});		 
})();
