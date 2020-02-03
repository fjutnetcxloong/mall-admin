/**
 *  整合模块的reducers
 */
import Immutable from 'immutable';
import {actionTypes} from './actionTypes';

const {createReducer} = Utils;

// 初始化state
const initialState = Immutable.Map({
    isAuth: true, //是否具有商品管理权限
    shopType: '' //店铺类型 0:个人店；1个体工商户；2网店
});

// 初始化reducer
export default {
    commodity: createReducer(initialState, {
        [actionTypes.INIT_AUTH](state, actions) {
            const {auth} = actions.payload;
            return state.set('isAuth', auth);
        },
        [actionTypes.INIT_SHOPTYPE](state, actions) {
            const {type} = actions.payload;
            return state.set('shopType', type);
        }
    })
};