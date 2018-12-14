(function() {
	var $j = jQuery.noConflict(true);
	var app = new Vue({
		el: '#app',
		data: {
			title:'',		//子查询标题
			infos:[],
		},
		methods: {
			getUrlObj:function () { //获取url？号后面的值，以对象的形式存在
				var strs = location.search.substr(1).split("&");	
				var Obj = {}; 
				strs.forEach(function(v,k){
					Obj[v.split("=")[0]]=decodeURI(v.split("=")[1]); 
				})
				this.title = Obj.type;
				console.log(Obj.type)
				return Obj
			},
			getInfo:function(){
				NetUtil.ajax("/help/nexttitle",{
					title:this.title,
					uname:localStorage.getItem('uname'),
					UID:localStorage.getItem('uuid')
				}, function(r) {
					console.log(r.status);
					app.infos = r.data
				});
			},
		},
		created: function() {
			this.getUrlObj()
			this.getInfo()
			console.log(this.infos)
		},
		mounted: function() {

		}
	});
})();