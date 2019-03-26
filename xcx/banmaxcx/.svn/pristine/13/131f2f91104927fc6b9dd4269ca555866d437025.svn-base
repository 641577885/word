// pages/resume/gyResume.js
const bm = require('../utils/common.js')
const webim = require('../utils/webim.js');
const Page = require('../utils/ald-stat.js').Page;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid: Number,
    isShowDialog: true,
    gylist: [],
    page: 1,
    userInfo: {},
    markInfo: {},
  },
  applyAddFriend: function () {
    var that = this;
    var add_friend_item = [
      {
        'To_Account': that.data.uid,  //用户Id
        "AddSource": "AddSource_Type_Unknow",
        "AddWording": "" //加好友附言，可为空
      }
    ];
    var options = {
      'From_Account': app.globalData.loginInfo.identifier,
      'AddFriendItem': add_friend_item
    };
    webim.applyAddFriend(
      options,
      function (resp) {
        wx.navigateTo({
          url: '/message/dialog?skipid=' + that.data.uid,
        })
      },
      function (err) {
        if (err.ErrorInfo.indexOf('SNS_FRD_ADD_FRD_EXIST')) {
          wx.navigateTo({
            url: '/message/dialog?skipid=' + that.data.uid,
          })
        } else {
          console.warn(err);
        }
      }
    );
  },
  getList: function () {
    var that = this;
    bm.requsetData('/c/worker/resume', 'get', { uid: that.data.uid }, function (res) {
      if (!res.data.errcode) {
        that.setData({ userInfo: res.data.user, markInfo: res.data.mark, resumeInfo: res.data.resume })
      }
    }, true)
    bm.requsetData('/b/worker/bgcheck/list', 'get', { uid: that.data.uid, page: that.data.page, limit: 10 }, function (res) {
      if (!res.data.errcode) {
        for (let i = 0; i < res.data.list.length; i++) {
          res.data.list[i]["ctime"] = bm.formatDate(res.data.list[i]["ctime"])
        }
        that.setData({ gylist: res.data.list })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({ uid: options.uid });
    if (app.globalData == 0) {
      that.setData({
        isShowDialog: false
      })
    }
    that.getList();
  }
})