// help/help.js
var app = getApp();
var bm = require('../utils/common.js')
const Page = require('../utils/ald-stat.js').Page;
Page({

  /**
    * 页面的初始数据
    */
  data: {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  formSubmit: function (e) {
    var that = this
    var content = e.detail.value.content
    bm.requsetData('/c/action/feed_back', 'post', { contents: content }, function (data) {
      if (data.data.errcode == 0) {
        wx.showToast({
          title: data.data.errmsg,
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 1,
          })
        }, 1500)
      } else {
        wx.showToast({
          title: data.data.errmsg,
          icon: 'none'
        })
      }
    })
  }
})