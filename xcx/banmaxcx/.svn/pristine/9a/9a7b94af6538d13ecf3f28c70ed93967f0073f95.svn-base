// message/bmDialog.js
const bm = require('../utils/common.js')
const Page = require('../utils/ald-stat.js').Page;
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    empty:false,
    page:1,
    allpage:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var page = that.data.page
    var list = that.data.list
    wx.showLoading({
      title: '加载中',
    })
    bm.requsetData('/c/action/getNoticeList?page='+page+'&limit=10', 'get','', function (data) {
      if(data.data.errcode == 0){
        wx.hideLoading()
        if (data.data.list.length == 0){
          that.setData({
            empty: true,
          })
        }else{
          var arr=list.concat(data.data.list)
          var alllist = data.data.list
          for (var i in alllist) {
            alllist[i].ctime = that.getdate(alllist[i].ctime)
          }
          that.setData({
            list: arr,
            empty: false,
            allpage: data.data.pages.allpage
          })
        }
        
      }else{
        wx.showToast({
          title: data.data.errmsg,
          icon:'none'
        })
      }
    })
  },
  getdate: function (timestamp) {
    var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    return Y + M + D + h + m;
  },
  bindurl:function(e){
    var jump = e.currentTarget.dataset.jump
    if (jump == 1) {
      var id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: '/guide/activity?id=' + id,
      })
    }
    if (jump == 2) {
      var url = e.currentTarget.dataset.url;
      var have = url.search('navurl');
      if (have != -1) {
        wx.switchTab({
          url: url,
        })
      } else {
        wx.navigateTo({
          url: url,
        })
      }
    }
  },
  more:function(){
    var that = this
    var page = that.data.page
    var allpage = that.data.allpage
    if(page < allpage){
      page++
      that.setData({
        page:page
      })
      that.onLoad()
    }else{
      wx.showToast({
        title: '没有更多数据了',
        icon:'none'
      })
    }
  },
  onUnload:function(){
    var pages = getCurrentPages(); // 当前页面
    var beforePage = pages[pages.length - 2]; // 前一个页面
    beforePage.onLoad(); 
  }
})