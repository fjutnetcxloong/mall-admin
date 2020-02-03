
//更新最近会话的未读消息数
function updateSessDiv(sess_type, to_id, name, unread_msg_count) {
  var badgeDiv = document.getElementById('badgeDiv_' + to_id);

  if (badgeDiv && unread_msg_count > 0) {
    if (unread_msg_count >= 100) {
      unread_msg_count = '99+';
    } //收到消息时一键消灭未读消息
    // const recentInfo = document.getElementById('recentInfo');
    // const recentImg = document.getElementById('recentImg');
    // const newImg = document.createElement('img');
    // newImg.id = 'recentImg';
    // recentInfo.removeChild(recentImg);
    // newImg.src = 'img/icon_qingsao.png';
    // newImg.onclick = becomeRead;
    // recentInfo.appendChild(newImg);


    badgeDiv.innerHTML = '<span>' + unread_msg_count + '</span>';
    badgeDiv.style.display = 'block';
  } else if (badgeDiv == null) {
    //没有找到对应的聊天id
    var headUrl;

    if (sess_type == webim.SESSION_TYPE.C2C) {
      headUrl = friendHeadUrl;
    } else {
      headUrl = groupHeadUrl;
    }

    addSess(sess_type, to_id, name, headUrl, unread_msg_count, 'sesslist');
  }
} //新增一条最近会话


function addSess(sess_type, to_id, name, face_url, unread_msg_count, sesslist, addPositonType, newMsg, lastMsg) {
  var sessDivId = 'sessDiv_' + to_id;
  console.log(sessDivId,'开了房')
  var sessDiv = document.getElementById(sessDivId);
  if (sessDiv) {
    //先判断是否存在会话DIV，已经存在，则不需要增加
    return;
  }
  var sessList = document.getElementsByClassName(sesslist)[0];
  sessDiv = document.createElement('div');
  sessDiv.id = sessDivId; //如果当前选中的用户是最后一个用户

  sessDiv.className = 'sessinfo'; //添加单击用户头像事件

  sessDiv.onclick = function () {
    window.my = false; //用来区别是点击系统消息还是最近会话  false为最近会话，这个是为了防止，点击系统消息的时候会触发滚动而加的判断

    window.platMsg = false; // if (sessDiv.className == 'sessinfo-sel') return;

    timeId = '';
    onSelSess(sess_type, to_id);
  };

  var faceImg = document.createElement('img');
  faceImg.id = 'faceImg_' + to_id;
  faceImg.className = 'face';
  faceImg.src = face_url;

  if (name.length > maxNameLen) {
    //名称过长，截取一部分
    name = name.substr(0, maxNameLen) + '...';
  }

  var nameDiv = document.createElement('div');
  nameDiv.id = 'nameDiv_' + to_id;
  nameDiv.className = 'name';nameDiv.innerHTML = name + "<p id='showMsg_".concat(to_id, "'>").concat(lastMsg || '', "</p>");
  var badgeDiv = document.createElement('div');
  badgeDiv.id = 'badgeDiv_' + to_id;
  badgeDiv.className = 'badge'; //三个小点

  var doctDiv = document.createElement('div');
  doctDiv.id = 'doctDiv' + to_id;
  doctDiv.innerHTML = '. . .';
  doctDiv.className = 'spot';

  doctDiv.onclick = function (e) {
      clearTimeout(timerchec)
      timerchec = setTimeout(function () {
        choiceDivOnoff = false;
      }, 100)
      choiceDivOnoff = true;
      const choiceDivAll = document.getElementsByClassName('choiceDiv');
      const arr = [];
      const arr2 = [];
      for (let i = 0 ;i<choiceDivAll.length ;i++){
            if (choiceDivAll[i].id) {
                arr2.push(choiceDivAll[i].id);
                arr.push(choiceDivAll[i]);
            }
      }
      arr.forEach(function(item){
          if (item.id !== ('choiceDiv' + to_id)) {
              item.style.display = 'none';
          }
      });
      if (arr2.length > 0 && arr2.some(function(item) {return item === ('choiceDiv' + to_id)} )) {
          const close = document.getElementById('choiceDiv' + to_id);
          close.style.display = close.style.display === 'none' ? 'block' : 'none';
          return;
      }

      const choiceDiv = document.createElement('div');
      choiceDiv.id = 'choiceDiv' + to_id;
      choiceDiv.className = 'choiceDiv';
      // const roofP = document.createElement('p');
      // roofP.innerHTML = '会话置顶';
      // roofP.onclick = function (e) {
      //     axios.post('https://csapi.zzha.vip/teim/top-msg', {
      //         userToken: window.localStorage.getItem('app_userToken'),
      //         id: to_id
      //     }).then((response) => {
      //         console.log(response, '接口到是返回空');
      //     });
      // };
      // const nodisturbP = document.createElement('p');
      // nodisturbP.innerHTML = '消息免打扰';
      const delchatP = document.createElement('p');
      // choiceDiv.appendChild(roofP);
      // choiceDiv.appendChild(nodisturbP);
      choiceDiv.appendChild(delchatP);
      delchatP.className = 'delChat';
      delchatP.innerHTML = '移除会话';
      // choiceDiv.style.display = 'none';
      sessDiv.appendChild(choiceDiv);
      delchatP.onclick = function (ev) {
          let type_number;
          switch (sess_type) {
          case 'GROUP': type_number = 2; break;
          case 'C2C': type_number = 1; break;
          }
          const selSess = webim.MsgStore.sessMap()[sess_type + to_id];
          if (sess_type == 'C2C') {
              webim.setAutoRead(selSess, true, false);
          } else {
              webim.groupMsgReaded({
                  GroupId: to_id,
                  MsgReadedSeq: recentSessMap['GROUP' + to_id].MsgGroupReadedSeq
              });
          }
          delChat(type_number, to_id);
          ev.preventDefault();
          ev.stopPropagation();
          return false;
      };
      let type_number;
      switch (sess_type) {
      case 'GROUP': type_number = 2; break;
      case 'C2C': type_number = 1; break;
      }
      const selSess = webim.MsgStore.sessMap()[sess_type + to_id];
      if (sess_type == 'C2C') {
          webim.setAutoRead(selSess, true, false);
      } else {
          webim.groupMsgReaded({
              GroupId: to_id,
              MsgReadedSeq: recentSessMap['GROUP' + to_id].MsgGroupReadedSeq
          });
      }
      e.preventDefault();
      // e.stopPropagation();
      return false;
  };
  if (unread_msg_count > 0) {
    //初始化的时候的一键消灭未读消息
    // const recentInfo = document.getElementById('recentInfo');
    // const recentImg = document.getElementById('recentImg');
    // const newImg = document.createElement('img');
    // newImg.id = 'recentImg';
    // recentInfo.removeChild(recentImg);
    // newImg.src = 'img/icon_qingsao.png';
    // newImg.onclick = becomeRead;
    // recentInfo.appendChild(newImg);
    if (unread_msg_count >= 100) {
      unread_msg_count = '99+';
    }

    badgeDiv.innerHTML = '<span>' + unread_msg_count + '</span>';
    badgeDiv.style.display = 'block';
  }

  sessDiv.appendChild(faceImg);
  sessDiv.appendChild(nameDiv);
  sessDiv.appendChild(badgeDiv);
  sessDiv.appendChild(doctDiv);
  if (!addPositonType || addPositonType === 'TAIL') {
    sessList.appendChild(sessDiv); //默认插入尾部
  } else if (addPositonType === 'HEAD') {
    sessList.insertBefore(sessDiv, sessList.children[0]); //插入头部
  } else {
    console.log(webim.Log.error('未知addPositonType' + addPositonType));
  }

  return false;
} //删除会话


