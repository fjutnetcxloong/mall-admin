import {actionTypes} from './actionTypes';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';

import {api} from '../../../../configs';

const {errorType} = Utils;

//TODO:轮询商品列表
/**
 *间隔一段时间轮询数据列表:库存、审核
 •参数（翻页，每页条数，修改tab）变动时，重新发起轮询
 •进行筛选时，重新发起轮询
 •组件卸载时结束轮询
 */
export function updateList(action$) {
    return action$.ofType(actionTypes.UPDATE_LIST)
        .switchMap(
            (action) => XHR.fetch(api.getCommodity, {data: action.payload.data})
                .map(res => {
                    if (!res || res.status !== 0) {
                        return errorType(res);
                    }
                    return (
                        console.log('这是商品列表', res)
                    );
                })
        );
}