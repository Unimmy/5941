(function(){	
	var $j = jQuery.noConflict(true);		
	var app = new Vue({
		el:'#app',
		data:{
			infos:{
				imgUrl:'../../img/mine/head.png',
			},
			clerk:false,		//B端还是C端    B端有  C端没有   B端是店铺 店长之类的   C端是普通用户
			userName:'',		//用户昵称
			goldcoin:'',		//积分
			companyPhone:'',	//技术热线
		},
		methods:{
			turnTo:function(name,id,type,orderType){
				mui.openWindow({
				    url:name+'.html?type='+type+'&&orderType='+orderType,
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
			//查询个人中心资料
			personalAjax:function(){
//					plus.nativeUI.showWaiting();
				NetUtil.ajax("/member/selectinfo",{
					uname:localStorage.getItem('uname'),
					UID:localStorage.getItem('uuid')
				},function(r) {
					//plus.nativeUI.closeWaiting();
//					console.log(JSON.stringify(r));
					console.log(r);
					if(r.status  == '200'){
						
						app.userName = r.data.nickname;
						app.goldcoin = r.data.goldcoin;
						app.clerk = r.data.clerk;
						app.companyPhone = r.data.systemphone;
						localStorage.setItem('nickName',r.data.nickname);
						localStorage.setItem('nickId',r.data.id);
						if(r.data.portrait!='' && r.data.portrait!=null && r.data.portrait!=undefined){
							app.infos.imgUrl = server+r.data.portrait;
						}else{
							app.infos.imgUrl = '../../img/mine/head.png';
						}
					}else if(r.status==-3){
						localStorage.memberId = '';
					}else if(r.status==-2){
						localStorage.memberId = '';
					}else{
						mui.alert(r.message,function(){},'div');
					}
					
				});
			},
			pulldownRefresh:function(){
				setTimeout(function(){
					app.personalAjax();
					mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
				},1000)
			},
			coinCertificate:function(){
				var btnArray = ['取消', '确定'];
				mui.prompt('兑换券核销','请输入兑换券编号',btnArray,function(e){
					if(e.index == 1){
						var refuse = e.value;
						console.log(refuse);
						NetUtil.ajax('/Coupon/Write',{
							id:refuse,
							uname:localStorage.getItem('uname'),
							UID:localStorage.getItem('uuid')
						},function(r){
							console.log(r);
							if(r.status == 200){
								mui.alert(r.message,function(){
									app.personalAjax();
								},'div');
							}else{
								mui.alert(r.message,function(){},'div');
							}
						})
					}else{
						console.log('取消了的');
					}
				},'div');
			},
			
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
                }
            });
			this.personalAjax();
			window.addEventListener('changeP',function(event){	  
	       		app.personalAjax();
	       		console.log('login mine刷新');
	       },false);
		},
		mounted:function(){
			mui('.mui-scroll-wrapper').scroll({
				deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
			});
			
		}
	});		 
})();
