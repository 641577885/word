const bm = require('../../utils/common.js')
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
const Page = require('../../utils/ald-stat.js').Page;
var qqmapsdk;
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    searchList: [],
    showList: false,
    cityId: Number,
    address: '',
    addressInput: ""
  },

  //取值
  inputrname: function (e) {
    this.setData({
      username: e.detail.value
    })
  },
  intputcompany: function (e) {
    this.setData({
      company: e.detail.value
    })
  },
  searchAddress: function (e) {
    var that = this;
    var key = e.detail.value;
    that.setData({ addressInput: key })
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
  getFormId: function (e) {
    var formid = e.detail.formId;
    app.addformId(formid)
  },
  checkAddress: function (e) {
    var that = this;
    var _index = e.currentTarget.dataset.index;
    var checkList = that.data.searchList[_index];
    var _cityid = checkList.adcode.toString().substring(0, 5) + "0";
    that.setData({ addressInput: checkList.title, cityId: _cityid, address: checkList.address + that.data.addressInput, showList: false })
  },
  searchOut: function () {
    this.setData({ showList: false })
  },

  saveAddress: function () {
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    prevPage.setData({
      cityId: this.data.cityId,
      work_address: this.data.address
    })
    wx.navigateBack()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    qqmapsdk = new QQMapWX({
      key: '7WUBZ-6XNCG-RD7QM-I6DB4-U7UGS-WUFGB'
    });
  }
})