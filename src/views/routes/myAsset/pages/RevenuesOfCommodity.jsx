//我的资产 订单页面 2019.8.16  xwb

import {Row, Collapse, Col, Form, Input, Button, DatePicker, Table, Select, Icon, Skeleton} from 'antd';
import moment from 'moment';
import Pagenation from '../components/PageNation';
import ErrPage from '../../../common/default-page/NoRoot';
import '../index.less';
import './RevenuesOfCommodity.less';

const FormItem = Form.Item;
const dateFormat = 'YYYY-MM-DD';
const {Panel} = Collapse;
const {api} = Configs;
const {formatMoment, warningMsg, successMsg, downloadExcel, appHistory, validator} = Utils;
const {MESSAGE: {FORMVALIDATOR}} = Constants;
const formTailLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 18}
};
const {RangePicker} = DatePicker;
const {Option} = Select;
let getShow = true; //请求按钮，每次只能点击一下

class RevenuesOfCommodity extends BaseComponent {
    totalInfo ={
        time_st: '', //开始时间
        time_ed: '', //结束时间
        no: '', //客户uid
        order_no: '', //订单编号
        if_express: '0', //线上或线下
        pay_type: '0', //支付方式
        page: 1,
        pagesize: 10,
        count: -1
    }

    state={
        skeleton: true, //内容骨架
        pagingSearch: {
            ...this.totalInfo
        },
        loading: false,
        dataList: [],
        batchSelect: '0', //批量导出操作
        selectedRowKeysArr: [], //导出数据id
        selectArr: [], //选中数据的集合
        isOpen: true, //表单是否打开
        errPage: false
    }

    columns = [
        {
            title: '订单编号',
            dataIndex: 'order_no',
            render: text => <span>{text}</span>
        },
        {
            title: '客户UID',
            // className: 'column-money',
            dataIndex: 'no'
        },
        {
            title: '实收金额（元）',
            dataIndex: 'price'
        },
        {
            title: '支付方式',
            dataIndex: 'pay_type',
            render: num => this.payType(num)
        },
        {
            title: '收货时间',
            dataIndex: 'recive_date'
        },
        {
            title: '订单来源',
            dataIndex: 'if_express',
            render: text => (text === '1' ? '线上' : '线下')
        },
        {
            title: '操作',
            dataIndex: 'id',
            className: 'last-column',
            render: (id, data) => <Button type="link" onClick={() => this.orderDetial(id, data.if_express)}>查看详情</Button>
        }
    ];

    componentDidMount() {
        this.getList();
    }

    //获取列表
    getList = (params) => {
        if (!getShow) return;
        getShow = false;
        this.setState({
            loading: true
        });
        const condition = params || this.state.pagingSearch;
        const dataMode = condition.time_st;
        if (Array.isArray(dataMode) && dataMode.length > 0) {
            condition.time_st = formatMoment(dataMode[0]);
            condition.time_ed = formatMoment(dataMode[1]);
        } else {
            condition.time_st = '';
        }
        this.fetch(api.myAssetOrderList, {data: condition})
            .subscribe(res => {
                if (res && res.status === 0) {
                    if (res.data.status === 1) {
                        this.setState({
                            errPage: true
                        });
                        return;
                    }
                    this.setState({
                        dataList: res.data,
                        totalPage: res.total,
                        pagingSearch: condition
                    });
                }
                this.setState({
                    loading: false,
                    skeleton: false
                });
                getShow = true;
            });
    }

    //支付方式判断
    payType = (num) => {
        const str = new Map([
            ['1', 'cam余额'],
            ['2', '微信'],
            ['3', '支付宝']
        ]);
        return str.get(num);
    }

    //验证uid
    checkUid=(rule, value, callback) => {
        if (value && !validator.UID(value)) {
            validator.showMessage(FORMVALIDATOR.uid_min_error, callback);
            return;
        }
        callback();
    }

