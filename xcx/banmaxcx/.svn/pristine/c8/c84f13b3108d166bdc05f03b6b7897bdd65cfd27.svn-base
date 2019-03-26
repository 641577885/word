// pages/worker/my/computerRedact.js
const Page = require('../../utils/ald-stat.js').Page;
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
//粘贴板调取本地权限
  getData:function(){
    wx.setClipboardData({
      data: 'sao.ksanl.com',
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            //console.log(res.data)   //调取成功，打印
          }
        })
      }
    })
  },
//获取本地权限扫描二维码
  getQRcode:function(){
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        //console.log(res)  //成功返回函数
      }
    })
  }
})