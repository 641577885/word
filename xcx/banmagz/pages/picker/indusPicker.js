// pages/picker/indusPicker.js
const bm = require('../../utils/common.js')
const Page = require('../../utils/ald-stat.js').Page;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indusList: [],
    indusData: null,
    select_list:[],
    clickstyle:0,
    height:100
  },
  /**选择行业 */
  addclick:function(e){
    var that=this
    var indusList = this.data.indusList
    if (that.data.select_list){
      var arr = that.data.select_list
    }else{
      var arr = []
    }
    
    var indusname = e.target.dataset.indusname
    var id = e.target.dataset.id
    var indus = { id: id, indusName: indusname}
    var strarr = JSON.stringify(arr)
    var strindus = JSON.stringify(indus)
    var aaa = strarr.indexOf(strindus)
    if (aaa != -1) {
      wx.showToast({
        title: '行业标签不能重复',
        icon: 'none'
      })
      return false
    }
    console.log(indus)
    console.log(that.data.select_list)
    if (arr.length > 2) {
      wx.showToast({
        title: '最多选择3个行业',
        icon: 'none'
      })
      return false
    }
    arr.push(indus)
    this.setData({
      select_list:arr,
    })

    var query = wx.createSelectorQuery();
    query.select('#mjltest').boundingClientRect()
    query.exec(function (res) {
      that.setData({
        height: res[0].height*2
      })
    })
  },
  /**删除行业 */
  delclick:function(e){
    var that=this
    var arr = this.data.select_list
    var idx = e.currentTarget.dataset.index;
    var delarr = arr.splice(idx,1)
    this.setData({
      select_list: arr
    })
    var query = wx.createSelectorQuery();
    query.select('#mjltest').boundingClientRect()
    query.exec(function (res) {
      that.setData({
        height: res[0].height * 2
      })
    })
  },
  checkindus: function (e) {
    var select_list = this.data.select_list
    var induName = e.currentTarget.dataset.indusname
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    this.data.indusData = { data: select_list};
    var indusnum = this.data.select_list.length
    prevPage.setData({
      indusData: this.data.indusData,
      indusnum:indusnum,
      select_list: this.data.select_list
    })
    wx.navigateBack()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    
    //参数
    var listdata = options.hy
      
    if (listdata != undefined){
      var hy = JSON.parse(listdata)
      that.setData({
        select_list: hy
      })
    }

    bm.requsetData('/c/config/industry','get','', function (res) {
      that.setData({ indusList:res.data })
    },true)
  },
})