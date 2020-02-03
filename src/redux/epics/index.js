import {baseActionTypes} from '../baseAction';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';

import {api} from '../../configs';

const {errorType} = Utils;

//获取协议内容
export function getCriterion(action$) {
    return action$.ofType(baseActionTypes.GET_CRITERION)
        .switchMap(
            (action) => XHR.fetch(api.StandardSuggests, {data: action.payload.data})
                .map(res => {
                    if (res.status !== 0) {
                        return errorType(res);
                    }
                    return ({
                        type: baseActionTypes.SET_CRITERION,
                        payload: {
                            data: res.data
                        }
                    });
                })
        );
}