/**
 * 个人店和网店认证个体工商户
 * 雷疆
 * 待优化
 */
import {Form, Input, Divider, Row, Col, Popover} from 'antd';
import SUpload from '../../../../common/upload/upload';
import FootBtn from '../../../../common/bottom-button/BottomButton';
import './ShopAuthor.less';

const {api} = Configs;
const {showInfo} = Utils;
const {MESSAGE: {FORMVALIDATOR, SHOPINFO}} = Constants;

const formItemLayout = {
    labelCol: {span: 5},
    wrapperCol: {span: 10}
};
class ShopCertification extends BaseComponent {
        state={
            sliExp: {} //营业执照
        }

    // 提交认证信息
    submit = () => {
        const {validateFields} = this.props.form;
        const {shopAuth, chengeCel} = this.props;
        validateFields({first: true, force: true}, (err, val) => {
            if (!err) {
                this.fetch(api.shopAuth, {method: 'post',
                    data: {
                        shop_lic: val.businessPicker,
                        shop_lic_exp: val.cardNum,
                        idcard: shopAuth && shopAuth.idCard,
                        idcard_exp: shopAuth && shopAuth.idCardExp
                    }}).subscribe(res => {
                    if (res && res.status === 0) {
                        showInfo(SHOPINFO.submit_success, 1, chengeCel(false));
                    }
                });
            }
        });
    }

    //取消认证并切换回店铺认证页面
    changeCel = () => {
        this.props.parent.setState({
            cerStatus: false
        });
    }

    // 图片上传回调
    success = (obj) => {
        if (obj.status === 0) {
            if (obj.ix === 2) {
                this.setState({
                    sliExp: obj
                });
            }
        } else if (obj.status === 1) {
            if (obj.ix === 2) {
                this.setState({
                    sliExp: {}
                });
            }
        }
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {sliExp} = this.state;
        const {shopAuthImg} = this.props;
        return (
            <Row className="shop-certification">
                <Row>
                    <Col span={6}>
                        <div className="title">个体工商户营业信息</div>
                    </Col>
                    <Col span={18} style={{paddingTop: '60px'}}>
                        <Form {...formItemLayout} className="single" onSubmit={this.submit}>
                            <Form.Item label="营业执照" className="pictrue">
                                <div className="pic-title">
                                    照片最大2M
                                    <Popover placement="right" title="营业执照" trigger="hover" content={<img src={shopAuthImg && shopAuthImg.mana5} className="pop-img"/>}>
                                        <span className="look-both">查看示例</span>
                                    </Popover>
                                </div>
                                {
                                    getFieldDecorator('cerPic', {
                                    })(
                                        <SUpload
                                            form={this.props.form}
                                            ix={2}
                                            onSuccess={this.success}
                                            btnText="上传营业执照"
                                            status="cerPic"
                                            messages={FORMVALIDATOR.bussiness_license_null}
                                        />
                                    )
                                }
                            </Form.Item>
                            <Form.Item label="统一社会信用代码：" wrapperCol={{span: 10}}>
                                {getFieldDecorator('cardNum', {
                                    initialValue: sliExp.exp || undefined
                                })(
                                    <Input
                                        maxLength={18}
                                        disabled
                                        placeholder="请输入统一社会信用代码"
                                    />,
                                )}
                            </Form.Item>
                            <Form.Item label="营业执照有效期" wrapperCol={{span: 10}} className="how-time">
                                {getFieldDecorator('businessPicker', {
                                    initialValue: sliExp.reg_num || undefined
                                })(
                                    <Input
                                        maxLength={18}
                                        disabled
                                        placeholder="营业执照有效期"
                                    />,
                                )}
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
                <Divider/>
                <Row>
                    <Col span={6}>
                        <div className="title">个体工商户证明材料</div>
                    </Col>
                    <Col span={18} style={{paddingTop: '60px'}}>
                        <Form {...formItemLayout} onSubmit={this.submit}>
                            <Form.Item label="商户门头照：" className="pictrue">
                                <div className="pic-title">
                                    照片最大2M
                                    <Popover placement="right" title="商户门头照：" trigger="hover" content={<img src={shopAuthImg && shopAuthImg.mana1} className="pop-img"/>}>
                                        <span className="look-both">查看示例</span>
                                    </Popover>
                                </div>
                                {
                                    getFieldDecorator('picture', {
                                    })(
                                        <SUpload
                                            form={this.props.form}
                                            ix={3}
                                            btnText="上传门头照"
                                            status="picture"
                                            messages={FORMVALIDATOR.shopkeeper_booth_photo_null}
                                        />
                                    )
                                }
                            </Form.Item>
                            <Form.Item label="商家店内照：" className="pictrue">
                                <div className="pic-title">
                                    照片最大2M
                                    <Popover placement="right" title="营业执照" trigger="hover" content={<img src={shopAuthImg && shopAuthImg.mana2} className="pop-img"/>}>
                                        <span className="look-both">查看示例</span>
                                    </Popover>
                                </div>
                                {
                                    getFieldDecorator('environment', {
                                    })(
                                        <SUpload
                                            form={this.props.form}
                                            ix={5}
                                            btnText="上传室内照"
                                            status="environment"
                                            messages={FORMVALIDATOR.shopkeeper_booth_photo_null}
                                        />
                                    )
                                }
                            </Form.Item>
                            {/* <Form.Item label="商品照:" className="pictrue">
                                <div className="pic-title">
                                    照片最大2M
                                    <Popover placement="right" title="营业执照" trigger="hover" content={<img src={shopAuthImg && shopAuthImg.mana3}/>}>
                                        <span className="look-both">查看示例</span>
                                    </Popover>
                                </div>
                                {
                                    getFieldDecorator('goods', {
                                    })(
                                        <SUpload
                                            form={this.props.form}
                                            ix={7}
                                            btnText="上传商品照"
                                            status="goods"
                                            messages={FORMVALIDATOR.no_product_picture}
                                        />
                                    )
                                }
                            </Form.Item> */}
                        </Form>
                    </Col>
                </Row>
                <Row>
                    <FootBtn saveTemplate={this.submit} cancelTemplate={this.changeCel}/>
                </Row>
            </Row>
        );
    }
}
export default Form.create()(ShopCertification);
