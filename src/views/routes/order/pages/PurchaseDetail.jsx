/**
 * 退货详情页 赵志强
 */
import './PurchaseDetail.less';
import {Row, Col, Form, Select, Button, Input, message, InputNumber} from 'antd';
import HandleModal from '../../../common/handle-modal/HandleModal';
import Logistics from '../components/LogisticsPrompt';

const {api} = Configs;
const {warningMsg, appHistory, tengXunIm} = Utils;
const {MESSAGE: {OrderManager}} = Constants;
const setect = [
    {title: '商品已影响二次销售', value: 0},
    {title: '商品没问题，买家未举证', value: 1},
    {title: '商品没问题，买家举证无效', value: 2},
    {title: '其他', value: 3}
];
const {TextArea} = Input;

class PurchaseDetail extends BaseComponent {
    state = {
        recordData: [], //详情数据
        goodsData: [], //商品
        declineStatus: false, //拒绝退款弹窗
        takeOverStatus: false, //收获确认弹出框
        province: [], //省
        provinceName: '', //省名字
        provinceId: '', //省id
        city: [], //市
        cityName: '', //市名字
        cityId: '', //市id
        county: [], //县
        countyName: '', //县名字
        countyId: '', //县id
        buyerName: '', //收货人信息
        address: '', //详细地址
        phone: '', //联系电话
        remarks: '', //备注
        selectName: '', //判断选择退款原因
        LogisticsPopup: false, //物流信息弹出框
        refuseStatus: false //拒绝收货 true拒绝收货
    }

    componentDidMount() {
        this.serviceDetail();
    }

    //售后详情数据
    serviceDetail = () => {
        const id = this.props.location.search.split('=')[1];
        this.fetch(api.aftersaleInfo, {method: 'POST',
            data: {
                id
            }}).subscribe(res => {
            if (res.status === 0) {
                this.setState({
                    recordData: res.data.info,
                    goodsData: res.data.goods,
                    buyerName: res.data.receive.receiver || '',
                    address: res.data.receive.address || '',
                    phone: res.data.receive.phone || '',
                    provinceName: res.data.receive ? res.data.receive.pca[0][0] : '',
                    provinceId: res.data.receive ? res.data.receive.pca[1][0] : '',
                    cityName: res.data.receive ? res.data.receive.pca[0][1] : '',
                    cityId: res.data.receive ? res.data.receive.pca[1][1] : '',
                    countyName: res.data.receive ? res.data.receive.pca[0][2] : '',
                    countyId: res.data.receive ? res.data.receive.pca[1][2] : ''
                }, () => {
                    console.log(this.state);
                });
            }
        });
    };

    //获取省
    getPcat = () => {
        this.fetch(api.getPcat, {method: 'post',
            data: {
                code: 0
            }}).subscribe(res => {
            if (res) {
                if (res.status === 0) {
                    this.setState({
                        province: res.data
                    });
                }
            }
        });
    };

    //获取市
    getCity = () => {
        const {provinceId} = this.state;
        if (provinceId !== '') {
            this.fetch(api.getPcat, {method: 'post',
                data: {
                    code: provinceId
                }}).subscribe(res => {
                if (res) {
                    if (res.status === 0) {
                        this.setState({
                            city: res.data
                        });
                    }
                }
            });
        } else {
            message.info(OrderManager.no_province);
        }
    };

    //获取县
    getCounty = () => {
        const {cityId} = this.state;
        if (cityId !== '') {
            this.fetch(api.getPcat, {method: 'post',
                data: {
                    code: cityId
                }}).subscribe(res => {
                if (res) {
                    if (res.status === 0) {
                        this.setState({
                            county: res.data
                        });
                    }
                }
            });
        } else {
            message.info(OrderManager.no_city);
        }
    };

    //保存省<code></code>
    soloveCode = (val) => {
        const {province} = this.state;
        for (let i = 0; i < province.length; i++) {
            if (province[i].code === val) {
                this.setState({
                    provinceName: province[i].name
                });
            }
        }
        this.setState({
            provinceId: val
        });
    };

