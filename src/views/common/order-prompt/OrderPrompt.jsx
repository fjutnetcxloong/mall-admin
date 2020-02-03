/**
 * 订单模块弹出框
 */
import PropTypes from 'prop-types';
import './OrderPrompt.less';
import {Input, Table, Button, message} from 'antd';

const {api} = Configs;

class OrderPrompt extends BaseComponent {
    state = {
        area: '', //地区
        indeterminate: false,
        checked1: false,
        checkAll: false,
        OffCode: null, //核销码
        orderList: [], //核销列表
        loading: false
    };

    static propTypes = {
        close: PropTypes.func
    };

    //组件API默认值
    static defaultProps = {
        close() {} //关闭弹窗
    };

    componentDidMount() {
        console.log(this.props.allProvince);
    }

    //关闭弹窗
    close = () => {
        this.props.close();
    }

    //填写核销码
    getOffCode = (res) => {
        this.setState({
            OffCode: res.target.value
        });
    }

    //列表结构
    columns = [
        {
            title: '商品详情',
            dataIndex: 'order_no',
            className: 'first-column',
            render: (data, value) => (
                <div className="goods">
                    <img className="goods-img" src={value.pr_picpath} alt=""/>
                    <div className="goods-title">
                        <div className="goods-head">{value.pr_title}</div>
                        <div className="goods-specs">
                            {value.property_content.map((items) => (
                                <span className="specs">{items}</span>
                            ))}
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: '单价',
            // className: 'column-money',
            dataIndex: 'single_price'
        },
        {
            title: '记账量',
            dataIndex: 'deposit'
        },
        {
            title: '数量',
            dataIndex: 'num'
        },
        {
            title: '商品小计',
            dataIndex: 'price'
        },
        {
            title: '商品合计',
            dataIndex: '',
            render: (value, row, index) => {
                const {orderList} = this.state;
                const obj = {
                    children: orderList[0].all_price,
                    props: {}
                };
                if (index === 0) {
                    obj.props.rowSpan = orderList[0].pr_list.length;
                } else {
                    obj.props.rowSpan = 0;
                }
                return obj;
            }
        },
        {
            title: '订单状态',
            dataIndex: '',
            rowSpan: 0,
            render: (value, row, index) => {
                const {orderList} = this.state;
                const obj = {
                    children: orderList[0].status_msg,
                    props: {}
                };

                if (index === 0) {
                    obj.props.rowSpan = orderList[0].pr_list.length;
                } else {
                    obj.props.rowSpan = 0;
                }
                return obj;
            }
        }
    ];

    //核销搜索
    confirm = () => {
        this.setState({
            loading: true
        });
        const {OffCode} = this.state;
        if (OffCode) {
            this.fetch(api.mallSelfOrder, {method: 'POST',
                data: {
                    page: 1,
                    pagesize: 1,
                    count: -1,
                    status: 1,
                    if_search: 1,
                    code: OffCode,
                    type: 0
                }}).subscribe(res => {
                if (res.status === 0) {
                    this.setState({
                        orderList: res.list
                    });
                    if (res.list.length === 0) {
                        message.info('未找到该订单');
                    }
                }
                this.setState({
                    loading: false
                });
            });
        } else {
            message.info('请输入核销码');
        }
    }

    //核销
    afterOrder = () => {
        const {orderList, OffCode} = this.state;
        this.fetch(api.Chkcode, {method: 'POST',
            data: {
                order_id: orderList[0].id,
                code: OffCode
            }}).subscribe(res => {
            if (res.status === 0) {
                message.info('成功核销', () => {
                    this.props.close();
                });
            }
        });
    }

    render() {
        const {orderList, loading} = this.state;
        return (
            <div className="area-selection-hx">
                <div className="shade"/>
                <div className="content">
                    <div className="upper">
                        <div className="upper-text">快捷核销</div>
                        <span className="icon" onClick={this.close}/>
                    </div>
                    <div className="content-wrap">
                        {/*搜索框*/}
                        <div className="content-seach">
                            <div>核销验证码:</div>
                            <div className="seach">
                                <Input
                                    onChange={this.getOffCode}
                                    className="basis-input"
                                    placeholder="请输入"
                                />
                                <div className="of-sth-btn" onClick={this.confirm}>确认</div>
                            </div>
                        </div>
                        {
                            orderList[0] && orderList[0].pr_list && orderList[0].pr_list.length > 0
                            && (
                                <Table
                                    className="order-prompt-table"
                                    columns={this.columns}
                                    dataSource={orderList[0].pr_list}
                                    pagination={false}
                                    loading={loading}
                                    scroll={{y: 300}}
                                />
                            )
                        }
                        {orderList[0] &&   (
                            <div className="list-bottom-root">
                                <div>备注：{orderList[0] && orderList[0].remarks}</div>
                            </div>
                        )}
                        {orderList[0] && orderList[0].status === '1' && (
                            <div className="order-btn-bottom">
                                <Button type="primary" className="btn-after" onClick={this.afterOrder}>核销</Button>
                            </div>
                        )}
                        {/*订单列表*/}
                        {/* {(orderList && orderList.length > 0) && (
                            <div className="order-list">
                                <div className="order-status">
                                    <div className="identifier">订单号： {orderList[0].order_no}</div>
                                    0-没有支付方式 1-cam余额，2-微信，3-支付宝
                                    {orderList[0].pay_type === '1' && (
                                        <div className="payment">支付方式： CAM余额</div>
                                    )}
                                    {orderList[0].pay_type === '2' && (
                                        <div className="payment">支付方式： 微信</div>
                                    )}
                                    {orderList[0].pay_type === '3' && (
                                        <div className="payment">支付方式： 支付宝</div>
                                    )}
                                </div>
                                <div className="order-detail">
                                    <div className="detail-top">
                                        <Row className="row-list">
                                            <Col span={7} className="row-list-one">商品详情</Col>
                                            <Col span={3}>单价</Col>
                                            <Col span={3}>记账量</Col>
                                            <Col span={2}>数量</Col>
                                            <Col span={3}>商品小计</Col>
                                            <Col span={3}>商品合计</Col>
                                            <Col span={3}>订单状态</Col>
                                        </Row>
                                    </div>
                                    <div>
                                        <div className="Tabs-frame-list">
                                            <div className="list-bottom">
                                                <Row className="list-touch">
                                                    {orderList[0].pr_list.map((item) => (
                                                        <Col span={18}>
                                                            <div className="orderList">
                                                                <Col span={10} className="list-touch-bottom" style={{height: 128 + 'px'}}>
                                                                    <div className="goods-wrap">
                                                                        <div className="goods">
                                                                            <img className="goods-img" src={item.pr_picpath} alt=""/>
                                                                            <div className="goods-title">
                                                                                <div className="goods-head">{item.pr_title}</div>
                                                                                <div className="goods-specs">
                                                                                    {item.property_content.map((items) => (
                                                                                        <span className="specs">{items}</span>
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </Col>
                                                                <Col span={4} className="list-touch-bottom" style={{height: 128 + 'px'}}>￥{item.price}</Col>
                                                                <Col span={4} className="list-touch-bottom" style={{height: 128 + 'px'}}>{item.deposit}</Col>
                                                                <Col span={2} className="list-touch-bottom" style={{height: 128 * 1 + 'px'}}>￥{item.num}</Col>
                                                                <Col span={4} className="list-touch-bottom" style={{height: 128 * 1 + 'px'}}>￥{item.price}</Col>
                                                            </div>
                                                        </Col>
                                                    ))}
                                                    <Col span={3} className="list-touch-bottom" style={{height: 128 * 1 + 'px'}}>￥{orderList[0].all_price}</Col>
                                                    <Col span={3} className="list-touch-bottom" style={{height: 128 * 1 + 'px'}}>
                                                        <div className="order-text">{orderList[0].status_name}</div>
                                                    </Col>
                                                </Row>
                                            </div>
                                            <div className="list-bottom-root">
                                                <div>备注：{orderList[0].remarks}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {orderList[0].status === '1' && (
                                    <div className="order-btn-bottom">
                                        <Button type="primary" className="btn-after" onClick={this.afterOrder}>核销</Button>
                                    </div>
                                )}
                            </div>
                        )} */}
                    </div>
                </div>
            </div>
        );
    }
}

export default OrderPrompt;
