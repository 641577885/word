// pages/publish/relType.js
var app = getApp()
const bm = require('../../utils/common.js')
const Page = require('../../utils/ald-stat.js').Page;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //总页面切换
    current: 2,
    //需求页面切换
    demand_curr:1,
    //需求页01数据
    demand01_list:[],
    demand_c_id:null,
    //需求页02数据
    demand02_list: [],
    //需求页02标题
    demand02_title:'',
    //需求页03数据
    demand_03_array: ['不限', '1周', '2周', '3周', '1个月', '2个月', '3个月'],
    index: 0,
    mb_list: [
      {
        click: true,
        content: '模版1'
      },
      {
        click: false,
        content: '模版2'
      }
    ],
    xq_val: '需要此方面的专业人士完成此工作，具体需求细节、工期、价格可详谈',
    textarea_length: 0,
    skills:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    //需求页01数据
    bm.requsetData('/c/config/demand_cat', 'post', '', function (data) {
      console.log(data)
      that.setData({
        demand01_list: data.data
      })
    })
  },
  //demand_01点击事件
  click_demand_01:function(e){
    var that = this
    var demand_02_id = e.currentTarget.dataset.demandid
    var demand01_list = that.data.demand01_list
    for (var i in demand01_list) {
      if (demand_02_id == i) {
        demand01_list[i].click = true
      }
      else {
        demand01_list[i].click = false
      }
    }
    that.setData({
      demand01_list: demand01_list
    })
    setTimeout(function(){
      that.setData({
        demand02_list: demand01_list[demand_02_id].son,
        demand02_title: demand01_list[demand_02_id].name,
        skills: demand01_list[demand_02_id].id,
        demand_c_id: demand_02_id,
        demand_curr: 2
      })
    },300)
    
  },
  //demand_02点击事件
  click_demand_02:function(e){
    var that = this
    var demand02_list = that.data.demand02_list
    var demand_03_id = e.currentTarget.dataset.demandtwoid
    for (var i in demand02_list) {
      if (demand_03_id == i) {
        demand02_list[i].click = 'on'
      }
      else {
        demand02_list[i].click = ''
      }
    }
    that.setData({
      demand02_list: demand02_list
    })
    setTimeout(function () {
      that.setData({
        skills: demand_03_id,
        demand_curr: 3
      })
    }, 300)
   
  },
  //demand_03点击事件
  demand03_tab_click: function (event) {
    var that = this
    for (var i = 0; i < that.data.mb_list.length; i++) {
      if (event.currentTarget.id == i) {
        that.data.mb_list[i].click = true
      }
      else {
        that.data.mb_list[i].click = false
      }
    }
    that.setData({
      mb_list: that.data.mb_list,
    })
    if (event.currentTarget.id == 0) {
      that.setData({
        xq_val: '需要此方面的专业人士完成此工作，具体需求细节、工期、价格可详谈'
      })
    } else {
      that.setData({
        xq_val: '有关具体细节可详细沟通了解，工期、价格可详谈。'
      })
    }
  },
  bindnum: function (e) {
    var that = this
    that.setData({
      textarea_length: e.detail.value.length
    })
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  //demand_03提交
  demand_03_submit: function (e) {
    var that = this
    var title = e.detail.value.title
    var content = e.detail.value.content
    var time = that.data.index
    var money = e.detail.value.money
    var skills = [that.data.skills]
    console.log(title, content, time, money, skills)
    if (title.length == 0) {
      wx.showToast({
        title: '请填写标题描述',
        icon: 'none'
      })
      return false
    }
    if (content.length == 0) {
      wx.showToast({
        title: '请填写需求描述',
        icon: 'none'
      })
      return false
    }
    if (money.length == 0) {
      wx.showToast({
        title: '请填写预算',
        icon: 'none'
      })
      return false
    }
    bm.requsetData('/b/demand/create', 'post', { title: title, skills: skills, period: time, price: money, content: content }, function (res) {
      if (!res.data.errcode) {
        wx.showToast({
          title: '发布需求成功',
          icon: 'success',
          success: function (res) {
            setTimeout(function () {
              wx.reLaunch({
                url: '/business/findProject/pubSuccess',
              })
            }, 1000)
          }
        })
      } else {
        wx.showToast({
          title: res.data.errmsg,
          icon: 'none'
        })
      }
    })
  },
  //需求更改
  edit_demand:function(){
    var that = this
    that.setData({
      demand_curr: 1
    })
  },
  edit_demand_02: function () {
    var that = this
    that.setData({
      demand_curr: 2
    })
  },
  // 切换选项
  tab: function (event) {
    var that = this;
    that.setData({
      current: event.target.dataset.current
    })
    
  },
  //滑动事件
  eventchange: function (event) {
    this.setData({
      current: event.detail.current
    })
  },
})