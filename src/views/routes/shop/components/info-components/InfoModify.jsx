/*
* 店铺信息修改
* */
import {Button, Form, Row, Col, TimePicker, Input, Spin} from 'antd';
import moment from 'moment';
import InfoBottom from './InfoBottom';
import {GetArea} from '../../../../common/get-area/index';
import GeisInput from '../../../../common/form/input/GeisInput';
import HandleUpload from '../../../../common/handle-upload/HandleUpload';
import HandleModal from '../../../../common/handle-modal/HandleModal';
import '../../index.less';
import Supload from '../../../../common/upload/upload';


const {TextArea} = Input;
const {formatMomentSecond, warningMsg, normFile} = Utils;
const {api} = Configs;
const {validator} = Utils;

const {MESSAGE: {FORMVALIDATOR}} = Constants;

//时间选中数据
const format = 'HH:mm';
const formItemLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 8}
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 12}
    }
};
class InfoModify extends BaseComponent {
    constructor(props) {
        super(props);
        const {shopInfo} = props;
        this.state = {
            filelist: (shopInfo.album && shopInfo.album.length !== 0) ? shopInfo.album.map((item, index) => ({
                uid: index,
                url: item,
                status: 'done'
            })) : [], //更改后的图册
            previewVisible: false, //预览开关
            open: false, //时间选择器是否打开
            previewImage: '', //预览图片
            // fileMain: [], //上传的图册
            timer: null, //定时器
            loading: false //懒加载
        };
    }

    //点击上传回调
    handleChange = (filelist) => {
        this.setState({
            filelist
        });
    };

    //关闭预览
    handleCancel = () => this.setState({previewVisible: false});

