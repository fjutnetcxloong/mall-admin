/**
 * 忘记密码页面
 * 雷疆
 */

import {Form, Steps, Col, Row, Button, Modal, Avatar, Skeleton} from 'antd';
import GetCode from '../../../common/get-code/GetCode';
import GeisInput from '../../../common/form/input/GeisInput';
import './ForgetPass.less';


const {api} = Configs;
const {validator, showFail, appHistory} = Utils;
const {MESSAGE: {LOGIN}} = Constants;
const {Step} = Steps;

class ForgetPass extends BaseComponent {
    state = {
        skeleton: true, //内容骨架
        check: true,
        current: 0, //头部进度条状态
        visible: false,
        user: [], //用户账号
        userIndex: -1, //賬號index
        no: '', //保存用户的no
        timeOut: 3,  //倒计时
        phone: '', //电话号码
        show: false, //切换密码的显示状态
        reShow: false, //确认密码显示状态
        firstStep: false,
        lastStatus: false
    }

    componentDidMount() {
        this.closeSkeleton();
    }

    closeSkeleton = () => {
        this.setState({
            skeleton: false
        });
    }

    /**
     * 忘记密码第一步校验身份证
     */
    handleSubmit = e => {
        e.preventDefault();
        const {validateFields} = this.props.form;
        validateFields({first: true, force: true}, (err, values) => {
            if (!err) {
                this.setState({
                    firstStep: true
                });
                this.fetch(api.checkPerson, {
                    data: {
                        vcode: Number(values.code),
                        idcard: values.IdCard,
                        phone: Number(values.phone)
                    }}).subscribe(res => {
                    this.setState({
                        firstStep: false
                    });
                    if (res) {
                        console.log(res);
                        if (res.status === 0) {
                            if (res.data) {
                                this.setState({
                                    user: res.data,
                                    vcode: Number(values.code),
                                    visible: true,
                                    idcard: values.IdCard
                                });
                            } else {
                                this.setState({
                                    vcode: Number(values.code),
                                    idcard: values.IdCard,
                                    phone: Number(values.phone),
                                    current: 1
                                });
                            }
                        }
                    }
                });
            }
        });
    };

    /**
     * 忘记密码第二步，重置密码
     */
    resetPassWord = e => {
        e.preventDefault();
        const {vcode, phone, idcard, no} = this.state;
        this.props.form.validateFields({first: true, force: true}, (err, values) => {
            console.log(err);
            console.log(values);
            if (!err) {
                this.setState({
                    lastStatus: true
                });
                this.fetch(api.resetPwd, {
                    data: {
                        vcode,
                        phone,
                        idcard,
                        no,
                        pwd: values.password,
                        repwd: values.confirm
                    }}).subscribe(res => {
                    this.setState({
                        lastStatus: false
                    });
                    if (res && res.status === 0) {
                        if (res.data) {
                            showFail(res.data.message, 1, () => {
                                this.setState({
                                    current: 0
                                });
                            });
                        } else {
                            this.setState({
                                current: 2
                            });
                            let num = 3;
                            const timer = setInterval(() => {
                                num -= 1;
                                this.setState({
                                    timeOut: num
                                }, () => {
                                    if (this.state.timeOut === 0) {
                                        clearInterval(timer);
                                        if (window.location.hash.includes('login')) {
                                            this.props.changeForget(false);
                                        } else {
                                            appHistory.push('/profile');
                                        }
                                    }
                                });
                            }, 1000);
                        }
                    }
                });
            }
        });
    }

    /**
     * 校验身份证格式
     */
    checkIdCard = (rule, value, callback) => {
        if (value && !validator.ID(value)) {
            validator.showMessage(LOGIN.id_number_err, callback);
            return;
        }
        callback();
    };

