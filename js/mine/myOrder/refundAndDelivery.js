(function(){	
	var $j = jQuery.noConflict(true);		
	var app = new Vue({
		el:'#app',
		data:{
			id:location.search.split('=')[1],
			sendInfo:{
				pageNo:1,
				pageAll:0,
				pageSize:10,
				type:'',			//0 全部  1已同意 -1已拒绝
				dataLength:'2',
			},
			infos: [],
			isNoMyOrder:true,		//有没有商品 没有商品的时候为false
		},
		methods:{
			turnTo:function(name,id,noXiaDan,orderId,differenceKey){
				mui.openWindow({
				    url:name+'.html?id='+id+'&&noXiaDan='+noXiaDan+'&&orderId='+orderId+'&&differenceKey='+'22',
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
//				console.log(this.sendInfo.type);
//				console.log(localStorage.shopId);
				NetUtil.ajax("/orders/ListReturnPhone",{
					status:this.sendInfo.type,
					rows:this.sendInfo.pageSize,
					page:this.sendInfo.pageNo,
					uname:localStorage.getItem('uname'),
					UID:localStorage.getItem('uuid')
				}, function(r) {
					console.log(r);

//					console.log(JSON.stringify(r));
					if(r.status == 200) {
						console.log(app.infos.length)
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
				})
				this.sendInfo.type = Obj.type;
				var width = $j('#sliderProgressBar').width() * Obj.type;
				return Obj; 
			},
			//拒绝退货
			noReturnGoods:function(id,mka,id2){
				if(mka != 1){
//					单品拒绝退货
					var btnArray = ['取消', '确定'];
				mui.prompt('拒绝退货','请输入拒绝退货原因',btnArray,function(e){
					if(e.index == 1){
						var refuse = e.value;
						if(refuse.length == 0){
							mui.toast('拒绝退货必须要填写原因');
						}else{
							app.refuseReturn(id2);
						}
					}else{
						console.log('取消了的');
					}
				},'div');
				}else{
				var btnArray = ['取消', '确定'];
				mui.prompt('拒绝退货','请输入拒绝退货原因',btnArray,function(e){
					if(e.index == 1){
						var refuse = e.value;
						if(refuse.length == 0){
							mui.toast('拒绝退货必须要填写原因');
						}else{
							app.sureAndReAjAx(id,refuse,'20','');
						}
					}else{
						console.log('取消了的');
					}
				},'div');}
			},
			//确认退货
			sureReturnGoods:function(id,mka,id2){
				console.log(id2)
				
				if(mka != 1){
					//单品确认退货
					console.log(id)
					var btnArray = ['取消','确定'];
				mui.confirm('确认退货',btnArray,function(e){
					if(e.index == 1){
						app.sureReturn(id2);
					
					}else{
						console.log('取消了');
					}
				},'div');
				}else{
				var btnArray = ['取消','确定'];
				mui.confirm('确认退货',btnArray,function(e){
					if(e.index == 1){
						app.sureAndReAjAx(id2,'','22','');
					}else{
						console.log('取消了');
					}
				},'div');}
			},
			//确认退仓
			sureReturnWarehouse:function(id,mka,id2){
				if( mka != 1){		
					console.log(id)
					//单品退仓
					var btnArray = ['取消', '确定'];
				mui.prompt('确认退仓','请输入物流单号',btnArray,function(e){
					if(e.index == 1){
						var refuse = e.value;
						if(refuse.length == 0){
							mui.toast('物流单号不能为空');
							console.log(123456)
						}else{
							console.log(654321)
							app.sureStorage(id2,refuse);
						}
					}else{
						console.log('取消了的');
					}
				},'div');
				}else{
				var btnArray = ['取消', '确定'];
				mui.prompt('确认退仓','请输入物流单号',btnArray,function(e){
					if(e.index == 1){
						var refuse = e.value;
						if(refuse.length == 0){
							mui.toast('物流单号不能为空');
						}else{
							app.sureAndReAjAx(id2,'','23',refuse);
						}
					}else{
						console.log('取消了的');
					}
				},'div');}
			},
			//确定退货，拒绝退货，确认退仓接口
			sureAndReAjAx:function(id,buyermesege,type,postfeenumber){
				console.log(id);
				console.log(buyermesege);
				console.log(type);
				console.log(postfeenumber);
				NetUtil.ajax('/orders/Return',{
					id:id,
					buyermesege:buyermesege,
					type:type,
					postfeenumber:postfeenumber,
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
				});
			},
			//单品退货确认
			sureReturn:function(id2){
				NetUtil.ajax('/Returngoods/Agree',{
					id:id2,
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
				});
			},
			//单品退货拒绝
			refuseReturn:function(id2){
				NetUtil.ajax('/Returngoods/refuse',{
					id:id2,
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
				});
			},
			//单品退仓
			sureStorage:function(id2,postfeenumber){
				NetUtil.ajax('/Returngoods/retreat',{
					id:id2,
					logistics:postfeenumber,
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
				});
			},
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
				if(e.detail.slideNumber == '2'){
					app.sendInfo.type = '20';
				}else if(e.detail.slideNumber == '0'){
					app.sendInfo.type = '21';
				}else if(e.detail.slideNumber == '1'){
					app.sendInfo.type = '22';
				}else if(e.detail.slideNumber == '3'){
					app.sendInfo.type = '0';
				}else{
					app.sendInfo.type = e.detail.slideNumber;
				}
				mui.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function(index, pullRefreshEl) {
					mui(this).pullToRefresh().refresh(true)
				});
				var data ={
				 		pageNo:1,
						pageAll:0,
						pageSize:10,
						type:app.sendInfo.type    //0 未处理  1已同意 -1已拒绝
				}
				NetUtil.ajax("/orders/ListReturnPhone",{
					status:app.sendInfo.type,
					rows:data.pageSize,
					page:data.pageNo,
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
//							console.log(app.infos);
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
