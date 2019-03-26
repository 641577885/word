// pages/worker/details/job.js
const bm = require('../../utils/common.js')
var webim = require('../../utils/webim.js')
const Page = require('../../utils/ald-stat.js').Page;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:Number,
    demand:{},
    company:{},
    seller: {},
    company_add: '',
    lx_flag:true,
    //返回首页按钮
    navtype:1,
    isShowDialog: true,
    //底部弹出框
    actionSheetHidden: true,
    actionSheetItems: [
      { bindtap: 'Menu1', txt: '生成朋友圈分享图' },
      { bindtap: 'Menu2', txt: '转发给好友或群聊' },
    ],
    menu: '',
  },
  golocation: function () {
    var _that = this
    var add = _that.data.company_add
    wx.request({
      url: 'http://apis.map.qq.com/ws/geocoder/v1/?address=' + add + '&key=7WUBZ-6XNCG-RD7QM-I6DB4-U7UGS-WUFGB',
      success: function (data) {
        wx.openLocation({
          latitude: data.data.result.location.lat,
          longitude: data.data.result.location.lng,
          name: add,
          scale: 28
        })
      }
    })

  },
  link2Dialog: function () {
    var that = this;
    if (that.data.lx_flag) {
      that.setData({ lx_flag: false })
    }
    wx.setStorageSync('relationship', { sid: that.data.seller.id, id: that.data.id, profession: that.data.demand.profession, type: 2 })
    that.sendChatInfo();
    var add_friend_item = [
      {
        'To_Account': (that.data.seller.id).toString(),  //用户Id
        "AddSource": "AddSource_Type_Unknow",
        "AddWording": "" //加好友附言，可为空
      }
    ];
    var options = {
      'From_Account': (app.globalData.loginInfo.identifier).toString(),
      'AddFriendItem': add_friend_item
    };
    webim.applyAddFriend(
      options,
      function (resp) {
        app.getAllFriend();
        wx.navigateTo({
          url: '/message/dialog?skipid=' + that.data.seller.id,
          success: function () {
            that.setData({ lx_flag: true });
          }
        })
      },
      function (err) {
        if (err.ErrorInfo.indexOf('SNS_FRD_ADD_FRD_EXIST')) {
          app.getAllFriend();
          wx.navigateTo({
            url: '/message/dialog?skipid=' + that.data.seller.id,
            success: function () {
              that.setData({ lx_flag: true });
            }
          })
        } else {
          console.warn(err);
        }
      }
    );
  },
  sendChatInfo: function () {
    var that = this;
    bm.requsetData("/c/action/sendChatInfo", "post", { to_uid: that.data.seller.id, obj_id: that.data.id, type: "demand" }, function (res) {
      if (!res.data.errcode) {

      } else {
        wx.showToast({
          title: res.data.errmsg,
          icon: "none"
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    if (options.navtype){
      that.setData({
        navtype:0
      })
    }
    if (options.scene) {
      var scene = bm.GetParameter(decodeURIComponent(options.scene));
      that.setData({ id: scene.id });
    } else {
      that.setData({ id: options.id });
    }
    that.getdata()
    if (app.globalData.auth != null) {
      if (app.globalData.auth == 0) {
        that.setData({
          isShowDialog: false
        })
      }
    } else {
      app.authCallback = auth => {
        if (app.globalData.auth == 0) {
          that.setData({
            isShowDialog: false
          })
        }
      }
    }
  },
  getdata:function(){
    var that = this
    bm.requsetData('/c/demand/get', 'get', { id:that.data.id }, function (res) {
      console.log(res.data)
      if (!res.data.errcode) {
        if (res.data.company.length == 0 || res.data.company.address == "") {
          var add = '暂未填写地址'
        } else {
          var add = res.data.company.address
        }
        if (res.data.seller.avatar != "https://bm.jiangcdn.com/banma/avatar.jpg" && res.data.seller.avatar.indexOf("https://wx.qlogo.cn") == -1) {
          res.data.seller.avatar = res.data.seller.avatar + '@!200'
        }
        res.data.company.logo = res.data.company.logo + '@!200'
        that.setData({
          demand: res.data.demand,
          seller: res.data.seller,
          company: res.data.company,
          company_add: add
        })
        wx.setNavigationBarTitle({
          title: res.data.demand.profession_name,
        })
      } else {
        console.log(res.data)
        if (res.data.errcode == 30702) {
            that.setData({
              showVip:1
            })
        } else {
          wx.showToast({
            title: res.data.errmsg,
            icon: 'none',
            success: function () {
              setTimeout(function () {
                wx.navigateBack()
              }, 1000)
            }
          })
        }
       }
    },false)
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
      url: '/pages/share/sharedemand?id=' + id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })

  },
  onShareAppMessage: function (ops) {
    var that=this
    that.actionSheetbindchange()
    return {
      title: that.data.demand.title + ' ' + that.data.demand.price + '元 支持外包',
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
  },
  openvip: function () {
    wx.navigateTo({
      url: '/pages/openvip/openvip',
    })
    this.setData({ showVip: false })
  },
  // maskClick: function (e) {
  //   this.setData({ showVip: false })
  // },
  
})