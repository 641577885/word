// pages/openvip/openvip.js
var app = getApp();
var util = require('../../utils/util.js'); 
const bm = require('../../utils/common.js')
const Page = require('../../utils/ald-stat.js').Page;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid:null,
    //已经开通天数
    opennum:'',
    //会员选择
    vip_type:1,
    //当前时间
    date:null,
    year:null,
    month:null,
    day:null,
    //会员起始时间
    startime:null,
    //会员结束时间
    endtime:null,
    //总金额
    allprice:0,
    //vip卡样式
    vipcard_style:'vipcard_style_01',
    vip_icon:'openvip_icon',
    font_style:'#a08661',
    //红包抵扣选项
    hb:0,
    //红包数
    usera:0,
    //年价格
    year_price:0,
    //月价格
    month_price:0,
    //折扣
    zhe:0,
    //年费未打折总金额
    nozhe:0,
    //红包抵扣比例
    pro:0,
    yprice:0,
    ordersn:0,
    //优惠id
    yhid:1,
    //月优惠id
    myhid:0,
    height:0,
    //原价划去线
    hqx:'hqx',
    //一元包月优惠方式显示
    canYiYuan:0
  },
  //抵扣计算
  dk:function(){
    var that = this
    var usera = that.data.usera
    var pro = that.data.pro

  },
  //优惠
  yh_click:function(e){
    var that = this
    var yhid = e.currentTarget.dataset.yhid
    var usera = that.data.usera
    that.setData({
      yhid: yhid
    })
    if (yhid==1){
      that.setData({
        allprice:3600,
        hqx:'hqx'
      })
    }
    if(yhid==2){
      that.setData({
        allprice: 4788 - usera,
        hqx: ''
      })
    }
  },
  //月优惠
  m_yh_click:function(e){
    var that = this
    var myhid = e.currentTarget.dataset.myhid
    var usera = that.data.usera
    if (myhid==0){
      that.setData({
        myhid:1,
        allprice: 399 - that.data.usera
      })
    }else{
      that.setData({
        myhid: 0,
        allprice: 399
      })
    }
  },
  getVipInfo:function(){
    var that = this;
    var overDate, opennum;
    var vip_type = that.data.vip_type
    bm.requsetData('/w/vip/openpage', 'get', '', function (res) {
      wx.hideLoading()
      
      var _res = res.data;
      if (_res.userInfo.ismember == 0){
        overDate = bm.formatToday();
        opennum = '未开通会员';
      } else {
        overDate = bm.formatDate(_res.userInfo.motime);
        opennum = '会员到期时间：' + overDate;
      }
      var Ymydate = bm.GetNextMonthDay(overDate, 12)
      var Mmydate = bm.GetNextMonthDay(overDate, 1)
      var zhe = _res.priceArr.year / (_res.priceArr.month * 12);
      if (_res.order.ordersn) {
        var order = _res.order.ordersn
      }else{
        var order=0
      }
     //红包抵扣
      if (vip_type==1){
        if (_res.canYiYuan == 1){
          var month_price = 1
        }else{
          var month_price = _res.priceArr.month
        }
        
        if (_res.accInfo.usera>=4788){
          var usera = 4788
        }else{
          var usera = _res.accInfo.usera
        }
        var allprice = _res.priceArr.year
        var yprice = _res.priceArr.year
      }
      if (vip_type == 3) {
        if (_res.canYiYuan == 1) {
          var month_price = 1
          that.setData({
            canYiYuan: 1
          })
          var allprice = 1
          var usera = 0
          var yprice = 1
        } else {
          var month_price = _res.priceArr.month
          that.setData({
            canYiYuan: 0
          })
          if (_res.accInfo.usera >= 399) {
            var usera = 399
          } else {
            var usera = _res.accInfo.usera
          }
          var allprice = _res.priceArr.month
          var yprice = _res.priceArr.year
        }
        
      }
      
      that.setData({
        usera: usera,
        uid:_res.userInfo.uid,
        year_price: _res.priceArr.year,
        month_price: month_price,
        zhe: (zhe * 10).toFixed(1),
        nozhe: _res.priceArr.month*12,
        pro: _res.jf_deduction_ratio.vip/100,
        allprice: allprice,
        yprice: yprice,
        viptime: overDate,
        opennum: opennum,
        ordersn: order,
        Ymydate: Ymydate,
        Mmydate: Mmydate
      })
      that.countTime()
    })
  },

  countTime:function(){
    var that =this;
    if (that.data.vip_type == 1) {
      that.setData({ endtime: that.data.Ymydate })
    } 
    if (this.data.vip_type == 3) {
      that.setData({ endtime: that.data.Mmydate })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  // onShow:function(){
  //   var that = this
  //   if (app.globalData.auth) {
  //     that.getVipInfo();
  //   } else {
  //     app.authCallback = auth => {
  //       that.getVipInfo();
  //     }
  //   }
  // },
  onLoad: function (options) {
    var that = this;
    var vip_type = options.vip_type
    if (vip_type){
      that.setData({
        vip_type: vip_type
      })
      if (vip_type == 3){
        that.setData({
          vipcard_style: 'vipcard_style_02',
          vip_icon: 'openvip_icon_02',
          font_style: '#838997',
        })
      }
    }
   
    wx.showLoading({
      title: '载入中',
    })
    if (app.globalData.auth) {
      that.getVipInfo();
    }else{
      app.authCallback = auth => {
        that.getVipInfo();
      }
    }
  },
  //会员选择
  bindradio:function(e){
    var that = this
    var curr = e.currentTarget.dataset.id
    var year = parseInt(that.data.year)
    var month = parseInt(that.data.month)
    var day = parseInt(that.data.day)
    var timestamp = that.data.date//当前时间戳
    var myDate = new Date(that.data.date)
    var usera = that.data.usera
    var pro = that.data.pro
    var canYiYuan = that.data.canYiYuan
    that.setData({
      vip_type:curr
    })
    that.getVipInfo();
    if(curr == 1){
      var bnyear = year + 1
      var bntime = bnyear + '-' + month + '-' + day
      var bntimec = Date.parse(bntime) - 86400
      var bndate = new Date(bntimec)
    
      that.setData({
        endtime: bndate.getFullYear() + '/' + (bndate.getMonth() + 1) + '/' + bndate.getDate(),
        allprice: that.data.year_price,
        vipcard_style: 'vipcard_style_01',
        vip_icon: 'openvip_icon',
        font_style: '#a08661',
        hb:0,
        yprice: that.data.year_price,
        yhid:1
      })
    }else if(curr == 3){ 
      var bntime = year + '-' + (month+1) + '-' + day
      var bntimec = Date.parse(bntime) - 86400
      var bndate = new Date(bntimec)
      if (canYiYuan == 0){
        that.setData({
          endtime: bndate.getFullYear() + '/' + (bndate.getMonth() + 1) + '/' + bndate.getDate(),
          allprice: that.data.month_price,
          vipcard_style: 'vipcard_style_02',
          vip_icon: 'openvip_icon_02',
          font_style: '#838997',
          hb:0,
          yprice: that.data.month_price,
          myhid:0
        })
      }else{
        that.setData({
          endtime: bndate.getFullYear() + '/' + (bndate.getMonth() + 1) + '/' + bndate.getDate(),
          allprice: 1,
          vipcard_style: 'vipcard_style_02',
          vip_icon: 'openvip_icon_02',
          font_style: '#838997',
          hb: 0,
          yprice: 1,
          myhid: 0
        })
      }
    }

    that.countTime(that.data.viptime)
  },
  //提交
  submit:function(){
    var that = this
    //红包
    var usera = that.data.usera
    //年费月费类型
    var vip_type = that.data.vip_type

    if (vip_type == 1){
      //年费
      var yhid = that.data.yhid
      var month = 12
      if(yhid==1){
        var integral = 0
        var promo_code = 'nianfei'
      }
      if(yhid == 2){
        var integral = usera
        var promo_code = ''
      }
    } else if (vip_type == 3){
      //月费
      var myhid = that.data.myhid
      var month = 1
      var canYiYuan = that.data.canYiYuan
      if (canYiYuan == 0){
        if (myhid == 0) {
          var integral = 0
          var promo_code = ''
        }
        if (myhid == 1) {
          var integral = usera
          var promo_code = ''
        }
      }else{
        var integral = 0
        var promo_code = 'yiyuangou'
      }
      
    }
    
    console.log(month,integral, promo_code,)
    bm.requsetData('/w/vip/open', 'post', { month: month, integral: integral, promo_code: promo_code }, function (data) {
      if (data.data.direct_return == 1){
        wx.showToast({
          title: data.data.errmsg,
        })
        setTimeout(function(){
          wx.navigateBack({
            delta: 1,
          })
        },1500)
      }else{
        if (data.data.errcode == 0){
          that.setData({
            ordersn: data.data.ordersn
          })
          wx.navigateTo({
            url: '/pages/pay/pay?ordersn=' + that.data.ordersn+'&type=vip'
          })  
        }else{
          bm.requsetData('/w/vip/cancel_order', 'post', { ordersn: that.data.ordersn }, function (tvip) {
                if (tvip.data.errcode == 0) {
                  that.submit()
                } else {
                  wx.showToast({
                    title: tvip.data.errmsg,
                    icon: 'none'
                  })
                }

              })
        // wx.showModal({
        //   title: '提示',
        //   content: data.data.errmsg,
        //   showCancel: true,
        //   confirmText:'付新订单',
        //   cancelText:'付上一笔',
        //   success: function(res) {
        //     if(res.confirm){
        //       bm.requsetData('/w/vip/cancel_order', 'post', { ordersn: that.data.ordersn }, function (tvip) {
        //         if (tvip.data.errcode == 0) {
        //           that.submit()
        //         } else {
        //           wx.showToast({
        //             title: tvip.data.errmsg,
        //             icon: 'none'
        //           })
        //         }

        //       })
        //     }
        //     if(res.cancel){
        //       wx.navigateTo({
        //         url: '/pages/pay/pay?ordersn=' + that.data.ordersn + '&type=vip'
        //       }) 
              
        //     }
        //   },
        //   fail: function(res) {},
        //   complete: function(res) {},
        // })
        }
      }
    })
  },
  /*会员中心*/
  vip_more:function(){
    wx.navigateTo({
      url: '/pages/openvip/vipExplain',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  }
})