(function() {
	var $j = jQuery.noConflict(true);
	var app = new Vue({
		el: '#app',
		data: {
			infos: {
				name:'',
				phone: '',
				identity: '',
				identityS: '',
				address: '',
			},
			identity: [{
				value: "1",
				text: "身份1"
			},{
				value: "2",
				text: "身份2"
			}],
			info:'',
			infoLength:''
		},
		methods: {
			goPage: function(obj) {
				mui.openWindow({
					url: obj.url,
					id: obj.id,
					styles: {
						popGesture: 'none',
						top: 0, //新页面顶部位置  
						bottom: 0 //新页面底部位置  
					},
					extras: {},
					show: {
						duration: 200 //页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
					},
					waiting: {
						autoShow: false
					}
				});
			},
			//进来的时候请求
			accInformation: function(){
				var mailNo = urlArguments('mailNo');
				NetUtil.ajax(
					'/index/checkSFOrderDetail.do',
					{
						orderId:mailNo
					},
					function(r){
//						console.log(r);
//						console.log(JSON.stringify(r));
						if(r.code==0){
							var aa=r.jsonStr;
							var bb= JSON.parse(aa);
							console.log(aa);
							console.log(bb); 
							var cc = bb.RouteResponse.Route;
							console.log(cc);
							app.info = cc;
//							var bb = aa.replace("\\","");
//							console.log(bb);
//							app.info = JSON.parse(bb);
//							console.log(app.info.length);
							app.infoLength = app.info.length-1;
						}else{
							mui.alert(r.message,function(){},'div');
						}
					}
				)
			},
		},
		created: function() {
//			this.accInformation();
		},
		mounted: function() {
			mui.init();
			mui('.mui-scroll-wrapper').scroll({
				deceleration: 0.0006, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
				bounce: false,
				indicators: false
			});
		},
		directives: {
			chose: {
				bind: function(el, binding) {
					el.addEventListener('tap', function(event) {
						binding.value.name = new mui.PopPicker();
						binding.value.name.setData(app.identity);
						binding.value.name.show(function(selectItems) {
							$j(el).val(selectItems[0].text);
							app.infos.identityS = selectItems[0].text;
							app.infos.identity = selectItems[0].value;
						});
					}, false);
				}
			},
		}
	});
}());