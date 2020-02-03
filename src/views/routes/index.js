/**
 * 根路由
 */
import {HashRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import {syncHistoryWithStore} from 'react-router-redux';
import {hashHistory, store} from '../../redux/store';
import ErrorBound from '../common/error/ErrorBound';
import {BasicLayout} from '../layout';
import {Login} from './login';
import {OpenShop, ShopPage} from './open-shop/index';
import {Support} from './support';
import Loading from '../common/loading/Loading';
import {NotFound, ServiceErr, NetError} from '../common/default-page';

const {routeConfig} = Configs;
// syncHistoryWithStore 把history挂到store下
const history = syncHistoryWithStore(hashHistory, store, {
    selectLocationState(state) {
        return state.get('routing').toObject();
    }
});

// http://8dou5che.com/2017/10/24/react-router-redux/
history.listen((location, action) => {
    console.log(
        `The current URL is ${location && location.pathname}`
    );
    console.log(`The last navigation action was ${action}`);
});

//懒加载组件
const LoadingComponent = (Component) => props => (
    <React.Suspense fallback={<Loading/>}>
        <Component {...props}/>
    </React.Suspense>
);

const authorized = (match) => {
    let flag = false;
    routeConfig.forEach(item => {
        if (match.location.pathname === item.path) {
            flag = true;
        }
    });
    return (!flag
        ? (<NotFound/>)
        : (
            <BasicLayout>
                <ErrorBound >
                    <Switch>
                        {routeConfig.map(item => (
                            <Route
                                key={item.path}
                                strit
                                exact
                                path={item.path}
                                component={LoadingComponent(item.component)}
                            />
                        ))}
                    </Switch>
                </ErrorBound>
            </BasicLayout>
        )

    );
};

//根路由组件
export const ViewRoutes = () => (
    <Router>
        <Switch>
            <Route exact path="/" render={() => <Redirect to="/login"/>}/>
            <Route exact path="/login" component={LoadingComponent(Login)}/>
            <Route exact path="/open-shop" component={LoadingComponent(OpenShop)}/>
            <Route exact path="/shop-page" component={LoadingComponent(ShopPage)}/>
            <Route exact path="/support" component={LoadingComponent(Support)}/>
            <Route exact path="/network-error" component={NetError}/>
            <Route exact path="/error" component={ServiceErr}/>
            <Route render={authorized}/>
        </Switch>
    </Router>
);
