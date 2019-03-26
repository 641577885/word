const bm = require('../../utils/common.js')
const Page = require('../../utils/ald-stat.js').Page;
const app=getApp();
var total_micro_second = 120;
function countDown(that) {
  // 渲染倒计时时钟
  that.setData({
    clock: total_micro_second
  });

  if (total_micro_second <= 0) {
    // timeout则跳出递归
    that.setData({
      disabled: false
    });
    return;
  }
  setTimeout(function () {
    // 放在最后--
    total_micro_second--;
    countDown(that);
  }, 1000)
}
Page({
  /**
   * 页面的初始数据
   */
  data: {
    lxtel:Number,
    order:{},
    accInfo:{},
    current:0,
    tcode_arr: ["", "", "", "", "", ""],
    tcode:Number,
    focus_flag: false,
    tcode_index: 0,
    disabled:false,
    clock:120,
    showCode:false,
    ctype:null,
    show_vip_success: false
  },
  //手机号码提交
  sendCell: function () {
    var that = this;
    that.setData({
      focus_flag: false
    })
    //请求发送
    bm.requsetData("/c/login/send_code", "post", { lxtel: that.data.lxtel, scene: 'yuepay' }, function (data) {
      if (!data.errcode) {
        total_micro_second = 120;
        that.setData({
          disabled:true
        })
        countDown(that)
      } else {
        wx.showToast({
          title: data.errmsg,
          icon: "none"
        })
      }
      that.setData({
        lxtelflag: true
      })
    })
  },
  focusSet: function () {
    this.setData({
      focus_flag: true
    })
  },
  //输入验证码
  setCode: function (e) {
    var that = this;
    // 设置空数组用于明文展现
    var val_arr = [];
    // 获取当前输入框的值
    var now_val = e.detail.value;
    var value_length = e.detail.value.length;
    // 遍历把每个数字加入数组
    for (let i = 0; i < 6; i++) {
      val_arr.push(now_val.substr(i, 1))
    }
    // 更新数据
    this.setData({
      tcode_arr: val_arr,
      tcode: now_val,
      tcode_index: value_length
    });
  },
  choosemethd: function (event) {
    this.setData({ current: event.currentTarget.dataset.current })
  },
  nextbtn:function(){
    var that = this;
    if (that.data.current == 0) {
      if (Number(that.data.accInfo.userb) >= Number(that.data.order.allprice)) {
        that.setData({ showCode: true });
      } else {
        wx.showToast({
          title: '当前余额不足，请选择其他方式支付！',
          icon: "none"
        })
      }
    } else {
      that.payMoney()
    }
  },
  showCover: function () {
    var that = this
    that.setData({ showCode: false });
  },
  payMoney: function (){
    var that = this,payment,link;
    var _type = that.data.ctype;
    var query = { ordersn: that.data.order.ordersn}
    if (_type == 'recharge') {
      link = '/pages/tcash/wallet'
      query.ctype = _type;
    } else if (_type == 'vip'){
      link = '/pages/worker/mycentre'
      
    }
    if (that.data.current == 1) {
      payment = 'xcxpay';
    }
    if (that.data.current == 0) {
      payment = 'yuepay';
      if (that.data.tcode_index!=6){
        wx.showToast({
          title: '手机验证码格式不正确',
          icon:'none'
        })
        return false;
      }
      query.vcode = that.data.tcode;
    }
    query.payment = payment
    bm.requsetData("/c/pay/payorder", "post", query, function (res) {
      if (!res.data.errcode) {
        if (payment =='yuepay'){
          if (_type == 'vip'){
            that.setData({
              show_vip_success: true
            })
          }
          
          // wx.showToast({
          //   title: res.data.errmsg,
          // })
          // setTimeout(function(){
          //   wx.switchTab({
          //     url: link,
          //   })
          // },1500)
          
        }else{
          var wxstr = JSON.parse(res.data.wxstr);
          wx.requestPayment({
            'timeStamp': wxstr.timestamp.toString(),
            'nonceStr': wxstr.nonceStr,
            'package': wxstr.packageValue,
            'signType': 'MD5',
            'paySign': wxstr.sign,
            'success': function (res) {
              if (_type == 'recharge'){
                wx.showToast({
                  title: '支付成功',
                  icon: 'success',
                  success: function () {
                    wx.redirectTo({
                      url: link,
                    })
                  }
                })
              }
              if (_type == 'vip'){
                that.setData({
                  show_vip_success:true
                })
              }
              
            },
            'fail': function (res) {
              wx.showToast({
                title: '支付失败',
                icon: 'none'
              })
            }
          })
        }
      } else {
        wx.showToast({
          title: res.data.errmsg,
          icon: 'none'
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options.type)
    that.setData({ lxtel: app.globalData.lxtel.substr(0, 3) + "****" + app.globalData.lxtel.substr(7), ordersn: options.ordersn, ctype: options.type })
    var query = { ordersn: options.ordersn }
    if (options.type == 'recharge') {
      query.ctype = options.type;
      that.setData({ current: 1 })
    }
    bm.requsetData('/c/pay/index', 'get', query, function (res) {
      if (!res.data.errcode) {
        if (options.type == 'recharge'){
          res.data.order.auto_cancel_time = bm.formatDate(res.data.order.auto_cancel_time);
        }
        that.setData({ order: res.data.order, accInfo: res.data.acc })
        if (Number(res.data.acc.userb) < Number(res.data.order.allprice)) {
          that.setData({ current: 1 })
        }
      } else {
        wx.showToast({
          title: res.data.errmsg,
          icon: 'none'
        })
      }
    })
  },
  //开通会员成功弹窗
  go_vip_pro: function () {
    wx.navigateTo({
      url: '/pages/openvip/vipExplain',
    })
  },
  colose_vip: function () {
    wx.switchTab({
      url: '/pages/worker/mycentre',
    })
  }
})