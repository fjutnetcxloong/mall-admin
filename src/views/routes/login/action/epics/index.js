/**
 *  开店模块 epics
 */
import {myActionTypes as actionTypes} from '../index';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import {api} from '../../../../../configs';

const {errorType} = Utils;

// 获取店铺信息
export function getShopInfo(action$) {
    return action$.ofType(actionTypes.GET_SHOP_INFO)
        .switchMap(
            (action) => XHR.fetch(api.shopInfo, {data: action.payload.data})
                .map(res => {
                    if (res.status !== 0) {
                        return errorType(res);
                    }
                    return ({
                        type: actionTypes.SET_SHOP_INFO,
                        payload: {
                            data: res.data
                        }
                    });
                })
        );
}