    /**
     * 校验电话格式
     */
    checkPhone = (rule, value, callback) => {
        this.setState({
            phone: value
        });
        if (value && !validator.checkPhone(value)) {
            validator.showMessage(LOGIN.error_phone, callback);
            this.setState({
                check: true
            });
            return;
        }
        this.setState({
            check: false
        });
        callback();
    };

    //校验密码格式
    checkPsw = (rule, value, callback) => {
        const {form} = this.props;
        // if (!validator.isEmpty(value, LOGIN.no_new_password, callback)) return;
        if (value && !validator.checkStr(value, 6, 20)) {
            validator.showMessage(LOGIN.error_password, callback);
            return;
        }
        if (value && validator.checkCN(value)) {
            validator.showMessage(LOGIN.Error_Cn, callback);
            return;
        }
        form.validateFields(['confirm'], {force: true});
        callback();
    };

    /**
     * 判断两次输入的密码是否一致
     */
    comparePassword = (rule, value, callback) => {
        const {form} = this.props;
        const pwd = form.getFieldValue('password');
        // if (!validator.isEmpty(value, LOGIN.rewrite_password, callback)) return;
        if (value && !validator.isEqual(value, pwd, LOGIN.pwd_different, callback)) return;
        callback();
    };

    /**
     * 多个账号时保存选中状态的no
     */
     soloveNo = (no, index) => {
         this.setState({
             no,
             userIndex: index
         });
     }

    //关闭弹框
    handleCancel = () => {
        this.setState({
            visible: false
        });
    }

    //弹框确定
    handleOk = () => {
        const {no} = this.state;
        if (no) {
            this.setState({
                current: 1,
                visible: false
            });
        }
    }

    /**
     * 取消回到登录
     */
    goToLogin = () => {
        if (window.location.hash.includes('login')) {
            this.props.changeForget(false);
        } else {
            appHistory.push('/profile');
        }
    }

    //账户弹窗
    renderModal = () => (
        <div className="forget-modal">
            <Modal
                title="请选择您要找回的账号"
                visible={this.state.visible}
                onOk={this.handleOk}
                centered
                bodyStyle={
                    {
                        height: 'auto',
                        width: '520px'
                    }
                }
                onCancel={this.handleCancel}
            >
                <div className="modal-user">
                    {
                        this.state.user && this.state.user.map((item, index) => (
                            <div onClick={() => this.soloveNo(item.no, index)} key={item.no.toString()} className={this.state.userIndex === index ? 'active-user' : ''}>
                                <Avatar size={60} src={item.avatarUrl}/>
                                <p>UID:{item.no}</p>
                            </div>
                        ))
                    }
                </div>
            </Modal>
        </div>
    );

    //跳回上一步
    cancel = () => {
        this.setState({
            current: 0
        });
    };

    //切换密码显示状态
    checkEyes = (type) => {
        this.setState(prevState => ({
            [type]: !prevState[type]
        }));
    };

