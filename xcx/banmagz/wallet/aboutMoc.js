
// pages/tcash/banlance.js
const Page = require('../utils/ald-stat.js').Page;
var app = getApp();
Page({
  data: {
    url: ''
  },
  onLoad: function (options) {
    var host = app.globalData.host
    var url = host + '/html/moc/walletgu.html'
    this.setData({ url: url })
  },
})