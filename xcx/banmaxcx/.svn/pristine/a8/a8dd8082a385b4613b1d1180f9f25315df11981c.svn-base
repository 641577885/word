// pages/setting/secretSetting.js
var app = getApp();
var bm = require('../utils/common.js')
const Page = require('../utils/ald-stat.js').Page;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_show:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.showResume();
  },
  showResume:function(){
    var that=this;
    bm.requsetData("/w/resume/detail", "get", { scene:"is_show"},function(res){
      if(!res.data.errcode){
        res.data.is_show = res.data.is_show==1?false:true;
        that.setData({ is_show: res.data.is_show})
      }else{
        wx.showToast({
          title: res.data.errmsg,
          icon:"none"
        })
      }
    })
  },

  closeresume:function(e){
    var close = e.detail.value
    close = close==true?0:1
    bm.requsetData('/w/resume/show', 'post', { is_show: close }, function (data) {
      if(data.data.errcode !=0){
        wx.showToast({
          title: data.data.msg,
          icon:'none'
        })
      }
    })
  }
})