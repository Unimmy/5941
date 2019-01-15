(function(){
	var $j = jQuery.noConflict(true);
	var app = new Vue({
		el:'#app',
		data:{
			ticketId:'', //卡卷id
			cards:''  //
		},
		methods:{
			getUrlObj:function () { //获取url？号后面的值，以对象的形式存在
				var strs = location.search.substr(1).split("&");	
				var Obj = {}; 
				strs.forEach(function(v,k){
					Obj[v.split("=")[0]]=decodeURI(v.split("=")[1]); 
				});
				this.ticketId = Obj.id;
				return Obj; 
			},
			//查询优惠券
			selectCard:function(){
				NetUtil.ajax("/Goldcoincoupon/select",{
					id:this.ticketId,
					uname:localStorage.getItem('uname'),
					UID:localStorage.getItem('uuid')
				},function(r) {
//					console.log(r.data.length)
					app.cards =r.data;
				})
			},
			//兑换优惠券
			getMyticket:function(){
				var btnArray = ['取消','确定']
				    mui.confirm('是否使用积分兑换优惠券？', btnArray, function(e) {
                    if (e.index == 1) {
                       	NetUtil.ajax("/coupon/mc",{
							id:app.ticketId,
							uname:localStorage.getItem('uname'),
							UID:localStorage.getItem('uuid')
						},function(r) {
							if(r.message == '兑换成功'){
								mui.alert('兑换成功，请到优惠券中查看',function(){
									var  ticketshare = plus.webview.getWebviewById('ticketshare.html');
									plus.webview.close(ticketshare);
								},'div');
							}else{
								mui.alert(r.message,function(){},'div');
							}
						})
                    } else {
                       console.log("用户取消了")
                    }
                },'div')
			}
		},
		created:function(){
			this.getUrlObj()
			this.selectCard()
		},
		mounted:function(){}
	})
})()
