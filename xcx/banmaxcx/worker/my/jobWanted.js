// pages/worker/job_wanted/job_wanted.js
const bm = require('../../utils/common.js')
var app = getApp()
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
const Page = require('../../utils/ald-stat.js').Page;
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cityData:null,  //城市
    jobData: {jobId:0},   //职位
    sex:["男","女"],
    sexIndex:0,  //性别
    birthday: "1990-01",  //出生年化月
    indusnum:0,    //选中行业数
    indusData:[],  //选中数据
    price:'',      //薪资要求
    select_list:null,
    fwData: '',
    fw_num: 0,
    latitude: '', 
    longitude: '',
    //期望职位列表
    dream_list:[]
  },
  bindAccountChange: function(e) {
    this.setData({
        sexIndex: e.detail.value
    })
  },
  bindDateChange: function (e) {
    this.setData({
      birthday: e.detail.value
    })
  },
  fillPrice:function(e){
    this.setData({price:e.detail.value})
  },
  formSubmit:function(e){
    var that=this;
    var dream_list = that.data.dream_list
    if (dream_list.length == 0){
      wx.showToast({
        title: '请填写期望职位',
        icon:'none'
      })
      return false
    }
    var fwID = []
    var fwData = that.data.fwData.data
    for (var key in fwData) {
      fwID.push(fwData[key].id)
    }
    bm.requsetData('/w/user/job/intention', 'post', {service_tag: fwID},function(res){
      if(!res.data.errcode){
        wx.reLaunch({
          url: '/pages/worker/list',
        })
      }else{
        wx.showToast({
          title: res.data.errmsg,
          icon: 'none'
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    qqmapsdk = new QQMapWX({
      key: '7WUBZ-6XNCG-RD7QM-I6DB4-U7UGS-WUFGB'
    })
    wx.getLocation({
      success: function (res) {
        that.setData({ latitude: res.latitude, longitude: res.longitude })
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: that.data.latitude,
            longitude: that.data.longitude
          },
          success: function (res) {
            var _cityid = (res.result.ad_info.adcode).toString();
            var _cityName = res.result.ad_info.city;
            _cityid = _cityid.substring(0, 5) + "0";
            that.setData({ cityData: { id: _cityid, cityName: _cityName }})
            app.globalData.location = { cityid: _cityid, cityName: _cityName };
          },
          fail: function (res) {
            console.log(res);
          }
        })
      },
    })
    
  },
  //行业选择
  selecthy: function (e) {
    var that = this
    var indata = that.data.select_list
    var hy = JSON.stringify(indata)
    wx.navigateTo({
      url: '/pages/picker/indusPicker?hy=' + hy,
    })
  },
  //选择服务标签
  bindfw: function () {
    var that = this
    if (that.data.fwData) {
      var fw = JSON.stringify(that.data.fwData.data)
      wx.navigateTo({
        url: '/pages/picker/fwPicker?fw=' + fw + '&fw_type=0',
      })
    } else {
      wx.navigateTo({
        url: '/pages/picker/fwPicker?fw_type=0',
      })
    }
  },
  onShow: function () { 
    var that = this
    if (that.data.fwData) {
      that.setData({
        fw_num: that.data.fwData.data.length
      })
    }
    //期望职位列表
    bm.requsetData('/w/user/dream_list', 'get', '', function (res) {
      var da = res.data
      console.log(da)
      if (da.list){
        that.setData({
          dream_list: da.list,
        })
      }
      
    })
  }
})