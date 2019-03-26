// pages/login/dialog.js
const bm = require('../utils/common.js')
var tls = require('../utils/tls.js')
const Page = require('../utils/ald-stat.js').Page;
const app = getApp()
Component({
  properties: {
    dialogHidden: {
      type: Boolean,
      value: true
    },
  },
  methods: {
    //获取手机号码权限
    getPhoneNumber: function (e) {
      var that = this;
      if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '未授权',
          success: function (res) { }
        })
      } else {
        var session_id = wx.getStorageSync('PHPSESSID');//本地取存储的sessionID 
        var is_reg = app.globalData.auth == 0 ? 1 : 0;
        var inviter = app.globalData.inviter ? app.globalData.inviter : 0;
        bm.sessionRequset('/c/login/lxtel_reg', { encdata: e.detail.encryptedData, iv: e.detail.iv, role: 2, is_reg: is_reg, scene: "auto", inviter: inviter }, function (data) {
          if (!data.errcode) {
            app.globalData.token = data.token
            app.globalData.auth = data.auth;
            app.globalData.lxtel = data.userinfo.lxtel;
            app.globalData.weiAccount = data.userinfo.wx;
            app.globalData.loginInfo.identifier = app.globalData.uid = data.userinfo.id;
            app.globalData.loginInfo.identifierNick = data.userinfo.name;
            if (data.userinfo.avatar) {
              app.globalData.selfHeadUrl = data.userinfo.avatar;
            } else {
              app.globalData.selfHeadUrl = 'https://bm.jiangcdn.com/banma/avatar.jpg';
            }
            tls.init({
              sdkappid: app.globalData.loginInfo.sdkAppID,
              identifier: app.globalData.loginInfo.identifier
            })
            app.login(function () {
              app.initIM();
            });
          } else {
            wx.showToast({
              title: data.errmsg,
              icon: 'none'
            })
          }
        }, session_id)
      }
    },
    goCell: function () {
      wx.navigateTo({
        url: '/member/bindPhone',
      })
    },
    hideDialog: function () {
      this.setData({ dialogHidden: true })
    }
  }
})
