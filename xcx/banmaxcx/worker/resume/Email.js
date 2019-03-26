// pages/worker/resume/Email.js
// 请求公用方法文件
const bm = require('../../utils/common.js')
const Page = require('../../utils/ald-stat.js').Page;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
   
  },
  getData:function(e){
    var mail = e.detail.value.mail
    var reg = new RegExp(/^([a-zA-Z0-9]+[_|\_|\.|\-]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/)
    if(mail.length == 0){
      wx.showToast({
        title: '请输入邮箱地址',
        icon:'none'
      })
      return false
    }
    if (!reg.test(mail)){
      wx.showToast({
        title: '邮箱格式不正确',
        icon: 'none'
      })
      return false
    }
    wx.showLoading({
      title: '发送中'
    })
    bm.requsetData('/w/resume/send_email', 'post', { email: mail }, function (data) {
      wx.hideLoading()
      if(data.data.errcode == 0){
        wx.showToast({
          title: data.data.errmsg,
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
  }
})