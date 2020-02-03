/**
 * 导航菜单配置
 * TODO:后期做权限控制由后端提供路由表
 */
export const MENUDATA = [
    {
        name: '商店概况',
        icon: 'icon-condition',
        path: '/profile',
        children: []
    },
    {
        name: '订单管理',
        icon: 'icon-order',
        path: '/order',
        children: [
            {
                name: '线上订单',
                path: '/order/online-delivery'
            },
            {
                name: '线下订单',
                path: '/order/offline-pickup'
            }
            // {
            //     name: '客户评价',
            //     path: '/order/evaluation'
            // }
        ]
    },
    {
        name: '商品管理',
        icon: 'icon-commodity',
        path: '/commodity',
        children: [
            {
                name: '商品列表',
                path: '/commodity/list'
            },
            {
                name: '商品分组',
                path: '/commodity/group'
            },
            {
                name: '标签库',
                path: '/commodity/tags'
            }
        ]
    },
    {
        name: '配送管理',
        icon: 'icon-delivery',
        path: '/dispath',
        children: [
            {
                name: '快递发货',
                path: '/dispath/distribution'
            },
            {
                name: '上门自提',
                path: '/dispath/pickup'
            }
        ]
    },
    {
        name: '资产管理',
        icon: 'icon-asset',
        path: '/assets',
        children: [
            {
                name: '我的资产',
                path: '/assets/my-asset'
            },
            {
                name: '订单收入',
                path: '/assets/revenues-of-commodity'
            },
            {
                name: '业务收入',
                path: '/assets/revenues-of-order'
            }
        ]
    },
    {
        name: '店铺设置',
        icon: 'icon-store',
        path: '/shop',
        children: [
            {
                name: '店铺信息',
                path: '/shop/info'
            },
            {
                name: '店铺认证',
                path: '/shop/certification'
            },
            {
                name: '店铺模板',
                path: '/shop/template'
            },
            {
                name: '我的职工',
                path: '/shop/employee'
            },
            {
                name: '密码更改',
                path: '/shop/password'
            }
        ]
    }
    /*{
        name: '营销推广',
        icon: 'icon-marketing',
        path: '/promotion',
        children: [
            {
                name: '每日推荐',
                path: '/promotion/daily'
            },
            {
                name: '秒杀',
                path: '/promotion/flash'
            },
            {
                name: '推荐商品',
                path: '/promotion/recommend'
            }
        ]
    }*/
];
