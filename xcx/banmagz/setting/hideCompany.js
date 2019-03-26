// pages/setting/hideCompany.js
const bm=require("../utils/common.js")
const Page = require('../utils/ald-stat.js').Page;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    companyList:[
      {
        id:1,
        coName:"杭州墨匠信息技术有限公司"
      },
      {
        id: 2,
        coName: "杭州墨匠信息技术有限公司"
      },
      {
        id: 3,
        coName: "杭州墨匠信息技术有限公司"
      }
    ]
  },
  //添加新的公司跳转
  addNewCo:function(){
    wx.navigateTo({
      url: '/setting/coSearch?list=' + JSON.stringify(this.data.companyList),
    })
  },
  DeleteCo:function(e){
    var that=this;
    var _id=e.target.dataset.id;
    // this.data.companyList[_id].coName ='ssss';
    // this.setData({
    //   companyList: this.data.companyList,
    // });
  },

  getHideCo:function(){
    bm.requsetData("/w/user/listShield","get", "",function(res){
      if(!res.data.errcode){
        console.log(res.data)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
})