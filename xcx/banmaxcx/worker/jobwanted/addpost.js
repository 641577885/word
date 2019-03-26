// pages/worker/my/addpost.js
const bm = require('../../utils/common.js')
const Page = require('../../utils/ald-stat.js').Page;
var app = getApp()
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jobData: {
      jobId: null,
      jobName: '',
      jobIdTwo: null
    },
    indusData: [],
    cityData: {
      id: '',
      cityName: ''
    },
    num: 100,
    profession: [],
    price: '',
    industry: [],
    city: '',
    id: '',
    type: '',
    dream_list: [],
    indusnum: 0,
    city_name: '',
    /**行业传递的数据 */
    select_list: null,
    //删除按钮
    del_show: false,
    latitude: '',
    longitude: ''
  },
  getFormId: function(e) {
    var formid = e.detail.formId;
    app.addformId(formid)
  },
  onLoad: function(options) {
    var that = this
    var type = options.type
    if (type == 2) {
      var id = options.id
      var city_name = options.cityName
      that.setData({
        id: id,
        type: type,
        del_show: true
      })
      bm.requsetData('/w/resume/dream_position?scene=detail', 'post', {
        id: id
      }, function(res) {
        var da = res.data.data
        var list = []
        for (var i in da.industry_list) {
          var arr = {
            id: i,
            indusName: da.industry_list[i]
          }
          list.push(arr)
        }
        that.setData({
          jobData: {
            jobId: da.profession,
            jobName: da.profession_name,
            jobIdTwo: null
          },
          indusnum: Object.keys(da.industry_list).length,
          cityData: {
            id: da.city,
            cityName: city_name
          },
          indusData: da.industry_list,
          price: da.price,
          type: 3,
          select_list: list,
        })
      })
    } else {
      that.setData({
        type: type,
      })
    }

    if (!app.globalData.location) {
      qqmapsdk = new QQMapWX({
        key: '7WUBZ-6XNCG-RD7QM-I6DB4-U7UGS-WUFGB'
      })
      wx.getLocation({
        success: function(res) {
          that.setData({
            latitude: res.latitude,
            longitude: res.longitude
          })
          qqmapsdk.reverseGeocoder({
            location: {
              latitude: that.data.latitude,
              longitude: that.data.longitude
            },
            success: function(res) {
              var _cityid = (res.result.ad_info.adcode).toString();
              var _cityName = res.result.ad_info.city;
              _cityid = _cityid.substring(0, 5) + "0";
              that.setData({
                cityData: {
                  id: _cityid,
                  cityName: _cityName
                }
              })
              app.globalData.location = {
                cityid: _cityid,
                cityName: _cityName
              };
            },
            fail: function(res) {
              console.log(res);
            }
          })
        },
      })
    } else {
      that.setData({
        cityData: {
          id: app.globalData.location.cityid,
          cityName: app.globalData.location.cityName
        }
      })
    }

  },
  finishJob: function() {
    var that = this
    var type = that.data.type
    console.log(type)
    var industry_open = [];
    var induname = []
    for (var i in that.data.select_list) {
      industry_open.push(parseInt(that.data.select_list[i].id))
    }
    that.setData({
      industry: industry_open
    })
    if (that.data.jobData.length == 0) {
      wx.showToast({
        title: '请输入职位类型',
        icon: 'none'
      })
      return false;
    }

    if (that.data.indusData.length == 0) {
      wx.showToast({
        title: '请选择公司行业',
        icon: 'none'
      })
      return false;
    }
    if (that.data.cityData.length == 0) {
      wx.showToast({
        title: '请选择所在城市',
        icon: 'none'
      })
      return false;
    }
    if (that.data.price == null) {
      wx.showToast({
        title: '请选择薪资',
        icon: 'none'
      })
      return false;
    }
    if (!bm.regEx(that.data.price, 'isnum')) {
      wx.showToast({
        title: '薪资请输入数字',
        icon: 'none'
      })
      return false;
    }
    var ad = ''
    var id = ''
    if (type == 1) {
      ad = 'add'
    } else if (type == 3) {
      ad = 'edit'
      id = that.data.id
    }
    bm.requsetData('/w/resume/dream_position?scene=' + ad, 'post', {
      profession: that.data.jobData.jobId,
      industry: industry_open,
      city: that.data.cityData.id,
      price: parseInt(that.data.price),
      id:id
    }, function(res) {
      if (!res.data.errcode) {
        wx.setStorageSync("isRefresh", 1)
        wx.navigateBack()
      } else {
        wx.showToast({
          title: res.data.errmsg,
          icon: 'none'
        })
      }
    })
  },
  //行业选择
  selecthy: function(e) {
    var that = this
    var indata = that.data.select_list
    var hy = JSON.stringify(indata)
    wx.navigateTo({
      url: '/pages/picker/indusPicker?hy=' + hy,
    })
  },
  //删除期望职位
  del_position: function() {
    var that = this
    var id = parseInt(that.data.id)
    bm.requsetData('/w/resume/dream_position?scene=del', 'post', {
      id: id
    }, function(data) {
      console.log(data)
      if (data.data.errcode == 0) {
        wx.showToast({
          title: data.data.errmsg,
        })
        setTimeout(function() {
          wx.setStorageSync("isRefresh", 1)
          wx.navigateBack()
        }, 1500)
      } else {
        wx.showToast({
          title: data.data.errmsg,
          icon: 'none'
        })
      }
    })
  }
})