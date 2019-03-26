// pages/bank/bankcard.js
var app=getApp()
var bm = require('../../utils/common.js')
const Page = require('../../utils/ald-stat.js').Page;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    /**无银行卡显示添加 */
    cardlist_show:true,
    /**银行卡列表 */
    cardlist: [
      {
        bank_name: '',
        card_type: '',
        card_code: '',
        card_code_wh: null,
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var role = app.globalData.role
    if(role == 1){
      var url = '/w/finance/card_list'
    }else{
      var url = '/b/finance/card_list'
    }
    bm.requsetData(url, 'post','',function (data) {
      if(data.data.list.length == 0){
        that.setData({
          cardlist_show: false,
        })
      }else{
      that.setData({
        cardlist:[
          {
          bank_name:data.data.list[0].bank_name,
          card_type: data.data.list[0].card_type_name,
          card_code: data.data.list[0].hide_account,
          card_code_wh: data.data.list[0].hide_account.slice(-4)
          }
        ]
      })
      }
    })
    // /**控制显示添加按钮 */
    // var cardlist = this.data.cardlist
    // console.log(cardlist)
    // if (cardlist.length > 0){
      
    // }
  },
})