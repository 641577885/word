// pages/bank/bank.js
var app = getApp()
var bm = require('../../utils/common.js')
const Page = require('../../utils/ald-stat.js').Page;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['北京市', '天津市', '河北省', '山西省', '内蒙古自治区', '辽宁省', '吉林省', '黑龙江省', '上海市', '江苏省', '浙江省', '安徽省', '福建省', '江西省', '山东省', '河南省', '湖北省', '湖南省', '广东省', '广西壮族自治区', '海南省', '重庆市', '四川省', '贵州省', '云南省', '西藏自治区', '陕西省', '甘肃省', '青海省', '宁夏回族自治区', '新疆维吾尔自治区'],
    index: 0,

    bankarr:['招商银行'],
    bankindex:0,

    address: '请选择',
    bankcard: '',
    bindtype: '',
    card_id: '',
    bank:''
  },
  onLoad: function (options) {
    var that = this
    console.log(options.card_id)
    if (options.card_id) {
      var card_id = options.card_id

      bm.requsetData('/b/finance/card_manage?scene=detail&id=' + card_id, 'post', '', function (data) {
        console.log(data)
        that.setData({
          bankcard: data.data.card.account,
          address: data.data.card.province,
          bindtype: 'edit',
          card_id: card_id
        })
      })

    } else {
      that.setData({
        bindtype: 'add'
      })
    }

  },
  formSubmit: function (e) {
    var that = this
    var bankcard = e.detail.value.bankcard
    var bindtype = that.data.bindtype
    var card_id = that.data.card_id
    var bank = that.data.bank
    var name_reg = /^[\u4e00-\u9fa5]{2,10}$/
    var id_reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
    var bank_reg = /^\d{13}|\d{19}$/
    
    if (bankcard.length == 0) {
      wx.showToast({
        title: '请填写银行卡号',
        icon: 'none'
      })
      return false;
    }
    if (!bank_reg.test(bankcard)) {
      wx.showToast({
        title: '银行卡号格式错误',
        icon: 'none'
      })
      return false;
    }
    
    var address = that.data.address
    console.log(address)
    if (address == '请选择') {
      wx.showToast({
        title: '请选择开户行所在地',
        icon: 'none'
      })
      return false;
    }
    bm.requsetData('/b/finance/check_card', 'post', { account: bankcard }, function (data) {
      if (data.data.errcode == 0) {
        wx.showModal({
          title: '提示',
          content: '请确认银行卡及身份证信息填写正确，若由于填写错误导致的账务损失将由你个人负责!',
          cancelText: '返回检查',
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/yzm/yzm?account=' + bankcard + '&type=2&address=' + address + '&bindtype=' + bindtype + '&card_id=' + card_id + '&bank=' + bank,
              })
            } else {
              console.log('用户点击取消')
            }
          }
        })
      } else {
        wx.showToast({
          title: data.data.errmsg,
          icon: 'none'
        })
      }
    })
    
  },
  bindPickerChange: function (e) {
    var that = this
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value,
      address: that.data.array[e.detail.value]
    })
  },
  bindbankChange: function (e) {
    var that = this
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      bankindex: e.detail.value,
      bank: that.data.bankarr[e.detail.value]
    })
  },
})