

//初始化我的最近会话表格
function initGetRecentContactListTable(data) {
    $('#get_recent_contact_list_table').bootstrapTable({
        method: 'get',
        cache: false,
        height: 500,
        striped: true,
        pagination: true,
        pageSize: pageSize,
        pageNumber: 1,
        pageList: [10, 20, 50, 100],
        search: true,
        showColumns: true,
        clickToSelect: true,
        columns: [{
            field: 'SessionType',
            title: '会话类型(英文)',
            align: 'center',
            valign: 'middle',
            sortable: 'true',
            visible: false
        }, {
            field: 'SessionTypeZh',
            title: '会话类型',
            align: 'center',
            valign: 'middle',
            sortable: 'true'
        }, {
            field: 'SessionId',
            title: '会话ID',
            align: 'center',
            valign: 'middle',
            sortable: 'true'
        }, {
            field: 'SessionNick',
            title: '会话昵称',
            align: 'center',
            valign: 'middle',
            sortable: 'true'
        }, {
            field: 'SessionImage',
            title: '会话头像',
            align: 'center',
            valign: 'middle',
            sortable: 'true',
            visible: false
        }, {
            field: 'C2cAccount',
            title: '发送者ID',
            align: 'center',
            valign: 'middle',
            sortable: 'true'
        }, {
            field: 'C2cNick',
            title: '发送者昵称',
            align: 'center',
            valign: 'middle',
            sortable: 'true'
        }, {
            field: 'UnreadMsgCount',
            title: '未读数',
            align: 'center',
            valign: 'middle',
            sortable: 'true'
        }, {
            field: 'MsgSeq',
            title: 'Seq',
            align: 'center',
            valign: 'middle',
            sortable: 'true'
        }, {
            field: 'MsgRandom',
            title: 'Random',
            align: 'center',
            valign: 'middle',
            sortable: 'true'
        }, {
            field: 'MsgTimeStamp',
            title: '时间',
            align: 'center',
            valign: 'middle',
            sortable: 'true'
        }, {
            field: 'MsgShow',
            title: '内容',
            align: 'center',
            valign: 'middle',
            sortable: 'true'
        }],
        data: data,
        formatNoMatches: function formatNoMatches() {
            return '无符合条件的记录';
        }
    });
} //我的最近联系人


