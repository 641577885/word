// pages/worker/my/workExper.js
const bm = require('../../utils/common.js')
const Page = require('../../utils/ald-stat.js').Page;
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jobData: {jobId:null,jobName:'',jobIdTwo:null},
    oldJobId:0,
    indusData:[],
    // indusData: { data: {id:null, indusName:''}},

    profession:[],
    position_name: "",
    company: '',
    // industry: '',
    skills:[],
    stime: bm.formatMonth(),
    etime: bm.formatMonth(),
    department: '',
    content: '',
    profit: '',
    placeholder:'',
    num: '100',
    tagData: [],
    typeId:'',
    type: '',
    industry:[],
    zhiwei:0,
    indusnum:0,
    /**行业传递的数据 */
    select_list:null,
    //当前日期
    date: bm.formatToday(),
    //组件简历百分比
    fastResume_rate: 0,
    fastResumeshow: false,
    rest: 0,
    fast_step: [],
    multiIndex: [0,0],
  },
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    var id = options.id
    var type = options.type
    this.setData({
      id: id,
      type: type
    })
    var that=this
    if (type == 2) {
      var that = this
      bm.requsetData('/w/resume/worker_exper?scene=detail', 'post', { id: id }, function (data) {
        var da = data.data.data ;
        var list = []
        for (var i in da.industry_list) {
          var arr = { id: i, indusName: da.industry_list[i] }
          list.push(arr)
        } 
        var jobTwo = da.profession.toString().substring(0,5) + "0" ; 
        that.setData({ 
          jobData: { jobId: da.profession, jobName: da.profession_name, jobIdTwo: jobTwo },
          zhiwei: jobTwo,
          position_name: da.position_name,
          company: da.company,
          indusData: da.industry_list,
          select_list: list,
          indusnum: Object.keys(da.industry_list).length,
          tagData: da.skill_list,
          stime: da.stime_date,
          etime: da.etime_date,
          department: da.department,
          profit: da.profit,
          content: da.content,
          type: 3   
        })
        if (that.data.etime){
          that.setData({
            etime_dateflag:false
          })
        }else{
          that.setData({
            etime_dateflag: true
          })
        }
      })
      
    }
    //快速填写
    if (options.fill_type == 'show') {
      that.setData({
        fastResumeshow: true
      })
      bm.requsetData("/w/resume/fill_state", "post", '', function (data) {
        that.setData({
          fastResume_rate: parseInt(data.data.resume_status.score),
          rest: data.data.resume_status.rest,
          fast_step: data.data.resume_status.fast_step
        })
      })
    } else {
      that.setData({
        fastResumeshow: false
      })
    }
    //获取当前时间
    var times = this.getNowTime()
    var Year = times.substr(0,4)
    var Month = times.substr(5,6);
    console.log(Year,Month)
    var arr = []
     for(let i = 1990; i<=Year;i++){
      arr.push(i)
     }
    arr.push('至今')
    for (let i = 0; i < arr.length;i++){
      if (arr[i] == Year){
        var Yearindex = i
      }
    }
     var arrs = []
    for (let j = 1; j <= Month;j++){
       if (j < 10) {
         j = '0' + j
       }
       arrs.push(j)
     }
    for (let j = 0; j < arrs.length;j++){
      if (arrs[j] == Month) {
         var Monthindex = j
       }
     }
     var sumarr =[]
     sumarr.push(arr)
    sumarr.push(arrs)
     this.setData({
       multiarr: sumarr
     })
    if (Yearindex){
      console.log(Yearindex, Monthindex)
      this.setData({
        multiIndex: [Yearindex, Monthindex]
      })
    }
    console.log(this.data.multiarr)
  },

  //选择入职时间
  bindStarDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      stime: e.detail.value
    })
  },
  //选择离职时间
  // bindEndDateChange: function (e) {
  //   console.log('picker发送选择改变，携带值为', e.detail.value)
  //   this.setData({
  //     etime: e.detail.value
  //   })
  // },
  pickerskill:function(){
    var that=this;
    if (that.data.zhiwei != that.data.jobData.jobIdTwo) {
      that.setData({ tagData: [] })
    }
    if (that.data.jobData.jobName==""){
      wx.showToast({
        title: '请先选择职位类型',
        icon: 'none'
      })
      return false;
    }
    wx.navigateTo({
      url: '/pages/picker/abilityPicker?tagData=' + JSON.stringify(that.data.tagData) + '&typeId=' + that.data.jobData.jobIdTwo,
      success:function(){
        that.setData({ zhiwei: that.data.jobData.jobIdTwo})
      }
    })
    
  },
  getNowTime:function() {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    if(month < 10) {
      month = '0' + month;
    };
    var formatDate = year + '-' + month
    return formatDate;
  },
  //离职时间多列选择器
  bindMultiPickerColumnChange:function(e){
    //拿到当前时间
    var times = this.getNowTime()
    //拿到当前年份
    var Year = times.substr(0, 4)
    //拿到当前月份
    var Month = times.substr(5, 6);
    //说明滚动为第一列改变，重置第二列为0
    if (e.detail.column==0){
      this.setData({
        etime_dateflag:false
      })
      var multiIndex = [[e.detail.value], 0]
    //如果当前年为今年，则月变更为最多选择之今月
    if (this.data.multiarr[0][e.detail.value] == Year){
      console.log(this.data.multiarr[0][e.detail.value])
      var arr = []
      for (var i = 1990; i <= Year; i++) {
        arr.push(i)
      }
      arr.push('至今')
      var arrs = []
      for (let j = 1; j <= Month; j++) {
        if (j < 10) {
          j = '0' + j
        }
        arrs.push(j)
      }
      var sumarr = []
      //sumarr为二维数组，第一个为年份，第二个为月份
      sumarr.push(arr)
      sumarr.push(arrs)
      //设置multiarr为对应二维数组
      this.setData({
        multiarr: sumarr,
      })
    }else if (this.data.multiarr[0][e.detail.value] == "至今") {
       //如果选择至今，则月份清空不显示
      var arr = []
      for (var i = 1990; i <= Year; i++) {
        arr.push(i)
      }
      arr.push('至今')
      var arrs = [""]
      var sumarr = []
      sumarr.push(arr)
      sumarr.push(arrs)
      this.setData({
        multiarr: sumarr,
      })
    }else{
      var arr = []
      for (var i = 1990; i <= Year; i++) {
        arr.push(i)
      }
      arr.push('至今')
      var arrs = []
      for (let j = 1; j <= 12; j++) {
        if (j < 10) {
          j = '0' + j
        }
        arrs.push(j)
      }
      var sumarr = []
      sumarr.push(arr)
      sumarr.push(arrs)
      this.setData({
        multiarr: sumarr,
      })
    }
   }
  },
  bindMultiPickerChange:function(e){
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    this.setData({
      multiIndex: e.detail.value,
      etime_dateflag:false
    })
    if (this.data.multiarr[0][this.data.multiIndex[0]]=="至今"){
        this.setData({
          flags:'none',
          etime:'至今'
        })
    }else{
      this.setData({
        flags: '',
        etime: this.data.multiarr[0][this.data.multiIndex[0]]+'-'+this.data.multiarr[1][this.data.multiIndex[1]]
      })
    }
    console.log(this.data.multiIndex)
  },
  
  workExper:function(){
    
    var that=this;
    var industry=[]
    var induname = []
    //var industry =that.data.select_list
    
    for (var i in that.data.select_list) {
      // industry.push(that.data.indusData.data[i].id);
      // induname.push(that.data.indusData.data[i].indusName);
      industry.push(that.data.select_list[i].id)
    }
    that.setData({ industry: industry})
    var type = this.data.type
    if (that.data.jobData.jobId==null) {
      wx.showToast({
        title: '请输入职位类型',
        icon: 'none'
      })
      return false;
    } 
    
    if (that.data.position_name == 0) {
      wx.showToast({
        title: '请选择职位名称',
        icon: 'none'
      })
      return false;
    }
    if (!that.data.company) {
      wx.showToast({
        title: '请选择公司名称',
        icon: 'none'
      })
      return false;
    }
    if (that.data.indusData==null) {
      wx.showToast({
        title: '请选择公司行业',
        icon: 'none'
      })
      return false;
    }
   
    if (that.data.tagData.length==0) {
      wx.showToast({
        title: '请选择技能标签',
        icon: 'none'
      })
      return false;
    }
    if (that.data.stime == 0 && that.data.etime == 0) {
  
      wx.showToast({
        title: '请输入时间段',
        icon: 'none'
      })
      return false;
    }
    if (that.data.etime !='至今'){
      if (that.data.stime > that.data.etime) {
        wx.showToast({
          title: '起始时间必须小于结束时间',
          icon: 'none'
        })
        return false;
      }
    }
  
    if (that.data.department == 0) {
      wx.showToast({
        title: '请选所属部门',
        icon: 'none'
      })
      return false;
    }
    
    if (!that.data.content) {
      wx.showToast({
        title: '请输入工作内容',
        icon: 'none'
      })
      return false;
    }
    var ad=''
    var id=''
    if(type==1){
       ad='add'
    }else if(type==3){
       ad='edit',
       id=that.data.id
    }
    if(that.data.etime=='至今'){
      var etimes = '1'
    }else{
      var etimes = that.data.etime
    }
    bm.requsetData("/w/resume/worker_exper?scene=" + ad, "post", { profession: that.data.jobData.jobId, position_name: that.data.position_name, company: that.data.company, industry: that.data.industry, skills: that.data.tagData, content: that.data.content, profit: that.data.profit, department: that.data.department, stime: that.data.stime, etime: etimes,id}, function (res) {
        if (!res.data.errcode) {
          wx.showToast({
            title: '保存成功',
            duration:2000,
            success:function(){
              setTimeout(function(){
                wx.navigateBack({
                  
                }) 
              },2000)
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
  //行业选择
  selecthy: function (e) {
    var that = this
    var indata = that.data.select_list
    var hy = JSON.stringify(indata)
    wx.navigateTo({
      url: '/pages/picker/indusPicker?hy=' + hy,
    })
  },
  
})