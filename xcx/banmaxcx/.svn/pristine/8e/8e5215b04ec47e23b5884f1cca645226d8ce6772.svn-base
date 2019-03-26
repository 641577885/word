// pages/worker/my/eduExper.js
const bm = require('../../utils/common.js')
const Page = require('../../utils/ald-stat.js').Page;
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
     //学历
    edulist: ['请选择', '中专及以下', '高中', '大专', '本科', '硕士', '博士'],
    education:0,
    //开始时间
    stime: bm.formatMonth(),
    //结束时间
    etime: bm.formatMonth(),
    //textarea字数
    num:0,
    //学校名称
    name:'',
    //专业
    major:'',
    //在校经历
    content:'',
    //学校经历ID
    id:'',
    //类型
    type:'',
    date: bm.formatToday()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  console.warn(options)
    //学校经历ID
    var id = options.id
    var type = options.type
    this.setData({
      id:id,
      type:type
    })
    if(type == 2){
      var that=this
      bm.requsetData('/w/resume/edu_exper?scene=detail', 'post', { id: id }, function (data) {
        console.warn(data)
        var da= data.data.data
        that.setData({ 
          name: da.name,
          major: da.major,
          education:da.education,
          stime: da.stime_date,
          etime: da.etime_date,
          content: da.content,
          type: 3
          })
      })
    }
  },
  bindEduChange:function(e){
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      education: e.detail.value
    })
  },
  //选择开始时间
  bindStarDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      stime: e.detail.value
    })
  },
  //选择结束时间
  bindEndDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      etime: e.detail.value
    })
  },
  //textarea字数
  valueChange:function(e){
    var number = e.detail.value.length
    this.setData({
      num: number
    })
  },
  //提交
  submit:function(e){
    var type = this.data.type
    if (!this.data.name) {
      wx.showToast({
        title: '请选择学校名称',
        icon: 'none'
      })
      return false;
    }
    if (!this.data.major) {
      wx.showToast({
        title: '请选择专业',
        icon: 'none'
      })
      return false;

    }
    if (!this.data.education) {
      wx.showToast({
        title: '请选择学历',
        icon: 'none'
      })
      return false;

    }
    if (!this.data.stime) {
      wx.showToast({
        title: '请选择起始时间',
        icon: 'none'
      })
      return false;

    }
    if (!this.data.etime) {
      wx.showToast({
        title: '请选择结束时间',
        icon: 'none'
      })
      return false;

    }
    if (this.data.stime > this.data.etime) {
      wx.showToast({
        title: '起始时间必须小于结束时间',
        icon: 'none'
      })
      return false;
    }
    // if (!this.data.content) {
    //   wx.showToast({
    //     title: '请填写在校经历',
    //     icon: 'none'
    //   })
    //   return false;
    // }
    
    var ad = ''
    var id=''
    if(type == 1){
      ad='add'
    }else if(type==3){
      ad ='edit',
        id = this.data.id
    }
      bm.requsetData('/w/resume/edu_exper?scene='+ad, 'post', { name: this.data.name, major: this.data.major, education: this.data.education, stime: this.data.stime, etime: this.data.etime, content: this.data.content,id}, function (res) {
        if (!res.data.errcode) {
          wx.showToast({
            title: '保存成功',
            duration: 2000,
            success: function () {
              setTimeout(function () {
                wx.navigateBack({})
              }, 2000)
            }
          })
        } else {
          wx.showToast({
            title: res.data.errmsg,
            icon: 'none'
          })
        }
      })
  },
})