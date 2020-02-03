import {Row, Col, Button, Icon, Input, DatePicker, Form, Collapse, Table, Select, Skeleton} from 'antd';
import Pagenation from '../components/PageNation';
import ErrPage from '../../../common/default-page/NoRoot';
import '../index.less';
import './RevenuesOfOrder.less';

const {api} = Configs;
const {Panel} = Collapse;
const {formatMoment, warningMsg, successMsg, downloadExcel, validator} = Utils;
const {MESSAGE: {FORMVALIDATOR}} = Constants;
let getShow = true; //请求按钮，每次只能点击一下
//表格数据
const columns = [
    {
        title: '客户UID',
        dataIndex: 'no_other'
    },
    {
        title: '实收金额（元）',
        dataIndex: 'scalar'
    },
    {
        title: '付款时间',
        dataIndex: 'crtdate',
        className: 'last-column'
    }
];
//表格布局
const formItemLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 18}
};
class RevenuesOfOrder extends BaseComponent {
    clearPageSear = {
        time_st: '', //开始时间
        time_ed: '', //结束时间
        no: '', //uid
        page: 1, //页码
        pagesize: 10, //单页数据条数
        page_count: -1 //总页码
    };

    state = {
        skeleton: true, //内容骨架
        selectSwitch: true, //筛选收起
        tablesData: [], //表格数据汇总
        pageSeacr: {
            ...this.clearPageSear
        },
        batchSelect: '0', //导出方式
        selectArr: [], //导出数据
        selectedRowKeysArr: [], //导出数据id
        isOpen: true, //是否打开表单
        loading: false,
        errPage: false
    }

    componentDidMount() {
        this.getTableData();
    }

    //载入时发起请求
    getTableData = (datas) => {
        if (!getShow) return;
        getShow = false;
        this.setState({
            loading: true
        });
        const condition = datas || this.state.pageSeacr;
        const dataArray = condition.time_st;
        if (Array.isArray(dataArray) && dataArray.length > 0) {
            condition.time_st = formatMoment(dataArray[0]);
            condition.time_ed = formatMoment(dataArray[1]);
        } else {
            condition.time_st = '';
            condition.time_ed = '';
        }
        this.fetch(api.myAssetbusinessList, {data: condition})
            .subscribe(res => {
                if (res && res.status === 0) {
                    if (res.data.status === 1) {
                        this.setState({
                            errPage: true
                        });
                    } else {
                        this.setState({
                            tablesData: res.data,
                            // totalPage: 50,
                            totalPage: res.total,
                            pageSeacr: condition,
                            skeleton: false,
                            pageNow: condition.page
                        });
                    }
                }
                this.setState({
                    loading: false
                });
                getShow = true;
            });
    };

    //筛选列表控制
    selectToggle = () => {
        const status = this.state.selectSwitch;
        this.setState({
            selectSwitch: !status
        });
    }

    //清空筛选列表
    handleReset = () => {
        this.setState({
            pageSeacr: {
                ...this.clearPageSear}
        });
        this.props.form.resetFields();
        successMsg('已清空');
    }

    //验证uid
    checkUid=(rule, value, callback) => {
        if (value && !validator.UID(value)) {
            validator.showMessage(FORMVALIDATOR.uid_min_error, callback);
            return;
        }
        callback();
    }

