/**
 * 开店主页面
 * 雷疆
 */

import {Steps, Row, Col, Form, Layout, Button, Modal, Typography} from 'antd';
import BindCard from '../components/bind-card/BindCard';
import Success from '../components/success/Success';
import ShopInfo from '../components/shop-info/ShopInfo';
import PeopleInfo from '../components/people-info/PeopleInfo';
import BusinessInfo from '../components/business-info/BusinessInfo';
import Individual from '../components/individual-info/IndividualInfo';
import LoginHeader from '../../../common/login-header/LoginHeader';
import './StorePage.less';

const {Step} = Steps;
const {Text} = Typography;
const {api} = Configs;
const {Header, Content} = Layout;
const formLayout = {
    labelcol: {span: 8},
    wrappercol: {span: 16}
};
const {MESSAGE: {FORMVALIDATOR}} = Constants;
const {systemApi: {getValue}, validator, getUrlParam} = Utils;

class ShopPage extends BaseComponent {
    state = {
        status: 'info', //页面显示状态
        shopTitle: '', //label显示内容
        type: getUrlParam('type', this.props.location.search) || -1, //商户类型
        formData: {}, //表单数据
        stepStatus: 0, //步骤条状态
        showHeader: true, //展示头部右边内容
        visible: false, //底部弹框显示状态
        shopData: {}, //回传数据
        bankInfo: {}, //银行卡回传数据
        footStatus: false, //底部提示语显示状态
        province: [],
        qrcode: ''
    }

    componentDidMount() {
        //根据url参数修改显示页面
        if (window.location.href.includes('status')) {
            this.setState({
                status: getUrlParam('status', this.props.location.search)
            });
        }
        //根据type状态修改左侧label内容
        const type = getUrlParam('type', this.props.location.search);
        const nameAll = new Map([
            ['0', '个人商家营业信息'],
            ['1', '个体工商户营业信息'],
            ['2', '网店营业信息']
        ]);
        this.setState({
            shopTitle: nameAll.get(type) || '',
            type
        });
        this.getShopInfo();
        this.getBankInfo();
        this.getQrCode();
    }

    /**
     * 获取银行卡回传数据
     */
    getBankInfo = () => {
        this.fetch(api.getBankInfo).subscribe(res => {
            this.setState({
                bankInfo: res.data
            });
        });
    }

    // 底部modal关闭
    handleCancel = e => {
        this.setState({
            visible: false
        });
    };

    // 获取开店h回传数据
    getShopInfo = () => {
        this.fetch(api.getShopData)
            .subscribe(res => {
                if (res && res.status === 0) {
                    this.setState({
                        shopData: res.data
                    });
                }
            });
    }

    /**
     * 点击下一步同步子组件数据
     * 根据type判断传入那些数据
     */
    nexStep = async () => {
        const {type} = this.state;
        const users = JSON.parse(getValue('users'));
        const res1 = await this.ShopInfoRef.submit();
        const res2 = await this.onPeopleSubmit.submit();
        const res3 = (type === '1' ? await this.onIndividualSubmit.submit() : {});
        const res4 = await this.onBusinessFn.submit();
        const formData = {...res1, ...res2, ...res3, ...res4};
        this.setState({
            formData,
            user: users,
            dataInfo: formData,
            visible: true
        });
    }

    /**
     * 表单数据提交
     * 调用接口上传开店信息
     * 并且开启modal弹框显示当前开店信息
     */
    shopApply = () => {
        const {formData, type} = this.state;
        this.fetch(api.shopApply, {
            data: {
                shopName: formData.shopName,
                discount: formData.discount,
                address: formData.address,
                linkName: formData.boss,
                csh_phone: formData.service,
                phone: formData.phone,
                pca: [formData.province, formData.city, formData.county],
                cate1_id: formData.kind ? formData.kind.id1 : '',
                cate1: formData.kind ? formData.kind.cate_name : '',
                shop_type: type,
                is_exp: formData.checked.toString(),
                mastar_name: formData.username,
                idcard: formData.idCard,
                idcard_exp: formData.cardPicker,
                close_time: formData.closeTimes,
                open_time: formData.openTimes,
                pick_up_self: formData.sure,
                shop_lic: formData.credit,
                save: 0,
                shop_lic_exp: formData.businessPicker
            }}).subscribe(res => {
            if (res && res.status === 0) {
                this.setState({
                    status: 'bind',
                    stepStatus: 1,
                    visible: false
                });
            }
        });
    }

    //修改底部提示语显示状态
    changeFoot = (status) => {
        this.setState({
            footStatus: status
        });
    }

    //校验预留手机号
    checkPhone = (rule, value, callback) => {
        if (value && !validator.checkPhone(Number(value))) {
            validator.showMessage(FORMVALIDATOR.customer_service_phone_err, callback);
        }
        callback();
    };

    getQrCode = () => {
        this.fetch(api.getVcode).subscribe(res => {
            if (res && res.status === 0) {
                this.setState({
                    qrcode: res.data.qrcode
                });
            }
        });
    }

