// pages/tcash/tcash.js
const Page = require('../../utils/ald-stat.js').Page;
var app = getApp();
var bm = require('../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var tk = app.globalData.token
    var role = app.globalData.role
    var host = app.globalData.host
    var url = host+'/html/tcash/tcash.html?tk=' + tk+'&role='+role
    this.setData({ url: url })
  },
})