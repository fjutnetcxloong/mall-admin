
//创建群菜单点击事件
function createGroupMenuClick() {
    //重置表单
    $('#cg_form')[0].reset();
    const sessList = document.getElementsByClassName('sesslist-group')[0];
    let num = 1;

    if (sessList && sessList.childNodes) {
        num = sessList.childNodes.length + 1;
    }

    $('#cg_name').val('群' + num);
    $('#create_group_dialog').modal('show');
} //搜索群(按ID)菜单单击事件


function searchGroupMenuClick() {
    $('#sg_form')[0].reset();
    initSearchGroupTable([]);
    $('#search_group_table').bootstrapTable('load', []);
    $('#search_group_dialog').modal('show');
} //搜索群(按名称)菜单单击事件


function searchGroupByNameMenuClick() {
    $('#sgbn_form')[0].reset();
    initSearchGroupByNameTable([]);
    $('#search_group_by_name_table').bootstrapTable('load', []);
    $('#search_group_by_name_dialog').modal('show');
} //定义搜索群(按ID)结果表格每行的操作按钮


function sgOperateFormatter(value, row, index) {
    return ['<a class="plus" href="javascript:void(0)" title="申请加入">', '<i class="glyphicon glyphicon-plus"></i>', '</a>'].join('');
} //搜索群(按ID)结果表格按钮事件


window.sgOperateEvents = {
    'click .plus': function clickPlus(e, value, row, index) {
        $('#ajg_group_id').val(row.GId);
        $('#ajg_group_type').val(row.Type);
        $('#ajg_group_name').val(row.Name);

        if (row.Type == 'ChatRoom') {
            //聊天室直接申请加入
            applyJoinGroup();
        } else {
            $('#ajg_apply_msg').val('你好，我想加入贵群~');
            $('#apply_join_group_dialog').modal('show');
        }
    }
}; //初始化搜索群(按ID)结果表格

function initSearchGroupTable(data) {
    $('#search_group_table').bootstrapTable({
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
            field: 'GroupId',
            title: 'ID',
            align: 'center',
            valign: 'middle',
            sortable: 'true'
        }, {
            field: 'TypeZh',
            title: '类型',
            align: 'center',
            valign: 'middle',
            sortable: 'true'
        }, {
            field: 'Type',
            title: '类型(英文)',
            align: 'center',
            valign: 'middle',
            sortable: 'true',
            visible: false
        }, {
            field: 'Name',
            title: '名称',
            align: 'center',
            valign: 'middle',
            sortable: 'true'
        }, {
            field: 'Owner_Account',
            title: '群主',
            align: 'center',
            valign: 'middle',
            sortable: 'true'
        }, {
            field: 'CreateTime',
            title: '创建时间',
            align: 'center',
            valign: 'middle',
            sortable: 'true'
        }, {
            field: 'MemberNum',
            title: '群成员数',
            align: 'center',
            valign: 'middle',
            sortable: 'true'
        }, {
            field: 'sgOperate',
            title: '操作',
            align: 'center',
            valign: 'middle',
            formatter: 'sgOperateFormatter',
            events: 'sgOperateEvents'
        }],
        data: data,
        formatNoMatches: function formatNoMatches() {
            return '无符合条件的记录';
        }
    });
} //定义搜索群（按名称）结果表格每行的操作按钮


function sgbnOperateFormatter(value, row, index) {
    return ['<a class="plus" href="javascript:void(0)" title="申请加入">', '<i class="glyphicon glyphicon-plus"></i>', '</a>'].join('');
} //搜索群（按名称）结果表格按钮事件


window.sgbnOperateEvents = {
    'click .plus': function clickPlus(e, value, row, index) {
        $('#ajg_group_id').val(row.GId);
        $('#ajg_group_type').val(row.Type);
        $('#ajg_group_name').val(row.Name);

        if (row.Type == 'ChatRoom') {
            //聊天室直接申请加入
            applyJoinGroup();
        } else {
            $('#ajg_apply_msg').val('你好，我想加入贵群~');
            $('#apply_join_group_dialog').modal('show');
        }
    }
}; //初始化搜索群（按名称）结果表格

function initSearchGroupByNameTable(data) {
    $('#search_group_by_name_table').bootstrapTable({
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
            field: 'GroupId',
            title: 'ID',
            align: 'center',
            valign: 'middle',
            sortable: 'true'
        }, {
            field: 'TypeZh',
            title: '类型',
            align: 'center',
            valign: 'middle',
            sortable: 'true'
        }, {
            field: 'Type',
            title: '类型(英文)',
            align: 'center',
            valign: 'middle',
            sortable: 'true',
            visible: false
        }, {
            field: 'Name',
            title: '名称',
            align: 'center',
            valign: 'middle',
            sortable: 'true'
        }, {
            field: 'FaceUrl',
            title: '群头像',
            align: 'center',
            valign: 'middle',
            sortable: 'true',
            visible: false
        }, {
            field: 'Owner_Account',
            title: '群主',
            align: 'center',
            valign: 'middle',
            sortable: 'true'
        }, {
            field: 'CreateTime',
            title: '创建时间',
            align: 'center',
            valign: 'middle',
            sortable: 'true'
        }, {
            field: 'MemberNum',
            title: '群成员数',
            align: 'center',
            valign: 'middle',
            sortable: 'true'
        }, {
            field: 'sgbnOperate',
            title: '操作',
            align: 'center',
            valign: 'middle',
            formatter: 'sgbnOperateFormatter',
            events: 'sgbnOperateEvents'
        }],
        data: data,
        formatNoMatches: function formatNoMatches() {
            return '无符合条件的记录';
        }
    });
} //定义我的群组表格每行的操作按钮


