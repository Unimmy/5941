(function() {
	var $j = jQuery.noConflict(true);
	var app = new Vue({
		el: '#app',
		data: {
			page:1,
			infos:[],
		},
		methods: {
			getInfo:function(){
				NetUtil.ajax("/OrdersCardRule/list",{
					page:this.page,
					uname:localStorage.getItem('uname'),
					UID:localStorage.getItem('uuid')
				}, function(r) {
					console.log(JSON.stringify(r));
					app.infos = r.data
			});
			},
		},
		created: function() {
			this.getInfo()
			console.log(this.infos.length)
		},
		mounted: function() {

		}
	});
})();