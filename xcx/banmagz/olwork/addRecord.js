const bm = require('../utils/common.js')
const aliUploader = require("../utils/oss/uploadAliyun.js");
const Page = require('../utils/ald-stat.js').Page;
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pid:Number,
    type:'addts',
    textareaTip:'',
    num:0,
    content:'',
    srcList:[],
    paymoney:'',
    work_days:'',
    wages:0,
  },
  fillContent:function(e){
    this.setData({
      content:e.detail.value,
      num:e.detail.cursor
    })
  },
  uploadImg:function(){
    var that =this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        let tempFilePaths = res.tempFilePaths[0];
        let date = new Date();
        let array = that.data.srcList;
        let dir;
        dir = 'tsRecord/' + app.globalData.uid;
        aliUploader(tempFilePaths, dir, date.getTime(),
          function () {
            array.push('https://bm.jiangcdn.com/' + dir +"/"+  date.getTime() + '.' + tempFilePaths.split(".").pop());
            that.setData({
              srcList: array
            })
          }, function (res) {
            common.msg("图片添加失败")
          });
      }
    })
  },
  comfirmnext:function(){
    var that=this;
    var _link,tip;
    var query = { pid: that.data.pid, content: that.data.content, srcList: that.data.srcList };
    if (that.data.type == 'addts') {
      _link ='/b/project/tousu/create';
    }
    if (that.data.type == 'addfire') {
      _link = '/b/project/fire/apply';
      console.log(that.data.paymoney)
      query.wages = that.data.paymoney;
    }
    if(!that.data.content){
      wx.showToast({
        title: that.data.textareaTip,
        icon:'none'
      })
      return false;
    }
    bm.requsetData(_link, 'post', query,function(res){
      if(!res.data.errcode){
        wx.showToast({
          title: '提交成功',
          success: function () {
            setTimeout(function () { 
              if (that.data.type == 'addfire') {
                wx.navigateBack();
                wx.setStorageSync("gyrefresh", 1)
              }else{
                wx.navigateBack()
              }
            }, 1000)
          }
        })
      }else{
        console.log(res.data.errmsg)
        wx.showToast({
          title: res.data.errmsg,
          icon:'none'
        })
      }
    })
  },
  getFireInfo:function(){
    var that=this;
    bm.requsetData("/b/project/fire/applypage", "get", { pid: that.data.pid},function(res){
        if(!res.data.errcode){
          that.setData({ fireInfo: res.data.price_range, paymoney: res.data.wages, wages: res.data.wages, work_days: res.data.work_days})
        }else{
          wx.showToast({
            title: res.data.errmsg,
            icon:'none',
            success:function(){
              setTimeout(function(){
                wx.navigateBack()
              },1000)
            }
          })
        }
    })
  },
  fillPayMoney:function(e){
    var that=this;
    if (e.detail.value!=""){
      var _money = Number(e.detail.value);
      if (_money > that.data.fireInfo.max) {
        _money = that.data.fireInfo.max;
      }
    }
    that.setData({ paymoney: _money})
  },
  suremoney:function(e){
    var that = this;
    var _money = e.detail.value;
    if (_money > that.data.fireInfo.max) {
      _money = that.data.fireInfo.max;
    }
    if (_money =='') {
      _money = that.data.fireInfo.min;
    }
    that.setData({ paymoney: _money })
  },
  onLoad:function(options){
    var _type=options.type,title;
    this.setData({ type: _type,pid:options.pid})
    if (_type == 'addts') {
      title='投诉';
      this.setData({ textareaTip: '请输入投诉内容' });
    } 
    if (_type == 'addfire') {
      title ="解雇";
      this.setData({ textareaTip: '请输入解雇内容' });
      this.getFireInfo();
    }
    wx.setNavigationBarTitle({
      title: title,
    })
  }
})