// pages/worker/my/mycentre.js
var bm = require('../../utils/common.js')
const Page = require('../../utils/ald-stat.js').Page;
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_info:'',
    fwData:'',
    fw_num:0,
    adv_list:[],
    
  },
  getFormId: function (e) {
    var formid = e.detail.formId;
    app.addformId(formid)
  },
  jumpLink:function(e){
    var that = this;
    var _idx = e.currentTarget.dataset.idx;
    var _jump = that.data.adv_list[_idx].jump;
    if (_jump == 1) {
      var _id = that.data.adv_list[_idx].act_id;
      wx.navigateTo({
        url: "/guide/activity?id=" + _id,
      })
    }
    if (_jump == 2) {
      var _url = that.data.adv_list[_idx].url;
      var is_switch = _url.search('navurl');
      if (is_switch != -1) {
        wx.switchTab({
          url: _url,
        })
      } else {
        wx.navigateTo({
          url: _url,
        })
      }
    }
  },
  onShow: function (){
    var that = this ;
    
    bm.requsetData("/w/user/center", "post", '', function (data) {
      if (data.data.user_info.avatar != "https://bm.jiangcdn.com/banma/avatar.jpg" && data.data.user_info.avatar.indexOf("https://wx.qlogo.cn") == -1) {
        data.data.user_info.avatar = data.data.user_info.avatar + "@!200"
      }
      that.setData({
        user_info: data.data.user_info,
        adv_list:data.data.ads_list
      })
    })
    var tag = []
    bm.requsetData('/w/resume/detail?scene=service_tag', 'get', '', function (data) {
      var service_tag_arr = data.data.service_tag_arr
      for (var key in service_tag_arr){
        var fw = { id: key, fwName: service_tag_arr[key]}
        tag.push(fw)
      }
      that.setData({
        fwData: tag,
        fw_num: tag.length
      })
    })
    
  },
  bindfw:function(){
    var that = this
    if (that.data.fwData){
      var fw = JSON.stringify(that.data.fwData)
      wx.navigateTo({
        url: '/pages/picker/fwPicker?fw=' + fw + '&fw_type=1',
      })
    }else{
      wx.navigateTo({
        url: '/pages/picker/fwPicker?fw_type=1',
      })
    }
    
  },
  
})