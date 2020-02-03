

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread() }

function _nonIterableSpread() { throw new TypeError('Invalid attempt to spread non-iterable instance') }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === '[object Arguments]') return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i] } return arr2 } }

//点击平台消息获取消息
function platformMsgCallback(msgList) {
    const msgflow = document.getElementsByClassName('msgovermain')[0]; //清空聊天界面

    msgflow.innerHTML = '';

    if (msgList.length > 0) {
        msgList.forEach(function(item){
            const onemsg = document.createElement('div');
            onemsg.className = 'onemsg';
            const msghead = document.createElement('p');
            const msgbody = document.createElement('p');
            const wrapBody = document.createElement('div');
            wrapBody.className = 'wrapBody';
            msghead.className = 'msghead';
            msghead.innerHTML = '<img style="width:40px;height:40px" src="./img/img_pingtai.png"/><p>\u5E73\u53F0\u6D88\u606F<span>'.concat(item.crtdate, '</span></p>');

            if (item.types === '504') {
                msgbody.innerHTML = '<strong>'.concat(item.title, '<span/></strong>');
                wrapBody.innerHTML = '<div><div style="color:#999999;width:300px;"><p>\u7FA4\u540D\u79F0:<span>'.concat(item.intro_json.group, '</span></p><p>\u5185\u5BB9:<span>').concat(item.intro_json.msg, '</span></p></div></div>');
            } else if (item.types === '506') {
                const _data = JSON.stringify(item);
                msgbody.innerHTML = '<strong>'.concat(item.title, '<span/></strong>');
                wrapBody.innerHTML = '<div><div style="color:#999999;width:300px;"><p>\u5BF9\u65B9\u8D26\u6237:<span>'.concat(item.intro_json.nickname, '</span></p><p>\u7FA4\u6210\u5458:<span>').concat(item.intro_json.invite, '</span>\u9080\u8BF7</p></div><div><span class="platButton" style="top:90px;right:100px" onclick="toDoItGround(').concat(item.id, ')">\u5904\u7406</span><span class="ignore">\u5FFD\u7565</span><div> </div>');
            } else if (item.types === '507') {
                msgbody.innerHTML = '<strong>'.concat(item.title, '<span/></strong>');
                wrapBody.innerHTML = '<div><div style="color:#999999;width:300px;"><p>\u5BF9\u65B9\u6635\u79F0:<span>'.concat(item.intro_json.nickname, '</span></p><p>\u5BF9\u65B9\u9644\u8A00:<span>').concat(item.intro_json.msg, '</span></p></div><div><span class="platButton" style="top:90px;right:100px" onclick="toDoItMyFriend(').concat(item.id, ')">\u5904\u7406</span><span class="ignore">\u5FFD\u7565</span><div> </div>');
            } else if (item.types === '2') {
                msgbody.innerHTML = '<strong>'.concat(item.title, '<span/></strong>');
                wrapBody.innerHTML = '<div><p style="color:#999999;width:300px;">\u60A8\u7684\u5F00\u5E97\u7533\u8BF7\u5DF2\u901A\u8FC7<a style="color:#00AEFF;margin:0" href='.concat(window.location.origin + '/shop-page?status=success', ' target="_blank"></a></p><a class="platButton" href=').concat(window.location.origin + '#/shop-page?status=success', ' target="_blank">\u524D\u5F80</a> </div>');
            } else if (item.types === '110') {
                msgbody.innerHTML = '<strong>'.concat(item.title, '<span/></strong>');
                wrapBody.innerHTML = '<div><div style="color:#999999;width:300px;"><p>\u8BA2\u5355\u72B6\u6001:<span>'.concat(item.intro.msg, '</span></p><p>\u8BA2 \u5355 \u53F7:<span>').concat(item.intro.order_no, '</span></p></div><a class="platButton" href=').concat(window.location.origin + '#/order/online-delivery/delivery-detail?id=' + item.intro.order_id, ' target="_blank">\u67E5\u770B</a> </div>');
            } else {
                msgbody.innerHTML = '<strong>'.concat(item.title, '<span/></strong>');
                wrapBody.innerHTML = "<p style=\"color:#999999\">".concat(item.intro, "</p>");
            }

            msgbody.className = 'orderBody';
            msgbody.appendChild(wrapBody);
            onemsg.appendChild(msghead);
            onemsg.appendChild(msgbody);
            msgflow.appendChild(onemsg);
        });
    }
} //点击打开群消息申请


