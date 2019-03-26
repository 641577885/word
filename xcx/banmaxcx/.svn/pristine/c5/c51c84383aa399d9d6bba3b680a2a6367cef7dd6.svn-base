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

       // var id = JSON.stringify(options.idm.id)
    var id = options.list
    // var money=options.money
    var tk = app.globalData.token
    var host = app.globalData.host
    var url = host + '/html/applyticket/eleticket.html?tk=' + tk + '&id=' + id + '&host=' + host;

    this.setData({ url: url })
  }
})