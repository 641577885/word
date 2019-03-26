// business/my/previewCompany.js
const app = getApp();
const bm = require('../../utils/common.js')
const Page = require('../../utils/ald-stat.js').Page;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    comp_info:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    bm.requsetData('/b/company/index', 'get', '', function (data) {
      if(data.data.errcode==0){
        if (data.data.comp_info.logo.length == 0){
          data.data.comp_info.logo = '/images/asda1.png'
        }
        if (data.data.comp_info.finance_stage_name.length > 0) {
          data.data.comp_info.finance_stage_name = data.data.comp_info.finance_stage_name + '-'
        } else {
          data.data.comp_info.finance_stage_name = ''
        }
        if (data.data.comp_info.staff_size_name.length > 0) {
          data.data.comp_info.staff_size_name = '-' + data.data.comp_info.staff_size_name
        } else {
          data.data.comp_info.staff_size_name = ''
        }
        data.data.comp_info.logo = data.data.comp_info.logo + '@!200'
        that.setData({
          comp_info: data.data.comp_info
        })
      }else{
        wx.showToast({
          title: data.data.errmsg,
          icon:'none'
        })
      }
      
    })
  },
})