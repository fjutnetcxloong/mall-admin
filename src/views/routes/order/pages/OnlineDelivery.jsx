/**
 * 网店发货
 */
import '../index.less';
import {Tabs, Row, Col, Checkbox, Button, Input, Cascader, Skeleton, Empty, Spin} from 'antd';
import Search from '../components/TopSearch';
import ClosePop from '../components/ClosePrompt';
import HandleModal from '../../../common/handle-modal/HandleModal';
import ErrPage from '../../../common/default-page/NoRoot';
// import NullData from '../../../common/default-page/NullData';
import Logistics from '../components/LogisticsPrompt';
import HandlePage from '../../../common/handle-page/HandlePage';
import OperateDerive from '../components/OperateDerive';

const {TabPane} = Tabs;
const {api} = Configs;
const {showInfo, successMsg, appHistory, tengXunIm} = Utils;

//列表参数
//-1 全部0 待付款1 待发货2 已发货4 已签收3交易完成5 售后 10 交易关闭
const navs = [
    {
        name: '全部订单',
        key: -1
    },
    {
        name: '待付款',
        key: 0
    },
    {
        name: '待发货',
        key: 1
    },
    {
        name: '已发货',
        key: 2
    },
    {
        name: '已签收',
        key: 4
    },
    {
        name: '交易完成',
        key: 3
    },
    {
        name: '交易关闭',
        key: 10
    }
    // {
    //     name: '售后',
    //     key: 5
    // }
];

const btnText = [
    {
        title: '待付款',
        index: '0'
    },
    {
        title: '待发货',
        index: '1'
    },
    {
        title: '已发货',
        index: '2'
    },
    {
        title: '交易完成',
        index: '3'
    },
    {
        title: '买家已评价',
        index: '4'
    },
    {
        title: '买家已签收',
        index: '5'
    },
    {
        title: '交易关闭',
        index: '10'
    },
    {
        title: '交易关闭',
        index: '12'
    },
    {
        title: '交易关闭',
        index: '13'
    }
];

const radioStatus = []; //列表数组当前点击选中状态 checkbox 备用数据

class OnlineDelivery extends BaseComponent {
    state = {
        skeleton: true, //内容骨架
        ClosePopup: false, //关闭订单弹窗
        DeletePopup: false, //删除订单弹窗
        deliveryPopup: false, //发货订单弹窗
        LogisticsPopup: false, //查看物流弹窗
        logistics: [], //物流信息数组
        logisticsName: '', //选中物流名称
        logisticsId: null, //选中物流id
        numbers: '', //物流单号
        page: 1, //页数 、第几页
        count: -1, //总条数
        pageSize: 10, //每页条数
        status: -1, //-1 全部0 待付款1 待发货2 已发货3 已签收4 交易完成12 交易关闭
        indeterminate: false, //在实现全选效果时，你可能会用到 indeterminate 属性。
        checkAll: false, //全局选中
        checkedList: [], //checkbox选中数组
        dateTerm: [], //筛选日期 起始、终止
        orderDate: null, //搜索保存数据
        orderList: [], //订单列表
        orderId: null, //选中订单id
        derivationId: 0, //导出id判断 1导出全部  2导出选定
        loading: false, //懒加载动画
        errPage: false
    }

