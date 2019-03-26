// pages/business/position/jobDemand.js
const bm = require('../../utils/common.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    pages: 1,
    dpages: 1,
    allpage: 1,
    dallpage: 1,
    list: [],
    dlist: [],
    ts_01: 1,
    ts_02: 1,
  },
  /**选项切换 */
  bindqh: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },
  urlClick:function(e){
    console.log("aaaa",e)
    var id = e.currentTarget.dataset.id
    var type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: '/business/position/linkup?id='+id+'&flag=1&type='+type,
    })
  },
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
        pages: 1,
        dpages: 1,
        list: [],
        dlist: [],
      })
    }
    that.getListData();

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log()
    this.getListData();
  },
  //获取数据
  getListData: function () {
    var that = this;
    var currentTab = that.data.currentTab
    wx.showLoading({
      title: '数据加载中',
    })
    if (currentTab == 0) {
      var query = {}
      bm.requsetData('/b/seller/resume_list?type=1', 'get', query, function (res) {
        console.log(res)
        if (!res.data.errcode) {
          that.setData({
            list: that.data.list.concat(res.data.list),
            // allpage: res.data.pages.allpage
          })
          // if (res.data.list.length == 0) {
          //   that.setData({
          //     ts_01: 0
          //   })
          // }
          wx.hideLoading();
        } else {
          wx.showToast({
            title: res.data.errmsg,
            icon: 'none'
          })
        }
      })
    } else {
      var query = { }
      bm.requsetData('/b/seller/resume_list?type=2', 'get', query, function (res) {
        if (!res.data.errcode) {
          that.setData({
            dlist: that.data.dlist.concat(res.data.list),
            // dallpage: res.data.pages.allpage
          })
          if (that.data.dlist.length == 0) {
            that.setData({ ts_02: 0 })
          }
          wx.hideLoading();
        } else {
          wx.showToast({
            title: res.data.errmsg,
            icon: 'none'
          })
        }
      })
    }


  },
  //获取更多
  getMoreData: function () {
    var that = this;
    var currentTab = that.data.currentTab
    if (currentTab == 0) {
      var allpage = that.data.allpage;
      that.setData({ peges: that.data.pages++ })
      var peges = that.data.peges
      that.getListData();
      if (peges = allpage) {
        wx.showToast({
          title: '已没有更多职位',
          icon: 'none',
          duration: 1000
        })
      }
    } else {
      var dallpage = that.data.dallpage;
      that.setData({ dpeges: that.data.dpages++ })
      var dpeges = that.data.dpeges
      that.getListData();
      if (dpeges > dallpage) {
        wx.showToast({
          title: '已没有更多需求',
          icon: 'none',
          duration: 1000
        })
      }
    }
  },
  //发布
  sendPosition: function () {
    wx.reLaunch({
      url: '/pages/business/list'
    })
  },
  sendDemand: function () {
    wx.reLaunch({
      url: '/pages/business/list'
    })
  },
})