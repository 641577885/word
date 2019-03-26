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
    hy:'刚刚活跃',
    content: '完成店铺所有的视觉设计，同时包含可通形象设计以及整套UI视觉设计完成店铺所有的视觉设计，同时包含可通形象设计以及整套UI视觉设计\n完成店铺所有的视觉设计，同时包含可通形象设计以及整套UI视觉设计完成店铺所有的视觉设计，同时包含可通形象设计以及整套UI视觉设计',
    company_name:'力石科技',
    company_type:'已上市－100～499人－旅游',
    logo:'',
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight,
          contentHeight: that.data.topheight + that.data.oneheight + that.data.fgheight + 80 + (that.data.lineHeight * that.data.thinkList.length) + 115 + 15 + 260,
          twoheight: that.data.topheight + that.data.oneheight + that.data.fgheight,
          threeheight: that.data.topheight + that.data.oneheight + that.data.fgheight + 80 + (that.data.lineHeight * that.data.thinkList.length),
        });
      }
    });
    if (that.data.type.length > 4){
      var jq_type = that.data.type.substring(0,4) + '...'
      that.setData({
        type:jq_type
      })
    }
    that.createNewImg()
  },
  //绘制
  createNewImg:function(){
    var that = this
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
    that.canvastext('产品总监', that.data.windowWidth * 0.05, that.data.threeheight + 78, '#686868', 13)
    that.canvastext('产品总监', that.data.windowWidth * 0.25, that.data.threeheight + 78, '#686868', 13)
    that.canvastext('产品总监', that.data.windowWidth * 0.45, that.data.threeheight + 78, '#686868', 13)
    that.canvasfg(that.data.threeheight + 35 + 78)
    //公司信息
    that.canvastext(that.data.company_name, 15, that.data.threeheight+145, '#000', 18)
    that.canvastext(that.data.company_type, 15, that.data.threeheight + 170, '#000', 13)
    ctx.drawImage('../../images/position/logo.jpg', that.data.windowWidth * 0.77, that.data.threeheight + 145, 44, 50)
    //小程序码
    that.canvastext('【长按识别小程序码】', 15, that.data.threeheight + 115+125, '#000', 16)
    that.canvastext('投递简历，查看公司详情', 18, that.data.threeheight + 115+150, '#000', 16)
    ctx.drawImage(that.data.xcx_code, that.data.windowWidth * 0.65, that.data.threeheight + 115+110, 85, 85)
    
    ctx.draw()
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
  onShow:function(){
    this.getData()
    this.onLoad()
  },
  /**长按保存 */
  save: function () {
    wx.showModal({
      title: '提示',
      content: '是否保存图片到手机？',
      success: function (res) {
        if (res.confirm) {
          wx.canvasToTempFilePath({
            canvasId: 'myCanvas',
            success: function (data) {
              console.log(data)
              wx.saveImageToPhotosAlbum({
                filePath: data.tempFilePath,
                success(ree) {
                  console.log(ree)
                }
              })
            }
          })
        }
      }
    })
  },
})