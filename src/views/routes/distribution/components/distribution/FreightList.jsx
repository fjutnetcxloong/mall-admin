/*
* 快递发货运费模板主页 邓小妹
* */
import {Row, Col, Radio, Button, Table, Popconfirm, Skeleton} from 'antd';
import 'rxjs/add/observable/forkJoin';
import {connect} from 'react-redux';
import {disAtionCreator} from '../../action/index';
import HandleModal from '../../../../common/handle-modal/HandleModal';
import ErrPage from '../../../../common/default-page/NoRoot';

const {MESSAGE: {WRITEOFF}} = Constants;
const {showInfo, showFail} = Utils;
const {api} = Configs;
class FreightList extends BaseComponent {
    constructor(props) {
        super(props);
        this.temp = {
            choiceTemplateId: '',
            subTableTitle: [] //展开表格的表头
        };
        this.state = {
            defaultValue: '',
            skeleton: true, //内容骨架
            tableData: [], // 表格1数据
            subTableData: [],  // 表格2数据
            showStatus: '', //是否显示暂无权限页面
            show: false,   //弹窗是否显示
            value: ''  //count_type:计费方式 1. 按商品累加运费  2.组合运费
        };
    }

    componentDidMount() {
        console.log('子组件---主页面');
        // this.getData();
        const {mailTemplateInfo} = this.props;
        if (mailTemplateInfo) {
            this.setMailTemplate(mailTemplateInfo);
        } else {
            this.getMailTemplateInfo();
        }
    }

    componentWillReceiveProps(nextProps) {
        console.log('componentWillReceiveProps');
        if (nextProps.mailTemplateInfo && nextProps.mailTemplateInfo !== this.props.mailTemplateInfo) {
            this.setMailTemplate(nextProps.mailTemplateInfo);
        }
    }

    //获取运费模板
    getMailTemplateInfo() {
        const {getMailTemplate} = this.props;
        getMailTemplate();
    }

    closeSkeleton = () => {
        //关闭骨架屏
        this.setState({
            skeleton: false
        });
    };

    setMailTemplate = (res) => {
        this.closeSkeleton();
        if (res && res.status === 0) {
            if (res.data && res.data.status === 1) {
                this.setState({
                    showStatus: 'two'
                });
            } else {
                const tableData = [];
                const subTableData = [];
                res.data.forEach((item, index) => {
                    if (item.if_default === '1') {
                        this.setState({
                            defaultValue: item.template_name
                        });
                    }
                    let ifMail = '',
                        countType = '',
                        cType = '';
                    if (item.type === '1') {
                        countType = '按件数';
                    } else {
                        countType = '按重量';
                    }
                    if (item.if_mail === '0') {
                        ifMail = '不包邮';
                        this.temp.postageTitle = '包邮';
                    } else if (item.if_mail === '1') {
                        ifMail = '满额包邮';
                        this.temp.postageTitle = '满额包邮';
                    } else {
                        ifMail = '满件包邮';
                        this.temp.postageTitle = '满件包邮';
                    }

                    // 判断是按件数还是按重量
                    if (item.type === '1') {
                        cType = '按件数';
                        this.temp.subTableTitle.push(
                            {
                                key: index,
                                column: [
                                    {title: '配送区域', dataIndex: 'area', key: 'area', className: 'first-col'},
                                    {title: '首件', dataIndex: 'fPart', key: 'fPart'},
                                    {title: '运费', dataIndex: 'freight', key: 'freight'},
                                    {title: '续件', dataIndex: 'cPart', key: 'cPart'},
                                    {title: '运费', dataIndex: 'reNew', key: 'reNew'},
                                    {title: this.temp.postageTitle, dataIndex: 'postage', key: 'postage'}
                                ]
                            }
                        );
                        item.areaAndMail.forEach((item2, index2) => {
                            subTableData.push({
                                pKey: index,
                                key: index2,
                                area: item2.area,
                                fPart: item2.mail.fPart,
                                cPart: item2.mail.cPart,
                                freight: item2.mail.freight,
                                postage: item2.mail.postage ? item2.mail.postage : '无',
                                reNew: item2.mail.reNew
                            });
                        });
                    } else {
                        this.temp.subTableTitle.push({
                            key: index,
                            column: [
                                {title: '配送区域', dataIndex: 'area', key: 'area'},
                                {title: '首重', dataIndex: 'fKg', key: 'fKg'},
                                {title: '运费', dataIndex: 'freight', key: 'freight'},
                                {title: '续重', dataIndex: 'cKg', key: 'cKg'},
                                {title: '运费', dataIndex: 'reNew', key: 'reNew'},
                                {title: this.temp.postageTitle, dataIndex: 'postage', key: 'postage'}
                            ]
                        });
                        item.areaAndMail.forEach((item2, index2) => {
                            subTableData.push({
                                pKey: index,
                                key: index2,
                                area: item2.area,
                                fKg: item2.mail.fKg,
                                cKg: item2.mail.sKg,
                                freight: item2.mail.freight,
                                postage: item2.mail.postage ? item2.mail.postage : '无',
                                reNew: item2.mail.reNew
                            });
                        });
                    }
                    tableData.push({
                        key: index,
                        id: item.id,
                        count_type: countType,
                        if_mail: ifMail,
                        template_name: item.template_name,
                        type: cType,
                        update: item.update,
                        if_default: item.if_default
                    });
                });
                this.setState({
                    tableData,
                    subTableData,
                    value: Number(res.count_type)
                });
            }
        }
    };