function gmgOperateFormatter(value, row, index) {
    // return ['<a class="plus ml10" href="javascript:void(0)" title="邀请成员">', '<i class="glyphicon glyphicon-plus"></i>', '</a>', '<a class="user ml10" href="javascript:void(0)" title="查看群成员">', '<i class="glyphicon glyphicon-user"></i>', '</a>', '<a class="bell ml10" href="javascript:void(0)" title="设置群消息提示">', '<i class="glyphicon glyphicon-bell"></i>', '</a>', '<a class="logout ml10" href="javascript:void(0)" title="退出该群">', '<i class="glyphicon glyphicon-log-out"></i>', '</a>', '<a class="pencil ml10" href="javascript:void(0)" title="修改群资料">', '<i class="glyphicon glyphicon-pencil"></i>', '</a>', '<a class="share ml10" href="javascript:void(0)" title="转让该群">', '<i class="glyphicon glyphicon-share"></i>', '</a>', '<a class="trash ml10" href="javascript:void(0)" title="解散该群">', '<i class="glyphicon glyphicon-trash"></i>', '</a>', '<a class="envelope ml10" href="javascript:void(0)" title="发消息">', '<i class="glyphicon glyphicon-envelope"></i>', '</a>'].join('');
    return ['<a class="plus ml10" href="javascript:void(0)" title="邀请成员">', '<i class="glyphicon glyphicon-plus"></i>', '</a>', '<a class="user ml10" href="javascript:void(0)" title="查看群成员">', '<i class="glyphicon glyphicon-user"></i>', '</a>', '</a>', '<a class="logout ml10" href="javascript:void(0)" title="退出该群">', '<i class="glyphicon glyphicon-log-out"></i>', '</a>', '<a class="pencil ml10" href="javascript:void(0)" title="修改群资料">', '<i class="glyphicon glyphicon-pencil"></i>', '</a>', '</a>', '<a class="trash ml10" href="javascript:void(0)" title="解散该群">', '<i class="glyphicon glyphicon-trash"></i>', '</a>', '<a class="envelope ml10" href="javascript:void(0)" title="发消息">', '<i class="glyphicon glyphicon-envelope"></i>', '</a>'].join('');
} //我的群组表格每行的操作按钮点击事件


window.gmgOperateEvents = {
    'click .plus': function clickPlus(e, value, row, index) {
    // if (row.TypeEn != 'Private') {
    //    alert('公开群或聊天室不支持直接拉人操作');
    //     return;
    // }
        $('#gmfg_group_id').val(row.GId);
        getMyFriendGroup();
    },
    'click .user': function clickUser(e, value, row, index) {
        $('#ggm_group_id').val(row.GId);
        $('#ggm_my_role').val(row.Role);
        $('#ggm_group_type').val(row.TypeEn);
        getGroupMemberInfo(row.GId);
    },
    'click .bell': function clickBell(e, value, row, index) {
        $('#mgmf_sel_row_index').val(index);
        $('#mgmf_group_id').val(row.GId); //设置群消息提示类型
        //var msg_flag = webim.Tool.groupRoleCh2En(row.Role);

        const msg_flag = row.MsgFlagEn; //$("input[type=radio][name='mgmf_msg_flag_radio'][value=" + msg_flag + "]").attr("checked", 'checked');//此方法存在问题，当修改单选按钮值，并且关闭对话框，再打开对话时，无法选中真正的值

        const mgmf_msg_flag_radio = document.mgmf_form.mgmf_msg_flag_radio;

        for (let i = 0; i < mgmf_msg_flag_radio.length; i++) {
            if (mgmf_msg_flag_radio[i].value == msg_flag) {
                mgmf_msg_flag_radio[i].checked = true;
                break;
            }
        }

        $('#modify_group_msg_flag_dialog').modal('show');
    },
    'click .logout': function clickLogout(e, value, row, index) {
        if (row.Role == '群主' && row.TypeEn === 'Private') {
            alert('您是群主，不能从群聊中退出');
            return;
        }

        if (confirm('确定退出该群吗？')) {
            quitGroup(row.GId);
        }
    },
    'click .pencil': function clickPencil(e, value, row, index) {
    //成员可以修改私有群的基本资料
        if (row.Role == '成员' && row.Type != 'Private') {
            alert('你不是群主或管理员，无法进行此操作');
            return;
        }
        newGroud = '';//图片储存清空
        mg_faceurl.value = '';//图片样式清空
        $('#mg_sel_row_index').val(index);
        $('#mg_group_id').val(row.GId);
        // $('#mg_faceurl').val(row.FaceUrl);
        $('#mg_name').val(webim.Tool.formatHtml2Text(row.Name));
        $('#mg_introduction').val(webim.Tool.formatHtml2Text(row.Introduction));
        $('#mg_notification').val(webim.Tool.formatHtml2Text(row.Notification));
        $('#modify_group_dialog').modal('show');
        const shut_up_all = document.mg_form.mgm_up_all_radio;

        for (let i = 0; i < shut_up_all.length; i++) {
            if (shut_up_all[i].value == row.ShutUpAllMember) {
                shut_up_all[i].checked = true;
                break;
            }
        } //  $('#shut_up_all_member').val(row.ShutUpAllMember);
    },
    'click .share': function clickShare(e, value, row, index) {
        if (row.Role != '群主') {
            alert('你不是群主，无法进行此操作');
        } else {
            if (row.TypeEn == 'AVChatRoom') {
                alert('直播聊天室不能进行转让');
                return;
            }

            $('#cgo_form')[0].reset(); //清空原来表单的值

            $('#cgo_sel_row_index').val(index);
            $('#cgo_group_id').val(row.GId);
            $('#change_group_owner_dialog').modal('show');
        }
    },
    'click .trash': function clickTrash(e, value, row, index) {
        if (row.Role != '群主') {
            alert('你不是群主，无法进行此操作');
        } else {
            let truthBeTold = confirm('确认解散该群吗？');
            if (truthBeTold) {
                disbandedGroup(row.GId);
            }
            // if (row.TypeEn == 'Private') {
            //     alert('您是群主，不能解散私有群');
            //     return;
            // }
            //
            // if (confirm('确定解散该群组吗？')) {
            //     destroyGroup(row.GId);
            // }
        }
    },
    'click .envelope': function clickEnvelope(e, value, row, index) {
        $('#sgm_to_groupid').val(row.GId);
        $('#sgm_to_group_name').val(row.Name);
        $('#send_group_msg_dialog').modal('show');
    }
}; //初始化我的群组表格

