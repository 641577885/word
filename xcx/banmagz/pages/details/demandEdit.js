// pages/business/position/relProject.js
const bm=require('../../utils/common.js')
const Page = require('../../utils/ald-stat.js').Page;
const app=getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    company_name:'',
    jobData: { jobId: '', jobIdTwo: '', jobName: '' },
    periodarr: ['不限','1周', '2周', '3周', '1个月', '2个月', '3个月'],
    period: 3,
    xqtitle:'',
    content:'',
    price:'',
    oldJobId:Number,
    fwData: '',
    fw_num: 0,
    //当前编辑状态
    status: null
  },
  getFormId: function (e) {
    var formid = e.detail.formId;
    app.addformId(formid)
  },
  bindPickerperiod: function (e) {
    this.setData({ period: e.detail.value })
  },
  saveDemand:function(){
    var that=this;
    console.log(that.data.fwData)
    if (!that.data.xqtitle) {
      wx.showToast({
        title: '请输入需求名称',
        icon: 'none'
      })
      return false;
    }

    if (that.data.price == "") {
      wx.showToast({
        title: '请输入价格',
        icon: 'none'
      })
      return false;
    }
    if (that.data.content == "") {
      wx.showToast({
        title: '请输入需求详情',
        icon: 'none'
      })
      return false;
    }
    var skill = [that.data.fwData[0].id]
    if(that.data.status == 4){
      wx.showModal({
        title: '是否确认提交？',
        content: '保存后将自动提交审核',
        success:function(_res){
          if (_res.confirm){
            bm.requsetData('/b/demand/update', 'post', { id: that.data.id, title: that.data.xqtitle, skills: skill, period: that.data.period, price: that.data.price, content: that.data.content }, function (res) {
              console.log(res)
              if (!res.data.errcode) {
                wx.showToast({
                  title: '修改需求成功',
                  icon: 'none',
                  success: function (res) {
                    wx.reLaunch({
                      url: '/pages/index/pubSuccess',
                    })
                  }
                })
              } else {
                wx.showToast({
                  title: res.data.errmsg,
                  icon: 'none'
                })
              }
            })
          }
        }
      })
    }else{
      bm.requsetData('/b/demand/update', 'post', { id: that.data.id, title: that.data.xqtitle, skills: skill, period: that.data.period, price: that.data.price, content: that.data.content }, function (res) {
        console.log(res)
        if (!res.data.errcode) {
          wx.showToast({
            title: '修改需求成功',
            icon: 'none',
            success: function (res) {
              wx.reLaunch({
                url: '/pages/index/pubSuccess',
              })
            }
          })
        } else {
          wx.showToast({
            title: res.data.errmsg,
            icon: 'none'
          })
        }
      })
    }
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var status = options.status
    bm.requsetData('/b/demand/origin/data','get',{id:options.id},function(res){
      if(!res.data.errcode){
        var tag = []
        var skills = res.data.demand_info.skill_arr
        for (var key in skills) {
          var fw = { id: key, fwName: skills[key] }
          tag.push(fw)
        }
        console.log(tag)
        that.setData({
          id: options.id,
          company_name: res.data.demand_info.company_name, 
          jobData: { jobId: res.data.demand_info.profession, jobIdTwo: '', jobName: res.data.demand_info.profession_name}, 
          oldJobId: res.data.demand_info.profession,
          period: res.data.demand_info.period, 
          xqtitle:res.data.demand_info.title,
          content: res.data.demand_info.content,
          price: res.data.demand_info.price,
          fwData: tag,
          status: status
        })
      }else{
        wx.showToast({
          title: res.data.errmsg,
        })
      }
    })
  },
  //选择服务标签
  bindfw: function () {
    var that = this
    if (that.data.fwData) {
      var fw = JSON.stringify(that.data.fwData)
      wx.navigateTo({
        url: '/pages/picker/fwPicker?fw=' + fw + '&fw_type=0',
      })
    } else {
      wx.navigateTo({
        url: '/pages/picker/fwPicker?fw_type=0',
      })
    }
  },
  onShow:function(){
    var that = this
    console.log(that.data.fwData)
    if (that.data.fwData) {
      that.setData({
        fw_num: that.data.fwData.length
      })
    }
  }
  
})