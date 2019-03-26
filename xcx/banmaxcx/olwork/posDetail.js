const bm = require('../utils/common.js')
const Page = require('../utils/ald-stat.js').Page;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pid:'',
    role:1,
    userInfo:{},
    proInfo:{},
    memberInfo:[],
    workRecord:[],
    showBox: false,
    proLogList:[]
  },
  getFormId: function (e) {
    var formid = e.detail.formId;
    app.addformId(formid)
  },
  addwork:function(){
    wx.navigateTo({
      url: 'addRecord?pid='+this.data.pid
    })
  },
  deleteRecord:function(e){
    var that = this;
    var _id = e.currentTarget.dataset.id;
    wx.showModal({
      content: '确定要删除么？',
      showCancel: true,
      cancelText: '取消',
      confirmText: '删除',
      success: function (res) {
        if (res.confirm) {
          bm.requsetData("/w/project/work/delete", "post", { id: _id }, function (res) {
            if (!res.data.errcode) {
              that.getInfo();
            } else {
              wx.showToast({
                title: res.data.errmsg,
                icon: "none"
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  getInfo:function(){
    var that = this;
    var array = [];
    bm.requsetData('/w/project/detail', 'get', { id: that.data.pid }, function (res) {
      if (!res.data.errcode) {
        res.data.pro.begintime = bm.formatDate(res.data.pro.begintime)
        res.data.pro.endtime = bm.formatDate(res.data.pro.endtime)
        if (res.data.pro.state == 'complaining') {
          res.data.pro.ycData.expected_jtime = bm.formatDate(res.data.pro.ycData.expected_jtime)
        } else if (res.data.pro.state == 'firing') {
          res.data.pro.ycData.expected_optime = bm.formatDate(res.data.pro.ycData.expected_optime)
        }
        that.setData({ userInfo: res.data.seller, proInfo: res.data.pro, memberInfo: res.data.member })
      } else {
        wx.showToast({
          title: res.data.errmsg,
          icon: 'none',
          success:function(){
            setTimeout(function(){
            wx.switchTab({
              url: '/pages/worker/list',
            })
            },1000)
          }
        })
      }
    })
    bm.requsetData('/w/project/work/list', 'get', { pid: that.data.pid,limit:10}, function (res) {
      if (!res.data.errcode) {
        for (var i in res.data.list) {
          res.data.list[i].ctime = bm.formatDate(res.data.list[i].ctime)
        }
        that.setData({ workRecord: res.data.list})
      } else {
        wx.showToast({
          title: res.data.errmsg,
          icon: 'none'
        })
      }
    })
  },
  //获取项目
  getProLog: function () {
    var that = this;
    bm.requsetData("/w/project/event/list", "get", { id: that.data.pid, limit: 20 }, function (res) {
      if (!res.data.errcode) {
        for (var i in res.data.list) {
          res.data.list[i].ctime = bm.formatDate(res.data.list[i].ctime)
          res.data.list[i].checked = false
        }
        that.setData({ proLogList: res.data.list })
      } else {
        wx.showToast({
          title: res.data.errmsg,
          icon: "none"
        })
      }
    })
  },
  showDetail: function (e) {
    var that = this;
    var _idx = e.currentTarget.dataset.index;
    that.data.proLogList[_idx].checked = !that.data.proLogList[_idx].checked;
    that.setData({ proLogList: that.data.proLogList })
  },
  //同意接单
  acceptOrder:function(){
    var that=this;
    wx.showModal({
      title: '是否同意接受该订单',
      content: '',
      showCancel: true,
      cancelText: '考虑一下',
      confirmText: '确定',
      success: function (res) {
        if (res.confirm) {
          bm.requsetData("/w/project/accept", "post", { id: that.data.pid }, function (res) {
            if(!res.data.errcode){
              wx.showToast({
                title: '入职成功',
                success:function(){
                  that.getInfo();
                }
              })
            }else{
              if (res.data.errcode == 11303) {
                wx.showModal({
                  content: '非会员同时只能被1位雇主雇佣，开通会员提升上限。立即开通',
                  success: function (res) {
                    if (res.confirm) {
                      wx.navigateTo({
                        url: '/pages/openvip/vipExplain',
                      })
                    } else if (res.cancel) {
                      console.log('用户点击取消')
                    }
                  }
                })
              }else{
                wx.showToast({
                  title: res.data.errmsg,
                  icon: 'none'
                })
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //拒绝接单
  refuseOrder:function(){
    var that=this;
    wx.showModal({
      title: '是否拒绝接受该订单',
      content: '',
      showCancel: true,
      cancelText: '考虑一下',
      confirmText: '确定',
      success: function (res) {
        if (res.confirm) {
          bm.requsetData("/w/project/refuse", "post", { id: that.data.pid }, function (res) {
            if (!res.data.errcode) {
              wx.showToast({
                title: '你已拒绝入职，请跟雇主联系。',
                success: function () {
                  setTimeout(function(){
                    wx.navigateBack()
                  },1000)
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
  //同意续签
  acceptRenew: function () {
    var that = this;
    wx.showModal({
      title: '是否同意接受该续签',
      content: '',
      showCancel: true,
      cancelText: '考虑一下',
      confirmText: '确定',
      success: function (res) {
        if (res.confirm) {
          bm.requsetData("/w/project/renew/agree", "post", { id: that.data.proInfo.ycData.id }, function (res) {
            if (!res.data.errcode) {
              wx.showToast({
                title: '续签成功',
                success: function () {
                  setTimeout(function () {
                    wx.navigateBack()
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
  //拒绝续签
  refuseRenew: function () {
    var that = this;
    wx.showModal({
      title: '是否拒绝接受该续签',
      content: '',
      showCancel: true,
      cancelText: '考虑一下',
      confirmText: '确定',
      success: function (res) {
        if (res.confirm) {
          bm.requsetData("/w/project/renew/refuse", "post", { id: that.data.proInfo.ycData.id }, function (res) {
            if (!res.data.errcode) {
              wx.showToast({
                title: '拒绝成功',
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
  acceptFire: function () {
    var that = this;
    var proInfo = that.data.proInfo 
    wx.showModal({
      title: '是否同意接受解雇',
      content: '同意解雇后雇主将支付' + proInfo.ycData.wages + '元，退还' + proInfo.ycData.refund+'元',
      showCancel: true,
      cancelText: '考虑一下',
      confirmText: '同意解雇',
      success: function (res) {
        if (res.confirm) {
          bm.requsetData("/w/project/fire/agree", "post", { pid: that.data.pid }, function (res) {
            if (!res.data.errcode) {
              wx.showToast({
                title: '提交成功',
                success: function () {
                  setTimeout(function(){
                    wx.redirectTo({
                      url: '/olwork/onlineList',
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
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({ pid:options.id});
  },
  onShow:function(){
    if (app.globalData.auth!=null) {
      this.getInfo();
      this.getProLog();
    } else {
      app.authCallback = auth => {
        this.getInfo();
        this.getProLog();
      }
    }
  },
  //图片预览
  imgYu: function (event) {
    var src =  event.currentTarget.dataset.src;//获取data-src
    var imgList = event.currentTarget.dataset.list;//获取data-list
    var list = []
    for (var i in imgList) {
      var url =  imgList[i]
      list.push(url)
    }
    bm.imgYu(src, list)
  }
})