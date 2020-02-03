/**
 * Created by locke.
 */
import baseReducer from './baseReducer';
import routeReducer from './routerReducer';
import openShopReducer from '../../views/routes/open-shop/reducer/index';
import loginReducer from '../../views/routes/login/reducer/index';
import distributionReducer from '../../views/routes/distribution/reducer/index';
import commodityReducer from '../../views/routes/commodity/redux/reducers';

export const rootReducer = {
    ...baseReducer,
    ...routeReducer,
    ...openShopReducer,
    ...loginReducer,
    ...commodityReducer,
    ...distributionReducer
};
