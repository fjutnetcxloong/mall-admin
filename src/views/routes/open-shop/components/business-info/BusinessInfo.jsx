/**
 * 商家证明图片组件
 * 雷疆
 */
import {Form, Select, Radio, Popover} from 'antd';
import SUpload from '../../../../common/upload/upload';
import './BusinessInfo.less';

const {MESSAGE: {FORMVALIDATOR}} = Constants;
const {Option} = Select;
const formItemLayout = {
    labelCol: {span: 4},
    wrapperCol: {span: 10}
};

class BusinessInfo extends BaseComponent {
    state={
        ix: -1,
        shopData: {}
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.shopData !== this.props.shopData) {
            this.setState({
                shopData: nextProps.shopData,
                ix: nextProps.shopData.ix === '' ? -1 : Number(nextProps.shopData.ix)
            });
        }
    }

    // 选择证件类型
    checkType = (val) => {
        this.setState({
            ix: Number(val)
        });
    }

    //切换底部提示语显示状态
    onChange = (e) => {
        if (e.target.value === 1) {
            this.props.changeFoot(false);
        } else {
            this.props.changeFoot(true);
        }
    }

    // 提交表单
    submit = () => {
        const {validateFieldsAndScroll} = this.props.form;
        return new Promise((resoloved, rejected) => {
            validateFieldsAndScroll({first: true, force: true, scroll: {offsetTop: 100}}, (err, val) => {
                if (!err) {
                    resoloved(val);
                }
            });
        });
    }

    //传图的回调
    success = (obj) => {
        const {ix} = this.state;
        if (obj.status === 1) {
            if (obj.ix === ix) {
                this.setState(prevState => {
                    if (prevState.shopData.pics) {
                        prevState.shopData.pics[ix] = '';
                    }
                    return {
                        shopData: prevState.shopData
                    };
                });
            } else if (obj.ix === 3) {
                this.setState(prevState => {
                    if (prevState.shopData.pics) {
                        prevState.shopData.pics[3] = '';
                    }
                    return {
                        shopData: prevState.shopData
                    };
                });
            } else if (obj.ix === 5) {
                this.setState(prevState => {
                    if (prevState.shopData.pics) {
                        prevState.shopData.pics[5] = '';
                    }
                    return {
                        shopData: prevState.shopData
                    };
                });
            } else if (obj.ix === 7) {
                this.setState(prevState => {
                    if (prevState.shopData.pics) {
                        prevState.shopData.pics[7] = '';
                    }
                    return {
                        shopData: prevState.shopData
                    };
                });
            }
        }
    }

    render() {
        const {ix, shopData} = this.state;
        const {getFieldDecorator} = this.props.form;
        const selection = [
            {name: '租赁协议', value: '8'},
            {name: '产权证明', value: '9'},
            {name: '执业资质证照', value: '10'},
            {name: '第三方证明', value: '11'},
            {name: '其他证明材料', value: '12'}

        ];
        const {type} = this.props;
        //根据回传数据处理材料类型
        const name = shopData && shopData.ix ? selection.find(item => shopData.ix === Number(item.value)).name : undefined;

        return (
            <Form onSubmit={this.submit} className="pictrue-form bussiness" {...formItemLayout} style={{border: 'none'}} hideRequiredMark>
                {
                    (type && type !== '1') && (
                        <Form.Item label="商家证明照片：">
                            <Form.Item className="shopkeeper-photo">
                                {getFieldDecorator('prove', {
                                    initialValue: name,
                                    rules: [{required: true, message: FORMVALIDATOR.materials_type}]
                                })(
                                    <Select
                                        onSelect={val => this.checkType(val)}
                                        placeholder="请选择您的证件类型"
                                    >
                                        {
                                            selection.map(item => (
                                                <Option
                                                    value={item.value}
                                                    key={item.name}
                                                >
                                                    {item.name}
                                                </Option>
                                            ))
                                        }
                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item>
                                {getFieldDecorator('prove-pic', {
                                })(
                                    <SUpload
                                        form={this.props.form}
                                        ix={ix}
                                        show
                                        onSuccess={this.success}
                                        init={(shopData.pics && shopData.pics[shopData.ix]) || ''}
                                        btnText="点击上传"
                                        status="prove-pic"
                                        messages={FORMVALIDATOR.materials_photo}
                                    />
                                )}
                            </Form.Item>
                        </Form.Item>
                    )
                }
                <Form.Item label={type === '1' ? '商家门头照:' : '摊位照:'} className="pictrue">
                    <div className="pic-title booth">
                    照片最大2M
                        <Popover placement="right" title={type === '1' ? '商家门头照:' : '摊位照:'} trigger="hover" content={<img className="look-sample" src={shopData.mana1}/>}>
                            <span className="look-both">查看示例</span>
                        </Popover>

                    </div>
                    {
                        getFieldDecorator('booths', {
                        })(
                            <SUpload
                                form={this.props.form}
                                ix={3}
                                show
                                onSuccess={this.success}
                                init={(shopData.pics && shopData.pics[3]) || ''}
                                btnText="点击上传"
                                status="booths"
                                messages={type === '1' ? FORMVALIDATOR.shopkeeper_Room_photo_null : FORMVALIDATOR.shop_door}
                            />
                        )
                    }
                </Form.Item>
                <Form.Item label={type === '1' ? '商家店内照' : '摊位环境照:'} className="pictrue">
                    <div className="pic-title env">
                    照片最大2M
                        <Popover
                            placement="right"
                            title={type === '1' ? '商家店内照' : '摊位环境照:'}
                            trigger="hover"
                            content={(
                                <img
                                    className="look-sample"
                                    src={shopData.mana2}
                                />
                            )}
                        >
                            <span className="look-both">查看示例</span>
                        </Popover>
                    </div>
                    {
                        getFieldDecorator('environment', {
                        })(
                            <SUpload
                                form={this.props.form}
                                ix={5}
                                show
                                onSuccess={this.success}
                                init={(shopData.pics && shopData.pics[5]) || ''}
                                btnText="点击上传"
                                status="environment"
                                messages={type === '1' ? FORMVALIDATOR.shop_room_pic : FORMVALIDATOR.shopkeeper_booth_photo_null}
                            />
                        )
                    }
                </Form.Item>
                {
                    (type && type !== '1') && (
                        <Form.Item label="商品照:" className="pictrue ">
                            <div className="pic-title goods">
                    照片最大2M
                                <Popover placement="right" title="商品照" trigger="hover" content={<img className="look-sample" src={shopData.mana3}/>}>
                                    <span className="look-both">查看示例</span>
                                </Popover>

                            </div>
                            {
                                getFieldDecorator('goods', {
                                })(
                                    <SUpload
                                        form={this.props.form}
                                        ix={7}
                                        show
                                        onSuccess={this.success}
                                        init={(shopData.pics && shopData.pics[7]) || ''}
                                        btnText="点击上传"
                                        status="goods"
                                        messages={FORMVALIDATOR.shopkeeper_goods_photo_null}
                                    />
                                )
                            }
                        </Form.Item>
                    )
                }
                <Form.Item label="商户类型" wrapperCol={{span: 20}}>
                    {
                        getFieldDecorator('checked', {
                            initialValue: (shopData && shopData.is_exp) || undefined,
                            rules: [{required: true, message: FORMVALIDATOR.bussiness_type_null}]
                        })(
                            <Radio.Group onChange={this.onChange}>
                                <Radio value={1}>正式商家</Radio>
                                <Radio value={2}>体验商家</Radio>
                            </Radio.Group>
                        )
                    }
                </Form.Item>
            </Form>
        );
    }
}
export default Form.create()(BusinessInfo);