function initGetMyGroupTable(data) {
    $('#get_my_group_table').bootstrapTable({
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
            field: 'GroupId',
            title: 'ID',
            align: 'center',
            valign: 'middle',
            sortable: 'true'
        }, {
            field: 'Type',
            title: '类型',
            align: 'center',
            valign: 'middle',
            sortable: 'true'
        }, {
            field: 'TypeEn',
            title: '类型(英文)',
            align: 'center',
            valign: 'middle',
            sortable: 'true',
            visible: false
        }, {
            field: 'FaceUrl',
            title: '群头像',
            align: 'center',
            valign: 'middle',
            sortable: 'true',
            visible: false
        }, {
            field: 'Name',
            title: '名称',
            align: 'center',
            valign: 'middle',
            sortable: 'true'
        }, {
            field: 'RoleEn',
            title: '角色(英文)',
            align: 'center',
            valign: 'middle',
            sortable: 'true',
            visible: false
        }, {
            field: 'Role',
            title: '角色',
            align: 'center',
            valign: 'middle',
            sortable: 'true'
        }, {
            field: 'MsgFlagEn',
            title: '消息提示类型(英文)',
            align: 'center',
            valign: 'middle',
            sortable: 'true',
            visible: false
        }, {
            field: 'MsgFlag',
            title: '消息提示类型',
            align: 'center',
            valign: 'middle',
            sortable: 'true'
        }, {
            field: 'JoinTime',
            title: '加入时间',
            align: 'center',
            valign: 'middle',
            sortable: 'true'
        }, {
            field: 'MemberNum',
            title: '成员数',
            align: 'center',
            valign: 'middle',
            sortable: 'true'
        }, {
            field: 'Notification',
            title: '公告',
            align: 'center',
            valign: 'middle',
            sortable: 'true',
            visible: false
        }, {
            field: 'Introduction',
            title: '简介',
            align: 'center',
            valign: 'middle',
            sortable: 'true',
            visible: false
        }, {
            field: 'ShutUpAllMember',
            title: '全局禁言',
            align: 'center',
            valign: 'middle',
            sortable: 'true'
        }, {
            field: 'gmgOperate',
            title: '操作',
            align: 'center',
            valign: 'middle',
            formatter: 'gmgOperateFormatter',
            events: 'gmgOperateEvents'
        }],
        data: data,
        formatNoMatches: function formatNoMatches() {
            return '无符合条件的记录';
        }
    });
} //定义邀请好友加群表格每行的操作按钮


function gmfgOperateFormatter(value, row, index) {
    return ['<a class="plus" href="javascript:void(0)" title="邀请加入">', '<i class="glyphicon glyphicon-plus"></i>', '</a>'].join('');
} //邀请好友加群表格每行按钮单击事件


window.gmfgOperateEvents = {
    'click .plus': function clickPlus(e, value, row, index) {
        $('#agm_group_id').val($('#gmfg_group_id').val());
        $('#agm_account').val(row.Info_Account);
        $('#add_group_member_dialog').modal('show');
    }
}; //初始化邀请好友加群表格

function initGetMyFriendGroupTable(data) {
    $('#get_my_friend_group_table').bootstrapTable({
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
            field: 'Info_Account',
            title: '账号',
            align: 'center',
            valign: 'middle',
            sortable: 'true'
        }, {
            field: 'Nick',
            title: '昵称',
            align: 'center',
            valign: 'middle',
            sortable: 'true'
        }, {
            field: 'gmfgOperate',
            title: '操作',
            align: 'center',
            valign: 'middle',
            formatter: 'gmfgOperateFormatter',
            events: 'gmfgOperateEvents'
        }],
        data: data,
        formatNoMatches: function formatNoMatches() {
            return '无符合条件的记录';
        }
    });
} //读取群组公开资料-高级接口（可用于搜索群，按ID）


