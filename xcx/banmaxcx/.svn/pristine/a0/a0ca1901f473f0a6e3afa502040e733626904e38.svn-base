// pages/setting/mySetting.js
var app = getApp();
var bm = require('../utils/common.js')
const Page = require('../utils/ald-stat.js').Page;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tel_text: '',
    bind: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    var that = this
    var tel = app.globalData.lxtel
    console.log(tel)
    if (tel.length == 0) {
      that.setData({
        tel_text: '绑定',
        bind: 'bindphone'
      })
    } else {
      that.setData({
        tel_text: '修改',
        bind: 'unbindphone'
      })
    }
  },
  unbindphone: function () {
    wx.navigateTo({
      url: '/pages/yzm/yzm?type=3',
    })
  },
  bindphone: function () {
    wx.navigateTo({
      url: '/setting/modifyPhone',
    })
  },
})