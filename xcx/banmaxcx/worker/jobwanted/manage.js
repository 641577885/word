// pages/worker/my/manage.js
const bm = require('../../utils/common.js')
const Page = require('../../utils/ald-stat.js').Page;
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
     tacitlyApprove:true,
     tacitlyApprove2:false,
     job_status:0,
     statusarr: ['在职－考虑机会', '在职—不考虑机会', '在职—月底到岗' ,'离职—随时到岗'],
     work_way:0,
     resident:0,
     sanwu:0,
     dream_list: [{ id: '', profession_name: '', industry: '', price: '', city_name:''}],
     online_price:2000,
     zg_show:false,
     zc_show: false,
     st_show: false
  },
  bindPickerChange:function(e){
    var that = this
    this.setData({
      job_status:e.detail.value
    })
    var job_status = parseInt(that.data.job_status)+1
    bm.requsetData('/w/resume/job/intention?scene=edit', 'post', { job_status: job_status }, function (data) {
      if (data.data.errcode != 0){
        wx.showToast({
          title: data.data.errmsg,
          icon:'none'
        })
      }
    })
  },
  // 在线办公
  online:function(e){
    var that = this
    if (e.detail.value==true){
      that.setData({ work_way: 1, zg_show: true, zc_show: false, st_show: false})
    } else{
      that.setData({ work_way: 2, zg_show: false })
    }
    var work_way = that.data.work_way
    bm.requsetData('/w/resume/job/intention?scene=edit', 'post', { work_way: work_way }, function (data) {
      if (data.data.errcode != 0) {
        wx.showToast({
          title: data.data.errmsg,
          icon: 'none'
        })
      }
    })
  },
  // 可驻场办公
  zhuchang:function(e){
    var that = this
    if (e.detail.value == true) {
      that.setData({ resident: 1, zc_show: true, zg_show: false, st_show: false})
    } else {
      that.setData({ resident: 0, zc_show: false})
    }  
    var resident = that.data.resident
    bm.requsetData('/w/resume/job/intention?scene=edit', 'post', { resident: resident }, function (data) {
      if (data.data.errcode != 0) {
        wx.showToast({
          title: data.data.errmsg,
          icon: 'none'
        })
      }
    })
  },
  // 接受三天无理由退款
  back:function(e){
    var that = this
    if (e.detail.value == true) {
      that.setData({ sanwu: 1, st_show: true, zc_show: false, zg_show: false})
    } else {
      that.setData({ sanwu: 0, st_show: false })
    }
    var sanwu = that.data.sanwu
    bm.requsetData('/w/resume/job/intention?scene=edit', 'post', { sanwu: sanwu }, function (data) {
      if (data.data.errcode != 0) {
        wx.showToast({
          title: data.data.errmsg,
          icon: 'none'
        })
      }
    }) 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     
  },  
  onShow:function(){
    var that = this;
    bm.requsetData('/w/resume/job/intention?scene=detail', 'post', '', function (res) {
      var da = res.data.data
      console.log(da)
      that.setData({
        dream_list: da.dream_list,
        id: da.id,
        job_status: parseInt(da.job_status)-1,
        resident: da.resident,
        sanwu: da.sanwu,
        work_way: da.work_way,
        online_price:da.price
      })

    })
  },
  clear_zg:function(){
    this.setData({
      zg_show:false
    })
  },
  clear_zc: function () {
    this.setData({
      zc_show: false
    })
  },
  clear_st: function () {
    this.setData({
      st_show: false
    })
  }
})