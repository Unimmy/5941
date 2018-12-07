(function(){	
	var $j = jQuery.noConflict(true);		
	var app = new Vue({
		el:'#app',
		data:{
			infos:[],
			id:'',			//id
		},
		methods:{
			turnTo:function(name,id){
				mui.openWindow({
				    url:name+'.html?id='+id,
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
			//获取URL后面的值
			getUrlObj:function () { //获取url？号后面的值，以对象的形式存在
				var strs = location.search.substr(1).split("&");			
				var Obj = {}; 
				strs.forEach(function(v,k){
					Obj[v.split("=")[0]]=decodeURI(v.split("=")[1]); 
				})
				this.id = Obj.id;
				return Obj; 
			},
			//加载数据
			loadding:function(){
				console.log(this.id);
//				plus.nativeUI.showWaiting();
				NetUtil.ajax('/Returngoods/selectallbymemberid',{
					id:this.id,
					uname:localStorage.getItem('uname'),
					UID:localStorage.getItem('uuid')
				},function(r){
//					plus.nativeUI.closeWaiting();
					console.log(r);
					if(r.status == 200){
						app.infos = r.data;
					}else{
						mui.alert(r.message,function(){},'div');
					}
				})
			},
			//取消申请
			withdraw:function(id){
				console.log(id);
//				plus.nativeUI.showWaiting();
				NetUtil.ajax('/Returngoods/deletebyid',{
					id:id,
					uname:localStorage.getItem('uname'),
					UID:localStorage.getItem('uuid')
				},function(r){
//					plus.nativeUI.closeWaiting();
					if(r.status == 200){
						mui.alert('取消申请成功',function(){
							plus.webview.close(plus.webview.getWebviewById("exchangeGoodsDetail.html"));
							mui.fire(plus.webview.getWebviewById("exchangeGoods.html"), 'getData', {});
						},'div')
					}else{
						mui.alert(r.message,function(){},'div');
					}
				})
			},
			
		},
		created:function(){
 			this.getUrlObj();
 			this.loadding();
		},
		mounted:function(){
			//阻尼系数
			var deceleration = mui.os.ios?0.003:0.0009;
			mui('.mui-scroll-wrapper').scroll({
				bounce: false,
				indicators: true, //是否显示滚动条
				deceleration:deceleration
			});			
		}

	});		 
})();