const getGroupPublicInfo = function getGroupPublicInfo() {
    if ($('#sg_group_id').val().length == 0) {
        alert('请输入群组ID');
        return;
    }

    if (webim.Tool.trimStr($('#sg_group_id').val()).length == 0) {
        alert('您输入的群组ID全是空格,请重新输入');
        return;
    }

    const options = {
        GroupIdList: [$('#sg_group_id').val()],
        GroupBasePublicInfoFilter: ['Type', 'Name', 'Introduction', 'Notification', 'FaceUrl', 'CreateTime', 'Owner_Account', 'LastInfoTime', 'LastMsgTime', 'NextMsgSeq', 'MemberNum', 'MaxMemberNum', 'ApplyJoinOption']
    };
    webim.getGroupPublicInfo(options, function(resp){
        let data = [];

        if (resp.GroupInfo && resp.GroupInfo.length > 0) {
            for (let i in resp.GroupInfo) {
                if (resp.GroupInfo[i].ErrorCode > 0) {
                    alert(resp.GroupInfo[i].ErrorInfo);
                    return;
                }

                let group_id = resp.GroupInfo[i].GroupId;
                let name = webim.Tool.formatText2Html(resp.GroupInfo[i].Name);
                let type_zh = webim.Tool.groupTypeEn2Ch(resp.GroupInfo[i].Type);
                let type = resp.GroupInfo[i].Type;
                let owner_account = resp.GroupInfo[i].Owner_Account;
                let create_time = webim.Tool.formatTimeStamp(resp.GroupInfo[i].CreateTime);
                let member_num = resp.GroupInfo[i].MemberNum;
                let notification = webim.Tool.formatText2Html(resp.GroupInfo[i].Notification);
                let introduction = webim.Tool.formatText2Html(resp.GroupInfo[i].Introduction);
                data.push({
                    GId: group_id,
                    GroupId: webim.Tool.formatText2Html(group_id),
                    Name: name,
                    TypeZh: type_zh,
                    Type: type,
                    Owner_Account: owner_account,
                    MemberNum: member_num,
                    Notification: notification,
                    Introduction: introduction,
                    CreateTime: create_time
                });
            }
        }

        $('#search_group_table').bootstrapTable('load', data);
    }, (function (err) {
        alert(err.ErrorInfo);
      }));
}; //搜索群（按名称）


const searchGroupByName = function searchGroupByName() {
    if ($('#sgbn_group_name').val().length == 0) {
        alert('请输入群名称');
        return;
    }

    if (webim.Tool.trimStr($('#sgbn_group_name').val()).length == 0) {
        alert('您输入的群名称都是空格,请重新输入');
        return;
    }

    const options = {
        Content: $('#sgbn_group_name').val(),
        //群名称
        PageNum: 0,
        //0表示从第1页开始拉取
        GroupPerPage: 20,
        //每页拉取20条
        ResponseFilter: {
            GroupBasePublicInfoFilter: [//基础信息过滤器，可以通过它设置需要拉取的公开的基础信息
                'Type', //群组类型
                'Name', //群名称
                'FaceUrl', //群头像
                'Introduction', //群简介
                'CreateTime', //群创建时间
                'Owner_Account', //群创建者
                'MemberNum', //成员个数
                'MaxMemberNum', //群成员最大个数
                'ApplyJoinOption' //申请加群选项
            ]
        }
    };
    webim.searchGroupByName(options, function(resp){
        let data = [];

        if (resp.GroupInfo && resp.GroupInfo.length > 0) {
            for (let i in resp.GroupInfo) {
                if (resp.GroupInfo[i].ErrorCode > 0) {
                    alert(resp.GroupInfo[i].ErrorInfo);
                    return;
                }

                let group_id = resp.GroupInfo[i].GroupId;
                let name = webim.Tool.formatText2Html(resp.GroupInfo[i].Name);
                let type_zh = webim.Tool.groupTypeEn2Ch(resp.GroupInfo[i].Type);
                let type = resp.GroupInfo[i].Type;
                let owner_account = resp.GroupInfo[i].Owner_Account;
                let create_time = webim.Tool.formatTimeStamp(resp.GroupInfo[i].CreateTime);
                let member_num = resp.GroupInfo[i].MemberNum;
                let faceUrl = resp.GroupInfo[i].FaceUrl;
                let introduction = webim.Tool.formatText2Html(resp.GroupInfo[i].Introduction); //var maxMemberNum = resp.GroupInfo[i].MaxMemberNum;
                //var applyJoinOption = resp.GroupInfo[i].ApplyJoinOption;

                data.push({
                    GId: group_id,
                    GroupId: webim.Tool.formatText2Html(group_id),
                    Name: name,
                    TypeZh: type_zh,
                    Type: type,
                    Owner_Account: owner_account,
                    MemberNum: member_num,
                    FaceUrl: faceUrl,
                    Introduction: introduction,
                    CreateTime: create_time
                });
            }
        }

        $('#search_group_by_name_table').bootstrapTable('load', data);
    }, (function (err) {
        alert(err.ErrorInfo);
      }));
}; //创建群组