function toDoItGround(id) {
    $('#hijg_group_id').val(id); // $('#hijg_to_account').val(obj.init);
    // $('#hijg_approval_msg').val(obj.msg);

    $('#handle_invite_join_group_request').modal('show');
} //点击打开好友申请


function toDoItMyFriend(id) {
    $('#rf_to_account').val(id);
    $('#response_friend_dialog').modal('show');
} //获取平台消息历史


function platformMsgHistory() {
    if (pagePlat < playCountPage) {
        $.ajax({
            type: 'POST',
            url: ajaxUrl + '/platform',
            //这里写接口地址，
            data: {
                userToken: window.localStorage.getItem('zpyght_userToken'),
                page: ++pagePlat,
                pagesize: 10,
                page_count: -1
            },
            //调用时的参数
            dataType: 'json',
            //返回json,text,html你自己定
            success: function success(response) {
                //成功
                if (response.status === 0) {
                    // platMsgArr.push(...response.data.platform)
                    function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

                    function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

                    function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

                    function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

                    (_platMsgArr = platMsgArr).push.apply(_platMsgArr, _toConsumableArray(response.data.platform));
                    platformMsgCallback(platMsgArr);
                } else {
                    alert(response);
                }
            }
        });
    }
} //点击我的订单获取消息


function orderMsgCallback(msgList) {
    const msgovermain = document.getElementsByClassName('msgovermain')[0];

    msgovermain.innerHTML = '';

    if (msgList.length > 0) {
        msgList.forEach(function(item){
            const onemsg = document.createElement('div');
            onemsg.className = 'onemsg';
            const msghead = document.createElement('p');
            const msgbody = document.createElement('p');
            const wrapBody = document.createElement('div');
            wrapBody.className = 'wrapBody';
            msghead.className = 'msghead';
            msgbody.innerHTML = '<strong>订单状态变化</strong>';
            msghead.innerHTML = '<img style="width:40px;height:40px" src="./img/img_dingdan.png"/><p>\u8BA2\u5355\u6D88\u606F<span>'.concat(item.crtdate, '</span></p>');
            if(item.if_express === '1'){
              if(item.types === '10003'){
                wrapBody.innerHTML = '<div><div style="color:#999999;width:300px;"><p>\u8BA2\u5355\u72B6\u6001:<span>'.concat(item.last_msg, '</span></p><p>\u8BA2 \u5355 \u53F7:<span>').concat(item.order_no, '</span></p></div><a class="platButton" href=').concat(window.location.origin + '#/order/online-delivery/purchase-detail?id=' + item.order_id, ' target="_blank">\u67E5\u770B</a> </div>');
              }else{
                wrapBody.innerHTML = '<div><div style="color:#999999;width:300px;"><p>\u8BA2\u5355\u72B6\u6001:<span>'.concat(item.last_msg, '</span></p><p>\u8BA2 \u5355 \u53F7:<span>').concat(item.order_no, '</span></p></div><a class="platButton" href=').concat(window.location.origin + '#/order/online-delivery/delivery-detail?id=' + item.order_id, ' target="_blank">\u67E5\u770B</a> </div>');
              }
            }else{
              if(item.types === '10003'){
                  wrapBody.innerHTML = '<div><div style="color:#999999;width:300px;"><p>\u8BA2\u5355\u72B6\u6001:<span>'.concat(item.last_msg, '</span></p><p>\u8BA2 \u5355 \u53F7:<span>').concat(item.order_no, '</span></p></div><a class="platButton" href=').concat(window.location.origin + '#/order/online-delivery/purchase-detail?id=' + item.order_id, ' target="_blank">\u67E5\u770B</a> </div>');
              }else{
                  wrapBody.innerHTML = '<div><div style="color:#999999;width:300px;"><p>\u8BA2\u5355\u72B6\u6001:<span>'.concat(item.last_msg, '</span></p><p>\u8BA2 \u5355 \u53F7:<span>').concat(item.order_no, '</span></p></div><a class="platButton" href=').concat(window.location.origin + '#/order/offline-pickup/pickup-detail?id=' + item.order_id, ' target="_blank">\u67E5\u770B</a> </div>');
              }
            }
            msgbody.className = 'orderBody';
            msgbody.appendChild(wrapBody);
            onemsg.appendChild(msghead);
            onemsg.appendChild(msgbody);
            msgovermain.appendChild(onemsg);
        });
    }
} //获取订单消息历史


