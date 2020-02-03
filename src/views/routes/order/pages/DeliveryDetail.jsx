/**
 * 网店发货详情页 赵志强
 */
import './Detail.less';
import {Steps, Row, Button, Col, message, Cascader, Input} from 'antd';
import HandleModal from '../../../common/handle-modal/HandleModal';
import ClosePop from '../components/ClosePrompt';
import Logistics from '../components/LogisticsPrompt';

const {Step} = Steps;
const {appHistory, tengXunIm} = Utils;
const {api} = Configs;
const {MESSAGE: {OrderManager}} = Constants;

//支付方式
const payType = [
    {
        title: 'CAM余额',
        index: '1'
    },
    {
        title: '微信',
        index: '2'
    },
    {
        title: '支付宝',
        index: '3'
    }
];

class DeliveryDetail extends BaseComponent {
    state = {
        DeletePopup: false, //删除订单弹窗
        LogisticsPopup: false, //是否显示物流弹窗
        deliveryPopup: false, //发货订单弹窗
        getClose: false, //关闭订单
        orderId: '', //当前详情页订单iD
        type: 0, //判断商家状态 0提交订单 1支付订单 2商家发货 3确认收货 4完成评价
        orderData: [], //订单详情列表参数
        logistics: [], //物流信息数组
        logisticsName: '', //选中物流名称
        numbers: '', //物流单号
        logisticsId: null //选中物流id
    }

    componentDidMount() {
        this.orderDetail();
        //物流获取
        this.logistics();
    }

    //获取订单详情数据
    orderDetail = () => {
        const id = this.props.location.search.split('=')[1];
        this.fetch(api.orderDetail, {method: 'POST',
            data: {
                id
            }}).subscribe(res => {
            if (res) {
                if (res.status === 0) {
                    this.setState({
                        orderId: id,
                        orderData: res.data,
                        type: Number(res.data.status)
                    });
                }
            }
        });
    }

    //获取物流
    logistics = () => {
        this.fetch(api.getExpressList, {method: 'POST'}).subscribe(res => {
            if (res) {
                if (res.status === 0) {
                    this.setState({
                        logistics: res.data
                    });
                }
            }
        });
    }

    //删除订单窗口
    delPopup = () => {
        this.setState({
            DeletePopup: true
        });
    }

    //关闭订单窗口
    getClose = () => {
        this.setState({
            getClose: true
        });
    }

    //发货订单窗口
    logisticsPopup = () => {
        this.setState({
            deliveryPopup: true
        });
    }

    //关闭订单弹窗 关闭删除订单窗口
    ClosePopups = () => {
        this.setState({
            getClose: false,
            LogisticsPopup: false,
            DeletePopup: false,
            deliveryPopup: false
        });
    }

    //确认关闭订单
    closeOrder = (reason) => {
        const {orderId} = this.state;
        this.setState({
            getClose: false
        }, () => {
            this.fetch(api.closeOrder, {method: 'POST',
                data: {
                    order_id: orderId,
                    reason
                }}).subscribe(res => {
                if (res) {
                    if (res.status === 0) {
                        message.info('成功关闭订单', () => {
                            this.props.history.push({
                                pathname: '/order/online-delivery'
                            });
                        });
                    }
                }
            });
        });
    }

    //获取物流名称
    logisticsNames = (res) => {
        const {logistics} = this.state;
        const name = logistics[res[0] - 1].name;
        this.setState({
            logisticsId: res[0],
            logisticsName: name
        });
    }

    //获取物流单号
    getNumbers = (res) => {
        this.setState({
            numbers: res.target.value
        });
    }

    //确认删除订单
    deleteOrder = () => {
        const {orderId} = this.state;
        this.setState({
            DeletePopup: false
        }, () => {
            this.fetch(api.deleteOrder, {method: 'POST',
                data: {
                    order_id: orderId
                }}).subscribe(res => {
                if (res) {
                    if (res.status === 0) {
                        message.info('删除成功', () => {
                            appHistory.replace('/order/online-delivery');
                        });
                    }
                }
            });
        });
    }

    //确认发货
    deliveryOrder = () => {
        const {orderId, numbers, logisticsId, logisticsName} = this.state;
        if ((!logisticsName || !logisticsId)) {
            message.info('请选择物流公司');
        } else if (!numbers) {
            message.info('请填写物流单号!');
        }  else {
            this.setState({
                deliveryPopup: false
            }, () => {
                this.fetch(api.deliverGoods, {method: 'POST',
                    data: {
                        order_id: orderId,
                        express_id: logisticsId,
                        express_name: logisticsName,
                        express_no: numbers
                    }}).subscribe(res => {
                    if (res) {
                        if (res.status === 0) {
                            message.info('发货成功', () => {
                                this.props.history.push({
                                    pathname: '/order/online-delivery'
                                });
                            });
                        }
                    }
                });
            });
        }
    }

    //跳转查看评价
    skipAssesss = () => {
        this.props.history.push({
            pathname: '/order/evaluation'
        });
    }

