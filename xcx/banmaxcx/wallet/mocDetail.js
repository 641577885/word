const bm = require('../utils/common.js')
const Page = require('../utils/ald-stat.js').Page;
var app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    active: 0,//当前所在滑块的 index
    // hiddentext:false,
    current: 1,//页数，开始是1从第一页开始请求
    lists: [],  
    listsget: [],
    listsused: [],
    page: 1,
    pageget: 1,
    pageused: 1,
    allpage: 1,
    limit: 5,
    order: '',
    ctype: ['usera', 'usera_add', 'usera_used'],
    typer: '',
    hiddenpart: false,
    empty_text_01: '已获取',
    empty_text_02: '已使用',
    pageall: '',
    list:[]
  },
  //tab切换
  tab: function (event) {
    this.setData({ active: event.target.dataset.current })
    this.eventchange()
    // this.getlistData()
  },
  // 滑动事件
  eventchange: function (event) {
    this.setData({ active: event.detail.current })
      this.common()
  },
  common: function () {
    if (this.data.active == 0) {
      if (this.data.lists.length == 0){
        this.setData({ typer: this.data.ctype[0] })
        this.setData({ pageall: this.data.page })
        this.getlistData()
      } else {
         this.setData({ lists: this.data.lists })
      } 
    
    } 
    if (this.data.active == 1) {
      if (this.data.listsget.length == 0){
        this.setData({ typer: this.data.ctype[1] })
        this.setData({ pageall: this.data.pageget })
        this.getlistData()
      } else {
        this.setData({ listsget: this.data.listsget })
      }
    
    }
     if (this.data.active == 2) {
       if (this.data.listsused.length == 0){
         this.setData({ typer: this.data.ctype[2] })
         this.setData({ pageall: this.data.pageused })
         this.getlistData()
       } else {
         this.setData({ listsused: this.data.listsused })
       }
     
    }
  
  },
  onLoad: function (options) {
    this.setData({ typer: this.data.ctype[0] })
    this.setData({ pageall: this.data.page })
    console.log('this.data.page', this.data.page)
    this.getlistData()
  },
  getlistData: function () {
    var that = this
    wx.showLoading({ title: '加载中', duration: 2000 })
    bm.requsetData('/c/action/getAllAccLog', 'get', { limit: that.data.limit, page: that.data.pageall, ctype: that.data.typer }, function (data) {
      if (data.data.errcode != 0) {
        wx.showToast({
          mask: true,
          title: data.data.errmsg,
          icon: 'none',
          duration: 2000
        })
      } else {
        that.setData({ allpage: data.data.pages.allpage })
        console.log(that.data.typer)
        if (that.data.typer == 'usera') {
          if (data.data.list.length > 0) {
            that.setData({ lists: that.data.lists.concat(data.data.list) })
          }
        }
        console.log(that.data.lists)
        if (that.data.typer == 'usera_add') {
          if (data.data.list.length > 0) {
            that.setData({ listsget: that.data.listsget.concat(data.data.list) })
          }
        }
        console.log(that.data.listsget)
        if (that.data.typer == 'usera_used') {
          if (data.data.list.length > 0) {
            that.setData({ listsused: that.data.listsused.concat(data.data.list) })
          }
        }
        that.setData({ hiddenpart: true })
      }
      wx.hideLoading()
    })
  },
  evlower: function () {
    var that = this
    that.setData({ page: that.data.page + 1 })
    that.setData({ pageall: that.data.page })
    that.getlistData();
    that.lowercommon()
  },
  evlowerget: function () {
    var that = this
    that.setData({ pageget: that.data.pageget + 1 })
    that.setData({ pageall: that.data.pageget })
    that.getlistData();
    that.lowercommon()
  },
  evlowerused: function () {
    var that = this
    that.setData({ pageused: that.data.pageused + 1 })
    that.setData({ pageall: that.data.pageused })
    that.getlistData();
    that.lowercommon()
  },
  lowercommon: function () {
    var that = this
    if (that.data.pageall > that.data.allpage) {
      wx.showToast({
        title: '已没有更多数据',
        icon: 'none',
        duration: 500
      })
    }
  },

})