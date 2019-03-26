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
    showBox:false
  },
 
  getList: function () {
    var that = this;
    bm.requsetData('/c/worker/resume', 'get', { uid: that.data.uid }, function (res) {
      if (!res.data.errcode) {
        that.setData({ userInfo: res.data.user, markInfo: res.data.mark})
      }
    })
    that.getMarkList();
  },
  getMarkList: function () {
    var that = this;
    var list = that.data.pjList || [];
    bm.requsetData('/c/worker/mark/list', 'get', { uid: that.data.uid, limit: 10, page: that.data.page }, function (res) {
      if (!res.data.errcode) {
        if (res.data.list.length != 0) {
          list = list.concat(res.data.list);
          that.data.page++;
          that.setData({
            pjList: list,
            page: that.data.page,
            showBox: false
          })
        } else {
          if (that.data.page==1){
            that.setData({showBox: true})
          }else{
            wx.showToast({
              title: '已没有更多评价',
              icon: 'none'
            })
          }
        }
      }
    })
  },
  onReachBottom: function () {
    this.getMarkList();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (options.preview) {
      that.setData({ preview: options.preview })
    }
    that.setData({ uid: options.uid });
    if (app.globalData == 0) {
      that.setData({
        isShowDialog: false
      })
    }
    that.getList();
  }
})