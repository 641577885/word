const bm = require('../utils/common.js')
const aliUploader = require("../utils/oss/uploadAliyun.js");
const Page = require('../utils/ald-stat.js').Page;
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pid:Number,
    num:0,
    content:'',
    srcList:[],
  },
  fillContent:function(e){
    this.setData({
      content:e.detail.value,
      num:e.detail.cursor
    })
  },
  uploadImg:function(){
    var that =this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        let tempFilePaths = res.tempFilePaths[0];
        let date = new Date();
        let array = that.data.srcList;
        let dir = 'workRecord/' + app.globalData.uid;
        aliUploader(tempFilePaths, dir, date.getTime(),
          function () {
            array.push('https://bm.jiangcdn.com/' + dir +'/'+  date.getTime() + '.' + tempFilePaths.split(".").pop());
            that.setData({
              srcList: array
            })
          }, function (res) {
            common.msg("图片添加失败")
          });
      }
    })
  },
  comfirmnext:function(){
    var that=this;
    if(!that.data.content){
      wx.showToast({
        title: "请添加工作汇报内容",
        icon:'none'
      })
      return false;
    }
    bm.requsetData("/w/project/work/create", 'post', { pid:that.data.pid,content: that.data.content,srcList: that.data.srcList},function(res){
      if(!res.data.errcode){
        wx.showToast({
          title: '工作汇报提交成功',
          icon:'none',
          success:function(){
            setTimeout(function(){wx.navigateBack()},1000)
          }
        })
      }else{
        wx.showToast({
          title: res.data.errmsg,
          icon:'none'
        })
      }
    })
  },
  onLoad:function(options){
    this.setData({ pid:options.pid})
  }
})