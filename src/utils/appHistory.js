/**
 * 全局通用的history
 * * @type {Array}
 */
import {push, goBack, replace, go, goForward} from 'react-router-redux'; //将react-router托管到redux
import {store} from '../redux/store';

export const appHistory = {
    push: (location) => {
        store.dispatch(push(location));
    },
    replace: (location) => {
        store.dispatch(replace(location));
    },
    go: (number) => {
        store.dispatch(go(number));
    },
    goBack: () => {
        store.dispatch(goBack());
    },
    goForward: () => {
        store.dispatch(goForward());
    }
};
