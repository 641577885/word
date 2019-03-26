//mocklist 模拟数据库数据表数据
const bm = require('../../utils/common.js')
const Page = require('../../utils/ald-stat.js').Page;
var app = getApp();
Page({
  data: {
    dianzan:0,
    uhide: 0,
    current1: 0,
    current2: 0,
    xin:true,
    logo:'/images/gslogo.png',
    current: 1,//页数，开始是1从第一页开始请求
    size: 12,//请求的个数，可自定义设置
    isnext: true,//是否有下一页
    list: [],//接口公司信息数据
    list2: [],//接口坐班列表数据
    list3: [],//接口在线列表数据
    list4: [],//接口在线列表数据
    id:0,
    ispro: false,//是否在请求中
    empty_text_01: '',
    empty_text_02: '暂时没有找到相关职位信息。',
    hiddentext: false,//底部加载
    page: 0,         //页数，开始是1从第一页开始请求
    page2: 0,        //页数，开始是1从第一页开始请求
    limit: 6,            //请求的个数，可自定义设置
    listdata:[],
    listdata2:[],
    hiddenpart:true,
    hiddenpart2:true,
    visitlist:[]
  },
  // 切换选项
  tab: function (event) {
    this.setData({ current1: event.target.dataset.current })
  },
  //滑动事件
  eventchange: function (event) {
    this.setData({ current1: event.detail.current })
  },
  //上拉请求函数
  getpullData: function () {
    var that = this,
      list = that.data.listdata;
    if (that.pullBottom(list)) {
      that.setData({
        page: that.data.page + 1
      })
      that.getDataUrl2();
    }
  },
  //上拉请求函数
  getpullData2: function () {
    var that = this,
      list = that.data.listdata2;
    if (that.pullBottom(list)) {
      that.setData({
        page2: that.data.page2 + 1
      })
      that.getDataUrl3();
    }
  },
  //请求函数
  pullBottom: function (list) {
    var that = this
    if (!that.data.ispro) { //没有在请求中，开始加载数据
      if (list.pages.allpage > list.pages.page) { //有下一页数据
        wx.showToast({
          mask: true,
          title: '加载中...',
          icon: 'loading',
          duration: 500
        })
        that.setData({
          hiddentext: false
        }) //显示下拉结束加载
        that.setData({
          ispro: false
        }) //标记在请求中
        return true;
      } else {
        wx.showToast({
          mask: true,
          title: '加载中...',
          icon: 'loading',
          duration: 300,
        })
        that.setData({
          hiddentext: true
        }) //显示下拉结束加载
        that.setData({
          ispro: false
        }) //标记在请求中
        return false;
      }
    }
  },
  //切换隐藏和显示 
  toggleBtn: function (event) {
    var that = this;
    var toggleBtnVal = that.data.uhide;
    var itemId = event.currentTarget.id;
    if (toggleBtnVal == itemId) {
      that.setData({
        uhide: 0
      })
    } else {
      that.setData({
        uhide: itemId
      })
    }
  },
  //函数请求
  getDataUrl: function () {
    var that = this,
    url='/w/company/info';
    //console.log(that.data.id,url);
    bm.requsetData(url, 'get', {id:that.data.id}, function (data) {
      console.log(data.data);
      var listDatas = that.listData(data.data);
      that.setData({ list: listDatas.company })
      that.setData({ visitlist: listDatas.visitlist })
      if (listDatas.company.logo!==''){
        that.setData({ logo: listDatas.company.logo })
        }
        that.setData({ xin: that.data.list.is_praise })
        that.setData({ dianzan: that.data.list.praises})
    })
  },
  getDataUrl2: function () {
    var that = this,
    url = '/w/position/lists';
    bm.requsetData(url, 'get', {company_id:that.data.id,work_way:2},function(data) {
      console.log(data.data);
     if (that.listData(data.data).list == '') { that.setData({ hiddenpart:false})} 
     that.timestampToTime(that.listData(data.data).list);    
     that.setData({ list2: that.listData(data.data).list })
     console.log(that.data.list2);
     that.setData({ listdata: that.listData(data.data)})
    })
  },
  getDataUrl3: function () {
    var that = this,
      url = '/w/position/lists'; 
    bm.requsetData(url, 'get', { company_id: that.data.id, work_way: 1 }, function (data) {
      console.log(data.data);
      if (that.listData(data.data).list == '') { that.setData({ hiddenpart2: false }) }
      that.timestampToTime(that.listData(data.data).list);         
      that.setData({ list3: that.listData(data.data).list })
      that.setData({ listdata2: that.listData(data.data) })
    })
  },
  getDataUrl4: function (ispraise) {
    var that = this,
      url = '/w/company/praiseComp';
    bm.requsetData(url, 'post',{id: that.data.id, ispraise: ispraise}, function (data) {
      console.log(data);
    })
  },
  timestampToTime: function (list) {
    for (var i in list) {
      list[i].ctime = bm.formatDate(list[i].ctime);
    }
  },
  //数据处理
  listData: function (data){
    if (data.errcode == 0) {
      wx.showToast({
        mask: true,
        title: '加载中...',
        icon: 'loading',
        duration: 500
      })
      //that.listData(data);
      //that.setData({ list:data.company })
      return data;
    } else {
      console.log(data);
      wx.showToast({
        mask: true,
        title: data.errmsg,
        icon: 'none',
        duration: 3000
      })
      return 0;
    }
  },
  //心形切换
  xinData:function(){
    var that = this;
    that.setData({ xin: (!that.data.xin)})
    if(!that.data.xin){
      var ispraise=1;
      that.getDataUrl4(ispraise);
      console.log(that.data.dianzan)
      console.log(that.data.dianzan - 1)
      that.setData({ dianzan: that.data.dianzan - 1 })
    }else{
      var ispraise =0;
      that.getDataUrl4(ispraise);
      console.log(that.data.dianzan)
      console.log(that.data.dianzan +1)
      that.setData({ dianzan: that.data.dianzan + 1 })
    }
  },
  //生命周期函数--监听页面加载
  onLoad: function (options) {
    var that = this;
    that.setData({
      id: options.goodValue
    })
    console.log(options.goodValue)
    that.getDataUrl();
    that.getDataUrl2();
    that.getDataUrl3();
  }
})

