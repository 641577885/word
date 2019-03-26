// pages/worker/details/job.js
const bm = require('../../utils/common.js')
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
    demand:{},
    company:{},
    seller: {},
    open_status:1,
    isShowDialog: true,
    publisher_name: '风雪',
    company_name: '力石科技2',
    position: '人力资源总监',
    active: '刚刚活跃',
    
    //经度
    long: 119.94662,
    // 纬度
    lat: 30.276321,
    place:'555555',
    mapshow:false,

    company_add: '',

    rec:[
      {
        rec_name:'产品经理',
        rec_price:'10k－20k',
        rec_info:'杭州 ｜ 西兴 ｜ 3-5年 ｜大专',
        rec_company:'杭州白财金融信息服务有限公司 A轮',
        rec_pos:'王新－CTO',
        rec_time:'04月02日',
        rec_online:true
      },
      {
        rec_name: '产品经理1',
        rec_price: '10k－20k1',
        rec_info: '杭州 ｜ 西兴 ｜ 3-5年 ｜大专1',
        rec_company: '杭州白财金融信息服务有限公司 A轮1',
        rec_pos: '王新－CTO1',
        rec_time: '04月02日1',
        rec_online: false
      },
    ],
    //底部弹出框
    actionSheetHidden: true,
    actionSheetItems: [
      { bindtap: 'Menu1', txt: '生成朋友圈分享图' },
      { bindtap: 'Menu2', txt: '转发给好友或群聊' },
    ],
    menu: '',
    //未填写公司隐藏
    company_hide:true,
    //返回首页按钮
    navtype:0
  },
  //跳转需求页
  editDemand:function(){

    wx.navigateTo({
      url: 'demandEdit?id=' + this.data.demand.id + '&status='+this.data.demand.status
    })
  },
  //开关需求
  opDemand: function (e) {
    var that = this;
    var isopen = e.target.dataset.status;
    var mcontent, mdetail, tip,openstatus;
    if (isopen == 0) {
      mcontent = "是否关闭该需求";
      mdetail = "关闭之后该需求将不显示在需求列表";
      tip = '关闭成功';
      openstatus=3;
    } else {
      mcontent = "是否开启该需求";
      mdetail = "开启之后该需求将显示需求列表";
      tip = '开启成功';
      openstatus = 2;
    }
    wx.showModal({
      title: mcontent,
      content: mdetail,
      showCancel: true,
      cancelText: '取消',
      confirmText: '确定',
      success: function (res) {
        if (res.confirm) {
          bm.requsetData('/b/demand/open_status', 'post', { id: that.data.demand.id, is_open: isopen }, function (res) {
            if (!res.data.errcode) {
              wx.showToast({
                title: tip,
                success: function () {
                  that.setData({ open_status: openstatus })
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
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  golocation: function () {
    var _that = this
    var add = _that.data.company_add
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

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({ role: app.globalData.role, uid: app.globalData.uid, id: options.id })
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
    bm.requsetData('/c/demand/get', 'get', { id: that.data.id }, function (res) {
      console.log(res)
      if (!res.data.errcode) {
        if (res.data.company.lenmgth>0){
          if (res.data.company.address.length == 0) {
            var add = '暂未填写地址'
          } else {
            var add = res.data.company.address
          }
        }else{
          var add = ''
          that.setData({
            company_hide:false
          })
        }
        if (res.data.seller.id != uid){
          that.setData({
            navtype:1
          })
        }
        if (res.data.seller.avatar != "https://bm.jiangcdn.com/banma/avatar.jpg" && res.data.seller.avatar.indexOf("https://wx.qlogo.cn") == -1) {
          res.data.seller.avatar = res.data.seller.avatar + '@!200'
        }
        that.setData({
          demand: res.data.demand,
          seller: res.data.seller,
          company: res.data.company,
          open_status: res.data.demand.status,
          company_add: add,
          id: res.data.demand.id
        })
        wx.setNavigationBarTitle({
          title: res.data.demand.profession_name,
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
    bm.requsetData('/c/action/getShareKey', 'post', { scence: 'demand', obj_id: id }, function (data) {
      console.log(data)
    })
    wx.navigateTo({
      url: '/pages/share/sharedemand?id=' + id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })

  },
  //项目审核未通过提示
  nosuccess: function () {
    if (this.data.open_status == 1 || this.data.open_status == 4) {
      var title = "需求审核未通过"
    }
    if (this.data.open_status == 3) {
      var title = "当前需求已关闭"
    }
    wx.showToast({
      title: title,
      icon: 'none'
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (ops) {
    var that = this
    that.actionSheetbindchange()
    bm.requsetData('/c/action/getShareKey', 'post', { scence: 'demand', obj_id: that.data.id }, function (data) {
      console.log(data)
    })
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
      return {
        title: that.data.demand.title + '-'+that.data.demand.price+'元-支持外包',
        path: 'pages/details/xqDetails?id=' + this.data.id,
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