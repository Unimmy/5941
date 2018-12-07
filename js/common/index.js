(function(){
	//设置默认打开首页显示的子页序号；
	var $j = jQuery.noConflict(true);		
	var Index=0;
	//把子页的路径写在数组里面
	var subpages = ['views/homePage/homeIndex.html','views/classification/classification.html','views/shoppingCart/shoppingCart.html','views/mine/mine.html'];
	//所有的plus-*方法写在mui.plusReady中或者后面。
	mui.plusReady(function() {
		//获取当前页面所属的Webview窗口对象
		var self = plus.webview.currentWebview();
		for (var i = 0; i < 4; i++) {
			//创建webview子页
			var sub = plus.webview.create(
				subpages[i], //子页url
				subpages[i], //子页id
				{
					top: '0',//设置距离顶部的距离
					bottom: '50px'//设置距离底部的距离
				}
			);
			
			//如不是我们设置的默认的子页则隐藏，否则添加到窗口中
			if (i != Index) {
				sub.hide();
			}
	    //将webview对象填充到窗口
			self.append(sub);
		}
		//当前激活选项
		var activeTab = subpages[Index];
		var targetTab = null;
		
		//将手机uuid存进localStorage里面
		localStorage.setItem('uuid',plus.device.uuid);
			
			
		//选项卡点击事件
		mui('.mui-bar-tab').on('tap', 'a', function(e) {
			//获取目标子页的id
			targetTab = this.getAttribute('data-href');
			if (targetTab == activeTab) {
				return false;
			}
			if(targetTab != 'views/homePage/homeIndex.html' && targetTab != 'views/classification/classification.html' && localStorage.memberId == '' || localStorage.memberId == undefined){
				plus.webview.open('views/loginRegister/login.html?neet=1','login');
				return false;
			}
//			if(localStorage.memberId == undefined ||localStorage.memberId == '' && targetTab !='views/homePage/homeIndex.html'){
////				mui.alert('你还未登录,请先登录',function(){
//					plus.webview.open('views/loginRegister/login.html?neet=1','login')
////				})
//				return false;
//			}
			//显示目标选项卡
			plus.webview.show(targetTab);
			//隐藏当前选项卡
			plus.webview.hide(activeTab);
			//更改当前活跃的选项卡
			activeTab = targetTab;
			var topage = plus.webview.getWebviewById(targetTab);
		  	mui.fire(topage, 'show', {  
                id: targetTab,     //传往second.html的值  
           	});
           	if(targetTab == 'views/shoppingCart/shoppingCart.html'){
           		mui.fire(topage, 'shuaxinShopCart', {  
           			 id: topage,     //传往second.html的值 
	           	});
           	}
		});
		window.addEventListener('getWeb',function(event){
        	//显示目标选项卡
        	targetTab = event.detail.targetTab.id;
        	var topage11 = plus.webview.getWebviewById(targetTab)
        	mui.fire(topage11, 'freshStatus');  
        	plus.webview.show(targetTab);   
			//隐藏当前选项卡
			plus.webview.hide(activeTab);
			activeTab = targetTab;
        	$j('[data-href="'+activeTab+'"]').addClass('mui-active').siblings().removeClass('mui-active');
        });
        window.addEventListener('locationToMine',function(event){//登陆后定位在个人中心
        	//显示目标选项卡
        	var topage11 = plus.webview.getWebviewById(targetTab)
        	mui.fire(topage11, 'freshStatus'); 
        	targetTab = event.detail.name.id;
        	if(targetTab!='views/mine/mine.html'){
        		plus.webview.show(targetTab);   
				//隐藏当前选项卡
				plus.webview.hide(activeTab);
				activeTab = targetTab;
				$j('[data-href="'+activeTab+'"]').addClass('mui-active').siblings().removeClass('mui-active');
        	}    	
        });
	});
})();
	