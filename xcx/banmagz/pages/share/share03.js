// pages/share/share03.js
var app = getApp()
const bm = require('../../utils/common.js')
var ctx = wx.createCanvasContext('myCanvas')
const Page = require('../../utils/ald-stat.js').Page;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowWidth: 0,
    windowHeight: 0,
    contentHeight: 0,
    //内容
    avatar: '',
    name:'',
    position:'',
    ability:'能力：5.0  |  服务：4.0  |  响应：5.0',
    info:'10年以上互联网开发，经历过千百万级大型互联网项目。有异动互联网项目，跨境电商...',
    gynum:'25',
    pjnum:'5.0',
    edu:'本科',
    exp:'3年+',
    age:'20岁',
    job_exp:[],
    xcx_code: '',
    //行业主要内容
    jobcontent_01:[],
    jobcontent_02: [],
    jobcontent_03: [],
    contentheight:17,
    /**各部分高度 */
    oneheight:439,
    twoheight:150,
    threeheight:180,
    //介绍
    thinkList:[],
    lineHeight:13,
    jobheight:183,

    touch_start: null,
    touch_end: null,
    uid: null
  },
  getInfo: function () {
    wx.showLoading({
      title: '图片生成中',
    })
    var that = this
    var uid = that.data.uid
    var token = app.globalData.token
    
    bm.requsetData('/c/worker/resume?access_token=' + token, 'get', { uid: uid }, function (data) {
      if(data.data.errcode == 0){
        if (data.data.resume.education_name.length == 0) {
          var edu = '未填写'
        } else {
          var edu = data.data.resume.education_name
        }
        if (data.data.user.age.length == 0) {
          var age = '未填写'
        } else {
          var age = data.data.user.age + '岁'
        }
        if (data.data.user.avatar == 'https://bm.jiangcdn.com/banma/avatar.jpg'){
          that.setData({
            avatar: data.data.user.avatar
          })
        }else{
          wx.getImageInfo({
            src: data.data.user.avatar,
            success: function (_res) {
              that.setData({
                avatar: _res.path
              })
            }
          })
        }
        
      that.setData({
        //avatar: data.data.user.avatar,
        name: data.data.user.name,
        position: data.data.user.ismember,
        ability: '能力：' + data.data.mark.ability + '  |  服务：' + data.data.mark.response + '  |  响应：' + data.data.mark.service,
        info: data.data.resume.advantage,
        gynum: data.data.user.projects,
        pjnum: data.data.user.marks,
        edu: edu,
        age:age,
        exp: data.data.user.start_work_time_name
      })
      bm.requsetData('/c/worker/explist', 'post', { uid: uid }, function (res) {
        if(res.data.errcode == 0){
          that.setData({
            job_exp:res.data.worklist.slice(0,3)
          })
          bm.requsetData('/c/action/get_qrcode?scene=resume&id='+uid, 'post', '', function (rdd) {
            
            if(rdd.data.errcode == 0){
              that.getData()
              var job_length = that.data.job_exp.length
              if (job_length == 1) {
                that.getData02()
              } else if (job_length == 2) {
                that.getData02()
                that.getData03()
              } else if (job_length == 3) {
                that.getData02()
                that.getData03()
                that.getData04()
              }
              wx.getSystemInfo({
                success: function (ree) {
                  that.setData({
                    windowWidth: ree.windowWidth,
                    windowHeight: ree.windowHeight,
                    contentHeight: that.data.oneheight + that.data.twoheight + that.data.job_exp.length * 183 + 45 + 30 + that.data.threeheight
                  });
                }
              });
              wx.getImageInfo({
                src: rdd.data.url,
                success: function (aaa) {
                  that.setData({
                    xcx_code: aaa.path
                  })
                  that.createNewImg()
                }
              })
            }else{
              wx.showToast({
                title: rdd.data.errmsg,
                icon: 'none'
              })
            }
          })
      }else{
          wx.showToast({
            title: res.data.errmsg,
            icon: 'none'
          })
      }
      })
      }else{
        wx.showToast({
          title: data.data.errmsg,
          icon:'none'
        })
      }
    })
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var uid = options.uid
    that.setData({
      uid: uid
    })
    if (app.globalData.auth) {
      that.getInfo();
    } else {
      app.authCallback = auth => {
        that.getInfo();
      }
    } 
    
    
  },
  //绘制
  createNewImg: function () {
    var that = this
    var vip = that.data.position
    ctx.rect(0, 0, that.data.windowWidth, that.data.contentHeight)
    ctx.setFillStyle('#fff')
    ctx.fill()
    //黑色背景
    ctx.beginPath()
    ctx.rect(0, 0, that.data.windowWidth, that.data.oneheight)
    ctx.setFillStyle('#000')
    ctx.fill()
    ctx.closePath()
    //头部图片
    ctx.beginPath()
    ctx.drawImage('../../images/share03_bg.png', 0, 0, that.data.windowWidth, that.data.oneheight)
    ctx.drawImage('../../images/shaer_02_top.png', 0, 0, that.data.windowWidth, 70)    
    ctx.closePath()
    //头像
    that.canvasavatar(that.data.avatar, that.data.windowWidth/2-50,101,100,100)
    //姓名
    ctx.setTextAlign('center')
    that.canvastext(that.data.name, that.data.windowWidth / 2,221,'#fff',18)
    //职位
    //that.canvastext(that.data.position, that.data.windowWidth / 2, 246, '#ababab', 11)
    //会员标识
    if (vip == 1){
      ctx.drawImage('../../images/crown.png', that.data.windowWidth / 2 - 7, 268, 14, 13)
    }
    
    //能力
    that.canvastext(that.data.ability, that.data.windowWidth / 2, 295, '#fff', 12)
    //介绍
    var thinkList = that.data.thinkList
    var listnum = thinkList.length
    var height = 13
    for (let item of thinkList) {
      if (item !== 'a') {
        that.canvastext(item, that.data.windowWidth / 2, 321 + height, '#ababab', 11)
        height += that.data.lineHeight;
      }
    }
    //圆角矩形
    ctx.drawImage('../../images/share03_jx.png', 0, 381, that.data.windowWidth, 110)
    //圆角矩形内容
    that.canvastext('雇佣', that.data.windowWidth / 2 - 70, 430, '#000', 13)
    that.canvastext('评价', that.data.windowWidth / 2 + 70, 430, '#000', 13)
    that.canvastext(that.data.gynum, that.data.windowWidth / 2 - 70, 405, '#000', 19)
    that.canvastext(that.data.pjnum, that.data.windowWidth / 2 + 70, 405, '#000', 19)
    //红字提示
    //标题
    that.canvastext('基本信息', 40, 507, '#000', 13)
    //下划线
    that.canvasxhx(530, that.data.windowWidth - 15, 1, '#eeeeee')
    that.canvasxhx(528, 52, 2, '#fede01')
    //基本信息
    ctx.drawImage('../../images/position/edu.png',15,542,14,14)
    ctx.drawImage('../../images/position/icon_02.png', 85, 542, 14, 14)
    ctx.drawImage('../../images/position/icon_03.png', 155, 542, 14, 14)
    that.canvastext(that.data.edu, 55, 540, '#000', 13)
    that.canvastext(that.data.exp, 125, 540, '#000', 13)
    that.canvastext(that.data.age, 195, 540, '#000', 13)
    //分割
    that.canvasfg(575)
    //标题
    that.canvastext('工作经历', 40, 607, '#000', 13)
    //下划线
    that.canvasxhx(630, that.data.windowWidth - 15, 1, '#eeeeee')
    that.canvasxhx(628, 52, 2, '#fede01')
    //工作经历
    var joblist = that.data.job_exp
    var jobheight = 0
    for (var i in joblist){
      if (joblist[i].etime == 1){
        time = '至今'
      }else{
        var date = new Date(joblist[i].etime * 1000)
        var y = date.getFullYear();
        var m = date.getMonth() + 1; 
        m = m < 10 ? ('0' + m) : m;  
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;  
        var time = y + '-' + m +'-'+ d 
      }
      that.canvastext02(joblist[i].profession_name, 15, jobheight+ 655, '#000', 16)
      that.canvastext(time, 300, jobheight + 655, '#999999', 13)
      that.canvastext02(joblist[i].company, 15, jobheight + 794, '#999999', 13)
      that.canvasxhx(jobheight + 825, that.data.windowWidth - 15, 1, '#eeeeee')
      jobheight += that.data.jobheight
    }
    var jobcontent_01 = that.data.jobcontent_01
    var contentheight01 = 17
    for (let item of jobcontent_01) {
      if (item !== 'a') {
        that.canvastext02(item,15, 666 + contentheight01, '#ccc', 13)
        contentheight01 += that.data.contentheight;
      }
    }
    var jobcontent_02 = that.data.jobcontent_02
    var contentheight02 = 17
    for (let item of jobcontent_02) {
      if (item !== 'a') {
        that.canvastext02(item, 15, 846 + contentheight02, '#ccc', 13)
        contentheight02 += that.data.contentheight;
      }
    }
    var jobcontent_03 = that.data.jobcontent_03
    var contentheight02 = 17
    for (let item of jobcontent_03) {
      if (item !== 'a') {
        that.canvastext02(item, 15, 1034 + contentheight02, '#ccc', 13)
        contentheight02 += that.data.contentheight;
      }
    }
    //分割
    that.canvasfg(that.data.oneheight + that.data.twoheight + that.data.job_exp.length * 183 + 45)
    //小程序码
    var xcxhethht = that.data.oneheight + that.data.twoheight + that.data.job_exp.length * 183 + 45
    ctx.setTextAlign('left')
    that.canvastext('【长按识别小程序码】', 15, xcxhethht+74,'#000',16)
    that.canvastext('投递简历，查看公司详情', 18, xcxhethht+104, '#000', 16)
    ctx.drawImage(that.data.xcx_code, that.data.windowWidth * 0.65, xcxhethht + 64, 85, 85)

    ctx.draw()
    wx.hideLoading()
  },
  //文字函数
  canvastext: function (content, x, y, color, size) {
    ctx.save()
    ctx.setFillStyle(color)
    ctx.setFontSize(size)
    ctx.setTextBaseline('top')
    ctx.fillText(content, x, y)
    ctx.restore()
  },
  canvastext02: function (content, x, y, color, size) {
    ctx.save()
    ctx.setFillStyle(color)
    ctx.setFontSize(size)
    ctx.setTextBaseline('top')
    ctx.setTextAlign('left')
    ctx.fillText(content, x, y)
    ctx.restore()
  },
  //下划线
  canvasxhx: function (y, length, height, color) {
    ctx.beginPath()
    ctx.rect(15, y, length, height)
    ctx.setFillStyle(color)
    ctx.fill()
    ctx.restore()
  },
  //分割
  canvasfg: function (y) {
    ctx.beginPath()
    ctx.rect(0, y, this.data.windowWidth,15)
    ctx.setFillStyle('#fafafa')
    ctx.fill()
    ctx.restore()
  },
  //圆形头像
  canvasavatar: function (url, x, y, width, height) {
    ctx.save()
    ctx.beginPath()
    ctx.arc(width / 2 + x, height / 2 + y, width / 2, 0, 2 * Math.PI)
    ctx.fill('#000')
    ctx.clip()
    ctx.drawImage(url, x, y, width, height)
    ctx.restore()
  },
  //多行内容转数组
  getData: function () {
    let that = this;
    let i = 0;
    let lineNum = 1;
    let thinkStr = '';
    let thinkList = [];
    for (let item of that.data.info) {
      if (item === '\n') {
        thinkList.push(thinkStr);
        thinkList.push('a');
        i = 0;
        thinkStr = '';
        lineNum += 1;
      } else if (i === 21) {
        thinkList.push(thinkStr);
        i = 1;
        thinkStr = item;
        lineNum += 1;
      } else {
        thinkStr += item;
        i += 1;
      }
    }
    thinkList.push(thinkStr);
    that.setData({ thinkList: thinkList });
  },
  getData02: function () {
    let that = this;
    let i = 0;
    let lineNum = 1;
    let thinkStr = '';
    let jobcontent_01 = [];
    for (let item of that.data.job_exp[0].content) {
      if (item === '\n') {
        jobcontent_01.push(thinkStr);
        jobcontent_01.push('a');
        i = 0;
        thinkStr = '';
        lineNum += 1;
      } else if (i === 26) {
        jobcontent_01.push(thinkStr);
        i = 1;
        thinkStr = item;
        lineNum += 1;
      } else {
        thinkStr += item;
        i += 1;
      }
    }
    
    jobcontent_01.push(thinkStr);
    console.log(jobcontent_01)
    that.setData({ jobcontent_01: jobcontent_01 });
  },
  getData03: function () {
    let that = this;
    let i = 0;
    let lineNum = 1;
    let thinkStr = '';
    let jobcontent_02 = [];
    for (let item of that.data.job_exp[1].content) {
      if (item === '\n') {
        jobcontent_02.push(thinkStr);
        jobcontent_02.push('a');
        i = 0;
        thinkStr = '';
        lineNum += 1;
      } else if (i === 26) {
        jobcontent_02.push(thinkStr);
        i = 1;
        thinkStr = item;
        lineNum += 1;
      } else {
        thinkStr += item;
        i += 1;
      }
    }
    jobcontent_02.push(thinkStr);
    that.setData({ jobcontent_02: jobcontent_02 });
  },
  getData04: function () {
    let that = this;
    let i = 0;
    let lineNum = 1;
    let thinkStr = '';
    let jobcontent_03 = [];
    for (let item of that.data.job_exp[2].content) {
      if (item === '\n') {
        jobcontent_03.push(thinkStr);
        jobcontent_03.push('a');
        i = 0;
        thinkStr = '';
        lineNum += 1;
      } else if (i === 26) {
        jobcontent_03.push(thinkStr);
        i = 1;
        thinkStr = item;
        lineNum += 1;
      } else {
        thinkStr += item;
        i += 1;
      }
    }
    jobcontent_03.push(thinkStr);
    that.setData({ jobcontent_03: jobcontent_03 });
  },
  onShow: function () {
   
  },
  //按下事件开始  
  mytouchstart: function (e) {
    let that = this;
    that.setData({
      touch_start: e.timeStamp
    })
  },
  //按下事件结束  
  mytouchend: function (e) {
    let that = this;
    that.setData({
      touch_end: e.timeStamp
    })
    that.save()
  },
  /**长按保存 */
  save: function () {
    var that = this
    //触摸时间距离页面打开的毫秒数  
    // var touchTime = that.data.touch_end - that.data.touch_start;
    // console.log(touchTime)
    // if (touchTime > 1000) {
      wx.showModal({
        title: '提示',
        content: '是否保存图片到手机？',
        success: function (res) {
          if (res.confirm) {
            wx.canvasToTempFilePath({
              canvasId: 'myCanvas',
              success: function (data) {
                wx.saveImageToPhotosAlbum({
                  filePath: data.tempFilePath,
                  success(ree) {
                    wx.navigateBack({
                      delta: 1,
                    })
                  }
                })
              }
            })
          }
        }
      })
    
  },
})