function getOrderMsgHistory() {
    if (pageOrder < orderPageCount) {
        $.ajax({
            type: 'POST',
            url: ajaxUrl + '/shop-order-msg',
            //这里写接口地址，
            data: {
                userToken: window.localStorage.getItem('zpyght_userToken'),
                page: ++pageOrder,
                pagesize: 10,
                page_count: -1
            },
            //调用时的参数
            dataType: 'json',
            //返回json,text,html你自己定
            success: function success(response) {
                //成功
                if (response.status === 0) {
                    // console.log(data,'接口利润太高借款利润')
                    // (_orderMsgArr = orderMsgArr).push.apply(_orderMsgArr, _toConsumableArray(data.data.data));
                    // _orderMsgArr.push(...response.data.data)
                    function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

                    function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

                    function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

                    function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

                    (_orderMsgArr2 = _orderMsgArr).push.apply(_orderMsgArr2, _toConsumableArray(response.data.data));
                    orderMsgCallback(_orderMsgArr);
                } else {
                    alert(response);
                }
            }
        });
    }
} //打开搜索消息历史


function selectTalkMsg() {
    if(!selToID)return alert('你还没有选中好友或者群组，暂不能聊天')
    //判断浏览器版本
    if (webim.BROWSER_INFO.type == 'ie' && parseInt(webim.BROWSER_INFO.ver) <= 9) {
        alert('上传文件暂不支持ie9(含)以下浏览器');
    } else {
        $('#upd_file_form')[0].reset();
        const progress = document.getElementById('upd_file_progress'); //上传文件进度条

        progress.value = 0;
        $('#talkMsgModal1').modal('show');
        searchMsgHistory();
    }
} //搜索历史聊天记录


function searchMsgHistoryDetail() {
    if(searchShow)return;
    searchShow = true;
    const page = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    const pageCount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;
    const msgInput = document.getElementById('msgInput'); // if (!msgInput.value) return alert('请输入搜索内容');

    const msgMain = document.getElementById('msgMain'); //父级容器

    const tableMsg = document.getElementById('tableMsg');
    const searchNum = document.getElementById('searchNum');

    if (tableMsg) {
        msgMain.removeChild(tableMsg);
    }

    $.ajax({
        type: 'POST',
        url: ajaxUrl + '/msg-all',
        //这里写接口地址，
        data: {
            userToken: window.localStorage.getItem('zpyght_userToken'),
            seq: selToID,
            key: msgInput.value,
            type: selType === webim.SESSION_TYPE.C2C ? '1' : '2',
            page: page,
            pagesize: 5,
            page_count: pageCount
        },
        //调用时的参数
        dataType: 'json',
        //返回json,text,html你自己定
        success: function success(response) {
            //成功
            if (response.status === 0) {
                if (response.data.length > 0) {
                    const table = document.createElement('table');
                    const nothingMsg = document.getElementById('nothingMsg');
                    if (nothingMsg) msgMain.removeChild(nothingMsg);
                    table.id = 'tableMsg';
                    const tr = document.createElement('tr');
                    tr.className = 'tableTitle';
                    const titleArr = ['名称（账号）', '时间', '内容'];
                    titleArr.forEach(function(item, index){
                        index = document.createElement('th');
                        index.innerHTML = item;
                        tr.appendChild(index);
                    });
                    table.appendChild(tr);
                    response.data.forEach(function(item, index){
                        const td1 = document.createElement('td');
                        const td2 = document.createElement('td');
                        const td3 = document.createElement('td');
                        td1.style.width = '167px';
                        td2.style.width = '167px';
                        td3.className = 'tdOverFlow';
                        td3.setAttribute('title', item.MsgBody);

                        if (msgInput.value) {
                            item.MsgBody = keywordscolorful(item.MsgBody, msgInput.value);
                        }

                        index = document.createElement('tr');
                        index.style.display = 'flex';
                        index.style.lineHeight = '38px';
                        td1.innerHTML = selType === webim.SESSION_TYPE.C2C ? item.To_Account : item.GroupId;
                        td2.innerHTML = item.MsgTime;
                        td3.innerHTML = item.MsgBody;
                        index.appendChild(td1);
                        index.appendChild(td2);
                        index.appendChild(td3);
                        table.appendChild(index);
                    });
                    msgMain.appendChild(table);
                    searchNum.innerHTML = '\u641C\u7D22\u7ED3\u679C\u6761\u6570\uFF1A'.concat(response.count, '\u6761');
                } else {
                    const _nothingMsg = document.createElement('p');

                    _nothingMsg.id = 'nothingMsg';
                    _nothingMsg.innerText = '没有消息内容';
                    _nothingMsg.className = 'nothingMsg';
                    msgMain.appendChild(_nothingMsg);
                }
            } else if (response.status === 100) {
                alert('登录过期，请重新登录');
            } else{
                alert(response);
            }
            searchShow = false;
        }
    });
} //搜索历史聊天记录


