/**
 * 开店入口页面
 * 雷疆
 */
import {Button, Form, Layout, Modal, Skeleton} from 'antd';
import {connect} from 'react-redux';
import SelectType from '../components/select-type/SelectType';
import SHeader from '../../../common/login-header/LoginHeader';
import {baseActionCreator} from '../../../../redux/baseAction';
import {myActionCreator} from '../../login/action/index';
import HandleModal from '../../../common/handle-modal/HandleModal';
import ShopDesc from '../components/shop-desc/ShopDesc';
import GeisInput from '../../../common/form/input/GeisInput';
import './ShopPage.less';

const {api} = Configs;
const {MESSAGE: {OPENSHOP, LOGIN}} = Constants;
const {appHistory, validator, getShopInfo, successMsg} = Utils;
const {Header, Footer, Content} = Layout;
const formLayout = {
    labelcol: {span: 6},
    wrappercol: {span: 16}
};


class ShopPage extends BaseComponent {
    state={
        visible: false, //确认推荐人弹框
        showHeader: true, //显示头部个人信息
        value: -1, //单选框选中 店铺类型
        pageStatus: false, //切换显示页面
        figureType: '', //协议隐私传参，
        content: '', //协议内容
        agreeStatus: [false, false, false],
        visible1: false,
        shopIntro: {}, //店铺类型描述
        defaultValue: '',
        loading: false
    }

    componentDidMount() {
        this.getShopInfo();
    }

    //判断有没有开店资格
    getShopInfo = () => {
        const shopInfo = getShopInfo();
        if (shopInfo) {
            // status 11 未达到开店资格
            if (shopInfo.data.status === 11) {
                this.setState({
                    visible: true
                });
                //status: 9 等待审核 6 审核通过
            } else if (shopInfo.data.status === 9 || shopInfo.data.status === 6) {
                appHistory.replace('/profile');
            }
        } else {
            this.setState({
                loading: true
            });
            this.fetch(api.shopInfo).subscribe(res => {
                if (res && res.status === 0) {
                    this.setState({
                        loading: false
                    });
                    if (res.data) {
                        if (res.data.status === 11) {
                            this.setState({
                                visible: true
                            });
                        } else if (res.data.status === 9 || res.data.status === 6) {
                            appHistory.replace('/profile');
                        }
                    }
                }
            });
        }
    }

    //确认完推荐人之后再次获取开店信息
    sureShopInfo = () => {
        this.fetch(api.shopInfo).subscribe(res => {
            const {setShopInfo} = this.props;
            if (res && res.status === 0) {
                setShopInfo(res);
                sessionStorage.setItem('shopInfo', JSON.stringify(res));
            }
        });
    }

    //弹窗取消返回首页
    cancelModal = () => {
        appHistory.replace('/login');
    }

    //选中有无营业执照
    changeSelect = e => {
        this.setState({
            value: e.target.value
        });
    };

    //确认推荐人
    sureReferrer = (e) => {
        e.preventDefault();
        const {validateFields} = this.props.form;
        validateFields({first: true, force: true}, (err, val) => {
            if (!err) {
                this.fetch(api.sureParent, {
                    data: {
                        no: Number(val.uid),
                        type: 0,
                        phone: val.phone
                    }}).subscribe(res => {
                    if (res && res.status === 0) {
                        this.setState({
                            visible: false
                        });
                        successMsg('验证成功', 1, this.sureShopInfo);
                    }
                });
            }
        });
    }

    //uid校验
    checkUID = (rule, value, callback) => {
        if (value && !validator.checkInt(value, 9921)) {
            validator.showMessage(LOGIN.error_uid, callback);
            return;
        }
        callback();
    }

    //校验手机号
    checkPhone = (rule, value, callback) => {
        if (value && !validator.checkPhone(value)) {
            validator.showMessage(LOGIN.error_phone, callback);
        } else {
            this.setState({
                phone: Number(value)
            });
            callback();
        }
    }

    //获取店铺描述信息
    getShopIntro = () => {
        this.fetch(api.shopIntro).subscribe(res => {
            if (res && res.status === 0) {
                this.setState({
                    shopIntro: res.data
                });
            }
        });
    }

    /**
     * 选中开店类型 并且判断是否有推荐人
     * @num 店铺类型
     */
    changePage = (num) => {
        this.setState({
            pageStatus: true,
            value: num
        }, () => {
            this.getShopIntro();
        });
    };

    //打开协议弹框并获取协议内容
    criterion = () => {
        const {getCriterion, criterion} = this.props;
        if (criterion && !criterion.has('shop_content')) {
            getCriterion({type: 5});
        }
        this.setState({
            visible1: true
        });
    }

    //关闭协议弹框
    closeCer = () => {
        this.setState({
            visible1: false
        });
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {criterion} = this.props;
        const {showHeader, pageStatus, visible, visible1, shopIntro, loading} = this.state;
        const query = (
            <div>
                <Button
                    type="primary"
                    onClick={this.closeCer}
                >
                    知道了
                </Button>
            </div>
        );
        const logisticsr = (
            <div className="content-composing">{criterion.get('shop_content')}</div>
        );

        return (
            <Layout className="open-shop">
                <Header>
                    <SHeader
                        visible={showHeader}
                    />
                </Header>
                <Skeleton loading={loading} active paragraph={{rows: 11}}>
                    <Content className="content open-content">
                        {
                            pageStatus
                                ? (
                                    <ShopDesc
                                        shopIntro={shopIntro}
                                        goShopPage={this.goShopPage}
                                        changeSelect={this.changeSelect}
                                        value={this.state.value}
                                        criterion={this.criterion}
                                    />
                                )
                                : (<SelectType changePage={this.changePage}/>)
                        }
                    </Content>
                    <Modal
                        title="身份验证"
                        centered
                        maskClosable={false}
                        visible={visible}
                        onOk={this.sureReferrer}
                        onCancel={this.cancelModal}
                    >
                        <Form className="apply-for-info" onSubmit={this.sureReferrer}>
                            <Form.Item {...formLayout} label="推荐人UID:">
                                {
                                    getFieldDecorator('uid', {
                                        rules: [
                                            {required: true, message: OPENSHOP.no_referrer},
                                            {validator: this.checkUID}
                                        ]
                                    })(
                                        <GeisInput
                                            type="num"
                                            placeholder="请输入推荐人UID"
                                            maxLength={11}
                                        />
                                    )
                                }
                            </Form.Item>
                            <Form.Item {...formLayout} label="推荐人手机号:">
                                {
                                    getFieldDecorator('phone', {
                                        rules: [
                                            {required: true, message: OPENSHOP.no_phone},
                                            {validator: this.checkPhone}
                                        ]
                                    })(
                                        <GeisInput
                                            type="num"
                                            placeholder="请输入推荐人手机号"
                                            maxLength={11}
                                        />
                                    )
                                }
                            </Form.Item>
                        </Form>
                    </Modal>
                    <Footer className="shop-footer">© CAM消费管理 2019 鲁ICP备18044314号-1</Footer>
                </Skeleton>
                {
                    visible1 && (
                        <HandleModal
                            visible={visible1}
                            title="《用户开店协议》"
                            isStyle
                            closable
                            footer={query}
                            content={logisticsr}
                            onCancel={this.closeCer}
                        />
                    )
                }
            </Layout>
        );
    }
}

const mapStateToProps = state => {
    const base = state.get('base');
    return {
        criterion: base.get('criterion')
    };
};

const mapDispatchToProps = {
    setShopInfo: myActionCreator.setShopInfo,
    getCriterion: baseActionCreator.getCriterion
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ShopPage));
