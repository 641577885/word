// pages/worker/wallet/problem.js
var app = getApp();
var bm = require('../../utils/common.js');
const Page = require('../../utils/ald-stat.js').Page;
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
    var url = host + '/html/wallet/problem.html';
    this.setData({ url: url })
  },
})