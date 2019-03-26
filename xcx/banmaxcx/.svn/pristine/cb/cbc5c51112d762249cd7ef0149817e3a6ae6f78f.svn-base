var app = getApp();
var bm = require('../../utils/common.js');
const Page = require('../../utils/ald-stat.js').Page;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // url:''
    price: '',
    ordersn: ''
  },
  inputnum: function (e) {
    this.setData({ price: e.detail.value })
  },
  nextbtn: function () {
    var that = this;
    bm.requsetData('/c/order/cz', 'get', { price: that.data.price }, function (res) {
      that.setData({ ordersn: res.data.ordersn })
      console.log(res.data.ordersn)

      if (!res.data.errcode) {
        wx.navigateTo({
          url: '../pay/pay?type=recharge&ordersn=' + that.data.ordersn,
        })
      } else {
        wx.showToast({
          title: res.data.errmsg,
          icon: 'none'
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var host = app.globalData.host
    // var url = host + '/html/moc/mocRechange.html?tk=' + app.globalData.token;
    // this.setData({ url: url })
  },
})