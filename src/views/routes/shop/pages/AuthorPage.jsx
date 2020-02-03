/**
 * 个体工商户认证 网店认证 个人店认证
 * 雷疆
 */
import React from 'react';
import '../index.less';
import './AuthorPage.less';
import {Row, Form, Button, Col, Skeleton, message} from 'antd';

import ErrPage from '../../../common/default-page/NoRoot';

// import FootBtn from '../../../common/bottom-button/BottomButton';
import Modal from '../../../common/handle-modal/HandleModal';
import ShopCertification from '../components/AuthorComponent/ShopAuthor';
import SubShop from '../components/AuthorComponent/SubShop';
import SubLic from '../components/AuthorComponent/SubLic';
import SubPicture from '../components/AuthorComponent/SubPicture';

const formItemLayout = {
    labelcol: {span: 6},
    wrappercol: {span: 10}
};
const {api} = Configs;
const {MESSAGE: {SHOPINFO}} = Constants;

class Certification extends BaseComponent {
    state = {
        skeleton: true, //内容骨架
        shopAuth: {}, //认证信息
        imageUrl: {}, //图片
        editStatus: false, // 内容编辑状态
        cerStatus: false, // 切换认证状态
        visible: false, //认证信息保存时弹框显示状态
        shopAuthImg: {}, //店铺认证示例图片
        errPage: false, //权限状态
        openButton: false,
        userInfo: {}, //身份证读取信息
        exp: {}, //身份证有效期
        sliExp: {} //营业执照有效期
    };

    // 关闭modal框并且修改信息的可编辑状态
    hideModal = () => {
        this.setState({
            visible: false,
            editStatus: false
        });
    };

    componentDidMount() {
        this.getShopAuth();
    }

    //修改编辑状态
    changeEdit = () => {
        this.setState({
            editStatus: true,
            openButton: true
        });
    };

    //取消内容的编辑状态
    cancelEdit = () => {
        this.setState({
            editStatus: false,
            openButton: false
        });
    };

    //认证切换
    chengeCel = (bool) => {
        this.setState({
            cerStatus: bool
        });
    };

    //获取店铺认证信息
    getShopAuth = () => {
        this.fetch(api.getShopAuth).subscribe(res => {
            if (res && res.status === 0) {
                if (res.data.status === 1) {
                    this.setState({
                        errPage: true,
                        skeleton: false
                    });
                } else {
                    this.setState({
                        shopAuth: res.data,
                        imageUrl: {
                            front: res.data.idcard_front,
                            back: res.data.idcard_back,
                            bind: res.data.hand_photo,
                            env: res.data.indoor,
                            booth: res.data.logo,
                            goods: res.data.pr_img,
                            pic: res.data.lic_img
                        },
                        shopAuthImg: {
                            mana1: res.data.mana1,
                            mana2: res.data.mana2,
                            mana3: res.data.mana3,
                            mana4: res.data.mana4,
                            mana5: res.data.mana5
                        },
                        skeleton: false
                    });
                }
            } else {
                this.setState({
                    skeleton: false
                });
            }
        });
    };

    // 保存修改后的信息成功后弹出modal框
    submit = () => {
        const {validateFields} = this.props.form;
        validateFields({first: true, force: true}, (err, val) => {
            if (!err) {
                console.log(val.celNum, val.bussinessPicker);
                if (!val.celNum || !val.bussinessPicker) {
                    message.warning('请上传营业执照!');
                    return;
                }
                this.fetch(api.shopSetting, {
                    data: {
                        linkName: val.username,
                        idcard: val.idCard,
                        idcard_exp: val.rangePicker,
                        shop_lic: val.celNum,
                        shop_lic_exp: val.bussinessPicker
                    }}).subscribe(res => {
                    if (res && res.status === 0) {
                        this.setState({
                            visible: true
                        });
                    }
                });
            }
        });
    };

