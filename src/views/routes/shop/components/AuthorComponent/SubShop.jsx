import React from 'react';
import {Form, Input} from 'antd';
import PropTypes from 'prop-types';
import SUpload from '../../../../common/upload/upload';

const {MESSAGE: {FORMVALIDATOR}} = Constants;
class SubShop extends React.PureComponent {
    static propTypes = {
        imageUrl: PropTypes.object.isRequired,
        editStatus: PropTypes.bool.isRequired,
        form: PropTypes.object.isRequired,
        shopAuth: PropTypes.object.isRequired,
        submit: PropTypes.func.isRequired,
        formItemLayout: PropTypes.object.isRequired
    }

    state = {
        userInfo: {},
        exp: {},
        shopAuth: this.props.shopAuth,
        imageUrl: this.props.imageUrl
    }

    success = (obj) => {
        if (obj.status === 0) {
            if (obj.ix === 0) {
                this.setState({
                    userInfo: obj
                });
            } else if (obj.ix === 1) {
                this.setState({
                    exp: obj
                });
            }
        } else if (obj.status === 1) {
            if (obj.ix === 0) {
                this.setState(prevState => {
                    prevState.shopAuth.linkName = '';
                    prevState.shopAuth.idcard = '';
                    if (prevState.imageUrl.front) {
                        prevState.imageUrl.front = '';
                    }
                    return {
                        userInfo: {},
                        shopAuth: prevState.shopAuth,
                        imageUrl: prevState.imageUrl
                    };
                });
            } else if (obj.ix === 1) {
                this.setState(prevState => {
                    prevState.shopAuth.idcard_exp = '';
                    if (prevState.imageUrl.back) {
                        prevState.imageUrl.back = '';
                    }
                    return {
                        exp: {},
                        shopAuth: prevState.shopAuth,
                        imageUrl: prevState.imageUrl
                    };
                });
            }
        }
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {editStatus} = this.props;
        const {userInfo, exp, shopAuth, imageUrl} = this.state;
        return (
            <Form className="information" {...this.props.formItemLayout} onSubmit={this.props.submit}>
                <Form.Item label="身份证照:" wrappercol={{span: 18}} className="avatar-box">
                    <Form.Item wrappercol={{span: 5}}>
                        {getFieldDecorator('front', {
                        })(
                            <SUpload
                                form={this.props.form}
                                ix={0}
                                init={(imageUrl && imageUrl.front) || ''}
                                onSuccess={this.success}
                                btnText="上传身份证正面照"
                                status="front"
                                visible={editStatus}
                                disabled={!editStatus}
                                messages={FORMVALIDATOR.shopkeeper_front_photo_null}
                            />
                        )}
                    </Form.Item>
                    <Form.Item wrappercol={{span: 5}}>
                        {getFieldDecorator('back', {
                        })(
                            <SUpload
                                form={this.props.form}
                                ix={1}
                                init={(imageUrl && imageUrl.back) || ''}
                                onSuccess={this.success}
                                btnText="上传身份证背面照"
                                status="back"
                                visible={editStatus}
                                disabled={!editStatus}
                                messages={FORMVALIDATOR.shopkeeper_back_photo_null}
                            />
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('bind', {
                        })(
                            <SUpload
                                form={this.props.form}
                                ix={4}
                                init={(imageUrl && imageUrl.bind) || ''}
                                btnText="上传手持身份证照"
                                status="bind"
                                visible={editStatus}
                                disabled={!editStatus}
                                messages={FORMVALIDATOR.shopkeeper_handled_photo_null}
                            />
                        )}
                    </Form.Item>
                </Form.Item>
                {
                    editStatus &&  (
                        <Form.Item label="姓名">
                            {getFieldDecorator('username', {
                                initialValue: userInfo.name || shopAuth.linkName
                            })(
                                <Input
                                    className="certification-modify-input"
                                    disabled
                                    placeholder="姓名"
                                />,
                            )}
                        </Form.Item>
                    )
                }
                {
                    !editStatus && (
                        <Form.Item className="line-32" label="姓名">
                            <p>{shopAuth.linkName}</p>
                        </Form.Item>
                    )
                }
                {
                    editStatus && (
                        <Form.Item label="身份证号">
                            {getFieldDecorator('idCard', {
                                initialValue: userInfo.id_num || shopAuth.idcard
                            })(
                                <Input
                                    className="certification-modify-input"
                                    disabled
                                    placeholder="身份证号"
                                />,
                            )}
                        </Form.Item>
                    )
                }
                {
                    !editStatus && (
                        <Form.Item className="line-32" label="身份证号">
                            <p>{shopAuth.idcard}</p>
                        </Form.Item>
                    )
                }
                {
                    editStatus && (
                        <Form.Item label="身份证有效期" className="period" wrappercol={{span: 20}}>
                            {getFieldDecorator('rangePicker', {
                                initialValue: exp.exp || shopAuth.idcard_exp
                            })(
                                <Input
                                    className="certification-modify-input"
                                    disabled
                                    placeholder="身份证有效期"
                                />,
                            )}
                        </Form.Item>
                    )
                }
                {
                    !editStatus && (
                        <Form.Item label="身份证有效期" className="period" wrappercol={{span: 20}}>
                            <p style={{lineHeight: '32px'}}>{shopAuth.idcard_exp}</p>
                        </Form.Item>
                    )
                }
            </Form>
        );
    }
}

export default SubShop;