const createGroup = function createGroup() {
    const sel_friends = $('#select_friends').val();
    const member_list = [];
    const members = sel_friends.split(';'); //字符分割

    for (let i = 0; i < members.length; i++) {
        if (members[i] && members[i].length > 0) {
            member_list.push(members[i]);
        }
    }
    const faceurl = $('#cg_faceurl').val();
    // var cg_id = $('#cg_id').val().trim();
    // var cg_id = $('#cg_id').val().trim();

    // if (cg_id && !/^[A-Za-z0-9_]+$/gi.test(cg_id)) {
    //   alert('群组ID只能是数字、字母或下划线');
    //   return;
    // }

    if ($('#cg_name').val().length == 0) {
        alert('请输入群组名称');
        return;
    }

    if (webim.Tool.trimStr($('#cg_name').val()).length == 0) {
        alert('您输入的群组名称全是空格,请重新输入');
        return;
    }

    if (webim.Tool.getStrBytes($('#cg_name').val()) > 30) {
        alert('您输入的群组名称超出限制(最长10个汉字)');
        return;
    }

    if (webim.Tool.getStrBytes($('#cg_notification').val()) > 150) {
        alert('您输入的群组公告超出限制(最长50个汉字)');
        return;
    }

    if (webim.Tool.getStrBytes($('#cg_introduction').val()) > 120) {
        alert('您输入的群组简介超出限制(最长40个汉字)');
        return;
    } // const groupType = $('input[name="cg_type_radio"]:checked').val();


    const groupType = 'Private'; //默认使用私有群

    const options = {
        GroupId: '',
        Owner_Account: loginInfo.identifier,
        Type: groupType,
        //Private/Public/ChatRoom/AVChatRoom
        Name: $('#cg_name').val(),
        Notification: $('#cg_notification').val(),
        Introduction: $('#cg_introduction').val(),
        MemberList: member_list,
        FaceUrl: newGroud
    }; // if (faceurl) {
    //     options.FaceUrl = faceurl;
    // }


    if (groupType != 'Private') {
    //非私有群才支持ApplyJoinOption属性
        options.ApplyJoinOption = $('input[name="cg_ajp_type_radio"]:checked').val();
    }

    $.ajax({
        type: 'POST',
        url: ajaxUrl + '/setup-group',
        data: {
            userToken: window.localStorage.getItem('zpyght_userToken')
        },
        success: function (response) {
            options.GroupId = response.data.GroupId.toString();
            webim.createGroup(options, function(resp){
                newGroud = '';
                $('#create_group_dialog').modal('hide');
                groudTalk(options.GroupId,options.Name,1);
                alert('创建群成功'); //读取我的群组列表
                window.location.reload();
                //getJoinedGroupListHigh(getGroupsCallbackOK);
            }, (function (err) {
              alert(err.ErrorInfo);
            }));
        }
    });
}; //修改群资料


const modifyGroup = function modifyGroup() {
    const faceurl = newGroud;

    if ($('#mg_name').val().length == 0) {
        alert('请输入群组名称');
        return;
    }

    if (webim.Tool.trimStr($('#mg_name').val()).length == 0) {
        alert('您输入的群组名称全是空格,请重新输入');
        return;
    }

    if (webim.Tool.getStrBytes($('#fsm_name').val()) > 30) {
        alert('您输入的群组名称超出限制(最长10个汉字)');
        return;
    }

    if (webim.Tool.getStrBytes($('#fsm_notification').val()) > 150) {
        alert('您输入的群组公告超出限制(最长50个汉字)');
        return;
    }

    if (webim.Tool.getStrBytes($('#fsm_introduction').val()) > 120) {
        alert('您输入的群组简介超出限制(最长40个汉字)');
        return;
    }

    const up_all = $('input[name="mgm_up_all_radio"]:checked').val();
    const options = {
        GroupId: $('#mg_group_id').val(),
        Name: $('#mg_name').val(),
        Notification: $('#mg_notification').val(),
        Introduction: $('#mg_introduction').val(),
        ShutUpAllMember: up_all
    };

    if (faceurl) {
        options.FaceUrl = faceurl;
    }
    webim.modifyGroupBaseInfo(options, function(resp){
    //在表格中修改对应的行
        $('#get_my_group_table').bootstrapTable('updateRow', {
            index: $('#mg_sel_row_index').val(),
            row: {
                Type: $('input[name="mg_type_radio"]:checked').val(),
                Name: webim.Tool.formatText2Html($('#mg_name').val()),
                Introduction: webim.Tool.formatText2Html($('#mg_introduction').val()),
                Notification: webim.Tool.formatText2Html($('#mg_notification').val())
            }
        });
        $('#modify_group_dialog').modal('hide');
        alert('修改群资料成功');
    },(function (err) {
      console.log(err,'修改群基本资料')
      alert(err.ErrorInfo);
    }));
}; //转让群组


const changeGroupOwner = function changeGroupOwner() {
    const newOwer = $('#cgo_new_owner').val();

    if (newOwer.length == 0) {
        alert('请输入新的群主账号');
        return;
    }

    if (webim.Tool.trimStr(newOwer).length == 0) {
        alert('您输入的新群主账号全是空格,请重新输入');
        return;
    }

    if (newOwer == loginInfo.identifier) {
        alert('不能给自己转让群组');
        return;
    }

    const options = {
        GroupId: $('#cgo_group_id').val(),
        NewOwner_Account: newOwer
    };
    webim.changeGroupOwner(options, function(resp){
    //在表格中修改对应的行
        $('#get_my_group_table').bootstrapTable('updateRow', {
            index: $('#cgo_sel_row_index').val(),
            row: {
                RoleEn: 'Member',
                Role: '成员'
            }
        });
        $('#change_group_owner_dialog').modal('hide');
        alert('转让群组成功');
    }, (function (err) {
      alert(err.ErrorInfo);
    }));
}; //申请加群


