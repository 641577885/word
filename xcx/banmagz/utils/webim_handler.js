var webim = require('webim.js');
var selToID, loginInfo, accountMode, accountType, sdkAppID, avChatRoomId, selType, selToID, selSess, selSessHeadUrl;

function sdkLogin(userInfo, listeners, options,fun) {
  //web sdk 登录
  webim.login(userInfo, listeners, options,
    function (identifierNick) {
      //console.debug(identifierNick);
      //identifierNick为登录用户昵称(没有设置时，为帐号)，无登录态时为空
      webim.Log.info('webim登录成功');
      loginInfo = userInfo;
    },
    function (err) {
      console.error(err.ErrorInfo);
    }
  )
}

//添加好友
function applyAddFriend() {
  var add_friend_item = [
    {
      'To_Account': 'user93082808',
      "AddSource": "AddSource_Type_Unknow",
      "AddWording": '' //加好友附言，可为空
    }
  ];
  var options = {
    'From_Account': 'user930828',
    'AddFriendItem': add_friend_item
  };
  webim.applyAddFriend(
    options,
    function (resp) {
      console.log(resp)
      if (resp.Fail_Account && resp.Fail_Account.length > 0) {
        for (var i in resp.ResultItem) {
          console.error("s")
          console.log(resp.ResultItem[i].ResultInfo);
          break;
        }
      } else {
        getAllFriend()
        // if ($('#af_allow_type').val() == '允许任何人') {
        //   //重新加载好友列表
        //   //getAllFriend(getAllFriendsCallbackOK);
        //   alert('添加好友成功');
        // } else {
        //   $('#add_friend_dialog').modal('hide');
        //   alert('申请添加好友成功');
        // }

      }
    },
    function (err) {
      console.log(err.ErrorInfo);
    }
  )
}

//获取好友列表
function getAllFriend(cbOK, cbErr) {
  var options = {
    'From_Account': loginInfo.identifier,
    'TimeStamp': 0,
    'StartIndex': 0,
    'GetCount': 1,
    'LastStandardSequence': 0,
    "TagList":
    [
      "Tag_Profile_IM_Nick",
      "Tag_SNS_IM_Remark"
    ]
  };
  webim.getAllFriend(
    options,
    function (resp) {
      console.log(resp)
      
    },
    function (err) {
      console.log(err)
    }
  );
}
//把消息转换成Html
function convertMsgtoHtml(msg) {
  var html = "", elems, elem, type, content;
  elems = msg.getElems();//获取消息包含的元素数组
  for (var i in elems) {
    elem = elems[i];
    type = elem.getType();//获取元素类型
    content = elem.getContent();//获取元素对象
    switch (type) {
      case webim.MSG_ELEMENT_TYPE.TEXT:
        html += convertTextMsgToHtml(content);
        break;
      case webim.MSG_ELEMENT_TYPE.FACE:
        html += convertFaceMsgToHtml(content);
        break;
      case webim.MSG_ELEMENT_TYPE.IMAGE:
        html += convertImageMsgToHtml(content);
        break;
      case webim.MSG_ELEMENT_TYPE.SOUND:
        html += convertSoundMsgToHtml(content);
        break;
      case webim.MSG_ELEMENT_TYPE.FILE:
        html += convertFileMsgToHtml(content);
        break;
      case webim.MSG_ELEMENT_TYPE.LOCATION://暂不支持地理位置
        //html += convertLocationMsgToHtml(content);
        break;
      case webim.MSG_ELEMENT_TYPE.CUSTOM:
        html += convertCustomMsgToHtml(content);
        break;
      case webim.MSG_ELEMENT_TYPE.GROUP_TIP:
        html += convertGroupTipMsgToHtml(content);
        break;
      default:
        webim.Log.error('未知消息元素类型: elemType=' + type);
        break;
    }
  }
  return webim.Tool.formatHtml2Text(html);
}

