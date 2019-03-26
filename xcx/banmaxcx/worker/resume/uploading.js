// pages/worker/resume/uploading.js
const bm = require('../../utils/common.js')
const aliUploader = require("../../utils/oss/uploadAliyun.js");
const Page = require('../../utils/ald-stat.js').Page;
const app=getApp();
Page({
  data: {
    style:'style'
  },
  /**
   * 页面的初始数据
   */
  uploadFile: function () {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        let tempFilePaths = res.tempFilePaths[0];
        let date = new Date();
        var dir = 'resumeFile/' + app.globalData.uid;
        aliUploader(tempFilePaths, dir, date.getTime(),
          function () {
            var imgurl = 'https://bm.jiangcdn.com/' + dir + '/' + date.getTime() + '.' + tempFilePaths.split(".").pop();
            var asd = JSON.stringify(imgurl);
            asd = asd.substr(asd.length - 4, 3);
            console.log(asd)
            bm.requsetData('/w/resume/annex', 'post', { annex: imgurl }, function (data) {
              console.log(data)
              if (data.data.errcode == 0) {
                wx.showToast({
                  title: data.data.errmsg,
                })
                setTimeout(function () {
                  wx.navigateTo({
                    url: '/worker/resume/resumeAccessory?style=' + asd,
                  })
                }, 1500)
              } else {
                wx.showToast({
                  title: data.data.errmsg,
                  icon: 'none'
                })
              }
            })
            
          }, function (res) {
            wx.showToast({
              title: '图片添加失败',
              icon:'none'
            })
          });
      }
    })
  },
  onLoad: function (options) {}
})