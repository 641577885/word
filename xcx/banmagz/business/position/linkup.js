// pages/business/position/linkup.js
const bm = require('../../utils/common.js')
const Page = require('../../utils/ald-stat.js').Page;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    hiddentext:true,
    page:1,
    hiddens:false
  },
  //点击跳转到个人简历页面
  resumeClick:function(e){
    console.log(e)
    var id = e.currentTarget.dataset.uid
    wx.navigateTo({
      url: '/resume/resume?uid=' + id+'&flag==1',
    })
  },
  bottom:function(e){
    this.getList();
  },
  sendDemand: function () {
    wx.reLaunch({
      url: '/pages/business/list'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */

    getList:function(){
      var that = this
      this.setData({
        flag: 1
      })
      var data = { page: this.data.page, limit: 10 }
      bm.requsetData('/b/seller/simresume_list', 'get', data, function (data) {
        if (data.data.errcode == 0) {
          wx.hideToast()
          console.log(data.data)
          var a = that.data.list;
          for (var i in data.data.list) {
            a.push(data.data.list[i])
          }
          console.log("aaa",that.data)
          that.setData({
            list: a,
            hiddens: false
          });
          if (that.data.page>1){
            if (data.data.list.length == 0) {
              wx.showToast({
                title: '没有更多数据',
                icon: 'none',
                duration: 1000
              })
            }
          }else{
            if (data.data.list.length == 0) {
              that.setData({
                hiddens:true
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
        console.log(data)
      })

    },
  title: function () {
    wx.setNavigationBarTitle({
      title: '收到的简历'
    })
  },
  notitle: function () {
    wx.setNavigationBarTitle({
      title: ''
    })
  },
  onLoad: function (options) {
    var that = this
    var id = options.id
    var type = options.type
    if(options.flag ==1){
      this.getList()
      //改变title
      that.title()
    }else {
      that.notitle()
      bm.requsetData('/b/seller/chatLogDetail?id=' + id, 'get', '', function (data) {
        if (data.data.errcode == 0) {
          that.setData({
            list: data.data.list,
          })
        } else {
          wx.showToast({
            title: data.data.errmsg,
            icon: 'none'
          })
        }
        console.log(data)
      })
    }

  },
})