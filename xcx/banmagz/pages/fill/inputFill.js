// pages/fill/inputFill.js
const Page = require('../../utils/ald-stat.js').Page;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num:100,
    numPrint:0,
    dataName:'',
    content:'',
    placeholder:'',
    empty:false
  },
  checkFill: function () {
    var that=this;
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    var name = that.data.dataName;
    prevPage.setData({
      [name]: that.data.content
    })
    var empty = that.data.empty
    if (empty && that.data.content.length == 0){
      wx.showToast({
        title: '请输入内容',
        icon:'none'
      })
    }else{
      wx.navigateBack()
    }
    
  },
  fillTxt:function(e){
    var value = e.detail.value;
    var strnum = value.length;
    this.setData({ numPrint: strnum, content: value})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    if(options.empty){
      that.setData({
        empty:true
      })
    }
    that.setData({
     num:options.num,
     dataName: options.dataName,
     content:options.content,
     placeholder: options.placeholder,
     numPrint: options.content.length
   })
  }
})