    render() {
        const {current, visible, skeleton, show, reShow} = this.state;
        const {getFieldDecorator} = this.props.form;
        return (
            <Row span={24} className="step-container">
                <Skeleton active loading={skeleton}>
                    <Row span={24} className="step" initia={0}>
                        <Steps current={current} labelPlacement="vertical" className="step-info">
                            <Step title="身份验证" className={current >= 0 ? 'ant-steps-item-finished' : ''} icon={<span className="icon icon-user"/>}/>
                            <Step title="重置密码" className={current >= 1 ? 'ant-steps-item-finished' : ''} icon={<span className="icon icon-reset"/>}/>
                            <Step title="完成" className={current === 2 ? 'ant-steps-item-finished' : ''} icon={<span className="icon icon-finished"/>}/>
                        </Steps>
                    </Row>
                </Skeleton>
                <Skeleton active loading={skeleton}>
                    <Row span={24} className="form-info">
                        {
                            current === 0 && (
                                <Form onSubmit={this.handleSubmit} className="login-form">
                                    <Form.Item label="身份证号">
                                        {getFieldDecorator('IdCard', {
                                            rules: [
                                                {required: true, message: LOGIN.no_bind_shop_card},
                                                {validator: this.checkIdCard}
                                            ]
                                        })(
                                            <GeisInput
                                                type="numEn"
                                                placeholder="请输入绑定店铺的身份证号"
                                                maxLength={18}
                                            />
                                        )}
                                    </Form.Item>
                                    <Form.Item label="手机号码">
                                        {getFieldDecorator('phone', {
                                            rules: [
                                                {required: true, message: LOGIN.no_bind_shop_phone},
                                                {validator: this.checkPhone}
                                            ]
                                        })(
                                            <GeisInput
                                                type="num"
                                                placeholder="请输入绑定店铺的手机号码"
                                                maxLength={11}
                                            />
                                        )}
                                    </Form.Item>
                                    <Form.Item label="验证码" className="code">
                                        <Row span={24}>
                                            {getFieldDecorator('code', {
                                                rules: [
                                                    {required: true, message: LOGIN.no_auth_code},
                                                    {pattern: /^\d{4}$/, message: LOGIN.four_auth_code}
                                                ]
                                            })(
                                                <Col span={14}>
                                                    <GeisInput
                                                        type="num"
                                                        placeholder="请输入验证码"
                                                        maxLength={4}
                                                    />
                                                </Col>
                                            )}
                                            <Col span={9} className="get-code">
                                                <GetCode phone={this.state.phone} style={{width: '100px', fontSize: '12px', color: '#666'}} type={1}/>
                                            </Col>
                                        </Row>
                                    </Form.Item>
                                    <Row className="next" span={24}>
                                        <Col/>
                                        <Col className={!(window.location.hash.includes('login')) ? 'large-btn' : 'fogot-btn'}>
                                            {window.location.hash.includes('login') && (<Button onClick={this.goToLogin}>取消</Button>)}
                                            <Button type="primary" loading={this.state.firstStep} onClick={this.handleSubmit} className="red-color">下一步</Button>
                                        </Col>
                                    </Row>
                                </Form>
                            )
                        }
                        {
                            current === 1 && (
                                <Form onSubmit={this.resetPassWord} className="login-form">
                                    <Form.Item>
                                        {getFieldDecorator('password', {
                                            rules: [
                                                {validator: this.checkPsw},
                                                {required: true, message: LOGIN.no_new_password}
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
                                                type="noCn"
                                                maxLength={20}
                                                placeholder="请输入6-20位字符密码"
                                            />
                                        )}
                                    </Form.Item>
                                    <Form.Item className="reminder">请设置6-20位的密码，支持英文数字及特殊符号</Form.Item>
                                    <Form.Item>
                                        {getFieldDecorator('confirm', {
                                            rules: [
                                                {validator: this.comparePassword},
                                                {required: true, message: LOGIN.rewrite_password}
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
                                                type="noCn"
                                                maxLength={20}
                                                placeholder="请确认密码"
                                            />,
                                        )}
                                    </Form.Item>
                                    <Form.Item className="reset-button">
                                        <Button onClick={this.cancel}>取消</Button>
                                        <Button type="primary" lastStatus={this.state.lastStatus} onClick={this.resetPassWord}>下一步</Button>
                                    </Form.Item>
                                </Form>
                            )
                        }
                        {
                            current === 2 && (
                                <div className="success">
                                    <Row span={24} className="success-box">
                                        <div className="icon icon-success"/>
                                        <p>密码修改成功</p>
                                        <span className="time-out">{this.state.timeOut}</span>
                                        <Button type="primary" onClick={this.goToLogin}>{window.location.hash.includes('login') ? '立即登录' : '返回首页'}</Button>
                                    </Row>
                                </div>
                            )
                        }
                        {
                            visible && this.renderModal()
                        }
                    </Row>
                </Skeleton>
            </Row>
        );
    }
}

export default Form.create()(ForgetPass);
