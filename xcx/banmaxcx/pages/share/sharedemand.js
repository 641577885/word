// pages/share/sharedemand.js
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
    var id = options.id
    var tk = app.globalData.token
    var host = app.globalData.host
    var url = host + '/html/shareImg/sharedemand.html?tk=' + tk + '&id=' + id + "&" + new Date().getTime()
    this.setData({ url: url })
  },

  
})