function searchMsgHistory() {
    if(searchShow)return;
    searchShow = true;
    const page = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    const pageCount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;
    const nothingMsg = document.getElementById('nothingMsg');
    const msgInput = document.getElementById('msgInput'); // if (!msgInput.value) return alert('请输入搜索内容');

    const msgMain = document.getElementById('msgMain'); //父级容器

    const tableMsg = document.getElementById('tableMsg');
    const searchNum = document.getElementById('searchNum');

    if (tableMsg) {
        msgMain.removeChild(tableMsg);
    }

    if (nothingMsg) {
        msgMain.removeChild(nothingMsg);
    }

    $.ajax({
        type: 'POST',
        url: ajaxUrl + '/msg-all',
        //这里写接口地址，
        data: {
            userToken: window.localStorage.getItem('zpyght_userToken'),
            seq: selToID,
            key: msgInput.value,
            type: selType === webim.SESSION_TYPE.C2C ? '1' : '2',
            page: page,
            pagesize: 5,
            page_count: pageCount
        },
        //调用时的参数
        dataType: 'json',
        //返回json,text,html你自己定
        success: function success(response) {
            //成功
            if (response.status === 0) {
                if (response.data.length > 0) {
                    const table = document.createElement('table');

                    const _nothingMsg2 = document.getElementById('nothingMsg');

                    if (_nothingMsg2) msgMain.removeChild(_nothingMsg2);
                    table.id = 'tableMsg';
                    const tr = document.createElement('tr');
                    tr.className = 'tableTitle';
                    const titleArr = ['名称（账号）', '时间', '内容'];
                    titleArr.forEach(function(item, index){
                        index = document.createElement('th');
                        index.innerHTML = item;
                        tr.appendChild(index);
                    });
                    table.appendChild(tr);
                    response.data.forEach(function(item, index){
                        const td1 = document.createElement('td');
                        const td2 = document.createElement('td');
                        const td3 = document.createElement('td');
                        td1.style.width = '167px';
                        td2.style.width = '167px';
                        td3.className = 'tdOverFlow';
                        td3.setAttribute('title', item.MsgBody);

                        if (msgInput.value) {
                            item.MsgBody = keywordscolorful(item.MsgBody, msgInput.value);
                        }

                        index = document.createElement('tr');
                        index.style.display = 'flex';
                        index.style.lineHeight = '38px';
                        td1.innerHTML = selType === webim.SESSION_TYPE.C2C ? item.To_Account : item.GroupId;
                        td2.innerHTML = item.MsgTime;
                        td3.innerHTML = item.MsgBody;
                        index.appendChild(td1);
                        index.appendChild(td2);
                        index.appendChild(td3);
                        table.appendChild(index);
                    });
                    msgMain.appendChild(table);
                    searchNum.innerHTML = '\u641C\u7D22\u7ED3\u679C\u6761\u6570\uFF1A'.concat(response.count, '\u6761');
                    const slp = new SimplePagination(response.pageCount); // slp.gotoPage(page);

                    slp.init({
                        container: '.pageChange',
                        maxShowBtnCount: 3,
                        // onPageChange: state => { that.searchMsgHistory(state.pageNumber, res.pageCount) }
                        onPageChange: function onPageChange(state) {
                            searchMsgHistoryDetail(state.pageNumber);
                        }
                    });
                } else {
                    const _nothingMsg3 = document.createElement('p');

                    _nothingMsg3.id = 'nothingMsg';
                    _nothingMsg3.innerText = '没有消息内容';
                    _nothingMsg3.className = 'nothingMsg';
                    msgMain.appendChild(_nothingMsg3);
                }
            } else if (response.status === 100) {
                alert('登录过期，请重新登录');
            }else {
                alert(response);
            }
            searchShow = false;
        }
    });
} //关闭聊天记录搜索


function closeMsg() {
    const msgMain = document.getElementById('msgMain'); //父级容器

    const tableMsg = document.getElementById('tableMsg');
    const msgInput = document.getElementById('msgInput');
    const searchNum = document.getElementById('searchNum');
    searchNum.innerHTML = '搜索结果条数：0条';
    msgInput.value = '';
    if (tableMsg) {
        msgMain.removeChild(tableMsg);
    }
    const slp = new SimplePagination(1); // slp.gotoPage(page);

    slp.init({
        container: '.pageChange',
        maxShowBtnCount: 3,
        // onPageChange: state => { that.searchMsgHistory(state.pageNumber, res.pageCount) }
        onPageChange: function onPageChange(state) {}
    });
} //高亮


