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
  
  DeleteCo:function(e){
    var that=this;
    var _id = e.target.dataset.id;
    var _index = e.target.dataset.index;
    var colist = that.data.companyList;
    bm.requsetData("/c/action/opNotice", "post", { id: _id, scence:2},function(res){
      if(!res.data.errcode){
        colist.splice(_index, 1);
        that.setData({ companyList: colist })
      }else{
        wx.showToast({
          title: res.data.errmsg,
        })
      }
    })
  },
  getHideCo:function(){
    var that=this;
    bm.requsetData("/c/action/listNotice","get", "",function(res){
      console.log(res)
      if(!res.data.errcode){
        that.setData({companyList:res.data.list})
      }
    })
  },
  edit:function(e){
    var that = this;
    var _id = e.target.dataset.id;
    var content = encodeURI(e.target.dataset.content);
    console.log(content)
    wx.navigateTo({
      url: '/setting/sayInput?type=3&id=' + _id + '&content=' + content,
    })
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    this.getHideCo();
  },
})