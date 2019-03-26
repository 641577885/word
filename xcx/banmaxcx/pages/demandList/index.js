// pages/demandList/index.js
var bm = require("../../utils/common.js")
const Page = require('../../utils/ald-stat.js').Page;
var app=getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    empty_text_01:'',
    empty_text_02: '',
    empty_text_03:'',
    showCantainer:false,
    showBox:false, //显示盒子
    fwlist: [],//服务列表
    fwindex:0, //服务标签
    demandList:[],
    demandId:1000,
    checkArr:[],
    skills:[],
    list:[],
    page:1,
    F5flag: "true",//定义刷新按钮的状态是否显示
    sortlist: [
      {
        id: 'ctime-desc',
        data: "推荐"
      },
      {
        id: 'recommend',
        data: "最新"
      }
    ],
    sortidx:0,
    priceList: [ //金额
      {
        id: 0,
        data: "不限",
        low:'',
        high:''
      },
      {
        id: 1,
        data: "1K以下",
        low: '',
        high: '999'
      },
      {
        id: 2,
        data: "1K-5K",
        low: '1000',
        high: '4999'
      },
      {
        id: 3,
        data: "5K-10K",
        low: '5000',
        high: '9999'
      },
      {
        id: 4,
        data: "10K-20K",
        low: '10000',
        high: '19999'
      },
      {
        id: 5,
        data: "20K以上",
        low: '20000',
        high: ''
      }
    ],
    priceidx:0,
    sort:'',
    lowsalary:'',
    highsalary:'',
    pullup: true,
    // 添加
    showlist:false,
    showcontanier:true,
    swiperIndex: 0,
    index: 0,
    snenicCards: ["111", "222", "111", "111", "111", "111"],
    skill: [{ id: 1, name: 'Photoshop' }, { id: 2, name: 'Java' }, { id: 3, name: 'Dw' },],
    price: '￥1000',
    array: [{ profession: 0, profession_name: '电商' }, { profession: 1, profession_name: '前端' }, { profession: 2, profession_name: 'php' },],
    index: 0,
    profession: 0,
    content: '此处填写岗位描述信息此处填写岗位描述信息此处填写岗位描述信息此处填写岗位描述信息此处填写岗位描述信息',
    ispro: false,

  },
  //卡片切换时改变index值
  swiperChange(e) {

    console.log(e.detail.current)
    this.setData({
      swiperIndex: e.detail.current
    })
    if (this.data.listlength - 1 == this.data.swiperIndex) {
      //说明已经刷新到最后一张，要显示刷新功能
      this.setData({
        F5flag: false
      })
    } else {
      //说明不再最后一张，不显示刷新功能
      this.setData({
        F5flag: true
      })
    }
  },
  swiperClick:function(e){
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/details/xqDetails?id='+id+'',
    })
  },
  //盒子显示隐藏
  checkBox:function(){
    this.setData({ showBox: true})
  },
  closeBox: function () {
    this.setData({ showBox: false});
    this.resetCheck();
  },
  //获取分类数据
  getDemandList:function(){
    var that=this;
    bm.requsetData("/c/config/demand_cat","get","",function(res){
      for (var i in res.data){
        for (var j in res.data[i].son){
          if (that.data.checkArr.indexOf(res.data[i].son[j].id) != -1){
            res.data[i].son[j].checked=true;
          }else{
            res.data[i].son[j].checked = false;
          }
        } 
      }
      that.setData({ demandList: res.data })
    })
  },

  //选择一级分类
  checkdemand:function(e){
    var _id = e.target.id;
    this.setData({ demandId: _id })
  },
  //选择二级分类
  checkItem: function (e) {
    var that=this;
    var _id = e.currentTarget.dataset.id;
    if (that.data.checkArr==5){
      wx.showToast({
        title: '只能选择5个服务标签',
        icon:'none'
      })
      return fasle;
    }
    if (that.data.checkArr.indexOf(_id)!=-1){
      var idx = that.data.checkArr.indexOf(_id);
      that.data.checkArr.splice(idx, 1)
      that.setData({ checkArr: that.data.checkArr })
    } else {
      that.data.checkArr.push(_id);
    }
    for (var i in that.data.demandList) {
      for (var j in that.data.demandList[i].son) {
        if (that.data.checkArr.indexOf(that.data.demandList[i].son[j].id) != -1) {
          that.data.demandList[i].son[j].checked = true;
        } else {
          that.data.demandList[i].son[j].checked = false;
        }
      }
    }
    that.setData({ checkArr: that.data.checkArr, demandList: that.data.demandList })
  },
  submitCheck: function () {
    if (this.data.checkArr.length>0){
      this.setData({ skills: this.data.checkArr, page: 1 })
      this.getListInfo();
    }else{
      this.setData({ skills: [], page: 1 })
      this.getListInfo();
    }
    this.setData({ showBox: false });
  },
  checkfw:function(e){
    var _index=e.detail.value;
    if (this.data.fwlist[_index].id==0){
      var arr=[];
    }else{
      var arr =[this.data.fwlist[_index].id];
    }
    this.setData({ skills: arr, fwindex: _index,page:1 })
    this.resetCheck();
    this.getListInfo();
  },

  checksoft: function (e) {
    //卡片的current清0
    //page清0
    this.setData({
      zero: 0,
      page: 1
    })
    var that=this;
    var _index = e.detail.value;
    this.setData({ sortidx: _index, sort: this.data.sortlist[_index].id, page: 1 });
    this.getListInfo();
  },
  checkprice: function (e) {
    //卡片的current清0
    //page清0
    this.setData({
      zero: 0,
      page: 1
    })
    var _index = e.detail.value;
    this.setData({ priceidx: _index, lowsalary: this.data.priceList[_index].low, highsalary: this.data.priceList[_index].high, page: 1});
    this.getListInfo();
  },

  //获取列表
  getListInfo:function(flag){
    var that=this;
    var query = { limit: 5, page: that.data.page};
    if (that.data.lowsalary!=""){
      query.lowsalary = that.data.lowsalary;
    }
    if (that.data.highsalary != "") {
      query.highsalary = that.data.highsalary;
    }
    if (that.data.skills.length != 0) {
      query.skills = that.data.skills;
    }
    if (that.data.sort != "") {
      query.sort = that.data.sort;
    }
    bm.requsetData("/w/demand/lists","get",query,function(res){
      if(!res.data.errcode){
        for (var i in res.data.list){
          res.data.list[i].ctime = bm.formatDate(res.data.list[i].ctime)
        }
        // 2018.08.10新增判断--西瓜，
        if (res.data.is_release == 1) {
          that.setData({
            empty_text_01: '当前标签下没有需求发布',
            empty_text_02: '请选择其他标签搜索',
            empty_text_03: '邀请好友发布外包需求',
            clickurl: '/pages/share/sharegu',
          })
        } else {
          that.setData({
            empty_text_01: '完善个人简历，丰富期望职位你可以看到更多需求',
            empty_text_03: '完善个人简历',
            clickurl: '/worker/my/myresume',
          })
        }
        var arr = [{ id: 0, name: "全部" }];
        for (var i in res.data.choose_list) {
          arr.push({id:i,name:res.data.choose_list[i]})
        }
        if (flag) {
          for (var i in res.data.list) {
            that.data.list.push(res.data.list[i])
          }
          that.setData({ fwlist: arr, list: that.data.list });
        }else{
          that.setData({ fwlist: arr, list: res.data.list });
        }
        console.log(that.data)
        that.setData({ showCantainer:true});
        var listlength = that.data.list.length;
        that.setData({
          listlength: listlength
        })
        if (that.data.listlength - 1 == that.data.swiperIndex) {
          //说明已经刷新到最后一张，要显示刷新功能
          that.setData({
            F5flag: false
          })
        } else {
          //说明不再最后一张，不显示刷新功能
          that.setData({
            F5flag: true
          })
        }
        if (res.data.list.length<=0){
          wx.showToast({
            title: '没有更多数据',
            icon:'none'
          })
        }
      }else{
        wx.showToast({
          title: res.data.errmsg,
          icon:'none'
        })
      }
    })
  },
  F5Click: function () {

     var pages =++this.data.page;
     this.setData({
       page: pages
     })
      this.getListInfo(true);
  },
  //切换卡片判断
  swiperChange(e) {

    console.log(e.detail.current)
    this.setData({
      swiperIndex: e.detail.current
    })
    if (this.data.listlength - 1 == this.data.swiperIndex) {
      //说明已经刷新到最后一张，要显示刷新功能
      this.setData({
        F5flag: false
      })
    } else {
      //说明不再最后一张，不显示刷新功能
      this.setData({
        F5flag: true
      })
    }
  },
  //重置信息
  resetCheck:function(){
    var that=this;
    for (var i in that.data.demandList) {
      for (var j in that.data.demandList[i].son) {
        that.data.demandList[i].son[j].checked = false;
      }
    }
    that.setData({ checkArr: [], demandList: that.data.demandList })
  },

  //加载更多
  getMorelist:function(){
    this.data.page++;
    this.getListInfo(true);
    console.log(this.data.page)
  },

  //获取formid
  getFormId: function (e) {
    var formid = e.detail.formId;
    app.addformId(formid)

    // 添加
    this.setData({ showlist: false })
    this.setData({ showcontanier: true })
  },

  //监听距顶部滑动距离
  // onPageScroll: function (e) {
  //   if (e.scrollTop >= 100) {
  //     this.setData({ pullup: true })
  //   }
  //   if (e.scrollTop == 0) {
  //     this.setData({ pullup: false })
  //   }
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.removeStorageSync("isfwRefresh");
    wx.removeStorage({
      key: 'judges',
      success: function (res) {
        console.log(res.data)
      }
    })
    this.getDemandList();
    this.getListInfo();
  },
  //下拉监听
   onPullDownRefresh:function(){
    // this.setData({ pullup: false})
    // this.setData({ pullup: true })
    this.setData({
      page:0
    })
    wx.stopPullDownRefresh();
    this.getDemandList();
    this.getListInfo();
   },
  onReachBottom() {
    this.getMorelist();
  },
  onShow: function () {
    let that=this;
    wx.getStorage({
      key: 'judges',
      success: function (res) {
        if (res.data) {
          that.onLoad();
        }
      }
    });
    var isfwRefresh = wx.getStorageSync("isfwRefresh");
    if (isfwRefresh) {
      wx.removeStorageSync("isfwRefresh");
      that.onLoad();
    }
  },


  //添加部分
  checkBoxfirst:function(){
    if (this.data.showlist==false){
      this.setData({ showlist: true })
      this.setData({ showcontanier: false })
    }else{
      this.setData({ showlist: false })
      this.setData({ showcontanier: true })
    }
    
     
  },
  swiperChange(e) {

    this.setData({
      swiperIndex: e.detail.current,


    })
    // console.log(this.data.swiperIndex)
  },
  bindPickerChange: function (e) {
    var aid = this.data.array[e.detail.value].profession;
    this.setData({ index: aid })
  },
  checkBox: function () {
    this.setData({ showBox: true })
  },
  closeBox: function () {
    this.setData({ showBox: false });
    this.resetCheck();
  },
  maskClick: function (e) {
    var that = this
    var id = e.currentTarget.dataset.id
    console.log(this.data,id)
    bm.requsetData('/c/demand/get', 'get', { id: id }, function (res) {
      console.log(res.data.errcode)
      if (res.data.errcode != 30702) {
        wx.navigateTo({
          url: '/pages/details/xqDetails?id=' + id + '&navtype=0',
        })
      } else {
        if (res.data.errcode == 30702) {
          that.setData({
            showVip: 1
          })
        }
    }
    }, false)
  },
  nomask: function (e) {
    this.setData({
      showVip: ""
    })
  },
  openvip: function (e) {
    wx.navigateTo({
      url: '/pages/openvip/openvip',
    })
  },
  // 邀请和简历跳转点击跳转
  clickSkip: function () {
    let that = this;
    let judge = 1;
    wx.setStorage({
      key: "judges",
      data: true
    })
    wx.navigateTo({
      url: that.data.clickurl,
    })
  }
})