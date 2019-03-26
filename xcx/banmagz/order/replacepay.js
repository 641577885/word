// pages/pay/replacepay.js
const bm = require('../utils/common.js');
const Page = require('../utils/ald-stat.js').Page;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ordersn: '',
    user: {},
    order: {},
    accInfo: {},
    allprice: 0,
    maxcount: Number,
    showRed: false,
    id:Number,
    showCancel:false
  },
  getPayOrder: function() {
    var that = this;
    bm.requsetData('/c/order/info', 'get', {ordersn: that.data.ordersn}, function(res) {
      if (!res.data.errcode) {
        res.data.order.begintime = bm.formatDate(res.data.order.begintime);
        res.data.order.endtime = bm.formatDate(res.data.order.endtime);
        that.setData({
          user: res.data.user,
          order: res.data.order,
          allprice: Number(res.data.order.allprice)
        })
        if (app.globalData.uid == that.data.order.sid) {
          that.setData({ showCancel: true })
        }
      } else {
        wx.showToast({
          title: res.data.errmsg,
          icon: 'none'
        })
      }
    }, true)
  },
  goPay: function() {
    wx.navigateTo({
      url: '/pages/pay/pay?ordersn=' + this.data.ordersn+'&type=hire',
    })
  },
  cancelPay:function(){
    var pages = getCurrentPages(); // 当前页面
    var beforePage = pages[pages.length - 2]; 
    bm.requsetData("/b/project/cancel", "post", { id: this.data.order.pid},function(res){
      if(!res.data.errcode){
        wx.showToast({
          title: '取消订单成功',
          success:function(){
            setTimeout(function(){
              wx.navigateBack({
                success: function () {
                  beforePage.onLoad(); // 执行前一个页面的onLoad方法
                }
              });
            },1000)
          }          
        })
      }else{
        wx.showToast({
          title: res.data.errmsg,
          icon:"none"
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (app.globalData.auth) {
      this.setData({
        ordersn: options.ordersn
      })
      this.getPayOrder();
    } else {
      app.authCallback = auth => {
        if (app.globalData.auth==0){
          var session_id = wx.getStorageSync('PHPSESSID'); //本地取存储的sessionID 
          bm.sessionRequset('/c/login/auto_reg',{}, function (data) {
            if (!data.errcode) {
              app.globalData.token = data.token
              app.globalData.uid = data.uid
            } else {
              wx.showToast({
                title: data.errmsg,
                icon: "none"
              })
            }
          }, session_id)
        }
        this.setData({
          ordersn: options.ordersn
        })
        this.getPayOrder();
      }
    }
  },
  getFormId: function (e) {
    var formid = e.detail.formId;
    app.addformId(formid)
  }
})