
// 时间戳转日期格式 例：2010年12月23日 10:53
function getLocalTime(nS) {

	var now = new Date(parseInt(nS));
	// return now.toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
	  return now.format("yyyy-MM-dd HH:mm:ss");
}
// 时间戳转日期格式 例：2010年12月23日 10:53
function convertDateToTime(nS) {

    // return now.toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
    return nS.format("yyyy-MM-dd HH:mm:ss");
}
function getLocalTimeYMD(nS) {
		var now = new Date(parseInt(nS));
		return now.format("yyyy-MM-dd");
}

function getLocalTimeStyle(timeStamp) {
	timeStamp = checkNull(timeStamp);
	if (timeStamp != "") {
		var date = new Date();
		date.setTime(timeStamp);
		var y = date.getFullYear();
		var m = date.getMonth() + 1;
		m = m < 10 ? ('0' + m) : m;
		var d = date.getDate();
		d = d < 10 ? ('0' + d) : d;
		var h = date.getHours();
		h = h < 10 ? ('0' + h) : h;
		var minute = date.getMinutes();
		var second = date.getSeconds();
		minute = minute < 10 ? ('0' + minute) : minute;
		second = second < 10 ? ('0' + second) : second;
		return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
	}
	return "";
}

function getLocalTimeStyleH_m(timeStamp) {
//  timeStamp = checkNull(timeStamp);
  if (timeStamp != "" && timeStamp != null) {
    var date = new Date();
    date.setTime(timeStamp);
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    minute = minute < 10 ? ('0' + minute) : minute;
    return  h + ':' + minute;
  }
  return "";
}

function getLocalTimeStyleY(timeStamp) {
	timeStamp = checkNull(timeStamp)
	if (timeStamp != "") {
		var date = new Date();
		date.setTime(timeStamp);
		var y = date.getFullYear();
		return y;
	}
	return "";
}

function getLocalTimeStyleY_M(timeStamp) {
	timeStamp = checkNull(timeStamp)
	if (timeStamp != "") {
		var date = new Date();
		date.setTime(timeStamp);
		var y = date.getFullYear();
		var m = date.getMonth() + 1;
		m = m < 10 ? ('0' + m) : m;
		return y + '-' + m
	}
	return "";
}
function getLocalTimeStyleYMD(timeStamp) {
//  timeStamp = checkNull(timeStamp);
  if (timeStamp != "" && timeStamp != null) {
    var date = new Date();
    date.setTime(timeStamp);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    return y + '-' + m + '-' + d;
  }
  return "";
}

/**
 * 对Date的扩展，将 Date 转化为指定格式的String 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q)
 * 可以用 1-2 个占位符 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) java风格 eg: (new
 * Date()).pattern("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 (new
 * Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04 (new
 * Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04 (new
 * Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04 (new
 * Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
 */
Date.prototype.format = function(fmt) {
	var o = {
		"M+" : this.getMonth() + 1, // 月份
		"d+" : this.getDate(), // 日
		"h+" : this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, // 小时
		"H+" : this.getHours(), // 小时
		"m+" : this.getMinutes(), // 分
		"s+" : this.getSeconds(), // 秒
		"q+" : Math.floor((this.getMonth() + 3) / 3), // 季度
		"S" : this.getMilliseconds()
	// 毫秒
	};
	var week = {
		"0" : "/u65e5",
		"1" : "/u4e00",
		"2" : "/u4e8c",
		"3" : "/u4e09",
		"4" : "/u56db",
		"5" : "/u4e94",
		"6" : "/u516d"
	};
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "")
				.substr(4 - RegExp.$1.length));
	}
	if (/(E+)/.test(fmt)) {
		fmt = fmt
				.replace(
						RegExp.$1,
						((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f"
								: "/u5468")
								: "")
								+ week[this.getDay() + ""]);
	}
	for ( var k in o) {
		if (new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k])
					: (("00" + o[k]).substr(("" + o[k]).length)));
		}
	}
	return fmt;
}

function getMaxDate() {
	var clock = currentTime();
	var dt;
	var times = 0;
	dt = $("#startTime").val();
	if (dt != '') {
		times = Date.parse(dt.replace(/-/g, '/')) + 30 * 24 * 60 * 60 * 1000;// 时间间隔为10天

		if (times - Date.parse(clock.replace(/-/g, '/')) < 0) {
			var d1 = new Date(times);
			var year = d1.getFullYear();
			var month = d1.getMonth() + 1; // 月份以0开头
			var day = d1.getDate();

			var hh = d1.getHours();
			var mm = d1.getMinutes();

			var clock = year + "-";

			if (month < 10)
				clock += "0";
			clock += month + "-";

			if (day < 10)
				clock += "0";
			clock += day + " ";

			if (hh < 10)
				clock += "0";
			clock += hh + ":";

			if (mm < 10)
				clock += '0';
			clock += mm;

		}
	}
	return clock;
}

