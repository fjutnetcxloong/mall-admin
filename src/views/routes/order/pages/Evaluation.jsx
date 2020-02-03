/*
*  客户评价 赵志强
* */
import {Row, Col, Button, Skeleton, Empty, Spin} from 'antd';
import Search from '../components/TopSearch';
import Estimate from '../components/ShopEstimate';
import ReplyPrompt from '../components/ReplyPrompt';
import ErrPage from '../../../common/default-page/NoRoot';
import HandlePage from '../../../common/handle-page/HandlePage';
import '../index.less';
import './Evaluation.less';

const {successMsg} = Utils;
const {api} = Configs;
const {appHistory} = Utils;

const evaluate = [
    {
        title: '[好评]',
        index: '1'
    },
    {
        title: '[中评]',
        index: '2'
    },
    {
        title: '[差评]',
        index: '3'
    }
];

class Evaluation extends BaseComponent {
    state = {
        skeleton: true, //内容骨架
        reversionStatus: false, //是否显示回复追评状态
        orderId: '', //订单id
        orderText: '', //评价回复内容
        page: 1, //页数 、第几页
        pageCount: -1, //总页数
        count: -1, //总条数
        pageSize: 10, //每页条数
        orderList: [], //订单列表
        orderDate: null, //搜索保存数据
        loading: false,
        errPage: false
    }

    componentDidMount() {
        //客户评价列表接口
        this.evaluations();
    }

    //客户评价列表
    evaluations = (data) => {
        const {page, count, pageSize, pageCount} = this.state;
        //value.goodsName  商品名称
        // value.orderNumber 订单编号
        // value.date 时间
        // value.buyerName 买家昵称uid
        // statusr 买家评价状态
        // orderStar 买家评价星级
        console.log(data);
        this.setState({
            loading: true
        });
        //判断是否有筛选条件
        let record = {};
        if (data) {
            record = {
                page,
                total: count,
                page_count: pageCount,
                pagesize: pageSize,
                no: data.buyerName,
                order_no: data.orderNumber,
                title: data.goodsName,
                mark_type: data.statusr,
                shop_mark: data.orderStar,
                start_time: data.datest,
                end_time: data.dateed
            };
            this.setState({
                orderDate: data,
                page: data.page || page
            });
        } else {
            record = {
                page,
                total: count,
                pagesize: pageSize,
                page_count: pageCount
            };
        }
        this.fetch(api.appraiseList, {method: 'POST',
            data: record}).subscribe(res => {
            if (res && res.status === 0) {
                if (res.data.status === 1) {
                    this.setState({
                        errPage: true
                    });
                } else {
                    this.setState({
                        orderList: res.data,
                        count: res.total,
                        skeleton: false,
                        loading: false
                    });
                }
            }
        });
    }

    //分页器 获取页数
    pageChange = (page) => {
        const {orderDate} = this.state;
        // window.scrollTo(0, 0);
        if (orderDate) {
            orderDate.page = page;
        }
        this.setState({
            orderDate: orderDate,
            page
        }, () => {
            this.evaluations(orderDate);
        });
    }

    //分页器 获取每页条数
    pageCountChange = (current, size) => {
        const {orderDate} = this.state;
        window.scrollTo(0, 0);
        console.log(current, size);
        this.setState({
            page: current,
            pageSize: size
        }, () => {
            this.evaluations(orderDate);
        });
    }

    //商店评分 物流评分
    getSpot = (data) => {
        const spot = [];
        for (let i = 0; i < data; i++) {
            spot.push(<span className="icon icon-spot"/>);
        }
        return spot;
    }

    //回复  回复追评
    reversion = (id) => {
        // text 判断是回复内容  还是追评内容
        const text = id[2] || id[1];
        //判断是否回复追评的id
        let ids = id[0];
        //id[2] 回复内容不为空是  将add.id 赋值
        if (id[2]) {
            ids = id[3];
        }
        this.setState({
            orderText: text,
            orderId: ids,
            reversionStatus: true
        });
    }

    //关闭回复弹窗
    reversionCancel = () => {
        this.setState({
            reversionStatus: false
        });
    }

    //发送回复内容
    reversionOnOk = (data) => {
        const {orderId} = this.state;
        this.fetch(api.myOrderReturn, {method: 'POST',
            data: {
                pingjia_id: orderId,
                content: data
            }}).subscribe(res => {
            if (res) {
                if (res.status === 0) {
                    this.setState({
                        reversionStatus: false,
                        page: 1,
                        count: -1
                    }, () => {
                        successMsg('评价成功', () => {
                            this.evaluations();
                        });
                    });
                }
            }
        });
    }

    //跳转查看订单
    skipDetail = (data) => {
    //   data[1] if_express 1表示线上, 2线下
        console.log(data);
        if (data[1] === '1') {
            appHistory.push(`/order/online-delivery/delivery-detail?id=${data[0]}`);
        } else {
            appHistory.push(`/order/offline-pickup/pickup-detail?id=${data[0]}`);
        }
    }

