// pages/openvip/vipExplain.js
const Page = require('../../utils/ald-stat.js').Page;
var app = getApp()
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
    var host = app.globalData.host
    var url = host + '/html/vip/vipExplain.html'
    this.setData({ url: url })
  },

})