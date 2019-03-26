//wx.request 微信请求
//var host ='http://www.ksbanma.com';
var host = 'https://www.itszebra.com';
function requsetData(url, method, query, fun, notoken) {
  var app = getApp();
  if (notoken) {
    var url = host + url;
  } else {
    if (url.indexOf('?') != -1) {
      var url = host + url + '&access_token=' + app.globalData.token;
    } else {
      var url = host + url + '?access_token=' + app.globalData.token;
    }
  }
  wx.request({
    url: url,
    data: query,
    method: method, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    success: function (res) {
      fun(res)
    },
    fail: function () {
      // fail
    },
    complete: function () {
      // complete
    }
  })
}

function sessionRequset(url, query, fun, session_id) {
  if (session_id != "" && session_id != null) {
    query.se_key = session_id;
  }
  wx.request({
    url: host + url,
    data: query,
    success: function (res) {
      fun(res.data)
    },
    fail: function () {
      // fail
    },
    complete: function () {
      // complete
    }
  })
}


//正则表达式验证
function regEx(content, type) {
  var reg;
  if (type == 'id')//身份证
    reg = /(^\d{15})|(^\d{18})|(^\d{17}(\d|X|x))/;
  else if (type == 'email')
    reg = /^([a-zA-Z0-9]+[_|\_|\.|\-]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}/;
  else if (type == 'cell')
    reg = /^1[3|4|5|8|7][0-9]\d{8}/;
  else if (type == 'isnum')
    // reg = /^[0-9]*/;
    reg = /^[0-9]*$/;
  else if (type == 'url')
    reg = /^http(s?):\/\/(?:[A-za-z0-9-]+\.)+[A-za-z]{2,4}(?:[\/\?#][\/=\?%\-&~`@[\]\':+!\.#\w]*)?/;
  else if (type == 'password')
    reg = /^[0-9a-zA-Z]{6,20}$/;
  else if (type == 'qq')
    reg = /^[1-9]\d{4,10}$/;
  return reg.test(content) ? true : false;
}

function formatMonth(number) {
  if (number) {
    var n = number * 1000;
    var date = new Date(n);
  } else {
    var date = new Date();
  }
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  return [year, month].map(formatNumber).join('-')
}

function formatDate(number) {
  var n = number * 1000;
  var date = new Date(n);
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  return [year, month, day].map(formatNumber).join('-')
}

function formatTime(number) {
  var n = number * 1000;
  var date = new Date(n);
  var todate = new Date()
  if (date.toDateString() === todate.toDateString()) {
    //今天
    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()
    return [hour, minute, second].map(formatNumber).join(':')
  } else {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()
    return [year, month, day].map(formatNumber).join('/') + " " + [hour, minute, second].map(formatNumber).join(':')
  }
}

function formatToday(num) {
  var myDate = new Date();
  if (num) {
    myDate.setDate(myDate.getDate() + num);
  }
  var year = myDate.getFullYear();
  var month = myDate.getMonth() + 1;
  var day = myDate.getDate();
  return [year, month, day].map(formatNumber).join('-');
}

function GetParameter(str){
  var arr = str.split("&");
  var opData = {};
  for (var i in arr) {
    arr[i] = arr[i].split("=");
    opData[arr[i][0]] = arr[i][1];
  }
  return opData;
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
//图片预览
function imgYu(src,list) {
  var src = src;
  var list = list;
  //图片预览
  wx.previewImage({
    current: src, // 当前显示图片的http链接
    urls: list // 需要预览的图片http链接列表
  })
}
module.exports = { requsetData, sessionRequset, regEx, formatMonth, formatDate, formatToday, formatTime, imgYu, GetParameter}