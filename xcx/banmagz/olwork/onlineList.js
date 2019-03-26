const bm = require('../utils/common.js')
const Page = require('../utils/ald-stat.js').Page;
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    lists:[],
    showBox:false
    
  },
  linkToUrl: function (e) {
    var _index = e.currentTarget.dataset.index;
    var _pid = this.data.lists[_index].pro.id;
    var _state = this.data.lists[_index].pro.state;
    if (_state=="nopay"){
      wx.navigateTo({
        url: '/order/replacepay?ordersn=' + this.data.lists[_index].pro.ordersn,
      })    
    }else{
      wx.navigateTo({
        url: '/olwork/posDetail?id='+_pid,
      })
    }
  },
  getSellList: function () {
    //wx.showLoading({ title: '加载中' })
    var that=this;
    var array = that.data.lists;
    bm.requsetData('/b/project/mylist', 'get', {page:that.data.page,limit:10}, function (res) {
      if (!res.data.errcode) {
        if (res.data.list.length != 0) {
          for (var i in res.data.list){
            var dataArray=res.data.list[i];
            dataArray.pro.begintime = bm.formatDate(dataArray.pro.begintime);
            dataArray.pro.endtime = bm.formatDate(dataArray.pro.endtime);
            array.push(dataArray)
          }
          that.data.page++;
          that.setData({ lists: array, page: that.data.page })
          wx.hideLoading();
          that.setData({ showBox: true })
        }else{
          if (that.data.page > 1) {
            wx.showToast({
              title: '没有更多数据',
              icon: 'none'
            })
          }
          wx.hideLoading();
          that.setData({ showBox: true })
        }
      }
    })
  },
  //跳转至列表
  link2List:function(e){
    var formid = e.detail.formId;
    app.addformId(formid);
    wx.switchTab({
      url: '/pages/business/list',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.removeStorageSync("gyrefresh");
    that.setData({page: 1, lists:[],showBox:false});
    that.getSellList();
    
  },
  onShow:function(){
    var isRefresh = wx.getStorageSync("gyrefresh");
    if (isRefresh) {
      wx.removeStorageSync("gyrefresh");
      this.onLoad();
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    that.getSellList();
  }
})