function keywordscolorful(str, key) {
    const reg = new RegExp('(' + key + ')', 'g');
    const newstr = str.replace(reg, "<font style='color:#00AEFF;'>$1</font>");
    return newstr;
} //点击变已读


// function becomeRead() {
//     const options = {
//         Count: reqRecentSessCount //要拉取的最近会话条数
//     };
//     webim.getRecentContactList(options, (res) => {
//         const arr = [];
//         const nowId = selToID;
//         console.log(selToID, '克鲁赛德见覅看来');
//         const nowType = selType;
//         const recentInfo = document.getElementById('recentInfo');
//         const recentImg = document.getElementById('recentImg');

//         if (res.SessionItem && res.SessionItem.length > 0) {
//             res.SessionItem.forEach((item) => {
//                 if (item.Type === 1) {
//                     arr.push('C2C' + item.To_Account);
//                     onSelSess(webim.SESSION_TYPE.C2C, item.To_Account, true);
//                 } else {
//                     arr.push('GROUP' + item.ToAccount);
//                     getLastGroupHistoryMsgs2(item.ToAccount);
//                 }
//             });
//             recentSessMap.SessionType = nowId;
//             const sessMap = webim.MsgStore.sessMap();
//             // onSelSess(nowType, nowId);
//             setTimeout(() => {
//                 onSelSess(nowType, nowId);
//             }, 200);

//             setTimeout(() => {
//                 const newImg = document.createElement('img');
//                 recentInfo.removeChild(recentImg);
//                 newImg.src = 'img/icon_qingsao1.png';
//                 newImg.id = 'recentImg';
//                 recentInfo.appendChild(newImg);
//                 arr.forEach((item) => {
//                     console.log(sessMap[item], '圣诞节快乐风后即可');
//                     if (sessMap[item]) {
//                         webim.setAutoRead(sessMap[item], true, true);
//                     }
//                 });
//             }, 500);
//         }
//     });
// } //获取最新的群历史消息,用于切换群组聊天时，重新拉取群组的聊天消息


const getLastGroupHistoryMsgs2 = function getLastGroupHistoryMsgs2(id) {
    getGroupInfo(id, function(resp){
    //拉取最新的群历史消息
        const options = {
            GroupId: id,
            ReqMsgSeq: resp.GroupInfo[0].NextMsgSeq - 1,
            ReqMsgNumber: reqMsgCount
        };

        if (options.ReqMsgSeq == null || options.ReqMsgSeq == undefined || options.ReqMsgSeq <= 0) {
            webim.Log.warn('该群还没有历史消息:options=' + JSON.stringify(options));
            return;
        }

        selSess = null;
        webim.MsgStore.delSessByTypeId(selType, id);
        recentSessMap[webim.SESSION_TYPE.GROUP + id] = {};
        recentSessMap[webim.SESSION_TYPE.GROUP + id].MsgGroupReadedSeq = resp.GroupInfo && resp.GroupInfo[0] && resp.GroupInfo[0].NextMsgSeq - 1;
        webim.syncGroupMsgs(options, function(msgList){

            if (msgList.length == 0) {
                webim.Log.warn('该群没有历史消息了:options=' + JSON.stringify(options));
                return;
            }

            const msgSeq = msgList[0].seq - 1;
            getPrePageGroupHistroyMsgInfoMap[id] = {
                ReqMsgSeq: msgSeq
            }; //清空聊天界面

            document.getElementsByClassName('msgflow')[0].innerHTML = '';
        }, function(err){
            alert(err.ErrorInfo);
        });
    });
}; //打开群系统消息


function openGroupNew() {
    //判断浏览器版本
    if (webim.BROWSER_INFO.type == 'ie' && parseInt(webim.BROWSER_INFO.ver) <= 9) {
        alert('上传文件暂不支持ie9(含)以下浏览器');
    } else {
        $('#groupNew').modal('show');
    }
}

function disbandedGroup(id) {
    $.ajax({
        type: 'POST',
        url: ajaxUrl + '/destroy-group',
        data: {
            userToken: window.localStorage.getItem('zpyght_userToken'),
            GroupId: id
        },
        success: function () {
            //在表格中删除对应的行
            $('#get_my_group_table').bootstrapTable('remove', {
                field: 'GroupId',
                values: [id]
            }); //读取我的群组列表
            //getJoinedGroupListHigh(getGroupsCallbackOK);

            deleteSessDiv(webim.SESSION_TYPE.GROUP, id); //在最近的联系人列表删除可能存在的群会话
        }
    });
}
