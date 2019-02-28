(function(){
	var app = new Vue({
		el:'#app',
		data:{
			sendInfo:{
				username:'',
				phone:'',
				address:'',
			},
			infos:[]
			
		},
		methods:{
			sendInfos:function(){
				var phoneReg = /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/;
				if(!this.sendInfo.username){
					mui.alert('请输入姓名!',function(){},'div')
					return
				}
				if(!phoneReg.test(this.sendInfo.phone)){
					mui.alert('请输入正确手机号!',function(){},'div')
					return
				}
				if(!this.sendInfo.address){
					mui.alert('请输入地址!',function(){},'div')
					return
				}
				NetUtil.ajax('/Cj_address/add_for_update',{
					member_name:this.sendInfo.username,
					member_phone:this.sendInfo.phone,
					member_address:this.sendInfo.address,
					uname:localStorage.getItem('uname'),
					UID:localStorage.getItem('uuid')
				},function(r){
					// console.log(JSON.stringify(r))
					if(r.status == 200){
						mui.alert(r.data,function(){},'div')
					}
				})
			},
			getaddressinfo:function(){
				NetUtil.ajax('/Cj_address/select',{
					uname:localStorage.getItem('uname'),
					UID:localStorage.getItem('uuid')
				},function(r){
					// console.log(JSON.stringify(r))
					if(r.status==200){
						app.infos = r.data;
					}
				})
			},
			changeinfo:function(){
				this.infos = []
			}
		},
		created:function(){
			this.getaddressinfo()
		}
	})
})()