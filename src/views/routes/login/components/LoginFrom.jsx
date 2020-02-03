/**
 * 密码登录，验证码登录，注册账号
 * 雷疆
 */
import {Avatar, Button, Card, Checkbox, Form, Modal} from 'antd';
import {connect} from 'react-redux';
import md5 from 'md5';
import {baseActionCreator} from '../../../../redux/baseAction';
import {myActionCreator} from '../action/index';
import * as comActionCreator from '../../commodity/redux/actions';
import GetCode from '../../../common/get-code/GetCode';
import GeisInput from '../../../common/form/input/GeisInput';
import './LoginFrom.less';
import HandleModal from '../../../common/handle-modal/HandleModal';

const {systemApi: {setValue}, validator, appHistory, successMsg, showFail, showInfo} = Utils;
const {api, appToken} = Configs;
const {MESSAGE: {LOGIN, OPENSHOP}} = Constants;
class LoginComponent extends BaseComponent {
    state = {
        loginStatus: true,  // 显示登录还是免费开店
        changeLogin: false, //切换登录方式  false 账号登录， true 验证码登录
        show: false, //切换密码的显示状态
        reShow: false, //确认密码显示状态
        visible: false, // 是否显示账户选择弹窗
        info: [], // 账户列表
        userIndex: -1, //多个账号对应的索引
        no: -1, //用户no
        phone: '', //保存电话
        password: '', //密码
        code: '',  //验证码
        headName: '', //协议隐私弹窗名称
        figureType: '', //协议隐私传参，
        visibleAgreement: false, //是否显示协议
        agreeStatus: false, //用户协议显示状态
        forgetStatus: false, //忘记密码显示状态
        value: '', //数字输入框的值
        criType: -1, //协议内容参数
        submitStatus: false,
        registeStatus: false
    }

    //切换注册登录
    changeLoginStatus = () => {
        const {resetFields} = this.props.form;
        resetFields(['code']);
        this.setState(prevState => ({
            loginStatus: !prevState.loginStatus,
            phone: ''
        }));
    };

    //校验手机号
    checkPhone = (rule, value, callback) => {
        this.setState({
            phone: value
        });
        if (value && !validator.checkPhone(value)) {
            validator.showMessage(LOGIN.error_phone, callback);
            return;
        }
        callback();
    };

    //校验密码格式
    checkPassword = (rule, value, callback) => {
        const {form: {validateFields}} = this.props;
        if (value && !validator.checkStr(value, 6, 20)) {
            validator.showMessage(LOGIN.error_password, callback);
            return;
        }
        if (value && validator.checkCN(value)) {
            console.log('object');
            validator.showMessage(LOGIN.Error_Cn, callback);
            return;
        }
        validateFields(['rePsw'], {force: true});
        callback();
    };

    //判断两次密码是否输入一致
    comparePassword = (rule, value, callback) => {
        const {form: {getFieldValue}} = this.props;
        const pwd = getFieldValue('pwd');
        if (value && !validator.isEqual(value, pwd, LOGIN.diff_password, callback)) return;
        callback();
    };

    //确认注册
    handleRegiste = e => {
        e.preventDefault();
        const {agreeStatus} = this.state;
        const {validateFields} = this.props.form;
        validateFields({first: true, force: true}, (err, val) => {
            if (!err) {
                if (agreeStatus) {
                    this.setState({
                        registeStatus: true
                    });
                    this.fetch(api.registe, {
                        data: {
                            token: appToken.pc,
                            vcode: val.code,
                            phone: val.phone,
                            pwd: val.pwd,
                            repwd: val.rePsw
                        }}).subscribe(res => {
                        this.setState({
                            registeStatus: false
                        });
                        if (res && res.status === 0) {
                            this.saveNothing(res);
                            successMsg(LOGIN.register_success);
                            appHistory.replace('/open-shop');
                        }
                    });
                } else {
                    showFail(LOGIN.protocol_err);
                }
            }
        });
    };

    //切换密码显示状态
    checkEyes = (type) => {
        this.setState(prevState => ({
            [type]: !prevState[type]
        }));
    };

    //验证登录账号
    checkLoginCode = (rule, value, callback) => {
        const {changeLogin} = this.state;
        this.setState({
            phone: value
        });
        if (changeLogin) {
            if (value && !validator.checkPhone(value)) {
                validator.showMessage(LOGIN.error_phone, callback);
                return;
            }
            callback();
        } else {
            if (value && !validator.checkInt(value, 9921)) {
                validator.showMessage(LOGIN.error_phone_or_uid, callback);
                return;
            }
            callback();
        }
    };


