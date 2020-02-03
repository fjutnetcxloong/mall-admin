import Immutable from 'immutable';

import {openShopType} from '../action/index';

const {createReducer} = Utils;

const indexState = {
    userStatus: false,
    shopData: null
};

const shopState = Immutable.fromJS({
    ...indexState
});

export default {
    openShop: createReducer(shopState, {
        [openShopType.SET_SHOPDATA](state, actions) {
            const {obj} = actions.payload;
            return state.set('shopData', obj);
        }
    })
};