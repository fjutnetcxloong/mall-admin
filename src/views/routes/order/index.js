/**
 *  订单管理
 */
export const OnlineDelivery = React.lazy(() => import(/* webpackChunkName: 'order'*/ './pages/OnlineDelivery')); //网店发货
export const DeliveryDetail = React.lazy(() => import(/* webpackChunkName: 'order'*/ './pages/DeliveryDetail')); //网店发货详情页
// export const Evaluation = React.lazy(() => import(/* webpackChunkName: 'order'*/ './pages/Evaluation')); //客户评价
export const PickupDetail = React.lazy(() => import(/* webpackChunkName: 'order'*/ './pages/PickupDetail')); //到店自提详情页
export const OfflinePickup = React.lazy(() => import(/* webpackChunkName: 'order'*/ './pages/OfflinePickup')); //到店自提
export const PurchaseDetail = React.lazy(() => import(/* webpackChunkName: 'order'*/ './pages/PurchaseDetail')); //退货详情页
