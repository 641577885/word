// pages/business/list/resume.js
var bm = require('../utils/common.js');
var webim = require('../utils/webim.js');
var webimhandler = require('../utils/webim_handler.js');
const Page = require('../utils/ald-stat.js').Page;
var app=getApp();
const ctx = wx.createCanvasContext('shareCanvas')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    selfid:"",
    uid:null,
    showVideo:false,  //显示视频
    userInfo:{},      //用户信息
    expInfo:{},        //项目经理 
    workInfo:{},     //工作经理
    eduInfo:{},      //教育经理
    dreamInfo:{},     //期望指望
    resumeInfo:{},
    markInfo:{},
    ischeck:true,
    preview:"",
    //底部弹出框
    actionSheetHidden: true,
    actionSheetItems: [
      { bindtap: 'Menu1', txt: '生成朋友圈分享图' },
      { bindtap: 'Menu2', txt: '转发给好友或群聊' },
    ],
    menu: '',
    //分享按钮
    share_btn:true,
    //组件简历百分比
    fastResume_rate: 0,
    fastResumeshow: 0,
    rest: 0,
    fast_step: [],
    fastResume_text: true,
    stype:true,
    videoshow:true,
    //返回首页按钮
    navtype:0
  },
  //底部弹出框
  actionSheetTap: function () {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  actionSheetbindchange: function () {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  bindMenu1: function () {
    this.setData({
      menu: 1,
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  bindMenu2: function () {
    this.setData({
      menu: 2,
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  goimg:function(){
    var that = this
    var uid = that.data.uid
    this.actionSheetbindchange()
    wx.navigateTo({
      url: '/pages/share/shareresume?uid=' + uid,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //点击视频播放
  playvideo:function(){
    this.setData({
      showVideo:true
    })
  },
  //关闭视频播放
  closevideo: function () {
    this.setData({
      showVideo: false
    })
  },
  //点赞
  clickZan:function(){
    bm.requsetData('','post','',function(data){
      if (data.errcode){
        wx.showToast({
          title: '点赞成功',
          icon: 'none'
        })
      }else{
        wx.showToast({
          title: data.errmsg,
          icon:'none'
        })
      }
    })
  },
  bgCheck:function(){
    var that=this;
    if (!that.data.ischeck){

    }else{
      wx.navigateTo({
        url: '/resume/gyResume?uid='+that.data.uid,
      })
    }
  },
  getInfo:function(){
    var that=this;
    
    if (that.data.preview == 1) {
      var query = { uid: that.data.uid, preview: 1 }
    } else {
      var query = { uid: that.data.uid }
    }
    bm.requsetData('/c/worker/resume', 'get', query, function (res) {
      
      if (!res.data.errcode) {
        if (that.data.selfid != that.data.uid) {
          that.setData({
            navtype: 1
          })
        }
        if (res.data.resume.is_release == 1) {
          that.setData({
            share_btn: true
          })
        } else {
          that.setData({
            share_btn: false
          })
        }
        if (res.data.resume.video.length == 0) {
          that.setData({
            videoshow: false
          })
        }
        that.setData({ userInfo: res.data.user, dreamInfo: res.data.dream_poslist, resumeInfo: res.data.resume, markInfo: res.data.mark})
      }else{
        wx.showToast({
          title: res.data.errmsg,
          icon:'none'
        })
      }
      
    })
    bm.requsetData('/c/worker/explist', 'get', {uid: that.data.uid}, function (res) {
      if (!res.data.errcode) {
        var data = res.data;
        for (let i = 0; i < data.worklist.length; i++) {
          data.worklist[i]["stime"] = bm.formatMonth(data.worklist[i]["stime"])
          if (data.worklist[i]["etime"]==1){
            data.worklist[i]["etime"] = "至今"
          } else {
            data.worklist[i]["etime"] = bm.formatMonth(data.worklist[i]["etime"])
          }
        }
        for (let i = 0; i < data.prolist.length; i++) {
          data.prolist[i]["stime"] = bm.formatMonth(data.prolist[i]["stime"])
          data.prolist[i]["etime"] = bm.formatMonth(data.prolist[i]["etime"])
        }
        for (let i = 0; i < data.edulist.length; i++) {
          data.edulist[i]["stime"] = bm.formatMonth(data.edulist[i]["stime"])
          data.edulist[i]["etime"] = bm.formatMonth(data.edulist[i]["etime"])
        }
        that.setData({ eduInfo: data.edulist, workInfo: data.worklist, expInfo: data.prolist })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.setData({ uid: options.uid})
    if (options.stype){
      that.setData({ stype: false })
    }
    if(options.preview){
      that.setData({ preview: options.preview })
    }
    if (app.globalData.auth!=null){
      that.getInfo();
      that.setData({selfid: app.globalData.uid})
      if (app.globalData.auth!=0){
        that.checkState();
      }
    }else{
      app.authCallback = auth => {
        that.getInfo();
        that.setData({ selfid: app.globalData.uid })
        if (auth != 0) {
          that.checkState();
        }
      }
    }
  },
  checkState:function(){
    var that=this;
    bm.requsetData("/w/resume/fill_state", "post", '', function (data) {
      if (data.data.resume_status.is_perft == 0) {
        that.setData({
          fastResumeshow: 0,
          fastResume_rate: parseInt(data.data.resume_status.score),
          rest: data.data.resume_status.rest,
          fast_step: data.data.resume_status.fast_step
        })
      } else {
        that.setData({
          fastResumeshow: 1
        })
      }
    })
  },
  checkContact:function(){
    wx.showModal({
      title: '提示',
      content: '仅为预览，无法联系/雇佣',
      showCancel:false,
    })
  },
  checkContact02: function () {
    wx.showModal({
      title: '提示',
      content: '仅为预览，无法联系/雇佣',
      showCancel: false,
    })
  },
  onShareAppMessage: function (ops) {
    var that = this
    that.actionSheetbindchange()
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      title: that.data.userInfo.name + '的远程工作简历',
      path: '/resume/resume?uid=' + this.data.uid+'&stype=true',
      success: function (res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  },
  gonext: function () {
    var that = this
    var fastResumeshow = that.data.fastResumeshow
    if (fastResumeshow==0) {
      var fast_step = that.data.fast_step
      if (fast_step.person_info == 0) {
        wx.redirectTo({
          url: '/worker/my/workinfo?fill_type=show',
        })
      } else {
        if (fast_step.advantage == 0) {
          wx.redirectTo({
            url: '/worker/my/myFill?type=advantage&fill_type=show',
          })
        } else {
          if (fast_step.work_exp == 0) {
            wx.redirectTo({
              url: '/worker/my/workExper?type=1&fill_type=show&id=',
            })
          } else {
            if (fast_step.project_exp == 0) {
              wx.redirectTo({
                url: '/worker/my/projectExper?type=1&fill_type=show&id=',
              })
            }
          }
        }
      }



    }
  },
  openvip:function(){
    wx.navigateTo({
      url: '/pages/openvip/openvip',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  }
})