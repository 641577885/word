const bm = require('../utils/common.js')
const Page = require('../utils/ald-stat.js').Page;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pid:'',
    starlist:[1,2,3,4,5],
    ability:0,
    service: 0,
    response: 0,
    item: [{ id: 0, name: '服务态度好' }, { id: 1, name: '做事走心' }, { id: 2, name: '效果一般' }, { id: 3, name: '老司机' }, { id: 4, name: '言语粗鲁' }, { id: 5, name: '一稿过' }],
    content:'',
    tag:[]
  },
  // 评价
  change:function(event){
    this.setData({ ability: event.target.dataset.current })

  },
  changesever:function(event){
    this.setData({ service: event.target.dataset.current })
  },
  changerespond: function (event){
    this.setData({ response: event.target.dataset.current })
  },
  // 选项
  evlalute: function (event) {
    var _index = event.target.dataset.current;
    this.data.item[_index].checked = !this.data.item[_index].checked;
    var tagName = this.data.item[_index].name;
    if (this.data.item[_index].checked){
      this.data.tag.push(tagName)
      this.setData({ tag: this.data.tag })
    }else{
      this.data.tag.splice(tagName, 1)
      this.setData({ tag: this.data.tag })
    }
    this.setData({ item: this.data.item})
  },
  // textarea
  inputtext:function(e){
     this.setData({content:e.detail.value})
  },
  confirm:function(){
    var that=this;
    // 评价
    if (!that.data.ability || !that.data.service || !that.data.response){
      wx.showToast({
        title: '请对本次员工的能力给予评价哦',
        icon: 'none'
      })
      return false;
    }
    console.log()
    bm.requsetData("/b/project/mark/create", "post", { pid:that.data.pid, ability: that.data.ability, service: that.data.service, response: that.data.response, tag: that.data.tag, content: that.data.content,}, function (res) {
      if (!res.data.errcode) {
        wx.showToast({
          title: '评价成功',
          success:function(){
            setTimeout(function(){
              wx.navigateBack({
                delta: 2
              })
            },1000)
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
    this.setData({pid:options.pid})
  },

})