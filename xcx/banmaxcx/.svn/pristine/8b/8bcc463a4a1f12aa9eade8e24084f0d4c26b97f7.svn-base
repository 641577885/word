// pages/business/search/search.js
//调取发送请求的文件
const bm = require('../../utils/common.js')
const Page = require('../../utils/ald-stat.js').Page;
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    lists: [],
    history: [],
    guess: [],
    getValue: 0
  },
  /*点击搜索*/
  searchbtn: function(e) {
    var that = this;
    if (e.detail.value !== '') {
      if (that.data.getValue == 1) {
        var datalist = "lishi1";
        that.getDataStore(datalist, e.detail.value);
        //跳转
        var urldata = '/worker/search/search?goodValue=';
        wx.navigateTo({
          url: urldata + e.detail.value,
        })
      } else if (that.data.getValue == 2) {
        var datalist = "lishi2";
        that.getDataStore(datalist, e.detail.value);
        //跳转
        var urldata = '/worker/search/maskinglist?goodValue=';
        wx.navigateTo({
          url: urldata + e.detail.value,
        })
      }
    }else{
      wx.showToast({
        title: '亲，不能为空',
        icon:'none',
        duration: 1000
      })
    }
  },
  //生命周期函数--监听页面加载
  onLoad: function(options) {
    var that = this;
    that.setData({
      getValue: options.getValue
    });
    that.judge();
    if (options.getValue == 1) {
      wx.getStorage({
        key: 'lishi1',
        success: function(res) {
          that.setData({
            history: res.data
          });
        }
      })
    } else {
      wx.getStorage({
        key: 'lishi2',
        success: function(res) {
          that.setData({
            history: res.data
          });
        }
      })
    }
  },
  judge: function() {
    var that = this;
    var data = app.globalData.role;
    console.log(data);
  },
  getDatalist: function(data) {
    var that = this;
    var list = data.currentTarget.id;
    if (that.data.getValue == 1) {
      var datalist = "lishi1";
      that.getDataStore(datalist, list);
      var urldata = '/worker/search/search?goodValue=';
      wx.navigateTo({
        url: urldata + list,
      })
    } else if (that.data.getValue == 2) {
      var datalist = "lishi2";
      that.getDataStore(datalist, list);
      var urldata = '/worker/search/maskinglist?goodValue=';
      wx.navigateTo({
        url: urldata + list,
      })
    }
  },
  //本地获取与存储
  getDataStore: function(lishi, value) {
    var that = this,
      getData = [];
    //获取
    wx.getStorage({
      key: lishi,
      success: function(res) {
        that.setData({
          history: res.data
        });
      }
    })
    //获取筛选出不同的
    var datalist;
    for (var i in that.data.history) {
      getData.push(that.data.history[i]);
      if (that.data.history[i] == value) {
        getData.splice(i, 1)
      }
    }
    //超出界限删除
    getData.unshift(value);
    if (getData.length > 7) {
      getData.splice(getData.length - 1, 1)
    }
    //存储
    wx.setStorage({
      key: lishi,
      data: getData,
    });
    //获取存到页面
    setTimeout(function() {
      wx.getStorage({
        key: lishi,
        success: function(res) {
          that.setData({
            lists: value
          })
          that.setData({
            history: res.data
          });
        }
      })
    }, 1000)
  },
  getFormId: function(e) {
    var formid = e.detail.formId;
    app.addformId(formid)
  },
  deleteData:function(){
    this.setData({
      lists:[]
    })
  }
})