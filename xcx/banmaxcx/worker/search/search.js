 // 请求公用方法文件
const bm = require('../../utils/common.js')
const Page = require('../../utils/ald-stat.js').Page;
var app = getApp();
Page({
  data: {
    logo:'/images/gslogo.png',
    empty_text_01: '',
    empty_text_02: '暂时没有找到相关信息。',
    hiddentext: false,
    hiddens: true,//筛选数据，没有数据时正常显示
    hiddenpart1: true,
    hiddenpart2: true,
    hiddenpart3: true,
    current1: 0,     //外部整体切换
    tabtab:0,          //内部切换
    tab: 0,          //左右切换
    id: 0,
    buts: false,    //服务
    hidden: false,   //下拉框的显示隐藏
    salary: 0,          //薪水开关
    salary2: 0,          //薪水开关
    ispro: false,       //是否在请求中 
    page: 1,            //页数，开始是1从第一页开始请求
    page2: 1,          //页数，开始是1从第一页开始请求
    page3: 1,         //页数，开始是1从第一页开始请求
    limit: 6,              //请求的个数，可自定义设置
    isnext: true,       //是否有下一页
    list1: [],                //接口列表
    list2: [],                //接口列表
    list3: [],                //接口列表
    listdata1: [],       //接口实际数据
    listdata2: [],       //接口实际数据
    listdata3: [],       //接口实际数据
    jn:[],
    indexs: 0, 
    indexss: 0, 
    jines: 0, 
    jiness: 0, 
   // 下拉内容数组
    tuijian: [ //推荐
      {
        id: 'recommend',
        data: "最新"
      },
      {
        id: 'ctime-desc',
        data: "推荐"
      },

    ],
    jine: [ //金额
      {
        id: 0,
        data: "不限",
        negotiate: 0,
        low: '',
        high: ''
      },
      {
        id: 1,
        data: "面议",
        negotiate: 1,
        low: '',
        high: ''
      },
      {
        id: 2,
        data: "1K以下",
        negotiate: 0,
        low: '0',
        high: '999'
      },
      {
        id: 3,
        data: "1K-3K",
        negotiate: 0,
        low: '1000',
        high: '3999'
      },
      {
        id: 4,
        data: "3K-5K",
        negotiate: 0,
        low: '3000',
        high: '4999'
      },
      {
        id: 5,
        data: "5K-10K",
        negotiate: 0,
        low: '5000',
        high: '9999'
      },
      {
        id: 6,
        data: "10K-20K",
        negotiate: 0,
        low: '10000',
        high: '19999'
      },
      {
        id: 7,
        data: "20K以上",
        negotiate: 0,
        low: '20000',
        high: '0'
      }
    ],
    sousuo: '请输入职位', //搜索
    salarymax: 0, ////最大金额
    salarymin: 0, ////最小金额
    tuijia: 'ctime-desc',//推荐
    tuijia2: 'ctime-desc', //推荐2
    jineng: 0,//技能
    jineng2: 0,//技能
    jine2max: 0, //需求最大金额
    jine2min: 0, //需求最小金额
    salarNegotiate:0,//是否面谈
    idzhiwei:120110
  },
  // 返回上一页的搜索
  butreturn: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  //外部整体切换
  tabBut: function (event) {
    var that = this;
    that.setData({ tabtab: 1 })
    that.setData({ hidden: false });
    that.setData({ current1: event.target.dataset.current });
    if (event.target.dataset.current==0){
      that.setData({ list1: [], hiddentext: false, salarNegotiate:0})
      that.position();//调取职位发送的函数
    } else if (event.target.dataset.current==1){
      that.setData({ list2: [], hiddentext: false, salarNegotiate: 0 })
      that.needData();//调取需求发送的函数
    } else if (event.target.dataset.current==2){
      that.setData({ list3: [], hiddentext: false })
      that.companyData();//调取公司发送的函数
    }
  },
  //滑动事件
  eventchange: function (event) {
    this.setData({ current1: event.detail.current })
  },
  // 下面都是点击单选按钮
  //推荐
  tuijianBut: function (event) {
    var that = this,
      itemId = event.detail.value,
      itemval = that.data.tuijian[itemId].id;
    that.setData({ tuijia: itemval, indexs: itemId })
    that.setData({ list1: [] }); that.position();
  },
  // 推荐2
  tuijianBut2: function (event) {
    var that = this,
      itemId = event.detail.value,
      itemval = that.data.tuijian[itemId].id;
    that.setData({ tuijia2: itemval, indexss: itemId})
    that.setData({ list2: [] }); that.needData();
  },
  //技能1
  jinengButo: function (event) {
    var that = this;
    that.setData({ jineng: event.detail.value })
    that.setData({ list1: [] }); that.position();
  },
  //技能2
  jinengButo2: function (event) {
    var that = this;
    that.setData({ jineng2: event.detail.value })
    that.setData({ list2: [] }); that.needData();
  },
  // 金额
  jineBut: function (event) {
    var that = this,
      itemId = event.detail.value;
    that.setData({ 
      salarymin: that.data.jine[itemId].high, 
      salarymax: that.data.jine[itemId].low,
      salarNegotiate: that.data.jine[itemId].negotiate,
      list1: [], jines: itemId
       })
     that.position();
  },
   //金额2
  jineBut2: function (event) {
    var that = this,
      itemId = event.detail.value,
      itemval = that.data.jine[itemId].data;
    that.setData({
      jine2min: that.data.jine[itemId].high, 
      jine2max: that.data.jine[itemId].low,
      salarNegotiate: that.data.jine[itemId].negotiate,
      list2: [], jiness: itemId
     })
   that.needData();
  },
  //点击结束
  getpull: function () {
    var that = this;
    that.setData({ page: 0, list1: []})//显示下拉结束加载
    wx.showToast({
      mask: true,
      title: '正在刷新',
      icon: 'loading',
      duration: 500
    })
    that.setData({ hiddentext: false })//显示下拉结束加载
    that.position();
  },
  getpull2: function () {
    var that = this;
    that.setData({ page2: 0, list2: [] })//显示下拉结束加载
    wx.showToast({
      mask: true,
      title: '正在刷新',
      icon: 'loading',
      duration: 500
    })
    that.setData({ hiddentext: false })//显示下拉结束加载
    that.needData();
  },
  getpull3: function () {
    var that = this;
    that.setData({ page3: 0, list3: [] })//显示下拉结束加载
    wx.showToast({
      mask: true,
      title: '正在刷新',
      icon: 'loading',
      duration: 500
    })
    that.setData({ hiddentext: false })//显示下拉结束加载
    that.companyData();
  },
  //下拉请求函数
  getpullData1: function () {
    var that = this,
      list = that.data.listdata1;
    if (that.pullBottom(list)) {
      that.setData({ page:that.data.page + 1})
      that.position();
    }
  },
  //下拉请求函数
  getpullData2: function () {
    var that = this,
      list = that.data.listdata2;
    if (that.pullBottom(list)) {
      that.setData({ page2: that.data.page2 + 1 })
      that.needData();
    }
  },
  getpullData3: function () {
    var that = this,
      list = that.data.listdata3;
    if (that.pullBottom(list)) {
      that.setData({ page3:that.data.page3 + 1 })
      that.companyData();
    }
  },
  //请求函数
  pullBottom: function (list) {
    var that = this;
    if (!that.data.ispro) {//没有在请求中，开始加载数据
      if (list.pages.allpage > list.pages.page) {//有下一页数据
        wx.showToast({
          mask: true,
          title: '加载中...',
          icon: 'loading',
          duration: 500
        })
        that.setData({ hiddentext: false })//显示下拉结束加载
        that.setData({ ispro: false })//标记在请求中
        return true;
      } else {
        wx.showToast({
          mask: true,
          title: '加载中...',
          icon: 'loading',
          duration: 300,
        })
        that.setData({ hiddentext: true })//显示下拉结束加载
        that.setData({ ispro: false })//标记在请求中
        return false;
      }
    }
  },
  // 在线列表  	排序 recommend为推荐排序ctime-desc创建时间倒排 sort
  position: function () {
    var url = "/w/position/lists",
      that = this;
      var DataView = {
        work_way: 1, //类型
        sort: that.data.tuijia, //推荐
        skills: that.dataamend(that.data.jineng),//技能
        highsalary: that.data.salarymax, //金额 最大 
        lowsalary: that.data.salarymin, //金额 最小 
        negotiate: that.data.salarNegotiate,   //金额是否面议
        page: that.data.page2, //当前页码 
        limit: that.data.limit, //一页多少条数据
        keyword: that.data.sousuo               //搜索内容
      };
    that.getDataUrl(url, DataView);
  },
  // 坐班列表数据
  needData: function () {
    var url = "/w/position/lists",
      that = this;
      DataView = {
        work_way: 2, //类型
        sort: that.data.tuijia2, //推荐
        skills: that.dataamend(that.data.jineng2),//技能,//技能
        highsalary: that.data.jine2max, //需求最大金额
        lowsalary: that.data.jine2min, //需求最小金额
        negotiate: that.data.salarNegotiate,   //金额是否面议
        page: that.data.page3, //一页多少条数据
        limit: that.data.limit, //一页多少条数据
        keyword: that.data.sousuo               //搜索内容
      }
    that.getDataUrl2(url, DataView);
  },
  dataamend: function (wd) {
    var list = [];
    if (wd == 0) {
      return list = [];
    } else {
      list.push(this.data.jn[wd]);
      return list;
    }
  },
  //相关公司数据发送
  companyData:function(){
    var url = "/w/company/lists",
      that = this,
      DataView ={
        page: that.data.page3,                      //一页多少条数据
        limit: that.data.limit,                         //一页多少条数据
        keyword:that.data.sousuo               //搜索内容
      };
    that.getDataUrl3(url,DataView);
  },
  // 发送请求1 ajax请求数据  依据实际请求进行修改
  getDataUrl: function (url, getdata) {
    var that = this;
    bm.requsetData(url, 'get',getdata, function (data) {
      if (that.dataCompile(data.data)) {
      that.setData({listdata1: that.dataCompile(data.data) })
      that.timestampToTime(that.data.listdata1.list);
        var a = that.data.list1;
        for (var i in that.data.listdata1.list) {
          that.data.listdata1.list[i].lowsalary = that.data.listdata1.list[i].lowsalary;
          that.data.listdata1.list[i].highsalary = that.data.listdata1.list[i].highsalary;
          a.push(that.data.listdata1.list[i])
        }
        that.setData({ list1: a });
        if (that.data.listdata1.list=='') {
          that.setData({
            hiddenpart1: false,
            hiddentext: false }) }else{
          that.setData({ hiddenpart1: true })
          }
      }
    })
  },
  getDataUrl2: function (url, getdata) {
    var that = this;
    bm.requsetData(url, 'get',getdata, function (data) {
      that.setData({ listdata2: that.dataCompile(data.data) })
      if (that.dataCompile(data.data)) {
      that.timestampToTime(that.data.listdata2.list);
      var a = that.data.list2;
      for (var i in that.data.listdata2.list) {
        that.data.listdata2.list[i].lowsalary = that.data.listdata2.list[i].lowsalary;
        that.data.listdata2.list[i].highsalary = that.data.listdata2.list[i].highsalary;
        a.push(that.data.listdata2.list[i])
      }
      that.setData({ list2: a });
      if (that.data.listdata2.list == '') {
        that.setData({
          hiddenpart2: false,
          hiddentext: false }) } else {
        that.setData({ hiddenpart2: true })
      }
      }
    })
  },
  getDataUrl3: function (url, getdata) {
    var that = this;
    bm.requsetData(url, 'get', getdata, function (data) {
      if (that.dataCompile(data.data)){
      that.setData({ listdata3: that.dataCompile(data.data) })
      that.timestampToTime(that.data.listdata3.list); 
      var a = that.data.list3;
      for (var i in that.data.listdata3.list) {
        a.push(that.data.listdata3.list[i])
      }
      that.setData({ list3:a });
      if (that.data.listdata3.list == '') {
        that.setData({
          hiddenpart3: false,
          hiddentext: false }) } else {
        that.setData({ hiddenpart3: true })
      }
      }else{
        that.setData({
          hiddenpart3: false,
          hiddentext: false
        })
      }
    })
  },
  getDataUrl4: function (id) {
    var that = this;
    id = JSON.stringify(id); var b = '100';
    id = id.substr(0, id.length - 3).concat(b);
    var url = '/c/config/skill?id=' + id, list;
    bm.requsetData(url, 'post', list, function (data) {
      var jndata = that.data.jn;
      jndata = ["不限"];;
      for (var i in data.data) {
        jndata.push(data.data[i])
      }
      that.setData({
        jn: jndata
      })
    })
  },
  dataCompile:function(data){
    if (data.errcode == 0) {
      wx.showToast({
        mask: true,
        title: '正在刷新',
        icon: 'loading',
        duration: 500
      })
      return data;
    } else {
      wx.showToast({
        mask: true,
        title: data.errmsg,
        icon: 'none',
        duration: 3000
      })
      return false;
    }
  },
  timestampToTime: function (list) {
    for (var i in list) {
      list[i].ctime = bm.formatDate(list[i].ctime);
    }
  },
    //生命周期函数--监听页面加载
  onLoad: function (options) {
    var that = this;
    // 做了一个延时器，从而达到同步
    setTimeout(function () {
      that.setData({ ispro: false })//标记在请求中
    }, 200)
    //做一个获取url里面的参数
    if (options.goodValue !== undefined) {
      var goodValue = options.goodValue;
      that.setData({ sousuo: goodValue });
      that.position();//调取职位发送的函数
      that.companyData();//调取公司发送的函数
      that.needData();//调取需求发送的函数
      that.getDataUrl4(that.data.idzhiwei);
    } else {
      that.position();//调取职位发送的函数
      that.companyData();//调取公司发送的函数
      that.needData();//调取需求发送的函数
      that.getDataUrl4(that.data.idzhiwei);
    }
  }, 
})