    //物流详情
    logisticsr = () => {
        this.setState({
            LogisticsPopup: true
        });
    }

    render() {
        const {type, orderData, DeletePopup, LogisticsPopup, orderId, deliveryPopup, logistics, getClose} = this.state;
        console.log(orderData, 'fdsfdsfdsfds ');
        //删除订单按钮 发货按钮
        const footer = (
            <div>
                <Button
                    key="cancel"
                    onClick={this.ClosePopups}
                >
                    取消
                </Button>
                {/*deliveryPopup 为true 发货按钮   false 删除订单按钮*/}
                {deliveryPopup ? (
                    <Button
                        key="submit"
                        type="primary"
                        onClick={this.deliveryOrder}
                    >
                        发货
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
        const logisticsr = (
            <div className="logistics">
                <div className="company">
                    <div className="company-name">物流公司:</div>
                    <div>
                        <Cascader
                            className="send-cascader"
                            fieldNames={{label: 'name', value: 'id'}}
                            options={logistics}
                            onChange={this.logisticsNames}
                            placeholder="请选择"
                        />
                    </div>
                </div>
                <div className="company">
                    <div className="company-name">物流单号:</div>
                    <Input
                        className="basis-input"
                        type="text"
                        onChange={this.getNumbers}
                        placeholder="请输入"
                    />
                </div>
            </div>
        );
        return (
            <div className="page order-management">
                <div className="delivery-detail">
                    <div className="detail-step">
                        <Row span={24} className="step" initia={0}>
                            <Steps current={type} labelPlacement="vertical" className="step-info">
                                <Step className="activate" title="提交订单" description={orderData.crtdate} icon={<span type="user" className="icon icon-one"/>}/>
                                <Step className={type >= 1 ? 'activate' : 'not-activate'} description={orderData.pay_date === '0' ? '' : orderData.pay_date} title="支付订单" icon={<span type="solution" className="icon icon-two"/>}/>
                                <Step className={type >= 2 ? 'activate' : 'not-activate'} description={orderData.deliver_date === '0' ? '' : orderData.deliver_date} title="商家发货" icon={<span type="loading" className="icon icon-three"/>}/>
                                <Step className={type >= 3 ? 'activate' : 'not-activate'} description={orderData.recive_date === '0' ? '' : orderData.recive_date} title="确认收货" icon={<span type="smile-o" className="icon icon-four"/>}/>
                                {/* <Step className={type >= 4 ? 'activate' : 'not-activate'} description={orderData.pingjia_time === '0' ? '' : orderData.pingjia_time} title="完成评价" icon={<span type="smile-o" className="icon icon-five"/>}/> */}
                            </Steps>
                        </Row>
                    </div>
                    <div className="detail-step-bottom">
                        <div className="order-status">
                            <div>
                                订单状态： <span className="shop-status">{orderData.status_msg}</span>
                            </div>
                            {orderData.restime && (
                                <div className="order-status-assess">倒计时：{orderData.restime}</div>
                            )}
                        </div>
                        <div className="order-btn">
                            {type === 4 && (
                                <div className="order-text" onClick={this.skipAssesss}>查看评价</div>
                            )}
                            {/* {(type === 1 || type === 0) && (
                                <Button type="primary" className="btn-delete" onClick={this.getClose}>关闭订单</Button>
                            )} */}
                            {(type === 4 || type === 3 || type === 10) && (
                                <Button className="btn-delete" onClick={this.delPopup}>删除订单</Button>
                            )}
                            {(type === 2 || type === 3) && (
                                <Button type="primary" className="btn-detail" onClick={this.logisticsr}>物流详情</Button>
                            )}
                            {(type === 1) && (
                                <Button type="primary" className="btn-detail" onClick={this.logisticsPopup}>发货</Button>
                            )}
                        </div>
                    </div>
                </div>
                <div className="delivery-content">
                    <div className="top-detail">
                        <div className="top-uid">UID：<span className="uid">{orderData.no}</span></div>
                        <div className="top-name icon" onClick={() => tengXunIm(1, orderData.no, 2, orderData.nickname, orderData.avatarUrl)}>买家：<span className="name">{orderData.nickname}</span></div>
                    </div>
                    <div className="goods-detail">
                        <div className="goods-name">商品信息</div>
                        <div className="Tabs-frame-list">
                            <div className="list-top">
                                <Row className="list-top-row">
                                    <Col span={14}>
                                        <Col span={13} className="identifier">订单编号：{orderData.order_no}</Col>
                                        <Col span={3}>单价</Col>
                                        <Col span={3}>记账量</Col>
                                        <Col span={2}>数量</Col>
                                        <Col span={3}>商品小计</Col>
                                    </Col>
                                    <Col span={4} className="list-order">支付方式</Col>
                                    <Col span={6} className="list-right">收货信息</Col>
                                </Row>
                            </div>
                            <div className="list-bottom">
                                {orderData.pr_list && (
                                    <Row className="list-touch">
                                        <Col span={14}>
                                            {orderData.pr_list.map((item) => (
                                                <div key={item.id} className="orderList">
                                                    <Col span={13} className="list-touch-bottom h128">
                                                        <div className="goods-wrap">
                                                            <div className="goods">
                                                                <img className="goods-img" src={item.picpath} alt=""/>
                                                                <div className="goods-title">
                                                                    <div className="goods-head">{item.pr_title}</div>
                                                                    <div className="goods-specs">
                                                                        {item.property_content && item.property_content.map((data) => (
                                                                            <span key={data} className="specs">{data}</span>
                                                                        ))}
                                                                    </div>
                                                                    <div className="goods-num">{item.pr_no}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                    <Col span={3} className="list-touch-bottom h128">{'￥' + item.single_price}</Col>
                                                    <Col span={3} className="list-touch-bottom h128">{item.single_deposit}</Col>
                                                    <Col span={2} className="list-touch-bottom h128">{item.num}</Col>
                                                    <Col span={3} className="list-touch-bottom h128">{'￥' + item.price}</Col>
                                                </div>
                                            ))}
                                        </Col>
                                        <Col span={4} className="list-touch-bottom" style={{height: 128 * orderData.pr_list.length + 'px'}}>
                                            {/*1-cam余额，2-微信，3-支付宝*/}
                                            {payType.map((item) => (
                                                (item.index === orderData.pay_type) ? (
                                                    <div key={item.index}>{item.title}</div>
                                                ) : (null)
                                            ))}
                                        </Col>
                                        <Col span={6} className="list-touch-bottom" style={{height: 128 * orderData.pr_list.length + 'px'}}>
                                            <div>
                                                <div>{orderData.linkname}</div>
                                                <div className="phone">{orderData.linktel}</div>
                                                <div>{orderData.area + orderData.address}</div>
                                            </div>
                                        </Col>
                                    </Row>
                                )}
                            </div>
                            <div className="list-bottom-root">
                                <div>备注：{orderData.remarks}</div>
                                <div>
                                    合计：￥{orderData.price}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="goods-detail">
                        <div className="goods-name">费用信息</div>
                        <div className="expenses">
                            <div className="expenses-top">
                                <span>商品合计</span>
                                <span>运费</span>
                                <span>优惠金额</span>
                                <span>应付金额</span>
                                <span>实付金额</span>
                            </div>
                            <div className="expenses-detail">
                                <span>￥{orderData.price}</span>
                                <span>￥{orderData.express_money}</span>
                                <span>-￥{orderData.discount_money}</span>
                                <span>￥{orderData.actual_price}</span>
                                <span>￥{orderData.actual_price}</span>
                            </div>
                        </div>
                    </div>
                    {orderData.invoice && (
                        <div className="goods-detail">
                            <div className="goods-name">发票信息</div>
                            <div className="expenses expenses-news">
                                <div className="expenses-top">
                                    <span>发票类型</span>
                                    <span>抬头类型</span>
                                    <span>纳税人识别号</span>
                                    <span>企业/个人名称</span>
                                </div>
                                <div className="expenses-detail">
                                    <span>{orderData.invoice.invoice_type === '1' ? '增值税普通发票' : ''}</span>
                                    <span>{orderData.invoice.head_type === '1' ? '企业' : '个人'}</span>
                                    <span>{orderData.invoice.tax_id}</span>
                                    <span>{orderData.invoice.enterprise_name || orderData.invoice.body_name}</span>
                                </div>
                            </div>
                            <div className="expenses expenses-news">
                                <div className="expenses-top">
                                    <span>开户银行</span>
                                    <span>银行账号</span>
                                    <span>企业地址</span>
                                    <span>企业电话</span>
                                </div>
                                <div className="expenses-detail">
                                    <span>{orderData.invoice.bank}</span>
                                    <span>{orderData.invoice.bank_card_no}</span>
                                    <span>{orderData.invoice.enterprise_addr}</span>
                                    <span>{orderData.invoice.enterprise_phone}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                {/*删除订单弹窗*/}
                {DeletePopup && (
                    <HandleModal
                        visible={DeletePopup}
                        closable
                        footer={footer}
                        content={OrderManager.del_order}
                        onOk={this.deleteOrder}
                        onCancel={this.ClosePopups}
                    />
                )}
                {/*关闭订单弹窗*/}
                {getClose && (
                    <ClosePop close={this.ClosePopups} masterSheet={this.closeOrder}/>
                )}
                {/*物流弹窗*/}
                {LogisticsPopup && (
                    <Logistics
                        visible={LogisticsPopup}
                        onCancel={this.ClosePopups}
                        orderId={orderId}
                    />
                )}
                {/*发货订单弹窗*/}
                {deliveryPopup && (
                    <HandleModal
                        className="delivery-detail-send"
                        visible={deliveryPopup}
                        closable
                        title="物流信息"
                        footer={footer}
                        content={logisticsr}
                        onOk={this.deliveryOrder}
                        onCancel={this.ClosePopups}
                    />
                )}
            </div>
        );
    }
}

export default DeliveryDetail;
