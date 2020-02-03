import {Form, Popover} from 'antd';
import PropTypes from 'prop-types';
import SUpload from '../../../../common/upload/upload';

const {MESSAGE: {FORMVALIDATOR}} = Constants;

export default class SubPicture extends React.PureComponent {
    static propTypes = {
        editStatus: PropTypes.bool.isRequired,
        formItemLayout: PropTypes.object.isRequired,
        shopAuthImg: PropTypes.object.isRequired,
        imageUrl: PropTypes.object.isRequired,
        type: PropTypes.string,
        form: PropTypes.object.isRequired
    }

    static defaultProps = {
        type: ''
    }

    state = {
        imageUrl: this.props.imageUrl,
        type: this.props.type
    }

    render() {
        const {formItemLayout, editStatus, shopAuthImg} = this.props;
        const {getFieldDecorator} = this.props.form;
        const {imageUrl, type} = this.state;
        return (
            <Form className="evidentiary-material" {...formItemLayout}>
                <Form.Item label="商户门头照:" className="pictrue">
                    <div className="pic-title" style={{lineHeight: '32px'}}>
                            照片最大2M
                        {
                            editStatus && (
                                <Popover placement="right" title="商户门头照：" trigger="hover" content={<img src={shopAuthImg && shopAuthImg.mana1} className="look-sample"/>}>
                                    <span className="look-both">查看示例</span>
                                </Popover>
                            )}
                    </div>
                    {
                        getFieldDecorator('booth', {
                        })(
                            <SUpload
                                form={this.props.form}
                                ix={3}
                                init={(imageUrl && imageUrl.booth) || ''}
                                btnText="营业证件照片"
                                status="booth"
                                visible={editStatus}
                                disabled={!editStatus}
                                messages={FORMVALIDATOR.shopkeeper_booth_photo_null}
                            />
                        )
                    }
                </Form.Item>
                <Form.Item label="商家店内照:" className="pictrue picture2">
                    <div className="pic-title" style={{lineHeight: '32px'}}>
                            照片最大2M
                        {
                            editStatus && (
                                <Popover placement="right" title="营业执照" trigger="hover" content={<img src={shopAuthImg && shopAuthImg.mana2} className="business-license"/>}>
                                    <span className="look-both">查看示例</span>
                                </Popover>
                            )
                        }
                    </div>
                    {
                        getFieldDecorator('environment', {
                        })(
                            <SUpload
                                form={this.props.form}
                                ix={5}
                                init={(imageUrl && imageUrl.env) || ''}
                                btnText="营业证件照片"
                                status="env"
                                visible={editStatus}
                                disabled={!editStatus}
                                messages={FORMVALIDATOR.shopkeeper_booth_photo_null}
                            />
                        )
                    }
                </Form.Item>
                {
                    type && type !== '1' && (
                        <Form.Item label="商品照:" className="pictrue picture2">
                            <div className="pic-title" style={{lineHeight: '32px'}}>
                                    照片最大2M
                                {
                                    editStatus && (
                                        <Popover placement="right" title="营业执照" trigger="hover" content={<img className="look-sample" src={shopAuthImg && shopAuthImg.mana3}/>}>
                                            <span className="look-both">查看示例</span>
                                        </Popover>
                                    )
                                }
                            </div>
                            {
                                getFieldDecorator('goods', {
                                })(
                                    <SUpload
                                        form={this.props.form}
                                        ix={7}
                                        init={(imageUrl && imageUrl.goods) || ''}
                                        btnText="商品照"
                                        status="goods"
                                        visible={editStatus}
                                        disabled={!editStatus}
                                        messages={FORMVALIDATOR.shopkeeper_goods_photo_null}
                                    />
                                )
                            }
                        </Form.Item>
                    )
                }
            </Form>
        );
    }
}