    //保存市
    soloveCountyCode = (val) => {
        const {city} = this.state;
        for (let i = 0; i < city.length; i++) {
            if (city[i].code === val) {
                this.setState({
                    cityId: val,
                    cityName: city[i].name
                });
            }
        }
    };

    //保存县
    soloveCountycounty = (val) => {
        const {county} = this.state;
        for (let i = 0; i < county.length; i++) {
            if (county[i].code === val) {
                this.setState({
                    countyId: val,
                    countyName: county[i].name
                });
            }
        }
    };

    //点击拒绝退款
    declineTake = () => {
        this.setState({
            declineStatus: true
        });
    };

    //关闭弹窗
    ClosePopups = () => {
        this.setState({
            declineStatus: false,
            takeOverStatus: false,
            refuseStatus: false,
            selectName: null
        });
    };

    //确认拒绝退款  拒绝收货
    deleteOrder = () => {
        const {selectName, recordData, refuseStatus} = this.state;
        //refuseStatus true 拒绝收货   false 拒绝退款
        if (selectName) {
            this.setState({
                declineStatus: false
            }, () => {
                if (refuseStatus) {
                    this.fetch(api.refuseReceive, {method: 'post',
                        data: {
                            id: recordData.id,
                            reason: selectName
                        }}).subscribe(res => {
                        if (res) {
                            if (res.status === 0) {
                                message.info(OrderManager.submit_success, () => {
                                    this.serviceDetail();
                                });
                            }
                        }
                    });
                } else {
                    this.fetch(api.aftersaleRefuse, {method: 'post',
                        data: {
                            id: recordData.id,
                            reason: selectName
                        }}).subscribe(res => {
                        if (res) {
                            if (res.status === 0) {
                                message.info(OrderManager.submit_success, () => {
                                    this.serviceDetail();
                                });
                            }
                        }
                    });
                }
            });
        } else {
            message.info(OrderManager.refuse_reason);
        }
    };

    //选择退款原因
    selectCause = (value) => {
        this.setState({
            selectName: value
        });
    };

    //确认收货
    affirms  = () => {
        this.setState({
            takeOverStatus: true
        });
    };

    //拒绝收货
    refuseTake = () => {
        this.setState({
            declineStatus: true,
            refuseStatus: true
        });
    }

    //同意退货
    submit = () => {
        //recordData.types 1 退款  2 退款退货
        const {provinceName, cityName, countyName, recordData, provinceId, cityId, countyId} = this.state;
        const {validateFields} = this.props.form;
        return new Promise((resoloved, rejected) => {
            validateFields({first: true, force: true}, (err, val) => {
                if (!err) {
                    let datas = {};
                    if (recordData.types === '1') {
                        datas = {
                            id: recordData.id,
                            remarks: val.remarks
                        };
                        this.fetch(api.aftersaleRemoney, {method: 'POST',
                            data: datas}).subscribe(res => {
                            if (res) {
                                if (res.status === 0) {
                                    message.info(OrderManager.submit_success);
                                    this.serviceDetail();
                                }
                            }
                        });
                    } else {
                        datas = {
                            id: recordData.id,
                            pca: [[provinceName, cityName, countyName], [provinceId, cityId, countyId]],
                            address: val.address,
                            phone: val.phone,
                            remarks: val.remarks,
                            receiver: val.buyerName
                        };
                        if (!val.buyerName) {
                            warningMsg(OrderManager.no_name);
                        } else if (!val.address) {
                            warningMsg(OrderManager.no_detailAddress);
                        } else if (!val.phone) {
                            warningMsg(OrderManager.no_phone);
                        } else {
                            this.fetch(api.aftersaleRegoods, {method: 'POST',
                                data: datas}).subscribe(res => {
                                if (res) {
                                    if (res.status === 0) {
                                        message.info(OrderManager.submit_success);
                                        this.serviceDetail();
                                    }
                                }
                            });
                        }
                    }
                }
            });
        });
    };

    //获取收货备注
    getOffName = (res) => {
        this.setState({
            remarks: res.target.value
        });
    };

