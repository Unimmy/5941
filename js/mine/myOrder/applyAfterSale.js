(function(){	
	var $j = jQuery.noConflict(true);		
	var app = new Vue({
		el:'#app',
		data:{
			id:'',
			infos:[],
			reason:'',		//退货原因
			returnMoney:'',	//退款金额
			returnSize:'0',	//退款数量
			returnPrice:'' , //商品单价
			allSize:''	,	//商品总量
			type:1		,  //1店铺2厂商
		},
		methods:{
			turnTo:function(name){
				mui.openWindow({
				    url:name+'.html',
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
			//进来加载数据
			loadding:function(){
//				plus.nativeUI.showWaiting()
				NetUtil.ajax('/orders/selectbyOrderrelevanceid',{
					id:this.id,
					uname:localStorage.getItem('uname'),
					UID:localStorage.getItem('uuid')
				},function(r){
//					plus.nativeUI.closeWaiting();
					console.log(r);
//					app.returnMoney = r.data[0].TOTALFEE;
					app.infos = r.data;
					app.returnPrice = r.data[0].PRICE;
					app.allSize = r.data[0].NUM;
				})
			},
			//退货数量选择
			sizing:function(count){
				this.returnSize=Number(this.returnSize)
				var newSize=this.returnSize+count
				this.returnSize=newSize
				if(newSize<0) {
					this.returnSize=0
					return}
				if(newSize>this.allSize){
					this.returnSize=this.allSize
					return 
				}
				this.returnMoney = this.returnSize * this.returnPrice
				},
			//退货方式,商家或者厂商
				idtype:function(ty){
					this.type=ty
					console.log(this.type)
				},
			//退货
			returnGoods:function(id){
				if(this.reason){
//					plus.nativeUI.showWaiting();
					NetUtil.ajax('/Returngoods/add',{
						orderrelevanceid:id,
						reason:this.reason,
						refund:this.returnMoney,
						size:this.returnSize,
						type:this.type,
						uname:localStorage.getItem('uname'),
						UID:localStorage.getItem('uuid')
					},function(r){
//						plus.nativeUI.closeWaiting();
						console.log(r);
						if(r.status == '200'){
							mui.alert('申请退货成功',function(){
								localStorage.setItem('isShowReturnGoods',false)	//是否显示退款按钮
								plus.webview.close(plus.webview.getWebviewById("applyAfterSale.html"));
								mui.fire(plus.webview.getWebviewById("orderDetail.html"), 'getData', {
								});							
							},'div')
						}else{
							mui.alert(r.message,function(){},'div');
						}
					})
				}else{
					mui.alert('请填写退货原因',function(){},'div');
				}
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
