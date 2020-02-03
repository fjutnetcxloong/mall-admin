import {createLogger} from 'redux-logger';
import {applyMiddleware, createStore} from 'redux';
import {routerMiddleware} from 'react-router-redux';
import {createEpicMiddleware} from 'redux-observable';
import {combineReducers} from 'redux-immutable'; // 使用redux-immutable替换原来 Redux提供的combineReducers
import {createHashHistory as createHistory} from 'history';
import {rootEpic} from './rootEpic';
import {rootReducer} from './reducers';


// 创建 history 单例
const hashHistory = createHistory();

const epicMiddleware = createEpicMiddleware(rootEpic),
    routersMiddleware = routerMiddleware(hashHistory),
    middleware = [epicMiddleware, routersMiddleware];
const reducers = combineReducers({
    ...rootReducer
});
if (process.env.NODE_ENV !== 'production') {
    middleware.push(createLogger());
}
const store = createStore(reducers, applyMiddleware(...middleware));

/**
 * 添加 reducer 函数
 * @param reducer
 */
function injectReducer(reducer) {
    store.replaceReducer(combineReducers({
        ...rootReducer,
        ...reducer
    }));
}

export {store, injectReducer, hashHistory};