function delChat(sess_type, to_id) {
  var data = {
    To_Account: to_id,
    chatType: sess_type
  };
  webim.deleteChat(data, function (resp) {
    // 群组 id中含有特殊字符，直接用$(id)会报错
    var id = 'sessDiv_' + to_id;
    var selectIdStr = "[id='" + id + "']";
    $(selectIdStr).remove(); //清空聊天界面

    selToID = '';
    document.getElementsByClassName('msgflow')[0].innerHTML = '';
  });
} //切换好友或群组聊天对象


function onSelSess(sess_type, to_id, noStyle) {
  if (selToID != null) {
    //将之前选中用户的样式置为未选中样式
    setSelSessStyleOff(1); //将平台消息变为未选中
    setSelSessStyleOff(2); //将订单消息变为未选中
    setSelSessStyleOff(idTime);
    //设置之前会话的已读消息标记
    // webim.setAutoRead(selSess, false, false);
    //保存当前的消息输入框内容到草稿
    //获取消息内容

    document.getElementsByClassName("msgovermain")[0].style.display = 'none';
    document.getElementsByClassName("msgflow")[0].style.display = 'block';
    var msgtosend = document.getElementsByClassName('msgedit')[0].value;
    var msgLen = webim.Tool.getStrBytes(msgtosend);

    if (msgLen > 0) {
      webim.Tool.setCookie('tmpmsg_' + selToID, msgtosend, 3600);
    } //清空聊天界面


    document.getElementsByClassName('msgflow')[0].innerHTML = '';
    selToID = to_id;
    idTime = to_id
    if (!noStyle) {
      //设置当前选中用户的样式为选中样式
      setSelSessStyleOn(to_id);
      document.getElementById('talkWrap').style.display = 'block';
      document.getElementsByClassName("msgflow")[0].style.height = '428px'
    }

    var tmgmsgtosend = webim.Tool.getCookie('tmpmsg_' + selToID);

    if (tmgmsgtosend) {
      $('#send_msg_text').val(tmgmsgtosend);
    } else {
      $('#send_msg_text').val('');
    }

    bindScrollHistoryEvent.reset();
    var sessMap = webim.MsgStore.sessMap(); //获取到之前已经保存的消息

    var sessCS = webim.SESSION_TYPE.GROUP + selToID;
    if (sessMap && sessMap[sessCS]) {
      //判断之前是否保存过消息
      selType = webim.SESSION_TYPE.GROUP;
      getLastGroupHistoryMsgs(function (msgList) {
        getHistoryMsgCallback(msgList);
        bindScrollHistoryEvent.init();
      }, function (err) {
        alert(err.ErrorInfo);
      });
      return; // bindScrollHistoryEvent.init();
      // function compare(property) {
      //     return function(a, b) {
      //         var value1 = a[property];
      //         var value2 = b[property];
      //         return value1 - value2;
      //     }
      // }
      // var sessMapOld = sessMap[sessCS]._impl.msgs.sort(compare('time'));
      // for (var i = 0; i < sessMapOld.length; i++) {
      //     addMsg(sessMapOld[i]); //显示已经保存的消息
      // }
    }

    if (sess_type == webim.SESSION_TYPE.GROUP) {
      if (selType == webim.SESSION_TYPE.C2C) {
        selType = webim.SESSION_TYPE.GROUP;
      }

      selSess = null;
      webim.MsgStore.delSessByTypeId(selType, selToID);
      getLastGroupHistoryMsgs(function (msgList) {
        getHistoryMsgCallback(msgList);
        bindScrollHistoryEvent.init();
      }, function (err) {
        alert(err.ErrorInfo);
      });
    } else {
      if (selType == webim.SESSION_TYPE.GROUP) {
        selType = webim.SESSION_TYPE.C2C;
      } //如果是管理员账号，则为全员推送，没有历史消息


      if (selToID == AdminAcount) {
        var sess = webim.MsgStore.sessByTypeId(selType, selToID);

        if (sess && sess.msgs() && sess.msgs().length > 0) {
          getHistoryMsgCallback(sess.msgs());
        } else {
          getLastC2CHistoryMsgs(function (msgList) {
            getHistoryMsgCallback(msgList);
            bindScrollHistoryEvent.init();
          }, function (err) {
            alert(err.ErrorInfo);
          });
        }

        return;
      } //拉取漫游消息


      getLastC2CHistoryMsgs(function (msgList) {
        getHistoryMsgCallback(msgList); //绑定滚动操作

        bindScrollHistoryEvent.init();
      }, function (err) {
        alert(err.ErrorInfo);
      });
    }
  }
} //删除会话


