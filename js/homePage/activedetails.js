(function(){
	var app = new Vue({
		el:'#app',
		data:{
			Detail:''
		},
		methods:{
			getinfo:function(){
				NetUtil.ajax('/jc/select',{
				bh:'1',
				uname:localStorage.getItem('uname'),
				UID:localStorage.getItem('uuid')
			},function(r){
				 console.log(JSON.stringify(r))
				if(r.status==200){
					app.Detail = r.data[0].title_su
				}
			})
			}
		},
		created(){
			this.getinfo()
		}
	})
})()