    //提交筛选
    handleSearch = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const pageSeacr = {...this.state.pageSeacr, ...values};
                pageSeacr.page = 1;
                this.setState({
                    pageNow: 1
                }, () => {
                    this.getTableData(pageSeacr);
                });
            }
        });
    };

    //点击页码进行切换
    pageChange = (page) => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const pageSeacr = {...this.state.pageSeacr, ...values};
                pageSeacr.page = page;
                this.setState({
                    pageNow: page,
                    selectArr: [],
                    selectedRowKeysArr: []
                }, () => {
                    this.getTableData(pageSeacr);
                });
            }
        });
    }

    //页面的如20条切换的时候
    pageSizeChange = (pagesize, pageNum) => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const pageSeacr = {...this.state.pageSeacr, ...values};
                pageSeacr.page = 1;
                pageSeacr.pagesize = pageNum;
                this.setState({
                    pageNow: 1
                }, () => {
                    this.getTableData(pageSeacr);
                });
            }
        });
    }

    //表格头部组件
    tableTitleOpt = () => {
        const {Option} = Select;
        return (
            <div className="table-header-cont">
                <div className="table-header-left">综合统计</div>
                <div className="tab-tittle-box">
                    <Select onChange={(data) => this.setState({batchSelect: data})} placeholder="请选择批量操作">
                        <Option value="1" key="1">导出选中数据</Option>
                        <Option value="2" key="2">导出所有数据</Option>
                    </Select>
                    <Button type="primary" onClick={this.exportDatas}>确定</Button>
                </div>
            </div>
        );
    };

    //导出
    exportDatas = () => {
        const {batchSelect, selectArr, tablesData} = this.state;
        const arr = [];
        if (batchSelect === '1') { //部分导出
            if (selectArr.length > 0) {
                const title = ['客户UID', '实收金额（元）', '付款时间'];
                arr.push(title);
                selectArr.forEach(item => {
                    arr.push([item.no_other, item.scalar, item.crtdate]);
                });
                this.fetch(api.batchExport, {data: {list: arr}})
                    .subscribe(res => {
                        if (res && res.status === 0) {
                            downloadExcel(res.data, 'cashincome_filtered');
                        }
                    });
            } else {
                warningMsg('您还未选择任何数据');
            }
        } else if (batchSelect === '2') { //导出全部
            if (tablesData && tablesData.length === 0) {
                warningMsg('暂无数据可以导出');
                return;
            }
            this.fetch(api.exportOutputExcelAll, {data: {type: 2}})
                .subscribe(res => {
                    if (res && res.status === 0) {
                        downloadExcel(res.data, 'cashincome_all');
                    }
                });
        } else {
            warningMsg('请选择导出方式');
        }
    }

    //点击折叠面板回调
    onCollapse=() => {
        this.setState(prevState => ({
            isOpen: !prevState.isOpen
        }));
    };

    render() {
        const {RangePicker} = DatePicker;
        const {getFieldDecorator} = this.props.form;
        const {selectedRowKeysArr} = this.state;
        const rowSelection = {
            selectedRowKeys: selectedRowKeysArr,
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectArr: selectedRows,
                    selectedRowKeysArr: selectedRowKeys
                });
            }
        };
        const {totalPage, skeleton, isOpen, loading, errPage, pageSeacr, tablesData} = this.state;
        return (
            <div className="property-manage">
                <React.Fragment>
                    {
                        !errPage ? (
                            <div className="page">
                                <div className="revenues-of-order-container">
                                    <Skeleton active loading={skeleton}>
                                        <Row>
                                            <Col span={24}>
                                                <div className="revenues-of-order-box">
                                                    <Collapse
                                                        expandIconPosition="right"
                                                        onChange={this.onCollapse}
                                                        defaultActiveKey={['1']}
                                                        expandIcon={({isActive}) => <Icon type="right" rotate={isActive ? 270 : 90}/>}
                                                    >
                                                        <Panel header="筛选查询" key="1" extra={isOpen ? '收起筛选' : '展开筛选'}>
                                                            <div className="search-form-box">
                                                                <Form hideRequiredMark {...formItemLayout} onSubmit={this.handleSearch}>
                                                                    <Row>
                                                                        <Col span={8} pull={1}>
                                                                            <Form.Item label="UID">
                                                                                {getFieldDecorator('no', {
                                                                                    rules: [{validator: this.checkUid}]
                                                                                })(
                                                                                    <Input placeholder="请输入"/>
                                                                                )
                                                                                }
                                                                            </Form.Item>
                                                                        </Col>
                                                                        <Col span={8} pull={1}>
                                                                            <Form.Item label="付款时间">
                                                                                {
                                                                                    getFieldDecorator('time_st', {
                                                                                        // rules: [{
                                                                                        //     required: true, message: 'please input !!'
                                                                                        // }]
                                                                                    })(
                                                                                        <RangePicker/>
                                                                                    )
                                                                                }
                                                                            </Form.Item>
                                                                        </Col>
                                                                        <Col span={8}>
                                                                            <Form.Item className="form-btn-right">
                                                                                <Button type="link" onClick={this.handleReset}>清空筛选条件</Button>
                                                                                <Button type="primary" onClick={this.handleSearch}>筛选</Button>
                                                                            </Form.Item>
                                                                        </Col>
                                                                    </Row>
                                                                </Form>
                                                            </div>
                                                        </Panel>
                                                    </Collapse>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Skeleton>
                                    <Skeleton active loading={skeleton}>
                                        <Row className="ant-row-two br4">
                                            <Col span={24}>
                                                {this.tableTitleOpt()}
                                                <div className="commodity-table-box">
                                                    <Table
                                                        rowSelection={rowSelection}
                                                        columns={columns}
                                                        dataSource={tablesData}
                                                        pagination={false}
                                                        loading={loading}
                                                    />
                                                    {
                                                        totalPage > 0 ? (
                                                            <Pagenation
                                                                pageNow={pageSeacr.page}
                                                                size={pageSeacr.pagesize}
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

                            </div>
                        ) : (<ErrPage/>)
                    }
                </React.Fragment>
            </div>

        );
    }
}

export default Form.create()(RevenuesOfOrder);