function deleteSessDiv(sess_type, to_id) {
  var sessDiv = document.getElementById('sessDiv_' + to_id);
  selToID = '';
  sessDiv && sessDiv.parentNode.removeChild(sessDiv);
} //更新最近会话的名字


function updateSessNameDiv(sess_type, to_id, newName) {
  var nameDivId = 'nameDiv_' + to_id;
  var nameDiv = document.getElementById(nameDivId);

  if (nameDiv) {
    if (newName.length > maxNameLen) {
      //帐号或昵称过长，截取一部分
      newName = newName.substr(0, maxNameLen) + '...';
    }

    nameDiv.innerHTML = webim.Tool.formatText2Html(newName);
  }
} //更新最近会话的头像


function updateSessImageDiv(sess_type, to_id, newImageUrl) {
  if (!newImageUrl) {
    return;
  }

  var faceImageId = 'faceImg_' + to_id;
  var faceImage = document.getElementById(faceImageId);

  if (faceImage) {
    faceImage.innerHTML = webim.Tool.formatText2Html(newImageUrl);
  }
}

function setSelSessStyleOn(newSelToID) {
  var selSessDiv = document.getElementById('sessDiv_' + newSelToID);
  if (selSessDiv) {
    selSessDiv.className = 'sessinfo-sel'; //设置当前选中用户的样式为选中样式
  } else {
    webim.Log.warn('不存在selSessDiv: selSessDivId=' + 'sessDiv_' + newSelToID);
  }

  var selBadgeDiv = document.getElementById('badgeDiv_' + newSelToID);

  if (selBadgeDiv) {
    selBadgeDiv.style.display = 'none';
  } else {
    webim.Log.warn('不存在selBadgeDiv: selBadgeDivId=' + 'badgeDiv_' + selToID);
  }
}

function setSelSessStyleOff(preSelToId) {
  var preSessDiv = document.getElementById('sessDiv_' + preSelToId);

  if (preSessDiv) {
    preSessDiv.className = 'sessinfo'; //将之前选中用户的样式置为未选中样式
  } else {
    webim.Log.warn('不存在preSessDiv: selSessDivId=' + 'sessDiv_' + preSelToId);
  }
}
