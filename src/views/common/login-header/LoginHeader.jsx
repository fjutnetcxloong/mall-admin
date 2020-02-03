/*
* 公用头部--登录，帮助中心头部
* */

import {Typography, Divider, Row, Col} from 'antd';
import {connect} from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {baseActionCreator as actionCreator} from '../../../redux/baseAction';
import {myActionCreator} from '../../routes/login/action/index';
import './LoginHeader.less';

const {appHistory, systemApi, systemApi: {getValue, removeValue}} = Utils;
const {api} = Configs;
const {Title, Text} = Typography;
const {WEB_NAME} = Constants;

class Header extends React.PureComponent {
    static propTypes = {
        visible: PropTypes.bool,
        userInfo: PropTypes.object,
        setUserToken: PropTypes.func.isRequired,
        setUserInfo: PropTypes.func.isRequired,
        setShopInfo: PropTypes.func.isRequired
    }

    static defaultProps = {
        visible: false,
        userInfo: {}
    }

    loginOut =() => {
        const {setUserToken, setUserInfo, setShopInfo} = this.props;
        XHR.fetch(api.loginOut).subscribe(res => {
            if (res && res.status === 0) {
                removeValue('userInfo');
                removeValue('userToken');
                removeValue('shopInfo');
                setUserToken('');
                setUserInfo({});
                setShopInfo('');
                sessionStorage.clear();
                appHistory.replace('/login');
                removeValue('users');
            }
        });
    }

    render() {
        const {visible, userInfo} = this.props;
        const users = JSON.parse(getValue('users'));
        return (
            <Row className="header-content" span={24}>
                <Col span={12}>
                    <Typography>
                        <Title level={3} className="title">
                            {/* <span className="icon logo-icon"/> */}
                            <div className="title-img"/>
                            <div>
                                <span className="main-title">{WEB_NAME}</span>
                                <Divider type="vertical"/>
                                <span className="sub-title">{WEB_NAME}商家管理后台</span>
                            </div>

                            {!systemApi.isProdEnv() && <span style={{fontSize: '16px', color: 'red'}}>（内测版）</span>}
                        </Title>
                    </Typography>
                </Col>
                <Col span={12} className={classNames('text', {hide: !visible})} >
                    <Text level={4} strong>
                        <span>当前账户：{(userInfo && userInfo.phone) || (users && users.phone)}</span>
                        <span className="middle">UID：{(userInfo && userInfo.no) || (users && users.no)}</span>
                        <span onClick={this.loginOut}>退出</span>
                    </Text>
                </Col>
            </Row>
        );
    }
}

const mapStateToProps = state => {
    const login = state.get('login');
    return {
        userInfo: login.get('userInfo')
    };
};
const mapDispatchToProps = {
    setUserToken: actionCreator.setUserToken,
    setUserInfo: myActionCreator.setUserInfo,
    setShopInfo: myActionCreator.setShopInfo
};
export default connect(mapStateToProps, mapDispatchToProps)(Header);
