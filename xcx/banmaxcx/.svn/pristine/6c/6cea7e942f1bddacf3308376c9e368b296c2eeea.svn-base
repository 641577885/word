// guide/activity.js
const Page = require('../utils/ald-stat.js').Page;
const bm=require('../utils/common.js')
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:0,
    url:"",
    query:"",
    isShowDialog: true,
    k:"",  //参数字段
    v:"",   //字段v
    describe:"",
    title:"",
    sense:"",
    surl:""
  },

  getUrl:function(){
    var that=this; 
    bm.requsetData("/c/guide/get_actconf", "get", { id: that.data.id, k: that.data.k, v: that.data.v},function(res){
      if(!res.data.errcode){
        that.setData({ url: res.data.info.url, describe: res.data.info.describe, title: res.data.info.title, cover_map: res.data.info.cover_map, surl:res.data.info.surl});
        wx.setNavigationBarTitle({
          title: res.data.info.title,
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (app.globalData.auth != null) {
      if (options.scene) {
        var scene = decodeURIComponent(options.scene);
        that.setData({ scene: scene });
        that.getKeyValue()
      } else if (options.k && options.k != "") {
        that.setData({ id: options.id });
        that.setData({ k: options.k, v: options.v });
        that.getUrl();
      } else {
        that.setData({ id: options.id });
        that.getUrl();
      }
    } else {
      app.authCallback = auth => {
        if (options.scene) {
          var scene = decodeURIComponent(options.scene);
          that.setData({ scene: scene });
          that.getKeyValue()
        } else if (options.k && options.k != "") {
          that.setData({ id: options.id });
          that.setData({ k: options.k, v: options.v });
          that.getUrl();
        } else {
          that.setData({ id: options.id });
          that.getUrl();
        }
      }
    }
    
  },


  getKeyValue:function(){
    var that=this;
    bm.requsetData("/c/action/deal_scene", "post", { scene: that.data.scene}, function (res) {
      if (!res.data.errcode) {
        that.setData({id:res.data.data.id,k:res.data.data.k,v:res.data.data.v});
        that.getUrl();
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that=this;
    return {
      title: that.data.describe,
      path: that.data.surl,
      imageUrl: that.data.cover_map
    }
  }
})