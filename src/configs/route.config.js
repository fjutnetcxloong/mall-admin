/**
 * 路由配置表
 */
import {Profile} from '../views/routes/profile';
import {OnlineDelivery, OfflinePickup, DeliveryDetail, PurchaseDetail, PickupDetail} from '../views/routes/order/index';
import {Inventory, Grouping, CommodityTags} from '../views/routes/commodity';
import {Distribution, PickUpSelf} from '../views/routes/distribution';
import {MyAsset, RevenuesOfCommodity, RevenuesOfOrder} from '../views/routes/myAsset';
import {Info, Certification, Template, Employee, Password, TemplateCompileOne, TemplateCompileTwo, TemplateCompileThree, TemplateCompileFour, TemplateCompileFive} from '../views/routes/shop';

const routeConfig = [
    //商店概况
    {
        path: '/profile',
        component: Profile
    },
    //订单管理
    {
        path: '/order/online-delivery', //网店发货
        component: OnlineDelivery
    },
    {
        path: '/order/online-delivery/delivery-detail', //网店发货详情页
        component: DeliveryDetail
    },
    {
        path: '/order/offline-pickup', //到店自提
        component: OfflinePickup
    },
    {
        path: '/order/offline-pickup/pickup-detail', //到店自提详情页
        component: PickupDetail
    },
    // {
    //     path: '/order/evaluation', //客户评价
    //     component: Evaluation
    // },
    {
        path: '/order/online-delivery/purchase-detail', //退货详情页
        component: PurchaseDetail
    },
    //商品管理
    {
        path: '/commodity/list', //商品列表
        component: Inventory
    },
    {
        path: '/commodity/group', //商品分组
        component: Grouping
    },
    {
        path: '/commodity/tags', //标签库
        component: CommodityTags
    },
    {
        path: '/dispath/distribution',
        component: Distribution
    },
    {
        path: '/dispath/pickup',
        component: PickUpSelf
    },
    {
        path: '/assets/my-asset', //我的资产
        component: MyAsset
    },
    {
        path: '/assets/revenues-of-commodity', //营业收入
        component: RevenuesOfCommodity
    },
    {
        path: '/assets/revenues-of-order', //业务转入
        component: RevenuesOfOrder
    },
    {
        path: '/shop/info', //店铺信息
        component: Info
    },
    {
        path: '/shop/certification', //店铺认证
        component: Certification
    },
    {
        path: '/shop/template', //店铺模板
        component: Template
    },
    {
        path: '/shop/template-compile-one', //店铺模板 一
        component: TemplateCompileOne
    },
    {
        path: '/shop/template-compile-two', //店铺模板 二
        component: TemplateCompileTwo
    },
    {
        path: '/shop/template-compile-three', //店铺模板 三
        component: TemplateCompileThree
    },
    {
        path: '/shop/template-compile-four', //店铺模板 四
        component: TemplateCompileFour
    },
    {
        path: '/shop/template-compile-five', //店铺模板 五
        component: TemplateCompileFive
    },
    {
        path: '/shop/employee', //店铺职工
        component: Employee
    },
    {
        path: '/shop/password', //密码更改
        component: Password
    }
];
export default routeConfig;
