// pages/setting/coSearch.js
const bm = require("../utils/common.js")
const Page = require('../utils/ald-stat.js').Page;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showList:false,
    list: [],
    mydata:[],
    ts_show:false,
  },
  searchCompany: function (e) {
    var that = this;
    that.setData({ list: "" })
    if (e.detail.cursor>0){
      bm.requsetData("/w/user/listComp", "get", { comp_name: e.detail.value},function(res){
        if(!res.data.errcode){
          if (res.data.list.length == 0){
            that.setData({ ts_show: true, })
          }else{
            that.setData({ ts_show: false, })
          }
          that.setData({list:res.data.list})
        }
      })
      this.setData({
        showList: true
      })
    }else{
      this.setData({
        showList: false
      })
    }
  },
  ckCompany:function(e){
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    console.log(e)
    bm.requsetData("/w/user/addShield", "post", { comp_id:e.target.dataset.id},function(res){
      if(!res.data.errcode){
        wx.showToast({
          title: '添加成功',
          success:function(){
            setTimeout(function () {
              wx.navigateBack()
            }, 1000)
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      mydata: JSON.parse(options.list)
    })
  },
})