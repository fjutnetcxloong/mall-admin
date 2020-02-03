/**
 * 开店个人基本信息
 * 雷疆
 */

import {Form, Input} from 'antd';
import SUpload from '../../../../common/upload/upload';
import './PeopleInfo.less';

const {MESSAGE: {FORMVALIDATOR}} = Constants;
const formItemLayout = {
    labelCol: {span: 4},
    wrapperCol: {span: 10}
};

class PeopleInfo extends BaseComponent {
    state={
        loading: false,
        shopData: {}, //父组件传入的回传数据
        userInfo: {}, //身份证读取的身份信息
        exp: {} //身份证有效期
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.shopData !== this.props.shopData) {
            this.setState({
                shopData: nextProps.shopData
            });
        }
    }

    // 提交表单 返回Promise状态
    submit = () => {
        const {validateFieldsAndScroll} = this.props.form;
        return new Promise((resoloved) => {
            validateFieldsAndScroll({first: true, force: true, scroll: {offsetTop: 100}}, (err, val) => {
                if (!err) {
                    resoloved(val);
                }
            });
        });
    }

    /**
     * 上传图片回调,修改图片必填状态
     */
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
                    prevState.shopData.mastar_name = '';
                    prevState.shopData.idcard = '';
                    if (prevState.shopData.pics) {
                        prevState.shopData.pics[0] = '';
                    }
                    return {
                        userInfo: {},
                        shopData: prevState.shopData
                    };
                });
            } else if (obj.ix === 1) {
                this.setState(prevState => {
                    prevState.shopData.idcard_exp = '';
                    if (prevState.shopData.pics) {
                        prevState.shopData.pics[1] = '';
                    }
                    return {
                        exp: {},
                        shopData: prevState.shopData
                    };
                });
            } else if (obj.ix === 4) {
                this.setState(prevState => {
                    if (prevState.shopData.pics) {
                        prevState.shopData.pics[4] = '';
                    }
                    return {
                        shopData: prevState.shopData
                    };
                });
            }
        }
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {userInfo, exp, shopData} = this.state;
        return (
            <Form className="login-form" {...formItemLayout} hideRequiredMark>
                <Form.Item label="身份证照:" wrapperCol={{span: 18}} className="avatar-box">
                    <Form.Item wrapperCol={{span: 5}}>
                        {getFieldDecorator('front', {
                        })(
                            <SUpload
                                form={this.props.form}
                                ix={0}
                                show
                                init={(shopData.pics && shopData.pics[0]) || ''}
                                onSuccess={this.success}
                                btnText="上传身份证正面照"
                                status="front"
                                messages={FORMVALIDATOR.shopkeeper_front_photo_null}
                            />
                        )}
                    </Form.Item>
                    <Form.Item wrapperCol={{span: 5}}>
                        {getFieldDecorator('back', {
                        })(
                            <SUpload
                                form={this.props.form}
                                ix={1}
                                show
                                onSuccess={this.success}
                                init={(shopData.pics && shopData.pics[1]) || ''}
                                btnText="上传身份证背面照"
                                status="back"
                                messages={FORMVALIDATOR.shopkeeper_back_photo_null}
                            />
                        )}
                    </Form.Item>
                    <Form.Item wrapperCol={{span: 5}}>
                        {getFieldDecorator('bind', {
                        })(
                            <SUpload
                                form={this.props.form}
                                ix={4}
                                show
                                init={(shopData.pics && shopData.pics[4]) || ''}
                                btnText="上传手持身份证照"
                                status="bind"
                                messages={FORMVALIDATOR.shopkeeper_handled_photo_null}
                            />
                        )}
                    </Form.Item>
                </Form.Item>
                <Form.Item label="姓名">
                    {getFieldDecorator('username', {
                        initialValue: userInfo.name || shopData.mastar_name
                    })(
                        <Input
                            placeholder="请输入姓名"
                            disabled
                            maxLength={10}
                        />,
                    )}
                </Form.Item>
                <Form.Item label="身份证号">
                    {getFieldDecorator('idCard', {
                        initialValue: userInfo.id_num || shopData.idcard
                    })(
                        <Input
                            placeholder="请输入身份证号码"
                            disabled
                            onChange={this.onChange}
                            maxLength={18}
                        />,
                    )}
                </Form.Item>
                <Form.Item label="身份证有效期">
                    {getFieldDecorator('cardPicker', {
                        initialValue: exp.exp || (shopData && shopData.idcard_exp)
                    })(
                        <Input
                            placeholder="身份证有效期"
                            disabled
                            maxLength={18}
                        />,

                    )}
                </Form.Item>
            </Form>
        );
    }
}
export default Form.create()(PeopleInfo);
