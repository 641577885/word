var app = getApp();
var bm = require('../../utils/common.js')
const aliUploader = require("../../utils/oss/uploadAliyun.js");
const Page = require('../../utils/ald-stat.js').Page;
Page({
  data: {
    //公司id
    company_id:null,
    //公司全名
    company_name:'',
    //行业
    company_type:'',
    //公司短名
    company_name_02:'',
    //公司人数
    company_num:0,
    //成员列表
    member_list:[],
    //logo
    logo:'/images/asda1.png',
    //完善未完善显示
    ws_01:0,
    ws_02:0,
    ws_03: 0,
    ws_04: 0,
    ws_05: 0,
    //分享的token
    share_token:null,
    is_auth:'',
    auth_bind:'auth_bind',
    //认证状态
    auth:0,
    short_intro:'',
    padding:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    var that = this
    bm.requsetData('/b/seller/auth_status', 'get', '', function (data) {
      if (data.data.data.company == 2) {
        that.setData({
          is_auth: 'share',
          auth_bind:'',
          auth:1,
        })
      } else {
        that.setData({
          is_auth: '',
          auth_bind:'auth_bind',
          auth:0
        })
        
      }
    })
    bm.requsetData('/b/company/index','get','', function (data) {
      if(data.data.errcode == 0){
        if (data.data.comp_info.logo){
          var logo = data.data.comp_info.logo
        }else{
          var logo = '/images/asda1.png'
        }
        var str = data.data.comp_info.industry_str
        if (str.length > 10) {
          var str_main = str.substring(0, 10) + ' ...'
        } else {
          var str_main = str
        }
        if (data.data.comp_info.short_intro.length>0){
          that.setData({
            padding:'b_textarea_padd'
          })
        }
        console.log(data)
        that.setData({
          company_id: data.data.comp_info.id,
          company_name: data.data.comp_info.name,
          company_type: str_main,
          logo: logo + '@!200',
          company_name_02: data.data.comp_info.short_name,
          member_list: data.data.staff,
          company_num: data.data.staff.length,
          ws_01: data.data.completion.name,
          ws_02: data.data.completion.size,
          ws_03: data.data.completion.step,
          ws_04: data.data.completion.website,
          ws_05: data.data.completion.address,
          share_token: data.data.share_token,
          staff_size_name: data.data.comp_info.staff_size_name ,
          finance_stage_name: data.data.comp_info.finance_stage_name ,
          website: data.data.comp_info.website,
          address_s: data.data.comp_info.address,
          short_intro: data.data.comp_info.short_intro
        })
        console.log(that.data)
      }
      else{
        console.log(data.data.errmsg)
        // wx.showToast({
        //   title: data.data.errmsg,
        //   icon:'none'
        // })
      }
    })
  },
  //未认证，点击去认证
  renzhenClick:function(){
    if (this.data.auth==0){
        wx.navigateTo({
          url: '/business/auth/auth',
        })
    }
  },
  //更换logo
  choose_logo:function(){
    var that=this
    wx.chooseImage({
      count:1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success:function(res){
        let tempFilePaths = res.tempFilePaths[0];
        let date = new Date();
        let dir = 'busLogo/' + app.globalData.uid;
        aliUploader(tempFilePaths, dir, date.getTime(),
          function () {
            var logo =  'https://bm.jiangcdn.com/' + dir + '/' + date.getTime() + '.' + tempFilePaths.split(".").pop()
            bm.requsetData('/b/company/update?scene=logo', 'post', { logo: logo, id: that.data.company_id}, function (data) {
              if (data.data.errcode == 0){
                that.setData({
                  logo: logo
                })
                wx.showToast({
                  title: data.data.errmsg,
                })
              }else{
                wx.showToast({
                  title: data.data.errmsg,
                  icon:'none'
                })
              }
            })
          }, function (res) {
            common.msg("图片添加失败")
          });
        // that.setData({
        //   logo: res.tempFilePaths[0]
        // })
      }
    })
  },
  onShareAppMessage:function(){
    var that = this
    var access_token = app.globalData.token
    var token = that.data.share_token
    return{
      title:'邀请',
      path: 'business/my/invitation?token=' + token,
      success:function(res){
        console.log(res)
      }
    }
  },
  auth_bind:function(){
    wx.showToast({
      title: '企业资质未认证,无法邀请！',
      icon: 'none'
    })
  },
  replace:function(){
    wx.showModal({
      confirmColor:'red',
      title: '警告',
      content: '更换公司将清空现公司所有信息！清空后信息无法恢复并将重新入驻！',
      success:function(res){
        if (res.confirm) {
          wx.showModal({
            confirmColor: 'red',
            title: '请再次确认',
            content: '是否确认更换公司？',
            success:function(data){
              if (data.confirm){

              }else{
                console.log('用户点击取消2')
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //填写规模
  bindgm:function(){
    var that = this
    var company_id = that.data.company_id
    if (company_id == null){
      wx.showToast({
        title: '请先填写公司信息',
        icon:'none'
      })
    }else{
      wx.navigateTo({
        url: '/business/my/companyinfo?infotype=3&id=' + company_id,
      })
    }
  },
  //填写融资
  bindrz: function () {
    var that = this
    var company_id = that.data.company_id
    if (company_id == null) {
      wx.showToast({
        title: '请先填写公司信息',
        icon: 'none'
      })
    } else {
      wx.navigateTo({
        url: '/business/my/companyinfo?infotype=2&id=' + company_id,
      })
    }
  },
  //填写官网
  bindgw: function () {
    var that = this
    var company_id = that.data.company_id
    if (company_id == null) {
      wx.showToast({
        title: '请先填写公司信息',
        icon: 'none'
      })
    } else {
      wx.navigateTo({
        url: '/business/my/companyinfo?infotype=4&id=' + company_id,
      })
    }
  },
  //填写地址
  bindadd: function () {
    var that = this
    var company_id = that.data.company_id
    if (company_id == null) {
      wx.showToast({
        title: '请先填写公司信息',
        icon: 'none'
      })
    } else {
      wx.navigateTo({
        url: '/business/my/companyinfo?infotype=5&id=' + company_id,
      })
    }
  },
  //填写简介
  bindjj: function () {
    var that = this
    var company_id = that.data.company_id
    if (company_id == null) {
      wx.showToast({
        title: '请先填写公司信息',
        icon: 'none'
      })
    } else {
      wx.navigateTo({
        url: '/business/my/companyinfo?infotype=6&id=' + company_id,
      })
    }
  },
  //预览公司
  yl_company:function(){
    wx.navigateTo({
      url: '/business/my/previewCompany',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  }
})