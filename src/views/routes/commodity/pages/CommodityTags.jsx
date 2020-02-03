/**
 * 标签库
 */
import {connect} from 'react-redux';
import {Button, Tag, Divider, Popconfirm} from 'antd';
import * as ActionCreator from '../redux/actions';
import ErrPage from '../../../common/default-page/NoRoot';
import Template from '../components/Template';

const {api} = Configs;
const {showFail} = Utils;
class CommodityTags extends BaseComponent {
    state={
        visible: false, //是否显示对话框
        isAdd: true, //对话框操作类型：true:新建 false:编辑
        loading: false, //是否显示对话框确认按钮loading动画
        id: '', //选中行id
        rowData: {}, //选中行内容
        page: 1, //当前页码
        pageSize: 20, //每页条数
        count: -1, //总条数
        length: 0, //当前页码数据长度
        dataSource: [], //表格数据源
        skeLoad: true, //是否显示骨架屏
        tableLoading: false, //表格是否加载中
        errPage: false
    }

    componentDidMount() {
        const {isAuth} = this.props;
        if (isAuth) {
            this.getTableList();
        } else {
            this.setState({
                errPage: true
            });
        }
    }

    //查询标签分组数据
    getTableList=() => {
        console.log('查询数据');
        const {page, pageSize, count} = this.state;
        const noRes = () => {
            this.setState({
                skeLoad: false,
                tableLoading: false,
                count: 0,
                dataSource: []
            });
        };
        this.fetch(api.getCommodityTags, {
            data: {
                page,
                pageSize,
                count
            }
        }).subscribe(res => {
            if (res && res.status === 0) {
                if ((res.data.status && res.data.status === 1) || res.cer_type === '0') {
                    const {initAuth} = this.props;
                    initAuth(false);
                    this.setState({
                        errPage: true
                    });
                } else if (res.data.length > 0) {
                    this.setState({
                        count: parseInt(res.count, 10),
                        length: res.data.length
                    }, () => {
                        this.handleResult(res.data);
                    });
                } else {
                    console.log('空数据');
                    noRes();
                }
            } else {
                noRes();
            }
        });
    }

    //格式化请求结果
    handleResult=(res) => {
        let source = [];
        res.map(v => {
            const obj = {
                rowKey: v.tag_id,
                tag_name: v.tag_name,
                tag_value: v.tag_value,
                count: v.count,
                crtdate: v.crtdate,
                type: v.type
            };
            source = source.concat(obj);
        });
        this.setState({
            skeLoad: false,
            tableLoading: false,
            dataSource: source
        });
    }

    //点击新建/编辑回调
    onHandleTags=(isAdd, record) => {
        console.log(isAdd ? '点击新建' : ('点击编辑', record));
        this.setState({
            isAdd,
            ...isAdd ? {id: ''} : {id: record.rowKey},
            ...isAdd ? {rowData: {}} : {rowData: record}
        }, () => {
            this.showModal();
        });
    }

    //显示对话框
    showModal=() => {
        this.setState({
            visible: true
        });
    }

    //新建标签组/编辑标签组
    onSubmit=(value) => {
        const {isAdd, id} = this.state;
        this.setState(prevState => ({
            loading: !prevState.loading
        }), () => {
            this.fetch(
                (isAdd ? api.addCommodityTags : api.upCommodityTags), {
                    data: {
                        ...value,
                        ...isAdd || {id}
                    }}
            ).subscribe(res => {
                if (res && res.status === 0) {
                    if (isAdd && res.type) {
                        this.setState(prevState => ({
                            loading: !prevState.loading,
                            visible: false
                        }), () => {
                            showFail('标签组已存在');
                        });
                        return;
                    }
                    this.setState(prevState => ({
                        loading: !prevState.loading,
                        visible: false,
                        tableLoading: true,
                        ...isAdd || {
                            id: '',
                            rowData: {}
                        }
                    }), () => {
                        console.log(isAdd ? '新建标签组成功' : '编辑标签组成功');
                        if (isAdd) {
                            //新增后重新获取条数
                            this.setState({
                                page: 1,
                                count: -1
                            }, () => {
                                this.getTableList();
                            });
                            return;
                        }
                        this.getTableList();
                    });
                } else {
                    this.setState(prevState => ({
                        loading: !prevState.loading,
                        visible: false
                    }));
                }
            });
        });
    }

