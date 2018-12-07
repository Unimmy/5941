(function(){	
	var $j = jQuery.noConflict(true);		
	var app = new Vue({
		el:'#app',
		data:{
			infos:[],
			oldArray:[],
			searchName:'',
		},
		methods:{
			turnTo:function(name,id,searchName){//id是下面113行跳转用的，避免重复创建
				mui.openWindow({
				    url:name+'.html?searchName='+searchName,
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
			//获取URL后面的值
			getUrlObj:function () { //获取url？号后面的值，以对象的形式存在
				var strs = location.search.substr(1).split("&");			
				var Obj = {}; 
				strs.forEach(function(v,k){
					Obj[v.split("=")[0]]=decodeURI(v.split("=")[1]); 
				});
				if(Obj.id=='searchSearch'){
					window.onload=function(){
						$j('.inputSearch').focus();
					}
				}
				return Obj; 
			},
			//进页面加载内容
			loadding:function(){
//				plus.nativeUI.showWaiting();
				NetUtil.ajax('/search/select',{
				},function(r){
					console.log(r);
//					plus.nativeUI.closeWaiting();					
					if(r.status == 200){
						app.infos = r.data;			
						if(localStorage.getItem('searchRecord') == null || localStorage.getItem('searchRecord') == undefined){
							
						}else{
							app.oldArray = JSON.parse(localStorage.getItem('searchRecord'));
						}
					}else{
						mui.alert(r.message,function(){},'div');
					}
				})
			},
			//搜索
			searchBtn:function(){
				this.oldArray.unshift(this.searchName);
				localStorage.setItem('searchRecord',JSON.stringify(this.oldArray));
				this.turnTo('searchIndex','searchIndex',this.searchName);
			},
			//清空搜索记录
			clearsearchR:function(){
				mui.confirm('确定要清空搜索记录吗？','',['取消','确定'],function(e){
					if(e.index == 1){
						localStorage.removeItem('searchRecord');
						app.oldArray = JSON.parse(localStorage.getItem('searchRecord'));
					}else{
						
					}
				},'div')
			},
		},
		created:function(){
			this.getUrlObj();
			this.loadding();
		},
		mounted:function(){
			mui('.mui-scroll-wrapper').scroll({
				deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
			});
		}
	});		 
})();
