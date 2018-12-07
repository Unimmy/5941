(function() {
	var $j = jQuery.noConflict(true);
	var app = new Vue({
		el: '#app',
		data: {
			infos:[{
				id:'0',
				imgUrl:'../../img/mine/500.png'
			},{
				id:'1',
				imgUrl:'../../img/mine/1000.png'
			}],
			initialSlide:0,
			swiper:null,
			showNext:true,
			showPrev:false,
			sendInfo:{
				pageAll:1
			},
			loanApplyId:'',
			lastIndex:true,
			firstIndex:true,
			isChoosePay:1,	//0 微信支付   1 支付宝支付
		},
		methods: {
			//选择支付模式
			choosePay:function(index){
				this.isChoosePay = index;
			},
		},
		created: function() {
				
		},
		mounted: function() {
			var swiper = new Swiper('.swiper-container', {
				initialSlide: this.initialSlide,
		        observer: true, //修改swiper自己或子元素时，自动初始化swiper
		        observeParents: true, //修改swiper的父元素时，自动初始化swiper
				nextButton: '.btn-next',
				prevButton: '.btn-prov',
				loop: false,
				onTransitionStart: function(swiper){
					if(app.sendInfo.pageAll==0){
						return false;
					}
		       		if(swiper.activeIndex == 0){
						app.firstIndex = false;
						app.lastIndex = true;
					}else if(app.sendInfo.pageAll == swiper.activeIndex){
						app.firstIndex = true;
						app.lastIndex =  false;	
					}else{
						app.firstIndex = true;
						app.lastIndex =  true;
					}
//			      	console.log(swiper.activeIndex) //切换结束时，告诉我现在是第几个slide
			      	if(swiper.activeIndex == 0){
						$j('.checkDetilBox p').eq(1).removeClass('active');
						$j('.checkDetilBox p').eq(0).addClass('active');
			      	}else{
						$j('.checkDetilBox p').eq(0).removeClass('active');
			      		$j('.checkDetilBox p').eq(1).addClass('active');
			      	}
			   }
			});
			$j('.checkDetilBox p').click(function(){
				var index = $j(this).index();
				console.log(index);
				swiper.slideTo(index,500,false);
				$j('.checkDetilBox p').removeClass('active');
				$j(this).addClass('active');
			})
		},
		updated: function() {},
		components: {}
	});
})();