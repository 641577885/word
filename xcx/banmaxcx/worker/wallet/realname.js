const bm = require('../../utils/common.js')
const Page = require('../../utils/ald-stat.js').Page;
Page({

  /**
   * 页面的初始数据
   */
  data: {
     name:'',
     bankcard:'',
     lxtel:''
  },

  inputname:function(e){
     this.setData({name:e.detail.value})
  },
  inputcard: function (e) {
    this.setData({ bankcard: e.detail.value })

  },
  inputphone: function (e) {
    this.setData({ lxtel: e.detail.value })
  },
  //下一步
  nextbtn:function(){
    var that=this;
    if (!that.data.name) {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none'
      })
      return false;
    }
    if (!that.data.bankcard) {
      wx.showToast({
        title: '请输入银行卡号',
        icon: 'none'
      })
      return false;
    }
    if (!bm.regEx(that.data.bankcard, "bankcard")) {
      wx.showToast({
        title: '请输入正确的银行卡号',
        icon: 'none'
      })
      return false;
    }
    if (!that.data.lxtel) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
      return false;
    }

    if (!bm.regEx(that.data.lxtel, "cell")) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
      return false;
    }
  
   
    bm.requsetData("", "post", { name: that.data.name, bankcard: that.data.bankcard, lxtel: that.data.lxtel }, function (data) {
      if (data) {
        wx: wx.redirectTo({
          url: 'checkId?lxtel=' + that.data.lxtel,
        })
      } else {
       
      }
    })
  
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
})