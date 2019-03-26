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
    var tk = app.globalData.token;
    var host = app.globalData.host;
    var role = app.globalData.role;
    var id = options.id;
    var url = host + '/html/applyticket/detailticket.html?tk=' + tk + '&id=' + id + '&role=' + role;
    this.setData({ url: url });
  }
})