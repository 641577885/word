// auth/autherr.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type_show:0,
    title:'',
    link_type:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var errtype = options.errtype
    var errcode = options.errcode
    if(errtype==1){
      that.setData({
        type_show:0,
        title: that.code(errcode)
      })
    }
    if (errtype == 2) {
      that.setData({
        type_show: 1
      })
    }
  },
  auth_again:function(){
    var that = this
    var link_type = that.data.link_type
    console.log(link_type)
    if (link_type==1){
      wx.redirectTo({
        url: '/auth/authinfo',
      })
    }
    if (link_type == 2) {
      wx.redirectTo({
        url: '/auth/camera',
      })
    }
  },
  code:function(errcode){
    var that = this
    var content
    if (errcode == 3 || errcode == 4 || errcode == 5 || errcode == 6 || errcode == 9 || errcode == 10 || errcode == 11 || errcode == 12 || errcode == 13 || errcode == 14 || errcode == 15 || errcode == 16 || errcode == 21 || errcode == 23 || errcode == 24 || errcode == 107 || errcode == 108 || errcode == 213){
      content = '服务器繁忙，请稍后重试'
      that.setData({
        link_type:1
      })
    }
    else if (errcode == -4006 || errcode == -4007 || errcode == -4009 || errcode == -4010 || errcode == -4011 || errcode == -4012 || errcode == -4015 || errcode == -4016 || errcode == -4017 || errcode == -4018 ) {
      content = '识别人物与身份证不符'
      that.setData({
        link_type: 1
      })
    }
    else if (errcode == -5001){
      content = '视频无效，上传文件不符合视频要求'
      that.setData({
        link_type: 2
      })
    }
    else if (errcode == -5002) {
      content = '唇语失败'
      that.setData({
        link_type: 2
      })
    }
    else if (errcode == -5005) {
      content = '面部有遮挡认证失败，请重新验证'
      that.setData({
        link_type: 2
      })
    }
    else if (errcode == -5007) {
      content = '视频没有声音'
      that.setData({
        link_type: 2
      })
    }
    else if (errcode == -5008) {
      content = '验证码错误，请重新验证'
      that.setData({
        link_type: 2
      })
    }
    else if (errcode == -5009) {
      content = '面部有遮挡认证失败，请重新验证'
      that.setData({
        link_type: 2
      })
    }
    else if (errcode == -5010) {
      content = '唇动检测失败，嘴巴未张开或者张开幅度小'
      that.setData({
        link_type: 2
      })
    }
    else if (errcode == -5011) {
      content = '视频检测失败，请重新验证'
      that.setData({
        link_type: 2
      })
    }
    else if (errcode == -5012) {
      content = '请换一个周围噪音较低的环境重新验证'
      that.setData({
        link_type: 2
      })
    }
    else if (errcode == -5013) {
      content = '声音太小无法识别，请重新验证'
      that.setData({
        link_type: 2
      })
    }
    else if (errcode == -5014) {
      content = '视频检测失败，请重新验证'
      that.setData({
        link_type: 2
      })
    }
    else if (errcode == -5015) {
      content = '视频检测失败，请重新验证'
      that.setData({
        link_type: 2
      })
    }
    else if (errcode == -5016) {
      content = '请确保你不是机器人，重新验证'
      that.setData({
        link_type: 2
      })
    }
    else if (errcode == -5801) {
      content = '请求缺少身份证号码或身份证姓名'
      that.setData({
        link_type: 1
      })
    }
    else if (errcode == -5802) {
      content = '服务器内部错误，服务暂时不可用'
      that.setData({
        link_type: 1
      })
    }
    else if (errcode == -5803) {
      content = '身份证姓名与身份证号码不一致'
      that.setData({
        link_type: 1
      })
    }
    else if (errcode == -5804) {
      content = '身份证号码无效'
      that.setData({
        link_type: 1
      })
    }
    else if (errcode == -5805) {
      content = '用户未输入图像或者 url 下载失败'
      that.setData({
        link_type: 1
      })
    }else{
      content = '认证出错，请检查身份信息后重试！'
      that.setData({
        link_type: 1
      })
    }
    console.log(content)
    return content
  }
})