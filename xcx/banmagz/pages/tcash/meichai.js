// pages/tcash/meichai.js
const Page = require('../../utils/ald-stat.js').Page;
var app = getApp();
Page({
  data: {
    url: ''
  },
  onLoad: function (options) {
    var host = app.globalData.host
    var url = host + '/html/tcash/meichai.html'
    this.setData({ url: url })
  },
})