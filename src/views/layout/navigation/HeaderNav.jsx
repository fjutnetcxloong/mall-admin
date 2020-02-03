/*
* 公用头部
* */
import {Layout, Badge, Button, Tooltip} from 'antd';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {baseActionCreator as actionCreator} from '../../../redux/baseAction';
import {myActionCreator} from '../../routes/login/action/index';

const {Header} = Layout;
const {appHistory, systemApi, systemApi: {getValue, removeValue}, getShopInfo, tengXunIm} = Utils;
const {api} = Configs;

class HeaderNav extends React.PureComponent {
    static propTypes = {
        visible: PropTypes.bool, //是否显示
        onShow: PropTypes.func, //点击帮助中心回调
        // status: PropTypes.number
        userInfo: PropTypes.node,
        setUserToken: PropTypes.func.isRequired,
        setUserInfo: PropTypes.func.isRequired,
        setShopInfo: PropTypes.func.isRequired
    };

    static defaultProps = {
        visible: true,
        onShow() {},
        userInfo: null
        // status: -1
    }

    onShow = () => {
        this.props.onShow();
    }

    //登出
    loginOut =() => {
        const {setUserToken, setUserInfo, setShopInfo} = this.props;
        XHR.fetch(api.loginOut).subscribe(res => {
            if (res && res.status === 0) {
                removeValue('userInfo');
                removeValue('userToken');
                removeValue('shopInfo');
                removeValue('local');
                removeValue('users');
                setUserToken('');
                setUserInfo('');
                setShopInfo('');
                sessionStorage.clear();
                appHistory.replace('/login');
            }
        });
    }

    //开店状态判断
    showComfirmCode = () => {
        const {visible} = this.props;
        const shopInfo = getShopInfo();
        let confirmStatus = null;
        if (shopInfo) {
            if (shopInfo.data.status === 9) {
                confirmStatus = (
                    <div className="info-notice" style={{paddingRight: visible ? '500px' : '680px'}}>
                        <div>{shopInfo.data.message}</div>
                        {/* <div><Link to="/shop-page?status=success">立即签约</Link></div> */}
                    </div>
                );
            } else {
                confirmStatus = null;
            }
            // else if (shopInfo.data.status === 17) {
            //     confirmStatus = (
            //         <div className="info-notice">
            //             <div>{shopInfo.data.message}</div>
            //         </div>
            //     );
            // } else if (shopInfo.data.status === 20) {
            //     confirmStatus = (
            //         <div className="info-notice">
            //             <div>{shopInfo.data.message}</div>
            //             <div><Link to="/shop/info">立即完善</Link></div>
            //         </div>
            //     );
            // } else if (shopInfo.data.status === 14) {
            //     confirmStatus = (
            //         <div className="info-notice" style={{paddingRight: visible ? '680px' : '500px'}}>
            //             <div>{shopInfo.data.message}</div>
            //             <div><Link to="/shop-page?status=success">立即签约</Link></div>
            //         </div>
            //     );
            // }
        }
        return confirmStatus;
    }

    render() {
        const content = (
            <div className="header-name-container">
                <div><Link to="/shop/info" style={{width: '100%', display: 'inline-block'}}><span className="icon head-icon1"/>设置</Link></div>
                <div onClick={this.loginOut}><span className="icon head-icon2"/><span>退出</span></div>
            </div>
        );
        const {visible, userInfo} = this.props;
        const userInfoData = userInfo || JSON.parse(getValue('users'));
        return (
            <div>
                <Header style={{paddingRight: visible && '520px'}}>
                    <div>
                        {!systemApi.isProdEnv() && <span style={{float: 'left', fontSize: '24px', color: 'red'}}>（商家管理后台内测版）</span>}
                        <Badge>
                            <span onClick={tengXunIm} className="icon icon-message"/>
                        </Badge>
                        <div className="line-col"/>
                        <Tooltip placement="bottomRight" title={content}>
                            <Button>
                                <span className="icon icon-image">
                                    <span style={{verticalAlign: 'text-bottom'}}>{userInfoData && userInfoData.userName}</span>
                                </span>
                            </Button>
                        </Tooltip>
                        {visible || (<Button type="primary" onClick={this.onShow}>帮助中心</Button>)}
                    </div>
                </Header>
                <div style={{height: this.showComfirmCode() === null ? '80px' : '110px'}}/>
                {this.showComfirmCode()}
            </div>
        );
    }
}

const mapStateToProps = state => {
    const login = state.get('login');
    return {
        username: login.get('userInfo')
    };
};
const mapDispatchToProps = {
    setUserToken: actionCreator.setUserToken,
    setUserInfo: myActionCreator.setUserInfo,
    setShopInfo: myActionCreator.setShopInfo
};
export default connect(mapStateToProps, mapDispatchToProps)(HeaderNav);
