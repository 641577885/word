// help/agreement.js
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

  privacy:function(e){
    wx.navigateTo({
      url: '/help/privacy',
    })
  }
})