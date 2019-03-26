// pages/setting/coSearch.js
const bm=require("../utils/common.js")
const Page = require('../utils/ald-stat.js').Page;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showList:false,
    list: [
      {
        id:2,
        coName:"墨匠信息技术有限公司"
      },
      {
        id: 3,
        coName: "江苏墨匠信息技术有限公司"
      }
    ],
    mydata:[]
  },
  searchCompany: function (e) {
    if (e.detail.cursor>0){
      bm.requsetData("/w/user/listComp", "get", { comp_name: e.detail.value},function(){
        if(!res.data.errcode){
          console.log(res)
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
    this.data.mydata.push({ id: 2, coName: "墨匠信息技术有限公司" });
    prevPage.setData({
      companyList: this.data.mydata
    })
    wx.navigateBack({
      delta: 2
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