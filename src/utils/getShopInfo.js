import {store} from '../redux/store';

/**
 * 获取开店状态
 */
export function getShopInfo() {
    let shopInfo;
    if (store.getState().get('login').get('shopInfo') !== null) {
        shopInfo = store.getState().get('login').get('shopInfo');
    } else {
        shopInfo = JSON.parse(sessionStorage.getItem('shopInfo'));
    }
    return shopInfo;
}