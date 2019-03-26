// wallet/invited.js
const bm = require('../utils/common.js')
const Page = require('../utils/ald-stat.js').Page;
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,//当前所在滑块的 index
    current: 1,
    history:[],
    inv_num:'',
    rank:[],
    empty_text_01: '列表',
    inviter_name:'',
    invitee_name:'',
    money:'',
    text: '邀请注册,获得元的红包',
    marqueePace: 1,//滚动速度
    marqueeDistance: 0,//初始滚动距离
    marqueeDistance2: 0,
    marquee2copy_status: false,
    marquee2_margin: 60,
    size: 14,
    orientation: 'left',//滚动方向
    interval: 20, // 时间间隔
    windowWidth:''  ,
    lenght:''
    // url:''

  },
  // onLoad: function (options) {
  //   var tk = app.globalData.token
  //   var role = app.globalData.role
  //   var host = app.globalData.host
  //   var url = host + '/html/invited/invited.html?tk=' + tk + '&role=' + role
  //   this.setData({ url: url })
  // },

  tab: function (event) {
    this.setData({ active: event.target.dataset.current })

    // this.getlistData()
  },
  // 滑动事件
  eventchange: function (event) {
    this.setData({ active: event.detail.current })

  },
  wechart:function(){
     wx.navigateTo({
       url: '../pages/share/shareck',
     })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var role = app.globalData.role;
    var that = this;
    var type;
    bm.requsetData('/c/action/invreg_info', 'get',{type:role}, function (data) {
       console.log(data)
       if (!data.data.errcode) {
         that.setData({ 
           history: data.data.inv_history,
           inv_num: data.data.inv_num*5,
           rank: data.data.inv_rank
         })
         if (that.data.history != 0) {
           let length = 0
           for (var i = 0; i < that.data.history.length; i++) {
             that.setData({
               inviter_name: that.data.history[i].inviter_name,
               invitee_name: that.data.history[i].invitee_name,
               money: that.data.history[i].money
             })
             length += (that.data.inviter_name.length + that.data.invitee_name.length + that.data.text.length + 1) * that.data.size;
           }
           var query = wx.createSelectorQuery();
           query.select('.marquee_text').boundingClientRect(function (rect) {
             that.setData({ length: rect.width })
           }).exec()
           var windowWidth = wx.getSystemInfoSync().windowWidth;// 屏幕宽度
           that.setData({
             length: length,
             windowWidth: windowWidth,
             marquee2_margin: length < windowWidth ? windowWidth - length : that.data.marquee2_margin
           });
           that.run1();// 水平一行字滚动完了再按照原来的方向滚动
           that.run2();// 第一个字消失后立即从右边出现
         }


       } else {
         wx.showToast({
           title: data.data.errmsg,
           icon: 'none',
           duration: 2000
         })
       }
    })
  },
  run1: function () {
    var that = this;
    var interval = setInterval(function () {
      if (-that.data.marqueeDistance < that.data.length) {
        that.setData({
          marqueeDistance: that.data.marqueeDistance - that.data.marqueePace,
        });
      } else {
        clearInterval(interval);
        that.setData({
          marqueeDistance: that.data.windowWidth
        });
        that.run1();
      }
    }, that.data.interval);
  },
  run2: function () {
    var that = this;
    var interval = setInterval(function () {
      if (-that.data.marqueeDistance2 < that.data.length) {
        // 如果文字滚动到出现marquee2_margin=30px的白边，就接着显示
        that.setData({
          marqueeDistance2: that.data.marqueeDistance2 - that.data.marqueePace,
          marquee2copy_status: that.data.length + that.data.marqueeDistance2 <= that.data.windowWidth + that.data.marquee2_margin,
        });
      } else {
        if (-that.data.marqueeDistance2 <= that.data.marquee2_margin) { // 当第二条文字滚动到最左边时
          that.setData({
            marqueeDistance2: that.data.marquee2_margin // 直接重新滚动
          });
          clearInterval(interval);
          that.run2();
        } else {
          clearInterval(interval);
          that.setData({
            marqueeDistance2: that.data.windowWidth
          });
          that.run2();
        }
      }
    }, that.data.interval);
  },
  // /**
  //  * 用户点击右上角分享
  //  */
  onShareAppMessage: function (res) {
    var that = this
    var return_url = res.webViewUrl
    console.log(res)
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
     return{
       title:'为互联网远程工作者加薪',
       path: '/pages/login/loading?inviter=' + app.globalData.uid,
       imageUrl:'https://bm.jiangcdn.com/banma/share/sharef.png',
       success:function(e){
         wx.showShareMenu({
           withShareTicketa:true
         })
       },
       fail(e){

       },
       complete(){}
     }
  },


})