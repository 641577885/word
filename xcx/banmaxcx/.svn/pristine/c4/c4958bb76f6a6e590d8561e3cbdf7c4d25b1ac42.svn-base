// pages/tcash/wallet.js
var app = getApp();
var bm = require('../../utils/common.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: '',
    isShowDialog: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
      var that = this
      if (app.globalData.auth) {
        var tk = app.globalData.token
        var role = app.globalData.role
        var host = app.globalData.host
        var url = host + '/html/wallet/wallet.html?tk=' + tk + '&role=' + role
        this.setData({ url: url })
      } else {
        app.authCallback = auth => {
          
            var tk = app.globalData.token
            var role = app.globalData.role
            var host = app.globalData.host
            var url = host + '/html/wallet/wallet.html?tk=' + tk + '&role=' + role
            this.setData({ url: url })
          
        }
      }
  },

})