function getMaxTime() {
	var clock = currentDate();
	var dt;
	var times = 0;
	dt = $("#startTime").val();
	if (dt != '') {
		times = Date.parse(dt.replace(/-/g, '/')) + 30 * 24 * 60 * 60 * 1000;// 时间间隔为10天

		if (times - Date.parse(clock.replace(/-/g, '/')) < 0) {
			var d1 = new Date(times);
			var year = d1.getFullYear();
			var month = d1.getMonth() + 1; // 月份以0开头
			var day = d1.getDate();

			var clock = year + "-";

			if (month < 10)
				clock += "0";
			clock += month + "-";

			if (day < 10)
				clock += "0";
			clock += day + " ";

			clock += "23:59:59";

		}
	}
	return clock;
}

function currentDate(day) {
	var now = new Date();

	var year = now.getFullYear();
	var month = now.getMonth() + 1;
	var day = now.getDate()+day;

	var hh = now.getHours();
	var mm = now.getMinutes();

	var clock = year + "-";

	if (month < 10)
		clock += "0";
	clock += month + "-";

	if (day < 10)
		clock += "0";
	clock += day + " ";
	clock +=  "23:59:59";

	return (clock);
}

function currentTime() {
	var now = new Date();

	var year = now.getFullYear();
	var month = now.getMonth() + 1;
	var day = now.getDate();

	var hh = now.getHours();
	var mm = now.getMinutes();

	var clock = year + "-";

	if (month < 10)
		clock += "0";
	clock += month + "-";

	if (day < 10)
		clock += "0";
	clock += day + " ";

	if (hh < 10)
		clock += "0";
	clock += hh + ":";

	if (mm < 10)
		clock += '0';
	clock += mm;
	return (clock);
}

function getNowTime() {
	var now = new Date();

	var year = now.getFullYear();
	var month = now.getMonth() + 1;
	var day = now.getDate();

	var hh = now.getHours();
	var mm = now.getMinutes();
	var ss = now.getSeconds();

	var clock = year + "-";

	if (month < 10)
		clock += "0";
	clock += month + "-";

	if (day < 10)
		clock += "0";
	clock += day + " ";

	if (hh < 10)
		clock += "0";
	clock += hh + ":";

	if (mm < 10)
		clock += '0';
	clock += mm + ":";

	if (ss < 10)
		clock += '0';
	clock += ss;
	return (clock);
}

