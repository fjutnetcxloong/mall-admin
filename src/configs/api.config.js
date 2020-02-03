/**
 * 接口配置
 */
import currentHref from './href.config';

// const url = currentHref.rootPath + '/';
const url = currentHref.apiPath + '/';
const api = {
    getCommodity: url + 'get-pr', //查询商品列表
    addCommodity: url + 'add-pr', //增加商品
    getCommodityDetail: url + 'get-pr-detail', //查询商品详情
    getCommoditySku: url + 'get-sku', //查询商品SKU
    addCommoditySku: url + 'add-sku', //增加商品SKU
    getCommodityDraft: url + 'get-pr-drafts', //查询商品缓存
    addCommodityDraft: url + 'add-pr-drafts', //增加/更新商品缓存
    delCommodityDraft: url + 'del-pr-draft', //删除商品草稿
    getAllCategory: url + 'get-all-category', //查询全部3级商品分类
    getCommodityGroup: url + 'get-pr-group', //查询商品分组 有分页
    getAllCommodityGroup: url + 'get-all-group', //查询商品分组 无分页
    addCommodityGroup: url + 'add-pr-group', //增加商品分组
    delCommodityGroup: url + 'del-pr-group', //删除商品分组
    upCommodityGroup: url + 'update-pr-group', //修改商品分组
    getCommodityTags: url + 'get-pr-tag', //查询商品标签 有分页
    getAllCommodityTags: url + 'get-all-tag', //查询商品标签 无分页
    addCommodityTags: url + 'add-pr-tag', //增加商品标签
    delCommodityTags: url + 'del-pr-tag', //删除商品标签
    upCommodityTags: url + 'update-pr-tag', //修改商品标签
    getCommoditySpec: url + 'get-spec', //查询商品默认规格
    addCommoditySpec: url + 'add-spec', //增加商品默认规格
    getCommodityValue: url + 'get-pr-value', //查询商品规格属性
    addCommodityValue: url + 'add-pr-value', //增加商品规格属性
    delCommodityValue: url + 'del-pr-value', //删除商品规格属性
    // upCommodityValue: url + 'update-pr-value', //修改商品规格属性
    getCommodityUnit: url + 'get-pr-unit', //查询商品单位
    addCommodityUnit: url + 'add-pr-unit', //增加商品单位
    addCommodityPic: url + 'pic-save-base', //上传商品图片
    addCommodityDetailImage: url + 'update-intro-pic', //上传详情图片
    getAllMailTemplate: url + 'get-all-mail-template',  //新建商品 获取选中运费模板
    upCommodityStatus: url + 'update-pr-status',  //修改商品上下架状态
    getShopData: url + 'get-shopapply', //获取用户开店数据
    login: url + 'login', //登录
    registe: url + 'registe',
    getCode: url + 'vcode', //获取短信验证码
    checkPerson: url + 'forgetpwd', //忘记密码验证身份
    resetPwd: url + 'chgloginpwd', //重置密码
    getMailTemplate: url + 'get-mail-template',  //获取运费模板
    setMailTemplate: url + 'set-mail-template',  //新增运费模板
    getAllProvince: url + 'get-all-province',   //获取区域
    mallOrder: url + 'mall-order', //线上订单搜索
    orderDetail: url + 'order-detail', //线上订单详情
    selfOrderDetail: url + 'self-order-detail', //线下订单详情
    aftersaleInfo: url + 'aftersale-info', //退款详情
    mallSelfOrder: url + 'mall-self-order', //线上订单搜索
    appraiseList: url + 'appraise-list', //客户评价搜索
    deleMailTemplate: url + 'dele-mail-template', //删除运费模板
    findMailTemplate: url + 'find-mail-template',  //按id查询单条运费模板
    homePageData: url + 'get-extend-data', //后台首页数据
    homePageStatus: url + 'update-open-statu', //后台营业状态
    homePageEcharts: url + 'count-show', //后台图表数据
    homePageDataCount: url + 'count-show-all', //后台表格数据
    closeOrder: url + 'close-order', //关闭订单
    deleteOrder: url + 'delete-order', //删除订单
    logisticsTrack: url + 'logistics-track', //物流详情
    pingjiaNum: url + 'pingjia-num', //店铺评价统计
    getExpressList: url + 'get-express-list',   //物流名称获取数组
    outputExcel: url + 'output-excel',   //导出Exle表
    deliverGoods: url + 'deliver-goods',   //发货
    shopInfo: url + 'shopinfo', //获取开店信息
    sureParent: url + 'sure-parent', //确认推荐人
    updateShopExpress: url + 'update-shop-express', //更新商店是否支持快递
    copyTemplate: url + 'copy-mail-template',   //复制模板
    Chkcode: url + 'aftersale-chkcode', //核销码核销
    // copyTemplate: url + 'copy-mail-template',   //复制模板
    aftersaleChkcode: url + 'aftersale-chkcode', //核销码核销
    // copyTemplate: url + 'copy-mail-template',  //复制模板
    // updateShopExpress: url + 'update-shop-express',  //更新商店是否支持快递

    // copyTemplate: url + 'copy-mail-template',   //复制模板/

    //copyTemplate: url + 'copy-mail-template',  //复制模板
    //updateShopExpress: url + 'update-shop-express',  //更新商店是否支持快递
    myAssetRequest: url + 'asset-mana',   //我的资产请求 顶部数据
    myAssetList: url + 'asset-mana-list',   //我的资产请求 列表
    myAssetbusinessList: url + 'business-transfer-list',   //我的资产请求 业务列表
    myAssetOrderList: url + 'order-list',   //我的资产请求 营业收入列表
    batchExport: url + 'output-excel',   //我的资产请求 批量导出
    exportOutputExcelAll: url + 'output-excel-all',   //我的资产请求 全部导出 type 为 1，订单收入的全部导出，type为2 业务收入全部导出
    myOrderReturn: url + 'my-order-return',   //回复评价 回复追评
    getCategory: url + 'get-category', //获取行业分类
    getPcat: url + 'pcat', //获取省市县
    getSelf: url + 'get-self ',   //获取到店自提地址
    setSelf: url + 'set-self',    //编辑到店自提地址
    aftersaleRefuse: url + 'aftersale-refuse', //拒绝退款
    refuseReceive: url + 'refuse-receive', //拒绝收货
    aftersaleReceive: url + 'aftersale-receive', //确认收货
    aftersaleRegoods: url + 'aftersale-regoods', //同意退货
    aftersaleRemoney: url + 'aftersale-remoney', //同意退款
    updateShopSelf: url + 'update-shop-self ',  //更新商店是否支持到店核销
    getShopInfo: url + 'get-shopsetting', //获取店铺信息
    modifyShopsetting: url + 'shop-setting-change', //店铺设置
    employeesAudited: url + 'judge-staff', //判断是否有职工待审核
    addEmployee: url + 'staff-add', //我的职工添加员工
    myEmployeeList: url + 'getmystaff', //我的职工列表
    modifystaffstatus: url + 'modifystaffstatus', //我的职工 關閉員工
    modifystaffpwd: url + 'modifystaffpwd', //我的职工 更新員工密碼
    shopApply: url + 'shopapply', //申请开店
    shopPicup: url + 'shoppicup', //上传图片
    checkShopType: url + 'chk-shop-type', //选择开店类型
    helpCenter: url + 'helper-list', //帮助中心
    helpCenterSecond: url + 'helper-list-second', //帮助中心二级列表
    helpCenterParticulars: url + 'helper-detail', //帮助中心-详情
    helperQuestion: url +  'helper-question', //帮助中心-问问题
    shopAlbum: url + 'shop-album', //上传图册
    getBankInfo: url + 'get-shopbank', //获取绑定银行卡信息
    myModel: url + 'my-model', //店铺模板，我的模板
    useModel: url + 'model-use', //店铺模板，应用模板
    unModel: url + 'unmodel', //店铺模板，不使用模板
    modelMetail: url + 'model-detail', //店铺模板，模板详情
    modelPrs: url + 'prs', //店铺模板，编辑请求所有商品
    modelSave: url + 'model-save', //店铺模板，保存
    modelSavePice: url + 'up-model-pic', //店铺模板，保存图片
    // getShopInfo: url + 'get-shopsetting', //获取店铺信息
    getBankBranch: url + 'bank-branch-list', //获取支行信息
    getBank: url + 'getbank', //获取银行列表
    checkBank: url + 'addbank', //验证银行卡
    shopFinish: url + 'shop-finish', //通知审核
    sendMoney: url + 'single-cash', //发送验证金额
    chechMoney: url + 'check-money', //验证金额
    // checkShopType: url + 'chk-shop-type' //选择开店类型
    getShopAuth: url + 'get-shop-auth', //获取店铺认证信息
    shopAuth: url + 'shop-auth', //店铺认证
    shopSetting: url + 'modifyshopsetting', //店铺设置修改
    loginOut: url + 'logout', //退出登录
    getGoodCategory: url + 'get-category',  //获取商品分类
    updateCountType: url + 'update-count-type',    //选择计费方式
    updateTemplate: url + 'update-template',   //选择模板
    getGroupID: url + 'get-staff-group',   //进入职工群获取群id

    //首页概况消息
    userAllMsg: url + 'diff-msg-list',   //全部消息
    shopHomeOrder: url + 'shop-order-msg',   //订单消息
    platformMsg: url + 'platform-list',   //平台消息
    userMsg: url + 'all-msg-list',   //用户消息
    StandardSuggests: url + 'get-agreement',   //规范提示语
    getSign: url + 'get-sign-url', //获取协议链接
    // shopFinishStatus: 'shop-finsh'
    getSureStatus: url + 'shop-finsh', //第三方签约
    getVcode: url + 'wx-miniqr', //获取微信验证码
    shopIntro: url + 'shop-intro', //获取商店类型描述
    myNoticeEdit: url + 'my-notice-edit' //概况消息标记已读
};
export default api;