    //确认收货
    affirmPopupsr = () => {
        const {remarks, recordData} = this.state;
        this.fetch(api.aftersaleReceive, {method: 'post',
            data: {
                id: recordData.id,
                remarks
            }}).subscribe(res => {
            if (res) {
                if (res.status === 0) {
                    message.info(OrderManager.receive_success);
                    this.serviceDetail();
                    this.setState({
                        takeOverStatus: false
                    });
                }
            }
        });
    };

    //查看点击跳转到 详情页面
    skipLook = () => {
        const {recordData} = this.state;
        //recordData.if_express 等于1 网店发货详情页  2 自提详情页
        if (recordData.if_express === '1') {
            appHistory.push(`/order/online-delivery/delivery-detail?id=${recordData.order_id}`);
        } else {
            appHistory.push(`/order/offline-pickup/pickup-detail?id=${recordData.order_id}`);
        }
    };

    //物流详情
    logisticsr = () => {
        const {recordData} = this.state;
        if (recordData.express_id === '0') {
            message.info(OrderManager.no_logistics);
        } else {
            this.setState({
                LogisticsPopup: true
            });
        }
    };

    render() {
        //recordData.status 1待处理，2退货中，3已完成，4已拒绝
        const {getFieldDecorator} = this.props.form;
        const {
            province, provinceName, city, cityName, county, countyName,
            buyerName, address, phone, remarks, declineStatus, selectName, recordData,
            goodsData, takeOverStatus, LogisticsPopup, refuseStatus
        } = this.state;
        //拒绝退款 确认收货
        const footer = (
            <div>
                <Button
                    key="cancel"
                    onClick={this.ClosePopups}
                >
                    取消
                </Button>
                {/*takeOverStatus true 确认收货  false 拒绝退款*/}
                {takeOverStatus ? (
                    <Button
                        key="submit"
                        type="primary"
                        onClick={this.affirmPopupsr}
                    >
                        确定
                    </Button>
                ) : (
                    <Button
                        key="submit"
                        type="primary"
                        onClick={this.deleteOrder}
                    >
                        确定
                    </Button>
                )}
            </div>
        );
        //拒绝退款内容
        const decliner = (
            <div className="decliner-order-blow">
                <div className="decliner-title">
                    <span>*</span>
                    请选择您的拒绝原因:
                </div>
                <div className="decliner-wrap">
                    {setect.map((item) => (
                        <div key={item.value} className={`list ${item.title === selectName ? 'list-select' : ''}`} onClick={() => this.selectCause(item.title)}>{item.title}</div>
                    ))}
                </div>
            </div>
        );
        return (
            <div className="page refund-detail">
                <div className="Purchase-detail">
                    {/*头部*/}
                    <div className="Purchase-top">
                        <div className="top-text">退货商品</div>
                    </div>
                    {/*商品详情*/}
                    <div className="Tabs-frame-list">
                        <div className="list-top">
                            <Row className="list-top-row">
                                <Col span={3} className="list-order">商品图片</Col>
                                <Col span={6} className="list-order">商品名称</Col>
                                <Col span={3} className="list-order">规格</Col>
                                <Col span={3} className="list-order">单价</Col>
                                <Col span={2} className="list-order">记账量</Col>
                                <Col span={1} className="list-order">数量</Col>
                                <Col span={3} className="list-order">商品小计</Col>
                                <Col span={3} className="list-order">商品合计</Col>
                            </Row>
                        </div>
                        <div className="list-bottom">
                            <Row className="list-touch">
                                <div className="orderList">
                                    {goodsData && goodsData.map((item) => (
                                        <div key={item.id}>
                                            <Col span={3} className="list-touch-bottom" style={{height: 132 + 'px'}}>
                                                <div className="goods">
                                                    <img className="goods-img" src={item.picpath} alt=""/>
                                                </div>
                                            </Col>
                                            <Col span={6} className="list-touch-bottom" style={{height: 132 + 'px'}}>
                                                <div className="goods-wrap">
                                                    <div className="goods">
                                                        <div className="goods-title">
                                                            <div className="goods-head">{item.pr_title}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col span={3} className="list-touch-bottom" style={{height: 132 + 'px'}}>
                                                <div className="goods-specs">
                                                    {item.values_name.map((data) => (
                                                        <span className="specs" key={data}>{data}</span>
                                                    ))}
                                                </div>
                                            </Col>
                                            <Col span={3} className="list-touch-bottom" style={{height: 132 + 'px'}}>{'￥' + item.price}</Col>
                                            <Col span={2} className="list-touch-bottom" style={{height: 132 + 'px'}}>{item.deposit}</Col>
                                            <Col span={1} className="list-touch-bottom" style={{height: 132 + 'px'}}>{item.num}</Col>
                                            <Col span={3} className="list-touch-bottom" style={{height: 132 + 'px'}}>{'￥' + item.all_price}</Col>
                                        </div>
                                    ))}
                                    <Col span={3} className="list-touch-bottom" style={{height: 132 * goodsData.length + 'px'}}>{'￥' + recordData.return_price}</Col>
                                </div>
                            </Row>
                        </div>
                        <div className="list-bottom-root">
                            {/*<div>备注：发货前请仔细检查，请不要放快递柜</div>*/}
                        </div>
                    </div>
                    {/*服务单信息*/}
                    {/*判断显示是退款*/}
                    {/*types 1 退款  2 退款退货*/}
                    {/*status 0默认，1待处理，2退货中，3已完成(卖家同意退款)，4已拒绝，5已关闭*/}
                    <div className="Purchase-top">
                        <div className="top-text">服务单信息</div>
                        <div>联系买家</div>
                    </div>
                    <div className="serve-news">
                        <div className="serve-wrap">
                            <div>服务单号：{recordData.return_no}</div>
                            <div>售后状态：{recordData.statustip}</div>
                            {(recordData.types === '2' && recordData.status === '2') && (
                                <div className="logisticsr-name" onClick={this.logisticsr}>物流信息：{recordData.express_name ? recordData.express_name : '暂无'} {recordData.express_no ? recordData.express_no : ''}</div>
                            )}
                            <div>订单编号：{recordData.order_no} <span className="skipLook" onClick={this.skipLook}>查看</span></div>
                            <div>申请时间：{recordData.crtdate}</div>
                            <div>买家昵称UID：{recordData.nickname} <span onClick={() => tengXunIm(1, recordData.no)}>{recordData.no}</span></div>
                            {recordData.types !== '1' && (
                                <div>
                                    <div>联系电话：{recordData.m_phone}</div>
                                    <div>退货原因：{recordData.return_reason}</div>
                                    <div>问题描述：{recordData.describe}</div>
                                    <div className="detail-img">
                                        <div>凭证照片：</div>
                                        <div>
                                            {recordData.return_pics && recordData.return_pics.map((item) => (
                                                <img className="goods-img" src={item} alt=""/>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    {(recordData.status !== '1') && (
                        <div className="serve-news">
                            {(recordData.status !== '4' && recordData.status !== '5') && (
                                <div className="serve-wrap">
                                    <div>订单金额：{'￥' + recordData.order_price || 0.00}</div>
                                    <div>申请退款金额：{'￥' + recordData.return_price}</div>
                                    <div>退款方式：退回原支付渠道</div>
                                    {recordData.types === '2' ? (
                                        <div>
                                            <div>收货人姓名：{recordData.receiver}</div>
                                            <div>联系电话：{recordData.receive_phone}</div>
                                            <div>收货地址：{recordData.receive_address}</div>
                                        </div>
                                    ) : (
                                        <div>
                                            <div>退款原因：{recordData.return_reason}</div>
                                            <div>联系电话：{recordData.receive_phone}</div>
                                            <div>问题描述：{recordData.describe}</div>
                                            <div>
                                                <div>凭证照片：</div>
                                                <div className="detail-img">
                                                    {recordData.return_pics && recordData.return_pics.map((item) => (
                                                        <img className="goods-img" src={item} alt=""/>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                            <div className="serve-wrap serve-wrap-bottom">
                                <div>处理人员：{recordData.handler}</div>
                                <div>处理时间：{recordData.hddate}</div>
                                <div>处理备注：{recordData.hdremarks}</div>
                                {/*<div>收货时间：{recordData.receive_date}</div>*/}
                                {recordData.types === '2' && (
                                    <div>
                                        收货备注：
                                        {recordData.status === '1' ? (
                                            <div className="remarks">
                                                <Input
                                                    className="basis-input"
                                                    type="text"
                                                    onChange={this.getOffName}
                                                    suffix="0/50"
                                                    maxLength={50}
                                                />
                                            </div>
                                        ) : (
                                            <span>
                                                {recordData.receive_remarks || '暂无备注'}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                            {recordData.status === '2' && (
                                <div className="purchase-detail-bottom">
                                    <div className="prompt">确认收货后，系统将为您立即退款</div>
                                    <div className="bottom-detail">
                                        <Button type="primary" className="btn-detail" onClick={this.affirms}>确认收货</Button>
                                        <Button type="primary" className="btn-detail" onClick={this.refuseTake}>拒绝收货</Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    {/*判断显示退货退款*/}
                    {(recordData.status === '1' && recordData.types === '2') && (
                        <div>
                            <div className="serve-news">
                                <div className="serve-news-left">
                                    <div>订单金额：</div>
                                    <div>申请退款金额：</div>
                                    <div><span>*</span>收货人姓名：</div>
                                    <div><span>*</span>所在地区：</div>
                                    <div><span>*</span>详细地址：</div>
                                    <div><span>*</span>联系电话：</div>
                                    <div>处理备注：</div>
                                </div>
                                <div className="serve-news-right">
                                    <div className="list">{'￥' + recordData.order_price || 0.00}</div>
                                    <div className="list">{'￥' + recordData.return_price}</div>
                                    <div className="list list-input">
                                        <Form.Item>
                                            {getFieldDecorator('buyerName', {
                                                initialValue: buyerName,
                                                rules: [{required: true, message: OrderManager.no_name}],
                                                validateTrigger: 'submit' //校验值的时机
                                            })(
                                                <Input
                                                    className="basis-input"
                                                    placeholder="请输入"
                                                />,
                                            )}
                                        </Form.Item>
                                    </div>
                                    <div className="list list-input">
                                        <Form.Item className="city" hasFeedback wrapperCol={{span: 24}}>
                                            <Form.Item>
                                                {getFieldDecorator('province', {
                                                    initialValue: provinceName,
                                                    rules: [{required: true, message: OrderManager.choose_province}],
                                                    validateTrigger: 'submit'//校验值的时机
                                                })(
                                                    <Select
                                                        onFocus={this.getPcat}
                                                        placeholder="请选择"
                                                        onChange={(val) => this.soloveCode(val)}
                                                    >
                                                        {
                                                            province && province.map(item => (
                                                                <Select.Option
                                                                    value={item.code}
                                                                    key={item.name}
                                                                >
                                                                    {item.name}
                                                                </Select.Option>
                                                            ))
                                                        }
                                                    </Select>
                                                )}
                                            </Form.Item>
                                            <Form.Item>
                                                {getFieldDecorator('city', {
                                                    initialValue: cityName,
                                                    rules: [{required: true, message: OrderManager.choose_city}],
                                                    validateTrigger: 'submit'//校验值的时机
                                                })(
                                                    <Select
                                                        placeholder="请选择"
                                                        onFocus={this.getCity}
                                                        onChange={(val) => this.soloveCountyCode(val)}
                                                    >
                                                        {
                                                            city && city.map(item => (
                                                                <Select.Option
                                                                    value={item.code}
                                                                    key={item.name}
                                                                >
                                                                    {item.name}
                                                                </Select.Option>
                                                            ))
                                                        }
                                                    </Select>
                                                )}
                                            </Form.Item>
                                            <Form.Item>
                                                {getFieldDecorator('county', {
                                                    initialValue: countyName,
                                                    rules: [{required: true, message: OrderManager.choose_county}],
                                                    validateTrigger: 'submit'//校验值的时机
                                                })(
                                                    <Select
                                                        placeholder="请选择"
                                                        onFocus={this.getCounty}
                                                        onChange={(val) => this.soloveCountycounty(val)}
                                                    >
                                                        {
                                                            county && county.map(item => (
                                                                <Select.Option
                                                                    value={item.code}
                                                                    key={item.name}
                                                                >
                                                                    {item.name}
                                                                </Select.Option>
                                                            ))
                                                        }
                                                    </Select>
                                                )}
                                            </Form.Item>
                                        </Form.Item>
                                    </div>
                                    <div className="list list-input">
                                        <Form.Item>
                                            {getFieldDecorator('address', {
                                                initialValue: address,
                                                rules: [{required: true, message: OrderManager.no_detailAddress}],
                                                validateTrigger: 'submit'//校验值的时机
                                            })(
                                                <Input
                                                    className="basis-input"
                                                    placeholder="请输入"
                                                />,
                                            )}
                                        </Form.Item>
                                    </div>
                                    <div className="list list-input">
                                        <Form.Item>
                                            {getFieldDecorator('phone', {
                                                initialValue: phone,
                                                rules: [{required: true, message: OrderManager.no_phone}],
                                                validateTrigger: 'submit'//校验值的时机
                                            })(
                                                <InputNumber
                                                    className="basis-input"
                                                    placeholder="请输入"
                                                />,
                                            )}
                                        </Form.Item>
                                    </div>
                                    <div className="list list-input">
                                        <Form.Item>
                                            {getFieldDecorator('remarks', {
                                                initialValue: remarks
                                            })(
                                                <TextArea
                                                    className="basis-input"
                                                    placeholder="请输入"
                                                    suffix="0/50"
                                                    maxLength={50}
                                                />,
                                            )}
                                        </Form.Item>
                                    </div>
                                </div>
                            </div>
                            <div className="purchase-detail-bottom">
                                <div className="bottom-detail">
                                    <Button type="primary" className="btn-detail" onClick={this.submit}>同意退货</Button>
                                    <Button className="btn-delete" onClick={this.declineTake}>拒绝退货</Button>
                                </div>
                            </div>
                        </div>
                    )}
                    {(recordData.status === '1' && recordData.types === '1') && (
                        <div>
                            <div className="serve-news">
                                <div className="serve-news-left">
                                    <div>订单金额：</div>
                                    <div>申请退款金额：</div>
                                    <div>退款方式：</div>
                                    <div>退款原因：</div>
                                    <div>凭证照片：</div>
                                    <div className="processing-notes">处理备注：</div>
                                </div>
                                <div className="serve-news-right">
                                    <div className="list">{'￥' + recordData.order_price || 0.00}</div>
                                    <div className="list">{'￥' + recordData.return_price}</div>
                                    <div className="list">退回原支付渠道</div>
                                    <div className="list">{recordData.return_reason}</div>
                                    <div className="list">
                                        {recordData.return_pics && recordData.return_pics.map((item) => (
                                            <img className="goods-img" src={item} alt=""/>
                                        ))}
                                    </div>
                                    <div className="list list-remarks">
                                        <div className="list list-input">
                                            <Form.Item>
                                                {getFieldDecorator('remarks', {
                                                    initialValue: remarks
                                                })(
                                                    <TextArea
                                                        className="basis-input"
                                                        placeholder="请输入"
                                                        suffix="0/50"
                                                        maxLength={50}
                                                    />,
                                                )}
                                            </Form.Item>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="purchase-detail-bottom">
                                <div className="bottom-detail">
                                    <Button type="primary" className="btn-detail" onClick={this.submit}>确认退款</Button>
                                    <Button className="btn-delete" onClick={this.declineTake}>拒绝退款</Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                {/*退款按钮*/}
                {declineStatus && (
                    <HandleModal
                        visible={declineStatus}
                        closable
                        title={refuseStatus ? '拒绝收货' : '拒绝退款'}
                        footer={footer}
                        content={decliner}
                        onOk={this.deleteOrder}
                        onCancel={this.ClosePopups}
                    />
                )}
                {/*收货确认弹出框*/}
                {takeOverStatus && (
                    <HandleModal
                        visible={takeOverStatus}
                        closable={false}
                        footer={footer}
                        content="确认是否收到货物"
                        onOk={this.ClosePopups}
                        onCancel={this.affirmPopupsr}
                    />
                )}
                {/*物流弹窗*/}
                {LogisticsPopup && (
                    <Logistics
                        visible={LogisticsPopup}
                        onCancel={this.ClosePopups}
                        orderId={recordData.express_id}
                    />
                )}
            </div>
        );
    }
}

export default Form.create()(PurchaseDetail);
