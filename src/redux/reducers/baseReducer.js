/**
 *  baseReducer函数定义
 */

import Immutable from 'immutable';
import {baseActionTypes as ActionTypes} from '../baseAction';

const {createReducer} = Utils,
    acctState = {
        userToken: null,
        criterion: {}
    };
/**
 * baseState 初始化 1
 * @type {state}
 */
const baseState = Immutable.fromJS({
    ...acctState,
    numTimeout: 0 // 统计userToken error
});


export default {
    base: createReducer(baseState, {
        [ActionTypes.SET_USER_TOKEN](state, action) {
            const {userToken} = action.payload;
            return state.set('userToken', userToken);
        },
        [ActionTypes.SET_NUM_TIMEOUT](state, action) {
            const {num} = action.payload;
            let numTimeout;
            if (num === undefined) {
                numTimeout = state.get('numTimeout');
                return state.set('numTimeout', ++numTimeout);
            }
            return state.set('numTimeout', num);
        },
        [ActionTypes.SET_CRITERION](state, action) {
            const {data} = action.payload;
            const criterion = state.get('criterion').merge(data);
            return state.set('criterion', criterion);
        }
    })
};
