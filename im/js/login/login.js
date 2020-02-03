"use strict";

//tls登录
function tlsLogin() {
  //跳转到TLS登录页面
  TLSHelper.goLogin({
    sdkappid: loginInfo.sdkAppID,
    acctype: loginInfo.accountType,
    url: window.location.href
  });
} //第三方应用需要实现这个函数，并在这里拿到UserSig


function tlsGetUserSig(res) {
  //成功拿到凭证
  if (res.ErrorCode == webim.TLS_ERROR_CODE.OK) {
    //从当前URL中获取参数为identifier的值
    loginInfo.identifier = webim.Tool.getQueryString('identifier'); //拿到正式身份凭证

    loginInfo.userSig = res.UserSig; //从当前URL中获取参数为sdkappid的值

    loginInfo.sdkAppID = loginInfo.appIDAt3rd = Number(webim.Tool.getQueryString('sdkappid')); //从cookie获取accountType

    var accountType = webim.Tool.getCookie('accountType');

    if (accountType) {
      loginInfo.accountType = accountType; //sdk登录

    } else {
      alert('accountType非法');
    }
  } else {
    //签名过期，需要重新登录
    if (res.ErrorCode == webim.TLS_ERROR_CODE.SIGNATURE_EXPIRATION) {
      tlsLogin();
    } else {
      alert('[' + res.ErrorCode + ']' + res.ErrorInfo);
    }
  }
} //sdk登录


function webimLogin(successCB, errorCB) {
  $.ajax({
    type: "POST",
    url: ajaxUrl+"/get-sig",
    //这里写接口地址，
    data: {
      userToken: window.localStorage.getItem('zpyght_userToken')
    },
    //调用时的参数
    dataType: "json",
    //返回json,text,html你自己定
    success: function success(response) {
      //成功

      if (response.status === 0) {
        loginInfo.identifier = response.data.identifier;
        loginInfo.userSig = response.data.UserSig;
        webim.login(loginInfo, listeners, options, function (resp) {
          var tag_list = ['Tag_Profile_IM_Nick', 'Tag_Profile_IM_Gender', 'Tag_Profile_IM_AllowType', 'Tag_Profile_IM_Image'];
          var options = {
            To_Account: [loginInfo.identifier],
            TagList: tag_list
          };
          webim.getProfilePortrait(options, function (resp) {
            var nickAlls = ''
            if (loginInfo.identifierNick) {
              nickAlls = webim.Tool.formatText2Html(loginInfo.identifierNick);
            } else {
              nickAlls = webim.Tool.formatText2Html(loginInfo.identifier);
            } //菜单

            if (resp.UserProfileItem && resp.UserProfileItem.length > 0) {
              for (var i in resp.UserProfileItem) {
                var nick, gender, allowType, image;
                for (var j in resp.UserProfileItem[i].ProfileItem) {
                  switch (resp.UserProfileItem[i].ProfileItem[j].Tag) {
                    case 'Tag_Profile_IM_Nick':
                      nick = resp.UserProfileItem[i].ProfileItem[j].Value;
                      break;

                    case 'Tag_Profile_IM_Gender':
                      gender = resp.UserProfileItem[i].ProfileItem[j].Value;
                      break;

                    case 'Tag_Profile_IM_AllowType':
                      allowType = resp.UserProfileItem[i].ProfileItem[j].Value;
                      break;

                    case 'Tag_Profile_IM_Image':
                      image = resp.UserProfileItem[i].ProfileItem[j].Value;
                      break;
                  }
                }
                var profile_item_ones = [{
                  Tag: 'Tag_Profile_IM_Nick',
                  Value: nick || nickAlls
                }, {
                  Tag: 'Tag_Profile_IM_Gender',
                  Value: gender || 'Gender_Type_Male'
                }, {
                  Tag: 'Tag_Profile_IM_AllowType',
                  Value: "AllowType_Type_NeedConfirm"
                }];

                if (image) {
                  //如果设置了头像URL
                  profile_item_ones.push({
                    Tag: 'Tag_Profile_IM_Image',
                    Value: image
                  });
                }
                var optionsOnes = {
                  ProfileItem: profile_item_ones
                };
                webim.setProfilePortrait(optionsOnes, function (resp) {
                  console.log(resp,'好友添加')
                }, function (err) {
                  console.log(err,'好友错啦')
                });
              }
            }
          }, function (err) {
          });//设置个人信息，默认添加好友的时候需要验证

          successCB && successCB(resp);
          loginInfo.identifierNick = resp.identifierNick; //设置当前用户昵称

          loginInfo.headurl = resp.headurl; //设置当前用户头像

          initDemoApp();
        }, function (err) {
          alert(err.ErrorInfo);
          errorCB && errorCB(err);
        });
      } else if (response.status === 100 || response.status === 101) {
        alert('登录过期，请重新登录');
      }else if(response.status === 233){
        alert(response.message);
      }
    }
  }); // fetch('https://csapi.zzha.vip/teim/get-sig').then(response => {
  //     console.log(response, 'SDK浪费看来');
  //     loginInfo.identifier = response.data.identifier;
  //     loginInfo.userSig = response.data.UserSig;
  //     webim.login(
  //         loginInfo, listeners, options,
  //         (resp) => {
  //             successCB && successCB(resp);
  //             loginInfo.identifierNick = resp.identifierNick; //设置当前用户昵称
  //             loginInfo.headurl = resp.headurl; //设置当前用户头像
  //             initDemoApp();
  //         },
  //         (err) => {
  //             alert(err.ErrorInfo);
  //             errorCB && errorCB(err);
  //         }
  //     );
  // }).catch(data => {
  //     if (data.status === 100) {
  //         alert('登录过期，请重新登录');
  //     }
  // });
}
