(function(){	
	var $j = jQuery.noConflict(true);		
	var app = new Vue({
		el:'#app',
		data:{
			isShow:'0',		//0显示 1隐藏	
			localCity:'',	//当前定位城市
		},
		methods:{
			turnTo:function(name){
				mui.openWindow({
				    url:name+'.html',
				    id:name+'.html',
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
			shouHide:function(){
				if($j('.mui-indexed-list-inner').hasClass('emptyyyy') == true){
					this.isShow = '0';
				}else{
					this.isShow = '1';
				}
			},
			//城市选择
			cityChoose:function(name){
				console.log(name);
				localStorage.setItem('address',name);
				var home = plus.webview.getWebviewById('views/homePage/homeIndex.html');
				mui.fire(home,'changeAddress');
				plus.webview.currentWebview().close();
			},
		},
		created:function(){
			this.shouHide();
			this.localCity = localStorage.address;
		},
		mounted:function(){
			mui('.mui-scroll-wrapper').scroll({
				deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
			});
			mui.init();
			mui.ready(function() {
				var header = document.querySelector('header.mui-bar');
				var list = document.getElementById('list');
				//calc hieght
				list.style.height = (document.body.offsetHeight - header.offsetHeight) + 'px';
				//create
				window.indexedList = new mui.IndexedList(list);
				//当前城市商圈选择
				mui('.trading-area').on('tap','li',function(){
					Array.from(this.parentElement.children).forEach(function(current){
						current.className = '';
					});
					this.className = 'active';
					document.getElementById('trading').innerText = this.innerText;
				});
				//点击列表选择城市
				var ul_city = document.getElementById('ul_city');
				ul_city.addEventListener("tap", function(e) {
					var tagClass = e.target.getAttribute("class");
//					console.log("tagClass==" + tagClass);
					if (tagClass && tagClass.indexOf("mui-table-view-cell") != -1) {
						var selectCity = e.target.innerText;
//						alert("选择的城市=" + selectCity);
//						console.log(selectCity);
						localStorage.setItem('address',selectCity);
						var home = plus.webview.getWebviewById('views/homePage/homeIndex.html');
						mui.fire(home,'changeAddress');
						plus.webview.currentWebview().close();
					}
				});
			});
		}
	});		 
})();