const getRecentContactList = function getRecentContactList() {
    initGetRecentContactListTable([]);
    webim.getRecentContactList({}, function (resp) {
        var data = [];
        var tempSess,
            tempSessMap = {}; //临时会话变量

        if (resp.SessionItem && resp.SessionItem.length > 0) {
          for (var i in resp.SessionItem) {
            var item = resp.SessionItem[i];
            var type = item.Type; //接口返回的会话类型

            var sessType,
                typeZh,
                sessionId,
                sessionNick = '',
                sessionImage = '',
                senderId = '',
                senderNick = '';

            if (type == webim.RECENT_CONTACT_TYPE.C2C) {
              //私聊
              typeZh = '私聊';
              sessType = webim.SESSION_TYPE.C2C; //设置会话类型

              sessionId = item.To_Account; //会话id，私聊时为好友ID或者系统账号（值为@TIM#SYSTEM，业务可以自己决定是否需要展示），注意：从To_Account获取,

              if (sessionId == '@TIM#SYSTEM') {
                //先过滤系统消息，，
                webim.Log.warn('过滤好友系统消息,sessionId=' + sessionId);
                continue;
              }

              var key = sessType + '_' + sessionId;
              var c2cInfo = infoMap[key];

              if (c2cInfo && c2cInfo.name) {
                //从infoMap获取c2c昵称
                sessionNick = c2cInfo.name; //会话昵称，私聊时为好友昵称，接口暂不支持返回，需要业务自己获取（前提是用户设置过自己的昵称，通过拉取好友资料接口（支持批量拉取）得到）
              } else {
                //没有找到或者没有设置过
                sessionNick = sessionId; //会话昵称，如果昵称为空，默认将其设成会话id
              }

              if (c2cInfo && c2cInfo.image) {
                //从infoMap获取c2c头像
                sessionImage = c2cInfo.image; //会话头像，私聊时为好友头像，接口暂不支持返回，需要业务自己获取（前提是用户设置过自己的昵称，通过拉取好友资料接口（支持批量拉取）得到）
              } else {
                //没有找到或者没有设置过
                sessionImage = friendHeadUrl; //会话头像，如果为空，默认将其设置demo自带的头像
              }

              senderId = senderNick = ''; //私聊时，这些字段用不到，直接设置为空
            } else if (type == webim.RECENT_CONTACT_TYPE.GROUP) {
              //群聊
              typeZh = '群聊';
              sessType = webim.SESSION_TYPE.GROUP; //设置会话类型

              sessionId = item.ToAccount; //会话id，群聊时为群ID，注意：从ToAccount获取

              sessionNick = item.GroupNick; //会话昵称，群聊时，为群名称，接口一定会返回

              if (item.GroupImage) {
                //优先考虑接口返回的群头像
                sessionImage = item.GroupImage; //会话头像，群聊时，群头像，如果业务设置过群头像（设置群头像请参考wiki文档-设置群资料接口），接口会返回
              } else {
                //接口没有返回或者没有设置过群头像，再从infoMap获取群头像
                var key = sessType + '_' + sessionId;
                var groupInfo = infoMap[key];

                if (groupInfo && groupInfo.image) {
                  //
                  sessionImage = groupInfo.image;
                } else {
                  //不存在或者没有设置过，则使用默认头像
                  sessionImage = groupHeadUrl; //会话头像，如果没有设置过群头像，默认将其设置demo自带的头像
                }
              }

              senderId = item.MsgGroupFrom_Account; //群消息的发送者id

              if (!senderId) {
                //发送者id为空
                webim.Log.warn('群消息发送者id为空,senderId=' + senderId + ',groupid=' + sessionId);
                continue;
              }

              if (senderId == '@TIM#SYSTEM') {
                //先过滤群系统消息，因为接口暂时区分不了是进群还是退群等提示消息，
                webim.Log.warn('过滤群系统消息,senderId=' + senderId + ',groupid=' + sessionId);
                continue;
              }

              senderNick = item.MsgGroupFromCardName; //优先考虑群成员名片

              if (!senderNick) {
                //如果没有设置群成员名片
                senderNick = item.MsgGroupFromNickName; //再考虑接口是否返回了群成员昵称

                if (!senderNick) {
                  //如果接口没有返回昵称或者没有设置群昵称，从infoMap获取昵称
                  var key = webim.SESSION_TYPE.C2C + '_' + senderId;
                  var c2cInfo = infoMap[key];

                  if (c2cInfo && c2cInfo.name) {
                    senderNick = c2cInfo.name; //发送者群昵称
                  } else {
                    sessionNick = senderId; //如果昵称为空，默认将其设成发送者id
                  }
                }
              }
            } else {
              typeZh = '未知类型';
              sessionId = item.ToAccount; //
            }

            if (!sessionId) {
              //会话id为空
              webim.Log.warn('会话id为空,sessionId=' + sessionId);
              continue;
            }

            if (sessionId == '@TLS#NOT_FOUND') {
              //会话id不存在，可能是已经被删除了
              webim.Log.warn('会话id不存在,sessionId=' + sessionId);
              continue;
            }

            if (sessionNick.length > maxNameLen) {
              //帐号或昵称过长，截取一部分，出于demo需要，业务可以自己决定
              sessionNick = sessionNick.substr(0, maxNameLen) + '...';
            }

            tempSess = tempSessMap[sessType + '_' + sessionId];

            if (!tempSess) {
              //先判断是否存在（用于去重），不存在增加一个
              tempSessMap[sessType + '_' + sessionId] = true;
              data.push({
                SessionType: sessType,
                //会话类型
                SessionTypeZh: typeZh,
                //会话类型中文
                SessionId: webim.Tool.formatText2Html(sessionId),
                //会话id
                SessionNick: webim.Tool.formatText2Html(sessionNick),
                //会话昵称
                SessionImage: sessionImage,
                //会话头像
                C2cAccount: webim.Tool.formatText2Html(senderId),
                //发送者id
                C2cNick: webim.Tool.formatText2Html(senderNick),
                //发送者昵称
                UnreadMsgCount: item.UnreadMsgCount,
                //未读消息数
                MsgSeq: item.MsgSeq,
                //消息seq
                MsgRandom: item.MsgRandom,
                //消息随机数
                MsgTimeStamp: webim.Tool.formatTimeStamp(item.MsgTimeStamp),
                //消息时间戳
                MsgShow: item.MsgShow //消息内容

              });
            }
          }
        }

        $('#get_recent_contact_list_table').bootstrapTable('load', data);
        $('#get_recent_contact_list_dialog').modal('show');
      }, function (err) {
        alert(err.ErrorInfo);
      });
}; //初始化聊天界面左侧最近会话列表


