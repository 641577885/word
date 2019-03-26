// pages/login/loading.js
const bm = require('../../utils/common.js')
const Page = require('../../utils/ald-stat.js').Page;
var app=getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    act_id:0
  },
  getAuthStep:function(){
    var that = this;
    var session_id = wx.getStorageSync('PHPSESSID');//本地取存储的sessionID  
    bm.sessionRequset('/c/login/next_view', { role: 1, access_token: app.globalData.token}, function (data) {
      if (!data.errcode) {
        switch (data.auth) {
          case 1:
            wx.redirectTo({
              url: '/worker/my/jobWanted',
            });
            break;
          case 2: 
            wx.switchTab({
              url: '/pages/worker/list',
            })
            break;
          default:
            wx.redirectTo({
              url: '/pages/worker/follow',
            });
        }
      } else {
        wx.showToast({
          title: data.errmsg,
          icon: 'none'
        })
      }
    }, session_id)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    wx.showLoading();
    if (options) {
      if (options.scene) {
        var scene = bm.GetParameter(decodeURIComponent(options.scene));
        app.globalData.inviter = scene.inviter;
      }
      if (options.inviter) {
        app.globalData.inviter = options.inviter;
      }
      if (options.act_id) {
        app.globalData.act_id = options.act_id;
      }
    }
    if (app.globalData.auth!=null) {
      that.getAuthStep();
    } else {
      app.authCallback = auth => {
        that.getAuthStep();
      }
    }
  },
})