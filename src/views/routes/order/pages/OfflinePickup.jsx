/**
 * 到店自提
 */
import './OfflinePickup.less';
import '../index.less';
import {Tabs, Row, Col, Checkbox, Button, Input, Skeleton, Empty, Spin} from 'antd';
import Search from '../components/TopSearch';
import Prompt from '../../../common/order-prompt/OrderPrompt';
import ClosePop from '../components/ClosePrompt';
import HandleModal from '../../../common/handle-modal/HandleModal';
import ErrPage from '../../../common/default-page/NoRoot';
// import NullData from '../../../common/default-page/NullData';
import HandlePage from '../../../common/handle-page/HandlePage';
import OperateDerive from '../components/OperateDerive';

const {TabPane} = Tabs;
const {api} = Configs;
const {appHistory, showInfo, successMsg, tengXunIm} = Utils;

//列表参数
//-1全部 0未付款;1待核销;3、4交易完成;5 售后 10、13交易关闭
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
        name: '待核销',
        key: 1
    },
    {
        name: '交易完成',
        key: 3
    },
    {
        name: '交易关闭',
        key: 10
    }
];

//核销状态
const navsAfter = [
    {
        name: '全部',
        key: 0
    },
    {
        name: '待消费',
        key: 3
    },
    {
        name: '待核销',
        key: 2
    }
];

const radioStatus = []; //列表数组当前点击选中状态 checkbox 备用数据

class OfflinePickup extends BaseComponent {
    state = {
        skeleton: true, //内容骨架
        ClosePopup: false, //关闭订单弹窗
        DeletePopup: false, //删除订单弹窗
        AfterPopup: false, //核销订单弹窗
        orderPopup: false, //状态 订单核销弹出框
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
        OffCode: null, //核销码
        derivationId: 0, //导出id判断 1导出全部  2导出选定
        type: 0, //   核销导航条 0全部 2待自提 4待使用
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
    }

