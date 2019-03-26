// pages/worker/resume/Email.js
const bm = require('../../utils/common.js')
var app = getApp()
const aliUploader = require("../../utils/oss/uploadAliyun.js");
const Page = require('../../utils/ald-stat.js').Page;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    user_info: {},
    exp_list: [],
    pro_exp: [],
    edu_exp: [],
    homepage: '',
    user:'',
    //组件简历百分比
    fastResume_rate:0,
    fastResumeshow:false,
    rest:0,
    fast_step:[],
    fastResume_text:true
  },
  //上传个人视频
  choosevideo: function() {
    var that = this
    wx.chooseVideo({
      success: function(res) {
        wx.showLoading({
          title: '视频上传中',
        })
        let tempFilePaths = res.tempFilePath;
        let date = new Date();
        let dir = 'myvideo/' + app.globalData.uid;
        aliUploader(tempFilePaths, dir, date.getTime(),
          function() {
            var myvideo = 'https://bm.jiangcdn.com/' + dir + '/' + date.getTime() + '.' + tempFilePaths.split(".").pop()
            bm.requsetData('/w/resume/video', 'post', {
              mvurl: myvideo
            }, function(data) {
              if (data.data.errcode == 0) {
                wx.hideLoading()
                wx.showToast({
                  title: data.data.errmsg,
                })
              } else {
                wx.showToast({
                  title: data.data.errmsg,
                  icon: 'none'
                })
              }
            })
          },
          function(res) {
            wx.showToast({
              title: '视频上传失败',
              icon: 'none'
            })

          });
        var myvideo = that.data.myvideo
      }
    })

  },
  onShow: function(options) {
    var that = this;
    bm.requsetData("/w/resume/index", "get", '', function(res) {
      if (res.data.user_info.avatar.indexOf("//wx.qlogo.cn") == -1 && res.data.user_info!= "https://bm.jiangcdn.com/banma/avatar.jpg") {
        res.data.user_info.avatar = res.data.user_info.avatar + "@!200"
      }
      that.setData({
        user_info: res.data.user_info,
        exp_list: res.data.exp_list,
        pro_exp: res.data.pro_exp,
        edu_exp: res.data.edu_exp
      })
    })
    bm.requsetData("/w/user/center", "post", '', function (data) {
      that.setData({
        user: data.data.user_info,
      })
    })
    bm.requsetData("/w/resume/fill_state", "post", '', function (data) {
      if (data.data.resume_status.is_perft == 0){
        that.setData({
          fastResumeshow:true,
          fastResume_rate: parseInt(data.data.resume_status.score),
          rest: data.data.resume_status.rest,
          fast_step: data.data.resume_status.fast_step
        })
      }else{
        that.setData({
          fastResumeshow: false
        })
      }
    })
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
        }
      },
      fail:function(){
        wx.navigateTo({
          url: '/worker/my/workinfo',
        })
      }
    })
  },
  bindGetUserInfo: function (e) {
    var that = this;
    var data = e.detail.userInfo || null;
    if (data == null) {
      wx.navigateTo({
        url: '/worker/my/workinfo?isfirst=0',
      })
      return false
    }
    bm.requsetData("/c/login/set_wxinfo", "post", { userinfo: data }, function (res) {
      if (!res.data.errcode) {
        app.globalData.info = data;
        wx.navigateTo({
          url: '/worker/my/workinfo?isfirst=' + res.data.isfirst,
        })
      } else {
        wx.showToast({
          title: res.data.errmsg,
          icon: "none"
        })
      }
    })
  },
  gonext: function () {
    var that = this
    var fastResumeshow = that.data.fastResumeshow
    if (fastResumeshow){
      var fast_step = that.data.fast_step
      if (fast_step.person_info == 0){
        wx.redirectTo({
          url: '/worker/my/workinfo?fill_type=show',
        })
      }else{
        if (fast_step.advantage == 0) {
          wx.redirectTo({
            url: '/worker/my/myFill?type=advantage&fill_type=show',
          })
        }else{
          if (fast_step.work_exp == 0) {
            wx.redirectTo({
              url: '/worker/my/workExper?type=1&fill_type=show&id=',
            })
          }else{
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
  // edit_info:function(){
  //   wx.navigateTo({
  //     url: '/worker/my/workinfo',
  //   })
  // },
})