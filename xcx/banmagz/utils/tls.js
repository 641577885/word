var encrypt = require('encrypt.js');
var sdkappid, user;

function login(opts){
  //var user = "user" + parseInt(Math.random(0, 1) * 1000000) ;
    wx.request({
        url:'https://www.itszebra.com/api/pub/getusersig',
        data: {
          "id": user,
          "appid": sdkappid
        },
        method: 'post',
        header: {
             'content-type': 'application/json'
        },
        success: function(res) {
            opts.success && opts.success({
              Identifier: user,
                UserSig: res.data.data.userSig
            });
        },
        fail : function(errMsg){
            opts.error && opts.error(errMsg);
        }
    });
}

module.exports = {
    init : function(opts){
      sdkappid = opts.sdkappid;
      user = opts.identifier;
    },
    login : login
};