var applyJoinGroup = function applyJoinGroup() {
    if (webim.Tool.getStrBytes($('#ajg_apply_msg').val()) > 300) {
        alert('您输入的附言超出限制(最长100个汉字)');
        return;
    }

    const options = {
        GroupId: $('#ajg_group_id').val(),
        ApplyMsg: $('#ajg_apply_msg').val(),
        UserDefinedField: ''
    };
    webim.applyJoinGroup(options, function(resp){
        $('#apply_join_group_dialog').modal('hide');
        let joinedStatus = resp.JoinedStatus; //JoinedSuccess--成功加入，WaitAdminApproval--等待管理员审核

        if (joinedStatus == 'JoinedSuccess') {
            //刷新我的群组列表
            //getJoinedGroupListHigh(getGroupsCallbackOK);
            alert('成功加入该群');
        } else {
            alert('申请成功，请等待群主审核');
        }
    }, (function (err) {
      alert(err.ErrorInfo);
    }));
}; //获取我的群组


const getMyGroup = function getMyGroup() {
    initGetMyGroupTable([]);
    const options = {
        Member_Account: loginInfo.identifier,
        Limit: totalCount,
        Offset: 0,
        //'GroupType':'',
        GroupBaseInfoFilter: ['Type', 'Name', 'Introduction', 'Notification', 'FaceUrl', 'CreateTime', 'Owner_Account', 'LastInfoTime', 'LastMsgTime', 'NextMsgSeq', 'MemberNum', 'MaxMemberNum', 'ApplyJoinOption', 'ShutUpAllMember'],
        SelfInfoFilter: ['Role', 'JoinTime', 'MsgFlag', 'UnreadMsgNum']
    };
    webim.getJoinedGroupListHigh(options, function(resp){
        if (!resp.GroupIdList || resp.GroupIdList.length == 0) {
            alert('你目前还没有加入任何群组');
            return;
        }

        let data = [];

        for (let i = 0; i < resp.GroupIdList.length; i++) {
            let group_id = resp.GroupIdList[i].GroupId;
            let name = webim.Tool.formatText2Html(resp.GroupIdList[i].Name);
            let faceUrl = resp.GroupIdList[i].FaceUrl;
            let type_en = resp.GroupIdList[i].Type;
            let type = webim.Tool.groupTypeEn2Ch(resp.GroupIdList[i].Type);
            let role_en = resp.GroupIdList[i].SelfInfo.Role;
            let role = webim.Tool.groupRoleEn2Ch(resp.GroupIdList[i].SelfInfo.Role);
            let msg_flag = webim.Tool.groupMsgFlagEn2Ch(resp.GroupIdList[i].SelfInfo.MsgFlag);
            let msg_flag_en = resp.GroupIdList[i].SelfInfo.MsgFlag;
            let join_time = webim.Tool.formatTimeStamp(resp.GroupIdList[i].SelfInfo.JoinTime);
            let member_num = resp.GroupIdList[i].MemberNum;
            let notification = webim.Tool.formatText2Html(resp.GroupIdList[i].Notification);
            let introduction = webim.Tool.formatText2Html(resp.GroupIdList[i].Introduction);
            let ShutUpAllMember = resp.GroupIdList[i].ShutUpAllMember; //== 'On' ? resp.GroupIdList[i].ShutUpAllMember = '开启' : resp.GroupIdList[i].ShutUpAllMember = '关闭';

            data.push({
                GId: group_id,
                GroupId: webim.Tool.formatText2Html(group_id),
                Name: name,
                FaceUrl: faceUrl,
                TypeEn: type_en,
                Type: type,
                RoleEn: role_en,
                Role: role,
                MsgFlagEn: msg_flag_en,
                MsgFlag: msg_flag,
                MemberNum: member_num,
                Notification: notification,
                Introduction: introduction,
                JoinTime: join_time,
                ShutUpAllMember: ShutUpAllMember
            });
        } //打开我的群组列表对话框


        $('#get_my_group_table').bootstrapTable('load', data);
        $('#get_my_group_dialog').modal('show');
    }, (function (err) {
      alert(err.ErrorInfo);
    }));
}; //退群


var quitGroup = function quitGroup(group_id) {
    let options = null;

    if (group_id) {
        options = {
            GroupId: group_id
        };
    }

    if (options == null) {
        alert('退群时，群组ID非法');
        return;
    }

    webim.quitGroup(options, function(resp){
    //在表格中删除对应的行
        $('#get_my_group_table').bootstrapTable('remove', {
            field: 'GroupId',
            values: [group_id]
        }); //刷新我的群组列表
        //getJoinedGroupListHigh(getGroupsCallbackOK);

        deleteSessDiv(webim.SESSION_TYPE.GROUP, group_id); //在最近的联系人列表删除可能存在的群会话
    },(function (err) {
      if(err.ErrorCode === 10009){
        alert('该群不允许群主主动退出')
      }
      // alert(err.ErrorInfo);
    }));
}; //读取群组基本资料-高级接口


const getGroupInfo = function getGroupInfo(group_id, cbOK, cbErr) {
    const options = {
        GroupIdList: [group_id],
        GroupBaseInfoFilter: ['Type', 'Name', 'Introduction', 'Notification', 'FaceUrl', 'CreateTime', 'Owner_Account', 'LastInfoTime', 'LastMsgTime', 'NextMsgSeq', 'MemberNum', 'MaxMemberNum', 'ApplyJoinOption', 'ShutUpAllMember'],
        MemberInfoFilter: ['Account', 'Role', 'JoinTime', 'LastSendMsgTime', 'ShutUpUntil']
    };
    webim.getGroupInfo(options, function(resp){
        if (resp.GroupInfo[0].ShutUpAllMember == 'On') {
            alert('该群组已开启全局禁言');
        }

        if (cbOK) {
            cbOK(resp);
        }
    },(function (err) {
      alert(err.ErrorInfo);
    }));
}; //解散群组


