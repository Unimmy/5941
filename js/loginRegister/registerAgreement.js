(function() {
	var app = new Vue({
		el: '#app',
		data: {
			sendInfo:{
			},
			title:'',
			infos:[],
			keys:'',
		},
		methods: {
			getUrlObj:function () { //获取url？号后面的值，以对象的形式存在
				var strs = location.search.substr(1).split("&&");			
				var Obj = {}; 
				strs.forEach(function(v,k){
					Obj[v.split("=")[0]]=decodeURI(v.split("=")[1]); 
				})
				console.log(Obj.templateId);
				if(Obj.templateId == 1){
					this.title = '5941注册协议';
					this.keys = 1;
				}else{
					this.title = '隐私协议';
					this.keys = 2;
				}
				return Obj; 
			},
			//接受协议数据
			loadding:function(){
				NetUtil.ajax('/Agreement/select',{
					key:this.keys
				},function(r){
					console.log(r);
					if(r.status == 200){
						var infoList={
							content:'',			//内容
						};
						var str = r.data;
						var arr = str.split("&lt;");
							str=arr.join("<");
					        arr=str.split("&gt;")
					        str=arr.join(">");
					        arr=str.split("&amp;");
					        str=arr.join("&");
					        arr=str.split("&nbsp;");
					        str=arr.join(" ");
					        arr=str.split("&quot;");
					        str=arr.join("'");    
						infoList.content = str;    
						app.infos.push(infoList);
						console.log(app.infos);
					}else{
						mui.alert(r.message,function(){},'div');
					}
				})
			},
			
		},
		created: function() {
			mui.init({
				swipeBack: false
			});
			this.getUrlObj();
			this.loadding();
//			if(this.sendInfo.isHeTong == 1){
//				NetUtil.ajax("mine/getContract",this.sendInfo, function(r) {
//					console.log(JSON.stringify(r))
//					if(r.resCode == 0) {
//						if(r.resData !=null){
//							app.infos.title = r.resData.title;
//							app.infos.TemplateContent =r.resData.content.replace(/&amp;nbsp;/g,' ').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"');
//						}
//					} else {
//						mui.alert(r.resDesc,function(){},'div')
//					}
//				});
//			}else{
//				var data = mui.extend({},{memberType:this.memberType},{templateType:this.sendInfo.templateId})
//				NetUtil.ajax("mine/selectTemplate",data, function(r) {
//					console.log(JSON.stringify(r));
//					if(r.resCode == 0) {
//						if(r.resData !=null){
//							app.infos.title = r.resData.TemplateName;
//							app.infos.TemplateContent =r.resData.TemplateContent.replace(/&amp;nbsp;/g,' ').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"');
//						}
//					} else {
//						mui.alert(r.resDesc,function(){},'div');
//					}
//				});
//			}
			
		},
		mounted: function() {
			
		}
	});
})();