var initRecentContactList = function initRecentContactList(cbOK, cbErr) {
    const options = {
        Count: reqRecentSessCount //要拉取的最近会话条数

    };
    webim.getRecentContactList(options, function (resp) {
  var tempSess; //临时会话变量

  var firstSessType; //保存第一个会话类型

  var firstSessId; //保存第一个会话id

  //清空聊天对象列表

  var sessList = document.getElementsByClassName('sesslist')[0];
  sessList.innerHTML = '';
  if (resp.SessionItem && resp.SessionItem.length > 0) {
    //如果存在最近会话记录
    for (var i in resp.SessionItem) {
      var item = resp.SessionItem[i];
      var type = item.Type; //接口返回的会话类型

      var sessType,
          typeZh,
          sessionId,
          sessionNick = '',
          sessionImage = '',
          senderId = '',
          senderNick = '',
          lastMsg = item.LastMsg && item.LastMsg.MsgBody[0].MsgContent.Text;

      if (type == webim.RECENT_CONTACT_TYPE.C2C) {
        //私聊
        typeZh = '私聊';
        sessType = webim.SESSION_TYPE.C2C; //设置会话类型

        sessionId = item.To_Account; //会话id，私聊时为好友ID或者系统账号（值为@TIM#SYSTEM，业务可以自己决定是否需要展示），注意：从To_Account获取,

        if (sessionId == '@TIM#SYSTEM') {
          //先过滤系统消息，，
          webim.Log.warn('过滤好友系统消息,sessionId=' + sessionId);
          continue;
        }

        var key = sessType + '_' + sessionId;
        var c2cInfo = infoMap[key];

        if (c2cInfo && c2cInfo.name) {
          //从infoMap获取c2c昵称
          sessionNick = c2cInfo.name; //会话昵称，私聊时为好友昵称，接口暂不支持返回，需要业务自己获取（前提是用户设置过自己的昵称，通过拉取好友资料接口（支持批量拉取）得到）
        } else {
          //没有找到或者没有设置过
          sessionNick = sessionId; //会话昵称，如果昵称为空，默认将其设成会话id
        }

        if (c2cInfo && c2cInfo.image) {
          //从infoMap获取c2c头像
          sessionImage = c2cInfo.image; //会话头像，私聊时为好友头像，接口暂不支持返回，需要业务自己获取（前提是用户设置过自己的昵称，通过拉取好友资料接口（支持批量拉取）得到）
        } else {
          //没有找到或者没有设置过
          sessionImage = friendHeadUrl; //会话头像，如果为空，默认将其设置demo自带的头像
        }

        senderId = senderNick = ''; //私聊时，这些字段用不到，直接设置为空
      } else if (type == webim.RECENT_CONTACT_TYPE.GROUP) {
        //群聊
        typeZh = '群聊';
        sessType = webim.SESSION_TYPE.GROUP; //设置会话类型

        sessionId = item.ToAccount; //会话id，群聊时为群ID，注意：从ToAccount获取

        sessionNick = item.GroupNick; //会话昵称，群聊时，为群名称，接口一定会返回

        if (item.GroupImage) {
          //优先考虑接口返回的群头像
          sessionImage = item.GroupImage; //会话头像，群聊时，群头像，如果业务设置过群头像（设置群头像请参考wiki文档-设置群资料接口），接口会返回
        } else {
          //接口没有返回或者没有设置过群头像，再从infoMap获取群头像
          var key = sessType + '_' + sessionId;
          var groupInfo = infoMap[key];

          if (groupInfo && groupInfo.image) {
            //
            sessionImage = groupInfo.image;
          } else {
            //不存在或者没有设置过，则使用默认头像
            sessionImage = groupHeadUrl; //会话头像，如果没有设置过群头像，默认将其设置demo自带的头像
          }
        }

        senderId = item.MsgGroupFrom_Account; //群消息的发送者id

        if (!senderId) {
          //发送者id为空
          webim.Log.warn('群消息发送者id为空,senderId=' + senderId + ',groupid=' + sessionId);
          continue;
        }

        if (senderId == '@TIM#SYSTEM') {
          //先过滤群系统消息，因为接口暂时区分不了是进群还是退群等提示消息，
          webim.Log.warn('过滤群系统消息,senderId=' + senderId + ',groupid=' + sessionId);
          continue;
        }

        senderNick = item.MsgGroupFromCardName; //优先考虑群成员名片

        if (!senderNick) {
          //如果没有设置群成员名片
          senderNick = item.MsgGroupFromNickName; //再考虑接口是否返回了群成员昵称

          if (!senderNick && !sessionNick) {
            //如果接口没有返回昵称或者没有设置群昵称，从infoMap获取昵称
            var key = webim.SESSION_TYPE.C2C + '_' + senderId;
            var c2cInfo = infoMap[key];

            if (c2cInfo && c2cInfo.name) {
              senderNick = c2cInfo.name; //发送者群昵称
            } else {
              sessionNick = senderId; //如果昵称为空，默认将其设成发送者id
            }
          }
        }
      } else {
        typeZh = '未知类型';
        sessionId = item.ToAccount; //
      }

      if (!sessionId) {
        //会话id为空
        webim.Log.warn('会话id为空,sessionId=' + sessionId);
        continue;
      }

      if (sessionId == '@TLS#NOT_FOUND') {
        //会话id不存在，可能是已经被删除了
        webim.Log.warn('会话id不存在,sessionId=' + sessionId);
        continue;
      }

      if (sessionNick.length > maxNameLen) {
        //帐号或昵称过长，截取一部分，出于demo需要，业务可以自己决定
        sessionNick = sessionNick.substr(0, maxNameLen) + '...';
      }

      tempSess = recentSessMap[sessType + sessionId];

      if (!tempSess) {
        //先判断是否存在（用于去重），不存在增加一个
        if (!firstSessId) {
          firstSessType = sessType; //记录第一个会话类型

          firstSessId = sessionId; //记录第一个会话id
        }

        recentSessMap[sessType + sessionId] = {
          SessionType: sessType,
          //会话类型
          SessionId: sessionId,
          //会话对象id，好友id或者群id
          SessionNick: sessionNick,
          //会话昵称，好友昵称或群名称
          SessionImage: sessionImage,
          //会话头像，好友头像或者群头像
          C2cAccount: senderId,
          //发送者id，群聊时，才有用
          C2cNick: senderNick,
          //发送者昵称，群聊时，才有用
          UnreadMsgCount: item.UnreadMsgCount,
          //未读消息数,私聊时需要通过webim.syncMsgs(initUnreadMsgCount)获取,参考后面的demo，群聊时不需要。
          MsgSeq: item.MsgSeq,
          //消息seq
          MsgRandom: item.MsgRandom,
          //消息随机数
          MsgTimeStamp: webim.Tool.formatTimeStamp(item.MsgTimeStamp),
          //消息时间戳
          MsgGroupReadedSeq: item.MsgGroupReadedSeq || 0,
          MsgShow: item.MsgShow //消息内容,文本消息为原内容，表情消息为[表情],其他类型消息以此类推

        }; //在左侧最近会话列表框中增加一个会话div

        addSess(sessType, webim.Tool.formatText2Html(sessionId), webim.Tool.formatText2Html(sessionNick), sessionImage, item.UnreadMsgCount, 'sesslist', 'TAIL', null, lastMsg);
      }
    } //清空聊天界面


    document.getElementsByClassName('msgflow')[0].innerHTML = '';
    tempSess = recentSessMap[firstSessType + firstSessId]; //选中第一个会话
    console.log(tempSess,'克里斯多夫看')
    selType = tempSess.SessionType; //初始化当前聊天类型
    selToID = tempSess.SessionId; //初始化当前聊天对象id
    idTime = selToID;
    selSess = webim.MsgStore.sessByTypeId(selType, selToID); //初始化当前会话对象
    console.log(tempSess,'开了会让他来')
    console.debug('herer');
    webim.syncMsgs(initUnreadMsgCount); //初始化最近会话的消息未读数
    if (cbOK) //回调
      {
        cbOK();
      }
  }
  //跳转到im页面处理
  timeId = window.location.search.split('=')[2];
  timeType = window.location.search.split('=')[1];
  if (timeType === '1') {
    // setTimeout(function () {
      timeId = window.location.search.split('=')[2]; // timeId = 12107;
      var timeGroundName = decodeURI(window.location.search.split('=')[4]);
      var urlFace = decodeURI(window.location.search.split('=')[5]);
      timeType = window.location.search.split('=')[1];
      if(window.location.search.split('=')[3] === '5'){
        groudTalk(timeId,timeGroundName,false,urlFace)
      }else{
        C2Ctalk(timeId, urlFace);
      }
  } else if (timeType === '2') {
    var sessDiv_2 = document.getElementById('sessDiv_2');
    sessDiv_2.onclick();
  } else if (timeType === '3') {
    var sessDiv_1 = document.getElementById('sessDiv_1');
    sessDiv_1.onclick();
  }
}, cbErr);
}; //初始化最近会话的消息未读数