let destroyGroup = function destroyGroup(group_id) {
    let options = null;

    if (group_id) {
        options = {
            GroupId: group_id
        };
    }

    if (options == null) {
        alert('解散群时，群组ID非法');
        return;
    }

    webim.destroyGroup(options, function(resp){
    //在表格中删除对应的行
        $('#get_my_group_table').bootstrapTable('remove', {
            field: 'GroupId',
            values: [group_id]
        }); //读取我的群组列表
        //getJoinedGroupListHigh(getGroupsCallbackOK);

        deleteSessDiv(webim.SESSION_TYPE.GROUP, group_id); //在最近的联系人列表删除可能存在的群会话
    }, (function (err) {
      alert(err.ErrorInfo);
    }));
}; //获取我的好友，然后邀请加群


var getMyFriendGroup = function getMyFriendGroup() {
    initGetMyFriendGroupTable([]);
    const options = {
        From_Account: loginInfo.identifier,
        TimeStamp: 0,
        StartIndex: 0,
        GetCount: totalCount,
        LastStandardSequence: 0,
        TagList: ['Tag_Profile_IM_Nick', 'Tag_SNS_IM_Remark']
    };
    webim.getAllFriend(options, function(resp){
        if (resp.FriendNum > 0) {
            let table_friends_data = [];
            let friends = resp.InfoItem;
            if (!friends || friends.length == 0) {
                alert('你目前还没有好友，无法邀请好友加入该群');
                return;
            }

            let options = {
                GroupId: $('#gmfg_group_id').val(),
                Offset: 0,
                //必须从0开始
                Limit: totalCount,
                MemberInfoFilter: ['Account', 'Role', 'JoinTime', 'LastSendMsgTime', 'ShutUpUntil']
            };
            webim.getGroupMemberInfo(options, function(resp){
          var groudNum = resp.MemberList;
          var groundArr = [];
          if(groudNum.length>0){
            for(var i =0;i<groudNum.length;i++){
              if(groudNum[i]){
                groundArr.push(groudNum[i].Member_Account)
              }
            }
            var count = friends.length;
            for(var j = 0;j<count;j++){
                for(var b = 0;b <groundArr.length;b++){
                  if(friends[j]){
                    if(friends[j].Info_Account ===groundArr[b] ){
                      friends.splice(j, 1)
                    }
                  }
                }
            }
          }
          for (var i = 0; i < count; i++) {
            if(friends[i]){
              var friend_name = friends[i].Info_Account;

              if (friends[i].SnsProfileItem && friends[i].SnsProfileItem[0] && friends[i].SnsProfileItem[0].Tag) {
                friend_name = friends[i].SnsProfileItem[0].Value;
              }

              table_friends_data.push({
                Info_Account: webim.Tool.formatText2Html(friends[i].Info_Account),
                Nick: webim.Tool.formatText2Html(friend_name)
              });
            }
          } //打开我的好友列表对话框
          $('#get_my_friend_group_table').bootstrapTable('load', table_friends_data);
          $('#get_my_friend_group_dialog').modal('show');
        });
        } else {
            alert('你目前还没有好友，无法邀请好友加入该群');
        }
    }, (function (err) {
      alert(err.ErrorInfo);
    }));
}; //选择我的好友


const selectMyFriendGroup = function selectMyFriendGroup() {
    initSelectMyFriendGroupTable([]);
    const options = {
        From_Account: loginInfo.identifier,
        TimeStamp: 0,
        StartIndex: 0,
        GetCount: totalCount,
        LastStandardSequence: 0,
        TagList: ['Tag_Profile_IM_Nick', 'Tag_SNS_IM_Remark']
    };
    webim.getAllFriend(options, function(resp){
        if (resp.FriendNum > 0) {
            let table_friends_data = [];
            let friends = resp.InfoItem;

            if (!friends || friends.length == 0) {
                alert('你目前还没有好友，无法建群');
                return;
            }

            let count = friends.length;

            for (let i = 0; i < count; i++) {
                let friend_name = friends[i].Info_Account;

                if (friends[i].SnsProfileItem && friends[i].SnsProfileItem[0] && friends[i].SnsProfileItem[0].Tag) {
                    friend_name = friends[i].SnsProfileItem[0].Value;
                }

                table_friends_data.push({
                    Info_Account: webim.Tool.formatText2Html(friends[i].Info_Account),
                    Nick: webim.Tool.formatText2Html(friend_name)
                });
            } //打开选择我的好友列表对话框


            $('#select_my_friend_group_table').bootstrapTable('load', table_friends_data);
            $('#select_my_friend_group_dialog').modal('show');
        } else {
            alert('你目前还没有好友，无法建群');
        }
    },(function (err) {
      alert(err.ErrorInfo);
    }));
}; //定义（创建群之前）选择好友表格每行按钮


