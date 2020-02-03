import Immutable from 'immutable';
import {disActionTypes} from '../action/index';

const {createReducer} = Utils;

const initState = {
    mailTemplateInfo: null,
    pickupInfo: null
};

const disState = Immutable.fromJS({
    ...initState
});

export default {
    disReducer: createReducer(disState, {
        [disActionTypes.SET_MAIL_TEMPLATE](state, actions) {
            const {data} = actions.payload;
            return state.set('mailTemplateInfo', data);
        },
        [disActionTypes.SET_PICKUP_INFO](state, actions) {
            const {data} = actions.payload;
            return state.set('pickupInfo', data);
        }
    })
};
