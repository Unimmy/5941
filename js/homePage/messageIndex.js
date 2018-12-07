(function(){	
	var $j = jQuery.noConflict(true);		
	var app = new Vue({
		el:'#app',
		data:{
			infos:[],	//ISTRUE 0未读  1已读
		},
		methods:{
			turnTo:function(name,id,NumId){
				mui.openWindow({
				    url:name+'.html?NumId='+NumId,
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
			//查询消息列表
			messageAjax:function(){
//					plus.nativeUI.showWaiting();
				NetUtil.ajax('/SystemMessage/selectallBymemberid',{
					uname:localStorage.getItem('uname'),
					UID:localStorage.getItem('uuid'),
					rows:10000
				},function(msg){
					console.log(msg);
//					console.log(JSON.stringify(msg));
//					plus.nativeUI.closeWaiting();
					if(msg.status == 200){
						var data = msg.data;
						data.forEach(function(v,i){
							var infoList={
								content:'',			//内容
								id:'',				//id
								imageUrl:'',		//图片路劲
								isTrue:'',			//是否已读 0未读 1已读
								summary:'',			//摘要
								title:''			//标题
							};
							infoList.id = data[i].ID;
							infoList.imageUrl = data[i].IMAGE;
							infoList.isTrue = data[i].ISTRUE;
							infoList.summary = data[i].SUMMARY;
							infoList.title = data[i].TITLE;
							var str = data[i].CONTENT;
							var arr = str.split("&lt;");
								str=arr.join("<");
						        arr=str.split("&gt;")
						        str=arr.join(">");
						        arr=str.split("&amp;");
						        str=arr.join("&");
						        arr=str.split("&nbsp;");
						        str=arr.join(" ");
						        arr=str.split("&quot;");
						        str=arr.join("'");
						    infoList.content = str;    
						    app.infos.push(infoList);
						})
					}else if(msg.status == -3){
						mui.alert(msg.message,function(){
							app.turnTo('../loginRegister/login','login','login');
						},'div')
					}else{
						mui.alert(msg.message,function(){},'div');
					}
				})
			}
		},
		created:function(){
			this.messageAjax();
			
		},
		mounted:function(){
			mui('.mui-scroll-wrapper').scroll({
				deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
			});
			window.addEventListener('refresh',function(event){
				console.log(123123);
				location.reload();
			});
			
		}
	});		 
})();
