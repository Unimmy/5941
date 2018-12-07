/**
 * @description validform公用校验方法
 * @author chenzhen
 * @version v1.0
 */
//正则集合
var RE = {
	isSpecial:		/[`~!@#\$%\^&\*\(\)_\+<>\?:\"{},\.\/;'\[\\]]$/,//特殊字符
	notSpecial:		/^[`~!@#\$%\^&\*\(\)_\+<>\?:\"{},\.\/;'\[\\]]$/,//非特殊字符
	/*logName:		/^(?![0-9]+$)(?![a-zA-Z]+$)(?![\u4E00-\u9FA5]+$)[0-9A-Za-z\u4E00-\u9FA5]{6,16}$/,//登录名(用户名)，6~16位的数字、字母或汉字
	*/	
	logName:		/^[0-9A-Za-z]{5,20}$/,//登录名(用户名)，5~20位的数字或字母
	enterNameReg:	/^[\u4E00-\u9FA5A-Za-z0-9]{1,12}$/,//部门名称,1~12位的数字、字母或中文
	enterGoodName:	/^[\u4E00-\u9FA5A-Za-z0-9]{1,12}$/,//1~12数字字母或中文
	enterPerson:	/^[\u4E00-\u9FA5]{2,8}$/,//部门负责人,2~8位中文
	remarks:		/[`~%\^\*\(\)_\+<>\"{}\/;'\[\\] ]{0,50}$/,//备注50位以内任意字符，不可为特殊字符
	legal:			/^[\u4E00-\u9FA5A-Za-z]{2,20}$/,//法人代表
	businessNum:	/^[0-9]{15}([0-9]{3})$/,//营业执照号，15位数字或18位
	logPass:        /^[^\u4e00-\u9fa5]{6,20}$/,//登录密码为6-20位字符
	z6: 			/^\d{4}$/, //手机验证码,4位数字
	imgCode:		/^-?[0-9]*$/,//图形验证码，非负整数
	idCard: 		/^\d{17}(\d|x|X){1}$/,//身份证号   18位基本身份证号验证,基本格式
	nNum1:			/^[0-9]*[1-9][0-9]*$/,//1~无限大的整数
	z2_20:			/^[\u4E00-\u9FA5]{2,20}$/,//中文2-20位
	z2_30:			/^[\u4E00-\u9FA5]{2,30}$/,//中文2-20位
	ze4_30: 		/^[0-9\u4E00-\u9FA5]{4,30}$/,
	zbank:			/^[\u4E00-\u9FA5A-Za-z0-9]{3,50}$/,//开户支行
	zbankNum:		/^\d{16,19}$/,//银行卡号,16-19位
	cartNumber:		/^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5}$/,//车牌号：省（汉字）+市（A-Z）+组合（数字、字母）
	amcountM:		 /^([1-9][\d]{0,15}|0)(\.[\d]{1,20})?$/, // 
	zphone:			/^[1][3-9]\d{9}$/, //手机号验证，只验证11位数字
	tellPhone:		/^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$|(^1\d{10}$)/,//电话
	mail:			/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,//邮箱//国际 //国内常用
	QQ:				/^\d{5,13}$/,  //QQ验证，可为空，5~13位数字
	orgcodefmt:		/^(([0-9A-Z]){8}-[0-9|X])|([0-9]{18})$/,//组织机构代码
	enterAddress:	/^[\u4E00-\u9FA5A-Za-z0-9-_]{1,50}$/,
	roleName:		/^[\u4E00-\u9FA5]{1,25}$/,  //角色名称，1~25个中文
	roleMark:		/^[\u4E00-\u9FA5]{1,125}$/,//角色描述
	unnormal:		/^[^ &',;=?$\\]+$/,//特定排除
	hundrednum:		/^(100|[1-9]?\d(\.\d\d?)?)$/,//百分数验证不包含%
	inviteCode:		/^[0-9]{11}$/,//邀请码验证
	titleRemarks:	/^((?![a-zA-Z]+$)||(?![a-z0-9]+$))[\u4E00-\u9FA5a-zA-Z0-9]{0,40}$/,//0-40个字，不含特殊字符
	accountOpen:	/^[JLZ][0-9]{13}$/, //开户许可证编号：J基本户、L临时户、Z专用户；后面四位是地区代码;再后面7位是顺序号;最后2位表示第几个版本：这个要解释一下，比如你新开基本户，那么最后2位就是01；对这个基本户变更一次，换发了新许可证，那么就顺延成02
	lognameOrPhone:	/^1\d{10}|(?![0-9]+$)(?![a-zA-Z]+$)(?![\u4E00-\u9FA5]+$)[0-9A-Za-z\u4E00-\u9FA5]{6,16}$/,
	WeiXin:			/^[a-zA-Z0-9_]+$/,
	phoneOrEmail:	/^1\d{10}|\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
	postCodes:		/^[1-9]\d{5}$/,
	dianhua:		/^(1[3,5,8,7]{1}[\d]{9})|(((400)-(\d{3})-(\d{4}))|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{3,7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)$/, //座机号
	isNum:			/^[1-9]\d*$/, //是否为数字
	isChinese:		/^[\u4e00-\u9fa5]{1,5}$/,
	GoodNum:        /^[a-zA-Z0-9]{0,20}$/,
	GoodKu:			/^[1-9]([0-9]{1,6})?$/,
	Expressnumber:	/^\w{10,}$/,
	Taxpayer:		/^\d{15}$|^\d{18}$|^\d{20}$/,	//15,18,20数字、字母 纳税人识别
	Taxpayer1:		/^\d{15}$|^\d{18}$/,
	dataArea:		/^[0-9\u4E00-\u9FA5]{1,10}$/,  //保质期
	lngRe:			/^[-]?(\d|([1-9]\d)|(1[0-7]\d)|(180))(\.\d*)?$/,//经度 -180 ~ 180 
	latRe:			/^[-]?(\d|([1-8]\d)|(90))(\.\d*)?$/, //纬度  -90 ~ 90 
	deadline:		/^[0-9]{1,4}$/,						//开店年限  1~120
	strRegex:		/^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i,
	imgZm: 		    /^[a-zA-Z0-9]{4}$/,
	LoginName:      /^[0-9A-Za-z]{5,20}|\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,  //用户名或电话或邮箱
	nNum2:			/^[1-9]*[0-9]{1,9}$/,//1~9位数的整数,
	loanName:		/^[\u4E00-\u9FA5]{2,12}$/,//借款人姓名
	industry:		/^[\u4E00-\u9FA5]{2,20}$/,//行业2-20位,
	familyAddr:	    /^[\u4E00-\u9FA5A-Za-z0-9]{5,50}$/,//
	nNumOr:			/^[0-9]*[0-9][0-9]*$/,//0~无限大的整数
	socialCode:		/^[0-9A-Z]{18}$/,//统一社会信用代码
};


//错误提示信息，公用部分，特殊提示特殊处理
var ErrorTips = {
	nullmsg:"请输入内容！"
};


//验证判断带返回信息
//==============================================Demo Start===============================================
/**
 * 基本验证判断demo
 * @param {ValueString} gets	当前验证值		1000
 * @param {Object} obj			当前验证对象	input || 
 * @param {Object} curform		当前验证盒子/表单
 * @param {String || Function} datatype		提示信息类型	1||2||3||4||5||function 本项目全局使用5，特情况特殊处理
 */
var demo1 = function(gets, obj, curform, datatype) {	
	//可选取其他元素值
	var value = obj.attr("lang");
	if (!gets || gets == value) {
		return "请输入内容！";
	}
	if (!RE.logName.test(gets)) {
		return "6~16位的数字、字母或汉字";
	}
	
	//验证通过返回true
	return true;
};


/**
 * 查询验证判断
 * @param {ValueString} gets	当前验证值		1000
 * @param {Object} obj			当前验证对象	input || 
 * @param {Object} curform		当前验证盒子/表单
 * @param {String || Function} datatype		提示信息类型	1||2||3||4||5||function 本项目全局使用5，特情况特殊处理
 * 此方法，需使用同步
 * 若需异步，直接在输入框上加URL，方法另见
 */
var demo2 = function(gets,obj,curform,datatype) {
	var sResult = false;
	$.ajax({
		url: "checkMemberEmailBind.action",//查询
		type: "post",
		dataType: "text",//
		data: {
			"param": gets
		}, //检验参数（通用）
		async: false, //默认true，异步；false，同步
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		beforeSend: function(xmlHttp) {
			xmlHttp.setRequestHeader("If-Modified-Since", "0");
			xmlHttp.setRequestHeader("Cache-Control", "no-cache");
		},
		error: function() {
			//提示信息
			alert("服务器忙，请稍后再试");
		},
		success: function(data) {
			if (data != null && data != "") {
				if (data == 0) {
					sResult = true;
				} else if (data == 1) {
					sResult = "邮箱已存在";
				}
			}
		}
	});
	return sResult;
};
//==============================================Demo End===============================================

//==============================================Case===============================================
var orgcode = function(gets, obj, curform, datatype) { //组织机构代码
	var ws = [3, 7, 9, 10, 5, 8, 4, 2];
	var str = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	if (!RE.orgcodefmt.test(gets)) {
		return "组织机构代码格式：L1832212-3或18位数字";
	}
	if(/^[0-9]{18}$/.test(gets)){
		return true;
	}else{
		var sum = 0;
		for (var i = 0; i < 8; i++) {
			sum += str.indexOf(gets.charAt(i)) * ws[i];
		}
		var c9 = 11 - (sum % 11);
		if (c9 == 10) {
			c9 = 'X';
		} else if (c9 == 11) {
			c9 = '0';
		}
	
		if (c9 != gets.charAt(9)) {
			return "组织机构代码错误";
		}
	}
};

var IDCard = function(gets, obj, curform, datatype) {//身份证
	var Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1]; // 加权因子;
	var ValideCode = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2]; // 身份证验证位值，10代表X;

	if (gets.length == 15) {
		return isValidityBrithBy15IdCard(gets);
	} else if (gets.length == 18) {
		var a_idCard = gets.split(""); // 得到身份证数组   
		if (isValidityBrithBy18IdCard(gets) && isTrueValidateCodeBy18IdCard(a_idCard)) {
			return true;
		}
		return '请输入正确的身份证号码';
	}
	return '请输入正确的身份证号码';

	function isTrueValidateCodeBy18IdCard(a_idCard) {
		var sum = 0; // 声明加权求和变量   
		if (a_idCard[17].toLowerCase() == 'x') {
			a_idCard[17] = 10; // 将最后位为x的验证码替换为10方便后续操作   
		}
		for (var i = 0; i < 17; i++) {
			sum += Wi[i] * a_idCard[i]; // 加权求和   
		}
		valCodePosition = sum % 11; // 得到验证码所位置   
		if (a_idCard[17] == ValideCode[valCodePosition]) {
			return true;
		}
		return false;
	}

	function isValidityBrithBy18IdCard(idCard18) {
		var year = idCard18.substring(6, 10);
		var month = idCard18.substring(10, 12);
		var day = idCard18.substring(12, 14);
		var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
		// 这里用getFullYear()获取年份，避免千年虫问题   
		if (temp_date.getFullYear() != parseFloat(year) || temp_date.getMonth() != parseFloat(month) - 1 || temp_date.getDate() != parseFloat(day)) {
			return false;
		}
		return true;
	}

	function isValidityBrithBy15IdCard(idCard15) {
		var year = idCard15.substring(6, 8);
		var month = idCard15.substring(8, 10);
		var day = idCard15.substring(10, 12);
		var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
		// 对于老身份证中的你年龄则不需考虑千年虫问题而使用getYear()方法   
		if (temp_date.getYear() != parseFloat(year) || temp_date.getMonth() != parseFloat(month) - 1 || temp_date.getDate() != parseFloat(day)) {
			return false;
		}
		return true;
	}
};
var lognameOrPhone = function(gets,obj,curform,datatype){
	var value = obj.attr("lang");
	if(!gets || gets == value){
		if (obj.attr("ignore")=='ignore'){
			return true;
		}
		obj.val("");
		return "用户名不可为空";
	}
	if(!RE.lognameOrPhone.test(gets)){  
	    return "请输入6~16位的数字、字母或汉字的两两组合或11位手机号码";
	}
	return true;
};
//Expressnumber 快递单号
var Expressnumber = function(gets,obj,curform,datatype){
	var value = obj.attr("lang");
	if(!gets || gets == value){
		if (obj.attr("ignore")=='ignore'){
			return true;
		}
		obj.val("");
		return "快递单号不可为空";
	}
	if(!RE.Expressnumber.test(gets)){  
	    return "请输入正确的快递单号";
	}
	return true;
};

var enterGoodName =function(gets,obj,curform,datatype){
	var value = obj.attr("lang");
	if(!gets || gets == value){
		if (obj.attr("ignore")=='ignore'){
			return true;
		}
		obj.val("");
		return "名称不能为空";
	}
	if(!RE.enterGoodName.test(gets)){  
	    return "请输入1~12位的数字、字母、中文的名称";
	}
	return true;
};

var strRegex=function(gets,obj,curform,datatype){
	var value = obj.attr("lang");
	if(!gets || gets == value){
		if (obj.attr("ignore")=='ignore'){
			return true;
		}
		obj.val("");
		return "链接不能为空";
	};
	if(!RE.strRegex.test(gets)){  
		return "请输入带“http://”的正确的url链接";  
	}
	return true;
};	

var phoneOrEmail = function(gets,obj,curform,datatype){
	var value = obj.attr("lang");
	if(!gets || gets == value){
		if (obj.attr("ignore")=='ignore'){
			return true;
		}
		obj.val("");
		return "请输入手机号或邮箱";
	}
	if(!RE.phoneOrEmail.test(gets)){  
	    return "请输入正确的手机号或邮箱";
	}
	return true;
};

var WeiXin = function(gets,obj,curform,datatype){
	var value = obj.attr("lang");
	if(!gets || gets == value){
		if (obj.attr("ignore")=='ignore'){
			return true;
		}
		obj.val("");
		return "微信号不能为空";
	}
	if(!RE.WeiXin.test(gets)){  
	    return "请输入正确格式的微信号";
	}
	return true;
};
var dianhua = function(gets,obj,curform,datatype){
	var value = obj.attr("lang");
	if(!gets || gets == value){
		if (obj.attr("ignore")=='ignore'){
			return true;
		}
		obj.val("");
		return "号码不能为空";
	}
	if(!RE.dianhua.test(gets)){  
	    return "请输入正确的电话号码,例：028-11111111";
	}
	return true;
};
//经度
var lngRe = function(gets,obj,curform,datatype){
	var value = obj.attr("lang");
	if(!gets || gets == value){
		if (obj.attr("ignore")=='ignore'){
			return true;
		}
		obj.val("");
		return "经度不能为空";
	}
	if(!RE.lngRe.test(gets) || Number(gets)>180 || Number(gets)<-180){  
	    return "请输入正确的经度,-180~180";
	}
	return true;
};
//纬度
var latRe= function(gets,obj,curform,datatype){
	var value = obj.attr("lang");
	if(!gets || gets == value){
		if (obj.attr("ignore")=='ignore'){
			return true;
		}
		obj.val("");
		return "纬度不能为空";
	}
	if(!RE.latRe.test(gets) || Number(gets)>90 || Number(gets)<-90){  
	    return "请输入正确的纬度,-90~90";
	}
	return true;
};

var logname = function(gets,obj,curform,datatype) {
	var value = obj.attr("lang");
	if(!gets || gets == value){
		if (obj.attr("ignore")=='ignore'){
			return true;
		}
		obj.val("");
		return "用户名不可为空";
	}
	if(!RE.logName.test(gets)){  
	    return "用户名格式为:5~20位的数字和字母组合";
	}
	return true;
};
var LoginName = function(gets,obj,curform,datatype) {
	var value = obj.attr("lang");
	if(!gets || gets == value){
		if (obj.attr("ignore")=='ignore'){
			return true;
		}
		obj.val("");
		return "登陆名/手机号不可为空";
	}
	if(!RE.LoginName.test(gets)){  
	    return "登陆名/手机号输入错误";
	}
	return true;
};
var Logistical = function(gets,obj,curform,datatype) {
	var value = obj.attr("lang");
	if(!gets || gets == value){
		if (obj.attr("ignore")=='ignore'){
			return true;
		}
		obj.val("");
		return "物流单号不可为空";
	}
	if(!RE.logName.test(gets)){  
	    return "物流单号输入错误，请输入正确的物流单号";
	}
	return true;
};
var zbank = function(gets,obj,curform,datatype) {
	var value = obj.attr("lang");
	if(!gets || gets == value){
		if (obj.attr("ignore")=='ignore'){
			return true;
		}
		obj.val("");
		return "支行名字不可为空";
	}
	if(!RE.zbank.test(gets)){  
		return "请输入正确的支行名字";
	}
	return true;
};
var zbank1 = function(gets,obj,curform,datatype) {
	var value = obj.attr("lang");
	if(!gets || gets == value){
		if (obj.attr("ignore")=='ignore'){
			return true;
		}
		obj.val("");
		return "开户行不可为空";
	}
	if(!RE.zbank.test(gets)){  
		return "请输入正确的开户行名称";
	}
	return true;
};
var postCodes = function(gets,obj,curform,datatype) {
	var value = obj.attr("lang");
	if(!gets || gets == value){
		if (obj.attr("ignore")=='ignore'){
			return true;
		}
		obj.val("");
		return "邮编不可为空";
	}
	if(!RE.postCodes.test(gets)){  
		return "请输入正确的邮编";
	}
	return true;
};
	
	
var zbankNum = function(gets,obj,curform,datatype) {
	var value = obj.attr("lang");
	if(!gets || gets == value){
		if (obj.attr("ignore")=='ignore'){
			return true;
		}
		obj.val("");
		return "银行卡号不可为空";
	}
	if(!RE.zbankNum.test(gets)){  
		return "请输入正确的银行卡号";
	}
	return true;
};

var orgcodefmt = function(gets,obj,curform,datatype) {
	var value = obj.attr("lang");
	if(!gets || gets == value){
		if (obj.attr("ignore")=='ignore'){
			return true;
		}
		obj.val("");
		return "统一社会信用代码不可为空";
	}
	if(!RE.orgcodefmt.test(gets)){  
		return "请输入正确的统一社会信用代码，如： 12330400068392995K";
	}
	return true;
};
var socialCode = function(gets,obj,curform,datatype) {
	var value = obj.attr("lang");
	if(!gets || gets == value){
		if (obj.attr("ignore")=='ignore'){
			return true;
		}
		obj.val("");
		return "统一社会信用代码不可为空";
	}
	if(!RE.socialCode.test(gets)){  
		return "请输入正确的统一社会信用代码，如： 12330400068392995K";
	}
	return true;
};
var z2_20 = function(gets,obj,curform,datatype) {
	var value = obj.attr("lang");
	if(!gets || gets == value){
		if (obj.attr("ignore")=='ignore'){
			return true;
		}
		obj.val("");
		return "内容不能为空";
	}
	if(!RE.z2_20.test(gets)){  
		return "请输入2~20位中文";
	}
	return true;
};	
var industry = function(gets,obj,curform,datatype) {
	var value = obj.attr("lang");
	if(!gets || gets == value){
		if (obj.attr("ignore")=='ignore'){
			return true;
		}
		obj.val("");
		return "从事行业不能为空";
	}
	if(!RE.z2_20.test(gets)){  
		return "从事行业错误,格式为2~20位中文";
	}
	return true;
};
var profession = function(gets,obj,curform,datatype) {
	var value = obj.attr("lang");
	if(!gets || gets == value){
		if (obj.attr("ignore")=='ignore'){
			return true;
		}
		obj.val("");
		return "职业不能为空";
	}
	if(!RE.z2_20.test(gets)){  
		return "职业输入错误,格式为2~20位中文";
	}
	return true;
};

var z2_30 = function(gets,obj,curform,datatype) {
	var value = obj.attr("lang");
	if(!gets || gets == value){
		if (obj.attr("ignore")=='ignore'){
			return true;
		}
		obj.val("");
		return "内容不能为空";
	}
	if(!RE.z2_30.test(gets)){  
		return "请输入2~30个汉字";
	}
	return true;
};	
var z2_21 = function(gets,obj,curform,datatype) {
	var value = obj.attr("lang");
	if(!gets || gets == value){
		if (obj.attr("ignore")=='ignore'){
			return true;
		}
		obj.val("");
		return "开户行不能为空";
	}
	if(!RE.z2_20.test(gets)){  
		return "开户行为2~20位中文";
	}
	return true;
};
var regpass = function(gets,obj,curform,datatype) {
	var value = obj.attr("lang");
	if(!gets || gets == value){
		if (obj.attr("ignore")=='ignore'){
			return true;
		}
		obj.val("");
		return "密码不可为空";
	}
	else if(!RE.logPass.test(gets)){  
    	return "密码格式为:6~20位非中文字符";  
	}
	return true;
};
			
var GoodNum=function(gets,obj,curform,datatype) {
	var value = obj.attr("lang");
	if(!gets || gets == value){
		if (obj.attr("ignore")=='ignore'){
			return true;
		}
		obj.val("");
		return "商品货号不可为空";
	}
	if(!RE.GoodNum.test(gets)){  
    	return "商品货号为:0~20位的数字和字母的组合";  
	}
	return true;
};
var regpass2 = function(gets,obj,curform,datatype) {
	var value = obj.attr("lang");
	var pw1 = $("#inputPWD").val();
    var pw2 = $("#inputPWD2").val();
	if(!gets || gets == value){
		if (obj.attr("ignore")=='ignore'){
			return true;
		}
		obj.val("");
		return "密码不可为空";
	}
	if(!RE.logPass.test(gets)){  
    	return "密码格式为:6~20位非中文字符";  
	}
	if(pw1!=pw2){  
    	return "两次密码输入不一致";  
	}
	return true;
};
var regpass22 = function(gets,obj,curform,datatype) {
	var value = obj.attr("lang");
	var pw1 = $("#inputPWD3").val();
    var pw2 = $("#inputPWD31").val();
	if(!gets || gets == value){
		if (obj.attr("ignore")=='ignore'){
			return true;
		};
		obj.val("");
		return "密码不可为空";
	}
	if(!RE.logPass.test(gets)){  
    	return "密码格式为:6~20位非中文字符";  
	}
	if(pw1!=pw2){  
    	return "两次密码输入不一致";  
	}
	return true;
};	
//保质期
var dataArea=function(gets,obj,curform,datatype) {
	var value = obj.attr("lang");
	if(!gets || gets == value){
		if (obj.attr("ignore")=='ignore'){
			return true;
		}
		obj.val("");
		return "保质期不能为空";
	}
	if(!RE.dataArea.test(gets)){  
    	return "请输入正确的保质期格式，如：90天";  
	}
	return true;
};		

var GoodKu=function(gets,obj,curform,datatype) {
	var value = obj.attr("lang");
	if(!gets || gets == value){
		if (obj.attr("ignore")=='ignore'){
			return true;
		}
		obj.val("");
		return "商品库存不能为空";
	}
	if(!RE.GoodKu.test(gets)){  
    	return "商品库存格式为:1到1000000的数字";  
	}
	return true;
};

var imgcode = function(gets,obj,curform,datatype) {
	var value = obj.attr("lang");
	if(!gets || gets == value){
		if (obj.attr("ignore")=='ignore'){
			return true;
		}
		obj.val("");
		return "验证码不可为空";
	}
	if(!RE.imgCode.test(gets)){  
	    return "图形验证码错误，请重新输入";  
	}
	return true;
};

var imgZm = function(gets,obj,curform,datatype) {
	var value = obj.attr("lang");
	if(!gets || gets == value){
		if (obj.attr("ignore")=='ignore'){
			return true;
		}
		obj.val("");
		return "图形验证码不可为空";
	}
	if(!RE.imgZm.test(gets)){  
	    return "图形验证码错误，请重新输入";  
	}
	return true;
};
//百分比、折扣
var isNum = function(gets,obj,curform,datatype) {
	var value = obj.attr("lang");
	var number = obj.val();
	if(!gets || gets == value){
		if (obj.attr("ignore")=='ignore'){
			return true;
		}
		obj.val("");
		return "请输入内容";
	}
	if(!RE.isNum.test(gets)){  
	    return "请输入范围1~100的数字";  
	}
	if(Number(number)>100){
		return "输入数字不能大于100";
	};
	if(Number(number)<1){
		return "输入数字不能小于1";
	};
	
	return true;
};
var isNum3 = function(gets,obj,curform,datatype) {
	var value = obj.attr("lang");
	if(!gets || gets == value){
		if (obj.attr("ignore")=='ignore'){
			return true;
		}
		obj.val("");
		return "数量不可为空";
	}
	if(!RE.isNum.test(gets)){  
		return "贷款期限为整数";  
	}
	
	//验证最大值
	if(obj.attr("maxVal")!=undefined){
		var number = obj.val();
		var maxVal = obj.attr("maxVal") ;
		if(maxVal=='' || isNaN(maxVal)){
			return "数据错误，当前最大值，不是数字";
		}
		if(Number(number)>Number(maxVal)){
			return "输入数量不能大于"+maxVal;
		};
	}
	
	//验证最小值
	if(obj.attr("minVal")!=undefined){
		var number = obj.val();
		var minVal = obj.attr("minVal") ;
		if(minVal=='' || isNaN(minVal)){
			return "数据错误，当前最小值，不是数字";
		}
		if(Number(number)<Number(minVal)){
			return "输入数量不能小于"+minVal;
		};
	}
	
	if(obj!=null){
		var number = obj.val();
		obj.val(Number(number));
	}
	
	return true;
};

var isChinese = function(gets,obj,curform,datatype) {
	var value = obj.attr("lang");
	if(!gets || gets == value){
		if (obj.attr("ignore")=='ignore'){
			return true;
		}
		obj.val("");
		return "商品单位不能为空";
	}
	if(!RE.isChinese.test(gets)){  
	    return "请输入1-5个汉字的商品单位";  
	}
	return true;
};

var familyAddr = function (gets,obj,curform,datatype) {
	var value = obj.attr("lang");
	if(!gets || gets == value){
		if (obj.attr("ignore")=='ignore'){
			return true;
		}
		obj.val("");
		return "家庭地址不可为空";
	}
	if(!RE.familyAddr.test(gets)){  
	    return "家庭地址为5-50个中文数字或字母的组合";  
	}
	return true;
};
var zPhone = function (gets,obj,curform,datatype) {
	var value = obj.attr("lang");
	if(!gets || gets == value){
		if (obj.attr("ignore")=='ignore'){
			return true;
		}
		obj.val("");
		return "手机号不可为空";
	}
	if(!RE.zphone.test(gets)){  
	    return "请输入正确的11位手机号";  
	}
	return true;
};	
//纳税人识别 Taxpayer
var Taxpayer = function (gets,obj,curform,datatype) {
	var value = obj.attr("lang");
	if(!gets || gets == value){
		if (obj.attr("ignore")=='ignore'){
			return true;
		}
		obj.val("");
		return "纳税人识别码不可为空";
	}
	if(!RE.Taxpayer.test(gets)){  
	    return "请输入正确的纳税人识别号,15位、18位、20位数字";  
	}
	return true;
};
//税务登记证
var Taxpayer1 = function (gets,obj,curform,datatype) {
	var value = obj.attr("lang");
	if(!gets || gets == value){
		if (obj.attr("ignore")=='ignore'){
			return true;
		}
		obj.val("");
		return "税务登记证号不可为空";
	}
	if(!RE.Taxpayer1.test(gets)){  
	    return "请输入正确的税务登记证号,15位、18位数字";  
	}
	return true;
};
var Z6 = function (gets,obj,curform,datatype) {
	var value = obj.attr("lang");
	if(!gets || gets == value){
		if (obj.attr("ignore")=='ignore'){
			return true;
		}
		obj.val("");
		return "短信验证码不可为空";
	}
	if(!RE.z6.test(gets)){  
    	return "短信验证码为4位数字";  
	}
	return true;
};			
var newpass = function (gets,obj,curform,datatype) {
	var value = obj.attr("lang");
	if(!gets || gets == value){
		if (obj.attr("ignore")=='ignore'){
			return true;
		}
		obj.val("");
		return "新密码不可为空";
	}
	if(!RE.logPass.test(gets)){  
		return "新密码输入错误,格式为6~20位非中文字符";  
	}
	return true;
};
var enterperson = function(gets,obj,curform,datatype) {
	if(gets == $(obj).attr("lang") || !gets){
		if (obj.attr("ignore")=='ignore'){
			return true;
		}
		obj.val("");
		return "部门负责人不能为空";
	}
	if(!RE.enterPerson.test(gets)) {
		return "部门负责人输入不正确,格式为2~8位中文";
	}
	return true;
};
var contactName = function(gets,obj,curform,datatype) {
	if(!RE.enterPerson.test(gets)) {
		return "联系人姓名格式为2~8位中文";
	}
	return true;
};					
var entername = function(gets,obj,curform,datatype) {
	var value = obj.attr("lang");
	if(!gets || gets == value){
		if (obj.attr("ignore")=='ignore'){
			return true;
		}
		obj.val("");
		return "部门不可为空";
	}
	if(!RE.enterNameReg.test(gets)) {
		return "部门名称输入不正确,格式为1~12位中文、数字或字母组合";
		}
	return true;
};
		
var reMarks = function(gets,obj,curform,datatype){
	var value = obj.attr("lang");
	if(!gets || gets == value){
		if (obj.attr("ignore")=='ignore'){
			return true;
		}
		obj.val("");
		return "请输入备注";
	}
	else if(RE.remarks.test(gets)){  
    	return "备注输入不正确,格式为50位以内的字母，数字或汉字组合";  
	}
	return true;
};
var companyName = function(gets,obj,curform,datatype){
	var value = obj.attr("lang");
	if(!gets || gets == value){
		if (obj.attr("ignore")=='ignore'){
			return true;
		}
		obj.val("");
		return "单位名称不能为空";
	}
	else if(RE.remarks.test(gets)){  
    	return "单位名称输入不正确,格式为50位以内的字母，数字或汉字组合";  
	}
	return true;
};
var evaluate = function(gets,obj,curform,datatype){
	var value = obj.attr("lang");
	if(!gets || gets == value){
		if (obj.attr("ignore")=='ignore'){
			return true;
		}
		obj.val("");
		return "详细评价不能为空";
	}
	else if(RE.remarks.test(gets)){  
    	return "详细评价输入不正确,格式为50位以内的字母，数字或汉字组合";  
	}
	return true;
};
var refundRea = function(gets,obj,curform,datatype){
	var value = obj.attr("lang");
	if(!gets || gets == value){
		if (obj.attr("ignore")=='ignore'){
			return true;
		}
		obj.val("");
		return "退款原因不能为空";
	}
	else if(RE.remarks.test(gets)){  
    	return "退款原因输入不正确,格式为50位以内的字母，数字或汉字组合";  
	}
	return true;
};
var exchRea = function(gets,obj,curform,datatype){
	var value = obj.attr("lang");
	if(!gets || gets == value){
		if (obj.attr("ignore")=='ignore'){
			return true;
		}
		obj.val("");
		return "退货原因不能为空";
	}
	else if(RE.remarks.test(gets)){  
    	return "退货原因输入不正确,格式为50位以内的字母，数字或汉字组合";  
	}
	return true;
};

//40字以内非特殊字符
var titleRemarks = function(gets,obj,curform,datatype) {
	var value = obj.attr("lang");
	if(!gets || gets == value){
		if (obj.attr("ignore")=='ignore'){
			return true;
		}
		obj.val("");
		return "请输入内容";
	}
	if(!RE.titleRemarks.test(gets)) {
		return "请输入40字以内非特殊字符";
	}
	return true;
};

var email = function(gets,obj,curform,datatype) {
	var value = obj.attr("lang");
	if(!gets || gets == value){
		if (obj.attr("ignore")=='ignore'){
			return true;
		}
		obj.val("");
		return "邮箱不能为空";
	}
 	if(!RE.mail.test(gets)) {
		return "邮箱输入不正确";
	}
	return true;
};
			
		

var enteraddr = function(gets,obj,curform,datatype) {
	var value = obj.attr("lang");
	if(!gets || gets == value){
		if (obj.attr("ignore")=='ignore'){
			return true;
		}
		obj.val("");
		return "地址不可为空";
	}
 	if(!RE.enterAddress.test(gets)) {
		return "地址输入不正确";
	}
	return true;
};

var rolename = function(gets,obj,curform,datatype) {
	var value = obj.attr("lang");
	if(!gets || gets == value){
		if (obj.attr("ignore")=='ignore'){
			return true;
		}
		obj.val("");
		return "角色名称不能为空";
	}
	if(!RE.roleName.test(gets)) {
		return "角色名称输入不正确,格式为1~10个中文";
	}
	return true;
};

var realname = function(gets,obj,curform,datatype) {
	var value = obj.attr("lang");
	if(!gets || gets == value){
		if (obj.attr("ignore")=='ignore'){
			return true;
		}
		obj.val("");
		return "姓名不能为空";
	}
	if(!RE.roleName.test(gets)) {
		return "姓名输入不正确";
	}
	return true;
};

var rolemark = function(gets,obj,curform,datatype) {
	var value = obj.attr("lang");
	if(!gets || gets == value){
		if (obj.attr("ignore")=='ignore'){
			return true;
		}
		obj.val("");
		return "角色描述不能为空";
	}
	if(!RE.roleMark.test(gets)) {
		return "角色描述输入不正确";
	}
	return true;
};

var hundredNum = function(gets,obj,curform,datatype) {
	var value = obj.attr("lang");
	if(!gets || gets == value){
		if (obj.attr("ignore")=='ignore'){
			return true;
		}
		obj.val("");
		return "请填写百分数";
	}
	if(!RE.hundrednum.test(gets)) {
		return "百分数输入不正确,格式为0.00~100.00之间";
	}
	return true;
};

var qq = function(gets,obj,curform,datatype) {
	var value = obj.attr("lang");
	if(!gets || gets == value){
		if (obj.attr("ignore")=='ignore'){
			return true;
		}
		obj.val("");
		return "QQ号码不能为空";
	}
	if(!RE.QQ.test(gets)) {
		return "QQ号码输入,格式为5~13位数字";
	}
	return true;
};

//金额 人民币
var acountM  = function(gets,obj,curform,datatype) {
	var value = obj.attr("lang");
	if(!gets || gets == value){
		if (obj.attr("ignore")=='ignore'){
			return true;
		}
		obj.val("");
		return "金额不能为空";
	}
	
	if(!RE.amcountM.test(gets)) {
		return "金额输入不正确，格式如1.00";
	}
	
	//验证最大值
	if(obj.attr("maxVal")!=undefined){
		var number = obj.val();
		var maxVal = obj.attr("maxVal") ;
		if(maxVal=='' || isNaN(maxVal)){
			return "数据错误，当前最大值不是数字";
		}
		if(Number(number)>Number(maxVal)){
			return "输入金额不能大于"+maxVal;
		};
	}
	
	//验证最小值
	if(obj.attr("minVal")!=undefined){
		var number = obj.val();
		var minVal = obj.attr("minVal") ;
		if(minVal=='' || isNaN(minVal)){
			return "数据错误，当前最小值不是数字";
		}
		if(Number(number)<Number(minVal)){
			return "输入金额不能小于"+minVal;
		};
	}
	
	if(obj!=null){
		var number = obj.val();
		obj.val(Number(number).toFixed(2));
	}
	return true;
};

var tell = function(gets,obj,curform,datatype) {
	var value = obj.attr("lang");
	if(!gets || gets == value){
		if (obj.attr("ignore")=='ignore'){
			return true;
		}
		obj.val("");
		return "电话号码不能为空";
	}
	if(!RE.tellPhone.test(gets)) {
		return "电话号码格式如：021-40000000,13812341234";
	}
	return true;
};
var inviteCode = function (gets,obj,curform,datatype) {
	var value = obj.attr("lang");
	if(gets != "" && gets != "请输入邀请码" && !RE.inviteCode.test(gets)){  
	    return "请输入长度为11的正确邀请码";  
	}
	return true;
};
/***法人代表***/
var legal = function (gets,obj,curform,datatype) {
	var value = obj.attr("lang");
	if(!gets || gets == value){
		if (obj.attr("ignore")=='ignore'){
			return true;
		}
		obj.val("");
		return "请输入注册法人";
	}
	if(!RE.legal.test(gets)){  
	    return "注册法人格式不正确";  
	}
	return true;
};
/***开户许可证***/
var accountOpen = function (gets,obj,curform,datatype) {
	var value = obj.attr("lang");
	if(!gets || gets == value){
		if (obj.attr("ignore")=='ignore'){
			return true;
		}
		obj.val("");
		return "请输入开户许可证编号";
	}
	if(!RE.accountOpen.test(gets)){  
	    return "开户许可证编号输入不正确";  
	}
	return true;
};
/*******车牌号***********/
var cartNumber = function (gets,obj,curform,datatype) {
	var value = obj.attr("lang");
	if(!gets || gets == value){
		if (obj.attr("ignore")=='ignore'){
			return true;
		}
		obj.val("");
		return "请输入车牌号";
	}
	if(!RE.cartNumber.test(gets)){  
	    return "车牌号输入不正确";  
	}
	return true;
};

var commonInLengthCheck = function(gets,obj,curform,datatype){//公共输入长度校验
	var value = obj.attr("lang");
	if(!gets || gets == value){
		if (obj.attr("ignore")=='ignore'){
			return true;
		}
		obj.val("");
		return "请输入内容";
	}
	var maxNum = $(obj).attr("maxNum");//最大字数
	var minNum = $(obj).attr("minNum");//最小字数
	var len = $(obj).val().length;//所有字长度
	var r = parseInt(maxNum)-parseInt(len);//剩余可输入长度
	if(minNum != undefined) {//最小限制，根据所需
		if(len < minNum) {
			return "输入内容不能少于"+minNum+"字";
		}
	}
	if(r < 0) {
		return "输入内容不能超过"+maxNum+"字";
	}
	
};
//营业执照
var businessNum=function(gets,obj,curform,datatype){
	var value = obj.attr("lang");
	if(!gets || gets == value){
		if (obj.attr("ignore")=='ignore'){
			return true;
		}
		obj.val("");
		return "请输入营业执照号";
	}	
	if(!RE.businessNum.test(gets)){  
	    return "营业执照号输入不正确，请输入15或18位数字";  
	}	
	return true;
};
//无限大整数
var nNum1 = function(gets,obj,curform,datatype){
	var value = obj.attr("lang");
	if(!gets || gets == value){
		if (obj.attr("ignore")=='ignore'){
			return true;
		}
		obj.val("");
		return "数量不能为空";
	}	
	if(!RE.nNum1.test(gets)){  
	    return "贷款金额为整数";  
	}	
	return true;
};
var nNum33 = function(gets,obj,curform,datatype){
	var value = obj.attr("lang");
	if(!gets || gets == value){
		if (obj.attr("ignore")=='ignore'){
			return true;
		}
		obj.val("");
		return "数量不能为空";
	}	
	if(!RE.nNumOr.test(gets)){  
	    return "负债情况为非负整数";  
	}	
	return true;
};
var nNum2 = function(gets, obj, curform, datatype) {
	//判断要返回	true：正确	false：错误	"错误信息":错误信息
	var maxNumber = $j('[data-maxNum]').attr("data-maxNum");
	if(maxNumber !=null && maxNumber !='' && maxNumber !=undefined && Number(maxNumber) >0){
		if(Number($('[data-maxNum]').val())>=Number(maxNumber)&&RE.nNum2.test(gets)){
			$('[data-maxNum]').val(maxNumber);
		}
	}
	//可选取其他元素值
	var value = obj.attr("lang");
	if (!gets || gets == value) {
		return "内容不可为空";
	}
	if (!RE.nNum1.test(gets)) {
		return "请输入正整数";
	}
	
	//验证通过返回true
	return true;
};
//开店期限
var deadline = function(gets,obj,curform,datatype){
	var value = obj.attr("lang");
	var number = obj.val();
	if(!gets || gets == value){
		if (obj.attr("ignore")=='ignore'){
			return true;
		}
		obj.val("");
		return "请输入开店年限";
	}
	if(!RE.deadline.test(gets)){  
	    return "开店年限范围为1~120的数字";  
	}
	if(Number(number)>120){
		return "开店年限不能大于120";
	};
	if(Number(number)<1){
		return "开店年限不能小于1";
	};
	
	return true;
};
//loanName 借款人姓名
var loanName = function(gets,obj,curform,datatype){
	var value = obj.attr("lang");
	if(!gets || gets == value){
		if (obj.attr("ignore")=='ignore'){
			return true;
		}
		return "姓名不能为空";
	}
	if(!RE.loanName.test(gets)){  
	    return "姓名为2-12位中文";
	}
	return true;
};
//emergencyContact 紧急联系人
var emergencyContact = function(gets,obj,curform,datatype){
	var value = obj.attr("lang");
	if(!gets || gets == value){
		if (obj.attr("ignore")=='ignore'){
			return true;
		}
		return "紧急联系人不能为空";
	}
	if(!RE.loanName.test(gets)){  
	    return "紧急联系人为2-12位中文";
	}
	return true;
};
//emergencyPhone 紧急联系电话
var emergencyPhone = function(gets,obj,curform,datatype){
	var value = obj.attr("lang");
	if(!gets || gets == value){
		if (obj.attr("ignore")=='ignore'){
			return true;
		}
		return "紧急联系电话不能为空";
	}
	if(!RE.zphone.test(gets)){  
	    return "紧急联系电话为11位数字";
	}
	return true;
};
/**
 * 扩展验证规则
 */
var extdatatype = {
		"logname":logname,
		"regpass":regpass,
		"imgcode":imgcode,
		"zPhone":zPhone,
		"Z6":Z6 ,
		"enterperson" : enterperson ,
		"entername" : entername ,
		"reMarks":reMarks,
		"email":email,
		"enteraddr":enteraddr,
		"rolename":rolename,
		"rolemark":rolemark,
		"hundredNum":hundredNum,
		"qq":qq,
		"acountM":acountM,
		"tell":tell,
		"newpass" : newpass,
		"IDCard":IDCard,
		"orgcode":orgcode,
		"zbank":zbank,
		"zbankNum":zbankNum,
		"inviteCode":inviteCode,
		"titleRemarks":titleRemarks,
		"z2_20":z2_20,
		"legal":legal,
		"accountOpen":accountOpen,
		"cartNumber":cartNumber,
		"businessNum":businessNum,
		"lognameOrPhone":lognameOrPhone,
		"regpass2":regpass2,
		"WeiXin":WeiXin,
		"realname":realname,
		"phoneOrEmail":phoneOrEmail,
		"orgcodefmt":orgcodefmt,
		"postCodes":postCodes,
		"zbank1":zbank1,
		"z2_21":z2_21,
		"enterGoodName":enterGoodName,
		"amcountM":acountM ,
		"amcountM1":RE.amcountM ,
		"dianhua":dianhua,
		"isChinese":isChinese,
		"GoodNum":GoodNum,
		"isNum":isNum,
		"isNum3":isNum3,
		"GoodKu":GoodKu,
		"Expressnumber":Expressnumber,
		"Taxpayer":Taxpayer,
		"Taxpayer1":Taxpayer1,
		"dataArea":dataArea,
		"latRe":latRe,
		"lngRe":lngRe,
		"commonInLengthCheck":commonInLengthCheck,
		"nNum1":nNum1,
		"nNum2":nNum2,
		"deadline":deadline,
		"strRegex":strRegex,
		"imgZm":imgZm,
		"evaluate":evaluate,
		"refundRea":refundRea,
		"exchRea":exchRea,
		"industry":industry,
		"profession":profession,
		"companyName":companyName,
		"Logistical":Logistical,
		"LoginName":LoginName,
		"loanName":loanName,
		"emergencyContact":emergencyContact,
		"emergencyPhone":emergencyPhone,
		"contactName":contactName,
		"nNum33":nNum33,
		"familyAddr":familyAddr,
		"socialCode":socialCode
};



//$.extend($.Datatype,{
//	"orgcode":orgcode,
//	"zbank":zbank,
//	"zbankNum":zbankNum,
//	"inviteCode":inviteCode,
//	"titleRemarks":titleRemarks,
//	"z2_20":z2_20,
//	"legal":legal,
//	"accountOpen":accountOpen,
//	"cartNumber":cartNumber,
//	"businessNum":businessNum,
//	"lognameOrPhone":lognameOrPhone,
//	"regpass2":regpass2,
//	"WeiXin":WeiXin,
//	"realname":realname,
//	"phoneOrEmail":phoneOrEmail,
//	"orgcodefmt":orgcodefmt,
//	"postCodes":postCodes,
//	"zbank1":zbank1,
//	"z2_21":z2_21,
//	"enterGoodName":enterGoodName,
//	"amcountM":acountM ,
//	"acountK":acountK,
//	"dianhua":dianhua,
//	"isChinese":isChinese,
//	"GoodNum":GoodNum,
//	"isNum1":isNum1,
//	"isNum2":isNum2,
//	"isNum":isNum,
//	"isNum3":isNum3,
//	"GoodKu":GoodKu
//});			