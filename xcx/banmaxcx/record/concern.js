// record/concern.js
var bm = require('../utils/common.js')
const Page = require('../utils/ald-stat.js').Page;
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 0,
    hiddenpart: true,
    lists: [],
    niurenlist:[],
    page: 1,
    limit: 10,
    letterList: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'W', 'X', 'Y', 'Z'],
    view:''
  },
  tab: function (event) {
    this.setData({ current: event.target.dataset.current })
    if (this.data.current==2){
      this.requestre()
    }
  },
  eventchange: function (event) {
    this.setData({ current: event.detail.current })
    if (this.data.current == 2) {
      this.requestre()
    }
  },
  alpabtn:function(event){
    this.setData({view:event.target.dataset.view})
  },
  requestre:function(){
    var that=this
    bm.requsetData('/w/company/visitlist', 'post', { limit: that.data.limit }, function (data) {
      console.log('ddd', data)
      if (data.data.errcode != 0) {
        wx.showToast({
          mask: true,
          title: data.data.errmsg,
          icon: 'none',
          duration: 2000
        })
      } else {

        that.setData({
          lists: data.data.list
        })
      }

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    bm.requsetData('/w/resume/drop_list', 'post', { page: that.data.page, limit: that.data.limit }, function (data) {
      that.setData({
        lists: data.data.list
      })
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})