/**
 * 定义模块的action 和 action creator
 */
import {actionTypes} from './actionTypes';

// 初始化商品管理权限
export const initAuth = (auth) => ({
    type: actionTypes.INIT_AUTH,
    payload: {
        auth
    }
});

// 初始化店铺类型
export const initShopType = (type) => ({
    type: actionTypes.INIT_SHOPTYPE,
    payload: {
        type
    }
});