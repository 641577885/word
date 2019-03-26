// pages/worker/worklist/maskinglist.js
//调取发送请求的文件
const bm = require('../../utils/common.js')
const Page = require('../../utils/ald-stat.js').Page;
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    empty_text_01: '',
    empty_text_02: '暂时没有找到相关需求信息。',
    hiddentext: false,//底部加载
    hiddenpart: true,//局部文档隐藏切换
    hiddens: false,//全体文档隐藏切换
    hiddentop: false,//头部选择框隐藏切换
    ispro: false,//是否在请求中
    page:1,
    limit:6,
    isnext: true,//是否有下一页
    salary: 0,           //薪水开关
    hidden: false,   //显示框的显示隐藏
    boy_girl: "",//性别
    tab: false,   //左右切换
    list: [],      //接口列表数据
    grtdata: [], //后台 获取到 的全部数据
    leixing: [//类型
      { id: 0, data: "全部" },
      { id: 1, data: "远程办公" },
      { id: 2, data: "驻场办公" }
    ],
    xueli: [//学历
      { id: 0, data: "不限" },
      { id: 1, data: "中专以下" },
      { id: 2, data: "高中 " },
      { id: 3, data: "大专" },
      { id: 4, data: "本科" },
      { id: 5, data: "硕士" },
      { id: 6, data: "博士" }
    ],
    jingyan: [//经验
      { id: 0, data: "不限" },
      { id: 1, data: "1年以内 " },
      { id: 2, data: "1-3年" },
      { id: 3, data: "3-5年" },
      { id: 4, data: "5-10年" },
      { id: 5, data: "10以上" }
    ],
    xinshui: [//薪水
      { id: 0, data: "不限" },
      { id: 1, data: "3k以下" },
      { id: 2, data: "3k-5k " },
      { id: 3, data: "5k-10k" },
      { id: 4, data: "10k-20k" },
      { id: 5, data: "20k-50k" },
      { id: 6, data: "50k以上" }
    ],
    id: 0,
    profession: 0,//专业、职业
    buts: 0,     //类型
    fuwus1: 0,    //服务可驻场
    fuwus2: 0,    //服务支持三无
    but: 0,      //学历
    salaryMax: 0,      //薪水
    salaryMin: 0,      //薪水
    experience: 0,   //经验
    url: '',        //当前页面的URL
    goodValue:'请输入职位'
  },
  // 头部产品经理单项选项
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var aid = this.data.grtdata.choose_list[e.detail.value].profession;
    this.setData({
      index: e.detail.value, profession: aid,
    })
    this.getAllData();
  },
  // 学历单选
  butto: function (event) {
    var that = this;
    var toggleBtnVal = that.data.but;
    var itemId = event.currentTarget.id;
    if (toggleBtnVal == itemId) {
      that.setData({
        but: 0
      })
    } else {
      that.setData({
        but: itemId
      })
    }
  },
  // 服务复选0
  fuwuButto0: function (event) {
    var that = this;
    if (that.data.fuwus0 == 0) {
      that.setData({ fuwus0: 1 })
    } else {
      that.setData({ fuwus0: 0 })
    }
  },
  // 服务复选1
  fuwuButto1: function (event) {
    var that = this;
    if (that.data.fuwus1 == 0) {
      that.setData({ fuwus1: 1, list: [] })
    } else {
      that.setData({ fuwus1: 0, list: [] })
    }
  },
  // 服务复选2
  fuwuButto2: function (event) {
    var that = this;
    if (that.data.fuwus2 == 0) {
      that.setData({ fuwus2: 1, list: []})
    } else {
      that.setData({ fuwus2: 0, list: [] })
    }
  },
  //类型单选
  buttos: function (event) {
    var that = this;
    var toggleBtnVal = that.data.buts;
    var itemId = event.currentTarget.id;
    if (toggleBtnVal == itemId) {
      that.setData({
        buts: 0,
      })
    } else {
      that.setData({
        buts: itemId
      })
    }
    this.Submit()
  },
  // 经验单选
  experienceBut: function (event) {
    var that = this;
    var experienceBut = that.data.experience;
    var itemId = event.currentTarget.id;
    if (experienceBut == itemId) {
      that.setData({
        experience: 0
      })
    } else {
      that.setData({
        experience: itemId
      })
    }
  },
  // 薪水单选
  salaryBut: function (event) {
    var that = this,
    salaryButVal = that.data.salary,

    itemId = event.currentTarget.id,

    itemval = that.data.xinshui[itemId].data,
    salaryData = that.publicSalary(itemId, itemval);//调用公共函数
    this.setData({
      itemId: itemId
    })
    // console.log("最小值：" + that.data.salaryMin + "," + "最大值：" + that.data.salaryMax);
    that.setData({ salaryMin: salaryData[0], salaryMax: salaryData[1] })
    if (salaryButVal == itemId) {
      that.setData({
        salary: 0
      })
    } else {
      that.setData({
        salary: itemId
      })
    }
  },
  //拆分金额最大值和最小值的函数，注意仅适合100k以下
  publicSalary: function (itemId, itemval) {
    if (itemId !== '0') {
      var data = itemval.replace(/[^0-9]/ig, "");
      //console.log("长度"+data.length)
      var max, min;
      if (data.length == 1) {
        if (data == 3) {
          max = data * 1000 - 1;
          min = 0;
        } else {
          max = data * 1000;
          min = 0;
        }
      } else if (data.length == 2) {
        if (data[0] < data[1]) {
          max = data[1] * 1000; min = data[0] * 1000;
        } else {
          max = 0; min = data * 1000;
        }
      } else if (data.length == 3) {
        max = (data[1] + data[2]) * 1000;
        min = data[0] * 1000;
        console.log("max:" + max, "min:" + min)
      } else if (data.length == 4) {
        max = (data[2] + data[3]) * 1000;
        min = (data[0] + data[1]) * 1000;
      }
    } else {
      max = 0; min = 0;
    }
    //console.log("最小值：" + min + "," + "最大值：" +max);
    var data = [min, max];
    return data;
  },
  // 重置按钮
  Reset: function () {
    var that = this;
    that.setData({ itemId:0, buts: 0, fuwus0: 0,fuwus1: 0, fuwus2: 0, but: 0, salary: 0, experience: 0, salaryMax: 0, salaryMax: 0 })
    this.setData({ list: [] });
    console.log("已经重置！")
  },
  //确认
  Submit: function () {
    var arr = []
    var demandNum = 0;
    arr.push(this.data.fuwus1)
    arr.push(this.data.fuwus2)
    arr.push(this.data.but)
    arr.push(this.data.experience)
    arr.push(this.data.itemId)
    console.log(arr)
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] >= 1) {
        demandNum++
      }
    }
    var that = this;
    this.setData({ hidden: false });
    this.setData({ list: [], demandNum: demandNum});
    that.getAllData()
  },
  // 切换
  tabBut1: function (event) {
    var that = this;
    that.setData({ tab: 0, hiddentext: false  })
    if (that.data.id == 1) {
      that.setData({ hidden: true })
    } else {
      that.setData({ hidden: (!that.data.hidden) })
    }
    that.setData({ id: 2, flag:true })

  },
  tabBut2: function (event) {
    var that = this;
    that.setData({ tab: 1, hiddentext: false })
    if (that.data.id == 2) {
      that.setData({ hidden: true })
    } else {
      that.setData({ hidden: (!that.data.hidden) })
    }
    that.setData({ id: 1, flag: false})
  },
  butreturn:function(){
    wx.navigateBack({
      delta: 1
      })
  },
  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    var that = this;
    // 做了一个延时器，从而达到同步
    var a = setTimeout(function () {
      that.setData({ ispro: false })//标记在请求中
    }, 200)
    that.setData({goodValue:options.goodValue})
    console.log(that.data.goodValue);
    var data = app.globalData.role;
    //做一个获取url里面的参数(在这里goodsId就是地址栏里的参数名称)

    that.getAllData();    //发送请求
  },
  //页面上拉触底事件的处理函数
  pullBottom: function () {
    var that = this
    if (!that.data.ispro) {//没有在请求中，开始加载数据
      if (that.data.grtdata.pages.allpage > that.data.grtdata.pages.page) {//有下一页数据
        wx.showToast({
          mask: true,
          title: '加载中...',
          icon: 'loading',
        })
        that.setData({ ispro: false })//标记在请求中
        that.setData({ page: that.data.page + 1});
        that.getAllData();
      } else {
        that.setData({ page: 1 })//显示下拉结束加载
        wx.showToast({
          mask: true,
          title: '加载中...',
          icon: 'loading',
        })
        that.setData({ hiddentext: true })//显示下拉结束加载
        that.setData({ ispro: false })//标记在请求中
      }
    }
  },
  //页面下拉触底事件的处理函数
  getpull: function () {
    var that = this;
    that.setData({ page: 0, list: [] })//显示下拉结束加载
    that.getAllData();
  },
  // 处理当前页面有数据和没数据时的情况
  hiddensBata: function (event) {
    var that = this;
    if (event == 0) {
      that.setData({
        hiddenpart: false,
        hiddentext: false })
    } else {
      that.setData({ hiddenpart: true })
    }
  },
  // 处理当前页面局部有数据和没数据时的情况
  hiddenpartBata: function (event) {
    var that = this;
    if (event == "") {
      that.setData({
        hiddenpart: false,
        hiddentext: false })
    } else {
      that.setData({ hiddenpart: true })
    }
  },
 // 获取当前下拉列表的选项值
 getAllData: function () {
  var that = this;
  if (that.data.profession == 0) {
    var DataView = {
      work_way: that.data.buts,                 //类型
      education: that.data.but,                  //学历
      resident: that.data.fuwus1,               //服务可驻场
      sanwu: that.data.fuwus2,                 //服务支持三无
      work_year: that.data.experience,      //经验
      highsalary: that.data.salaryMax,       //薪水 最大 
      lowsalary: that.data.salaryMin,          //薪水 最小 
      page: that.data.page,                        //当前页码 
      limit: that.data.limit,                        //一页多少条数据
      keyword: that.data.goodValue
    };
  } else {
    var DataView = {
      profession: that.data.profession,        //职位
      work_way: that.data.buts,                 //类型
      education: that.data.but,                  //学历
      resident: that.data.fuwus1,               //服务可驻场
      sanwu: that.data.fuwus2,                 //服务支持三无
      work_year: that.data.experience,      //经验
      highsalary: that.data.salaryMax,       //薪水 最大 
      lowsalary: that.data.salaryMin,          //薪水 最小 
      page: that.data.page,                        //当前页码 
      limit: that.data.limit,                        //一页多少条数据
      keyword:that.data.goodValue
    };
  }
  var url ='/b/worker/lists'
  that.getDataUrl(url,DataView);
},
 // 发送请求
 getDataUrl: function (url,getdata) {
  var that = this;
  bm.requsetData(url, 'get', getdata, function (data) {
    console.log(data);
    if (data.data.errcode == 0) {
      wx.showToast({
        mask: true,
        title: '正在刷新',
        icon: 'loading',
      })
        if (data.data.has_profession == 0) {
          that.hiddensBata(data.data.has_profession);//判断当前页面有没有数据
        } else {
          that.setData({ grtdata: data.data });
          var a = that.data.list;
          for (var i in data.data.list) {
            a.push(data.data.list[i])
          }
          that.setData({ list: a });
          that.hiddenpartBata(that.data.list);//判断当前页面的局部有没有数据
        }
      wx.hideLoading()
    } else {
      console.log(data.data.errmsg);
      wx.showToast({
        mask: true,
        title: data.data.errmsg,
        icon: 'none',
        duration: 500
      })
      wx.hideLoading()
    }
  })
 }
})