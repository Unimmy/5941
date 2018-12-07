(function(){	
	var $j = jQuery.noConflict(true);		
	var app = new Vue({
		el:'#app',
		data:{
			infos:{
				portrait:'../../img/mine/head.png',
				nickname:'',
				phone:'',
				sex:'',
				age:'',
				emil:'',
				sexId:'',	//性别ID
			},
			sizeName:[{
				value:'1',
				text:'男'
			},{
				value:'2',
				text:'女'
			}]
		},
		methods:{
			turnTo:function(name,id){
				mui.openWindow({
				    url:name+'.html',
				    id:id+'.html',
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
			
			//修改会员头像
			//拍照添加文件
			getImage: function(filePicker, fileListObj, imgNum, imgWidth, imgHeight) {
				var c = plus.camera.getCamera();
				c.captureImage(function(e) {
					plus.io.resolveLocalFileSystemURL(e, function(e) {
						var s = e.toLocalURL() + "?version=" + new Date().getTime();
						app.uploadHead(s,filePicker, fileListObj, imgNum, imgWidth, imgHeight); /*上传图片*/
					}, function(e) {
						console.log("读取拍照文件错误：" + e.message);
					});
				}, function(s) {
					console.log("error" + s);
				}, {
					filename: "_doc/head.png",format:"png"
				})
			},
			//从相册选择文件
			galleryImg: function(filePicker, fileListObj, imgNum, imgWidth, imgHeight) {
				plus.gallery.pick(function(a) {
					app.uploadHead(a);
				}, function(a) {}, {
					filter: "image"
				})
			},
			//上传图片元素
			uploadHead: function(imgPath,filePicker, fileListObj, imgNum, imgWidth, imgHeight){
				var image = new Image();
				image.src = imgPath;
				console.log(image);
				image.onload = function() {
					var imgData = app.getBase64Image(image);
					console.log(JSON.stringify(imgData));
					/*在这里调用上传接口*/
					NetUtil.ajax('/feile/base64Image', {
						image64:imgData
					},
					function(data) {
						console.log(JSON.stringify(data));
						if(data.status=='200'){
							NetUtil.ajax('/member/update',{
								uname:localStorage.getItem('uname'),
								UID:localStorage.getItem('uuid'),
								portrait:data.data
							},function(r){
								if(r.status=='200'){
									var portrait = data.data;
									var patt = /http/g;
									var result = patt.test(portrait);
									if(result == false){
										app.infos.portrait = portrait;
										mui.alert("头像修改成功！",function(){},'div');
									}else{
										app.infos.portrait = portrait;
									}
								}else{
									mui.alert(r.message,function(){},'div');
								}
							})
							
						}else{
							mui.alert(data.message,function(){},'div');
						}
//						NetUtil.ajax("personalcredit/head.do",{headUrl:(data.data.sResultInfo+data.data.url)},function(r){
//							mui.alert("头像修改成功！",function(){},'div');
//						});
					}); 
					return;
				}
			},
			//转64
			getBase64Image: function(img){
				var canvas = document.createElement("canvas");
				var width = img.naturalWidth;
				var height = img.naturalHeight;
				if(width < height) {
					height = Math.round(height *= 160 / width);
					width = 160;
				} else {
					width = Math.round(width *= 160 / height);
					height = 160;
				}
				canvas.width = 160; /*设置新的图片的宽度*/
				canvas.height = 160; /*设置新的图片的长度*/
				var ctx = canvas.getContext("2d");
				ctx.drawImage(img, 0, 0, width, height); /*绘图*/
				var dataURL = canvas.toDataURL("image/png", 0.80);
				return dataURL.replace("data:image/png;base64,", "");
			},
			UploadImg: function(filePicker, fileListObj, imgNum, imgWidth, imgHeight){
				var piker = '#' + filePicker + '';
				if(mui.os.plus) {
					var a = [{
						title: "拍照"
					},{
						title: "从手机相册选择"
					}];
					plus.nativeUI.actionSheet({
						//title: "设置头像",
						cancel: "取消",
						buttons: a
					}, function(b) { //actionSheet 按钮点击事件
						switch(b.index) {
							case 0:
								break;
							case 1:
								app.getImage(filePicker, fileListObj, imgNum, imgWidth, imgHeight); //拍照
								break;
							case 2:
								app.galleryImg(filePicker, fileListObj, imgNum, imgWidth, imgHeight); //打开相册
								break;
							default:
								break;
						}
					})
				}
			},
			//进来接受数据
			loadding:function(){
				NetUtil.ajax('/member/selectinfo',{
					uname:localStorage.getItem('uname'),
					UID:localStorage.getItem('uuid')
				},function(r){
					console.log(JSON.stringify(r));
					app.infos = r.data;
					if(r.data.sex == 1){
						app.infos.sex = '男';
						app.infos.sexId = 1;
					}else if(r.data.sex == 1){
						app.infos.sex = '女';
						app.infos.sexId = 2;
					}else{
						app.infos.sex = '保密';
						app.infos.sexId = 0;
					}
				})
			},
			//修改个人资料
			saveData:function(){
				var emailZZ = /^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/;
				if(this.infos.age == null){
					this.infos.age = '';
				}
				if(this.infos.emil == null){
					this.infos.emil = '';
				}
				if(emailZZ.test(this.infos.emil) || this.infos.emil == ''){
					NetUtil.ajax('/member/update',{
						uname:localStorage.getItem('uname'),
						UID:localStorage.getItem('uuid'),
						nickname:this.infos.nickname,
						emil:this.infos.emil,
						sex:this.infos.sexId,
						age:this.infos.age
					},function(r){
						console.log(r);
						if(r.status == 200){
							var revising = plus.webview.currentWebview();
							var mine = plus.webview.getWebviewById('views/mine/mine.html');
							mui.fire(mine, 'changeP', {  
				                name: 'name2'  //传往second.html的值  
				           	});
							plus.webview.close(revising);
						}else{
							mui.alert(r.message,function(){},'div');
						}
					})
				}else{
					mui.toast('请输入正确邮箱账号');
				}
			},
			
		},
		created:function(){
			this.loadding();
		},
		mounted:function(){
			mui.init();
			mui('.mui-scroll-wrapper').scroll({
				deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
			});
			
		},
		
		directives: {
			chose: {
				bind: function(el, binding) {
					var obj = binding.value.desc;
					var name = binding.value.name;
					el.addEventListener('tap', function(event) {
						document.activeElement.blur(); //失去焦点
						binding.value.name = new mui.PopPicker();
						binding.value.name.setData(obj);
						binding.value.name.show(function(selectItems) {
							console.log(selectItems);
							/*$j(el).val(selectItems[0]);*/
							switch(name) {
								case 'sizeName':
									app.infos.sex = selectItems[0].text;
									app.infos.sexId = selectItems[0].value;
									break;
							}

						});
					}, false);

				}
			},
		},
	});		 
})();
