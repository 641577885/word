// auth/authsuccess.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  go_bank:function(){
    wx.redirectTo({
      url: '/pages/bank/bank',
    })
  }
  
})