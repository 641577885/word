// pages/demandList/inform.js
const bm = require('../../utils/common.js')
const Page = require('../../utils/ald-stat.js').Page;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperIndex: 0,
    index:0,
    snenicCards: ["111", "222", "111", "111", "111", "111"],
    skill: [{id: 1, name: 'Photoshop'},{ id: 2, name: 'Java' },{ id: 3, name: 'Dw' },],
    price:'￥1000',
    array: [{ profession: 0, profession_name: '电商' }, { profession: 1, profession_name: '前端' }, { profession: 2,    profession_name: 'php' },],
    index:0,
    profession:0,
    content:'此处填写岗位描述信息此处填写岗位描述信息此处填写岗位描述信息此处填写岗位描述信息此处填写岗位描述信息',
    ispro:false,
    showBox: false, //显示盒子
  },

  swiperChange(e) {

    this.setData({
      swiperIndex: e.detail.current,
 
    
    })
    // console.log(this.data.swiperIndex)
  },
  bindPickerChange:function(e){
    var aid = this.data.array[e.detail.value].profession;
    this.setData({ index: aid})
  },
  checkBox: function () {
    this.setData({ showBox: true })
  },
  closeBox: function () {
    this.setData({ showBox: false });
    this.resetCheck();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    setTimeout(function () {
      that.setData({
        ispro: false
      }) //标记在请求中
    }, 200)
    wx.showToast({
      title: '正在加载',
      icon: 'loading',
      duration: 500
    })
     that.showData()
  },  
  showData:function(){
    var that = this;
    // var url = 
        // bm.requsetData(url, 'post', list, function (data) {
        //   console.log(_getClipboardDataObject)
      // that.setData({
      //   snenicCards: data.data
      // })
    // })
  }
})