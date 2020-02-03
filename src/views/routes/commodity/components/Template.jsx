/**
 * 商品分组和商品标签组件
 */
import PropTypes from 'prop-types';
import {Card, Skeleton, Form, Button, Table, Spin} from 'antd';
import HandleModal from '../../../common/handle-modal/HandleModal';
import HandlePage from '../../../common/handle-page/HandlePage';
import ModalForm from './ModalForm';
import '../Commodity.less';

class Template extends React.PureComponent {
    static propTypes = {
        form: PropTypes.object,
        path: PropTypes.string, //当前路由路径
        title: PropTypes.string, //页面标题
        subTitle: PropTypes.string, //页面副标题
        cardContent: PropTypes.node, //顶部卡片内容
        onAdd: PropTypes.func.isRequired, //点击新建回调
        visible: PropTypes.bool, //是否显示对话框
        isAdd: PropTypes.bool, //对话框操作类型 true:新建 false:编辑
        rowData: PropTypes.object, //选中行内容
        loading: PropTypes.bool, //是否显示对话框确认按钮loading动画
        onOk: PropTypes.func.isRequired, //点击对话框确认按钮回调
        onCancel: PropTypes.func.isRequired, //点击对话框遮罩层或右上角叉或取消按钮的回调
        dataSource: PropTypes.array, //表格数据源
        columns: PropTypes.array, //表格列的配置描述
        skeLoad: PropTypes.bool.isRequired, //是否显示骨架屏
        tableLoading: PropTypes.bool.isRequired, //是否显示表格loading动画
        page: PropTypes.number.isRequired, //当前页码
        pageSize: PropTypes.number.isRequired, //每页条数
        count: PropTypes.number.isRequired, //总条数
        onShowSizeChange: PropTypes.func.isRequired, //改变每页条数回调
        onChangePage: PropTypes.func.isRequired //改变页码回调
    };

    static defaultProps = {
        form: {},
        path: '',
        title: '',
        subTitle: '',
        cardContent: null,
        visible: false,
        isAdd: true,
        rowData: {},
        loading: false,
        dataSource: [],
        columns: []
    };

    onOk=() => {
        const {form: {validateFields}, path, onOk} = this.props;
        if (path === 'group') {
            //分组表单校验
            validateFields((err, values) => {
                if (!err) {
                    console.log('输入内容', values);
                    onOk(values);
                }
            });
        } else {
            //标签组表单校验
            validateFields((err, values) => {
                if (!err) {
                    const tagValue = this.ref.state.tags.join(','); //取子组件状态
                    const obj = {
                        tag_name: values.tag_name,
                        tag_value: tagValue
                    };
                    console.log('输入标签', obj);
                    onOk(obj);
                }
            });
        }
    }

    onCancel= () => {
        const {loading} = this.props;
        if (!loading) {
            this.props.onCancel();
        }
    }

    onShowSizeChange=(current, pageSize) => {
        const {onShowSizeChange} = this.props;
        onShowSizeChange(current, pageSize);
    }

    onChangePage=(page) => {
        const {onChangePage} = this.props;
        onChangePage(page);
    }

    render() {
        const {form, path, title, subTitle, cardContent, onAdd, visible, isAdd, rowData, loading,
            page, pageSize, count, dataSource, columns, skeLoad, tableLoading} = this.props;
        const footer = (
            <div>
                <Button
                    key="cancel"
                    disabled={loading}
                    onClick={this.onCancel}
                >
                    取消
                </Button>
                <Button
                    key="submit"
                    type="primary"
                    disabled={loading}
                    onClick={this.onOk}
                >
                    {isAdd ? '保存' : '修改'}
                </Button>
            </div>
        );
        //对话框表单
        const modalNode = (
            <ModalForm
                ref={el => { this.ref = el }}
                form={form}
                path={path}
                rowData={rowData}
            />
        );
        return (
            <div className="page commodity">
                <Card
                    className="commodity-top"
                    title={title}
                    bordered={false}
                >
                    <Skeleton active loading={skeLoad}>
                        {cardContent}
                        <Button
                            type="primary"
                            onClick={() => onAdd(true)}
                            disabled={tableLoading}
                        >
                            {`新建${subTitle}`}
                        </Button>
                    </Skeleton>
                </Card>
                <Card
                    className="commodity-table"
                    bordered={false}
                >
                    <Skeleton active loading={skeLoad}>
                        <Spin spinning={tableLoading}>
                            <Table
                                rowKey={record => record.rowKey}
                                bordered
                                dataSource={dataSource}
                                columns={columns}
                                pagination={false}
                            />
                            <HandlePage
                                page={page}
                                size={pageSize}
                                count={count}
                                onShowSizeChange={this.onShowSizeChange}
                                onChangePage={this.onChangePage}
                            />
                        </Spin>
                    </Skeleton>
                </Card>
                {visible && (
                    <HandleModal
                        visible={visible}
                        title={isAdd ? `新建${subTitle}` : `编辑${subTitle}`}
                        closable={false}
                        content={(
                            <Spin tip={`保存${subTitle}信息...`} spinning={loading}>
                                {modalNode}
                            </Spin>
                        )}
                        footer={footer}
                        onOk={this.onOk}
                        onCancel={this.onCancel}
                    />
                )}
            </div>
        );
    }
}

export default Form.create()(Template);
