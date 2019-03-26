// pages/share/share.js
var app = getApp()
const bm = require('../../utils/common.js')
const ctx = wx.createCanvasContext('shareCanvas')
const Page = require('../../utils/ald-stat.js').Page;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cwidth:null,
    cheight:null,
    title:'',
    title_02:'',
    company:'',
    job:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    var title = that.data.title
    var title_02 = that.data.title_02
    var company = that.data.company
    var job = that.data.job

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          cwidth: res.windowWidth,
          cheight: res.windowHeight
        })
        ctx.drawImage('../../images/share_bg.jpg', 0, 0, res.windowWidth, res.windowHeight)


        ctx.setFontSize(24)
        ctx.setTextAlign('center')
        ctx.setTextBaseline('middle')
        ctx.fillText(title, res.windowWidth / 2, res.windowHeight*0.6, res.windowWidth)

        ctx.setFontSize(24)
        ctx.setTextAlign('center')
        ctx.setTextBaseline('middle')
        ctx.fillText(company, res.windowWidth / 2, res.windowHeight * 0.35, res.windowWidth)

        ctx.setFontSize(13)
        ctx.setTextAlign('center')
        ctx.setTextBaseline('middle')
        ctx.fillText(job, res.windowWidth / 2, res.windowHeight * 0.4, res.windowWidth)

        ctx.setFontSize(15)
        ctx.setFillStyle('#999999')
        ctx.setTextAlign('center')
        ctx.setTextBaseline('middle')
        ctx.fillText(title_02, res.windowWidth / 2, res.windowHeight * 0.65, res.windowWidth)

        ctx.save()
        ctx.beginPath()
        ctx.arc(res.windowWidth / 2, res.windowHeight * 0.2, res.windowWidth * 0.36/2, 0, 2 * Math.PI)
        ctx.clip()
        ctx.drawImage('../../images/worklist/1_100017.jpg', (res.windowWidth / 2) - (res.windowWidth * 0.36 / 2), (res.windowHeight * 0.2) - (res.windowWidth * 0.36/2), res.windowWidth * 0.36, res.windowWidth*0.36)
        ctx.restore()



        ctx.draw()
        
      }
    })
    
  },
  /**长按保存 */
  save:function(){
    wx.showModal({
      title: '提示',
      content: '是否保存图片到手机？',
      success: function (res) {
        if (res.confirm){
          wx.canvasToTempFilePath({
            canvasId: 'shareCanvas',
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