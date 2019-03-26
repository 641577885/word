// pages/tcash/wallet.js
const Page = require('../../utils/ald-stat.js').Page;
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
      var that = this
      if (app.globalData.auth) {
        var tk = app.globalData.token;
        var host = app.globalData.host;
        var url = host + '/html/wallet/wallet.html?tk=' + tk + '&role=2'
        this.setData({ url: url })
      } else {
        app.authCallback = auth => {
            var tk = app.globalData.token;
            var host = app.globalData.host;
            var url = host + '/html/wallet/wallet.html?tk=' + tk + '&role=2'
            this.setData({ url: url })
          
        }
      }
  }
})