//临时聊天
function C2Ctalk (tName, tUrl){
    toAccount = tName;
    msgtosend = '向您发起临时会话';
    friendHeadUrl = tUrl;
    const msgLen = webim.Tool.getStrBytes(msgtosend);
    let maxLen,
        errInfo;
    maxLen = webim.MSG_MAX_LENGTH.C2C;
    errInfo = '消息长度超出限制(最多' + Math.round(maxLen / 3) + '汉字)';

    if (msgtosend.length < 1) {
        alert('发送的消息不能为空!');
        $('#send_msg_text').val('');
        return;
    }

    if (msgLen > maxLen) {
        alert(errInfo);
        return;
    }

    let sess = webim.MsgStore.sessByTypeId(webim.SESSION_TYPE.C2C, toAccount);

    if (!sess) {
        sess = new webim.Session(webim.SESSION_TYPE.C2C, toAccount, toAccount, friendHeadUrl, Math.round(new Date().getTime() / 1000));
    }

    const isSend = true; //是否为自己发送

    const seq = -1; //消息序列，-1表示sdk自动生成，用于去重

    const random = Math.round(Math.random() * 4294967296); //消息随机数，用于去重

    const msgTime = Math.round(new Date().getTime() / 1000); //消息时间戳

    let subType; //消息子类型

    subType = webim.C2C_MSG_SUB_TYPE.COMMON;
    const msg = new webim.Msg(sess, isSend, seq, random, msgTime, loginInfo.identifier, subType, loginInfo.identifierNick);
    let text_obj;
    text_obj = new webim.Msg.Elem.Text(msgtosend);
    msg.addText(text_obj);
    webim.sendMsg(msg, function(resp){
        if (!selToID) {
            //没有聊天会话
            selType = webim.SESSION_TYPE.C2C;
            selToID = toAccount;
            selSess = sess;
            addSess(selType, toAccount, toAccount, friendHeadUrl, 0, 'sesslist', 'HEAD');
            setSelSessStyleOn(toAccount); //私聊时，在聊天窗口手动添加一条发的消息，群聊时，长轮询接口会返回自己发的消息

            addMsg(msg);
        } else {
            if (selToID == toAccount) {
                addMsg(msg);
            } else {
                //聊天对象发生改变
                const tempSessDiv = document.getElementById('sessDiv_' + toAccount);
                if (!tempSessDiv) {
                    //不存在这个会话
                    addSess(webim.SESSION_TYPE.C2C, toAccount, toAccount, friendHeadUrl, 0, 'sesslist', 'HEAD'); //增加一个会话
                }
                onSelSess(webim.SESSION_TYPE.C2C, toAccount); //再进行切换
            }
        }
        webim.Tool.setCookie('tmpmsg_' + toAccount, '', 0);
        var sessDiv_2 = document.getElementById('sessDiv_'+id);
        sessDiv_2.onclick();
        $('#scm_content').val('');
        $('#send_c2c_msg_dialog').modal('hide');
        $('#get_my_friend_dialog').modal('hide');
    }, function(err){
      if (err.ErrorCode === 20003) {
        alert('该用户并未注册cam');
      }
    });
}