    //预览图片
    handlePreview = file => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true
        });
    };

    //获取地址ID
    getAreaArr = (value) => {
        const areaObj = {};
        areaObj.province_id = value[0];
        areaObj.city_id = value[1];
        areaObj.county_id = value[2];
        const {shopInfo} = this.props;
        shopInfo.area_code = areaObj;
        this.setState({
            shopInfo
        });
    };

    //提交表单信息
    onSub = () => {
        //关闭懒加载
        const nextStep = () => {
            //关闭骨架屏
            this.setState({
                loading: false
            });
        };
        const {shopInfo, getShopInfo} = this.props;
        //验证表单信息
        this.props.form.validateFieldsAndScroll({scroll: {offsetTop: 300, alignWithTop: true}, force: true}, (err, values) => {
            if (err) {
                return;
            }
            if (!Object.values(shopInfo.area_code).every(item => item)) {
                warningMsg('请将地址填写完善');
                return;
            }
            this.setState({
                loading: true
            });
            const {filelist} = this.state;
            values.discount = Number(values.discount);
            //营业时间
            values.open_time = formatMomentSecond(values.open_time);
            values.close_time = formatMomentSecond(values.close_time);
            //省市县
            values.province_id = shopInfo.area_code.province_id;
            values.city_id = shopInfo.area_code.city_id;
            values.county_id = shopInfo.area_code.county_id;
            //上传表单信息
            this.fetch(api.modifyShopsetting, {data: values})
                .subscribe(res => {
                    if (res && res.status === 0) {
                        const fileArr = [];
                        filelist.map((item, index) => {
                            if (item) {
                            //上传图册
                                fileArr.push(new Promise((resolve, reject) => {
                                    this.fetch(api.shopAlbum, {
                                        data: {
                                            ix: index, num: filelist.length, file: item.thumbUrl ? encodeURIComponent(item.thumbUrl) : item.url
                                        }}).subscribe(res2 => {
                                        if ((res2 && res2.status === 0)) {
                                            resolve(res2);
                                        } else {
                                            reject(res2);
                                        }
                                    });
                                }));
                            }
                        });
                        Promise.all(fileArr).then(() => {
                            this.props.toModify(false);
                            getShopInfo();
                        }).catch(() => {
                            warningMsg('图册上传失败');
                        });
                    }
                    nextStep();
                });
        });
    }

    /**
     * 验证折扣
     */
    checkDiscount = (rule, value, callback) => {
        if (!validator.isEmpty(value, FORMVALIDATOR.no_discount, callback)) return;
        if (Number(value) > 9.5 || Number(value) < 8) {
            validator.showMessage(FORMVALIDATOR.discount_err, callback);
            return;
        }
        callback();
    };

    //什么是折扣跳转
    reduced = () => {
        window.open(`#/support?id1=${32}&id2=${39}&id3=${51}`);
    }

    render() {
        const {filelist, previewVisible, previewImage, loading} = this.state;
        const {shopInfo, form: {getFieldDecorator}} = this.props;
        return (
            <div className="shop-setting">
                <Spin spinning={loading}>
                    <div className="info-modify-inner">
                        {
                            shopInfo && (
                                <Form {...formItemLayout}>
                                    <p className="shop-name">店铺信息</p>
                                    <div className="info-show-inner-container">
                                        {
                                            getFieldDecorator('booth', {
                                            })(
                                                <Supload
                                                    form={this.props.form}
                                                    ix={18}
                                                    init={shopInfo.logo}
                                                    btnText="商家头像"
                                                    status="booth"
                                                    visible
                                                />
                                            )
                                        }
                                        <div className="info-show-inner-box">
                                            <Row className="unchange-info">
                                                <Col span={8}>
                                                    <span>店铺类型：</span>
                                                </Col>
                                                <Col span={12}>
                                                    <span>{shopInfo.shop_type_name}</span>
                                                </Col>
                                            </Row>
                                            <Row className="unchange-info">
                                                <Col span={8}>
                                                    <span>店铺名称：</span>
                                                </Col>
                                                <Col span={12}>
                                                    <span>{shopInfo.shopName}</span>
                                                </Col>
                                            </Row>
                                            <Row className="unchange-info">
                                                <Col span={8}>
                                                    <span>UID：</span>
                                                </Col>
                                                <Col span={12}>
                                                    <span>{shopInfo.no}</span>
                                                </Col>
                                            </Row>
                                            <Row className="business-hours">
                                                <Col span={8}>
                                                    <div>营业时间：</div>
                                                </Col>
                                                <Col span={16}>
                                                    <Form.Item className="runTime">
                                                        {
                                                            getFieldDecorator('open_time', {
                                                                rules: [{required: true, message: FORMVALIDATOR.run_time_null}],
                                                                initialValue: moment(shopInfo.open_time, format) || ''
                                                            })(<TimePicker format={format}/>)
                                                        }
                                                    </Form.Item>
                                                    <Form.Item className="runTime">
                                                        {
                                                            getFieldDecorator('close_time', {
                                                                rules: [{required: true, message: FORMVALIDATOR.run_time_null}],
                                                                initialValue: moment(shopInfo.close_time, format) || ''
                                                            })(<TimePicker format={format} onChange={this.closeBoard}/>)
                                                        }
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                            <Row className="unchange-info">
                                                <Col span={8}>
                                                    <span>主营类目：</span>
                                                </Col>
                                                <Col span={12}>
                                                    <span>{shopInfo.cate1}</span>
                                                </Col>
                                            </Row>
                                            <Form.Item label="收款码折扣：" className="discount-item">
                                                {getFieldDecorator('discount', {
                                                    rules: [{required: true, validator: this.checkDiscount}]
                                                })(
                                                    <GeisInput defaultInput={shopInfo.discount} type="float"/>
                                                )}
                                                <Button type="link" onClick={this.reduced}>什么是折扣？</Button>
                                            </Form.Item>
                                            <Form.Item label="所在地区：">
                                                {getFieldDecorator('province', {
                                                    initialValue: shopInfo.area_code || [0, 1, 2], //设置默认值
                                                    rules: [{required: true, message: FORMVALIDATOR.area_null}]
                                                })(
                                                    <GetArea getAreaArr={this.getAreaArr} editArea={Object.values(shopInfo.area_code)}/>
                                                )}
                                            </Form.Item>
                                            <Form.Item className="shop-detail-address" label="店铺具体地址：">
                                                {getFieldDecorator('address', {
                                                    rules: [{required: true, message: FORMVALIDATOR.detail_address_null}],
                                                    initialValue: shopInfo.address
                                                })(
                                                    <TextArea rows={4} placeholder={shopInfo.address}/>
                                                )}
                                            </Form.Item>
                                            <Form.Item label="商家图册：" className="photos-shopers">
                                                <div className="clearfix">
                                                    <p style={{textAlign: 'left', color: '@gray'}}>照片最大2M</p>
                                                    <div className="clearfix">
                                                        {getFieldDecorator('us', {
                                                            initialValue: filelist,
                                                            valuePropName: 'filelist',
                                                            getValueFromEvent: (e) => {
                                                                const result = normFile(e);
                                                                this.handleChange(result);
                                                                return result;
                                                            } //getValueFromEvent将formItem的onChange的参数（如 event）传入受控组件
                                                        })(
                                                            <HandleUpload
                                                                list={filelist}
                                                                limit={9}
                                                                button={<div>点击上传</div>}
                                                                onPreview={this.handlePreview}
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            </Form.Item>
                                            {
                                                previewVisible && (
                                                    <HandleModal
                                                        className="preview-box"
                                                        visible={previewVisible}
                                                        width={400}
                                                        closable={false}
                                                        content={<img className="model-preview-img" alt="" src={previewImage}/>}
                                                        onCancel={this.handleCancel}
                                                    />
                                                )
                                            }
                                            <Form.Item label="客服电话：">
                                                {getFieldDecorator('csh_phone', {
                                                    rules: [{
                                                        required: true, message: FORMVALIDATOR.customer_service_phone_null
                                                    },
                                                    {
                                                        pattern: /^\d{0,12}$/,
                                                        message: FORMVALIDATOR.customer_service_phone_err
                                                    }
                                                    ]
                                                })(
                                                    <GeisInput
                                                        type="numAndBar"
                                                        defaultInput={shopInfo.csh_phone}
                                                        maxLength={12}
                                                    />
                                                )}
                                            </Form.Item>
                                            <Form.Item label="开店人：">
                                                {getFieldDecorator('linkName', {
                                                    rules: [{
                                                        required: true, message: FORMVALIDATOR.principal_name_null
                                                    },
                                                    {
                                                        pattern: /^[\u4e00-\u9fa5]{2,8}$/,
                                                        message: FORMVALIDATOR.principal_name_null
                                                    }
                                                    ],
                                                    initialValue: shopInfo.linkName
                                                })(
                                                    <Input placeholder="请输入开店人"/>
                                                )}
                                            </Form.Item>
                                            <Form.Item label="开店人手机号：">
                                                {getFieldDecorator('phone', {
                                                    rules: [
                                                        {
                                                            required: true, message: FORMVALIDATOR.principal_phone_null
                                                        },
                                                        {
                                                            pattern: /^1[3456789]\d{9}$/,
                                                            message: FORMVALIDATOR.customer_service_phone_err
                                                        }
                                                    ]
                                                })(
                                                    <GeisInput
                                                        type="num"
                                                        defaultInput={shopInfo.phone}
                                                        maxLength={11}
                                                        placeholder="请输入电话号码"
                                                    />
                                                )}
                                            </Form.Item>
                                            <Form.Item className="shop-detail-address" label="店铺简介：">
                                                {getFieldDecorator('intro', {
                                                    initialValue: shopInfo.intro
                                                })(
                                                    <TextArea rows={4} placeholder={shopInfo.intro}/>
                                                )}
                                            </Form.Item>
                                        </div>
                                    </div>
                                    <div className="gray-line"/>
                                </Form>
                            )
                        }
                        <div>
                            <InfoBottom infoBot={shopInfo}/>
                        </div>
                        <div className="comfirm-modify">
                            <div className="comfirm-modify-btn">
                                <Button type="default" onClick={() => this.props.toModify(false)}>取消</Button>
                                <Button type="primary" onClick={this.onSub}>保存</Button>
                            </div>
                        </div>
                    </div>
                </Spin>
            </div>
        );
    }
}
export default Form.create()(InfoModify);