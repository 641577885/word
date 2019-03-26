// auth/authinfo.js
var app = getApp();
var bm = require('../utils/common.js')
const Page = require('../utils/ald-stat.js').Page;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sexid:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  bindsex:function(e){
    var that = this
    var sex = e.target.dataset.sexid
    that.setData({
      sexid:sex
    })
  },
  formSubmit:function(e){
    var that = this
    var name = e.detail.value.name
    var idcard = e.detail.value.idcard
    var sex = that.data.sexid
    var name_reg = /^[\u4e00-\u9fa5]{2,10}$/
    var id_reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
    console.log(name, idcard, sex)
    if (name.length == 0) {
      wx.showToast({
        title: '请填写真实姓名',
        icon: 'none'
      })
      return false;
    }
    if (!name_reg.test(name)) {
      wx.showToast({
        title: '姓名格式错误',
        icon: 'none'
      })
      return false;
    }
    if (idcard.length == 0) {
      wx.showToast({
        title: '请填写身份证号',
        icon: 'none'
      })
      return false;
    }
    if (!id_reg.test(idcard)) {
      wx.showToast({
        title: '身份证号码格式错误',
        icon: 'none'
      })
      return false;
    }
    app.auth_name = name
    app.auth_idcard = idcard
    wx.redirectTo({
      url: '/auth/camera',
    })
  }
  
})