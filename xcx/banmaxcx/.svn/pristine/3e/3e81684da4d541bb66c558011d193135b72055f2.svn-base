// worker/my/myFill.js
const bm = require('../../utils/common.js')
const Page = require('../../utils/ald-stat.js').Page;
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: 100,
    numPrint: 0,
    dataName: '',
    content: '',
    type:'',
    //组件简历百分比
    fastResume_rate: 0,
    fastResumeshow: false,
    rest: 0,
    fast_step: [],
    fastResume_text: false,
    placeholder:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var type = options.type
    this.setData({ type: options.type})
    if (type == 'homepage'){
      wx.setNavigationBarTitle({
        title: '我的社交主页'
      })
      bm.requsetData('/w/resume/detail?scene=social', 'get', '', function (data) {
        that.setData({
          content: data.data.social_account_list,
          placeholder:'请输入我的个人社交主页'
        })
      })
    } else if (type = 'advantage'){
      wx.setNavigationBarTitle({
        title: '我的优势'
      })
      bm.requsetData('/w/resume/detail?scene=advantage', 'get', '', function (data) {
        console.log(data)
        that.setData({
          content: data.data.advantage,
          numPrint: data.data.advantage.length,
          num:50,
          placeholder:'一句话介绍展示自己的特长和优势，获取雇主第一优质印象'
        })
      })
      //快速填写
      if (options.fill_type == 'show') {
        that.setData({
          fastResumeshow: true
        })
        bm.requsetData("/w/resume/fill_state", "post", '', function (data) {
          that.setData({
            fastResume_rate: parseInt(data.data.resume_status.score),
            rest: data.data.resume_status.rest,
            fast_step: data.data.resume_status.fast_step
          })
        })
      } else {
        that.setData({
          fastResumeshow: false
        })
      }
    }
    
  },
  fillTxt: function (e) {
    var strnum = e.detail.value.length;
    var value = e.detail.value;
    this.setData({ numPrint: strnum, content: value })
  },
  checkFill:function(){
    var that = this
    var type = that.data.type
    if (type == 'homepage'){
      var account = that.data.content
      var url = '/w/resume/social'
      var query = { account: account }
    } else if (type == 'advantage'){
      var advantage = that.data.content
      var url = '/w/resume/advantage'
      var query = { advantage: advantage }
    }
    bm.requsetData(url, 'post',query, function (data) {
      if (data.data.errcode == 0) {
        wx.showToast({
          title: data.data.errmsg
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 1,
          })
        }, 1500)
      } else {
        wx.showToast({
          title: data.data.errmsg,
          icon: 'none'
        })
      }
    })
  },
  gonext:function(){
    var that = this
    var type = that.data.type
    if (type == 'advantage') {
      var advantage = that.data.content
      var url = '/w/resume/advantage'
      var query = { advantage: advantage }
    }
    bm.requsetData(url, 'post', query, function (data) {
      if (data.data.errcode == 0) {
        wx.showToast({
          title: data.data.errmsg
        })
        setTimeout(function () {
          var fast_step = that.data.fast_step
            if (fast_step.work_exp == 0) {
              wx.redirectTo({
                url: '/worker/my/workExper?type=1&fill_type=show&id=',
              })
            } else {
              if (fast_step.project_exp == 0) {
                wx.redirectTo({
                  url: '/worker/my/projectExper?type=1&fill_type=show&id=',
                })
              } else {
                wx.redirectTo({
                  url: '/worker/my/myresume',
                })
              }
            }
            
        }, 1500)
      } else {
        wx.showToast({
          title: data.data.errmsg,
          icon: 'none'
        })
      }
    })
  }
})