// pages/setting/hideCompany.js
const bm = require("../utils/common.js")
const Page = require('../utils/ald-stat.js').Page;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    companyList:[]
  },
  //添加新的公司跳转
  addNewCo:function(){
    wx.navigateTo({
      url: '/setting/coSearch?list=' + JSON.stringify(this.data.companyList),
    })
  },
  DeleteCo:function(e){
    var that=this;
    var _id = e.target.dataset.id;
    var _index = e.target.dataset.index;
    var colist = that.data.companyList;
    bm.requsetData("/w/user/delShield","post",{id:_id},function(res){
      if(!res.data.errcode){
        colist.splice(_index, 1);
        that.setData({ companyList: colist })
      }else{
        wx.showToast({
          title: res.data.errmsg,
          icon:'none'
        })
      }
    })
  },
  getHideCo:function(){
    var that=this;
    bm.requsetData("/w/user/listShield","get", "",function(res){
      if(!res.data.errcode){
        that.setData({companyList:res.data.list})
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    this.getHideCo();
  },
})