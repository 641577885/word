// pages/business/auth/busAuth.js
var app = getApp();
var bm = require('../../utils/common.js')
const aliUploader = require("../../utils/oss/uploadAliyun.js");
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
const Page = require('../../utils/ald-stat.js').Page;
var qqmapsdk;
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    show:false,
    yl_img:'',
    company_name:'',
    validity:'',
    _type:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    qqmapsdk = new QQMapWX({
      key: '7WUBZ-6XNCG-RD7QM-I6DB4-U7UGS-WUFGB'
    });
    if (options.type){
      this.setData({ _type: options.type })
    }
  },
  //上传图片
  upimg:function(){
    var that = this
    wx.chooseImage({
      count:1,
      success: function(res) {
        wx.showLoading({
          title: '图片识别中',
        })
        let tempFilePaths = res.tempFilePaths[0];
        let date = new Date();
        let dir = 'busauth/' + app.globalData.uid;
        aliUploader(tempFilePaths, dir, date.getTime(),
          function () {
            var img_path = 'https://bm.jiangcdn.com/' + dir + '/' + date.getTime() + '.' + tempFilePaths.split(".").pop()
            bm.requsetData('/b/seller/check_auth', 'post', { file_path: img_path, scene:1 }, function (data) {
              if (data.data.errcode == 0){
                wx.hideLoading()
                that.setData({
                  show:true,
                  company_name: data.data.comp_info.name,
                  validity: data.data.comp_info.valid_period,
                  yl_img: img_path +"@!235*140",
                })
                //判断前四位年限是否为2999如果是，则手动更改为长期
                var year = that.data.validity.substring(0,4)
                
                if (year==2999){
                    that.setData({
                      validity:'长期'
                    })
                }
              }else{
                wx.hideLoading()
                wx.showToast({
                  title: data.data.errmsg,
                  icon:'none'
                })
              }
            })
          }, function (res) {
            wx.hideLoading()
            wx.showToast({
              title: '图片添加失败',
            })
          });
      },
    })
  }, 
  searchAddress: function (e) {
    var that = this;
    var key = e.detail.value;
    that.setData({ address:key,addressInput: key })
    qqmapsdk.getSuggestion({
      keyword: key,
      region_fix: "0",
      success: function (res) {
        if (res.data.length > 0) {
          that.setData({ searchList: res.data, showList: true })
        }
      },
      fail: function (res) {
        console.log(res);
      }
    })
  },
  checkAddress: function (e) {
    var that = this;
    var _index = e.currentTarget.dataset.index;
    var checkList = that.data.searchList[_index];
    var _cityid = checkList.adcode.toString().substring(0, 5) + "0";
    console.log(checkList)
    that.setData({ addressInput: checkList.title, cityId: _cityid, address: checkList.address + checkList.title, showList: false })
  },
  nameinput:function(e){
    this.setData({
      company_name: e.detail.value
    }) 
  },
  timeinput: function (e) {
    this.setData({
      validity: e.detail.value
    })
  },
  submit:function(){
    var that = this
    var file_path = that.data.yl_img
    var auth_name = that.data.company_name
    var end_time = that.data.validity
    var address = that.data.address
    var city = that.data.cityId
    console.log(that.data)
    if (file_path.length == 0){
      wx.showToast({
        title: '请上传营业执照',
        icon:'none'
      })
      return false
    }
    bm.requsetData('/b/seller/auth', 'post', { file_path: file_path, auth_name: auth_name, scene: 1, end_time: end_time, address: address,city:city}, function (data) {
      if(data.data.errcode == 0){
        wx.showToast({
          title: data.data.errmsg,
        })
        if(that.data._type){
          setTimeout(function () {
            wx.navigateBack()
            app.globalData.certified=1;
          }, 1000)
        }else{
          setTimeout(function () {
            wx.navigateBack({
              delta: 2,
            })
          }, 1000)
        }
        
      }else{
        wx.showToast({
          title: data.data.errmsg,
          icon:'none'
        })
      }
    })
  }
  
})