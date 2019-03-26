// pages/picker/cityPicker.js
var bm = require('../../utils/common.js')
const Page = require('../../utils/ald-stat.js').Page;
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotCityList: [],
    CityList: [],
    cityData: null,
    toView: 'top',
    letterList: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'W', 'X', 'Y', 'Z'],
    latitude: '',
    longitude: '',
    location: {}
  },
  checkCity: function (e) {
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    this.data.cityData = { id: e.target.dataset.id, cityName: e.target.dataset.cityname };
    prevPage.setData({
      cityData: this.data.cityData
    })
    wx.navigateBack()
  },
  checkLocation: function () {
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    this.data.cityData = { id: this.data.location.cityid, cityName: this.data.location.cityName };
    prevPage.setData({
      cityData: this.data.cityData
    })
    wx.navigateBack()
  },
  scrollToView: function (e) {
    this.setData({ toView: 'view' + e.target.dataset.view })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    qqmapsdk = new QQMapWX({
      key: '7WUBZ-6XNCG-RD7QM-I6DB4-U7UGS-WUFGB'
    })
    bm.requsetData('/c/config/city', 'get', '', function (res) {
      that.setData({ CityList: res.data })
    }, true);
    wx.getLocation({
      success: function (res) {
        that.setData({ latitude: res.latitude, longitude: res.longitude })
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: that.data.latitude,
            longitude: that.data.longitude
          },
          success: function (res) {
            console.log(res);
            var _cityid = (res.result.ad_info.adcode).toString();
            var _cityName = res.result.ad_info.city;
            _cityid = _cityid.substring(0, 5) + "0";
            that.setData({ location: { cityid: _cityid, cityName: _cityName } })
          },
          fail: function (res) {
            console.log(res);
          }
        })
      },
    })

  },
})