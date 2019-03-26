// record/concern.js
var bm = require('../utils/common.js')
const Page = require('../utils/ald-stat.js').Page;
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    empty_text_01: '暂无相关在线信息',
    empty_text_02: '暂无相关坐班信息',
    empty_text_03:'暂无相关需求信息',
    current: 0,
    hiddenpart: true,
    hiddentext:false,
    sitlist: [],
    inlist: [],
    needlist:[],
    view: '',
    alllist: [],
    switchs: true,
    page: 1,
    limit: 5,
    types: 1,
    workway: 1
  },
  tab: function(event) {
    var that=this;
    that.setData({
      hiddentext: false,
      hiddenpart: true,
      current: event.target.dataset.current
    })
    if (that.data.current == 1) {
      that.setData({
        types: 1, workway: 2, sitlist: [], inlist: [], needlist: [], page:0
      })
     }
    if (that.data.current == 0) {
      that.setData({
        types: 1, workway: 1, inlist: [], sitlist: [], needlist: [], page: 0
      })
      }
    if (that.data.current == 2) {
        that.setData({
          types: 2, workway: 0, sitlist: [], inlist: [], needlist: [], page: 0
      })
    }
      //that.editorData()
  },
  eventchange: function(event) {
    var that = this;
    that.setData({
       current: event.detail.current,
      hiddentext: false,
       hiddenpart: true
        })

    if (that.data.current == 1) {
      that.setData({
        types: 1, workway: 2, sitlist: [], inlist: [], needlist: [], page: 0
      })
    }
    if (that.data.current == 0) {
      that.setData({
        types: 1, workway: 1, inlist: [], sitlist: [], needlist: [], page: 0
      })
    }
    if (that.data.current == 2) {
      that.setData({
        types: 2, workway: 0, sitlist: [], inlist: [], needlist: [], page: 0
      })
    }
    that.editorData()
  },

   // 生命周期函数--监听页面加载
  onLoad: function(options) {
    var that = this
    wx.showToast({
      title: '正在加载',
      icon: 'loading',
      duration: 500
    })
    setTimeout(function () {
      that.editorData();
      }, 500)
      
  },
  //上拉函数
  getpull1: function() {
    console.log(1)
    var that = this;
    var list = that.data.alllist;
    that.getpullData(list)
  },
  //加载函数
  getpullData: function (list){
    var that=this;
    if (that.data.switchs) { //没有在请求中，开始加载数据
      console.log(456)
      this.setData({
        switchs: false
      })
      if (list.pages.allpage > list.pages.page) { //有下一页数据
        this.setData({
          page: page++
        })
        wx.showToast({
          title: '正在加载',
          icon: 'loading',
          duration: 2000,
          success: function (res) {
            console.log(789)
            that.editorData()
          }
        })
      } else {
        wx.showToast({
          title: '正在加载',
          icon: 'loading',
          duration: 1000,
          success: function (res) {
            that.setData({
              hiddentext: true
            })
          }
        })

      }
    }
  },
  //编辑数据
  editorData: function() {
    var that = this,
      getdata;
    getdata = {
      page: that.data.page,
      limit: that.data.limit,
      type: that.data.types,
      workway: that.data.workway,
    }
    console.log(that.data.types );
    if (that.data.types == 1) {
      if (that.data.workway == 1){
        that.getDataUrl(getdata);
      }else{
        that.getDataUrl2(getdata);
      }
    } else if (that.data.types == 2) {
        that.getDataUrl3(getdata);
    }


  },
  // 发送请求1 ajax请求数据  依据实际请求进行修改
  getDataUrl: function(getdata) {
    var that = this;
    console.log(getdata);
    bm.requsetData('/w/user/chatLogList', 'get', getdata, function(data) {
      that.setData({
        alllist: data.data
      })
      var dataHtml = that.data.sitlist;
      var datalist = that.judgeData(data.data).list;
      for (var i in datalist) {
        dataHtml.push(datalist[i])
      }
      that.setData({
        sitlist: dataHtml
      })
      console.log(that.data.sitlist)
    })
    this.setData({
      switchs: true
    })
  },
  urlClick:function(e){
    var id = e.currentTarget.dataset.id;
    var sid = e.currentTarget.dataset.sid;
    var status = e.currentTarget.dataset.status
     if (status==2){
      wx.navigateTo({
        url: '/pages/details/zwDetails?id='+id,
      })
    }else{
      wx.navigateTo({
        url: '/message/dialog?skipid='+sid,
      })
    }
   
  },
  urlClick01:function(e){
    console.log("aaa")
    var id = e.currentTarget.dataset.id;
    var sid = e.currentTarget.dataset.sid;
    var status = e.currentTarget.dataset.status
    if (status == 2) {
      wx.navigateTo({
        url: '/pages/details/xqDetails?id=' + id,
      })
    } else {
      console.log(e)
      wx.navigateTo({
        url: '/message/dialog?skipid=' + sid,
      })
    }
  },
  urlClick02:function(e){
    var id = e.currentTarget.dataset.id;
    var sid = e.currentTarget.dataset.sid;
    var status = e.currentTarget.dataset.status
    if (status == 2) {
      wx.navigateTo({
        url: '/pages/details/zwDetails?id=' + id,
      })
    } else {
      console.log(e)
      wx.navigateTo({
        url: '/message/dialog?skipid=' + sid,
      })
    }
  },
  // 发送请求2 ajax请求数据  依据实际请求进行修改
  getDataUrl2: function(getdata) {
    var that = this;
    console.log(getdata);
    bm.requsetData('/w/user/chatLogList', 'get', getdata, function(data) {
      that.setData({
        alllist: data.data
      })
      var dataHtml = that.data.inlist;
      var datalist = that.judgeData(data.data).list;
      for (var i in datalist) {
        dataHtml.push(datalist[i])
      }
      that.setData({
        inlist: dataHtml
      })
    })
    this.setData({
      switchs: true
    })
  },
  // 发送请求3 ajax请求数据  依据实际请求进行修改
  getDataUrl3: function (getdata) {
    var that = this;
    console.log(getdata);
    bm.requsetData('/w/user/chatLogList', 'get', getdata, function (data) {
      console.log(data);
      that.setData({
        alllist: data.data
      })
      var dataHtml = that.data.needlist;
      var datalist = that.judgeData(data.data).list;
      for (var i in datalist) {
        dataHtml.push(datalist[i])
      }
      that.setData({
        needlist: dataHtml
      })
    })
    this.setData({
      switchs: true
    })
  },
  judgeData: function(data) {
    var that = this;
    if (data.errcode !== 0) {
      wx.showToast({
        mask: true,
        title: data.errmsg,
        icon: 'none',
        duration: 300
      })
      wx.showToast({
        title: '正在加载',
        icon: 'loading',
        duration: 500
      })
        that.setData({
          hiddenpart: false
        })
      return data = [];
    } else {
      var sbcim = JSON.stringify(data.list)
      //console.log(sbcim)
      if (sbcim !== '[]') {
        that.timestampToTime(data.list);
        return data;
      } else {
        wx.showToast({
          title: '正在加载',
          icon: 'loading',
          duration: 500,
        })
        setTimeout(function () {
          that.setData({
            hiddenpart: false
          })
        }, 100)
        return data = [];
      }
    }
  },
  timestampToTime: function(list) {
    for (var i in list) {
      list[i].ctime = bm.formatDate(list[i].ctime);
    }
  }
})