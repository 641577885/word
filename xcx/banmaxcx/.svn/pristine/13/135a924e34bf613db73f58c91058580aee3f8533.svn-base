// pages/index/index.js
var app = getApp();
const bm = require('../../utils/common.js')
const Page = require('../../utils/ald-stat.js').Page;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    selectList: [{ id: 0, workWay: 1, name: "远程办公" }, { id: 1, workWay: 3, name: "发布需求" }, { id: 2, workWay: 2, name: "驻场办公" }],
    checkIndex: 0,
    latitude:Number,
    longitude: Number,
    markers: [],
    latitudeArr:[],
    longitudeArr:[],
  },

  //获取当前位置
  getLocation:function(){
    var that=this;
    wx.getLocation({
      success: function(res) {
        that.setData({ latitude: res.latitude, longitude:res.longitude})
        that.getMarkers(30, -15, 15)
      },
    })
  },
  backtoLast:function(){
    wx.switchTab({
      url: '/pages/worker/list',
    })
  },
  //获取随机分布点
  getMarkers: function(num, from, to) {
    var that=this;
    var arr = [], markers=[];
    for (var i = from; i <= to; i++){
      if(i>2 || i<-2){
        arr.push(i/10);
      }
      arr.sort(function () {
        return 0.5 - Math.random();
      });
    }
    for(var j=1;j<10;j++){
      markers.push({
        id: j,
        latitude: that.data.latitude+arr[j-1]*0.0115,
        longitude: that.data.longitude+arr[j]*0.0112,
        iconPath: '/images/icon.png',
        width: 45,
        height: 50
      })
    }
    that.setData({ markers: markers})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.getLocation();
  }
})