// 发送POST请求跳转到指定页面
function httpPost(URL, PARAMS) {
	var temp = document.createElement("form");
	temp.action = URL;
	temp.method = "post";
	temp.style.display = "none";

	for ( var x in PARAMS) {
		var opt = document.createElement("textarea");
		opt.name = x;
		opt.value = PARAMS[x];
		temp.appendChild(opt);
	}

	document.body.appendChild(temp);
	temp.submit();

	return temp;
}
function checkDate() {
	var startTime = new Date($("#startTime").val().replace(/-/,"/")).format("yyyy-MM-dd");
	var endTime = new Date($("#endTime").val().replace(/-/,"/")).format("yyyy-MM-dd");
	var today_start;// 今天开始时间
	var today_end;// 今天结束时间
	var yesterday_start;// 昨天开始时间
	var yesterday_end;// 昨天结束时间
	var theWeek_start;// 这周开始时间
	var theWeek_end;// 这周结束时间
	var lastWeek_start;// 上周开始时间
	var lastWeek_end;// 上周结束时间
	var theMonth_start;// 当月开始时间
	var theMonth_end;// 当月结束时间
	var lastMonth_start;// 上月开始时间
	var lastMonth_end;// 上月结束时间

	var now = new Date();
	today_start = now.format("yyyy-MM-dd");
	today_end = now.format("yyyy-MM-dd");

	now.setTime(now.getTime() - 24 * 60 * 60 * 1000);
	yesterday_start = now.format("yyyy-MM-dd");
	yesterday_end = now.format("yyyy-MM-dd");
	// 一天的毫秒数
	var millisecond = 1000 * 60 * 60 * 24;
	// 获取当前时间
	var currentDate = new Date();
	// 返回date是一周中的某一天
	var week = currentDate.getDay();
	// 减去的天数
	var minusDay = week;
	// 获得当前周的第一天
	var currentWeekFirstDay = new Date(currentDate.getTime()
			- (millisecond * minusDay));
	theWeek_start = currentWeekFirstDay.format("yyyy-MM-dd");
	// 获得当前周的最后一天
	var currentWeekLastDay = new Date(currentWeekFirstDay.getTime()
			+ (millisecond * 6));
	theWeek_end = currentWeekLastDay.format("yyyy-MM-dd");

	currentDate = new Date(currentDate.getTime() + (millisecond * 7 * -1));
	// 获得当前周的第一天
	var currentWeekFirstDay = new Date(currentDate.getTime()
			- (millisecond * minusDay));
	lastWeek_start = currentWeekFirstDay.format("yyyy-MM-dd");
	// 获得当前周的最后一天
	var currentWeekLastDay = new Date(currentWeekFirstDay.getTime()
			+ (millisecond * 6));
	lastWeek_end = currentWeekLastDay.format("yyyy-MM-dd");

	var date = new Date();
	date.setDate(1);
	theMonth_start = date.format("yyyy-MM-dd");

	date = new Date();
	var currentMonth = date.getMonth();
	var nextMonth = ++currentMonth;
	var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
	var oneDay = 1000 * 60 * 60 * 24;
	theMonth_end = new Date(nextMonthFirstDay - oneDay).format("yyyy-MM-dd");

	var nowdays = new Date();
	var year = nowdays.getFullYear();
	var month = nowdays.getMonth();
	if (month == 0) {
		month = 12;
		year = year - 1;
	}
	if (month < 10) {
		month = "0" + month;
	}

	var firstDay = year + "-" + month + "-" + "01";// 上个月的第一天
	lastMonth_start = firstDay;

	var myDate = new Date(year, month, 0);
	var lastDay = year + "-" + month + "-" + myDate.getDate();// 上个月的最后一天
	lastMonth_end = lastDay;
	
	if(startTime==today_start&&endTime==today_end){
		$("#dateTime").val('1');
	}else if(startTime==yesterday_start&&endTime==yesterday_end){
		$("#dateTime").val('2');
	}else if(startTime>=theWeek_start&&endTime<=theWeek_end){
		$("#dateTime").val('3');
	}else if(startTime>=lastWeek_start&&endTime<=lastWeek_end){
		$("#dateTime").val('4');
	}else if(startTime>=theMonth_start&&endTime<=theMonth_end){
		$("#dateTime").val('5');
	}else if(startTime>=lastMonth_start&&endTime<=lastMonth_end){
		$("#dateTime").val('6');
	}else{
		$("#dateTime").val('0');
	}
}
function checkPic(equipmentFile){
    var  browserCfg = {};
    var ua = window.navigator.userAgent;
    if (ua.indexOf("MSIE")>=1){
        browserCfg.ie = true;
    }else if(ua.indexOf("Firefox")>=1){
        browserCfg.firefox = true;
    }else if(ua.indexOf("Chrome")>=1){
        browserCfg.chrome = true;
    }
    if (!/\.(jpg|jpeg|png|JPG|JPEG|PNG)$/.test(equipmentFile.toUpperCase())) {
        alert("图片类型必须是jpeg,jpg,png中的一种");
        ths.value = "";
        return false;
    }
}

function importPic() {
    let equipmentFile = $("#equipmentFile").val();
    if (null == equipmentFile || "" == equipmentFile) {
        showErrorToast('请选择需要上传的图片');
        return false;
    }
    checkPic(equipmentFile);

    //获取文件对象，files是文件选取控件的属性，存储的是文件选取控件选取的文件对象，类型是一个数组
    let fileObj =  $('#equipmentFile')[0].files[0];

    //创建formdata对象，formData用来存储表单的数据，表单数据时以键值对形式存储的。
    var formData = new FormData();
    formData.append('equipmentFile', fileObj);

    $.ajax({
        url: baseUrl + "systemSet/pictureSetSave.shtml",
        type: 'POST',
        data: formData,
        async: false,
        cache: false,
        contentType: false,
        processData: false,
        dataType: 'json',
        success: function (data) {
            if(data.code==0){
                var result=document.getElementById("destination");
                //显示文件
                result.innerHTML='<img  style="width:200px;heigth:100px;" src="' + data.msg +'" alt="" />';
                $('#thumbnail').val(data.msg);
            }else{ var index = parent.layer.getFrameIndex(window.name);
                showErrorToast(data.msg);
            }
        }
    });
}
module.exports={
  getLocalTime: getLocalTime,
  convertDateToTime: convertDateToTime,
  getLocalTimeStyleH_m: getLocalTimeStyleH_m,
  getLocalTimeStyleYMD: getLocalTimeStyleYMD
}