function smfgOperateFormatter(value, row, index) {
    if ($('#select_friends').val()) {
        var onOffSelect = false;
        let arr = $('#select_friends').val().split(';');
        let arr2 = arr.slice(1, arr.length - 1);
        for (let i = 0; i < arr2.length; i++) {
            if (arr2[i] == row.Info_Account) {
                onOffSelect = true;
            }
        }
    }
    return [
        "<a class=\"plus\" style=".concat(onOffSelect ? 'display:none' : 'display:block', " id=\"").concat(row.Info_Account, "add\" href=\"javascript:void(0)\" title=\"\u9009\u4E2D\">"),
        '<i class="glyphicon glyphicon-plus"></i>',
        '</a>',
        "<a class=\"minus\" style=".concat(onOffSelect ? 'display:block' : 'display:none', " id=\"").concat(row.Info_Account, "remove\" href=\"javascript:void(0)\" title=\"\u53D6\u6D88\">"),
        '<i class="glyphicon glyphicon-minus"></i>',
        '</a>'].join('');
} //（创建群之前）选择好友表格每行按钮单击事件

window.smfgOperateEvents = {
    'click .plus': function clickPlus(e, value, row, index) {
        var groundArrOne = document.getElementById("".concat(row.Info_Account, "add"));
        groundArrOne.style.display = 'none';
        var groundArrOne = document.getElementById("".concat(row.Info_Account, "remove"));
        groundArrOne.style.display = 'block';
        let sel_friends = $('#select_friends').val();
        const account = row.Info_Account; //先判断是否已选择

        if (sel_friends && sel_friends != '') {
            const pos = sel_friends.indexOf(';' + account + ';');

            if (pos >= 0) {
                alert('已选择该好友，请选择其他好友');
                return;
            }
        } else {
            sel_friends = ';';
        }

        sel_friends += row.Info_Account + ';';
        $('#select_friends').val(sel_friends);
        initSelectMyFriendGroupTable([]);
        alert('选择成功');
    },
    'click .minus': function clickMinus(e, value, row, index) {
        var groundArrOne = document.getElementById("".concat(row.Info_Account, "add"));
        groundArrOne.style.display = 'block';
        var groundArrOne = document.getElementById("".concat(row.Info_Account, "remove"));
        groundArrOne.style.display = 'none';
        const sel_friends = $('#select_friends').val();
        const account = row.Info_Account; //先判断是否已选择

        if (!sel_friends || sel_friends == '') {
            alert('还未选择好友，不能进行此操作');
            return;
        }

        const pos = sel_friends.indexOf(';' + account + ';');
        const strlen = (account + ';').length;

        if (pos >= 0) {
            const begin = sel_friends.substr(0, pos);
            const end = sel_friends.substr(pos + strlen);
            var new_sel_friends = begin + end;
        } else {
            alert('未选择该好友，不能进行此操作');
            return;
        }

        if (new_sel_friends == ';') {
            new_sel_friends = '';
        }

        $('#select_friends').val(new_sel_friends);
        alert('取消成功');
    }
}; //初始化（创建群之前）选择好友表格

function initSelectMyFriendGroupTable(data) {
    $('#select_my_friend_group_table').bootstrapTable({
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
            field: 'Info_Account',
            title: '账号',
            align: 'center',
            valign: 'middle',
            sortable: 'true'
        }, {
            field: 'Nick',
            title: '昵称',
            align: 'center',
            valign: 'middle',
            sortable: 'true'
        }, {
            field: 'smfgOperate',
            title: '操作',
            align: 'center',
            valign: 'middle',
            formatter: 'smfgOperateFormatter',
            events: 'smfgOperateEvents'
        }],
        data: data,
        formatNoMatches: function formatNoMatches() {
            return '无符合条件的记录';
        }
    });
} //从我的群组列表中发群消息


function sendGroupMsg() {
    toAccount = $('#sgm_to_groupid').val();
    toName = $('#sgm_to_group_name').val();
    msgtosend = $('#sgm_content').val();
    const msgLen = webim.Tool.getStrBytes(msgtosend);
    let maxLen,
        errInfo;
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

    const isSend = true; //是否为自己发送

    const seq = -1; //消息序列，-1表示sdk自动生成，用于去重

    const random = Math.round(Math.random() * 4294967296); //消息随机数，用于去重

    const msgTime = Math.round(new Date().getTime() / 1000); //消息时间戳

    let subType; //消息子类型

    subType = webim.GROUP_MSG_SUB_TYPE.COMMON;
    const msg = new webim.Msg(sess, isSend, seq, random, msgTime, loginInfo.identifier, subType, loginInfo.identifierNick);
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
            // setSelSessStyleOff(selToID)
            //有聊天会话
            if (selToID == toAccount) { //聊天对象不变
                //不做任何操作
            } else {
                //聊天对象发生改变
                let tempSessDiv = document.getElementById('sessDiv_' + toAccount);

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
      alert(err.ErrorInfo);
      $('#sgm_content').val('');
    }));
} //将我的群组资料（群名称和群头像）保存在infoMap


const initInfoMapByMyGroups = function initInfoMapByMyGroups(cbOK) {
    const options = {
        Member_Account: loginInfo.identifier,
        Limit: totalCount,
        Offset: 0,
        GroupBaseInfoFilter: ['Name', 'FaceUrl']
    };
    webim.getJoinedGroupListHigh(options, function(resp){
        if (resp.GroupIdList && resp.GroupIdList.length) {
            for (let i = 0; i < resp.GroupIdList.length; i++) {
                let group_name = resp.GroupIdList[i].Name;
                let group_image = resp.GroupIdList[i].FaceUrl;
                let key = webim.SESSION_TYPE.GROUP + '_' + resp.GroupIdList[i].GroupId;
                infoMap[key] = {
                    name: group_name,
                    image: group_image
                };
            }
        }

        if (cbOK) {
            cbOK();
        }
    }, (function (err) {
      alert(err.ErrorInfo);
    }));
};
