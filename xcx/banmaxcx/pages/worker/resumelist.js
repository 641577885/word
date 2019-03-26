// pages/business/position/linkup.js
const bm = require('../../utils/common.js')
const Page = require('../../utils/ald-stat.js').Page;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    hiddentext: true,
    page: 1,
    hiddens: false
  },
  //点击跳转到个人简历页面
  resumeClick: function (e) {
    console.log(getApp().globalData)
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/message/dialog?skipid=' + id,
    })
  },
  bottom: function (e) {
    // this.getList();
  },
  sendDemand: function () {
    wx.reLaunch({
      url: '/pages/worker/list'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(this.data)
    var that = this
    var id = options.id
    var type = options.type
    this.getList()

  },
  getList: function () {
    wx.showToast({
      title: '正在加载',
      icon: 'loading',
    })
    var that = this
    this.setData({
      flag: 1
    })
    var data = { page: this.data.page, limit: 10 }
    bm.requsetData('/w/resume/simdrop_list', 'get', data, function (data) {
      wx.hideToast()
      if (data.data.errcode == 0) {
        var a = that.data.list;
        for (var i in data.data.list) {
          a.push(data.data.list[i])
        }
          that.setData({
            list: a,
            hiddens: false
          });
        if (that.data.page > 1) {
          if (data.data.list.length == 0) {
            wx.showToast({
              title: '没有更多数据',
              icon: 'none',
              duration: 1000
            })
          }
        } else {
          if (data.data.list.length == 0) {
            that.setData({
              hiddens: true
            })
          }
        }
        that.setData({
          page: ++that.data.page
        })

      } else {
        wx.showToast({
          title: data.data.errmsg,
          icon: 'none'
        })
      }
    })

  },

})