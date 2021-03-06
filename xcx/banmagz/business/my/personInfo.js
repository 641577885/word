// pages/business/my/personInfo.js
const app = getApp();
const bm = require('../../utils/common.js')
const aliUploader = require("../../utils/oss/uploadAliyun.js");
const webim = require('../../utils/webim.js');
const Page = require('../../utils/ald-stat.js').Page;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatar:'',
    upavatar:'',
    name:'',
    wx_code:'',
    mail:'',
    company:'',
    job:'',
    uptime:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var date = new Date();
    bm.requsetData('/b/seller/index', 'post', '', function (data) {
      if (data.data.sell_info.avatar != "https://bm.jiangcdn.com/banma/avatar.jpg" && data.data.sell_info.avatar.indexOf("https://wx.qlogo.cn") == -1) {
        data.data.sell_info.avatar = data.data.sell_info.avatar
      }
      that.setData({
        avatar: data.data.sell_info.avatar,
        upavatar: data.data.sell_info.avatar,
        name: data.data.sell_info.name,
        wx_code: data.data.sell_info.wx,
        mail: data.data.sell_info.email,
        company: data.data.sell_info.company_name,
        job: data.data.sell_info.position,
        uptime: date.getTime()
      })
    })
  },
  //上传头像
  upavatar:function(){
    var that = this
    wx.chooseImage({
      count:1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        let tempFilePaths = res.tempFilePaths[0];
        let date = new Date();
        let uid = app.globalData.uid.toString();
        let dir = 'avatar/' + uid;
        var uptime = that.data.uptime
        aliUploader(tempFilePaths, dir, uptime,
          function () {
            that.setData({
              avatar: 'https://bm.jiangcdn.com/' + dir + '/' + uptime + '.' + tempFilePaths.split(".").pop()+"?"+date.getTime(),
              upavatar: 'https://bm.jiangcdn.com/' + dir + '/' + uptime + '.' + tempFilePaths.split(".").pop()
            })
            app.globalData.userinfo.avatar = 'https://bm.jiangcdn.com/' + dir + '/' + uptime + '.' + tempFilePaths.split(".").pop();
          }, function (res) {
            wx.showToast({
              title: '图片添加失败，请重试',
            })
          });
      },
    })
  },
  
  //提交
  submitinfo:function(e){
    var that = this
    var name = e.detail.value.name
    var wx_code = e.detail.value.wx_code
    var mail = e.detail.value.mail
    var company = e.detail.value.company
    var job = e.detail.value.job
    var avatar = that.data.upavatar
    var query = { email: mail, name: name, avatar: avatar, wx: wx_code, position: job }
    if(name.length == 0){
      wx.showToast({
        title: '请填写姓名',
        icon:'none'
      })
      return false
    }
    
    bm.requsetData('/b/seller/update','post',query, function (data)  {
      if(data.data.errcode == 0){
        wx.showToast({
          title: '保存成功',
          icon: 'sueecss',
          duration: 2000,
          success: function () {
            app.setwebIMNick(name);
            app.globalData.selfHeadUrl = avatar;
            app.setwebIMAvatar(avatar);
            setTimeout(function () {
              wx.navigateBack()
            }, 2000)
          }
        })
      }else{
        wx.showToast({
          title: data.data.errmsg
        })
      }
    })
  },
})