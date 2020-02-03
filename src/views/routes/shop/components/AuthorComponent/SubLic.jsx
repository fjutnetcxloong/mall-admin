import React from 'react';
import {Form, Popover, Input} from 'antd';
import PropTypes from 'prop-types';
import SUpload from '../../../../common/upload/upload';

const {MESSAGE: {FORMVALIDATOR}} = Constants;
export default class SubLic extends React.PureComponent {
    static propTypes = {
        editStatus: PropTypes.bool.isRequired,
        formItemLayout: PropTypes.object.isRequired,
        shopAuthImg: PropTypes.object.isRequired,
        imageUrl: PropTypes.string.isRequired,
        shopAuth: PropTypes.object.isRequired,
        submit: PropTypes.func.isRequired,
        form: PropTypes.object.isRequired
    }

    state = {
        sliExp: {},
        shopAuth: this.props.shopAuth,
        imageUrl: this.props.imageUrl
    }

    // 图片识别回调
    success = (obj) => {
        if (obj.status === 0) {
            if (obj.ix === 2) {
                this.setState({
                    sliExp: obj
                });
            }
        } else if (obj.status === 1) {
            if (obj.ix === 2) {
                this.setState(prevState => {
                    prevState.shopAuth.shop_lic = '';
                    prevState.shopAuth.shop_lic_exp = '';
                    if (prevState.imageUrl) {
                        prevState.imageUrl = '';
                    }
                    return {
                        sliExp: {},
                        shopAuth: prevState.shopAuth,
                        imageUrl: prevState.imageUrl
                    };
                });
            }
        }
    }

    render() {
        const {formItemLayout, editStatus, submit, shopAuthImg} = this.props;
        const {getFieldDecorator} = this.props.form;
        const {sliExp, shopAuth, imageUrl} = this.state;
        return (
            <Form className="license" {...formItemLayout} onSubmit={submit}>
                <Form.Item label="营业执照" className="pictrue">
                    <div className="pic-title" style={{lineHeight: '32px'}}>
                            照片最大2M
                        {
                            editStatus && (
                                <Popover placement="right" title="营业执照" trigger="hover" content={<img src={shopAuthImg && shopAuthImg.mana2} className="look-sample"/>}>
                                    <span className="look-both">查看示例</span>
                                </Popover>
                            )
                        }
                    </div>
                    {
                        getFieldDecorator('pic', {
                        })(
                            <SUpload
                                form={this.props.form}
                                ix={2}
                                init={(imageUrl && imageUrl) || ''}
                                onSuccess={this.success}
                                btnText="营业证件照片"
                                status="pic"
                                visible={editStatus}
                                disabled={!editStatus}
                                messages={FORMVALIDATOR.bussiness_license_null}
                            />
                        )
                    }
                </Form.Item>
                {
                    editStatus && (
                        <Form.Item label="统一社会信用代码：" className="line-height40">
                            {getFieldDecorator('celNum', {
                                initialValue: sliExp.reg_num || shopAuth.shop_lic
                            })(
                                <Input
                                    className="certification-modify-input"
                                    disabled
                                    placeholder="请输入统一社会信用代码"
                                />,
                            )}
                        </Form.Item>
                    )
                }
                {
                    !editStatus && (
                        <Form.Item label="统一社会信用代码：">
                            <p style={{lineHeight: '32px'}}>{shopAuth.shop_lic}</p>
                        </Form.Item>
                    )
                }
                {
                    editStatus && (
                        <Form.Item label="营业执照有效期" wrappercol={{span: 20}} className="line-height40">
                            {
                                getFieldDecorator('bussinessPicker', {
                                    initialValue: sliExp.exp || (shopAuth && shopAuth.shop_lic_exp)
                                })(
                                    <Input
                                        className="certification-modify-input"
                                        disabled
                                        placeholder="营业证有效期"
                                    />,
                                )
                            }
                        </Form.Item>
                    )
                }
                {
                    !editStatus && (
                        <Form.Item label="营业执照有效期" wrappercol={{span: 20}}>
                            <p style={{lineHeight: '32px'}}>{shopAuth.shop_lic_exp}</p>
                        </Form.Item>
                    )
                }
            </Form>
        );
    }
}