// pages/index/index.js
var app = getApp();
const bm = require('../../utils/common.js')
const Page = require('../../utils/ald-stat.js').Page;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    jobData: { jobId: '', jobIdTwo: '', jobName: '' },
    selectList: [{ id: 0, workWay: 1, name: "远程办公" }, { id: 1, workWay: 3, name: "发布需求" }, { id: 2, workWay: 2,name:"驻场办公"}],
    checkIndex:0,
    showSilde:false, //显示侧边
    latitude:Number,
    longitude: Number,
    markers: [],
    latitudeArr:[],
    longitudeArr:[],
    avatar:"",
    priceList: [ //金额
      {
        id: 0,
        data: "面议",
        low: '',
        high: ''
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
        high: '5000000'
      }
    ],
    priceidx:0,
    negotiate:1,   //是否面议
    lowsalary: "1K", //最低价格
    highsalary: "2K", ///最高价格
    //总页面切换
    current: 2,
    //需求页面切换
    demand_curr: 1,
    //需求页01数据
    demand01_list: [],
    demand_c_id: null,
    //需求页02数据
    demand02_list: [],
    //需求页02标题
    demand02_title: '',
    //需求页03数据
    demand_03_array: ['面议', '1周', '2周', '3周', '1个月', '2个月', '3个月'],
    index: 0,
    mb_list: [
      {
        click: true,
        content: '模版1'
      },
      {
        click: false,
        content: '模版2'
      }
    ],
    xq_val: '需要此方面的专业人士完成此工作，具体需求细节、工期、价格可详谈',
    xq_textarea_val:'',
    //标题内容
    name_val:'',
    //预算
    money:0,
    textarea_length: 0,
    skills: '',
    isShowDialog: true,
    showRz:false,
    showLoad:false,
    showtip:false,
    p_flag:true,
    can_getuserinfo: 0,
    unread:false

  },
  //发布需求textarea获得焦点删除内容
  cleartextarea:function(){
    var that = this
    that.setData({
      xq_val:''
    })
  },
  //标题内容
  name_val:function(e){
    this.setData({
      name_val: e.detail.value
    })
  },
  //预算
  money: function (e) {
    this.setData({
      money: e.detail.value
    })
  },
  //tab切换
  tabSwitch:function(e){
    var _tab = e.target.dataset.check;
    if (_tab == 1 || _tab == 2 ) {
      if (app.globalData.auth < 1) {
        this.setData({ isShowDialog: false });
        return false;
      }
    }
    if (_tab == 2) {
      if (app.globalData.auth >0) {
        if (!app.globalData.certified) {
          this.setData({ showRz: true })
          return false;
        }
      }
    }
    this.setData({ checkIndex:_tab});
    
  },
  //隐藏认证
  hideShowRz:function(){
    this.setData({ showRz: false})
  },
  //企业认证
  goAuth:function(){
    var that=this;
    wx.navigateTo({
      url: '/business/auth/busAuth?type=1',
      success:function(){
        that.setData({showRz:false})
      }
    })
  },
  //侧边显示隐藏
  toggleSilder:function(){
    if (app.globalData.auth<1){
      this.setData({ isShowDialog: false });
    }else{
      this.setData({ showSilde: !this.data.showSilde })
    }
  },
  //跳转消息列表
  msgLink:function(){
    if (app.globalData.auth < 1) {
      this.setData({ isShowDialog: false });
    } else {
      wx.switchTab({
        url: '/pages/message/message',
      })
    }
  },

  //价格区间选中
  bindChange: function (e) {
    var that=this;
    var _index = e.detail.value;
    if (_index == 0) {
      that.setData({ negotiate:1 });
    }else{
      that.setData({ negotiate:0, priceidx: _index, lowsalary: this.data.priceList[_index].low, highsalary: this.data.priceList[_index].high });
    }
  },

  //获取当前位置
  getLocation:function(){
    var that=this;
    wx.getLocation({
      success: function(res) {
        that.setData({ latitude: res.latitude, longitude:res.longitude})
        that.getMarkers(30, -15, 15)
      },
    })
  },
  //获取随机分布点
  getMarkers: function(num, from, to) {
    var that=this;
    var arr = [], markers=[];
    for (var i = from; i <= to; i++){
      if(i>2 || i<-2){
        arr.push(i/10);
      }
      arr.sort(function () {
        return 0.5 - Math.random();
      });
    }
    for(var j=1;j<10;j++){
      markers.push({
        id: j,
        latitude: that.data.latitude+arr[j-1]*0.0115,
        longitude: that.data.longitude+arr[j]*0.0112,
        iconPath: '/images/icon.png',
        width: 45,
        height: 50
      })
    }
    that.setData({ markers: markers})
  },
  fillPrice:function(e){
    var _price=e.detail.value;
    this.setData({ price: _price})
  },
  hideKeyboard:function(){
    wx.hideKeyboard();
  },
  //发布职位
  zwPublish:function(e){
    var query = {}, that = this;
    if (app.globalData.auth < 1) {
      that.setData({ isShowDialog: false });
      return false;
    }
    if (query.work_way == 2) {
      if (!app.globalData.certified) {
        that.setData({ showRz: true })
        return false;
      }
    }
    query.profession = that.data.jobData.jobId;
    query.work_way = that.data.selectList[that.data.checkIndex].workWay;
    query.title = that.data.jobData.jobName;
    if (!query.profession){
      wx.showToast({
        title: '请选择岗位类型',
        icon: 'none'
      })
      return false;
    }
    if (query.work_way==1){
      query.lowsalary = that.data.price;
      query.highsalary = that.data.price;
      if (!that.data.price) {
        wx.showToast({
          title: '请输入薪资预算',
          icon: 'none'
        })
        return false;
      }
    }
    if (query.work_way == 2) {
      if (that.data.negotiate==1){
        query.negotiate=1;
      }else{
        query.lowsalary = that.data.lowsalary ? that.data.lowsalary:1;
        query.highsalary = that.data.highsalary;
      }
    }
    if (!that.data.p_flag) {
      return false;
    }
    that.setData({ p_flag: false });
    bm.requsetData("/b/position/create", "post", query, function (res) {
      if (!res.data.errcode) {
        if (res.data.type =="poslist"){
          wx.switchTab({
            url: '/pages/business/list'
          })
        }else{
          that.setData({ showLoad: true })
          setTimeout(function () {
            that.setData({ showtip: true })
            setTimeout(function () {
              wx.navigateTo({
                url: '/pages/index/pbDetail?id=' + res.data.id + '&title=' + that.data.jobData.jobName,
                success: function () {
                  that.setData({ p_flag: true });
                }
              })
            }, 500)
            that.setData({ showLoad: false })
          }, 3000)
        }
      } else {
        wx.showToast({
          title: res.data.errmsg,
          icon: 'none'
        })
        that.setData({ p_flag: true });
      }
    })
  },
  golink:function(e){
    var _id = e.currentTarget.id;
    if (_id =="userinfo"){
      wx.navigateTo({
        url: '/business/my/personInfo',
      })
    }
    if (_id == "message") {
      wx.switchTab({
        url: '/pages/message/message',
      })
    }
    if (_id == "worker") {
      wx.switchTab({
        url: '/pages/business/list',
      })
    }
    if (_id == "olwork") {
      wx.navigateTo({
        url: '/olwork/onlineList',
      })
    }
    if (_id == "package") {
      wx.navigateTo({
        url: '/wallet/mission',
      })
    }
    if (_id == "company") {
      wx.navigateTo({
        url: '/business/my/mycompany',
      })
    }
    if (_id == "wallet") {
      wx.navigateTo({
        url: '/pages/tcash/wallet',
      })
    }
    if (_id == "position") {
      wx.switchTab({
        url: '/pages/business/demand',
      })
    }
    if (_id == "account") {
      wx.switchTab({
        url: '/pages/business/mycentre',
      })
    }
    if (_id == "mission") {
      wx.navigateTo({
        url: '/wallet/mission',
      })
    }
    if (_id == "mycentre") {
      wx.switchTab({
        url: '/pages/business/mycentre',
      })
    }
    if (_id == "MiniProgram"){
      wx.navigateToMiniProgram({
        appId: 'wxd1e27439a32965eb',
        path: '',
        envVersion: 'release'
      })
    }
    
  },

  //demand_01点击事件
  click_demand_01: function (e) {
    var that = this
    var demand_02_id = e.currentTarget.dataset.demandid
    var demand01_list = that.data.demand01_list
    for (var i in demand01_list) {
      if (demand_02_id == i) {
        demand01_list[i].click = true
      }
      else {
        demand01_list[i].click = false
      }
    }
    that.setData({
      demand01_list: demand01_list
    })
    setTimeout(function () {
      that.setData({
        demand02_list: demand01_list[demand_02_id].son,
        demand02_title: demand01_list[demand_02_id].name,
        skills: demand01_list[demand_02_id].id,
        demand_c_id: demand_02_id,
        demand_curr: 2
      })
    }, 300)

  },
  //demand_02点击事件
  click_demand_02: function (e) {
    var that = this
    var demand02_list = that.data.demand02_list
    var demand_03_id = e.currentTarget.dataset.demandtwoid
    for (var i in demand02_list) {
      if (demand_03_id == i) {
        demand02_list[i].click = 'on'
      }
      else {
        demand02_list[i].click = ''
      }
    }
    that.setData({
      demand02_list: demand02_list
    })
    setTimeout(function () {
      that.setData({
        skills: demand_03_id,
        demand_curr: 3
      })
    }, 300)

  },
  //demand_03点击事件
  demand03_tab_click: function (event) {
    var that = this
    for (var i = 0; i < that.data.mb_list.length; i++) {
      if (event.currentTarget.id == i) {
        that.data.mb_list[i].click = true
      }
      else {
        that.data.mb_list[i].click = false
      }
    }
    that.setData({
      mb_list: that.data.mb_list,
    })
    if (event.currentTarget.id == 0) {
      that.setData({
        xq_val: '需要此方面的专业人士完成此工作，具体需求细节、工期、价格可详谈'
      })
    } else {
      that.setData({
        xq_val: '有关具体细节可详细沟通了解，工期、价格可详谈。'
      })
    }
  },
  bindnum: function (e) {
    var that = this
    that.setData({
      textarea_length: e.detail.value.length,
      xq_textarea_val: e.detail.value
    })
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  bindGetUserInfo: function (e) {
    var that = this;
    var data = e.detail.userInfo||null;
    if (data==null){
      //that.formsubmit();
      return false
    }
    bm.requsetData("/c/login/set_wxinfo", "post", { userinfo: data }, function (res) {
      if (!res.data.errcode) {
        app.setwebIMNick(data.nickName);
        app.setwebIMAvatar(data.avatarUrl);
        app.globalData.userinfo.avatar = data.avatarUrl;
        app.globalData.userinfo.name = data.nickName;
        that.setData({ userInfo: app.globalData.userinfo})
        that.formsubmit()
      } else {
        wx.showToast({
          title: res.data.errmsg,
          icon: "none"
        })
      }
    })
  },

  getSetting: function () {
    var that = this;
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          that.setData({
            can_getuserinfo: 1
          })
        } else {
          that.setData({
            can_getuserinfo: 0
          })
        }
      }
    })
  },
 
  formsubmit:function(){
    var that = this
    var title = that.data.name_val
    var content_val = that.data.xq_textarea_val
    var time = that.data.index
    var money = that.data.money
    var skills = [that.data.skills];
    var xq_val = that.data.xq_val
    //需求描述
    if (content_val.length==0){
      var content = xq_val
    }else{
      var content = content_val
    }
    if (title.length == 0) {
      wx.showToast({
        title: '请填写需求标题',
        icon: 'none'
      })
      return false
    }
    if (content.length == 0) {
      wx.showToast({
        title: '请填写需求描述',
        icon: 'none'
      })
      return false
    }
    if (money == 0) {
      wx.showToast({
        title: '请填写预算',
        icon: 'none'
      })
      return false
    }
    var query = { title: title, skills: skills, period: time, price: money, content: content };
    bm.requsetData('/b/demand/create', 'post', query, function (res) {
      if (!res.data.errcode) {
        wx.reLaunch({
          url: '/pages/index/pubSuccess',
        })
      } else {
        wx.showToast({
          title: res.data.errmsg,
          icon: 'none'
        })
      }
    })
  },
  //需求更改
  edit_demand: function () {
    var that = this
    that.setData({
      demand_curr: 1
    })
  },
  edit_demand_02: function () {
    var that = this
    that.setData({
      demand_curr: 2
    })
  },
  checkUnread:function(){
    this.setData({ unread: app.globalData.unread })
  },
  setAvatar: function () {
    if (app.globalData.auth > 0) {
      var avatar = app.globalData.userinfo.avatar;
      if (avatar != "https://bm.jiangcdn.com/banma/avatar.jpg" && avatar.indexOf("https://wx.qlogo.cn") == -1) {
        avatar = avatar + "@!200";
        this.setData({ avatar: avatar })
      }
      this.setData({ userInfo: app.globalData.userinfo, avatar: avatar })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.getSetting();
    if (options) {
      if (options.scene) {
        var scene = bm.GetParameter(decodeURIComponent(options.scene));
        app.globalData.inviter = scene.inviter;
      }
      if (options.inviter) {
        app.globalData.inviter = options.inviter;
      }
    }
    that.getLocation();
    if (app.globalData.auth) {
      that.setAvatar();
    } else {
      app.authCallback = auth => {
        that.setAvatar();
      }
    }
  },
  onShow: function () {
    var that=this;
    that.onLoad();
    //需求页01数据
    bm.requsetData('/c/config/demand_cat', 'get', '', function (data) {
      that.setData({
        demand01_list: data.data
      })
    }, true)
  }
})