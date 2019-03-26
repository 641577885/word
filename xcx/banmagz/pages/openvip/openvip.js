// pages/openvip/openvip.js
var util = require('../../utils/util.js'); 
const Page = require('../../utils/ald-stat.js').Page;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //已经开通天数
    opennum:10,
    //会员选择
    vip_type:1,
    //当前时间
    year:null,
    month:null,
    day:null,
    //会员起始时间
    startime:null,
    //会员结束时间
    endtime:null,
    //总金额
    allprice:3600,
    //vip卡样式
    vipcard_style:'vipcard_style_01',
    vip_icon:'openvip_icon',
    font_style:'#a08661'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var myDate = new Date();//获取系统当前时间
    console.log(myDate)
    var timestamp = Date.parse(myDate)//当前时间戳
    var year = myDate.getFullYear()//获取完整的年份
    var month = myDate.getMonth()+1//获取当前月份
    var day = myDate.getDate()//获取当前日

    var bnyear = year + 1
    var bntime = bnyear + '-' + month + '-' + day
    var bntimec=Date.parse(bntime) - 86400
    var bndate = new Date(bntimec)
    that.setData({
      year: year,
      month: month,
      day: day,
      startime: year + '/' + month + '/' + day,
      endtime: bndate.getFullYear() + '/' + (bndate.getMonth()+1) + '/' + bndate.getDate()
    })
    
  },
  //会员选择
  bindradio:function(e){
    var that = this
    var curr = e.currentTarget.dataset.id
    var year = parseInt(that.data.year)
    var month = parseInt(that.data.month)
    var day = parseInt(that.data.day)
    var myDate = new Date();//获取系统当前时间
    var timestamp = Date.parse(myDate)//当前时间戳
    that.setData({
      vip_type:curr
    })
    if(curr == 1){
      var bnyear = year + 1
      var bntime = bnyear + '-' + month + '-' + day
      var bntimec = Date.parse(bntime) - 86400
      var bndate = new Date(bntimec)
      that.setData({
        endtime: bndate.getFullYear() + '/' + (bndate.getMonth() + 1) + '/' + bndate.getDate(),
        allprice:3600,
        vipcard_style: 'vipcard_style_01',
        vip_icon: 'openvip_icon',
        font_style: '#a08661'
      })
    }else if(curr == 3){ 
      var bntime = year + '-' + (month+1) + '-' + day
      var bntimec = Date.parse(bntime) - 86400
      var bndate = new Date(bntimec)
      that.setData({
        endtime: bndate.getFullYear() + '/' + (bndate.getMonth() + 1) + '/' + bndate.getDate(),
        allprice: 350,
        vipcard_style: 'vipcard_style_02',
        vip_icon: 'openvip_icon_02',
        font_style: '#838997'
      })
    }
  },
  //提交
  submit:function(){
    var that = this
    var vip_type = that.data.vip_type
    var allprice = that.data.allprice
    var startime = that.data.startime
    var endtime = that.data.endtime
    console.log(vip_type, allprice, startime, endtime)
    wx.navigateTo({
      url: '/pages/pay/pay',
      success: function(res) {},
    })
  }
})