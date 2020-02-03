/**
 * 到店自提详情页 赵志强
 */
import './Detail.less';
import './PickupDetail.less';
import {Steps, Row, Button, Col, message} from 'antd';
import HandleModal from '../../../common/handle-modal/HandleModal';

const {Step} = Steps;
const {api} = Configs;
const {appHistory, tengXunIm} = Utils;

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

class PickupDetail extends BaseComponent {
    state = {
        DeletePopup: false, //删除订单弹窗
        orderId: '', //当前详情页订单iD
        type: 0, //判断商家状态 0提交订单 1支付订单 3到店核销 4完成评价
        orderData: [] //订单详情列表参数
    }

    componentDidMount() {
        this.orderDetail();
    }

    //获取订单详情数据
    orderDetail = () => {
        const id = this.props.location.search.split('=')[1];
        this.fetch(api.selfOrderDetail, {method: 'POST',
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

    //删除订单窗口
    delPopup = () => {
        this.setState({
            DeletePopup: true
        });
    }

    //关闭订单弹窗 关闭删除订单窗口
    ClosePopups = () => {
        this.setState({
            DeletePopup: false
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
                            appHistory.replace('/order/offline-pickup');
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

    //跳转查看评价
    skipAssesss = () => {
        appHistory.replace('/order/evaluation');
    }

    render() {
        const {type, orderData, DeletePopup} = this.state;
        //删除订单按钮
        const footer = (
            <div>
                <Button
                    key="cancel"
                    onClick={this.ClosePopups}
                >
                    取消
                </Button>
                <Button
                    key="submit"
                    type="primary"
                    onClick={this.deleteOrder}
                >
                    确定
                </Button>
            </div>
        );
        return (
            <div className="page order-management">
                <div className="delivery-detail">
                    <div className="detail-step">
                        <Row span={24} className="step" initia={0}>
                            <Steps current={type} labelPlacement="vertical" className="step-info">
                                <Step className="activate" title="提交订单" description={orderData.crtdate || ''} icon={<span type="user" className="icon icon-one"/>}/>
                                <Step className={type >= 1 ? 'activate' : 'not-activate'} title="支付订单" description={orderData.pay_date === '0' ? '' : orderData.pay_date} icon={<span type="solution" className="icon icon-two"/>}/>
                                <Step className={type >= 3 ? 'activate' : 'not-activate'} title="到店核销" description={orderData.recive_date === '0' ? '' : orderData.recive_date} icon={<span type="smile-o" className="icon icon-four"/>}/>
                                {/* <Step className={type >= 4 ? 'activate' : 'not-activate'} title="完成评价" description={orderData.pingjia_time === '0' ? '' : orderData.pingjia_time} icon={<span type="smile-o" className="icon icon-five"/>}/> */}
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
                        {(type === 4 || type === 3) && (
                            <div className="order-btn">
                                {/* <div className="order-text" onClick={this.skipAssesss}>查看评价</div> */}
                                <Button className="btn-delete" onClick={this.delPopup}>删除订单</Button>
                            </div>
                        )}
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
                                    <Col span={6} className="list-right">收货人信息</Col>
                                </Row>
                            </div>
                            <div className="list-bottom">
                                <Row className="list-touch">
                                    <Col span={14}>
                                        {orderData.pr_list && orderData.pr_list.map((item) => (
                                            <div key={item.id} className="orderList">
                                                <Col span={13} className="list-touch-bottom" style={{height: 128 + 'px'}}>
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
                                                <Col span={3} className="list-touch-bottom" style={{height: 128 + 'px'}}>{'￥' + item.single_price}</Col>
                                                <Col span={3} className="list-touch-bottom" style={{height: 128 + 'px'}}>{item.single_deposit}</Col>
                                                <Col span={2} className="list-touch-bottom" style={{height: 128 + 'px'}}>{item.num}</Col>
                                                <Col span={3} className="list-touch-bottom" style={{height: 128 + 'px'}}>{'￥' + item.price}</Col>
                                            </div>
                                        ))}
                                    </Col>
                                    {orderData.pr_list && (
                                        <Col span={4} className="list-touch-bottom" style={{height: 128 * orderData.pr_list.length + 'px'}}>
                                            {/*1-cam余额，2-微信，3-支付宝*/}
                                            {payType.map((item) => (
                                                (item.index === orderData.pay_type) ? (
                                                    <div key={item.index}>{item.title}</div>
                                                ) : (null)
                                            ))}
                                        </Col>
                                    )}
                                    {orderData.pr_list && (
                                        <Col span={6} className="list-touch-bottom" style={{height: 128 * orderData.pr_list.length + 'px'}}>
                                            <div>
                                                <div>{'预约人：' + orderData.nickname}</div>
                                                <div className="phone">{orderData.linktel}</div>
                                                <div>
                                                    <div>预约时间</div>
                                                    <div>
                                                        {orderData.white_start_time}
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                    )}
                                </Row>
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
                        <div className="expensesr expenses">
                            <div className="expenses-top">
                                <span>商品合计</span>
                                <span>优惠金额</span>
                                <span>应付金额</span>
                                <span>实付金额</span>
                            </div>
                            <div className="expenses-detail">
                                <span>￥{orderData.price}</span>
                                <span>-￥{orderData.discount_money}</span>
                                <span>￥{orderData.price}</span>
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
                        content="确定删除该订单!"
                        onOk={this.deleteOrder}
                        onCancel={this.ClosePopups}
                    />
                )}
            </div>
        );
    }
}

export default PickupDetail;
