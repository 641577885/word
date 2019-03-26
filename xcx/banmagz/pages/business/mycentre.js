// pages/business/my/index.js
var bm=require('../../utils/common.js')
const Page = require('../../utils/ald-stat.js').Page;
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    avatar:'',
    name:'',
    company_name:'',
    position:'',
    //收到的简历
    resume_num:0,
    //在线工作
    work_num:0,
    //moc
    moc:0,
    //联系的创客数
    gt_num:555,
    //我的公司是否完善
    comp_perf:0,
    //通过认证
    auth:null,
    comp_exist:0,
    adv_list:[]
  },
  getFormId: function (e) {
    var formid = e.detail.formId;
    app.addformId(formid)
  },
  jumpLink: function (e) {
    var _jump = e.currentTarget.dataset.jump;
    var _url = e.currentTarget.dataset.url;
    var _title = e.currentTarget.dataset.title;
    if (_jump == 1) {
      wx.navigateTo({
        url: "/guide/activity?url=" + _url + "&title=" + _title,
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
  onShow:function(){
    var that = this
    bm.requsetData('/b/seller/center', 'post', '', function (data) {
      if (data.data.sell_info.company_short_name.length == 0){
        var company_short_name=''
      }else{
        var company_short_name = data.data.sell_info.company_short_name
      }
      if (data.data.sell_info.position.length == 0){
        var position ='请完善个人信息'
      }else{
        var position = data.data.sell_info.position
      }
      if (data.data.sell_info.avatar != "https://bm.jiangcdn.com/banma/avatar.jpg" && data.data.sell_info.avatar.indexOf("https://wx.qlogo.cn")==-1){
        data.data.sell_info.avatar = data.data.sell_info.avatar
      }
      that.setData({
        avatar: data.data.sell_info.avatar,
        comp_perf: data.data.sell_info.comp_perf,
        gt_num: data.data.sell_info.connect_num,
        work_num: data.data.sell_info.work_num,
        resume_num: data.data.sell_info.connect_num,
        num: data.data.sell_info.resume_num,
        company_name: company_short_name,
        position: position,
        auth: data.data.sell_info.comp_auth,
        name: data.data.sell_info.name,
        moc: data.data.sell_info.mock,
        industry_str: data.data.sell_info.industry_str,
        comp_exist: data.data.sell_info.comp_exist,
        adv_list: data.data.ads_list
      })
    })
  }
})