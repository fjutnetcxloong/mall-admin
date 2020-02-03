
import {disActionTypes as actionTypes} from '../index';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import {api} from '../../../../../configs';

const {errorType} = Utils;

console.log('api', api);
//获取模板信息
export function getTemplateInfo(action$) {
    return action$.ofType(actionTypes.GET_MAIL_TEMPLATE)
        .switchMap(
            (action) => XHR.fetch(api.getMailTemplate, {data: action.payload})
                .map(res => {
                    if (res.status !== 0) {
                        return errorType(res);
                    }
                    return ({
                        type: actionTypes.SET_MAIL_TEMPLATE,
                        payload: {
                            data: res
                        }
                    });
                })
        );
}

export function getPickupInfo(action$) {
    return action$.ofType(actionTypes.GET_PICKUP_INFO)
        .switchMap(
            () => XHR.fetch(api.getSelf)
                .map(res => {
                    if (res.status !== 0) {
                        return errorType(res);
                    }
                    return ({
                        type: actionTypes.SET_PICKUP_INFO,
                        payload: {
                            data: res
                        }
                    });
                })
        );
}