    //计费方式 1. 按商品累加运费  2.组合运费
    onChange = (e) => {
        this.setState({
            value: e.target.value
        });
        this.chooseCountType(e.target.value);
    };

    //计费方式接口
    chooseCountType = (type) => {
        this.fetch(api.updateCountType, {data: {
            count_type: type
        }}).subscribe(res => {
            console.log(res);
        });
    };

    //点击运费计费规则跳转帮助中心
    toHelp = () => {
        window.open(`#/support?id1=${34}&id2=${43}&id3=${59}`);
    };


    //显示提示框
    useTemplateModal = (id) => {
        this.temp.choiceTemplateId = id;
        this.setState({
            show: true
        });
    };

    //新建运费模板
    showTemplate = () => {
        console.log('新建运费模板');
        const {tableData} = this.state;
        const {changeRoute, setHandleState} = this.props;
        if (tableData.length < 5) {
            changeRoute('one');
            setHandleState('create');
        } else {
            showInfo(WRITEOFF.five_template);
        }
    };

    //自定义展开图标
    onExpand = (expanded, record) => {
        console.log('onExpand', expanded, record);
    };

    //展开表格
    expandedRowRender = (data) => {
        const {subTableTitle} = this.temp;
        const {subTableData} = this.state;
        const arr = [];
        let arr2 = [];
        subTableData.forEach(item => {
            if (data.key === item.pKey) {
                arr.push(item);
            }
        });
        subTableTitle.forEach(item => {
            if (data.key === item.key) {
                arr2 = item.column;
            }
        });
        return <Table className="inner-table" columns={arr2} dataSource={arr} pagination={false}/>;
    };

    CustomExpandIcon = (props) => {
        let text;
        if (props.expanded) {
            text = <span className="icon ant-table-row-collapsed"/>;
        } else {
            text = <span className="icon ant-table-row-expanded"/>;
        }
        return (
            <span
                onClick={e => props.onExpand(props.record, e)}
            >
                {text}
            </span>
        );
    };

    //关闭确认使用模板弹窗
    shut = () => {
        this.setState({
            show: false
        });
    };

    //选择模板
    chooseTemplate = () => {
        const {choiceTemplateId} = this.temp;
        this.fetch(api.updateTemplate, {data: {
            id: choiceTemplateId
        }}).subscribe(res => {
            if (res && res.status === 0) {
                this.getMailTemplateInfo();
                this.setState({
                    show: false
                });
            }
        });
    };

    //复制模板
    copyTemplate = (id) => {
        console.log('复制模板');
        const {tableData} = this.state;
        if (tableData.length < 5) {
            this.fetch(api.copyTemplate, {
                data: {
                    id
                }}).subscribe(res => {
                if (res && res.status === 0) {
                    this.getMailTemplateInfo();
                }
            });
        } else {
            showInfo(WRITEOFF.five_template);
        }
    };

    //删除运费模板
    handleDelete = (id, ifDefault) => {
        if (ifDefault === '0') {
            this.fetch(api.deleMailTemplate, {
                data: {
                    id
                }}).subscribe(res => {
                if (res.status === 0) {
                    this.getMailTemplateInfo();
                }
            });
        } else {
            showFail('当前使用模板不能删除');
        }
    };

    //編輯运费模板
    edit = (id) => {
        const {setEditId, changeRoute, setHandleState} = this.props;
        setEditId(id);
        changeRoute('one');
        setHandleState('edit');
    };

