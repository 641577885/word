// pages/worker/message/dialog.js
const bm = require('../utils/common.js')
const webim = require('../utils/webim.js');
const webimhandler = require('../utils/webim_handler.js');
const aliUploader = require("../utils/oss/uploadAliyun.js");
const Page = require('../utils/ald-stat.js').Page;
var selSess;
var selType=webim.SESSION_TYPE.C2C
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    uid:'',
    role:1,
    msgs : [],
    selToID:null,
    msgContent: "",
    isShowMore:false , //是否显示更多选择
    canDialog:true,
    orderList: "",
    selfHeadUrl: '',
    friendHeadUrl: '',
    sendtime:0,
    greetList: [],
    isCommom: false,
    relationship:{},
    chat:{},
    drop:{},
    lasttime: 0,
    viewnum:0,
    toview:"view0",
    showLoad:false,
    scrolltop:0,
    getmore:true,
    likeStatus: 0,
    contactStatus:0,
    to_content:"",
    showVip:false,
    showresume:false,
    showPower:false,
    send_flag:true
    
  },
  getFormId: function (e) {
    var formid = e.detail.formId;
    app.addformId(formid)
  },
  getNotice: function () {
    var that = this;
    bm.requsetData("/c/action/listNotice", "get", '', function (res) {
      if (!res.data.errcode) {
        if (res.data.list.length > 0) {
          that.setData({ greetList: res.data.list })
        }
      }
    })
  },
  greetList: function (e) {
    var that = this;
    if (!that.data.drop.isperfect) {
      that.setData({ showResume: true })
      return false;
    }
    if (!that.data.chat.ismember) {
      if (!that.data.chat.can_chat) {
        that.setData({ showVip: true })
        return false;
      }
    } else {
      if (!that.data.chat.can_chat) {
        wx.showToast({
          title: "当天沟通次数已达上限",
          icon: 'none'
        })
        return false;
      }
    }
    var _index = e.target.dataset.index;
    var _msg = that.data.greetList[_index].notice;
    if (!that.data.send_flag){
      return false;
    }
    that.setData({send_flag:false});
    that.onSendMsg(_msg, function (msgs) {
      that.setData({ isCommom: false})
      that.addMsg(msgs);
    })
  },
  sendLike:function(){
    var that=this;
    if (!that.data.chat.ismember){
      that.sendResume();
    }else{
      that.onSendMsg("我对您发的职位非常感兴趣，期望能够更详细的了解一下", function (msgs) {
        that.addMsg(msgs);
        wx.setStorageSync("like" + app.globalData.uid + "to" + that.data.selToID, 1);
        that.setData({ likeStatus: 1 })
      })
    }
  },
  sendnoLike: function () {
    var that=this;
    wx.showModal({
      content: '对该雇主的职位/需求设置不感兴趣后，将中止你们的聊天。你可以通过搜索该雇主的职位/需求重新创建聊天。',
      showCancel: true,
      cancelText: '考虑一下',
      confirmText: '确定',
      success: function (res) {
        if (res.confirm) {
          var data = {
            'To_Account': that.data.selToID,
            'chatType': 1
          }
          webim.deleteChat(
            data,
            function (resp) {
              wx.navigateBack()
            }
          );
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //点击是否显示更多选项
  ckMore: function () {
    this.setData({
      isShowMore: !this.data.isShowMore,
      isCommom: false
    })
  },
  commonNotice: function () {
    var that=this;
    if (!that.data.drop.isperfect) {
      that.setData({ showResume: true })
      return false;
    }
    if (!that.data.chat.ismember) {
      if (!that.data.chat.can_chat) {
        that.setData({ showVip: true })
        return false;
      }
    } else {
      if (!that.data.chat.can_chat) {
        wx.showToast({
          title: "当天沟通次数已达上限",
          icon: 'none'
        })
        return false;
      }
    }
    that.setData({
      isCommom: !that.data.isCommom,
      isShowMore: false
    })
  },
  outMore: function () {
    this.setData({
      isShowMore: false,
      isCommom: false,
    })
  },
  //输入框内容提交
  bindConfirm: function (e) {
    var that = this;
    if (!that.data.drop.isperfect) {
      that.setData({ showResume: true })
      return false;
    }
    if (!that.data.chat.ismember) {
      if (!that.data.chat.can_chat) {
        that.setData({ showVip: true })
        return false;
      }
    } else {
      if (!that.data.chat.can_chat) {
        wx.showToast({
          title: "当天沟通次数已达上限",
          icon: 'none'
        })
        return false;
      }
    }
    var content = e.detail.value;
    if (!content.replace(/^\s*|\s*$/g, '')) return;
    if (!that.data.send_flag) {
      return false;
    }
    that.setData({ send_flag: false });
    that.onSendMsg(content, function (msgs) {
      that.setData({ msgContent: "" })
      that.addMsg(msgs);
    })
  },
  bindinput: function (e) {
    var that = this;
    var content = e.detail.value;
    that.setData({ msgContent: content})
  },
  //发送聊天信息
  sendChat: function () {
    var that = this;
    if (!that.data.drop.isperfect) {
      that.setData({ showResume: true })
      return false;
    }
    if (!that.data.chat.ismember) {
      if (!that.data.chat.can_chat) {
        that.setData({ showVip: true })
        return false;
      }
    }else{
      if (!that.data.chat.can_chat) {
        wx.showToast({
          title: "当天沟通次数已达上限",
          icon: 'none'
        })
        return false;
      }
    }
    var content = that.data.msgContent;
    if (!content.replace(/^\s*|\s*$/g, '')) return;
    if (!that.data.send_flag) {
      return false;
    }
    that.setData({ send_flag: false });
    that.onSendMsg(content, function (msgs) {
      that.setData({ msgContent: "" })
      that.addMsg(msgs);
    })
  },
  excontactMsg:function(){
    var that = this;
    if (!that.data.drop.isperfect) {
      that.setData({ showResume: true })
      return false;
    }
    if (!that.data.chat.ismember) {
      if (!that.data.chat.can_chat) {-
        that.setData({ showVip: true })
        return false;
      }
    } else {
      if (!that.data.chat.can_chat) {
        wx.showToast({
          title: "当天沟通次数已达上限",
          icon: 'none'
        })
        return false;
      }
    }
    bm.requsetData('/c/action/exchange/apply', 'post', { accept_id: that.data.selToID, ctype: 'contact' }, function (res) {
      if (!res.data.errcode) {
        that.data.exchange=1;
        that.setData({ exchange: that.data.exchange})
        that.onSendMsg("[:excontact]-" + res.data.info.id, function (msgs) {
          that.addMsg(msgs);
        })
      } else {
        wx.showToast({
          title: res.data.errmsg,
          icon: 'none'
        })
      }
    })
  },
  //复制微信
  clipWechat:function(e){
    var wechat = e.target.dataset.wechat
    wx.setClipboardData({
      data: wechat,
    })
  },
  //添加手机号码
  addCell:function(e){
    var cell = e.target.dataset.cell
    wx.makePhoneCall({
      phoneNumber: cell
    })
  },

  openvip:function(){
    wx.navigateTo({
      url: '/pages/openvip/openvip',
    })
    this.setData({ showVip: false, showResume: false })
  },
  finishResume:function(){
    wx.navigateTo({
      url: '/worker/my/myresume',
    })
    this.setData({ showVip: false, showResume: false })
  },
  closeTipCover:function(){
    this.setData({showVip:false,showResume:false})
  },

  previewImg:function(e){
    var imgarr=[],
    img = e.currentTarget.dataset.img;
    img=img.split("@!150x")[0]
    imgarr.push(img)
    bm.imgYu(img, imgarr)
  },

  //投递简历
  sendResume:function(){
    var that=this;
    if (!that.data.drop.isperfect) {
      that.setData({ showResume: true })
      return false;
    }
    if (!that.data.drop.can_drop) {
      wx.showModal({
        content: '非会员每日只能投递5份简历，开通会员提升上限。立即开通',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/openvip/openvip',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return false;
    }
    wx.showModal({
      title: "是否确认投递简历",
      content: '确认后小马将自动帮你投递简历',
      showCancel: true,
      cancelText: '考虑一下',
      confirmText: '确认',
      success: function (res) {
        if (res.confirm) {
          bm.requsetData("/w/resume/drop", "post", { sid: that.data.selToID }, function (res) {
            if (!res.data.errcode) {
              wx.showToast({
                title: '简历投递成功，雇主若对你感兴趣会联系你',
                icon:"none"
              })
              that.data.drop.have_drop = 1;
              that.setData({ drop: that.data.drop })
            } else {
              wx.showToast({
                title: res.data.errmsg,
                icon: 'none'
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //同意拒绝申请
  requsetReply:function(e){
    var that=this;
    var _status = e.target.dataset.status;
    var ext_id = e.target.dataset.ext;
    var _type = e.target.dataset.type;
    var content;
    if (!that.data.send_flag) {
      return false;
    }
    that.setData({ send_flag: false });
    bm.requsetData('/c/action/exchange/approval', 'post', { id: ext_id, status: _status},function(res){
      if(!res.data.errcode){
        if (_status == 1) {
          content = '[:contact]-' + app.globalData.lxtel + "," + app.globalData.weiAccount;
          that.onSendMsg(content, function (msgs) {
            that.addMsg(msgs);
          })
        }
        wx.setStorageSync("contact" + app.globalData.uid + "to" + that.data.selToID, 1);
        that.setData({ contactStatus: 1 })
      }else{
        wx.showToast({
          title: res.data.errmsg,
          icon:'none'
        })
      }
    })
  },
  //获取图片
  chooseCamera: function () {
    var that = this;
    if (!that.data.drop.isperfect) {
      that.setData({ showResume: true })
      return false;
    }
    if (!that.data.chat.can_chat){
      if (!that.data.chat.ismember) {
        that.setData({ showVip: true })
        return false;
      } else {
        wx.showToast({
          title: "当天沟通次数已达上限",
          icon: 'none'
        })
        return false;
      }
    }
    wx.chooseImage({
      count:1,
      sizeType: ['original', 'compressed'],
      sourceType: ['camera'],
      success: function(res) {
        var tempFilePaths = res.tempFilePaths[0];
        that.uploadFile(tempFilePaths);
      },
    })
  },
  //照相
  chooseAlbum: function () {
    var that=this;
    if (!that.data.drop.isperfect) {
      that.setData({ showResume: true })
      return false;
    }
    if (!that.data.chat.ismember) {
      if (!that.data.chat.can_chat) {
        that.setData({ showVip: true })
        return false;
      }
    } else {
      if (!that.data.chat.can_chat) {
        wx.showToast({
          title: "当天沟通次数已达上限",
          icon: 'none'
        })
        return false;
      }
    }
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths[0];
        that.uploadFile(tempFilePaths);
      },
    })
  },
  setpay: function () {
    var that = this;
    if (!that.data.drop.isperfect) {
      that.setData({ showResume: true })
      return false;
    }
    if (!that.data.chat.ismember) {
      if (!that.data.chat.can_chat) {
        that.setData({ showVip: true })
        return false;
      }
    } else {
      if (!that.data.chat.can_chat) {
        wx.showToast({
          title: "当天沟通次数已达上限",
          icon: 'none'
        })
        return false;
      }
    }
    wx.navigateTo({
      url: '/order/setpay?uid=' + that.data.selToID,
    })
    that.setData({
      isShowMore: false,
      isCommom: false
    })
  },
  uploadFile:function(path){
    var that=this;
    if (!that.data.drop.isperfect) {
      that.setData({ showResume: true })
      return false;
    }
    if (!that.data.chat.ismember) {
      if (!that.data.chat.can_chat) {
        that.setData({ showVip: true })
        return false;
      }
    } else {
      if (!that.data.chat.can_chat) {
        wx.showToast({
          title: "当天沟通次数已达上限",
          icon: 'none'
        })
        return false;
      }
    }
    let date = new Date();
    var dir = 'dialogMsg/' + app.globalData.uid
    aliUploader(path, dir, date.getTime(),
    function () {
      that.onSendMsg('[:IMAGES]-https://bm.jiangcdn.com/' + dir + '/' + date.getTime() + '.' + path.split(".").pop() +'@!150x', function (msgs) {
        that.addMsg(msgs);
        that.setData({
          isShowMore: false,
          isCommom: false
        })
      })
    },
    function (res) {common.msg("图片添加失败")});
  },
  

  //发送消息(普通消息)
  onSendMsg: function (msg, callback) {
    var that=this;
    if (!that.data.selToID) {
      console.error("您还没有进入房间，暂不能聊天");
      return;
    }
    //获取消息内容
    var msgtosend = msg;
    var msgLen = webim.Tool.getStrBytes(msg);
    if (msgtosend.length < 1) { 
      console.error("发送的消息不能为空!");
      return;
    }
    var maxLen, errInfo;
    if (selType == webim.SESSION_TYPE.GROUP) {
      maxLen = webim.MSG_MAX_LENGTH.GROUP;
      errInfo = "消息长度超出限制(最多" + Math.round(maxLen / 3) + "汉字)";
    } else {
      maxLen = webim.MSG_MAX_LENGTH.C2C;
      errInfo = "消息长度超出限制(最多" + Math.round(maxLen / 3) + "汉字)";
    }
    if (msgLen > maxLen) {
      console.error(errInfo);
      return;
    }
    if (!selSess) {
      selSess = new webim.Session(selType, that.data.selToID, that.data.selfHeadUrl, Math.round(new Date().getTime() / 1000));
    }
    var isSend = true;//是否为自己发送
    var seq = -1;//消息序列，-1表示sdk自动生成，用于去重
    var random = Math.round(Math.random() * 4294967296);//消息随机数，用于去重
    var msgTime = Math.round(new Date().getTime() / 1000);//消息时间戳
    var subType = webim.C2C_MSG_SUB_TYPE.COMMON;
    var msg = new webim.Msg(selSess, isSend, seq, random, msgTime, app.globalData.loginInfo.identifier, subType, app.globalData.loginInfo.identifierNick);
    //解析文本和表情
    var expr = /\[[^[\]]{1,3}\]/mg;
    var emotions = msgtosend.match(expr);

    var text_obj, face_obj, tmsg, emotionIndex, emotion, restMsgIndex;
    if (!emotions || emotions.length < 1) {
      text_obj = new webim.Msg.Elem.Text(msgtosend);
      msg.addText(text_obj);
    } else {//有表情
      for (var i = 0; i < emotions.length; i++) {
        tmsg = msgtosend.substring(0, msgtosend.indexOf(emotions[i]));
        if (tmsg) {
          text_obj = new webim.Msg.Elem.Text(tmsg);
          msg.addText(text_obj);
        }
        emotionIndex = webim.EmotionDataIndexs[emotions[i]];
        emotion = webim.Emotions[emotionIndex];
        if (emotion) {
          face_obj = new webim.Msg.Elem.Face(emotionIndex, emotions[i]);
          msg.addFace(face_obj);
        } else {
          text_obj = new webim.Msg.Elem.Text(emotions[i]);
          msg.addText(text_obj);
        }
        restMsgIndex = msgtosend.indexOf(emotions[i]) + emotions[i].length;
        msgtosend = msgtosend.substring(restMsgIndex);
      }
      if (msgtosend) {
        text_obj = new webim.Msg.Elem.Text(msgtosend);
        msg.addText(text_obj);
      }
    }
    webim.sendMsg(msg, function (resp) {
      callback(that.showMsg(msg));
      that.setData({send_flag:true});
    }, function (err) {
      webim.Log.error("发消息失败:" + err.ErrorInfo);
      that.setData({ send_flag: true });
    });
  },
  addRel: function () {
    var that=this;
    var relationship = wx.getStorageSync("relationship");
    if (!relationship) { 
      return false;
    }else{
      if (that.data.selToID != relationship.sid){
        return false;
      }
    }
    bm.requsetData("/c/action/add_chatlog", "post", { uid: that.data.selToID, obj_id: relationship.id, profession: relationship.profession, type: relationship.type},function(res){
        if(!res.data.errcode){
          that.data.chat.can_chat=1;
          that.setData({ chat: that.data.chat});
          wx.removeStorageSync("relationship");
        }
    })
  },
  //添加未响应消息
  addMsgUnans:function(){
    bm.requsetData("/c/action/addMsgUnans", "post", { sendtime: this.data.sendtime, to_uid: parseInt(this.data.selToID), content: this.data.to_content},function(res){
      if(!res.data.code){}
    })
  },
  showMsg: function (msg) {
    var isSelfSend, fromAccount, fromAccountNick, sessType, subType;
    var ul, li, paneDiv, textDiv, nickNameSpan, contentSpan;
    fromAccount = msg.getFromAccount();
    if(!fromAccount) {
      fromAccount = '';
    }
    fromAccountNick = msg.getFromAccountNick();
    if (!fromAccountNick) {
      fromAccountNick = '未知用户';
    }
    //解析消息
    sessType = msg.getSession().type();
    //获取消息子类型
    //会话类型为群聊时，子类型为：webim.GROUP_MSG_SUB_TYPE
    //会话类型为私聊时，子类型为：webim.C2C_MSG_SUB_TYPE
    subType = msg.getSubType();

    isSelfSend = msg.getIsSend();//消息是否为自己发的
    var content, ext = "", ext2="";
    content = webimhandler.convertMsgtoHtml(msg);
    if (content.indexOf('[:IMAGES]') != -1) {
      ext = content.split('-')[1];
      content = '[:IMAGES]';
    }
    if (content.indexOf('[:exwechat]') != -1) {
      ext = content.split('-')[1];
      content = '[:exwechat]';
    }
    if (content.indexOf('[:excell]') != -1) {
      ext = content.split('-')[1];
      content = '[:excell]';
    }
    if (content.indexOf('[:excontact]') != -1) {
      ext = content.split('-')[1];
      content = '[:excontact]';
    }
    if (content.indexOf('[:contact]') != -1) {
      var ext1 = content.split('-')[1];
      ext = ext1.split(',')[0];
      ext2 = ext1.split(',')[1];
      content = '[:contact]';
    }
    if (content.indexOf('[:resume]') != -1) {
      ext = content.split('-')[1];
      content = '[:resume]';
    }
    if (content.indexOf('[:position]') != -1) {
      var str,jsonStr={};
      var datastr = content.split('-')[1];  
      var extarr = datastr.split('&');
      for (var i in extarr){
        var arr=extarr[i].split("=");
        if (arr[0] == "skills") {
          arr[1] = arr[1].split(",");
        }
        jsonStr[arr[0]] = arr[1]
      }
      ext = jsonStr;
      content = '[:position]';
    }
    if (content.indexOf('[:demand]') != -1) {
      var str, jsonStr = {};
      var datastr = content.split('-')[1];
      var extarr = datastr.split('&');
      for (var i in extarr) {
        var arr = extarr[i].split("=");
        if (arr[0] =="skills"){
          arr[1] = arr[1].split(",");
        }
        jsonStr[arr[0]] = arr[1]
      }
      ext = jsonStr;
      content = '[:demand]';
    }
    if (content.indexOf('[:hire]') != -1) {
      var str, jsonStr = {};
      var datastr = content.split('-')[1];
      var extarr = datastr.split('&');
      for (var i in extarr) {
        var arr = extarr[i].split("=");
        jsonStr[arr[0]] = arr[1]
      }
      ext = jsonStr;
      content = '[:hire]';
    }
    if (content.indexOf('[:default]') != -1) {
      content = '[:default]';
    }
    return {
      fromAccountNick: fromAccountNick,
      content: content,
      isSelfSend: isSelfSend,
      ext: ext,
      ext2: ext2,
      time:msg.time
    }
  },
  
  //获取项目信息
  getOrderInfo: function () {
    var that = this;
    bm.requsetData("/w/project/mylist", "get", { sid: that.data.selToID}, function (res) {
      if (!res.data.errcode) {
        if (res.data.list.length > 0) {
          var orderlist = res.data.list[0];
          orderlist.pro.begintime = bm.formatDate(orderlist.pro.begintime);
          orderlist.pro.endtime = bm.formatDate(orderlist.pro.endtime);
          that.setData({ orderList: orderlist });
          wx.setNavigationBarTitle({
            title: orderlist.seller.name,
          })
        }
      } else {
        wx.showToast({
          title: res.data.errmsg,
          icon: 'none'
        })
      }
    })
  },
  //权限获取
  getPower:function(){
    var that=this;
    bm.requsetData("/w/user/chat", "get", { sid: that.data.selToID},function(res){
      if(!res.data.errcode){
        that.setData({ chat: res.data.chat, drop: res.data.drop, exchange: res.data.exchange})
      }else{

      }
    })
  },
  //获取历史记录
  getLastC2CHistoryMsgs: function (cbOk, cbError) {
    var that = this;
    if (selType == webim.SESSION_TYPE.GROUP) {
      wx.showToast({
        title: '当前的聊天类型为群聊天，不能进行拉取好友历史消息操作',
        icon: "none"
      })
      return;
    }
    if (!that.data.selToID || that.data.selToID == '@TIM#SYSTEM') {
      wx.showToast({
        title: '当前的聊天id非法，selToID=' + that.data.selToID,
        icon: "none"
      })
      return;
    }
    var msgKey = '';
    var options = {
      'Peer_Account': that.data.selToID, //好友帐号
      'MaxCnt': 10, //拉取消息条数
      'LastMsgTime': that.data.lasttime, //最近的消息时间，即从这个时间点向前拉取历史消息
      'MsgKey': msgKey
    };
    webim.getC2CHistoryMsgs(
      options,
      function (resp) {
        var complete = resp.Complete;//是否还有历史消息可以拉取，1-表示没有，0-表示有
        if (resp.MsgList.length == 0) {
          webim.Log.warn("没有历史消息了");
          return;
        }
        that.setData({ lasttime: resp.LastMsgTime - 1 });
        if (cbOk)
          cbOk(resp.MsgList);
      },
      cbError
    );
  },
  addMsg: function (data) {
    var that = this;
    var msgs = that.data.msgs || [];
    msgs.push(data);
    var interval;
    if (msgs.length > 0) {
      var lasmsg = msgs[msgs.length - 1].content;
      if (lasmsg.indexOf('[:position]') != -1 || lasmsg.indexOf('[:demand]') != -1 || lasmsg.indexOf('[:resume]') != -1 || lasmsg.indexOf('[:default]') != -1) { } else {
        that.addRel();
      }
    }
    for (var i in msgs) {
      if (i == 0) {
        msgs[i].strtime = bm.formatTime(msgs[i].time)
      } else {
        if (msgs[i].time >= msgs[parseInt(i) - 1].time + 300) {
          msgs[i].strtime = bm.formatTime(msgs[i].time)
        }
      }
    }
    if (msgs[msgs.length - 1].isSelfSend) {
      if (msgs.length == 1) {
        var timestamp = Date.parse(new Date()) / 1000;
        if (timestamp >= that.data.sendtime + 600) {
          var content = msgs[msgs.length - 1].content;
          that.setData({ sendtime: msgs[msgs.length - 1].time })
          that.setData({ to_content: that.transform(content) })
          that.addMsgUnans();
        } else {
          timestamp++
        }
      } else {
        if (!msgs[msgs.length - 2].isSelfSend) {
          var timestamp = Date.parse(new Date()) / 1000;
          if (timestamp >= that.data.sendtime + 600) {
            var content = msgs[msgs.length - 1].content;
            that.setData({ sendtime: msgs[msgs.length - 1].time })
            that.setData({ to_content: that.transform(content) })
            that.addMsgUnans();
          } else {
            timestamp++
          }
        }
      }
    }
    setTimeout(function () {
      that.setData({ msgs: msgs });
      that.setData({
        toview: "view" + (msgs.length - 1)
      });
    }, 100)
  },
  addpreMsg: function (data) {
    var that = this;
    that.setData({ showLoad: true});
    var msgs = that.data.msgs || [];
    msgs = data.concat(msgs);
    if (msgs.length>0){
      var lasmsg = msgs[msgs.length - 1].content;
      if (lasmsg.indexOf('[:position]') != -1 || lasmsg.indexOf('[:demand]') != -1 || lasmsg.indexOf('[:resume]') != -1 || lasmsg.indexOf('[:default]') != -1) {

      } else {
        that.addRel();
      }
    }
    for (var i in msgs) {
      if(i==0){
        msgs[i].strtime = bm.formatTime(msgs[i].time)
      }else{
        if (msgs[i].time >= msgs[parseInt(i) - 1].time + 300) {
          msgs[i].strtime = bm.formatTime(msgs[i].time)
        }else{
          msgs[i].strtime = msgs[i].time
        }
      }
    }
    setTimeout(function () {
      that.setData({ showLoad: false, msgs: msgs, getmore: true, showPower: true  });
      webim.setAutoRead(selSess, true, true);
      webim.setAutoRead(selSess, false, false);
      that.setData({
        toview: "view" + that.data.viewnum
      });
    }, 1000)
  },
  transform: function (content) {
    if (content.indexOf('[:IMAGES]') != -1) {
      content = "图片消息";
    }
    if (content.indexOf('[:excontact]') != -1) {
      content = '请求跟您交换联系方式';
    }
    if (content.indexOf('[:contact]') != -1) {
      content = '交换联系方式';
    }
    if (content.indexOf('[:hire]') != -1) {
      content = '我生成了一笔订单';
    }
    if (content.indexOf('[:default]') != -1) {
      content = content.split('-')[1];
    }
    if (content.indexOf('[:resume]') != -1) {
      content = "我已经向您的邮箱里发送了一份简历，请您查阅"
    }
    return content
  },
  //获取上一页记录
  getLastMsg: function () {
    var that = this;
    var arr = [];
    if (that.data.getmore){
      that.setData({ getmore:false});
      that.getLastC2CHistoryMsgs(function (res) {
        for (var i in res) {
          arr.push(that.showMsg(res[i]));
        }
        that.setData({ viewnum: arr.length - 1 })
        that.addpreMsg(arr)
      });
    }
  },
  //获取历史记录
  getLastList:function(){
    var that=this;
    var arr=[];
    var lasttime=0;
    that.getLastC2CHistoryMsgs(function (res) {
      for (var i in res) {
        selSess = res[i].getSession();
        arr = arr.concat(that.showMsg(res[i]));
      }
      that.setData({ viewnum: arr.length-1})
      that.addpreMsg(arr)
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var likeStatus = wx.getStorageSync("like" + app.globalData.uid + "to" + options.skipid) || 0;
    var contactStatus = wx.getStorageSync("contact" + app.globalData.uid + "to" + options.skipid) || 0;
    that.setData({
      uid: app.globalData.uid,
      selToID: options.skipid,
      selfHeadUrl: app.globalData.selfHeadUrl,
      friendHeadUrl: app.globalData.friendHeadUrl,
      likeStatus: likeStatus,
      contactStatus: contactStatus
    })
    that.getNotice();
    that.getLastList();
    selSess = new webim.Session(selType, that.data.selToID, that.data.selfHeadUrl, Math.round(new Date().getTime() / 1000));
    app.getAvatar(options.skipid.toString(), function (res) {
      that.setData({
        friendHeadUrl: res,
      })
    })
    app.getNick(options.skipid.toString(), function (res) {
      wx.setNavigationBarTitle({
        title: res,
      })
    })
  },
  onShow:function(){
    this.getPower();
    this.getOrderInfo();
  }
})