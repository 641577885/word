// pages/business/list/resume.js
var bm = require('../utils/common.js');
var webim = require('../utils/webim.js');
var webimhandler = require('../utils/webim_handler.js');
var app=getApp();
const ctx = wx.createCanvasContext('shareCanvas')
const Page = require('../utils/ald-stat.js').Page;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showBox:false,
    uid:Number,
    showVideo:false,  //显示视频
    isShowDialog:true,
    userInfo:{},      //用户信息
    expInfo:[],        //项目经理 
    workInfo:[],     //工作经理
    eduInfo:[],      //教育经理
    dreamInfo:{},     //期望指望
    resumeInfo:{},
    markInfo:{},
    ischeck:true,
    //底部弹出框
    actionSheetHidden: true,
    actionSheetItems: [
      { bindtap: 'Menu1', txt: '生成朋友圈分享图' },
      { bindtap: 'Menu2', txt: '转发给好友或群聊' },
    ],
    menu: '',
    videoshow:true,
    lx_flag:true,
    //返回首页按钮
    navtype:1
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
    bm.requsetData('/c/action/getShareKey', 'post', { scence: 'resume', obj_id:uid}, function (data) {
      console.log(data)
    })
    wx.navigateTo({
      url: '/pages/share/shareresume?uid='+uid,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
    
  },
  //点击视频播放
  playvideo:function(){
    if (this.data.resumeInfo.video==""){
      wx.showToast({
        title: "当前创客没有上传视频文件",
        icon: 'none'
      })
      return false;
    }
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
  checkContact:function(){
    var that=this;
    if (that.data.lx_flag){
      that.setData({ lx_flag:false})
    }
    bm.requsetData("/b/seller/contact","post",'',function(res){
        if(!res.data.errcode){
          that.applyAddFriend();
        }else{
          wx.showToast({
            title: res.data.errmsg,
            icon:'none'
          })
        }
    })
  },
  applyAddFriend:function () {
    var that=this;
    var add_friend_item = [
      {
        'To_Account': (that.data.uid).toString(),  //用户Id
        "AddSource": "AddSource_Type_Unknow",
        "AddWording": "" //加好友附言，可为空
      }
    ];
    var options = {
      'From_Account': (app.globalData.loginInfo.identifier).toString(),
      'AddFriendItem': add_friend_item
    };
    app.getAllFriend();
    webim.applyAddFriend(
      options,
      function (resp) {
        that.sendChatInfo();
        wx.navigateTo({
          url: '/message/dialog?skipid=' + that.data.uid,
          success: function () {
            that.setData({ lx_flag: true })
          }
        })
      },
      function (err) {
        if (err.ErrorInfo.indexOf('SNS_FRD_ADD_FRD_EXIST')){
          wx.navigateTo({
            url: '/message/dialog?skipid=' + that.data.uid,
            success: function () {
              that.setData({ lx_flag: true })
            }
          })
        }else{
          console.warn(err);
        }
      }
    );
  },
  sendChatInfo: function () {
    var that = this;
    bm.requsetData("/c/action/sendChatInfo", "post", { to_uid: that.data.uid, obj_id: 0, type: "default" }, function (res) {
      if (!res.data.errcode) {

      } else {
        wx.showToast({
          title: res.data.errmsg,
          icon: "none"
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
    wx.showLoading({
      title: '加载中',
    })
    bm.requsetData('/c/worker/resume', 'get', { uid: that.data.uid}, function (res) {
      console.log(res)
      if (!res.data.errcode) {
        that.setData({ userInfo: res.data.user, dreamInfo: res.data.dream_poslist, resumeInfo: res.data.resume, markInfo: res.data.mark,showBox:true})
        wx.setNavigationBarTitle({
          title: res.data.user.name +"的远程简历",
        })
        if(res.data.resume.video.length == 0){
          that.setData({
            videoshow:false
          })
        }else{
          that.setData({
            videoshow: true
          })
        }
        wx.hideLoading();
      }
    },true)
    bm.requsetData('/c/worker/explist', 'get', { uid: that.data.uid }, function (res) {
      if (!res.data.errcode) {
        var data = res.data;
    console.log("a",data)
        for (let i = 0; i < data.worklist.length; i++) {
          data.worklist[i]["stime"] = bm.formatMonth(data.worklist[i]["stime"])
          if (data.worklist[i]["etime"]=='1'){
            data.worklist[i]["etime"] ='至今'
          }else{
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
    }, true)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    if (options.navtype){
      that.setData({
        navtype:0
      })
    }
    if (options.scene) {
      var scene = bm.GetParameter(decodeURIComponent(options.scene));
      that.setData({ uid: scene.uid })
    } else {
      that.setData({ uid: options.uid })
    }
    if (app.globalData.auth!=null){
      if (app.globalData.auth == 0) {
        that.setData({
          isShowDialog: false
        })
      }
      that.getInfo();
    }else{
      app.authCallback = auth => {
        if (auth == 0) {
          that.setData({
            isShowDialog: false
          })
        }
        that.getInfo();
      }
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (ops) {
    var that = this
    that.actionSheetbindchange()
    bm.requsetData('/c/action/getShareKey', 'post', { scence: 'resume', obj_id: that.data.uid }, function (data) {
      console.log(data)
    })
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      title: that.data.userInfo.name + '的远程简历',
      path: '/resume/resume?uid=' + this.data.uid,
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

})