    //搜索列表接口
    searchList = (data) => {
        const {page, count, pageSize, status, type} = this.state;
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
            record = {
                page: data.page || page,
                count: data.count || count,
                status: data.status || status,
                pagesize: pageSize,
                pr_title: data.goodsName,
                order_no: data.orderNumber,
                time: `${data.datest ? data.datest : ''}${data.datest ? ',' : ''}${data.dateed ? data.dateed : ''}`,
                buyer_no: Number(data.buyerName),
                if_search: 1,
                type,
                if_express: 2
            };
            this.setState({
                orderDate: data,
                page: data.page || page
            });
        } else {
            record = {
                page,
                count,
                status,
                type,
                pagesize: pageSize,
                if_search: 1,
                if_express: 2
            };
        }
        this.fetch(api.mallSelfOrder, {method: 'POST',
            data: record}).subscribe(res => {
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
        //-1全部 0未付款;1待核销;3、4交易完成;5 售后; 10、13交易关闭
        this.setState({
            orderDate: {},
            count: -1,
            type: 0,
            status: key
        }, () => {
            this.searchList();
        });
    }

    //核销导航条
    onCelectAfter = (key) => {
        //0全部 2待自提 4待使用
        const {type} = this.state;
        if (type === key) return;
        this.setState({
            orderDate: {},
            count: -1,
            type: key
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
        }, () => {
            console.log(this.state.checkedList);
        });
    }

    //批量操作选中列表Checkbox
    onChangeSelect = (e) => {
        this.setState({
            checkedList: e.target.checked ? radioStatus : [],
            indeterminate: false,
            checkAll: e.target.checked
        }, () => {
            console.log(this.state.checkedList);
        });
    }

    //分页器 获取页数
    pageChange = (page) => {
        const {orderDate} = this.state;
        window.scrollTo(0, 0);
        if (orderDate) {
            orderDate.page = page;
        }
        this.setState({
            orderDate,
            page
        }, () => {
            this.searchList(orderDate);
        });
    }

    //分页器 获取每页条数
    pageCountChange = (current, size) => {
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

    //核销订单窗口
    afterPopups = (id) => {
        this.setState({
            orderId: id,
            DeletePopup: true,
            AfterPopup: true
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

    //弹窗 核销弹窗
    verification = () => {
        this.setState({
            orderPopup: true
        });
    }

    //关闭窗口
    ClosePopups = () => {
        this.setState({
            ClosePopup: false,
            orderPopup: false,
            DeletePopup: false,
            AfterPopup: false
        });
    }

    //确认关闭订单
    closeOrder= (reason) => {
        const {orderId, orderDate} = this.state;
        this.setState({
            ClosePopup: false,
            count: -1
        }, () => {
            this.fetch(api.closeOrder, {method: 'POST',
                data: {
                    order_id: orderId,
                    reason
                }}).subscribe(res => {
                if (res) {
                    if (res.status === 0) {
                        successMsg('关闭成功', () => {
                            this.searchList(orderDate);
                        });
                    }
                }
            });
        });
    }

    //填写核销码
    getOffCode = (res) => {
        this.setState({
            OffCode: res.target.value
        });
    }

    //确认删除订单 确认核销订单
    deleteOrder = () => {
        const {orderId, orderDate, AfterPopup, OffCode} = this.state;
        //AfterPopup true 核销订单   false 删除订单
        if (AfterPopup) {
            if (OffCode) {
                this.setState({
                    AfterPopup: false,
                    DeletePopup: false,
                    count: -1
                }, () => {
                    this.fetch(api.aftersaleChkcode, {method: 'POST',
                        data: {
                            order_id: orderId,
                            code: OffCode
                        }}).subscribe(res => {
                        if (res) {
                            if (res.status === 0) {
                                successMsg('核销成功', () => {
                                    this.searchList(orderDate);
                                });
                            }
                        }
                    });
                });
            } else {
                showInfo('请输入核销码');
            }
        } else {
            this.setState({
                DeletePopup: false,
                count: -1
            }, () => {
                this.fetch(api.deleteOrder, {method: 'POST',
                    data: {
                        order_id: orderId
                    }}).subscribe(res => {
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
    }

    //跳转到详情页
    skipDetail = (id) => {
        appHistory.push(`/order/offline-pickup/pickup-detail?id=${id}`);
    }

    //跳转到售后详情页
    serviceDetail = (id) => {
        appHistory.push(`/order/online-delivery/purchase-detail?id=${id}`);
    }

    render() {
        const {
            checkAll, indeterminate, checkedList,
            ClosePopup, count, page, orderList, DeletePopup,
            orderPopup, AfterPopup, type, skeleton, pageSize, errPage,
            status
        } = this.state;

        //删除订单按钮 核销订单窗口
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

        //核销码表单
        const offCode = (
            <div className="online-delivery">
                <div className="logistics">
                    <div className="company">
                        <div className="company-name"><span className="red">*</span>核销验证码：</div>
                        <Input
                            className="basis-input"
                            type="text"
                            onChange={this.getOffCode}
                            placeholder="请输入客户的核销验证码"
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
                                <Search types={1} orderList={this.searchList}/>
                            </Skeleton>
                            <Skeleton active loading={skeleton}>
                                <Spin spinning={this.state.loading}>
                                    {/*列表*/}
                                    <div className="onlineDelivery-wrap">
                                        <div className="onlineDelivery-top">
                                            <div className="top-btn-wrap">
                                                <Tabs animated={false} onChange={this.onCelect} activeKey={status.toString()}>
                                                    {navs.map((item, index) => (
                                                        <TabPane tab={item.name} key={item.key}>
                                                            <div>
                                                                <div className="Tabs-frame">
                                                                    {index === 2 && (
                                                                        <div className="verification">
                                                                            {navsAfter.map((val) => (
                                                                                <div key={val.key} className={`verification-btn ${val.key === type ? 'verification-blue' : ''}`} onClick={() => this.onCelectAfter(val.key)}>{val.name}</div>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                    <div className="Tabs-top">
                                                                        <Row className="Tabs-top-wrap">
                                                                            <Col span={7}>
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
                                                                                    <div className="Tabs-top-right-text">商品信息</div>
                                                                                </div>
                                                                            </Col>
                                                                            <Col span={2}>单价</Col>
                                                                            <Col span={1} style={{marginLeft: '20px'}}>数量</Col>
                                                                            <Col span={2}>实付金额</Col>
                                                                            <Col span={4}>买家信息</Col>
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
                                                                                                    <Col span={4}>
                                                                                                        <div className="list-touch-bottom" style={{height: 128 + 'px'}}>
                                                                                                            {'￥' + data.price}
                                                                                                        </div>
                                                                                                    </Col>
                                                                                                    <Col span={2}>
                                                                                                        <div className="list-touch-bottom" style={{height: 128 + 'px'}}>
                                                                                                            {data.num}
                                                                                                        </div>
                                                                                                    </Col>
                                                                                                    {/* <Col span={4}>
                                                                                                        <div className="list-touch-bottom" style={{height: 128 + 'px'}}>
                                                                                                            {(data.return_types !== 0 || data.return_types) ? (
                                                                                                                <div className="service-wrap">
                                                                                                                    <div className="colors">{data.return_name}</div>
                                                                                                                    <div>{data.return_types}</div>
                                                                                                                    <div className="service-detail" onClick={() => this.serviceDetail(data.return_id)}>售后详情</div>
                                                                                                                </div>
                                                                                                            ) : (
                                                                                                                null
                                                                                                            )}
                                                                                                        </div>
                                                                                                    </Col> */}
                                                                                                </div>
                                                                                            ))}
                                                                                        </Col>
                                                                                        <Col span={1}>
                                                                                            <div className="list-touch-bottom" style={{height: 128 * items.pr_list.length + 'px', marginLeft: '-100px'}}>
                                                                                                {'￥' + items.all_price}
                                                                                            </div>
                                                                                        </Col>
                                                                                        <Col span={4}>
                                                                                            <div className="list-touch-bottom" style={{height: 128 * items.pr_list.length + 'px'}}>
                                                                                                <div>
                                                                                                    <div>{items.nickname}</div>
                                                                                                    <div className="phone">{items.linktel}</div>
                                                                                                    <div>
                                                                                                        <div>预约时间</div>
                                                                                                        <div>
                                                                                                            {items.white_start_time}
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </Col>
                                                                                        <Col span={3}>
                                                                                            <div className="list-touch-bottom" style={{height: 128 * items.pr_list.length + 'px'}}>
                                                                                                <div className="order-status">
                                                                                                    <div>{items.status_name}</div>
                                                                                                    <div className="status-remind">{items.restime}</div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </Col>
                                                                                        <Col span={3}>
                                                                                            {/*  //-1全部 0未付款;1待核销;3、4交易完成;10、13交易关闭*/}
                                                                                            <div className="list-touch-bottom list-lasts-childs" style={{height: 128 * items.pr_list.length + 'px'}}>
                                                                                                <div className="order-btn">
                                                                                                    {(items.status === '1' || (items.pr_list[0].return_status.status === '4' && items.status === '1')) && (
                                                                                                        <Button className="btn-after" onClick={() => this.afterPopups(items.id)}>核销</Button>
                                                                                                    )}
                                                                                                    <Button type="primary" className="btn-detail" onClick={() => this.skipDetail(items.id)}>订单详情</Button>
                                                                                                    {(items.status === '4' || items.status === '10' || items.status === '13' || items.status === '3') && (
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
                                                                                        {items.crtdate[0] + items.crtdate[1]}
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
                                            {/*核销订单*/}
                                            <div className="order-after">
                                                <div className="order-after-wrap" onClick={this.verification}>
                                                    快捷核销
                                                </div>
                                            </div>
                                            {/*批量操作*/}
                                            <div className="top-select">
                                                <OperateDerive
                                                    orderList={orderList}
                                                    checkedList={checkedList}
                                                    ifExpress={2}
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
                                        {/*删除订单弹窗  核销订单弹窗*/}
                                        {DeletePopup && (
                                            <HandleModal
                                                visible={DeletePopup}
                                                closable
                                                title={AfterPopup ? '核销订单' : ''}
                                                footer={footer}
                                                content={AfterPopup ? offCode : '确定删除该订单!'}
                                                onOk={this.deleteOrder}
                                                onCancel={this.ClosePopups}
                                            />
                                        )}
                                        {/*订单弹出核销*/}
                                        {orderPopup && (
                                            <Prompt close={this.ClosePopups}/>
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

export default OfflinePickup;
