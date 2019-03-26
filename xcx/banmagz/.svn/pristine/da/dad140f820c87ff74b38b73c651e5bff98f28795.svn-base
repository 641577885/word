// setting/sayInput.js
const bm = require('../utils/common.js')
const Page = require('../utils/ald-stat.js').Page;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    numPrint: 0,
    content:'',
    checkFill:'',
    //主键
    id:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var type = options.type
    if(type == 1){
      that.setData({
        checkFill:'addFill'
      })
    }
    if (type == 3) {
      that.setData({
        checkFill: 'editFill',
        id: options.id,
        content: decodeURI(options.content),
        numPrint: decodeURI(options.content).length
      })
    }
  },
  fillTxt: function (e) {
    var strnum = e.detail.value.length;
    var value = e.detail.value;
    this.setData({ numPrint: strnum, content: value })
  },
  addFill:function(e){
    var that = this
    var content = that.data.content
    if (content.length == 0){
      wx.showToast({
        title: '请输入内容',
        icon:'none'
      })
      return false;
    }
    bm.requsetData('/c/action/opNotice?scence=1&id=0', 'post', { notice: content }, function (data) {
      console.log(data)
      if (data.data.errcode == 0){
        wx.showToast({
          title: data.data.errmsg
        })
        setTimeout(function(){
          wx.navigateBack({
            delta: 1,
          })
        },1500)
      }else{
        wx.showToast({
          title: data.data.errmsg,
          icon:'none'
        })
      }
    })
  },
  editFill:function(){
    var that = this
    var id = that.data.id
    var content = that.data.content
    if (content.length == 0) {
      wx.showToast({
        title: '请输入内容',
        icon: 'none'
      })
      return false;
    }
    bm.requsetData('/c/action/opNotice?scence=3&id=' + id, 'post', { notice: content }, function (data) {
      if (data.data.errcode == 0) {
        wx.showToast({
          title: data.data.errmsg
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 1,
          })
        }, 1500)
      } else {
        wx.showToast({
          title: data.data.errmsg,
          icon: 'none'
        })
      }
    })
  }
})