    componentDidMount() {
        const statusr = this.props.location.search.split('=')[1];
        this.setState({
            status: statusr || -1
        }, () => {
            //搜索列表接口
            this.searchList();
        });
        //物流获取
        this.logistics();
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

    //搜索列表接口
    searchList = (data) => {
        console.log(data);
        const {page, count, pageSize, status} = this.state;
        //清空数组 不全选
        radioStatus.length = 0;
        this.setState({
            checkedList: [],
            checkAll: false,
            loading: true
        });
        //判断是否有筛选条件
        let record = {};
        if (data) {
            const typeStatus = Number(data.statusr) + 1;
            record = {
                page: data.page || page,
                count: data.count || count,
                status: data.status || status,
                pagesize: pageSize,
                pr_title: data.goodsName,
                order_no: data.orderNumber,
                time: `${data.datest ? data.datest : ''}${data.datest ? ',' : ''}${data.dateed ? data.dateed : ''}`,
                pingjia_type: typeStatus,
                buyer_no: data.buyerName,
                if_search: 1,
                if_express: 1
            };
            this.setState({
                orderDate: data,
                page: data.page || page,
                loading: true
            });
        } else {
            record = {
                page,
                count,
                status,
                pagesize: pageSize,
                if_search: 1,
                if_express: 1
            };
        }
        this.fetch(api.mallOrder, {
            method: 'POST',
            data: record
        }).subscribe(res => {
            if (res && res.status === 0) {
                if (res.data && res.data.status === 1) {
                    this.setState({
                        errPage: true
                    });
                } else {
                    this.setState({
                        orderList: res.list,
                        count: res.count,
                        skeleton: false,
                        loading: false
                    });
                    // 全选 全不选
                    for (let i = 0; i < res.list.length; i++) {
                        radioStatus.push(i);
                    }
                }
            }
        });
    }

    //导航条切换 索引
    onCelect = (key) => {
        //-1 全部   0 待付款   1 待发货   2 已发货   4 已签收  3 交易完成   5 售后   12 交易关闭
        this.setState({
            orderDate: {},
            count: -1,
            page: 1,
            status: key
        }, () => {
            this.searchList();
        });
    }

    //批量操作选择器
    tabsCallback = (value) => {
        this.setState({
            derivationId: value
        });
    }

    //单个选中列表Checkbox
    addSelect = (index) => {
        this.setState({
            checkedList: index,
            indeterminate: false, //!!index && index < radioStatus.length
            checkAll: index.length === radioStatus.length
        });
    }

    //批量操作选中列表Checkbox
    onChangeSelect = (e) => {
        this.setState({
            checkedList: e.target.checked ? radioStatus : [],
            indeterminate: false,
            checkAll: e.target.checked
        });
    }

    //分页器 获取页数
    pageChange = (page) => {
        const {orderDate} = this.state;
        if (orderDate) {
            orderDate.page = page;
        }
        window.scrollTo(0, 0);
        this.setState({
            orderDate,
            page
        }, () => {
            this.searchList(orderDate);
        });
    }

    //分页器 获取每页条数
    pageCountChange = (current, size) => {
        // const {orderDate} = this.state;
        window.scrollTo(0, 0);
        this.setState({
            page: current,
            pageSize: size
        }, () => {
            this.searchList({page: 1});
        });
    }

    //删除订单窗口
    delPopup = (id) => {
        this.setState({
            orderId: id,
            DeletePopup: true
        });
    }

    //打开关闭订单弹窗
    ClosePopup = (id) => {
        this.setState({
            orderId: id,
            ClosePopup: true
        });
    }

    //发货订单窗口
    logisticsPopup = (id) => {
        this.setState({
            orderId: id,
            deliveryPopup: true
        });
    }

    //查看物流
    logisticsr = (id) => {
        this.setState({
            orderId: id,
            LogisticsPopup: true
        });
    }

    //关闭窗口
    ClosePopups = () => {
        this.setState({
            ClosePopup: false,
            DeletePopup: false,
            deliveryPopup: false,
            LogisticsPopup: false
        });
    }

    //确认关闭订单
    closeOrder = (reason) => {
        const {orderId, orderDate} = this.state;
        this.setState({
            ClosePopup: false
        }, () => {
            this.fetch(api.closeOrder, {
                method: 'POST',
                data: {
                    order_id: orderId,
                    reason
                }
            }).subscribe(res => {
                if (res) {
                    if (res.status === 0) {
                        successMsg('成功关闭订单', () => {
                            this.searchList(orderDate);
                        });
                    }
                }
            });
        });
    }

    //确认删除订单
    deleteOrder = () => {
        const {orderId, orderDate} = this.state;
        this.setState({
            DeletePopup: false
        }, () => {
            this.fetch(api.deleteOrder, {
                method: 'POST',
                data: {
                    order_id: orderId
                }
            }).subscribe(res => {
                if (res) {
                    if (res.status === 0) {
                        successMsg('删除成功', () => {
                            this.searchList(orderDate);
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

    //确认发货
    deliveryOrder = () => {
        const {orderId, numbers, logisticsId, logisticsName, orderDate} = this.state;
        if ((!logisticsName || !logisticsId)) {
            showInfo('请选择物流公司');
        } else if (!numbers) {
            showInfo('请填写物流单号!');
        } else {
            this.setState({
                deliveryPopup: false
            }, () => {
                this.fetch(api.deliverGoods, {
                    method: 'POST',
                    data: {
                        order_id: orderId,
                        express_id: logisticsId,
                        express_name: logisticsName,
                        express_no: numbers
                    }
                }).subscribe(res => {
                    if (res) {
                        if (res.status === 0) {
                            this.searchList(orderDate);
                        }
                    }
                });
            });
        }
    }

    //跳转到详情页
    skipDetail = (id) => {
        appHistory.push(`/order/online-delivery/delivery-detail?id=${id}`);
    }

    //跳转到售后详情页
    serviceDetail = (id) => {
        appHistory.push(`/order/online-delivery/purchase-detail?id=${id}`);
    }

    render() {
        const {
            checkAll, indeterminate, checkedList,
            ClosePopup, count, page, orderList, DeletePopup,
            deliveryPopup, logistics, status, LogisticsPopup,
            orderId, skeleton, loading, pageSize, errPage
        } = this.state;

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
            <div className="online-delivery">
                <div className="logistics">
                    <div className="company">
                        <div className="company-name">物流公司:</div>
                        <div>
                            <Cascader
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
            </div>
        );

        return (
            <React.Fragment>
                {
                    !errPage ? (
                        <div className="page online-delivery">
                            <Skeleton active loading={skeleton}>
                                {/*筛选查询*/}
                                <Search orderList={this.searchList}/>
                            </Skeleton>
                            <Skeleton active loading={skeleton}>
                                <Spin spinning={this.state.loading}>
                                    {/*列表*/}
                                    <div className="onlineDelivery-wrap">
                                        <div className="onlineDelivery-top">
                                            <div className="top-btn-wrap">
                                                <Tabs loading={loading} animated={false} onChange={this.onCelect} activeKey={status.toString()}>
                                                    {navs.map((item, index) => (
                                                        <TabPane tab={item.name} key={item.key}>
                                                            <div>
                                                                <div className="Tabs-frame">
                                                                    <div className="Tabs-top">
                                                                        <Row className="Tabs-top-wrap">
                                                                            <Col span={6}>
                                                                                <div className="Tabs-top-right">
                                                                                    <div>
                                                                                        <Checkbox
                                                                                            indeterminate={indeterminate}
                                                                                            checked={checkAll}
                                                                                            onChange={
                                                                                                this.onChangeSelect
                                                                                            }
                                                                                        >
                                                                                            选中当页
                                                                                        </Checkbox>
                                                                                    </div>
                                                                                    <div className="Tabs-top-right-text">产品详情</div>
                                                                                </div>
                                                                            </Col>
                                                                            <Col span={3}>单价</Col>
                                                                            <Col span={1}>数量</Col>
                                                                            {/* <Col span={2}>售后</Col> */}
                                                                            <Col span={5}>实付金额</Col>
                                                                            <Col span={3}>收货信息</Col>
                                                                            <Col span={3}>订单状态</Col>
                                                                            <Col span={3}>操作</Col>
                                                                        </Row>
                                                                    </div>
                                                                </div>
                                                                {orderList.length !== 0 ? (
                                                                    <Checkbox.Group onChange={this.addSelect} value={checkedList}>
                                                                        {orderList.map((items, value) => (
                                                                            <div className="Tabs-frame-list" key={items.order_no}>
                                                                                <div className="list-top">
                                                                                    <Row className="list-top-row">
                                                                                        <Col span={1}>
                                                                                            <Checkbox value={value}/>
                                                                                        </Col>
                                                                                        <Col span={8}>
                                                                                            订单号:
                                                                                            {items.order_no}
                                                                                        </Col>
                                                                                        <Col span={3} className="list-time"/>
                                                                                        <Col span={1} className="list-date"/>
                                                                                        <Col span={7} className="list-order"/>
                                                                                        <Col span={4} className="list-right">UID: {items.no}<span onClick={() => tengXunIm(1, items.no, 2, items.nickname, items.avatarUrl)} className="icon icon-im"/></Col>
                                                                                    </Row>
                                                                                </div>
                                                                                <div className="list-bottom">
                                                                                    <Row className="list-touch">
                                                                                        <Col span={12}>
                                                                                            {items.pr_list.map((data) => (
                                                                                                <div key={data} className="orderList">
                                                                                                    <Col span={14}>
                                                                                                        <div className="list-touch-bottom" style={{height: 128 + 'px'}}>
                                                                                                            <div className="goods-wrap">
                                                                                                                <div className="goods">
                                                                                                                    <img className="goods-img" src={data.pr_picpath} alt=""/>
                                                                                                                    <div className="goods-title">
                                                                                                                        <div className="goods-head">{data.pr_title}</div>
                                                                                                                        <div className="goods-specs">
                                                                                                                            {data.property_content.map((datas) => (
                                                                                                                                <span className="specs" key={datas}>{datas}</span>
                                                                                                                            ))}
                                                                                                                        </div>
                                                                                                                        <div className="goods-num">{data.pr_no}</div>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </Col>
                                                                                                    <Col span={5}>
                                                                                                        <div className="list-touch-bottom" style={{height: 128 + 'px'}}>
                                                                                                            {'￥' + data.price}
                                                                                                        </div>
                                                                                                    </Col>
                                                                                                    <Col span={5}>
                                                                                                        <div className="list-touch-bottom" style={{height: 128 + 'px'}}>
                                                                                                            {data.num}
                                                                                                        </div>
                                                                                                    </Col>
                                                                                                    {/* <Col span={4}>
                                                                                                        <div className="list-touch-bottom" style={{height: 128 + 'px'}}>
                                                                                                            {data.return_types && (
                                                                                                                <div className="service-wrap">
                                                                                                                    <div className="colors">{data.return_name}</div>
                                                                                                                    <div>{data.return_types}</div>
                                                                                                                    <div className="service-detail" onClick={() => this.serviceDetail(data.return_id)}>售后详情</div>
                                                                                                                </div>
                                                                                                            )}
                                                                                                        </div>
                                                                                                    </Col> */}
                                                                                                </div>
                                                                                            ))}
                                                                                        </Col>
                                                                                        <Col span={2}>
                                                                                            <div className="list-touch-bottom" style={{height: 128 * items.pr_list.length + 'px'}}>
                                                                                                {'￥' + items.all_price}
                                                                                            </div>
                                                                                        </Col>
                                                                                        <Col span={4}>
                                                                                            <div className="list-touch-bottom" style={{height: 128 * items.pr_list.length + 'px'}}>
                                                                                                <div>
                                                                                                    <div>{items.linkname}</div>
                                                                                                    <div className="phone">{items.linktel}</div>
                                                                                                    <div>{items.area + items.address}</div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </Col>
                                                                                        <Col span={3}>
                                                                                            {/*  //0未付款;1已付款;2已发货;3已收货（未评价）;4交易成功（已评价） 5 已签收  12 交易关闭 13商家关闭订单*/}
                                                                                            <div className="list-touch-bottom" style={{height: 128 * items.pr_list.length + 'px'}}>
                                                                                                {btnText.map((itemsr) => (
                                                                                                    (itemsr.index === items.status) ? (
                                                                                                        <div className="order-status" key={itemsr.index}>
                                                                                                            <div>{itemsr.title}</div>
                                                                                                            <div className="status-remind">{items.status_msg} {itemsr.index === '0' || itemsr.index === '3' || itemsr.index === '5' ? items.restime : ''}</div>
                                                                                                            {items.status === '1' && items.tip_deliver_num > 0 && <span className="status-remind">买家提醒发货</span>}
                                                                                                        </div>
                                                                                                    ) : (null)
                                                                                                ))}
                                                                                            </div>
                                                                                        </Col>
                                                                                        <Col span={3}>
                                                                                            <div className="list-touch-bottom list-lasts-childs" style={{height: 128 * items.pr_list.length + 'px'}}>
                                                                                                {/*  //0未付款;1已付款;2已发货;3已收货（未评价）;4交易成功（已评价） 5 已签收  12 13 交易关闭*/}
                                                                                                <div className="order-btn">
                                                                                                    {(items.status === '2' || items.status === '3' || items.status === '4' || items.status === '5') && (
                                                                                                        <div className="order-text" onClick={() => this.logisticsr(items.id)}>查看物流</div>
                                                                                                    )}
                                                                                                    {(items.status === '1') && (
                                                                                                        <div className="order-text" onClick={() => this.logisticsPopup(items.id)}>发货</div>
                                                                                                    )}
                                                                                                    <Button type="primary" className="btn-detail" onClick={() => this.skipDetail(items.id)}>订单详情</Button>
                                                                                                    {(items.status === '3' || items.status === '4' || items.status === '10' || items.status === '13' || items.status === '5' || items.status === '12') && (
                                                                                                        <Button className="btn-delete" onClick={() => this.delPopup(items.id)}>删除订单</Button>
                                                                                                    )}
                                                                                                    {/* {(items.status === '0' || items.status === '1') && (
                                                                                                        <Button className="btn-delete" onClick={() => this.ClosePopup(items.id)}>关闭订单</Button>
                                                                                                    )} */}
                                                                                                </div>
                                                                                            </div>
                                                                                        </Col>
                                                                                    </Row>
                                                                                </div>
                                                                                <div className="list-bottom-root">
                                                                                    <div>备注：{items.remarks}</div>
                                                                                    <div>
                                                                                        下单时间：
                                                                                        {items.crtdate[0] + '  ' + items.crtdate[1]}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </Checkbox.Group>
                                                                ) : (
                                                                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>
                                                                )}
                                                            </div>
                                                        </TabPane>
                                                    ))}
                                                </Tabs>
                                            </div>
                                            {/*批量操作*/}
                                            <div className="top-select">
                                                <OperateDerive
                                                    orderList={orderList}
                                                    checkedList={checkedList}
                                                    ifExpress={1}
                                                />
                                            </div>
                                        </div>
                                        {/*分页器*/}
                                        <HandlePage
                                            page={page}
                                            size={pageSize}
                                            count={Number(count)}
                                            onShowSizeChange={this.pageCountChange}
                                            onChangePage={this.pageChange}
                                        />
                                        {/*关闭订单弹窗*/}
                                        {ClosePopup && (
                                            <ClosePop close={this.ClosePopups} masterSheet={this.closeOrder}/>
                                        )}
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
                                        {/*发货订单弹窗*/}
                                        {deliveryPopup && (
                                            <HandleModal
                                                visible={deliveryPopup}
                                                closable
                                                title="物流信息"
                                                footer={footer}
                                                content={logisticsr}
                                                onOk={this.deliveryOrder}
                                                onCancel={this.ClosePopups}
                                            />
                                        )}
                                        {/*物流弹窗*/}
                                        {LogisticsPopup && (
                                            <Logistics
                                                visible={LogisticsPopup}
                                                onCancel={this.ClosePopups}
                                                orderId={orderId}
                                            />
                                        )}
                                    </div>
                                </Spin>
                            </Skeleton>
                        </div>
                    ) : (<ErrPage/>)
                }
            </React.Fragment>
        );
    }
}

export default OnlineDelivery;