    render() {
        const {status, shopTitle, qrcode, type, stepStatus, shopData, visible, dataInfo, user, bankInfo, footStatus} = this.state;
        return (
            <Layout className="shop-page">
                <Header style={{height: '80px'}}>
                    <LoginHeader
                        visible={this.state.showHeader}
                    />
                </Header>
                <Content>
                    <Row className="info-page">
                        <Row className="step" span={24}>
                            <Steps current={stepStatus}>
                                <Step title="基本信息"/>
                                <Step title="绑定银行卡"/>
                                <Step title="绑定微信"/>
                            </Steps>
                        </Row>
                        {
                            status === 'info' && (
                                <Row span={24} className="shop-page-content">
                                    <Row span={24} className="form-container">
                                        <Col span={5}>
                                            <div className="title">店铺信息</div>
                                        </Col>
                                        <Col span={19} className="form-right">
                                            <ShopInfo
                                                wrappedComponentRef={form => { this.ShopInfoRef = form }}
                                                shopData={shopData}
                                                type={type}
                                                checkPhone={this.checkPhone}
                                            />
                                        </Col>
                                    </Row>
                                    <Row span={24} className="form-container">
                                        <Col span={5}>
                                            <div className="title">开店个人基本信息</div>
                                        </Col>
                                        <Col span={19} className="form-right">
                                            <PeopleInfo wrappedComponentRef={form => { this.onPeopleSubmit = form }} shopData={shopData}/>
                                        </Col>
                                    </Row>
                                    {
                                        type && type === '1' && (
                                            <div className="individual-materials">
                                                <div className="individual-title">
                                                    <span>个体工商户证明材料</span>
                                                    <span>（需提供经营者姓名和入驻人一致的个体工商户证明材料）</span>
                                                </div>
                                                <Row span={24} className="form-container">
                                                    <Col span={5}/>
                                                    <Col
                                                        span={19}
                                                        className="form-right"
                                                    >
                                                        <Individual
                                                            wrappedComponentRef={form => { this.onIndividualSubmit = form }}
                                                            shopData={shopData}
                                                        />
                                                    </Col>
                                                </Row>
                                            </div>
                                        )
                                    }
                                    <div className="individual-materials">
                                        <div className="individual-title">
                                            <span>{shopTitle}</span>
                                        </div>
                                        <Row span={24} className="last form-container">
                                            <Col span={5}/>
                                            <Col span={19} className="form-right">
                                                <BusinessInfo wrappedComponentRef={form => { this.onBusinessFn = form }} shopData={shopData} type={type} changeFoot={this.changeFoot}/>
                                            </Col>
                                        </Row>
                                    </div>
                                    <Row className="shop-page-footer">
                                        {
                                            footStatus && (
                                                <p className="foot-desc">{shopData.rule_tip}</p>
                                            )
                                        }
                                        <Row className="btn-box" span={24}>
                                            <Button type="default" disabled>上一步</Button>
                                            <Button type="primary" onClick={this.nexStep}>下一步</Button>
                                        </Row>
                                    </Row>
                                </Row>
                            )
                        }
                        {
                            status === 'bind' && (
                                <BindCard
                                    parent={this}
                                    type={type}
                                    bankInfo={bankInfo}
                                    getShopInfo={this.getShopInfo}
                                    checkPhone={this.checkPhone}
                                />
                            )
                        }
                        {
                            status === 'success' && (
                                <Success
                                    qrcode={qrcode}
                                />
                            )
                        }
                    </Row>
                    {
                        visible && (
                            <Modal
                                title="实名认证成功"
                                visible={visible}
                                onOk={this.shopApply}
                                onCancel={this.handleCancel}
                                className="bottom-modal"
                            >
                                <Form className="apply-for-info apply-for-infomation" {...formLayout}>
                                    <Form.Item label="店铺类型">
                                        <Text>{dataInfo.checked === 1 ? '正式商家' : '体验商家'}</Text>
                                    </Form.Item>
                                    <Form.Item label="店铺名称">
                                        <Text>{dataInfo.shopName}<span style={{color: '#ff2551', fontSize: '12px'}}>（审核通过后暂不可修改）</span></Text>
                                    </Form.Item>
                                    <Form.Item label="UID">
                                        <Text>{user.no}</Text>
                                    </Form.Item>
                                    <Form.Item label="主营类目">
                                        <Text>{dataInfo.kind ? dataInfo.kind.cate_name : ''}</Text>
                                    </Form.Item>
                                    <Form.Item label="入驻人姓名">
                                        <Text>{dataInfo.username}</Text>
                                    </Form.Item>
                                    <Form.Item label="入驻人手机号">
                                        <Text>{dataInfo.phone}</Text>
                                    </Form.Item>
                                    <Form.Item className="modal-text">
                                        <Text className="icon">请仔细确认以上信息，确认无误后再提交</Text>
                                    </Form.Item>
                                </Form>
                            </Modal>
                        )
                    }
                </Content>
            </Layout>
        );
    }
}

export default Form.create()(ShopPage);
