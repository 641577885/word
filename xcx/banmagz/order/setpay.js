// pages/pay/setpay.js
const bm = require('../utils/common.js');
const Page = require('../utils/ald-stat.js').Page;
var app=getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    role:2,
    uid:'',
    textarea_num:0,
    work_content:'',
    // tab切换 
    currentTab: 0,
    periodArray: ['1个月', '2个月', '3个月', '4个月', '5个月', '6个月', '7个月', '8个月', '9个月', '10个月', '11个月','12个月'],
    periodindex:0,
    byprice: '',
    dzprice: '',
    minDate:'',
    start_time:'',
    dzStime:'',
    dzEtime: '',
    month:1,
    showRed:false,
    bymaxcount: 0, //最大抵扣
    dzmaxcount: 0, //最大抵扣
    countMoney:Number, //红包值
    byServiceFee:0,
    dzServiceFee: 0,
    hideRed:false,
    allprice:0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({ uid: options.uid })
    if (app.globalData.auth) {
      that.getRzInfo();
    } else {
      app.authCallback = auth => {
        that.getRzInfo();
      }
    }
    
  },

  getRzInfo:function(){
    var that=this;
    bm.requsetData('/b/worker/rzpage', 'get', { uid: that.data.uid }, function (res) {
      if (!res.data.errcode) {
        that.setData({ countMoney: res.data.accInfo.usera, userInfo: res.data.userInfo, minDate: bm.formatToday(), start_time: bm.formatToday(), dzStime: bm.formatToday(), dzEtime: bm.formatToday(1) })
        if (res.data.orderInfo.total_amount){
          var currentTab = res.data.orderInfo.is_dz > 0 ? 1 : 0;
          var _price = Number(res.data.orderInfo.total_amount);
          var maxcount = (_price * 0.05).toFixed(2);
          if (maxcount >= Number(that.data.countMoney)) {
            maxcount = that.data.countMoney
          }
          if (currentTab==0){
            that.setData({ start_time: bm.formatDate(res.data.orderInfo.begintime), byprice: _price, byServiceFee: (_price * 0.05).toFixed(2), bymaxcount: maxcount})
          }
          if (currentTab == 1){
            that.setData({ dzprice: _price, dzStime: bm.formatDate(res.data.orderInfo.begintime), dzEtime: bm.formatDate(res.data.orderInfo.endtime), dzServiceFee: (_price * 0.05).toFixed(2), dzmaxcount: maxcount})
          }
          that.setData({ work_content: res.data.orderInfo.beizhu, currentTab: currentTab, textarea_num: res.data.orderInfo.beizhu.length, periodindex: (res.data.orderInfo.month)-1, month: res.data.orderInfo.month });
          that.countAllPrice();
        }
      } else {
        wx.showToast({
          title: res.data.errmsg,
          icon: 'none'
        })
      }
    })
  },
  /**textarea输入 */
  bindTextAreaChange:function(e){
    this.setData({ textarea_num: e.detail.value.length, work_content: e.detail.value})
  },
  choosePeriod:function(e){
    this.setData({ month: parseInt(e.detail.value)+1, periodindex: e.detail.value})
  },
  //选择日期
  chooseStart:function(e){
    this.setData({ start_time: e.detail.value });
  },
  chooseDzStart:function(e){
    this.setData({ dzStime: e.detail.value, dzEtime: e.detail.value });
  },
  chooseDzEnd: function (e) {
    this.setData({ dzEtime: e.detail.value });
  },
  checkboxChange:function(e){
    var that=this;
    if (e.detail.value.length!=0){
      that.setData({showRed:true})
    }else{
      that.setData({showRed:false})
    }
    that.countAllPrice();
  },
  //价格
  fillPrice:function(e){
    var that=this;
    var _type=e.target.dataset.type;
    var _price = e.detail.value;
    var maxcount = (_price * 0.05).toFixed(2);
    if (maxcount >= Number(that.data.countMoney)) {
      maxcount = that.data.countMoney
    }
    if (_type=='by'){
      that.setData({ byprice: _price, bymaxcount: maxcount, byServiceFee: (_price * 0.05).toFixed(2)})
    }else{
      that.setData({ dzprice: _price, dzmaxcount: maxcount, dzServiceFee: (_price * 0.05).toFixed(2)})
    }
    that.countAllPrice();
  },

  countAllPrice:function(){
    if (this.data.currentTab == 0){
      var byAllPrice = Number(this.data.byprice) + Number(this.data.byServiceFee); 
      if (this.data.showRed) {
        byAllPrice -= this.data.bymaxcount
      }
      this.setData({ allprice: byAllPrice })
    }else{
      var dzAllPrice = Number(this.data.dzprice) + Number(this.data.dzServiceFee);
      if (this.data.showRed) {
        dzAllPrice -= this.data.dzmaxcount
      }
      this.setData({ allprice: dzAllPrice })
    }
  },

  /**选项切换 */
  bindqh: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
    that.countAllPrice();
  },
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
      that.countAllPrice();
    }
  },
  setOrder:function(){
    var integral,that=this;
    if (!that.data.work_content) {
      wx.showToast({
        title: '请输入工作内容',
        icon: 'none'
      })
      return false;
    }
    if (that.data.currentTab == 0) {
      if (!that.data.byprice){
        wx.showToast({
          title: '请输入托管金额',
          icon:'none'
        })
        return false;
      }
      if (that.data.showRed){
        integral = that.data.bymaxcount;
      }else{
        integral = 0;
      }
      var query = { rtype: 1, uid: that.data.uid, allprice: that.data.byprice, begintime: that.data.start_time, month: that.data.month, beizhu: that.data.work_content, integral: integral}
    }else{
      if (!that.data.dzprice) {
        wx.showToast({
          title: '请输入托管金额',
          icon: 'none'
        })
        return false;
      }
      if (that.data.showRed) {
        integral = that.data.dzmaxcount;
      } else {
        integral = 0;
      }
      var query = { rtype: 2, uid: that.data.uid, allprice: that.data.dzprice, begintime: that.data.dzStime, endtime: that.data.dzEtime, beizhu: that.data.work_content, integral: integral}
    }
    bm.requsetData('/b/worker/rz', 'post', query,function(res){
      if(!res.data.errcode){
        wx.showToast({
          title: res.data.errmsg,
          success:function(){
            wx.navigateTo({
              url: 'replacepay?ordersn='+res.data.ordersn,
            })
          }
        })
      }else{
        if (res.data.errcode == 20601) {
          wx.showModal({
            content: res.data.errmsg,
            confirmText: "去处理",
            success: function (data) {
              if (data.confirm) {
                wx.navigateTo({
                  url: '/order/replacepay?ordersn=' + res.data.errdata.ordersn
                })
              } else if (data.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        } else if (res.data.errcode == 20602) {
          wx.showModal({
            content: res.data.errmsg,
            confirmText: "去查看",
            success: function (data) {
              if (data.confirm) {
                wx.navigateTo({
                  url: '/olwork/posDetail?id=' + res.data.errdata.pid,
                })
              } else if (data.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        } else {
          wx.showToast({
            title: res.data.errmsg,
            icon: 'none'
          })
        }
      }
    })
  },
  getFormId: function (e) {
    var formid = e.detail.formId;
    app.addformId(formid)
  }
})