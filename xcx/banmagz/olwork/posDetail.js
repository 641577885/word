const bm = require('../utils/common.js')
const Page = require('../utils/ald-stat.js').Page;
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pid:'',
    role:2,
    userInfo:{},
    proInfo:{},
    memberInfo:[],
    workRecord:[],
    proLogList:[],
    showBox: false,
    actionSheetHidden:true,
    sharetoken:null,
    isShowDialog: true,
    errshare:1,
    showOpStatus:false
  },
  //续签
  rehire: function () {
    this.setData({ actionSheetHidden: true })
    wx.navigateTo({
      url: '/order/renew?pid=' + this.data.pid,
    })
  },
  //再次雇佣
  sendhire: function () {
    this.setData({ actionSheetHidden: true })
    wx.navigateTo({
      url: '/order/setpay?uid=' + this.data.userInfo.id,
    })
  },
  //评价
  setevaluate:function(){
    wx.navigateTo({
      url: 'evaluate?pid='+this.data.pid
    })
  },
  // 投诉
  complain: function () {
    this.setData({ actionSheetHidden: true })
    wx.navigateTo({
      url: 'addRecord?pid=' + this.data.pid+'&type=addts'
    })
  },
  fire: function () {
    this.setData({ actionSheetHidden: true })
    wx.navigateTo({
      url: 'addRecord?pid=' + this.data.pid + '&type=addfire'
    })
  },
  goPay: function () {
    var that=this;
    wx.redirectTo({
      url: '/order/replacepay?ordersn=' + that.data.proInfo.ordersn,
    })
  },
  //发工资
  payPrice:function(){
    var that = this;
    wx.showModal({
      title: '是否确认发工资',
      content: '',
      showCancel: true,
      cancelText: '取消',
      confirmText: '确定',
      success: function (res) {
        if (res.confirm) {
          bm.requsetData("/b/project/paywage", "post", { pid: that.data.pid}, function (res) {
            if (!res.data.errcode) {
              wx.showToast({
                title: '支付成功',
                success: function () {
                  that.getInfo();
                }
              })
            } else {
              wx.showToast({
                title: res.data.errmsg,
                icon: 'none'
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  showMoreManange:function(){
    this.setData({ actionSheetHidden: !this.data.actionSheetHidden})
  },
  getInfo:function(){
    var that = this;
    var array = [];
    bm.requsetData('/b/project/detail', 'get', { id: that.data.pid }, function (res) {
      if (!res.data.errcode) {
        res.data.pro.begintime = bm.formatDate(res.data.pro.begintime)
        res.data.pro.endtime = bm.formatDate(res.data.pro.endtime)
        if (res.data.pro.state == 'complaining'){
          res.data.pro.ycData.expected_jtime = bm.formatDate(res.data.pro.ycData.expected_jtime)
        } else if (res.data.pro.state == 'firing'){
          res.data.pro.ycData.expected_optime = bm.formatDate(res.data.pro.ycData.expected_optime)
        }
        if (app.globalData.uid==res.data.pro.sid){
          that.setData({ showOpStatus:true})
        }
        that.setData({ userInfo: res.data.user, proInfo: res.data.pro, memberInfo: res.data.member })
      } else {
        wx.showToast({
          title: res.data.errmsg,
          icon: 'none'
        })
      }
    })
    bm.requsetData('/b/project/work/list', 'get', { pid: that.data.pid,limit:10 }, function (res) {
      if (!res.data.errcode) {
        for (var i in res.data.list) {
          res.data.list[i].ctime = bm.formatDate(res.data.list[i].ctime)
        }
        that.setData({ workRecord: res.data.list })
      } else {
        wx.showToast({
          title: res.data.errmsg,
          icon: 'none'
        })
      }
    })
    bm.requsetData('/b/project/share_link', 'get', { id: that.data.pid }, function (data) {
      console.log(data)
      if (data.data.errcode == 0) {
        that.setData({
          sharetoken: data.data.token,
          errshare:1
        })
      } else {
        that.setData({
          errshare: 0
        })
      }
    })
  },
  //获取项目
  getProLog:function(){
    var that=this;
    bm.requsetData("/b/project/event/list", "get", { id: that.data.pid,limit:20},function(res){
      if(!res.data.errcode){
        for (var i in res.data.list){
          res.data.list[i].ctime = bm.formatDate(res.data.list[i].ctime)
          res.data.list[i].checked = false
        }
        that.setData({ proLogList: res.data.list})
      }else{
        wx.showToast({
          title: res.data.errmsg,
          icon:"none"
        })
      }
    })
  },
  showDetail:function(e){
    var that=this;
    var _idx=e.currentTarget.dataset.index;
    that.data.proLogList[_idx].checked = !that.data.proLogList[_idx].checked;
    that.setData({ proLogList: that.data.proLogList })
  },
  //取消投诉
  cancelTs: function () {
    var that = this;
    wx.showModal({
      title: '是否确认取消投诉',
      content: '',
      showCancel: true,
      cancelText: '取消',
      confirmText: '确定',
      success: function (res) {
        if (res.confirm) {
          bm.requsetData("/b/project/tousu/cancel", "post", { pid: that.data.pid }, function (res) {
            if (!res.data.errcode) {
              wx.showToast({
                title: '取消投诉成功',
                success: function () {
                  that.getInfo();
                }
              })
            } else {
              wx.showToast({
                title: res.data.errmsg,
                icon: 'none'
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //取消解雇
  cancelFire: function () {
    var that = this;
    wx.showModal({
      title: '是否确认取消解雇',
      content: '',
      showCancel: true,
      cancelText: '取消',
      confirmText: '确定',
      success: function (res) {
        if (res.confirm) {
          bm.requsetData("/b/project/fire/cancel", "post", { pid: that.data.pid }, function (res) {
            if (!res.data.errcode) {
              wx.showToast({
                title: '取消解雇成功',
                success: function () {
                  that.getInfo();
                }
              })
            } else {
              wx.showToast({
                title: res.data.errmsg,
                icon: 'none'
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //取消雇佣
  cancelgy: function () {
    var that = this;
    var pages = getCurrentPages(); // 当前页面
    var beforePage = pages[pages.length - 2]; 
    wx.showModal({
      title: '是否确认取消雇佣',
      content: '',
      showCancel: true,
      cancelText: '取消',
      confirmText: '确定',
      success: function (res) {
        if (res.confirm) {
          bm.requsetData("/b/project/cancel", "post", { id: that.data.pid }, function (res) {
            if (!res.data.errcode) {
              wx.showToast({
                title: '取消雇佣成功',
                success: function () {
                  setTimeout(function () {
                    wx.navigateBack({
                      success: function () {
                        beforePage.onLoad(); // 执行前一个页面的onLoad方法
                      }
                    });
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
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  remindWork:function(){
    bm.requsetData("/b/project/jobNoticePush", "post", { pro_id:this.data.pid},function(res){
      if(!res.data.errcode){
        wx.showToast({
          title: "已经成功提醒创客添加日报",
          icon:"none"
        })
      }else{
        wx.showToast({
          title: res.data.errmsg,
          icon: "none"
        })
      }

    })
  },
  getFormId: function (e) {
    var formid = e.detail.formId;
    app.addformId(formid)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({ pid:options.id});
  },
  onShow:function(){
    var that = this;
    if (app.globalData.auth) {
      that.getInfo();
      that.getProLog();
    } else {
      app.authCallback = auth => {
        if (app.globalData.auth == 0) {
          that.setData({
            isShowDialog: false
          })
        }
        that.getInfo();
        that.getProLog();
      }
    }
  },
  onShareAppMessage:function(res){
    var that = this;
    if (res.from === 'button') {
      if (that.data.errshare == 1){
        return {
          title: '邀请协作者',
          path: '/pages/share/sharework?tk=' + that.data.sharetoken
        }
      }
    }else{
      return {
        title: '海量互联网人才免费联系',
        imageUrl: 'https://bm.jiangcdn.com/banma/share/gushare.png',
        path: '/pages/index/index'
      }
    }
  },
  //图片预览
  imgYu: function (event) {
    var src =  event.currentTarget.dataset.src;//获取data-src
    var imgList = event.currentTarget.dataset.list;//获取data-list
    var list = []
    for (var i in imgList) {
      var url = imgList[i]
      list.push(url)
    }
    bm.imgYu(src, list)
  }
})