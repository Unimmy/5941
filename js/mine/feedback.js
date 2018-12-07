(function() {
	var $j = jQuery.noConflict(true);
	var app = new Vue({
		el: '#app',
		data: {
			textareas:'',	//内容
		},
		methods: {
			submission:function(){
				//plus.nativeUI.showWaiting();
				NetUtil.ajax('/Feedback/add',{
					text:this.textareas,
					uname:localStorage.getItem('uname'),
					UID:localStorage.getItem('uuid')
				},function(r){
					//plus.nativeUI.closeWaiting();
					if(r.status == 200){
						mui.alert(r.message,function(){
							plus.webview.currentWebview().close();
						},'div')
					}else{
						mui.alert(r.message,function(){},'div');
					}
				})
			},
		},
		created: function() {
			
		},
		mounted: function() {
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