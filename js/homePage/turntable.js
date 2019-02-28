(function(){	
	var app = new Vue({
		el:'#app',
		data:{
			infos:[],
			select_max:0 ,// 剩余免费抽奖次数
			cjtitle:''		,//抽奖出的东西
			M_NUM:'',		//使用积分
			imgs:[],
			goldcoin:''		//积分
		},
		methods:{
			turnTo:function(name,id){
				mui.openWindow({
				    url:name+'.html',
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
			//进页面加载内容
			loadding:function(){
		            $('#redux').eraser({
		                size: 80,   //设置橡皮擦大小
		                completeRatio: .3, //设置擦除面积比例
		                completeFunction: showResetButton   //大于擦除面积比例触发函数
		            });
		            function showResetButton() {
						NetUtil.ajax('/cj/add',
						{
							jc_bh:1,
							uname:localStorage.getItem('uname'),
							UID:localStorage.getItem('uuid')
						},
						function(r){
							if(r.status==200){
									app.cjtitle = r.data.TITLE 
									if ( r.data.TITLE != "谢谢参与") {
										$(".main_box .hint-show,.main_box .mask").fadeIn(300)
									}else{
										$('.thanks').fadeIn(300)
									}
										}else{
											mui.alert(r.message,function (e) {},'div')
										}
							console.log(JSON.stringify(r))
						})
				            }
				            $(".main_box .mask,.main_box .hint-show .close").click(function () {
				                $(".main_box .hint-show,.main_box .mask").fadeOut(300);
				            });
							$(".main_box .hint-show .btn").click(function(){
								   $(".main_box .hint-show,.main_box .mask").fadeOut(300);
							});
							$(".thanks .mui-btn-danger").click(function(){
								$('.thanks').fadeOut(300)
							})
				       
			},
			//查询免费抽奖次数
			loadjf:function(){
				NetUtil.ajax('/cj/select_max',{
					bh:'1',
					uname:localStorage.getItem('uname'),
					UID:localStorage.getItem('uuid')
				},function(r){			
					console.log(JSON.stringify(r))
					if(r.message=='登录超时'){
						mui.alert(r.message,function(){
							  var page = plus.webview.currentWebview();
							  page.close()
						},'div')
						return
					}
					if(r.data=="0"){
					app.select_max = 0; 
					app.loadding();
					}else{
						app.select_max = r.data;
						app.loadding();
					}
				})
			},
			restart:function(){
				var prePage = plus.webview.getWebviewById("turntable.html"); //根据页面ID获取到该页面对象
					 prePage.reload(true); //设置页面重新加载项(默认为false，改为true)
// 					 this.loadding()
// 					 this.loadjf();

			},
			selectJP:function(){
				NetUtil.ajax('/jc/select',{
					bh:'1',
					page:1,
					rows:12,
					uname:localStorage.getItem('uname'),
					UID:localStorage.getItem('uuid')
				},function(r){
					console.log(JSON.stringify(r))
					app.M_NUM = r.data[0].m_num
					if(r.status==200){
						app.imgs = r.data
					}
				})
			},
			// 查询收获地址
			selectAddress:function(){
				NetUtil.ajax('/Cj_address/select',{
					uname:localStorage.getItem('uname'),
					UID:localStorage.getItem('uuid')
				},function(r){
					if(r.data.length<=0){
						mui.alert('您还未填写收货地址,请您立即填写,中将后,此收货地址即为奖品收货地址',function(){
							app.turnTo('myaddress','myaddress')
						},'div')
					}else{
						return
					}
				})
			},
			//查询剩余积分
				personalAjax:function(){
			//					plus.nativeUI.showWaiting();
							NetUtil.ajax("/member/selectinfo",{
								uname:localStorage.getItem('uname'),
								UID:localStorage.getItem('uuid')
							},function(r) {

								// console.log(r);
								if(r.status  == '200'){
									app.goldcoin = r.data.goldcoin;
								}else{
									mui.alert(r.message,function(){},'div');
								}
							});
						}
		},
		created:function(){
			this.loadjf();
			this.selectJP()
			this.personalAjax()
			this.selectAddress()
		},
		mounted:function(){
			mui('.mui-scroll-wrapper').scroll({
				deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
			});
		},
		filters:{
			httpgl:function(val){
				if(val.indexOf('http')!=-1){
					return val
				}else{
					return server+val
				}
			}
		}
	});		 
})();