//临时群聊
function groudTalk(id,groundName,time,url){
    toAccount = id;
    toName = groundName;
    groupHeadUrl = url;
    // groupHeadUrl = 'http://pic41.nipic.com/20140521/18815249_125514431172_2.jpg';
    if(time){
      msgtosend = '已创建群聊 '+groundName+' ('+id+')';
    }else{
      msgtosend = '发起临时聊天';
    }
    let msgLen = webim.Tool.getStrBytes(msgtosend);
    let maxLen,errInfo;
    maxLen = webim.MSG_MAX_LENGTH.GROUP;
    errInfo = '消息长度超出限制(最多' + Math.round(maxLen / 3) + '汉字)';

    if (msgtosend.length < 1) {
        alert('发送的消息不能为空!');
        return;
    }

    if (msgLen > maxLen) {
        alert(errInfo);
        return;
    }

    let sess = webim.MsgStore.sessByTypeId(webim.SESSION_TYPE.GROUP, toAccount);

    if (!sess) {
        sess = new webim.Session(webim.SESSION_TYPE.GROUP, toAccount, toName, groupHeadUrl, Math.round(new Date().getTime() / 1000));
    }

    let isSend = true; //是否为自己发送

    let seq = -1; //消息序列，-1表示sdk自动生成，用于去重

    let random = Math.round(Math.random() * 4294967296); //消息随机数，用于去重

    let msgTime = Math.round(new Date().getTime() / 1000); //消息时间戳

    let subType; //消息子类型

    subType = webim.GROUP_MSG_SUB_TYPE.COMMON;
    let msg = new webim.Msg(sess, isSend, seq, random, msgTime, loginInfo.identifier, subType, loginInfo.identifierNick);
    let text_obj;
    text_obj = new webim.Msg.Elem.Text(msgtosend);
    msg.addText(text_obj);
    webim.sendMsg(msg, function(resp){
        if (!selToID) {
          //没有聊天会话
          selType = webim.SESSION_TYPE.GROUP;
          selToID = toAccount;
          selSess = sess;
          addSess(selType, toAccount, toName, groupHeadUrl, 0, 'sesslist','HEAD');
          setSelSessStyleOn(toAccount); //群聊时，长轮询接口会返回自己发的消息
          //addMsg(msg);
        } else {
          //有聊天会话
          if (selToID == toAccount) {//聊天对象不变
            //不做任何操作
          } else {
            //聊天对象发生改变
            var tempSessDiv = document.getElementById('sessDiv_' + toAccount);

            if (!tempSessDiv) {
              //不存在这个会话
              addSess(webim.SESSION_TYPE.GROUP, toAccount, toName, groupHeadUrl, 0, 'sesslist','HEAD'); //增加一个会话
            }

            onSelSess(webim.SESSION_TYPE.GROUP, toAccount); //再进行切换
          }
        }

        webim.Tool.setCookie('tmpmsg_' + toAccount, '', 0);
        $('#sgm_content').val('');
        $('#send_group_msg_dialog').modal('hide');
        $('#get_my_group_dialog').modal('hide');
    },(function (err) {
      alert('没有这个群聊');
      $('#sgm_content').val('');
    }));
  }

function initUnreadMsgCount() {
    let sess;
    const sessMap = webim.MsgStore.sessMap();
    for (var i in sessMap) {
        sess = sessMap[i]; // if (selToID && selToID != sess.id()) { //更新其他聊天对象的未读消息数
        updateSessDiv(sess.type(), sess.id(), sess.name(), sess.unread()); // }
    }
}
