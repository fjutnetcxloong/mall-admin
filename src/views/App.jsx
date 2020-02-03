/**
 * app
 */
import {Provider} from 'react-redux';
import {hot} from 'react-hot-loader';
import {ConfigProvider} from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import moment from 'moment';
import {store} from '../redux/store';
import {ViewRoutes} from './routes/index';
import './App.less';

const {zhCn} = Configs;
moment.locale('zh-cn', zhCn);

const App = () => (
    <Provider store={store}>
        <ConfigProvider
            locale={zhCN}//配置antd语言包
            autoInsertSpaceInButton={false}//设置为 false 时，移除按钮中2个汉字之间的空格
        >
            {ViewRoutes()}
        </ConfigProvider>
    </Provider>
);

export default hot(module)(App);
