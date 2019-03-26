// pages/yzm/yzm.js
var app = getApp();
var bm = require('../../utils/common.js')
const Page = require('../../utils/ald-stat.js').Page;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text: '绑定银行卡',
    lxtel:null,
    Length: 6,        //输入框个数  
    isFocus: true,    //聚焦  
    Value: "",        //输入的内容  
    ispassword: false, //是否密文显示 true为密文， false为明文。  
    second:'',
    second_text:'发送验证码',
    again:'opencode',
    //银行卡号
    account:null,
    //发送验证码场景值1为注册register，2为绑卡bindcode
    address:null,
    bindtype:'',
    type:null,
    card_id:'',
    open_bank:''
  },
  opencode:function(){
    var that = this
    var type = that.data.type
    var lxtel = that.data.lxtel
    if (type == 3) {
      
      bm.requsetData('/c/login/send_code?scene=unbindphone', 'post', '', function (data) {
        if (data.data.errcode == 0) {
          
        } else {
          wx.showToast({
            title: data.data.errmsg,
            icon: 'none'
          })
        }
      })
    }
    //发送验证码
    if (type == 2) {
      bm.requsetData('/c/login/send_code', 'post', { lxtel: lxtel, scene: 'bindcard' }, function (data) {
        console.log(data)
      })
    }
    var time = 120
    var second_text = that.data.second_text
    var again = that.data.again
    var _time=setInterval(function () {
      time -= 1;
      if (time > 0) {
        that.setData({
          second: time,
          second_text:'s后重新发送',
          again: '',
        })
      } else {
        that.setData({
          second: '',
          second_text: '重新发送',
          again: 'again',
        })
        clearInterval(_time)
      }

    }, 1000)
  
  },
  Focus(e) {
    var that = this;
    console.log(e.detail.value);
    var inputValue = e.detail.value;
    that.setData({
      Value: inputValue,
    })
  },
  Tap() {
    var that = this;
    that.setData({
      isFocus: true,
    })
  },
  formSubmit(e) {
    var type=this.data.type
    var role = app.globalData.role
    if(type == 2){
      //验证码
      var vcode = e.detail.value.password
      //银行卡号
      var account = this.data.account
      var address = this.data.address
      var bindtype = this.data.bindtype
      var card_id = this.data.card_id
      var open_bank = this.data.open_bank
      if (vcode.length == 0){
        wx.showToast({
          title: '请输入验证码',
          icon:'none'
        })
        return false;
      }
      if(role == 1){
        bm.requsetData('/w/finance/card_manage', 'post', { vcode: vcode,  account: account, id: card_id, scene: bindtype, province: address, open_bank: ''}, function (data) {
          if (data.data.errcode == 0) {
            wx.showToast({
              title: data.data.errmsg,
            })
            setTimeout(function () {
              wx.switchTab({
                url: '/pages/worker/mycentre',
              })
            }, 2000)

          } else {
            wx.showToast({
              title: data.data.errmsg,
              icon: 'none'
            })
          }
        })
      }
      
    }
    //解绑手机
    if (type == 3) {
      var vcode = e.detail.value.password
      bm.requsetData('/c/action/unbindphone', 'get', { vcode: vcode }, function (data) {
        console.log(data)
        if (data.data.errcode == 0) {
          wx.showToast({
            title: data.data.errmsg,
          })
          setTimeout(function () {
            wx.navigateTo({
              url: '/setting/modifyPhone',
            })
          }, 1500)
        } else {
          wx.showToast({
            title: data.data.errmsg,
            icon: 'none'
          })
        }
      })
    }
  },  
  //重新发送验证码
  again:function(){
    var that=this
    //手机号
    var lxtel = app.globalData.lxtel.substr(0, 3) + "****" + app.globalData.lxtel.substr(7);
    //银行卡号
    var account = that.data.account
    //发送验证码场景值1为注册register，2为绑卡bindcode
    var type = that.data.type
    that.setData({
      lxtel: lxtel,
      account: account,
      type: type,
    })
    if (type == 1) {
    }
    //发送验证码
    if (type == 2) {
      bm.requsetData('/c/login/send_code', 'post', { lxtel: lxtel, scene: 'bindcard' }, function (data) {
        if (data.data.errcode == 0){
          wx.showToast({
            title: data.data.errmsg,
            icon:'none'
          })
        }else{
          wx.showToast({
            title: data.data.errmsg,
            icon: 'none'
          })
        }
      })
    }
    if (type == 3) {
      console.log(4)
      bm.requsetData('/c/login/send_code?scene=unbindphone', 'post', '', function (data) {
        if (data.data.errcode == 0) {
          var time = 120
          var second_text = that.data.second_text
          var again = that.data.again
          var _time02=setInterval(function () {
            time -= 1;
            if (time > 0) {
              that.setData({
                second: time,
                second_text: 's后重新发送',
                again: '',
              })
            } else {
              that.setData({
                second: '',
                second_text: '重新发送',
                again: 'again',
              })
              clearInterval(_time02)
            }

          }, 1000)
        } else {
          wx.showToast({
            title: data.data.errmsg,
            icon: 'none'
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var lxtel
    bm.requsetData('/c/action/getPhone', 'post', '', function (data) {
      lxtel = data.data.lxtel.substr(0, 3) + "****" + data.data.lxtel.substr(7);
      that.setData({lxtel:lxtel})
    })
   
    //银行卡号
    var account = options.account
    var open_bank = options.bank
    //发送验证码场景值1为注册register，2为绑卡bindcode
    var bindtype = options.bindtype
    var card_id = options.card_id
    var type = options.type
    var address = options.address
    if(type==3){
      that.setData({
        text: '解绑手机',
        type: type,
      })
    }
    if(type == 2){
      that.setData({
        account: account,
        type:type,
        address:address,
        bindtype: bindtype,
        card_id: card_id,
        open_bank: open_bank
      })
    }
  }
})