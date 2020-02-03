//2019.8.15 xwb
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import moment from 'moment';
import {Row, Col, Table, Tabs, DatePicker, Skeleton} from 'antd';
import ErrPage from '../../../common/default-page/NoRoot';
import Pagenation from '../components/PageNation';
import '../index.less';
import './MyAsset.less';

const {TabPane} = Tabs;
const {RangePicker} = DatePicker;
const {api} = Configs;
const {getFormatDate, appHistory} = Utils;
const dateFormat = 'YYYY-MM-DD';
const bankImgPosition = {
    1002: [0, 0],
    1005: [-61, 0],
    1026: [-122, 0],
    1003: [-183, 0],
    1001: [-244, 0],
    1066: [-305, 0],
    1020: [-366, 0],
    1027: [-427, 0],
    1006: [-488, 0],
    1025: [-549, 0],
    1004: [-610, 0],
    1009: [-671, 0],
    1010: [-732, 0], //未知
    1022: [0, -61],
    1032: [-61, -61],
    1056: [-122, -61],
    1021: [-183, -61]
}; //银行logo位置

class MyAsset extends BaseComponent {
    state={
        skeleton: true, //内容骨架
        mainList: {}, //所有数据集合
        page: 1,
        pagesize: 10,
        pageCount: -1,
        startTime: '',
        endTime: '',
        defaultValue: [], //默认日期
        defultTabKey: '1',
        totalPage: 0, //总页数
        loading: false,
        dataList: [], //列表数据
        errPage: false //缺省页
    }


    componentDidMount() {
        this.getData();
    }

    getData=() => {
        const nextStep = () => {
            //关闭骨架屏
            this.setState({
                skeleton: false
            });
        };
        Observable.forkJoin(
            this.getInfoURL(),
            this.getListURL()
        ).subscribe(
            (ary) => {
                console.log('forkJoin结果', ary);
                ary.forEach((res, index) => {
                    if (res && res.status === 0) {
                        if (res.data.status === 1) {
                            this.setState({
                                errPage: true
                            });
                        } else {
                            this.dataHandle(index, res);
                        }
                    }
                });
                nextStep();
            }, (err) => {
                console.log('forkJoin错误', err);
                nextStep();
            }
        );
    }

    // 请求数据处理函数
    dataHandle = (index, res) => {
        switch (index) {
        case 0:
            //处理获取头部数据
            this.setInfo(res);
            break;
        case 1:
            //获取列表数据
            this.setList(res);
            break;
        default:
            break;
        }
    }

    //获取头部数据
    getInfoURL = () => this.fetch(api.myAssetRequest);

    setInfo = (res) => {
        if (res && res.status === 0) {
            this.setState({
                mainList: res.data
            });
        }
    }

    //获取列表
    getListURL = () => {
        this.setState({
            loading: true
        });
        const {page, pagesize, pageCount, startTime, endTime} = this.state;
        return this.fetch(api.myAssetList, {data: {time_st: startTime, time_ed: endTime, page, pagesize, page_count: pageCount}});
    }

    setList = (res) => {
        if (res && res.status === 0) {
            this.setState({
                dataList: res.data.map((item, index) => { item.key = index; return item }),
                totalPage: res.total,
                loading: false
            });
        }
    }

    getList = (types) => {
        this.getListURL(types).subscribe((res) => {
            if (res && res.status === 0) {
                this.setList(res);
            }
        });
    }

    //顶部数据渲染结构
    propertyCard = (mainList) => {
        const obj = [
            {
                title: '总收入',
                key: mainList.all
            },
            {
                title: '今日收入',
                key: mainList.today_price
            },
            {
                title: '昨日收入',
                key: mainList.yesterday_price
            },
            {
                title: '当月收入',
                key: mainList.month_price
            }
        ];
        return (
            <div className="property-card-container">
                {
                    obj.map(item => (
                        <div key={item.title}>
                            <p>{item.key}<span className="fs14">元</span></p>
                            <p>{item.title}</p>
                        </div>
                    ))
                }
            </div>
        );
    }

    //列表查看文字
    titleLink = (text, link) => (
        <div>
            <span>{text}</span>
            <span className="search-link" onClick={() => appHistory.push(link)}>查看</span>
        </div>
    );

    //银行卡背景 蓝底
    /*backgroundImng = (num) => {
        num = Number(num);
        if (num > 1009) {
            return true;
        }
        return false;
    }*/

