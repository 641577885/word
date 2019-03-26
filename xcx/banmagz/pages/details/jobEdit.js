// pages/business/position/relsease.js
var bm=require('../../utils/common.js')
const Page = require('../../utils/ald-stat.js').Page;
var app=getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    company:[],
    companyname:'',
    jobData: { jobId: '', jobIdTwo: '', jobName: '' },
    oldJobId: Number,
    title:'',
    cityData: { id: null, cityName: '' },
    work_address:'',
    work_way:1,
    tagData:[],
    priceList: [ //金额
      {
        id: 0,
        data: "面议",
        low: 1,
        high: 1
      },
      {
        id: 1,
        data: "1K以下",
        low: '1',
        high: '1000'
      },
      {
        id: 2,
        data: "1K-3K",
        low: '1000',
        high: '3000'
      },
      {
        id: 3,
        data: "3K-5K",
        low: '3000',
        high: '5000'
      },
      {
        id: 4,
        data: "5K-10K",
        low: '5000',
        high: '10000'
      },
      {
        id: 5,
        data: "10K-20K",
        low: '10000',
        high: '20000'
      },
      {
        id: 6,
        data: "20K以上",
        low: '20000',
        high: '500000'
      }
    ],
    price:"",
    priceidx: 0,
    lowsalary:'',
    highsalary: '',
    negotiate: 1,
    content: '',
    workArray: ['远程办公', '驻场办公'],
    workIndex: 0,
    expArray: ['不限', '应届生', '1年以内', '1-3年', '3-5年', '5-10年', '10年以上'],
    expIndex: 3,
    eduArray: ['不限', '中专及以下', '高中', '大专', '本科', '硕士', '博士'],
    eduIndex: 4,
    type:1,
    bottom:120,
    cityId:'',
    //当前编辑状态
    status:null
  },

  checkPrice: function () {
    this.setData({ showBox: true })
  },
  cancelBox: function () {
    this.setData({ showBox: false })
  },
  fillPrice: function (e) {
    var _price = e.detail.value;
    this.setData({ price: _price, lowsalary: _price, highsalary: _price })
  },

  //价格区间选中
  bindChange: function (e) {
    var that = this;
    var _index = e.detail.value;
    if (_index == 0) {
      that.setData({ negotiate: 1,priceidx: _index });
    } else {
      that.setData({ negotiate: 0, priceidx: _index, lowsalary: this.data.priceList[_index].low, highsalary: this.data.priceList[_index].high });
    }
  },
  //工作方式
  workChange: function (e) {
    var value = e.detail.value;
    this.setData({
      workIndex: value, work_way: parseInt(value) + 1, negotiate:0})
  },
  //经验
  expChange:function(e){
    var value = e.detail.value;
    this.setData({ expIndex: value})
  },
  //学历
  eduChange: function (e) {
    var value = e.detail.value;
    this.setData({ eduIndex: value})
  },
  getFormId: function (e) {
    var formid = e.detail.formId;
    app.addformId(formid)
  },
  //技能选择
  chooseSkill: function () {
    var that = this;
    if (that.data.oldJobId == that.data.jobData.jobId) {
      var typeidList = that.data.jobData.jobId;
    } else {
      var typeidList = that.data.oldJobId;
      that.setData({
        tagData: []
      })
    }
    var typeid = typeidList.toString().substring(0, 4) +'00';
    if (that.data.jobData.jobIdTwo) {
      typeid = that.data.jobData.jobIdTwo
    }
    wx.navigateTo({
      url: '/pages/picker/abilityPicker?typeId=' + typeid + '&tagData=' + JSON.stringify(that.data.tagData),
    })
  },
  //删除职位
  delJob:function(){
    var that=this;
    wx.showModal({
      title: '是否删除该职位',
      content: '删除之后该职位将不能恢复',
      showCancel:true,
      cancelText:'考虑一下',
      confirmText:'我意已决',
      success:function(res){
        if (res.confirm) {
          bm.requsetData('/b/position/delete', 'post', { id: that.data.id }, function (res) {
            if (!res.data.errcode) {
              wx.reLaunch({
                url: '/pages/business/demand',
              })
            } else {
              wx.showToast({
                title: res.data.errmsg,
                icon: 'none'
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  saveJob:function(){
    var that=this;
    if (!that.data.jobData.jobId) {
      wx.showToast({
        title: '请选择职位标类型',
        icon: 'none',
      })
      return false;
    }
    if (!that.data.title) {
      wx.showToast({
        title: '请填写职位标题',
        icon: 'none',
      })
      return false;
    }
    if (!that.data.content) {
      wx.showToast({
        title: '请填写职位描述',
        icon: 'none',
      })
      return false;
    }
    if (!that.data.negotiate){
      if (!that.data.lowsalary || that.data.lowsalary == '') {
        wx.showToast({
          title: '请选择薪资区间',
          icon: 'none'
        })
        return false;
      }
      if (!that.data.highsalary || that.data.highsalary == '') {
        wx.showToast({
          title: '请选择薪资区间',
          icon: 'none'
        })
        return false;
      }
    }
    var linkUrl ='/b/position/update';
    var query = { id: that.data.id, work_way: that.data.work_way, profession: that.data.jobData.jobId, lowsalary: that.data.lowsalary, highsalary: that.data.highsalary, title: that.data.title, unit: that.data.unit, content: that.data.content, negotiate: that.data.negotiate, work_address: that.data.work_address, skills: that.data.tagData, work_year: that.data.expIndex, education: that.data.eduIndex, area: that.data.cityId,}
    var status = that.data.status
    if(status == 4){
      wx.showModal({
        title: '是否确认提交？',
        content: '保存后将自动提交审核',
        success:function(_res){
          if (_res.confirm){
            bm.requsetData(linkUrl, 'post', query, function (res) {
              if (!res.data.errcode) {
                wx.showToast({
                  title: '保存成功',
                  success: function () {
                    setTimeout(function () {
                      wx.navigateBack();
                      wx.setStorageSync("isRefresh", 1)
                      var currentPages = getCurrentPages(),
                        _this = currentPages[currentPages.length - 2];
                      _this.getdata();
                    }, 1500)
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
      bm.requsetData(linkUrl, 'post', query, function (res) {
        if (!res.data.errcode) {
          wx.showToast({
            title: '保存成功',
            success: function () {
              setTimeout(function () {
                wx.navigateBack();
                wx.setStorageSync("isRefresh", 1)
                var currentPages = getCurrentPages(),
                  _this = currentPages[currentPages.length - 2];
                _this.getdata();
              }, 1500)
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
  getFormId: function (e) {
    var formid = e.detail.formId;
    app.addformId(formid)
  },

  switchPrice:function(){
    var that=this;
    var _lowprice = that.data.lowsalary;
    switch (_lowprice){
      case 50000:
        that.setData({ priceidx:6});
        break;
      case 20000:
        that.setData({ priceidx:5});
        break;
      case 10000:
        that.setData({ priceidx:4});
        break;
      case 5000:
        that.setData({ priceidx:3});
        break;
      case 1000:
        that.setData({ priceidx: 2 });
        break;
      default:
        if (that.data.negotiate==1){
          that.setData({ priceidx:0});
        }else{
          that.setData({ priceidx:1});
        }
        break;
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
onLoad: function (options) {
    var that = this;
  var status = options.status
    bm.requsetData('/b/position/getinfo', 'get', { id: options.id }, function (res) {
      if (!res.data.errcode) {
        var _data = res.data.info;
        that.setData({
          id:_data.id,
          jobData: { jobId: _data.profession, jobIdTwo: '', jobName: _data.profession_name },
          oldJobId: _data.profession,
          title: _data.title,
          work_address: _data.work_address,
          workIndex: _data.work_way - 1,
          work_way: _data.work_way,
          tagData: _data.skills,
          lowsalary: _data.lowsalary,
          highsalary: _data.highsalary,
          expIndex: _data.work_year,
          eduIndex: _data.education,
          content: _data.content,
          negotiate: _data.negotiate,
          price: _data.lowsalary,
          status: status
        })
        that.switchPrice();
      } else {
        wx.showToast({
          title: res.data.errmsg,
          icon: 'none'
        })
      }
    })
  }
})