(function(){	
	var $j = jQuery.noConflict(true);		
	var app = new Vue({
		el:'#app',
		data:{
			searchName:'',
			code:'',
			shopname:'',
			infos:[],
			sendInfo:{
				pageNo:1,
				pageAll:0,
				pageSize:10
			},
			isSurnBtn:'0',		//0搜索 1确定
			type:'',
		},
		methods:{
			turnTo:function(name,nameId,id){//id是下面113行跳转用的，避免重复创建
				mui.openWindow({
				    url:name+'.html?id='+id,
				    id:nameId+'.html',
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
				this.type = Obj.type;
				return Obj; 
			},
			//搜索
			searchBtn:function(){
				NetUtil.ajax('/shop/getShopByShopNameLike',{
					shopname:this.searchName,
					uname:localStorage.getItem('uname'),
					UID:localStorage.getItem('uuid')
				},function(r){
					console.log(r);
					if(r.status  == '200'){
						app.infos = r.data;
					}else{
						mui.alert(r.message,function(){},'div');
					}
				})
			},
			//确定
			surnBtn:function(){
			 var btnArray = ['否', '是'];
                mui.confirm('推荐人:'+this.searchName, btnArray, function(e) {
                    if (e.index == 1) {
                    NetUtil.ajax('/zsh/jh',{
					shopcode:this.code,
					id:this.type,
					uname:localStorage.getItem('uname'),
					UID:localStorage.getItem('uuid')
				},function(r){
					//console.log(r);
					if(r.status  == '200'){
//						app.turnTo('myCopperate','myCopperate');
						console.log(r);
						mui.alert(r.message,function(){
							var searchStore = plus.webview.getWebviewById('searchStore.html');
							var myCopperate = plus.webview.getWebviewById('myCopperate.html')
							mui.fire(myCopperate, 'paySuccess', {});
							plus.webview.close(searchStore);
						},'div');
					}else{
						mui.alert(r.message,function(){},'div');
					}
				})
                     
                    }else{
                    	console.log('用户取消了')
                    }
                },'div')
			},
			//选择
			chooseRadio:function(code1,name){
				this.shopname=name;
				this.code=code1;
				this.isSurnBtn = 1;
			},
			//当搜索框获得焦点的时候确定按钮变成搜索
			inputFocus:function(){
				this.isSurnBtn = 0;
			},
		},
		created:function(){
			this.getUrlObj();
		},
		filters:{
			moneyFiler:function(value){
				return "￥"+Number(value).toFixed(2);
			}
		},
		mounted:function(){
			mui('.mui-scroll-wrapper').scroll({
				deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
			});
		}
	});		 
})();