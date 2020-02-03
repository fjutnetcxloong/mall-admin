import Immutable from 'immutable';
import {myActionTypes} from '../action/index';

const {createReducer} = Utils;

const initState = {
    userInfo: null,
    shopInfo: null //店铺开店状态
};

const loginState = Immutable.fromJS({
    ...initState
});

export default {
    login: createReducer(loginState, {
        [myActionTypes.SET_USER_INFO](state, actions) {
            const {obj} = actions.payload;
            return state.set('userInfo', obj);
        },
        [myActionTypes.SET_SHOP_INFO](state, actions) {
            const {data} = actions.payload;
            return state.set('shopInfo', data);
        }
    })
};
