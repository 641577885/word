

// pages/tcash/tcash.js
var app = getApp();
var bm = require('../../utils/common.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var role = app.globalData.role;
    var uid = app.globalData.uid;
    var tk = app.globalData.token
    var host = app.globalData.host
    var url = host + '/html/shareImg/sharegu.html?tk=' + tk + '&role=2'+'&uid=' + uid + "&" + new Date().getTime()
    this.setData({ url: url })
  },
})