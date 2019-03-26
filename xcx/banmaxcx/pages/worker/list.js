// pages/demandList/index.js
var bm = require("../../utils/common.js")
const Page = require('../../utils/ald-stat.js').Page;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    empty_text_01: '',
    empty_text_02: '',
    empty_text_03: '',
    clickurl:'',
    hiddenxyy: true,
    hiddentext: false, //没有更多了
    hiddenswcr: true, //选项卡切换开关
    showCantainer: false, //////
    current: 0, //在线坐班样式切换判断
    showBox: false, //显示盒子
    pullup: true, //上拉下拉样式开关
    arrayidx: 0, //头部筛选
    sortidx: 0, //最新筛选
    priceidx: 0, //金额筛选
    skillidx: 0, //技能筛选
    swiperIndex: 0, //选项卡
    judge: true, //切换判断
    hiddenzz: true, //在线坐班切换
    id:0,
    index: 0,
    sortlist: [ //推荐
      {
        id: 'ctime-desc',
        data: "推荐"
      },
      {
        id: 'recommend',
        data: "最新"
      }
    ],
    priceList: [ //金额
      {
        id: 0,
        data: "不限",
        negotiate : 0,
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
    skillList: [], //技能筛选
    hiddentext: false, //底部加载
    ispro: false, //是否在请求中
    page: 1, //页数，开始是1从第一页开始请求
    limit: 6, //请求的个数，可自定义设置
    listdata: [], //接口实际数据
    snext: true, //是否有下一页
    array: [], //头部筛选项
    list: [], //列表
    work_way: 1, //状态
    jineng: 0, //技能
    tuijia: 'ctime-desc', //推荐
    salarymax: 0, ////最大金额
    salarymin: 0, ///最小/金额
    salarNegotiate:0,
    profession: ''
  },
  getFormId: function (e) {
    var formid = e.detail.formId;
    app.addformId(formid)
  },
  // 头部产品经理单项选项
  bindPickerChange: function(e) {
    var that = this;
    var aid = that.data.array[e.detail.value].profession;
    that.setData({
      showCantainer: false,
      list: [],
      page:1,
      profession: aid,
      arrayidx: e.detail.value,
    })
    that.position();
    that.setData({
      judge: false
    })
    //that.getDataUrl2(aid);
  },
  // 切换职位选项
  tab: function(event) {
    //清零金额下来选项
    this.setData({
      priceidx:0
    })
    //0为远程，金额中无面议选项
    if (event.currentTarget.dataset.current==0){
      this.setData({
        priceList:[ //金额
          {
            id: 0,
            data: "不限",
            negotiate: 0,
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
        ]
      })
    }else{
      this.setData({
        priceList: [ //金额
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
        ]
      })
    }
    var that = this;
    that.setData({
      showCantainer: false,
      list: []
    })
    if (that.data.current !== event.target.dataset.current) {
      that.setData({
        current: event.target.dataset.current
      })
      if (event.target.dataset.current == 0) {
        that.setData({
          judge: true,
          work_way: 1,
          hiddenzz: true,
          page: 1
        })
      } else {
        that.setData({
          judge: true,
          work_way: 2,
          hiddenzz: false,
          page: 1
        })
      }
    }
    that.setData({
      hiddentext: false
    }) //显示下拉结束加载
    that.position();
  },
  // 切换列表——》选项卡
  switcher: function() {
    var that = this;
    that.setData({
      pullup: true,
    })
    that.setData({
      hiddenswcr: (!this.data.hiddenswcr),
      hiddentext: false
    })
    if (that.data.hiddenswcr == false) {
      console.log(that.data.list.length)
      if (that.data.list.length == 1) {
        that.onReachBottom();
        that.setData({
          hiddentext: false
        })
      }
    }
  },
  demandTap:function(e){
    var data = {}
    var that = this
    bm.requsetData("/c/positoon/get", 'get', data,function (data) {
    })

  },
  //选项卡滑动页
  swiperChange(e) {
    this.setData({
      swiperIndex: e.detail.current
    })
    if (e.detail.current + 1 == this.data.list.length) {
      this.onReachBottom()
    }
  },
  //推荐
  tuijianBut: function(event) {
    var that = this,
      itemId = event.detail.value,
      itemval = that.data.sortlist[itemId].id;
    that.setData({
      list: [],
      page: 1,
      tuijia: itemval,
      sortidx: itemId,
      hiddentext: false,
      showCantainer: false,
    })
    that.position();
  },
  //技能
  jinengButo: function(event) {
    var that = this,
      itemId = event.detail.value;
    that.setData({
      list: [],
      page: 1,
      jineng: itemId,
      skillidx: itemId,
      hiddentext: false,
      showCantainer: false,
    })
    that.position();
  },
  // 金额
  jineBut: function(event) {
    var that = this,
      itemId = event.detail.value; 
    that.setData({
      list: [],
      page: 1,
      priceidx: itemId,
      salarymin: that.data.priceList[itemId].low,
      salarymax: that.data.priceList[itemId].high,
      salarNegotiate: that.data.priceList[itemId].negotiate,
      hiddentext: false,
      showCantainer: false,
    })
    that.position();
  },
  // 列表的数据获取
  position: function() {
    var that = this;
    var DataView = {
      work_way: that.data.work_way, //类型
      profession: that.data.profession, //职位
      sort: that.data.tuijia, //推荐
      skills: that.dataamend(that.data.jineng), //技能
      highsalary: that.data.salarymax, //金额 最大 
      lowsalary: that.data.salarymin, //金额 最小 
      page: that.data.page, //当前页码 
      limit: that.data.limit ,//一页多少条数据
      negotiate:that.data.salarNegotiate   //金额是否面议
    }
    that.getDataUrl(DataView);
  },
  //卡片模式点击请求函数
  getnext: function() {
    var that = this,
      list = that.data.listdata;
    if (that.pullBottom(list)) {
      that.setData({
        showCantainer: false,
        list: [],
        page: that.data.page + 1,
        judge: true
      })
      that.position();
    } else {
      that.setData({
        hiddentext: false, //显示下拉结束加载
      })
    }
  },
  //技能判断函数
  dataamend: function(wd) {
    var list = [];
    if (wd == 0) {
      return list = [];
    } else {
      list.push(this.data.skillList[wd]);
      return list;
    }
  },
  // 发送请求1 ajax请求数据  依据实际请求进行修改
  getDataUrl: function(getdata) {
    var that = this,
      url = "/w/position/lists";
    bm.requsetData(url, 'get', getdata, function(data) {
      if (that.dataDispose(data.data) !== 0) {
        that.setData({
          listdata: that.dataDispose(data.data)
        })
        var postData = [{ profession: 0, profession_name:'全部'}];
        for (var i in data.data.choose_list) {
          postData.push(data.data.choose_list[i])
        }
        console.log(postData)
        that.setData({
          array: postData
        });

        // that.setData({
        //   id: data.data.choose_list[0].profession
        // })
        // 2018.08.10新增判断，
        if (data.data.is_release == 1){
          that.setData({
            empty_text_01: '暂时没有找到相关职位信息',
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
        that.timestampToTime(that.data.listdata.list);
        // 判断当前是拉的，还是切换的  judge==true 切  false 拉
        if (that.data.judge) {
          console.log("覆盖触发")
          that.setData({
            list: that.data.listdata.list
          });
        } else {
          console.log("添加触发")
          var a = that.data.list;
          for (var i in that.data.listdata.list) {
            a.push(that.data.listdata.list[i])
          }
          that.setData({
            list: a
          });
        }
      }
      // 卡片状态时的开关
      if (that.data.hiddenswcr == false) {
        if (that.data.list.length == 1) {
          that.onReachBottom();
          that.setData({
            hiddentext: false
          })
        }
      }
      that.setData({
        showCantainer: true
      });
      wx.stopPullDownRefresh();
    })
  },
  // 发送请求2 ajax请求数据  请求技能
  getDataUrl2: function(id) {
    var that = this;
    id = JSON.stringify(id);
    var b = '00';
    id = id.substr(0, id.length - 2).concat(b);
    var url = '/c/config/skill?id=' + id,
      list;
    bm.requsetData(url, 'post', list, function(data) {
      var jndata = that.data.skillList;
      jndata = ["不限"];;
      for (var i in data.data) {
        jndata.push(data.data[i])
      }
      that.setData({
        skillList: jndata
      })
    })

  },
  //获取到的数据判断
  dataDispose: function(data) {
    if (data.errcode !== 0) {
      this.hiddensBata(data.errcode)
      return data = 0;
    } else {
      
      return data;
    }
  },
  //将时间戳转化为时间
  timestampToTime: function(list) {
    for (var i in list) {
      list[i].ctime = bm.formatDate(list[i].ctime);
    }
  },
  //上拉请求时判断有没有下一页的判断
  pullBottom: function(list) {
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
            hiddentext: false, //显示下拉结束加载
            ispro: false //标记在请求中
          })
        return true;
      } else {
        if (that.data.hiddenswcr == false) {
          that.setData({
            ispro: false //标记在请求中
          })
        } else {
          that.setData({
            hiddentext: true, //显示下拉结束加载
            ispro: false //标记在请求中
          })
        }
        wx.showToast({
          title: '已经没有数据了',
          icon: 'none',
          duration: 2000
        })
        return false;
      }
    }
  },
  //下拉监听
  onPullDownRefresh: function() {
    //this.setData({ pullup: false})
    this.setData({
      //pullup: true,
      judge: true,
      ispro: false,
      list:[],
      page: 1,
      hiddentext: false,
      showCantainer: false
    })
    wx.showToast({
      mask: true,
      title: '正在刷新',
      icon: 'loading',
      duration: 500
    })
    this.position()
  },
  //上监听
  onReachBottom :function() {
    console.log('我被触发了')
    var that = this,
      list = that.data.listdata;
    if (that.pullBottom(list)) {
      that.setData({
        page: that.data.page + 1,
        judge: false
      })
      that.position();
    }
  },
  onShow: function() {
    var that = this;
    var isRefresh = wx.getStorageSync("isRefresh");
    if (isRefresh) {
      wx.removeStorageSync("isRefresh");
      that.onLoad();
    }
    //当前时间
    var times = that.timeJudge().m;
    //本地存储的时间
    wx.getStorage({
      key: 'timeJudge',
      success: function(res) {
        var timex;
        timex = res.data.m;
        if (times - timex > 4) {
          console.log('这个函数已经执行！');
          wx.setStorage({
            key: "timeJudge",
            data: that.timeJudge()
          })
          that.onLoad();
        }
      }
    })
    wx.getStorage({
      key: 'judge',
      success: function (res) {
        if (res.data){
          that.onLoad();
        }
      }
    })
  },
  // 邀请和简历跳转点击跳转
  clickSkip:function(){
    let that=this; 
    let judge = 1;
    wx.setStorage({
      key: "judge",
      data: true
    })
    wx.navigateTo({
      url: that.data.clickurl,
    })
  },
  //时间判断
  timeJudge: function() {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    if (month < 10) {
      month = '0' + month;
    };
    if (day < 10) {
      day = '0' + day;
    };
    //如果需要时分秒，就放开
    var h = now.getHours();
    var m = now.getMinutes();
    var s = now.getSeconds();
    var formatDate = {
      year: year,
      month: month,
      day: day,
      h: h,
      m: m,
      s
    };
    return formatDate;
  },
  maskClick:function(e){
    console.log('aaaa')
    var that = this
    var id = e.currentTarget.dataset.id
    bm.requsetData('/c/position/get', 'get', { id: id }, function (res) {
      if (res.data.errcode != 30702) {
        wx.navigateTo({
          url: '/pages/details/zwDetails?id='+id+'&navtype=0',
        })
      } else {
        console.log(res.data.errcode)
        if (res.data.errcode == 30702) {
            that.setData({
              showVip:1
            })
        } else {
        }
      }
    }, false)
  },
  nomask:function(e){
    this.setData({
      showVip: ""
    })
  },
  openvip:function(e){
    wx.navigateTo({
      url: '/pages/openvip/openvip',
    })
  },
    //生命周期函数--监听页面加载
  onLoad: function (options) {
    var that = this;
    wx.setStorage({
      key: "timeJudge",
      data: that.timeJudge()
    })
    wx.removeStorage({
      key: 'judge',
      success: function (res) {
        console.log(res.data)
      }
    })
    that.position();
    // setTimeout(function () {
    //   that.getDataUrl2(that.data.id);
    // }, 1000)
  }
})