    render() {
        const columns = [
            {
                title: '模板名字',
                dataIndex: 'template_name',
                align: 'center'
            },
            {
                title: '计费方式',
                dataIndex: 'count_type',
                align: 'center'
            },
            {
                title: '包邮条件',
                dataIndex: 'if_mail',
                align: 'center'
            },
            {
                title: '编辑时间',
                dataIndex: 'update',
                align: 'center'
            },
            {
                title: '操作',
                dataIndex: 'operation',
                align: 'center',
                render: (text, record) => (record.id ? (
                    <div className="last-td-box">
                        {
                            record.if_default === '0' && (
                                <Button type="primary" size="small" className="copyBtn" onClick={() => this.useTemplateModal(record.id)}>使用模板</Button>
                            )
                        }
                        <Button type="primary" size="small" className="copyBtn" onClick={() => this.copyTemplate(record.id)}>复制模板</Button>
                        <Button onClick={() => this.edit(record.id)} className="editBtn">
                            编辑
                        </Button>
                        <Popconfirm
                            title="确定删除吗?"
                            onConfirm={() => this.handleDelete(record.id, record.if_default)}
                        >
                            <span className="deleteBtn">删除</span>
                        </Popconfirm>
                    </div>
                ) : null)
            }
        ];
        const footer = (
            <div>
                <Button
                    onClick={this.shut}
                >
                    我再想想
                </Button>
                <Button
                    type="primary"
                    onClick={this.chooseTemplate}
                >
                    确认
                </Button>
            </div>
        );
        const content = (
            <div className="submit-issue">
                <div className="explain">
                    <p>选择该模板后，所有商品都将以该模板作为运费模板。</p>
                </div>
            </div>
        );
        const {displayStatus} = this.props;
        const {tableData, defaultValue, show, skeleton, value, showStatus} = this.state;
        return (
            <React.Fragment>
                {
                    showStatus !== 'two' ? (
                        <div className="expressage" style={{display: displayStatus ? 'none' : ''}}>
                            <Skeleton active loading={skeleton}>
                                <Row className="one-row">
                                    <Row>
                                        <Col span={24} className="one-one-col">
                                            <span>快递发货</span>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={24} className="one-two-col">
                                            <div className="left">
                                                <div className="one">
                                                    启用快递发货功能后,买家下单可以选择快递发货，由你安排快递送货上门。
                                                </div>
                                                <div className="two">
                                                    <span className="tip">模板使用方式:</span>
                                                    <Radio.Group
                                                        onChange={this.onChange}
                                                        value={value}
                                                    >
                                                        <Radio value={1}>按商品累加运费</Radio>
                                                        <Radio value={2}>组合运费（推荐使用）</Radio>
                                                    </Radio.Group>
                                                    <span className="rule" onClick={() => this.toHelp()}>运费计费规则</span>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </Row>
                                <Row className="two-row">
                                    <Col span={24} className="two-one-col">
                                        <div className="new-create">
                                            <Button type="primary" onClick={this.showTemplate}>新建运费模板</Button>
                                        </div>
                                        <div className="temp-choice">
                                            <span className="choice-title">当前使用模板：</span>
                                            <span
                                                className="choice-name"
                                            >{defaultValue}
                                            </span>
                                        </div>
                                    </Col>
                                    <Col span={24} className="two-row-col">
                                        <Table
                                            dataSource={tableData}
                                            columns={columns}
                                            expandedRowRender={(e) => this.expandedRowRender(e)}
                                            pagination={false}
                                            onExpand={this.onExpand}
                                            expandIcon={this.CustomExpandIcon}
                                        />
                                    </Col>
                                </Row>
                            </Skeleton>
                            {show && (
                                <HandleModal
                                    visible={show}
                                    width={400}
                                    title="温馨提示"
                                    footer={footer}
                                    closable
                                    centered //垂直居中展示 Modal
                                    content={content}
                                    onCancel={this.shut}
                                />
                            )
                            }
                        </div>
                    ) : <ErrPage/>
                }
            </React.Fragment>
        );
    }
}


const mapStateToProps = (state) => {
    const disReducer = state.get('disReducer');
    return {
        mailTemplateInfo: disReducer.get('mailTemplateInfo')
    };
};
const mapDispatchToProps = {
    getMailTemplate: disAtionCreator.getMailTemplate
};
export default connect(mapStateToProps, mapDispatchToProps)(FreightList);
