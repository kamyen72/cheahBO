function getFormatDate(date) {
	if (date) {
		return new Date(Date.parse(formatDate(new Date(date), true)));
	} else {
		return new Date(Date.parse(formatDate(new Date(), true)));
	}
}

function formatDate(date, withTime) {
	if (!date) return;
	var options = {
		hour: '2-digit',   //(e.g., 02)
		minute: '2-digit', //(e.g., 02)    
		second: '2-digit', //(e.g., 02)         
		hour12: false,     // 24 小時制
		timeZone: 'Asia/Taipei' // 美國/紐約
	};

	//var tmpTimeout = date.toLocaleTimeString('en-US', { timeZone: 'Asia/Taipei', hour12: true });
	// 台北:Asia/Taipei 亞加達:Asia/Jakarta
	var tmpTimeout = date.toLocaleTimeString('en-US', { timeZone: 'Asia/Jakarta', hour12: true });
	var timeout = '';
	if (tmpTimeout.indexOf('AM')) {
		tmpTimeout = date.toLocaleTimeString('en-US', { timeZone: 'Asia/Jakarta', hour12: false });
		if (parseInt(tmpTimeout.split(':')[0]) > 23) {
			timeout += '00:' + tmpTimeout.split(':')[1] + ':' + tmpTimeout.split(':')[2];
		}
		else {
			timeout = date.toLocaleTimeString('en-US', { timeZone: 'Asia/Jakarta', hour12: false });
		}
	}
	else {
		timeout = date.toLocaleTimeString('en-US', { timeZone: 'Asia/Jakarta', hour12: false });
	}
	tmpTimeout = '';

	//var hours = date.getHours();
	//var minutes = date.getMinutes();
	//var ampm = hours >= 12 ? 'pm' : 'am';
	//hours = hours % 12;
	//hours = hours ? hours : 12; // the hour '0' should be '12'
	//minutes = minutes < 10 ? '0' + minutes : minutes;
	//var strTime = hours + ':' + minutes + ' ' + ampm;
	//var strDate = date.getFullYear() + '-' + (date.getMonth() + 1) + "-" + date.getDate();
	//var hours = timeout.split(':')[0];
	//var minutes = timeout.split(':')[1];
	//var second = timeout.split(':')[2];
	//var strTime = hours + ':' + minutes + ':' + second;

	var strDate = date.toLocaleDateString('zh-TW', { timeZone: 'Asia/Jakarta', hour12: false });
	var nowMonth = new Date().getMonth() + 1;
	var formatMonth = new Date(strDate).getMonth() + 1;
	if (nowMonth != formatMonth) {
		var splitDate = strDate.split('/');
		var thisMonth = parseInt(splitDate[1]);
		// 日月相反了
		if (nowMonth == thisMonth) {
			strDate = splitDate[(splitDate.length - 1)] + '/' + splitDate[(splitDate.length - 2)] + '/' + splitDate[0];
		}
	}

	return withTime ? strDate + " " + timeout : strDate;
}

function getDateS(date) {
	if (!date) return;

    return date.getFullYear() + '/' + (date.getMonth() + 1) + "/" + date.getDate() + ' 00:00:00';
    //return date.toLocaleDateString('zh-TW', { timeZone: 'Asia/Taipei' }) + ' 00:00:00';
	//return new Date(date.getFullYear() + '/' + (date.getMonth() + 1) + "/" + date.getDate() + ' 00:00:00').toUTCString();
}

function getDateE(date) {
    if (!date) return;

    return date.getFullYear() + '/' + (date.getMonth() + 1) + "/" + date.getDate() + ' 23:59:59';
	//return date.toLocaleDateString('zh-TW', { timeZone: 'Asia/Taipei' }) + ' 23:59:59';
	//return new Date(date.getFullYear() + '/' + (date.getMonth() + 1) + "/" + date.getDate() + ' 23:59:59').toUTCString();
}

function getLastWeek() {
	let lastWeek = {};
	let date = new Date();
	if(date.getDay() === 0) {
		// 若為周日需往前一天抓 (不然周日會抓到當周)
		date.setDate(date.getDate() - 1);
	}
	// 上周一的日期
	date.setDate(date.getDate() - 7 - date.getDay() + 1);
	lastWeek.start_day = date.getFullYear() + "/" + `${date.getMonth() + 1}`.padStart(2, 0) + "/" + `${date.getDate()}`.padStart(2, 0) + ' 00:00:00';
  
	// 上周日的日期
	date.setDate(date.getDate() + 6 );
	lastWeek.end_day = date.getFullYear() + "/" + `${date.getMonth() + 1}`.padStart(2, 0) + "/" + `${date.getDate()}`.padStart(2, 0) + ' 23:59:59';

	return { DateS: lastWeek.start_day, DateE: lastWeek.end_day }
}

function getLastMonth() {
	let lastMonth = {};
	let date = new Date();
	let year = date.getFullYear();
	let month = date.getMonth();
	if (month == 0) {
		month = 12;
		year = year - 1;
	
	}
	if (month < 10) {
		month = '0' + month;
	}
	let lastDate = new Date(year, month, 0);

	lastMonth.start_day = year + '/' + month + '/01 00:00:00';
	lastMonth.end_day = year + '/' + month + '/' + `${lastDate.getDate()}`.padStart(2, 0) + ' 23:59:59';

	return { DateS: lastMonth.start_day, DateE: lastMonth.end_day }
}