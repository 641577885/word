// wallet/task.js
const bm = require('../utils/common.js')
const Page = require('../utils/ald-stat.js').Page;
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    lists: [],
    hidden: true,
    showmon: true,
    showget: false,
    idx: '',
    id: '',
    count: '',
    bon: '',
    usera_rest:''


  },
  getFormId: function (e) {
    var formid = e.detail.formId;
    app.addformId(formid)
  },
  getmoney: function (e) {
    var that = this
    var _idx = e.target.dataset.index;
    var _id = e.target.dataset.key;
    var _bon = e.target.dataset.id;
    var _count = that.data.lists[_idx].count;
    that.setData({
      hidden: false,
      idx: _idx,
      id: _id,
      count: _count,
      bon: _bon
    })
  },

  getmon: function (e) {
    var that = this
    bm.requsetData('/c/action/receiveTask', 'post', {
      id: that.data.id
    }, function (res) {
      if (!res.data.errcode) {
        // wx.showModal({
        // title: "领取成功",
        // success: function() {
        setTimeout(function () {
          that.data.lists[that.data.idx].count--;
          that.setData({
            lists: that.data.lists
          })
        }, 1000)
        that.setData({
          showmon: !that.data.showmon,
          showget: !that.data.showget
        })
        setTimeout(function () {
          that.setData({
            hidden: true,
            showmon: !that.data.showmon,
            showget: !that.data.showget
          })
        }, 3000)
        setTimeout(function () {
          wx.showToast({
            title: '领取成功' + that.data.bon + '元',
            icon: 'none',
            duration: 1000
          })
        }, 2000)
      } else {
        wx.showToast({
          title: res.data.errmsg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    bm.requsetData('/c/action/getUseTaskId', 'get', {}, function (data) {
      console.log(data)
      if (data.data.errcode != 0) {
        wx.showToast({
          mask: true,
          title: data.data.errmsg,
          icon: 'none',
          duration: 2000
        })
      } else {
        for (var i in data.data.list) {
          var _item = data.data.list[i];
          if (_item.cycle == 2) {
            _item.cycle = "月"
          }
          if (_item.cycle == 3) {
            _item.cycle = "天"
          }
          if (_item.cycle == 1) {
            _item.cycle = "人"
          }
          if (_item.cycle_time == 1) {
            _item.cycle_time = "每"
          }
        }

        that.setData({
          lists: data.data.list,
          usera_rest: data.data.usera_rest
        })
        console.log('666', that.data.lists)
      }
    })


  },
  invite: function () {
    // wx.redirectTo({
    //   url: 'invited',
    // })
    wx.navigateTo({
      url: 'invited',
    })
  },
  // inviteck:function(){
  //   wx.navigateTo({
  //     url: '../pages/wallet/shareck',
  //   })
  // },
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
  onShareAppMessage: function (res) {
    console.log(res)
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
     return{
       title:'转发',
       path: 'pages/login/loading',
       imageUrl:' https://bm.jiangcdn.com/banma/share/sharef.png',
       success:function(e){
         console.log(11111)
         wx.showShareMenu({
           withShareTicketa:true
         })
       }, 
       fail(e){

       },
       complete(){}
     }
  },
})