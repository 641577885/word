// pages/fill/inputFill.js
const bm = require('../../utils/common.js')
const Page = require('../../utils/ald-stat.js').Page;
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: 100,
    numPrint: 0,
    dataName: '',
    content: '',
    placeholder: '',
    empty: false
  },
  checkFill: function () {
    var that = this;
    var price = that.data.content
    if(price == 0){
      wx.showToast({
        title: '期望薪资不得为0',
        icon:'none'
      })
      return false
    }
    if (price.length == 0 ) {
      wx.showToast({
        title: '期望薪资不得为空',
        icon: 'none'
      })
      return false
    }
    bm.requsetData('/w/resume/job/intention?scene=edit', 'post', {price:price}, function (res) {
      console.log(res)
      if(res.data.errcode == 0){
        wx.showToast({
          title: res.data.errmsg,
        })
        setTimeout(function(){
          wx.navigateBack({
            
          })
        },1500)
      }else{
        wx.showToast({
          title: res.data.msg,
        })
      }
    })
  },
  fillTxt: function (e) {
    var strnum = e.detail.cursor;
    var value = e.detail.value;
    this.setData({ numPrint: strnum, content: value })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    if (options.empty) {
      that.setData({
        empty: true
      })
    }
   
    that.setData({
      num: options.num,
      dataName: options.dataName,
      content: options.content,
      placeholder: options.placeholder,
      numPrint: options.content.length
    })
  }
})