    render() {
        const {imageUrl, shopAuth, editStatus, cerStatus, skeleton, shopAuthImg, errPage} = this.state;
        return (
            <div className="shop-setting">
                <React.Fragment>
                    {
                        !errPage ? (
                            <Row className="page certification-container">
                                <Skeleton active loading={skeleton}>
                                    {
                                        !cerStatus
                                        && (
                                            <Row className="login-form author-box" {...formItemLayout}>
                                                <Row>
                                                    <Col span={6}>
                                                        <div className="title"><span className="title-num-order">1.</span>开店人基本信息</div>
                                                    </Col>
                                                    <Col span={18} style={{paddingTop: '60px'}} className="people-info">
                                                        <SubShop
                                                            imageUrl={imageUrl}
                                                            submit={this.submit}
                                                            formItemLayout={formItemLayout}
                                                            editStatus={editStatus}
                                                            shopAuth={shopAuth}
                                                            form={this.props.form}
                                                            // success={this.success}
                                                        />
                                                    </Col>
                                                </Row>
                                                <div className="gray-line"/>
                                                {
                                                    shopAuth.cer_type === '1' && (
                                                        <Row>
                                                            <Col span={6}>
                                                                <div className="title"><span className="title-num-order">2.</span>个体工商户营业信息</div>
                                                            </Col>
                                                            <Col span={18} style={{paddingTop: '60px'}}>
                                                                <SubLic
                                                                    imageUrl={imageUrl.pic}
                                                                    submit={this.submit}
                                                                    formItemLayout={formItemLayout}
                                                                    editStatus={editStatus}
                                                                    shopAuth={shopAuth}
                                                                    shopAuthImg={shopAuthImg}
                                                                    form={this.props.form}
                                                                    // success={this.success}
                                                                />
                                                            </Col>
                                                        </Row>
                                                    )
                                                }
                                                <div style={{display: shopAuth.cer_type === '1' ? 'block' : 'none'}} className="gray-line"/>
                                                <Row>
                                                    <Col span={6}><div className="title"><span className="title-num-order">{shopAuth.cer_type === '1' ? 3 : 2}.</span>个体工商户证明材料</div></Col>
                                                    <Col span={18} style={{paddingTop: '60px'}}>
                                                        <SubPicture
                                                            imageUrl={imageUrl}
                                                            formItemLayout={formItemLayout}
                                                            editStatus={editStatus}
                                                            type={shopAuth.cer_type}
                                                            shopAuthImg={shopAuthImg}
                                                            form={this.props.form}
                                                        />
                                                    </Col>
                                                </Row>
                                                <div style={{display: shopAuth.cer_type === '1' ? 'none' : 'block'}} className="gray-line"/>
                                                {/* {
                                                    shopAuth.cer_type === '1' && (
                                                        <Row className="edit-btn-box">
                                                            {
                                                                !editStatus && (
                                                                    <Button type="primary" className="edit-btn" onClick={this.changeEdit}>申请修改</Button>
                                                                )
                                                            }
                                                            {
                                                                editStatus && (
                                                                    <FootBtn saveTemplate={this.submit} cancelTemplate={this.cancelEdit}/>
                                                                )
                                                            }
                                                        </Row>

                                                    )
                                                } */}
                                                {/* {
                                                    (shopAuth.cer_type === '0' || shopAuth.cer_type === '2') && (
                                                        <Row className="cer-message">
                                                            <Col span={6}>
                                                                <div className="title"><span className="title-num-order">3.</span>个体工商户营业信息</div>
                                                            </Col>
                                                            <Col span={18}>
                                                                <div className="desc"><span>未认证</span>(需提供经营者姓名和入住人一致的个体工商户营业信息)</div>
                                                                {
                                                                    this.state.openButton ? (
                                                                        <FootBtn saveTemplate={this.submit} cancelTemplate={this.cancelEdit}/>
                                                                    ) : (
                                                                        <div className="cer-box">
                                                                            <Button className="edit-btn" onClick={this.changeEdit}>申请修改</Button>
                                                                            <Button type="primary" onClick={() => this.chengeCel(true)}>认证个体商户</Button>
                                                                        </div>
                                                                    )
                                                                }
                                                            </Col>
                                                        </Row>
                                                    )
                                                } */}
                                            </Row>
                                        )
                                    }
                                </Skeleton>
                                <Skeleton active loading={skeleton}>
                                    {
                                        cerStatus && (
                                            <ShopCertification
                                                parent={this}
                                                shopAuth={{idCard: shopAuth.idcard, idCardExp: shopAuth.idcard_exp}}
                                                shopAuthImg={shopAuthImg}
                                                chengeCel={this.chengeCel}
                                            />
                                        )
                                    }
                                </Skeleton>
                                <Skeleton active loading={skeleton}>
                                    <Modal
                                        visible={this.state.visible}
                                        title={SHOPINFO.verification_title}
                                        content={(
                                            <div>
                                                <p>{SHOPINFO.verification}</p>
                                            </div>
                                        )}
                                        footer={<Button type="primary" onClick={this.hideModal}>确定</Button>}
                                        onCancel={this.hideModal}
                                    />
                                </Skeleton>
                            </Row>
                        ) : (<ErrPage/>)
                    }
                </React.Fragment>
            </div>
        );
    }
}

export default Form.create()(Certification);