    /**
     * 多个账号时，保存当前选中账号状态
     * @no 用户no
     * @index 当前点击索引
     */
    soloveNo = (no, index) => {
        this.setState({
            userIndex: index,
            no
        });
    };

    /**
     * 切换登录方式
     * @changeLogin 验证码登录
     * @!changeLogin 密码登录
     */
    changeType = () => {
        this.setState(prevState => ({
            changeLogin: !prevState.changeLogin,
            code: '',
            forgetStatus: !prevState.forgetStatus
        }));
    };

    /**
     * 当有多个账号时，关闭弹出模态框
     */
    close = () => {
        this.setState({
            visible: false
        });
    };

    closeAgreement = () => {
        this.setState({
            visibleAgreement: false
        });
    };

    /**
     * 公共登录方法
     * @user 输入的账号/uid
     * @val 输入的密码/验证码
     * @no 当存在多个账号时,登录时需要携带选中账号的no
     * @type 登录方式 默认是1,是密码登录， 3是验证码登录
     * @flag 判断是否需要弹框，第一次登录时需要判断是都有多个账号，第二次单个账号不需要选择
     * @data_type 获取用户开店状态
     */
    publicLogin = (user, val, no = undefined, type = 1, flag = true) => {
        this.setState({
            submitStatus: true
        });
        this.fetch(api.login, {
            data: {
                token: appToken.pc,
                code: `${user}UUUUUUUUUU${val}`,
                type: type,
                no: no
            }
        }).subscribe(res => {
            this.setState({
                submitStatus: false
            });
            if (res && res.status === 0) {
                this.saveNothing(res);
                const {initAuth, initShopType} = this.props;
                initAuth(true);
                initShopType('');
                if (res.data && flag) {
                    this.setState({
                        visible: true,
                        info: res.data
                    });
                    return;
                }
                if (res.data_type && res.data_type.status === 0) {
                    appHistory.replace('/profile');
                } else if (res.data_type.status === 1) {
                    if (res.shop_type.data) {
                        if (res.shop_type.data.status === 9 || res.shop_type.data.status === 6) {
                            appHistory.replace('/profile');
                        } else if (res.shop_type.data.status === 4) {
                            showInfo(res.shop_type.message, 2, () => {
                                appHistory.push('/open-shop');
                            });
                        } else {
                            appHistory.replace('/open-shop');
                        }
                    } else if (res.shop_type.status === 1) {
                        showFail(res.shop_type.message);
                    }
                } else {
                    showInfo(LOGIN.no_right);
                }
            }
        });
    }

    // 获取协议内容
    criterion = (e, name) => {
        const {getCriterion, criterion} = this.props;
        if (e === 4 && !criterion.has('member_content')) {
            getCriterion({type: e});
        } else if (e === 3 &&  !criterion.has('secret_content')) {
            getCriterion({type: e});
        }
        this.setState({
            visibleAgreement: true,
            headName: name,
            criType: e
        });
    }

    /**
     * 储存登录之后需要用到的全局数据
     * @setUserToken 储存userToken
     * @setUserInfo  储存用户信息
     * @setShopInfo 储存开店状态
     */
    saveNothing = (res) => {
        const {setUserToken, setUserInfo, setShopInfo} = this.props;
        setUserInfo({no: res.no, phone: res.phone, userName: res.nickname});
        setShopInfo(res.shop_type);
        sessionStorage.setItem('shopInfo', JSON.stringify(res.shop_type));
        setUserToken(res.LoginSessionKey);
        setValue('userToken', res.LoginSessionKey);
        const obj = {
            userName: res.nickname,
            no: res.no,
            phone: res.phone
        };
        setValue('users', JSON.stringify(obj));
    }

    // 二次登录时前往开店页面
    goOpenShop = () => {
        const {no, phone, password, code} = this.state;
        // console.log(no);
        if (no === -1) {
            showFail('请选择登录的UID!');
            return;
        }
        if (code) {
            this.publicLogin(phone, code, no, 3, false);
        } else {
            this.publicLogin(phone, md5(password), no, undefined, false);
        }
    }

