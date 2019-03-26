// pages/picker/jobPicker.js
var app = getApp();
const bm = require('../../utils/common.js')
const Page = require('../../utils/ald-stat.js').Page;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    joblist:[],
    twolist:[],
    threelist:[],
    list_show:false,
    id02:0,
    isScroll: true,
    jobData:null,
    jobtwoid:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
   onLoad: function (options) {
     var that=this
     bm.requsetData('/c/config/profession', 'post', '', function (data) {
       that.setData({
         joblist: data.data
       })
     },true)
    // this.setData({
    //   joblist: joblist.joblist
    // })
  },
  one_click:function(e){
    var jobtwoid = this.data.jobtwoid
    var twolist = e.currentTarget.dataset.text
    var threelist = e.currentTarget.dataset.text
    var ids = e.currentTarget.dataset.id;
    var list_show = this.data.list_show
      this.setData({
        twolist: twolist.sub,
        threelist: twolist.sub[0].sub,
        list_show: true,
        id: ids,
        isScroll: false,
        jobtwoid: twolist.sub[0].id
      })
  },
  two_click:function(e){
    var threelist = e.currentTarget.dataset.text
    var ids = e.currentTarget.dataset.id;
    this.setData({
      threelist: threelist.sub,
      id02: ids,
      jobtwoid: threelist.id
    })
  },
  zg_click:function(e){
    var list_show = this.data.list_show
    this.setData({
      list_show: false,
      isScroll: true,
    })
  },
  submit:function(e){
    var jobtwoid = this.data.jobtwoid
    var jobId = e.currentTarget.dataset.code
    var jobName = e.currentTarget.dataset.name
    var pages = getCurrentPages();             //  获取页面栈
    var currPage = pages[pages.length - 1];    // 当前页面
    var prevPage = pages[pages.length - 2];    // 上一个页面
    this.data.jobData = { jobId: jobId, jobName: jobName, jobIdTwo: jobtwoid }
    prevPage.setData({
      jobData: this.data.jobData
    })
    wx.navigateBack()
  }
})