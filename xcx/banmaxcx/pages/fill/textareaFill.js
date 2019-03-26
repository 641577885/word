// pages/fill/textareaFill.js
const Page = require('../../utils/ald-stat.js').Page;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: 100,
    numPrint: 0,
    dataName: '',
    content: '',
    placeholder: ''

  },
  checkFill: function () {
    var that = this;
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    var name = that.data.dataName;
    prevPage.setData({
      [name]: that.data.content
    })
    wx.navigateBack()
  },
  fillTxt: function (e) {
    var value = e.detail.value;
    var strnum = value.length;
    this.setData({ numPrint: strnum, content: value })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.bartitle) {
      wx.setNavigationBarTitle({
        title: options.bartitle
      })
    } else {
      wx.setNavigationBarTitle({
        title: '班马佳薪',
      })
    }
    this.setData({
      num: options.num,
      dataName: options.dataName,
      content: options.content,
      placeholder: options.placeholder,
      numPrint: options.content.length
    })
  }
})