    //点击筛选
    onSearch = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const pagingSearch = {...this.state.pagingSearch, ...values};
                pagingSearch.page = 1;
                this.setState({
                    pageNow: 1
                }, () => {
                    this.getList(pagingSearch);
                });
            }
        });
    }

    //一键清空
    clearSearch = () => {
        this.setState({
            pagingSearch: {...this.totalInfo}
        });
        this.props.form.resetFields();
        successMsg('已清空');
    }

    //批量结构部分
    tableTitleOpt = () => (
        <div className="table-header-cont">
            <div className="table-header-left">综合统计</div>
            <div className="tab-tittle-box">
                <Select
                    onChange={(data) => this.setState({batchSelect: data})}
                    placeholder="请选择批量操作"
                >
                    <Option value="1" key="1">导出选中数据</Option>
                    <Option value="2" key="2">导出所有数据</Option>
                </Select>
                <div>
                    <Button onClick={this.mustExport} type="primary">确定</Button>
                </div>
            </div>
        </div>
    );

    //确定导出
    mustExport = () => {
        const {batchSelect, selectArr, dataList} = this.state;
        const arr = [];
        if (batchSelect === '1') { //部分导出
            if (selectArr.length > 0) {
                const title = ['订单编号', '客户UID', '实收金额（元）', '支付方式', '付款时间', '订单来源'];
                arr.push(title);
                selectArr.forEach(item => {
                    arr.push([item.order_no, item.no, item.price, this.payType(item.pay_type), item.pay_date, item.if_express === '1' ? '线上' : '线下']);
                });
                this.fetch(api.batchExport, {data: {list: arr}})
                    .subscribe(res => {
                        if (res && res.status === 0) {
                            downloadExcel(res.data, 'platformincome_filtered');
                        }
                    });
            } else {
                warningMsg('您还未选择任何数据');
            }
        } else if (batchSelect === '2') { //导出全部
            if (dataList && dataList.length === 0) {
                warningMsg('暂无数据可以导出');
                return;
            }
            this.fetch(api.exportOutputExcelAll, {data: {type: 1}})
                .subscribe(res => {
                    if (res && res.status === 0) {
                        downloadExcel(res.data, 'platformincome_all');
                    }
                });
        } else {
            warningMsg('请选择导出方式');
        }
    }

    //点击页码进行切换
    pageChange = (page) => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const pagingSearch = {...this.state.pagingSearch, ...values};
                pagingSearch.page = page;
                this.setState({
                    pageNow: page,
                    selectArr: [],
                    selectedRowKeysArr: []
                }, () => {
                    this.getList(pagingSearch);
                });
            }
        });
    }

    //页面的如20条切换的时候
    pageSizeChange = (pagesize, pageNum) => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const pagingSearch = {...this.state.pagingSearch, ...values};
                pagingSearch.page = 1;
                pagingSearch.pagesize = pageNum;
                this.setState({
                    pageNow: 1
                }, () => {
                    this.getList(pagingSearch);
                });
            }
        });
    }

    //跳转到订单详情
    orderDetial = (id, type) => {
        if (type === '1') { //跳转线上订单
            appHistory.push(`/order/online-delivery/delivery-detail?id=${id}`);
        } else { //跳转到线下订单
            appHistory.push(`/order/offline-pickup/pickup-detail?id=${id}`);
        }
    }

    //点击折叠面板回调
    onCollapse=() => {
        this.setState(prevState => ({
            isOpen: !prevState.isOpen
        }));
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        const {pagingSearch, isOpen, dataList, totalPage, loading, skeleton, errPage, selectedRowKeysArr} = this.state;
        const rowSelection = {
            selectedRowKeys: selectedRowKeysArr,
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectArr: selectedRows,
                    selectedRowKeysArr: selectedRowKeys
                });
            }
        };
        return (
            <div className="property-manage">
                <React.Fragment>
                    {
                        !errPage ? (
                            <div className="page">
                                <Skeleton active loading={skeleton}>
                                    <Row>
                                        <Col span={24}>
                                            <div className="revenues-of-commodity-box">
                                                <Collapse
                                                    expandIconPosition="right"
                                                    onChange={this.onCollapse}
                                                    defaultActiveKey={['1']}
                                                    expandIcon={({isActive}) => <Icon type="right" rotate={isActive ? 270 : 90}/>}
                                                >
                                                    <Panel header="筛选查询" key="1" extra={isOpen ? '收起筛选' : '展开筛选'}>
                                                        <div className="revenues-of-commodity-form-box">
                                                            <Form>
                                                                <Row>
                                                                    <Col span={8} className="top-box-col">
                                                                        <FormItem {...formTailLayout} label="订单编号：">
                                                                            {getFieldDecorator('order_no', {
                                                                                initialValue: pagingSearch.order_no,
                                                                                rules: [{
                                                                                    message: '请输入数字',
                                                                                    pattern: /^[1-9]\d*$/
                                                                                }]
                                                                            })(
                                                                                <Input placeholder="请输入"/>
                                                                            )}
                                                                        </FormItem>
                                                                    </Col>
                                                                    <Col span={8} className="top-box-col">
                                                                        <FormItem {...formTailLayout} label="客户UID：">
                                                                            {getFieldDecorator('no', {
                                                                                initialValue: pagingSearch.no,
                                                                                rules: [{validator: this.checkUid}]
                                                                            })(
                                                                                <Input placeholder="请输入"/>
                                                                            )}
                                                                        </FormItem>
                                                                    </Col>
                                                                    <Col span={8} className="top-box-col">
                                                                        <FormItem {...formTailLayout} label="支付方式：">
                                                                            {getFieldDecorator('pay_type', {
                                                                                initialValue: pagingSearch.pay_type
                                                                            })(
                                                                                <Select>
                                                                                    <Option value="0">全部</Option>
                                                                                    <Option value="1">cam余额</Option>
                                                                                    <Option value="2">微信</Option>
                                                                                    <Option value="3">支付宝</Option>
                                                                                </Select>
                                                                            )}
                                                                        </FormItem>
                                                                    </Col>
                                                                    <Col span={8} className="top-box-col">
                                                                        <FormItem {...formTailLayout} label="订单来源：">
                                                                            {getFieldDecorator('if_express', {
                                                                                initialValue: pagingSearch.if_express
                                                                            })(
                                                                                <Select>
                                                                                    <Option value="0">全部</Option>
                                                                                    <Option value="1">线上</Option>
                                                                                    <Option value="2">线下</Option>
                                                                                </Select>
                                                                            )}
                                                                        </FormItem>
                                                                    </Col>
                                                                    <Col span={8} className="top-box-col">
                                                                        <FormItem {...formTailLayout} label="收货时间：">
                                                                            {getFieldDecorator('time_st', {
                                                                                initialValue: pagingSearch.time_st ? [moment(pagingSearch.time_st, dateFormat), moment(pagingSearch.time_ed, dateFormat)] : ''
                                                                            })(
                                                                                <RangePicker/>
                                                                            )}
                                                                        </FormItem>
                                                                    </Col>
                                                                </Row>
                                                                <Form.Item className="revenues-of-commodity-form-last-row">
                                                                    <div className="revenues-of-commodity-form-row">
                                                                        <Button type="link" onClick={this.clearSearch}>清空筛选条件</Button>
                                                                        <Button type="primary" onClick={this.onSearch}>筛选</Button>
                                                                    </div>
                                                                </Form.Item>
                                                            </Form>
                                                        </div>
                                                    </Panel>
                                                </Collapse>
                                            </div>
                                        </Col>
                                    </Row>
                                </Skeleton>
                                <Skeleton active loading={skeleton}>
                                    <Row className="ant-row-two">
                                        <Col span={24}>
                                            <div className="business-income-container">
                                                {this.tableTitleOpt()}
                                                <Table
                                                    rowSelection={rowSelection}
                                                    columns={this.columns}
                                                    dataSource={dataList}
                                                    pagination={false}
                                                    loading={loading}
                                                />
                                                {
                                                    totalPage > 0 ? (
                                                        <Pagenation
                                                            pageNow={pagingSearch.page}
                                                            size={pagingSearch.pagesize}
                                                            total={totalPage}
                                                            pageChange={this.pageChange}
                                                            pageSizeChange={this.pageSizeChange}
                                                        />
                                                    ) : null
                                                }
                                            </div>
                                        </Col>
                                    </Row>
                                </Skeleton>
                            </div>
                        ) : (<ErrPage/>)
                    }
                </React.Fragment>
            </div>
        );
    }
}

const WrapRevenuesOfCommodity = Form.create()(RevenuesOfCommodity);
export default WrapRevenuesOfCommodity;
