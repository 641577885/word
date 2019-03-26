// pages/member/bindPhone.js
const bm=require('../utils/common.js')
const Page = require('../utils/ald-stat.js').Page;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lxtel:Number,
    lxtelflag:true
  },
  //输入框输入
  bindKeyInputTel: function (e) {
    this.setData({
      lxtel: e.detail.value
    })
  },
  //手机号码验证
  checkCell:function(){
    var lxtel = this.data.lxtel;
    if (!bm.regEx(lxtel,'cell')){
      wx.showToast({
        title: '请输入正确的手机号码',
        icon:'none'
      })
      return false;
    }
  },
  //手机号码提交
  sendCell:function(){
    var that=this;
    if (!that.data.lxtelflag){
      that.setData({
        lxtelflag: false
      })
      return false;
    }
    if (!that.data.lxtel){
      wx.showToast({
        title: '请输入手机号码',
        icon:"none"
      })
      return false;
    }
    var app=getApp();
    app.lxtelDetailid = that.data.lxtel;
    if (!bm.regEx(that.data.lxtel,"cell")){
      wx.showToast({
        title: '请输入正确的手机号码',
        icon: "none"
      })
      return false;
    }
    //请求发送
    bm.requsetData("/c/login/send_code", "post", { lxtel: that.data.lxtel, scene: 'register', role: 2},function(res){
      if (!res.data.errcode || res.data.errcode==30202){
        wx.redirectTo({
          url: 'fillCode',
        })
      }else{
        wx.showToast({
          title: res.data.errmsg,
          icon: "none"
        })
      }
      that.setData({
        lxtelflag: true
      })
    },true)
  },
  agreement: function () {
    wx.navigateTo({
      url: '/help/agreement',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
})