    //登录
    handleSubmit = e => {
        e.preventDefault();
        const {validateFields} = this.props.form;
        validateFields({first: true, force: true}, (err, val) => {
            this.setState({
                code: val.code,
                password: val.password
            });
            if (!err) {
                if (val.code) {
                    this.publicLogin(val.username, val.code, undefined, 3);
                } else {
                    this.publicLogin(val.username, md5(val.password), undefined);
                }
            }
        });
    };

    //勾选协议
    agreement = (e) => {
        this.setState({
            agreeStatus: e.target.checked
        });
    };

    // 切换忘记面页面
    forgetPass = () => {
        this.props.changeForget(true);
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        const {criterion} = this.props;
        const {
            loginStatus, changeLogin, visible, visibleAgreement, info,
            userIndex, show, reShow, headName, forgetStatus,
            phone, criType, submitStatus, registeStatus
        } = this.state;
        // 协议按钮
        const HandleModalFooter = (
            <div>
                <Button
                    type="primary"
                    onClick={this.closeAgreement}
                >
                    知道了
                </Button>
            </div>
        );
        // 协议内容
        const logisticsr = (
            <div className="content-composing">{criType === 4 ? criterion.get('member_content') : criterion.get('secret_content')}</div>
        );
        return (
            <div className="login-component-box">
                {
                    loginStatus
                        ? (
                            <Card
                                className="login-card"
                                title={changeLogin ? '验证码登录' : '账号登录'}
                                extra={
                                    <span className="login-card-title" onClick={this.changeLoginStatus}>免费开店</span>
                                }
                            >
                                <Form onSubmit={this.handleSubmit}>
                                    {
                                        changeLogin ? (
                                            <React.Fragment>
                                                <Form.Item className="account">
                                                    {getFieldDecorator('username', {
                                                        rules: [
                                                            {required: true, message: LOGIN.phone_err},
                                                            {validator: this.checkLoginCode}
                                                        ]
                                                    })(
                                                        <GeisInput
                                                            type="num"
                                                            maxLength={11}
                                                            placeholder="请输入您的手机号"
                                                        />
                                                    )}
                                                </Form.Item>
                                                <Form.Item className="code">
                                                    {getFieldDecorator('code', {
                                                        rules: [
                                                            {required: true, message: LOGIN.no_auth_code},
                                                            {pattern: /^\d{4}$/, message: LOGIN.error_auth_code}
                                                        ]
                                                    })(
                                                        <GeisInput
                                                            type="num"
                                                            maxLength={4}
                                                            placeholder="请输入短信验证码"
                                                        />
                                                    )}
                                                    <GetCode phone={phone} style={{width: '120px'}} type={1}/>
                                                </Form.Item>
                                            </React.Fragment>
                                        ) : (
                                            <React.Fragment>
                                                <Form.Item className="account">
                                                    {getFieldDecorator('username', {
                                                        rules: [
                                                            {required: true, message: LOGIN.phone_uid},
                                                            {validator: this.checkLoginCode}
                                                        ]
                                                    })(
                                                        <GeisInput
                                                            type="num"
                                                            maxLength={11}
                                                            placeholder="请输入您的手机号/UID"
                                                        />
                                                    )}
                                                </Form.Item>
                                                <Form.Item className="import-password">
                                                    {getFieldDecorator('password', {
                                                        rules: [
                                                            {required: true, message: LOGIN.no_password},
                                                            {validator: this.checkPassword}
                                                        ]
                                                    })(
                                                        <GeisInput
                                                            showPass
                                                            type="nonSpace"
                                                            maxLength={20}
                                                            placeholder="请输入密码"
                                                        />
                                                    )}
                                                </Form.Item>
                                            </React.Fragment>
                                        )
                                    }
                                    <Form.Item className="confirm">
                                        <Button type="danger" loading={submitStatus} onClick={this.handleSubmit}>登入</Button>
                                    </Form.Item>
                                </Form>
                                <div className="bottom-link">
                                    <div className="forgetPass" onClick={this.changeType}>{changeLogin ? '密码登录' : '验证码登录'}</div>
                                    {
                                        !forgetStatus && (
                                            <div className="forgetPass" onClick={this.forgetPass}>忘记密码？</div>
                                        )
                                    }
                                </div>
                                <Modal
                                    title="请选择账号"
                                    visible={visible}
                                    centered
                                    onOk={this.goOpenShop}
                                    onCancel={this.close}
                                >
                                    <div className="modal-user">
                                        {
                                            info.map((item, index) => (
                                                <div
                                                    onClick={() => this.soloveNo(item.no, index)}
                                                    key={item.no}
                                                    className={userIndex === index ? 'active-user' : ''}
                                                >
                                                    <Avatar size={60} src={item.avatarUrl}/>
                                                    <p>UID:{item.no}</p>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </Modal>
                            </Card>
                        ) : (
                            <Card
                                title="免费开店"
                                extra={
                                    <span className="login-card-title" onClick={this.changeLoginStatus}>已有账号</span>
                                }
                            >
                                <Form onSubmit={this.handleRegiste} className="change-form1">
                                    <Form.Item>
                                        {getFieldDecorator('phone', {
                                            rules: [
                                                {required: true, message: OPENSHOP.no_phone},
                                                {validator: this.checkPhone}
                                            ]
                                        })(
                                            <GeisInput
                                                type="num"
                                                maxLength={11}
                                                placeholder="请输入开店手机号"
                                            />
                                        )}
                                    </Form.Item>
                                    <Form.Item className="code">
                                        {getFieldDecorator('code', {
                                            rules: [
                                                {required: true, message: LOGIN.no_auth_code},
                                                {pattern: /^\d{4}$/, message: LOGIN.error_auth_code}
                                            ]
                                        })(
                                            <GeisInput
                                                type="num"
                                                maxLength={4}
                                                placeholder="请输入短信验证码"
                                            />
                                        )}
                                        <GetCode phone={phone} type={2}/>
                                    </Form.Item>
                                    <Form.Item>
                                        {getFieldDecorator('pwd', {
                                            rules: [
                                                {required: true, message: '请输入密码！'},
                                                {validator: this.checkPassword}
                                            ]
                                        })(
                                            <GeisInput
                                                showPass={!show}
                                                suffix={(
                                                    <span
                                                        className={`icon ${show ? 'icon-openEys' : 'icon-closeEys'}`}
                                                        onClick={() => this.checkEyes('show')}
                                                    />
                                                )}
                                                type="nonSpace"
                                                maxLength={20}
                                                placeholder="请输入6-20位字符密码"
                                            />
                                        )}
                                    </Form.Item>
                                    <Form.Item className="comfirm-your-pwd">
                                        {getFieldDecorator('rePsw', {
                                            rules: [
                                                {required: true, message: '请输入确认密码！'},
                                                {validator: this.comparePassword}
                                            ]
                                        })(
                                            <GeisInput
                                                showPass={!reShow}
                                                suffix={(
                                                    <span
                                                        className={`icon ${reShow ? 'icon-openEys' : 'icon-closeEys'}`}
                                                        onClick={() => this.checkEyes('reShow')}
                                                    />
                                                )}
                                                type="nonSpace"
                                                maxLength={20}
                                                placeholder="请确认密码"
                                            />,
                                        )}
                                    </Form.Item>
                                    <Form.Item className="confirm">
                                        <Button type="danger" loading={registeStatus} onClick={this.handleRegiste}>确认注册</Button>
                                    </Form.Item>
                                    <Form.Item className="agreement-privacy">
                                        <div className="agreement">
                                            <Checkbox onChange={this.agreement}>已阅读并同意</Checkbox>
                                            <span className="norm" onClick={() => this.criterion(4, '《用户协议》')}>《用户协议》</span>
                                        </div>
                                        <span className="privacy" onClick={() => this.criterion(3, '《隐私政策》')}>《隐私政策》</span>
                                    </Form.Item>
                                </Form>
                                {
                                    visibleAgreement && (
                                        <HandleModal
                                            visible={visibleAgreement}
                                            title={headName}
                                            isStyle
                                            closable
                                            footer={HandleModalFooter}
                                            content={logisticsr}
                                            onCancel={this.closeAgreement}
                                        />
                                    )
                                }
                            </Card>
                        )
                }
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const base = state.get('base');
    return {
        token: base.get('token'),
        criterion: base.get('criterion')
    };
};

const mapDispatchToProps = {
    setUserToken: baseActionCreator.setUserToken,
    setUserInfo: myActionCreator.setUserInfo,
    setShopInfo: myActionCreator.setShopInfo,
    getCriterion: baseActionCreator.getCriterion,
    initAuth: comActionCreator.initAuth,
    initShopType: comActionCreator.initShopType
};

const FormLoginComponent = Form.create()(LoginComponent);
export default connect(mapStateToProps, mapDispatchToProps)(FormLoginComponent);