    render() {
        const {count, page, orderList, reversionStatus, orderText, skeleton, pageSize, errPage} = this.state;
        return (
            <React.Fragment>
                {
                    !errPage ? (
                        <Row className="page evaluation-online">
                            <Skeleton active loading={skeleton}>
                                {/*筛选查询*/}
                                <Estimate/>
                            </Skeleton>
                            <Skeleton active loading={skeleton}>
                                <Search types={2} orderList={this.evaluations}/>
                            </Skeleton>
                            <Skeleton active loading={skeleton}>
                                <Spin spinning={this.state.loading}>
                                    <div className="evaluation">
                                        <div className="evaluation-top">
                                            <Row className="Tabs-top-wrap">
                                                <Col span={7}>评价内容</Col>
                                                <Col span={5}>评价星级</Col>
                                                <Col span={4}>评价时间</Col>
                                                <Col span={4}>买家</Col>
                                                <Col span={4}>操作</Col>
                                            </Row>
                                        </div>
                                        {/*list 列表*/}
                                        {orderList.length !== 0 ? (
                                            <div>
                                                {orderList && orderList.map((item) => (
                                                    <div className="evaluation-list" key={item.id}>
                                                        <div className="evaluation-list-top">
                                                            <div>
                                                                <div className="top-img">
                                                                    <img className="goods-img" src={item.pr_picpath} alt=""/>
                                                                </div>
                                                                <div className="goods-title">{item.pr_title}</div>
                                                                <div className="standards">规格：
                                                                    {item.mark && item.mark.map((specs) => (
                                                                        <span key={specs}>{specs}</span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <div className="order-id">订单号：{item.order_no}</div>
                                                        </div>
                                                        <div className="evaluation-bottom">
                                                            <Row className="Tabs-top-wrap">
                                                                <Col span={7} className="now-wrap">
                                                                    <div className="now-list">
                                                                        {evaluate.map((items) => (
                                                                            (items.index === item.mark_type) ? (
                                                                                <div className="now-list-text" key={items.index}>
                                                                                    <div><span className={`${items.index === '1' ? 'now-list-now' : ''}`}>{item.content ? items.title : ''}</span>{item.content}</div>
                                                                                    <div className="now-list-now-img">
                                                                                        {item.pics && item.pics.map((img) => (
                                                                                            <img key={img} className="goods-img" src={img} alt=""/>
                                                                                        ))}
                                                                                    </div>
                                                                                </div>
                                                                            ) : (null)
                                                                        ))}
                                                                        <div className="now-list-text">
                                                                            <div className="equalizer">{item.return_content ? '商家回复: ' + item.return_content : ''}</div>
                                                                            <div className="badpost">{item.add.content ? '追评: ' + item.add.content : ''}</div>
                                                                            <div className="now-list-now-img">
                                                                                {item.add.pics && item.add.pics.map((img) => (
                                                                                    <img key={img} className="goods-img" src={img} alt=""/>
                                                                                ))}
                                                                            </div>
                                                                            <div className="equalizer">{item.add.return_content ? '商家回复追评: ' + item.add.return_content : ''}</div>
                                                                        </div>
                                                                    </div>
                                                                </Col>
                                                                <Col span={5} className="evaluations">
                                                                    <div className="evaluation-wrap">
                                                                        <div className="evaluation-tops evaluation-tops-wrap">
                                                                            <div className="titles">店铺评价</div>
                                                                            <div className="title-icon">
                                                                                {this.getSpot(item.shop_mark)}
                                                                            </div>
                                                                        </div>
                                                                        <div className="evaluation-tops">
                                                                            <div className="titles">物流评价</div>
                                                                            <div className="title-icon">
                                                                                {this.getSpot(item.logistics_mark)}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </Col>
                                                                <Col span={4} className="now-wrap">
                                                                    <div className="now-list">
                                                                        {evaluate.map((items) => (
                                                                            (items.index === item.mark_type) ? (
                                                                                <div key={items.index}>
                                                                                    <div>
                                                                                        <span className={`${items.index === '1' ? 'now-list-now' : ''}`}>{item.crtdate ? items.title : ''}</span>
                                                                                        {item.crtdate}
                                                                                    </div>
                                                                                    <div>
                                                                                        {item.return_time ? '[回复]' + item.return_time : ''}
                                                                                    </div>
                                                                                </div>
                                                                            ) : (null)
                                                                        ))}
                                                                        {item.add && (
                                                                            <div>
                                                                                <div>
                                                                                    {item.add.crtdate ? '[追评]' + item.add.crtdate : ''}
                                                                                </div>
                                                                                <div>
                                                                                    {item.add.return_time ? '[回复追评]' + item.add.return_time : ''}
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </Col>
                                                                <Col span={4}>
                                                                    <div>
                                                                        <div>UID:{item.no}</div>
                                                                        <div>用户名：{item.nickname}</div>
                                                                    </div>
                                                                </Col>
                                                                <Col span={4}>
                                                                    <div className="eval-btn">
                                                                        {item.add && (
                                                                            <div>
                                                                                {(item.add.have_return !== 1) && (
                                                                                    <div className="order-text" onClick={() => this.reversion([item.id, item.content, item.add.content, item.add.id])}>{item.have_return === 0 ? '回复' : '回复追评'}</div>
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                        <Button type="primary" className="btn-detail" onClick={() => this.skipDetail([item.order_id, item.if_express])}>查看订单</Button>
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    </div>
                                                ))}
                                                {/*分页器*/}
                                                <HandlePage
                                                    page={page}
                                                    size={pageSize}
                                                    count={Number(count)}
                                                    onShowSizeChange={this.pageCountChange}
                                                    onChangePage={this.pageChange}
                                                />
                                            </div>
                                        ) : (
                                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>
                                        )}
                                        {/*显示回复内容弹窗*/}
                                        {reversionStatus && (
                                            <ReplyPrompt
                                                visible={reversionStatus}
                                                onCancel={this.reversionCancel}
                                                onOk={this.reversionOnOk}
                                                onOrderText={orderText}
                                            />
                                        )}
                                    </div>
                                </Spin>
                            </Skeleton>
                        </Row>
                    ) : <ErrPage/>
                }
            </React.Fragment>
        );
    }
}

export default Evaluation;
