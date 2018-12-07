(function(){	
	var $j = jQuery.noConflict(true);		
	var app = new Vue({
		el:'#app',
		data:{
			sendInfo:{			
				uname:'',
				password:'',
				type:'2',
				UID:localStorage.getItem('uuid')
			},
			psd:'',
			isNeedBack:false
		},
		methods:{
			turnTo:function(name,id,phoneNum){//id是下面113行跳转用的，避免重复创建
				mui.openWindow({
				    url:name+'.html?phoneNum='+phoneNum,
				    id:id,
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
		},
		created:function(){
			mui.init({
				swipeBack: false
			});
			if(location.search.split('=')[1]!=undefined){
				this.isNeedBack = true;
			}		
			mui.plusReady(function() {
				mui.back = function() {
					if(app.isNeedBack){
						plus.webview.currentWebview().close();
					}else{
						mui.confirm('是否退出应用',function(e){
					   		if (e.index == 0) {
	                      		plus.runtime.quit();
	                    	}	
					   	},'div')
					}
				   	
				}
			});
		},
		mounted:function(){
			mui('.mui-scroll-wrapper').scroll({
				deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
			});
			if(window.plus && mui.os.ios){
				var ws = plus.webview.currentWebview();
				ws.setStyle({
					softinputMode:'adjustResize',
				});			
			}
			/*表单验证*/
			$j("#loginFrom").Validform({
				tiptype: function(msg, o, cssctl) {
					//msg：提示信息;
					//o:{obj:*,type:*,curform:*},
					//obj指向的是当前验证的表单元素（或表单对象，验证全部验证通过，提交表单时o.obj为该表单对象），
					//type指示提示的状态，值为1、2、3、4， 1：正在检测/提交数据，2：通过验证，3：验证失败，4：提示ignore状态, 
					//curform为当前form对象;
					//cssctl:内置的提示信息样式控制函数，该函数需传入两个参数：显示提示信息的对象 和 当前提示的状态（既形参o中的type）;
					if(msg!=''){
						mui.toast(msg);	
					}	
				},
				btnSubmit: ".sureBtn",
				datatype: extdatatype,
				ajaxPost: true,
				tipSweep: true,
				postonce: true,
				beforeCheck: function() {
					
				},
				beforeSubmit: function() {
//					console.log(JSON.stringify(app.sendInfo));
//					app.sendInfo.memberPassword =  hex_md5(app.psd);
//					app.sendInfo.password = app.psd;
//					plus.nativeUI.showWaiting();
					NetUtil.ajax("/member/login",app.sendInfo,function(r) {
						
				        localStorage.setItem('address','定位中');
//						console.log(JSON.stringify(r));
						console.log(r);
//						plus.nativeUI.closeWaiting();
						if(r.status == '200'){
							localStorage.uname = app.sendInfo.uname;
							localStorage.memberId = r.data.id;
							localStorage.bindPhone = r.data.phone;
							localStorage.memberLoginSize = r.data.membersize;
							if(r.data.mShop){
								localStorage.shopId = r.data.mShop.id;
							}else{
								console.log(222);
							}
							var mine = plus.webview.getWebviewById('views/mine/mine.html');
							var home = plus.webview.getWebviewById('views/homePage/homeIndex.html');
							var classification = plus.webview.getWebviewById('views/classification/classification.html');
							var shopCart = plus.webview.getWebviewById('views/shoppingCart/shoppingCart.html');
							var commodityDetails = plus.webview.getWebviewById('commodityDetails.html');
							
							var index = plus.webview.getLaunchWebview();
							mui.fire(mine, 'changeP', {  
				                name: 'name2'  //传往second.html的值  
				           	});
							mui.fire(home, 'changeP', {  
				                name: 'name2'  //传往second.html的值  
				           	});
				           	mui.fire(classification, 'changeP', {  
				                name: 'name2'  //传往second.html的值  
				           	});
				           	mui.fire(shopCart, 'changeP', {  
				                name: 'name2'  //传往second.html的值  
				           	});
				           	mui.fire(index, 'locationToMine', {  
						        name: mine  //传往second.html的值  
						    });
						    if(commodityDetails){
						    	mui.fire(commodityDetails,'changeP',{});
						    }
//								var ws = plus.webview.getLaunchWebview().id;
//							app.turnTo('../../index',ws);
							var ws = plus.webview.currentWebview();
							plus.webview.close(ws);
						}else if(r.status == '-9'){
							localStorage.uname = app.sendInfo.uname;
							app.turnTo('guideChangePwd','guideChangePwd');
							this.isNeedBack = true;
							setTimeout(function(){
								app.sendInfo.password = '';
							},500);
						}else{
							mui.toast(r.message);
						}
//						plus.nativeUI.closeWaiting();
					});
					return false;//不使用validform的AJAX
				}
			});
			
		}
	});		 
})();
