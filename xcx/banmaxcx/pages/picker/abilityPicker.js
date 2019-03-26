// pages/picker/abilityPicker.js
const bm = require('../../utils/common.js')
const Page = require('../../utils/ald-stat.js').Page;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeId:null,
    tagList: [],
    ckList:[],
  },
  
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
  },
  tagPicker:function(e){
    var that = this;
    var tagName = e.target.dataset.value;
    var _index = e.target.dataset.id;
    if (that.data.ckList.indexOf(tagName) != -1) {
      var tagName = that.data.ckList.indexOf(tagName);
      that.data.ckList.splice(tagName, 1)
      that.data.tagList[_index].checked = false;
      that.setData({ ckList: that.data.ckList, tagList: that.data.tagList})
    } else {
      if (that.data.ckList.length < 3) {
        that.data.ckList.push(tagName);
        that.data.tagList[_index].checked = true;
        that.setData({ ckList: that.data.ckList, tagList: that.data.tagList})
      } else {
        wx.showToast({
          title: '最多选择三个',
          icon: 'none'
        })
      }
    }
  },
  tagAction:function(){
    var that=this;
    for (var i = 0; i < that.data.tagList.length; i++) {
      var newchecked = that.data.tagList[i].checked;
      var name = that.data.tagList[i].name;
      if (that.data.ckList.indexOf(name) != -1) {
        that.data.tagList[i].checked = true;
      } else {
        that.data.tagList[i].checked = false;
      }
      that.setData({ tagList: that.data.tagList })
    }
  },
  checkTag: function () {
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    prevPage.setData({
      tagData: this.data.ckList
    })
    wx.navigateBack()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.setData({ ckList: JSON.parse(options.tagData), typeId: options.typeId });
    bm.requsetData('/c/config/skill', 'get', { id: options.typeId },function(res){
      var array=[];
      for (var i in res.data) {
        array.push({ name: res.data[i], checked: false })
      }
      that.setData({ tagList: array })
      that.tagAction();
    }, true)
  },
  
})