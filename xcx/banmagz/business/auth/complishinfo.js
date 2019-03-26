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
     username:'',
     company:'',
     searchList:[],
     showList:false,
     cityId:Number,
     address:'',
     addressInput:""
  },

//取值
  inputrname:function(e){
    this.setData({
      username: e.detail.value
    })     
  },
  intputcompany:function(e){
    this.setData({
      company: e.detail.value
    })
  },
  //点击确认判断
  comfirmlog:function(){
    var that = this;
    if(that.data.username==""){
      wx.showToast({
        title: '请输入姓名',
        icon: 'none'
      })
      return;
    }
    if(that.data.company==""){
      wx.showToast({
        title: '请输入公司名称',
        icon: 'none'
      })
      return;
    }
    //请求发送
    bm.requsetData("/b/seller/info/perfect/", "post", { name: that.data.username, company: that.data.company, area: that.data.cityId,address:that.data.address},function(res){
      if(!res.data.errcode){
          wx.switchTab({
            url: '/pages/publish/publishType',
          })
      }else{
        wx.showToast({
          title: res.data.errmsg,
          icon: 'none'
        })
      }
    })
  },
  searchAddress:function(e){
    var that=this;
    var key=e.detail.value;
    that.setData({ addressInput: key})
    qqmapsdk.getSuggestion({
      keyword: key,
      region_fix: "0",
      success: function (res) {
        if (res.data.length > 0) {
          that.setData({ searchList: res.data, showList:true })
        }
      },
      fail: function (res) {
        console.log(res);
      }
    })
  },
  checkAddress: function (e) {
    var that=this;
    var _index = e.currentTarget.dataset.index;
    var checkList = that.data.searchList[_index];
    var _cityid = checkList.adcode.toString().substring(0, 5)+"0";
    that.setData({ addressInput: checkList.title, cityId: _cityid, address: checkList.address + that.data.addressInput,showList:false})
  },
  searchOut:function(){
    this.setData({showList: false })
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