    //银行卡结构
    bankCard = (mainList) => {
        const {card} = mainList;
        return (
            card && (
                <div className={Number(card.bid) > 1009 ? 'background-blue bank-card-container' : 'bank-card-container background-red'}>
                    <div className="bank-card-coontainer-top">
                        <div className="bank-css-position" style={{backgroundPosition: card.bid ? `${bankImgPosition[card.bid][0]}px ${bankImgPosition[card.bid][1]}px` : '1000px 1000px'}}/>
                        <div className="mgl8">
                            <p className="bank-title">{card.name}</p>
                            <p className="bank-add">{card.branches}</p>
                        </div>
                    </div>
                    <div className="bank-number">{card.bankNo}</div>
                </div>
            )
        );
    }

    //表格头部
    tableHeader = () => {
        const {defaultValue, defultTabKey} = this.state;
        return (
            <div className="table-header-container">
                <div className="table-header-left">综合统计</div>
                <div className="table-header-right">
                    <div>
                        <Tabs
                            onTabClick={(value) => this.getOtherDayList(value)}
                            activeKey={defultTabKey}
                        >
                            <TabPane tab="全部" key="1"/>
                            <TabPane tab="最近30天" key="2"/>
                            <TabPane tab="最近90天" key="3"/>
                        </Tabs>
                    </div>
                    <div className="table-header-right-timer">
                        <RangePicker value={defaultValue} onChange={(data, value) => this.dateSelection(value)}/>
                    </div>
                </div>
            </div>
        );
    };

    //选择天数 30 或90 或全部
    getOtherDayList = (value) => {
        this.setState({
            defaultValue: [],
            defultTabKey: value
        }, () => {
            // '2'是30天， '3'是90天
            const timeSt = getFormatDate(value === '2' ? -30 : -90);
            const timeEn = getFormatDate();
            this.setState({
                startTime: timeSt,
                endTime: timeEn,
                page: 1,
                pageNow: 1
            }, () => {
                this.getList();
            });
        });
    }

    //选择日期
    dateSelection = (data) => {
        this.setState({
            startTime: data[0],
            endTime: data[1],
            defaultValue: data[0] ? [moment(data[0], dateFormat), moment(data[1], dateFormat)] : '',
            defultTabKey: '1',
            page: 1,
            pageNow: 1
        }, () => {
            this.getList();
        });
    }

    //列表结构
    propertyUnit = () => {
        // 列表表头
        const columns = [
            {
                title: '日期',
                dataIndex: 'day'
            },
            {
                title: () => this.titleLink('订单收入（元）', '/assets/revenues-of-commodity'),
                // className: 'column-money',
                dataIndex: 'operating_income'
            },
            {
                title: () => this.titleLink('业务转入（元）', '/assets/revenues-of-order'),
                dataIndex: 'business_transfer'
            },
            {
                title: '预算收益（元）',
                dataIndex: 'budget_receipt',
                className: 'last-column'
            }
        ];
        const {dataList, totalPage, loading, page, pagesize} = this.state;
        return (
            <div className="property-manage">
                <div className="property-unit-container">
                    <Table
                        columns={columns}
                        dataSource={dataList}
                        title={() => this.tableHeader()}
                        pagination={false}
                        loading={loading}
                    />
                    {
                        totalPage > 0 ? (
                            <Pagenation
                                total={totalPage}
                                size={pagesize}
                                pageNow={page}
                                pageChange={this.pageChange}
                                pageSizeChange={this.pageSizeChange}
                            />
                        ) : null
                    }
                </div>
            </div>
        );
    }

    //点击页码进行切换
    pageChange = (data) => {
        this.setState({
            page: data,
            pageNow: data
        }, () => {
            this.getList();
        });
    }

    //页面的如20条切换的时候
    pageSizeChange = (pagesize, paegNum) => {
        this.setState({
            pagesize: paegNum,
            page: 1,
            pageNow: 1
        }, () => {
            this.getList();
        });
    }

    render() {
        const {mainList, skeleton, errPage} = this.state;
        return (
            <div className="property-manage">
                <React.Fragment>
                    {
                        !errPage ? (
                            <div className="page my-asset-container">
                                <Row>
                                    <Skeleton active loading={skeleton}>
                                        <Col span={16}>
                                            {this.propertyCard(mainList)}
                                        </Col>
                                    </Skeleton>
                                    <Skeleton active loading={skeleton}>
                                        <Col span={8}>
                                            {this.bankCard(mainList)}
                                        </Col>
                                    </Skeleton>
                                </Row>
                                <Row className="ant-row-two">
                                    <Skeleton active loading={skeleton}>
                                        <Col>
                                            {this.propertyUnit()}
                                        </Col>
                                    </Skeleton>
                                </Row>
                            </div>
                        ) : (<ErrPage/>)
                    }
                </React.Fragment>
            </div>
        );
    }
}

export default MyAsset;
