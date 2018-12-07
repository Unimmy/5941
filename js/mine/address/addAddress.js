(function() {
	var $j = jQuery.noConflict(true);
	var app = new Vue({
		el: '#app',
		data: {
			NId:'',			//id
			type: 1,		//0新增地址   1编辑地址
			sendInfo: {
				id: 0,
				province: '',
				city: '',
				area: '',
				name: '',
				phone: '',
				addressDetail: '',
				zipCode: '',
				isDefault: 0,
				residence: '', //现居地址
				residenceS: '', //现居地址value
				expressInfoId:'',
			},
			allAddr: [],
			address: '',
			reg: {
				nameP: /^[\u4E00-\u9FA5]{1,10}$/,
				phone: /^[1][3-8]\d{9}$/,
				zipCode: /^[1-9]\d{5}$/
			},
			isEasyPurchase:false,	//轻松购显影
		},
		methods: {
			
			regFn: function() {
				if(this.sendInfo.name == '') {
					mui.toast('收货人不能为空');
					return false;
				}
				if(!this.reg.nameP.test(this.sendInfo.name)) {
					mui.toast('收货人输入错误');
					return false;
				}
				if(this.sendInfo.phone == '') {
					mui.toast('电话号码不能为空');
					return false;
				}
				if(!this.reg.phone.test(this.sendInfo.phone)) {
					mui.toast('电话号码输入错误');
					return false;
				}
				if(this.sendInfo.residence == '') {
					mui.toast('所在区域不能为空');
					return false;
				}
				if(this.sendInfo.addressDetail == '') {
					mui.toast('详细地址不能为空');
					return false;
				}
				if(this.sendInfo.zipCode == '') {
					mui.toast('邮编不能为空');
					return false;
				}
//				if(!this.reg.zipCode.test(this.sendInfo.zipCode)) {
//					mui.toast('邮编输入错误');
//					return false;
//				}
				return true;
			},
			//确认
			saveForm: function() {
//				var memberId = localStorage.getItem('memberId');
				if(this.regFn()) {
					mui('.btn-style').button('loading');
					//plus.nativeUI.showWaiting();
					NetUtil.ajax('/myaddress/add',{
						province:app.sendInfo.province,
						city:app.sendInfo.city,
						area:app.sendInfo.area,
						detailed:app.sendInfo.addressDetail,
						phone:app.sendInfo.phone,
						name:app.sendInfo.name,
						code:app.sendInfo.zipCode,
						istrue:app.sendInfo.isDefault,
						uname:localStorage.getItem('uname'),
						UID:localStorage.getItem('uuid')
					},function(r){
						console.log(r);
						//plus.nativeUI.closeWaiting();
						if(r.status=='200'){
							mui.alert('添加成功',function(){
								plus.webview.close(plus.webview.getWebviewById("addAddress.html"));
								mui.fire(plus.webview.getWebviewById("address.html"), 'getData', {});
							},'div')
						}else{
							mui.alert(r.message,function(){},'div');
						}
					})
				}
			},
			//修改
			modifySave:function(){
				if(this.regFn()) {
					mui('.btn-style').button('loading');
					//plus.nativeUI.showWaiting();
					NetUtil.ajax('/myaddress/update',{
						id:app.NId,
						province:app.sendInfo.province,
						city:app.sendInfo.city,
						area:app.sendInfo.area,
						detailed:app.sendInfo.addressDetail,
						phone:app.sendInfo.phone,
						name:app.sendInfo.name,
						code:app.sendInfo.zipCode,
						istrue:app.sendInfo.isDefault,
						uname:localStorage.getItem('uname'),
						UID:localStorage.getItem('uuid')
					},function(r){
						console.log(r);
						//plus.nativeUI.closeWaiting();
						if(r.status=='200'){
							mui.alert('修改成功',function(){
								plus.webview.close(plus.webview.getWebviewById("addAddress.html"));
								mui.fire(plus.webview.getWebviewById("address.html"), 'getData', {});
							},'div')
						}else{
							mui.alert(r.message,function(){},'div');
						}
					})
				}
			},
			//删除
			delAddress:function(){
				console.log(app.NId);
				mui.confirm('确定要删除这条的地址吗？',"提示",["确认","取消"],function(e){
					if(e.index==0){
						//plus.nativeUI.showWaiting();
						NetUtil.ajax('/myaddress/delete',{
							id:app.NId,
							uname:localStorage.getItem('uname'),
							UID:localStorage.getItem('uuid')
						},function(r){
							//plus.nativeUI.closeWaiting();
							if(r.status == '200'){
								mui.alert('删除成功',function(){
									plus.webview.close(plus.webview.getWebviewById("addAddress.html"));
									mui.fire(plus.webview.getWebviewById("address.html"), 'getData', {});
								},'div')
							}else{
								mui.alert(r.message,function(){},'div');
							}
						})
					}else{
						mui.toast("已取消！",{duration:'short',type:'div'});
					}
				},'div');
			},
			//默认地址
			setDefault: function() {
				if(app.sendInfo.isDefault == 0) {
					app.sendInfo.isDefault = 1;
				} else {
					app.sendInfo.isDefault = 0;
				}
			},
			//进来数据
			loadding: function(id) {
				//plus.nativeUI.showWaiting();
				NetUtil.ajax('/myaddress/selectall',{
					id:id,
					uname:localStorage.getItem('uname'),
					UID:localStorage.getItem('uuid')
				},function(r){
					//plus.nativeUI.closeWaiting();
					if(r.status == '200'){
						app.sendInfo.province=r.data[0].province,
						app.sendInfo.city=r.data[0].city,
						app.sendInfo.area=r.data[0].area,
						app.sendInfo.addressDetail=r.data[0].detailed,
						app.sendInfo.phone=r.data[0].phone,
						app.sendInfo.name=r.data[0].name,
						app.sendInfo.zipCode=r.data[0].code,
						app.sendInfo.isDefault=r.data[0].istrue,
						app.sendInfo.residence=r.data[0].province+','+r.data[0].city+','+r.data[0].area
					}else{
						mui.alert(r.message,function(){},'div');
					}
				})
			},
			getUrlObj: function() { //获取url？号后面的值，以对象的形式存在
				var strs = location.search.substr(1).split("&");
				var Obj = {};
				strs.forEach(function(v, k) {
					Obj[v.split("=")[0]] = decodeURI(v.split("=")[1]);
				});
				if(Obj.id == 'new'){
					this.type = 0;
				}else{
					this.type = 1;
					this.loadding(Obj.id);
					this.NId = Obj.id;
				}
				return Obj;
			},
			//地址
			getAddr: function() {

		      	$j.get('../../../lib/mui/city.data-3.js',{},function(data){
//		      		app.allAddr = r.data.pro;
					var cityPicker3 = new mui.PopPicker({
						layer: 3
					});
					cityPicker3.setData(cityData3);
						var showCityPickerButton = document.getElementById('showAreaPicker');
						var houseResult = document.getElementById('houseResult');
						showCityPickerButton.addEventListener('tap', function(event) {
							$j('input').blur();
							cityPicker3.show(function(items) {
								houseResult.value = (items[0] || {}).text + " " + (items[1] || {}).text + ((items[2].text == undefined) ? "" : (" " + (items[2] || {}).text));
								app.sendInfo.residence = (items[0] || {}).text + "," + (items[1] || {}).text + ((items[2].text == undefined) ? "" : ("," + (items[2] || {}).text));
								app.sendInfo.residenceS = (items[0] || {}).value + "," + (items[1] || {}).value + ((items[2].text == undefined) ? "" : ("," + (items[2] || {}).value));
								app.sendInfo.province =  (items[0] || {}).text;
								app.sendInfo.city =  (items[1] || {}).text;
								app.sendInfo.area =  (items[2] || {}).text;
							});
						}, false);
		      	})
				
			},
			
			//轻松购显影
			eadyShow:function(){
				this.isEasyPurchase = !this.isEasyPurchase;
				if(this.isEasyPurchase == true){
					$j('.input-list .input-group .toogleEasy').css('transform',"rotate("+270+"deg"+")");
				}else{
					$j('.input-list .input-group .toogleEasy').css('transform',"rotate("+90+"deg"+")");
				}
			},
			//配送方式切换
			shipMode:function(index){
				if(index == '1'){
					$j('.input-list .input-group:last-child .main .shipModes span').removeClass('active');
					$j('.input-list .input-group:last-child .main .shipModes .ziti').addClass('active');
					$j('.input-list .input-group:last-child .main .scps').children('i').css('display','none');
					$j('.input-list .input-group:last-child .main .ziti').children('i').css('display','block');
				}else if(index == '2'){
					$j('.input-list .input-group:last-child .main .shipModes span').removeClass('active');
					$j('.input-list .input-group:last-child .main .shipModes .scps').addClass('active');
					$j('.input-list .input-group:last-child .main .scps').children('i').css('display','block');
					$j('.input-list .input-group:last-child .main .ziti').children('i').css('display','none');
				}
			},
			//支付方式切换
			payMode:function(index){
				if(index == '1'){
					$j('.input-list .input-group:last-child .main .payModes span').removeClass('active');
					$j('.input-list .input-group:last-child .main .payModes .zxzf').addClass('active');
					$j('.input-list .input-group:last-child .main .hdfk').children('i').css('display','none');
					$j('.input-list .input-group:last-child .main .zxzf').children('i').css('display','block');
				}else if(index == '2'){
					$j('.input-list .input-group:last-child .main .payModes span').removeClass('active');
					$j('.input-list .input-group:last-child .main .payModes .hdfk').addClass('active');
					$j('.input-list .input-group:last-child .main .hdfk').children('i').css('display','block');
					$j('.input-list .input-group:last-child .main .zxzf').children('i').css('display','none');
				}
			},
			
		},
		created: function() {
			this.getAddr();
			this.getUrlObj();
//			mui.init();
//			var isEdit = $location.search('isEdit');
//			this.type = this.getUrlObj().type;
//			document.title = this.type == 1 ? "发货地址" : "收货地址";
////			console.log(this.type)
//			if(this.type == 1) {
//				var data = this.getUrlObj().data;
//				if(data) {
//					this.sendInfo = JSON.parse(this.getUrlObj().data);
//					this.sendInfo.id = this.sendInfo.ID;
//					this.sendInfo.area = this.sendInfo.county;
//					this.sendInfo.addressDetail = this.sendInfo.address;
//					this.address = this.sendInfo.province + this.sendInfo.city + this.sendInfo.area;
//				}
//			} else {
//				if(!!isEdit) {
//					//修改处执行请求
//					this.loadding();
//				} else {}
//			}
		},
		mounted: function() {
			mui('.mui-scroll-wrapper').scroll({
				deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
			});
		},
//		directives: {
//			picker: {
//				bind: function(el, binding) {
//					console.log(el);
//					console.log(binding);
//					binding.value.name = new mui.PopPicker({
//						layer: 3
//					});
//					binding.value.name.setData(cityData3);
//					el.addEventListener('tap', function(event) {
//						$j(binding.value.name.panel).show();
//						document.activeElement.blur(); //失去焦点
//						binding.value.name.show(function(selectItems) {
//							app.sendInfo.province = selectItems[0].text || '';
//							app.sendInfo.city = selectItems[1].text || '';
//							app.sendInfo.area = selectItems[2].text || '';
//							app.sendInfo.county = selectItems[2].text || '';
//							app.address = app.sendInfo.province + app.sendInfo.city + (app.sendInfo.area == undefined ? "" : app.sendInfo.area);
//							setTimeout(function() {
//								$j(binding.value.name.panel).hide();
//							}, 350)
//							/*binding.value.name.dispose();*/ //只能选一次
//						});
//					}, false);
//				}
//			}
//		}
	});
}());