//解析文本消息元素
function convertTextMsgToHtml(content) {
  return content.getText();
}
//解析表情消息元素
function convertFaceMsgToHtml(content) {
  return content.getData();
  return content;
  var faceUrl = null;
  var data = content.getData();
  var index = webim.EmotionDataIndexs[data];

  var emotion = webim.Emotions[index];
  if (emotion && emotion[1]) {
    faceUrl = emotion[1];
  }
  if (faceUrl) {
    return "<img src='" + faceUrl + "'/>";
  } else {
    return data;
  }
}
//解析图片消息元素
function convertImageMsgToHtml(content) {
  var smallImage = content.getImage(webim.IMAGE_TYPE.SMALL);//小图
  var bigImage = content.getImage(webim.IMAGE_TYPE.LARGE);//大图
  var oriImage = content.getImage(webim.IMAGE_TYPE.ORIGIN);//原图
  if (!bigImage) {
    bigImage = smallImage;
  }
  if (!oriImage) {
    oriImage = smallImage;
  }
  return "<img src='" + smallImage.getUrl() + "#" + bigImage.getUrl() + "#" + oriImage.getUrl() + "' style='CURSOR: hand' id='" + content.getImageId() + "' bigImgUrl='" + bigImage.getUrl() + "' onclick='imageClick(this)' />";
}
//解析语音消息元素
function convertSoundMsgToHtml(content) {
  var second = content.getSecond();//获取语音时长
  var downUrl = content.getDownUrl();
  if (webim.BROWSER_INFO.type == 'ie' && parseInt(webim.BROWSER_INFO.ver) <= 8) {
    return '[这是一条语音消息]demo暂不支持ie8(含)以下浏览器播放语音,语音URL:' + downUrl;
  }
  return '<audio src="' + downUrl + '" controls="controls" onplay="onChangePlayAudio(this)" preload="none"></audio>';
}
//解析文件消息元素
function convertFileMsgToHtml(content) {
  var fileSize = Math.round(content.getSize() / 1024);
  return '<a href="' + content.getDownUrl() + '" title="点击下载文件" ><i class="glyphicon glyphicon-file">&nbsp;' + content.getName() + '(' + fileSize + 'KB)</i></a>';

}
//解析位置消息元素
function convertLocationMsgToHtml(content) {
  return '经度=' + content.getLongitude() + ',纬度=' + content.getLatitude() + ',描述=' + content.getDesc();
}
//解析自定义消息元素
function convertCustomMsgToHtml(content) {
  var data = content.getData();
  var desc = content.getDesc();
  var ext = content.getExt();
  return "data=" + data + ", desc=" + desc + ", ext=" + ext;
}
//解析群提示消息元素
function convertGroupTipMsgToHtml(content) {
  var WEB_IM_GROUP_TIP_MAX_USER_COUNT = 10;
  var text = "";
  var maxIndex = WEB_IM_GROUP_TIP_MAX_USER_COUNT - 1;
  var opType, opUserId, userIdList;
  var memberCount;
  opType = content.getOpType();//群提示消息类型（操作类型）
  opUserId = content.getOpUserId();//操作人id
  switch (opType) {
    case webim.GROUP_TIP_TYPE.JOIN://加入群
      userIdList = content.getUserIdList();
      //text += opUserId + "邀请了";
      for (var m in userIdList) {
        text += userIdList[m] + ",";
        if (userIdList.length > WEB_IM_GROUP_TIP_MAX_USER_COUNT && m == maxIndex) {
          text += "等" + userIdList.length + "人";
          break;
        }
      }
      text = text.substring(0, text.length - 1);
      text += "进入房间";
      //房间成员数加1
      // memberCount = $('#user-icon-fans').html();
      memberCount = parseInt(memberCount) + 1;
      break;
    case webim.GROUP_TIP_TYPE.QUIT://退出群
      text += opUserId + "离开房间";
      //房间成员数减1
      if (memberCount > 0) {
        memberCount = parseInt(memberCount) - 1;
      }
      break;
    case webim.GROUP_TIP_TYPE.KICK://踢出群
      text += opUserId + "将";
      userIdList = content.getUserIdList();
      for (var m in userIdList) {
        text += userIdList[m] + ",";
        if (userIdList.length > WEB_IM_GROUP_TIP_MAX_USER_COUNT && m == maxIndex) {
          text += "等" + userIdList.length + "人";
          break;
        }
      }
      text += "踢出该群";
      break;
    case webim.GROUP_TIP_TYPE.SET_ADMIN://设置管理员
      text += opUserId + "将";
      userIdList = content.getUserIdList();
      for (var m in userIdList) {
        text += userIdList[m] + ",";
        if (userIdList.length > WEB_IM_GROUP_TIP_MAX_USER_COUNT && m == maxIndex) {
          text += "等" + userIdList.length + "人";
          break;
        }
      }
      text += "设为管理员";
      break;
    case webim.GROUP_TIP_TYPE.CANCEL_ADMIN://取消管理员
      text += opUserId + "取消";
      userIdList = content.getUserIdList();
      for (var m in userIdList) {
        text += userIdList[m] + ",";
        if (userIdList.length > WEB_IM_GROUP_TIP_MAX_USER_COUNT && m == maxIndex) {
          text += "等" + userIdList.length + "人";
          break;
        }
      }
      text += "的管理员资格";
      break;

    case webim.GROUP_TIP_TYPE.MODIFY_GROUP_INFO://群资料变更
      text += opUserId + "修改了群资料：";
      var groupInfoList = content.getGroupInfoList();
      var type, value;
      for (var m in groupInfoList) {
        type = groupInfoList[m].getType();
        value = groupInfoList[m].getValue();
        switch (type) {
          case webim.GROUP_TIP_MODIFY_GROUP_INFO_TYPE.FACE_URL:
            text += "群头像为" + value + "; ";
            break;
          case webim.GROUP_TIP_MODIFY_GROUP_INFO_TYPE.NAME:
            text += "群名称为" + value + "; ";
            break;
          case webim.GROUP_TIP_MODIFY_GROUP_INFO_TYPE.OWNER:
            text += "群主为" + value + "; ";
            break;
          case webim.GROUP_TIP_MODIFY_GROUP_INFO_TYPE.NOTIFICATION:
            text += "群公告为" + value + "; ";
            break;
          case webim.GROUP_TIP_MODIFY_GROUP_INFO_TYPE.INTRODUCTION:
            text += "群简介为" + value + "; ";
            break;
          default:
            text += "未知信息为:type=" + type + ",value=" + value + "; ";
            break;
        }
      }
      break;

    case webim.GROUP_TIP_TYPE.MODIFY_MEMBER_INFO://群成员资料变更(禁言时间)
      text += opUserId + "修改了群成员资料:";
      var memberInfoList = content.getMemberInfoList();
      var userId, shutupTime;
      for (var m in memberInfoList) {
        userId = memberInfoList[m].getUserId();
        shutupTime = memberInfoList[m].getShutupTime();
        text += userId + ": ";
        if (shutupTime != null && shutupTime !== undefined) {
          if (shutupTime == 0) {
            text += "取消禁言; ";
          } else {
            text += "禁言" + shutupTime + "秒; ";
          }
        } else {
          text += " shutupTime为空";
        }
        if (memberInfoList.length > WEB_IM_GROUP_TIP_MAX_USER_COUNT && m == maxIndex) {
          text += "等" + memberInfoList.length + "人";
          break;
        }
      }
      break;
    default:
      text += "未知群提示消息类型：type=" + opType;
      break;
  }
  return text;
}

function init(opts) {
  accountMode = opts.accountMode;
  accountType = opts.accountType;
  sdkAppID = opts.sdkAppID;
  avChatRoomId = opts.avChatRoomId;
  selType = opts.selType;
  selToID = opts.selToID;
}

module.exports = {
  init: init,
  sdkLogin: sdkLogin,
  convertMsgtoHtml: convertMsgtoHtml,
  applyAddFriend: applyAddFriend,
  convertTextMsgToHtml: convertTextMsgToHtml,
  convertFaceMsgToHtml: convertFaceMsgToHtml,
  convertImageMsgToHtml: convertImageMsgToHtml,
  convertSoundMsgToHtml: convertSoundMsgToHtml,
  convertFileMsgToHtml: convertFileMsgToHtml,
  convertLocationMsgToHtml: convertLocationMsgToHtml,
  convertCustomMsgToHtml: convertCustomMsgToHtml,
  convertGroupTipMsgToHtml: convertGroupTipMsgToHtml,
};