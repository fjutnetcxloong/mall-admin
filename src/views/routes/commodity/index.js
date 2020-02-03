/**
 * Created by 安格 on 2019/8/7
 *
 * 商品管理模块入口文件
 * pages：模块的页面组件，负责请求和处理数据
 * components：模块的公共组件
 * redux：模块的redux相关文件
 * Commodity.less：模块样式
 */
export const Inventory = React.lazy(() => import(/* webpackChunkName: 'commodity'*/ './pages/Inventory'));//商品列表
export const Grouping = React.lazy(() => import(/* webpackChunkName: 'commodity'*/ './pages/Grouping'));//商品分组
export const CommodityTags = React.lazy(() => import(/* webpackChunkName: 'commodity'*/ './pages/CommodityTags'));//标签库
