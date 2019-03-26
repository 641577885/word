// pages/worker/details/job.js
const bm=require('../../utils/common.js')
const Page = require('../../utils/ald-stat.js').Page;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:null,
    uid:Number,
    role:0,
    position:{},
    company:{},
    seller:{},
    is_open:true,
    open_status:1,
    edu_name:'',
    //经度
    long: null,
    // 纬度
    lat: null,
    isShowDialog: true,
    place:'555555',
    mapshow:false,
    company_add:'',

    rec:[],
    //底部弹出框
    actionSheetHidden: true,
    actionSheetItems: [
      { bindtap: 'Menu1', txt: '生成朋友圈分享图' },
      { bindtap: 'Menu2', txt: '转发给好友或群聊' },
    ],
    menu: '',
    //返回按钮
    navtype:0
  },
  //跳转编辑
  editJob:function(){
    wx.navigateTo({
      url: 'jobEdit?id=' + this.data.position.id + '&status='+this.data.position.status,
    })
  },
  //开关职位
  opJob:function(e){
    var that=this;
    var isopen = e.target.dataset.status;
    var mcontent, mdetail, tip;
    if (isopen==0){
      mcontent ="是否关闭该职位";
      mdetail ="关闭之后该职位将不显示在职位列表";
      tip='关闭成功';
    }else{
      mcontent = "是否开启该职位";
      mdetail = "开启之后该职位将显示职位列表";
      tip = '开启成功';
    }
    wx.showModal({
      title: mcontent,
      content: mdetail,
      showCancel: true,
      cancelText: '取消',
      confirmText: '确定',
      success: function () {
        bm.requsetData('/b/position/open_status', 'post', { id: that.data.position.id, is_open: isopen }, function (res) {
          if (!res.data.errcode) {
            wx.showToast({
              title: tip,
              success: function () {
                that.setData({ is_open: !that.data.is_open});
                wx.setStorageSync("isRefresh", 1)
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
    })
  },
  golocation:function(){
    var _that = this
    var add = _that.data.company_add
    if(add.length >0){
      wx.request({
        url: 'http://apis.map.qq.com/ws/geocoder/v1/?address=' + add + '&key=7WUBZ-6XNCG-RD7QM-I6DB4-U7UGS-WUFGB',
        success: function (data) {
          console.log(data)
          wx.openLocation({
            latitude: data.data.result.location.lat,
            longitude: data.data.result.location.lng,
            name: add,
            scale: 28
          })
        }
      })
    }
    
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({ uid: app.globalData.uid, role: app.globalData.role, id: options.id})
    if (app.globalData.auth) {
      that.getdata()
    } else {
      app.authCallback = auth => {
        if (auth == 0) {
          that.setData({
            isShowDialog: false
          })
        }
      }
      that.getdata()
    }
  },
  getdata:function(){
    var that = this
    var uid = that.data.uid
    bm.requsetData('/c/position/get', 'get', { id: that.data.id }, function (res) {
      console.log(res)
      if (!res.data.errcode) {
        if (res.data.position.status == 3) {
          that.setData({ is_open: false })
        }
        if (res.data.position.status == 2) {
          that.setData({ open_status: false })
        }
        if (res.data.position.work_address.length == 0) {
          var add = '暂未填写地址'
        } else {
          var add = res.data.position.work_address
        }
        if (res.data.position.education_name.length == 0) {
          var edu_name = '不限'
        } else {
          var edu_name = res.data.position.education_name
        }
        if (res.data.position.work_way==2){
          res.data.position.lowsalary = res.data.position.lowsalary / 1000;
          res.data.position.highsalary = res.data.position.highsalary / 1000;
        }
        if (res.data.seller.id != uid){
          that.setData({
            navtype:1
          })
        }
        res.data.company.logo = res.data.company.logo + '@!200'
        that.setData({
          position: res.data.position,
          seller: res.data.seller,
          company: res.data.company,
          company_add: add,
          id: res.data.position.id,
          edu_name: edu_name
        })
        wx.setNavigationBarTitle({
          title: res.data.position.profession_name,
        })
      } else {
        wx.showToast({
          title: res.data.errmsg,
          icon: 'none'
        })
      }
    })

  },
  //底部弹出框
  actionSheetTap: function () {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  actionSheetbindchange: function () {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  bindMenu1: function () {
    this.setData({
      menu: 1,
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  bindMenu2: function () {
    this.setData({
      menu: 2,
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  goimg: function () {
    var that = this
    var id = that.data.id
    this.actionSheetbindchange()
    bm.requsetData('/c/action/getShareKey', 'post', { scence: 'position', obj_id: id }, function (data) {
      console.log(data)
    })
    wx.navigateTo({
      url: '/pages/share/shareposition?id=' + id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })

  },
  //项目审核未通过提示
  nosuccess:function(){
    if (this.data.position.status == 1 || this.data.position.status == 4){
      var title ="职位审核未通过"
    }
    if (this.data.position.status == 3) {
      var title = "当前职位已关闭"
    }
    wx.showToast({
      title: title,
      icon:'none'
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (ops) {
    var that = this
    var position = that.data.position
    if (position.work_way == 1 && position.negotiate == 0){
      var price = that.data.position.lowsalary + '元'
    } else if (position.work_way == 2 && position.negotiate == 0){
      var price = that.data.position.lowsalary + 'K-' + that.data.position.highsalary + 'K'
    }
    if (position.negotiate == 1){
      var price = '薪资面议'
    }
    console.log(price)
    that.actionSheetbindchange()
    bm.requsetData('/c/action/getShareKey', 'post', { scence: 'position', obj_id: that.data.id }, function (data) {
      console.log(data)
    })
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
      return {
        title: that.data.position.profession_name + '-' + price + '-支持外包',
        path: 'pages/details/zwDetails?id=' + this.data.id,
        success: function (res) {
          // 转发成功
          console.log("转发成功:" + JSON.stringify(res));
        },
        fail: function (res) {
          // 转发失败
          console.log("转发失败:" + JSON.stringify(res));
        }
      }
    }

  },
})