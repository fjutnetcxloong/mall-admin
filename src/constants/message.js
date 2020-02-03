/**
 * 用于界面消息显示，错误提示等
 */
export const MESSAGE = {
    Network_Error: '网络异常，请稍后再试',
    Network_Cancel: '请求终止',
    No_Url: '请求地址不存在',
    //表单验证
    FORMVALIDATOR: {
        //开店基本信息//shopInfo.jsx
        no_discount: '请输入折扣范围',
        discount_err: '请设置正确折扣',
        err_pic: '您还有店铺相关的图片未上传,请补充',
        no_shop_name: '请输入店铺名称',
        shop_name_error: '请输入2-30位店铺名称，仅支持中英文及数字。',
        major_business: '请选择主营行业',
        no_province: '请填写您所在省!',
        detail_address_null: '请填写店铺详细地址',
        no_city: '请填写您所在市!',
        no_county: '请填写您所在县!',
        customer_service_phone_null: '请输入客服电话',
        principal_name_null: '请输入负责人姓名，且需为2~8位的中文字符',
        no_shopkeeper: '请输入您的姓名！',
        shopkeeper_err: '请输入真实开店人姓名',
        principal_phone_null: '请输入商家负责人电话',
        //开店人基本信息//PeopleInfo.jsx
        shopkeeper_front_photo_null: '请上传身份证正面照',
        shopkeeper_back_photo_null: '请上传身份证反面照',
        shopkeeper_handled_photo_null: '请上传手持身份证照片',
        no_id_card: '请输入您的真实身份证号！',
        error_id_card: '请输入正确的身份证号码！！',
        id_number_validity_period_null: '请输入身份证有效期',
        //个体工商户证明材料 //BusinessInfo.jsx
        materials_type: '请选择您的材料类型！',
        materials_photo: '请上传您的材料照片！',
        shopkeeper_booth_photo_null: '请上传环境照',
        shop_room_pic: '请上传店内照',
        shopkeeper_Room_photo_null: '请上传门头照',
        shop_door: '请上传摊位照',
        shopkeeper_goods_photo_null: '请上传售卖商品照',
        bussiness_type_null: '请选择商家类型',
        bussiness_license_null: '请上传营业执照',
        //绑定银行卡//BindCard.jsx
        operator_success: '操作成功',
        card_owner_null: '请输入卡主姓名',
        username_err: '请输入名字，且需为2~8位的中文字符',
        bank_null: '请选择开户行',
        no_card: '请输入银行卡号',
        card_err: '请输入正确的银行卡号',
        phone_err: '请输入11位电话号码',
        open_shop_phone_error: '请输入正确的开店手机号！',
        bank_reserved_phone_null: '请输入银行预留手机号',
        bank_account_branch_null: '请选择开户支行',
        //店铺信息  //infoModify.jsx
        run_time_null: '请设置营业时间',
        area_null: '请选择所属区域',
        customer_service_phone_err: '您输入的号码有误，请重新输入',
        //店铺认证  //ShopCertification.jsx
        error_social_credit_code: '请填写正确统一社会信用代码',
        social_credit_code_null: '请填写统一社会信用代码',
        bussiness_license_dateNull: '请填写营业执照效期',
        uid_min_error: '请输入不小于9921的纯数字'
    },
    // 登录页面提示语
    LOGIN: {
        // 密码登录 //LoginComponent.jsx
        phone_uid: '请输入手机号或者UID',
        error_phone_or_uid: '请输入正确的手机号或UID',
        error_uid: '请输入正确的UID',
        no_password: '请输入密码',
        Error_Cn: '密码不能含有中文字符',
        //验证码登录   //免费开店
        phone_err: '请输入11位电话号码',
        no_auth_code: '请输入验证码',
        error_auth_code: '请输入正确的短信验证码',
        //效验手机号
        error_phone: '请输入正确的手机号码',
        error_password: '请输入正确格式的密码',
        diff_password: '两次输入的密码不一致，请重新输入',
        register_success: '注册成功',
        no_right: '您没有权限开店!!!!',
        //忘记密码//StepFrom.jsx
        id_number_err: '请输入18位公民身份证号',
        no_new_password: '请输入新密码',
        rewrite_password: '请再次输入密码',
        pwd_different: '两次输入的密码不一致',
        no_bind_shop_card: '请输入绑定店铺的身份证号',
        no_bind_shop_phone: '请输入绑定店铺的手机号码',
        four_auth_code: '验证码必须是四位数字',
        protocol_err: '请先勾选用户协议'
    },
    //开店
    OPENSHOP: {
        no_referrer: '请输入推荐人UID',
        no_phone: '请输入手机号！'
    },
    FormValidator: {
        //是否，确定取消
        confirm_y: '是',
        confirm_n: '否',
        confirm_clear: '确定',
        confirm_cancel: '取消',
        open_time_err: '请选择开店时间',
        //开店流程
        phone_err: '请输入11位电话号码',
        nickname_err: '请输入昵称，且需为2~20位的字符',
        pwd_null: '请输入密码',
        pwd_err: '密码错误',
        verification_cod_null: '请输入验证码',
        verification_code_null: '验证码错误',
        shopkeeper_name: '请输入开店人姓名，且需为2~8位的中文字符',
        no_discount: '请设置8~9.5折的收款码折扣',
        no_intro: '请输入店铺简介',
        shopkeeper_verification_type_null: '请选择证明类型',
        shopkeeper_verification_photo_null: '请上传证明照片',
        bank_account_null: '请输入正确的银行卡号',
        bank_account_address_null: '请选择开户银行地区',
        true_address: '请输入正确地址信息！',
        sure_pick_up_self: '请确认是否支持自提',
        bank_account_branch_err: '当前区域暂无相关支行',

        shopkeeper_door_photo_null: '请上传商家门头照',
        shopkeeper_indoor_photo_null: '请上传商家店内照',

        no_county: '请填写您所在县!',
        // no_city: '请填写您所在市!',
        Error_FileFormat: '只能上传JPG/PNG文件!',
        Error_PicFormat: '图片必须小于2M!'
    },
    //登陆
    /*login: {
        username_pwd_err: '账号或密码错误，请重试',
        user_existed: '该账号已存在，请登陆',
        openShop_protocol_null: '请阅读并同意《开店协议》',
        promoter_log: '您是推广员，暂不能开店',
        promoter_log_confirm: '确定',
        user_unregister: '该账号不存在，请注册',
        IDNumber_err: '请输入正确的身份证号码',
        pwd_set_err: '请设置英文字母、数字和符号组合的8~20位密码',
        Account_Exist: '该手机号已绑定账号，请前往登陆',
        Send_Back: '您的开店申请已退回，请重新申请！'
    },*/
    //配送管理---编辑核销地址和快递发货运费模板
    WRITEOFF: {
        name_null: '核销点名称不能为空',
        error_name: '核销点名称在4-20位之间',
        address_null: '核销地址未选择',
        area_null: '核销地点不可为空',
        phone: '联系电话不可为空',
        error_phone: '请输入正确的手机号码',
        click_save: '点击保存',
        no_detailAddress: '请输入核销点具体地址',
        error_detailAddress: '请输入4-30位核销点具体地址',
        no_city: '请选择市',
        no_county: '请选择县',
        five_template: '最多只能新建五条模板信息',
        no_freight: '您还有区域未设置运费',
        no_template_name: '请输入模板名称',
        address_invalid: '输入地址无效!'
    },
    //新建商品
    NewGoods: {
        delivery_way_null: '请勾选配送方式',
        freight_setting_null: '请设置运费',
        no_stokeUpTime: '请设置备货时间',
        fontNum_tooLittle: '字数过少',
        no_picture: '请上传商品图',
        no_productUnit: '请选择商品单位',
        no_postage: '请输入邮费',
        no_day: '请选择天数',
        no_hour: '请选择小时数',
        no_minute: '请选择分钟数',
        no_cycle: '请选择周期',
        no_validTime: '请设置有效时间',
        name_null: '请输入商品名称',
        name_error: '请勿以空格开头或连续输入空格',
        type_null: '请选择商品分类',
        specfication_null: '请设置至少一个的规格信息',
        no_specficationValue: '请设置至少一个规格值',
        banner_null: '请上传至少一张的banner图',
        price_null: '商品价格不能为空',
        discount_null: '请设置8~9.5折的商品折扣',
        stock_null: '商品库存数量最少为1',
        cancel_before_release_title: '确认退出',
        cancel_before_release: '取消将退出页面，所有信息将不会保存，是否确定退出。',
        all_set_err: '未填写的地方下方红字错误提示'
    },
    //我的职工
    MyEmployee: {
        close_employeeID_null: '关闭后，该账号密码将重置，是否确认关闭。',
        application_employeeID_success_title: '申请提交成功',
        application_employeeID_success: '申请提交成功，审核结果将在3日内公布。',
        application_employeeID_fail_title: '申请提交失败',
        application_employeeID_fail: '您的员工号申请由于XXXXXXXXXXXXXX未通过'
    },
    //店铺信息
    SHOPINFO: {
        modify_title: '修改店铺信息',
        modify: '您修改的店铺信息已提交审核，请耐心等待提示：审核通过前，您修改的信息不会同步保存',
        verification_title: '申请店铺认证',
        verification: '您的店铺认证信息已提交审核，请耐心等待提示：审核通过前，您修改的信息不会同步保存',
        error_id_card: '请输入正确的身份证号码！！',
        no_id_card_validate: '请输入身份证有效期',
        no_name: '请输入您的姓名！',
        error_name: '请输入您真实姓名！',
        long_time_valid: '长期有效',
        upload_success: '图片上传成功',
        upload_failed: '图片上传失败',
        submit_success: '提交成功',
        no_product_picture: '请上传您的商品照!'
    },

    //订单管理
    OrderManager: {
        del_title: '删除订单',
        del_order: '删除订单后将不可恢复，是否确认删除？',
        del_success: '订单删除成功',
        close_title: '关闭订单',
        close_order: '关闭后金额将原路返回到买家付款帐户上，确定要关闭该订单吗？（付款后关闭订单理由弹窗中红字提示）',
        close_success: '订单已关闭',
        no_province: '请先选择省区',
        choose_province: '请填写您所在省!',
        choose_city: '请填写您所在市!',
        choose_county: '请填写您所在县!',
        no_city: '请先选择市区',
        submit_success: '提交成功！',
        receive_success: '收货成功！',
        refuse_reason: '请填写拒绝退款原因',
        no_name: '请输入您的收货人姓名',
        no_detailAddress: '请输入您的详细地址',
        no_phone: '请输入您的联系电话',
        no_logistics: '暂无物流'
    },
    //售后
    AfterSale: {
        confirm_receipt_title: '已收货',
        confirm_receipt: '请认真确认商品，确认收货后，由于商品损坏等原因所造成的损失，平台将不做赔付。',
        ship_title: '已发货',
        ship: '该订单买家已申请售后退款，确定要发货吗（物流填写弹窗中红字提示）',
        not_ship: '暂不发货',
        still_ship: '仍要发货'
    },
    ElSECONFIRM: {

    },
    ElseConfirm: {
        //身份验证
        uid_phone_different: '您输入的信息有误',
        //核销订单
        write_off_verification_code_err: '核销码出错，请重试',
        click_write_off_success: '核销成功',
        //批量操作
        batch_operation_unselected: '请选择需要操作的商品/订单',
        //回复评价
        comment_reply: '回复成功',
        //新建运费模板
        delivery_address_null: '请设置配送区域和邮费',
        //店铺模板
        template_all_edit_err: '尚有信息未完善，请编辑后提交！',
        template_click_unuse: '您的店铺首页将恢复默认状态',
        //未输入搜索信息
        not_import_information: '搜索内容不能为空',
        not_submit_information: '提交内容不能为空',
        fault_formal_business: '您还不是正式商家，还没权限执行这个操作！'
    },
    //退货详情页
    SalesReturn: {
        Submit_Success: '提交成功！'
    },
    //商品管理
    commodityManage: {
        no_groupName: '分组名称不能为空',
        error_groupName: '请输入1-8位中文字符',
        no_tagGroupName: '标签组名称不能为空',
        error_tagGroupName: '请输入1-8位中文字符',
        no_tag: '标签不能为空',
        error_tag: '输入标签不能含有字符或空格'
    }
};
