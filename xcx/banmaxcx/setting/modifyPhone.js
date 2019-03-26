// setting/modifyPhone.js
var app = getApp();
var bm = require('../utils/common.js')
const Page = require('../utils/ald-stat.js').Page;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lxtel:'',
    vcode:'',
    bind:'lxtel',
    codeshow:true,
    time:60
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  lxtel:function(e){
    var that = this
    var lxtel = e.detail.value.newlxtel
    that.setData({
      lxtel:lxtel
    })
    if(lxtel.length == 0){
      wx.showToast({
        title: '请输入手机号',
        icon:'none'
      })
      return false
    }
    bm.requsetData('/c/login/send_code?scene=bindphone&lxtel=' + lxtel, 'get','', function (data) {
      console.log(data)
     if(data.data.errcode == 0){
        that.setData({
          bind:'',
          codeshow:false
        })
        that.again()
     }else{
       wx.showToast({
         title: data.data.errmsg,
         icon:'none'
       })
     }
    })
  },
  again:function(){
    var that = this
    var date = that.data.time
    if (date > 0 ){
      var djs=setInterval(function(){
        date -= 1
        console.log(date)
        that.setData({
          time: date
        })
        if(date<0){
          clearInterval(djs)
          that.setData({
            bind: 'lxtel',
            codeshow: true,
            time:60
          })
        }
      },1000)
    }
  },
  vcode:function(e){
    var that = this
    var vcode = e.detail.value.vcode
    var lxtel = that.data.lxtel
    console.log(lxtel)
    if (lxtel.length == 0) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
      return false
    }
    if (vcode.length == 0) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
      return false
    }
    bm.requsetData('/c/action/bindphone?lxtel=' + lxtel + '&vcode=' + vcode, 'get', '', function (data) {
      if(data.data.errcode == 0){
        wx.showToast({
          title: data.data.errmsg,
        })
        setTimeout(function(){
          wx.reLaunch({
            url: '/pages/worker/mycentre',
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