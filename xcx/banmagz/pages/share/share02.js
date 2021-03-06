// pages/share/share02.js
var app = getApp()
const bm = require('../../utils/common.js')
var ctx = wx.createCanvasContext('myCanvas')
const Page = require('../../utils/ald-stat.js').Page;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowWidth:0,
    windowHeight:0,
    contentHeight: 0,
    //内容
    title:'UI设计一套',
    money:'1200元',
    type:'后端开发',
    time:'2周',
    avatar:'',
    name:'风雪',
    company:'力石科技－人力资源总监',
    hy:'',
    content: '完成店铺所有的视觉设计，同时包含可通形象设计以及整套UI视觉设计完成店铺所有的视觉设计，同时包含可通形象设计以及整套UI视觉设计\n完成店铺所有的视觉设计，同时包含可通形象设计以及整套UI视觉设计完成店铺所有的视觉设计，同时包含可通形象设计以及整套UI视觉设计',
    company_name:'力石科技',
    company_type:'已上市－100～499人－旅游',
    logo:'',
    xcx_code:'',
    jn_01:'',
    jn_02: '',
    jn_03: '',
    xcx_code:'',
    //需求详情内容
    thinkList:[],
    //头部图片高
    topheight:70,
    oneheight:160,
    fgheight:15,
    //第二部分原始高
    twoheight:0,
    //第三部分原始高
    threeheight:0,
    //需求详情内容单行高度
    lineHeight:18
  },
  getInfo:function(){
    var that = this
    var id = that.data.id
    bm.requsetData('/c/demand/get', 'get', { id: id }, function (res) {
      if (!res.data.errcode) {
        wx.getImageInfo({
          src: res.data.seller.avatar,
          success: function (_res) {
            that.setData({
              avatar: _res.path,
              title: res.data.demand.title,
              content: res.data.demand.content,
              type: res.data.demand.profession_name.substr(0, 4) + '...',
              //avatar:res.data.seller.avatar,
              name: res.data.seller.name,
              company: res.data.seller.company_name + '-' + res.data.seller.position,
              jn_01: res.data.demand.skills[0],
              jn_02: res.data.demand.skills[1],
              jn_03: res.data.demand.skills[2],
              company_name: res.data.seller.company_name.substr(0, 11) + '...',
              company_type: res.data.company.finance_stage_name + '-' + res.data.company.staff_size_name + '-' + res.data.company.industry_name.substr(0, 10),
              logo: res.data.company.logo
            })
            bm.requsetData('/c/action/get_qrcode?scene=position&id=' + id, 'post', '', function (data) {
              if (data.data.errcode == 0) {
                wx.getImageInfo({
                  src: data.data.url,
                  success: function (aaa) {
                    that.setData({
                      xcx_code: aaa.path
                    })
                    that.getData()
                    that.createNewImg()
                  }
                })

              } else {
                wx.showToast({
                  title: data.data.errmsg,
                  icon: 'none'
                })
              }
            })
          }
        })
        
      } else {
        wx.showToast({
          title: res.data.errmsg,
          icon: 'none'
        })
      }
    })
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '生成中...',
    })
    var that = this
    var id = options.id
    that.setData({
      id: id
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
  createNewImg:function(){
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight,
          contentHeight: that.data.topheight + that.data.oneheight + that.data.fgheight + 80 + (that.data.lineHeight * that.data.thinkList.length) + 115 + 15 + 260+60,
          twoheight: that.data.topheight + that.data.oneheight + that.data.fgheight,
          threeheight: that.data.topheight + that.data.oneheight + that.data.fgheight + 80 + (that.data.lineHeight * that.data.thinkList.length),
        });
      }
    });
    ctx.rect(0, 0, that.data.windowWidth, that.data.contentHeight)
    ctx.setFillStyle('#fff')
    ctx.fill()
    //头部图片
    ctx.drawImage('../../images/shaer_02_top.png', 0, 0, that.data.windowWidth, that.data.topheight)
    //标题
    that.canvastext(that.data.title, 16, that.data.topheight + 22,'#000',24)
    //价格
    that.canvastext(that.data.money, that.data.windowWidth * 0.75, that.data.topheight + 26,'red',18)
    //要求
    that.canvastext(that.data.type, 33, that.data.topheight + 64,'#000',13)
    that.canvastext(that.data.time, 117, that.data.topheight + 64,'#000',13)
    ctx.drawImage('../../images/business/cama_03.png', 16, that.data.topheight + 68,12,10)
    ctx.drawImage('../../images/business/clock_03.png', 99, that.data.topheight + 68, 10, 10)
    //线
    that.canvasxhx(that.data.topheight + 94, that.data.windowWidth - 16,1,'#eeeeee')
    //分割
    that.canvasfg(that.data.topheight + that.data.oneheight)
    //头像
    that.canvasavatar(that.data.avatar,11,that.data.topheight+111,31,31)
    //name
    that.canvastext(that.data.name, 58, that.data.topheight + 111, '#000',15)
    //company
    that.canvastext(that.data.company, 58, that.data.topheight + 130, '#000',12)
    //活跃
    that.canvastext(that.data.hy, that.data.windowWidth * 0.77, that.data.topheight + 130, '#999999', 12)
    //标题
    that.canvastext('需求详情', 15,that.data.twoheight + 20,'#000',13)
    //下划线
    that.canvasxhx(that.data.twoheight + 44, that.data.windowWidth - 15, 1, '#eeeeee')
    that.canvasxhx(that.data.twoheight + 42, 52, 2,'#fede01')
    //需求内容
    var thinkList = that.data.thinkList
    var listnum = thinkList.length
    var height = 60
    for (let item of thinkList) {
      if (item !== 'a') {
        that.canvastext(item, 15, that.data.twoheight + height , '#000' , 13)
        height += that.data.lineHeight;
      }
    }
    //分割
    that.canvasfg(that.data.threeheight)
    //标题2
    that.canvastext('技能要求', 15, that.data.threeheight + 35, '#000', 13)
    //下划线2
    that.canvasxhx(that.data.threeheight + 59, that.data.windowWidth - 15, 1, '#eeeeee')
    that.canvasxhx(that.data.threeheight + 57, 52, 2, '#fede01')
    //技能要求文字
    that.canvastext(that.data.jn_01, that.data.windowWidth * 0.05, that.data.threeheight + 78, '#686868', 13)
    that.canvastext(that.data.jn_02, that.data.windowWidth * 0.25, that.data.threeheight + 78, '#686868', 13)
    that.canvastext(that.data.jn_03, that.data.windowWidth * 0.45, that.data.threeheight + 78, '#686868', 13)
    that.canvasfg(that.data.threeheight + 35 + 78)
    //公司信息
    that.canvastext(that.data.company_name, 15, that.data.threeheight+145, '#000', 18)
    that.canvastext(that.data.company_type, 15, that.data.threeheight + 170, '#000', 13)
    ctx.drawImage(that.data.logo, that.data.windowWidth * 0.77, that.data.threeheight + 145,50,50)

    //that.canvasavatar(that.data.logo, that.data.windowWidth * 0.77, that.data.threeheight + 145, 45, 45)
    //分割
    that.canvasfg(that.data.threeheight + 205)
    //小程序码
    that.canvastext('【长按识别小程序码】', 15, that.data.threeheight + 115+185, '#000', 16)
    that.canvastext('投递简历，查看公司详情', 18, that.data.threeheight + 115+210, '#000', 16)
    ctx.drawImage(that.data.xcx_code, that.data.windowWidth * 0.65, that.data.threeheight + 115+170, 85, 85)
    
    ctx.draw()
    wx.hideLoading()
  },
  //文字函数
  canvastext:function(content,x,y,color,size){
    ctx.save()
    ctx.setFillStyle(color)
    ctx.setFontSize(size)
    ctx.setTextBaseline('top')
    ctx.fillText(content, x, y)
    ctx.restore()
  },
  //下划线
  canvasxhx:function(y,length,height,color){
    ctx.beginPath()
    ctx.rect(15, y, length, height)
    ctx.setFillStyle(color)
    ctx.fill()
    ctx.restore()
  },
  //分割
  canvasfg:function(y){
    ctx.beginPath()
    ctx.rect(0, y, this.data.windowWidth, this.data.fgheight)
    ctx.setFillStyle('#fafafa')
    ctx.fill()
    ctx.restore()
  },
  //圆形头像
  canvasavatar:function(url,x,y,width,height){
    ctx.save()
    ctx.beginPath()
    ctx.arc(width / 2 + x, height/2 + y, width/2,0, 2 * Math.PI)
    ctx.fill('#000')
    ctx.clip()
    ctx.drawImage(url, x, y, width,height)
    ctx.restore()
  },
  //多行内容转数组
  getData: function () {
    let that = this;

    let i = 0;
    let lineNum = 1;
    let thinkStr = '';
    let thinkList = [];
    for (let item of that.data.content) {
      if (item === '\n') {
        thinkList.push(thinkStr);
        thinkList.push('a');
        i = 0;
        thinkStr = '';
        lineNum += 1;
      } else if (i === 25) {
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
    that.createNewImg(lineNum);
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
    // if (touchTime >1000) {
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