    //点击对话框遮罩层或右上角叉或取消按钮的回调
    onCancel= () => {
        this.setState({
            visible: false
        });
    }

    //点击删除回调
    onDelete=(record) => {
        this.setState({
            tableLoading: true
        }, () => {
            const ids = [];
            ids.push(record.rowKey);
            this.fetch(api.delCommodityTags, {
                data: {
                    ids
                }
            }).subscribe(res => {
                if (res && res.status === 0) {
                    this.setState(prevState => ({
                        count: prevState.count - 1,
                        length: prevState.length - 1
                    }), () => {
                        console.log('删除成功');
                        const {count, length, page} = this.state;
                        if (count === 0) {
                            //最后一条删了显示空
                            this.setState({
                                page: 1,
                                count: -1
                            }, () => {
                                this.getTableList();
                            });
                        } else if (count > 0 && length === 0 && page !== 1) {
                            //当前页码数据删完且不是第一页返回前一页
                            this.setState(prevState => ({
                                page: prevState.page - 1
                            }), () => {
                                console.log('返回前一页');
                                this.getTableList();
                            });
                        } else {
                            this.getTableList();
                        }
                    });
                } else {
                    this.setState({
                        tableLoading: false
                    });
                }
            });
        });
    }

    //改变每页条数回调
    onShowSizeChange = (current, size) => {
        const {count, pageSize} = this.state;
        const res = (count <= pageSize && count <= size);
        //总条数小于等于修改前和修改后的每页条数，不请求接口
        this.setState({
            page: current,
            pageSize: size,
            ...res || {tableLoading: true}
        }, () => {
            res || this.getTableList();
        });
    }

    //改变页码回调
    onChangePage = (page) => {
        //跳页返回页码等于当前页码，不请求接口
        const {page: current} = this.state;
        const res = (page === current);
        this.setState({
            page,
            ...res || {tableLoading: true}
        }, () => {
            res || this.getTableList();
        });
    }

    render() {
        const {visible, isAdd, loading, rowData, page, pageSize, count, errPage, dataSource, skeLoad, tableLoading} = this.state;
        const {location: {pathname}} = this.props;
        const path = pathname.split('/')[2];
        const columns = [
            {
                title: '标签组名称',
                dataIndex: 'tag_name',
                align: 'center'
            },
            {
                title: '包含标签',
                dataIndex: 'tag_value',
                align: 'center',
                render: (text) => {
                    if (text) {
                        const tags = text.split(',');
                        const arr = tags.map(v => (
                            <Tag key={v} color="red">{v}</Tag>
                        ));
                        return arr;
                    }
                    return [];
                }
            },
            {
                title: '个数',
                dataIndex: 'count',
                align: 'center'
            },
            {
                title: '创建时间',
                dataIndex: 'crtdate',
                align: 'center'
            },
            {
                title: '操作',
                dataIndex: 'type',
                align: 'center',
                //text当前行单元格的值,record当前行数据
                render: (text, record) => (
                    <div>
                        <Button type="link" onClick={() => this.onHandleTags(false, record)}>编辑</Button>
                        {text === '0' && (
                            <React.Fragment>
                                <Divider type="vertical"/>
                                <Popconfirm title="确认删除？" onConfirm={() => this.onDelete(record)} okText="是" cancelText="否">
                                    <Button type="link">删除</Button>
                                </Popconfirm>
                            </React.Fragment>
                        )}
                    </div>
                )
            }
        ];
        return (
            <React.Fragment>
                {
                    !errPage ? (
                        <Template
                            path={path}
                            title="标签库"
                            subTitle="标签组"
                            onAdd={this.onHandleTags}
                            visible={visible}
                            isAdd={isAdd}
                            rowData={rowData}
                            loading={loading}
                            onOk={this.onSubmit}
                            onCancel={this.onCancel}
                            page={page}
                            pageSize={pageSize}
                            count={count}
                            dataSource={dataSource}
                            columns={columns}
                            tableLoading={tableLoading}
                            skeLoad={skeLoad}
                            onShowSizeChange={this.onShowSizeChange}
                            onChangePage={this.onChangePage}
                        />
                    ) : (<ErrPage/>)
                }
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    const commodity = state.get('commodity');
    return {
        isAuth: commodity.get('isAuth')
    };
};

const mapDispatchToProps = {
    initAuth: ActionCreator.initAuth
};

export default connect(mapStateToProps, mapDispatchToProps)(CommodityTags);
