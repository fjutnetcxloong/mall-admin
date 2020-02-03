/**
 * 对话框内表单组件，由当前路径判断表单渲染
 */
import PropTypes from 'prop-types';
import {Form, Input, Tag, Button, Row, Col} from 'antd';

const FormItem = Form.Item;
const {TextArea} = Input;
const {MESSAGE: {commodityManage}} = Constants;
class ModalForm extends React.PureComponent {
    static propTypes = {
        form: PropTypes.object.isRequired, //由经Form.create()包装过的父组件传入form属性
        path: PropTypes.string.isRequired, //当前路由路径
        rowData: PropTypes.object.isRequired //编辑表单时传入内容
    };

    constructor(props) {
        super(props);
        const {rowData} = props;
        this.state = {
            tags: rowData.tag_value ? rowData.tag_value.split(',') : [], //标签列表
            inputValue: '' //标签输入值
        };
    }

    //保存标签输入框ref
    saveInputRef = input => { this.input = input };

    //标签输入框值更改回调
    handleInputChange = e => {
        this.setState({
            inputValue: e.target.value
        });
    };

    //失去焦点/按回车/点击确认回调添加标签
    handleInputConfirm = () => {
        const {form: {validateFields}} = this.props;
        validateFields(['tag_value'], (err) => {
            if (!err) {
                const {inputValue} = this.state;
                let {tags} = this.state;
                if (!!inputValue && tags.indexOf(inputValue) === -1) {
                    tags = [...tags, inputValue];
                }
                this.setState({
                    tags,
                    inputValue: ''
                });
            }
        });
    };

    //渲染标签
    forMap = tag => {
        const tagElem = (
            <Tag
                key={tag}
                closable
                onClose={e => {
                    e.preventDefault();
                    this.handleClose(tag);
                }}
            >
                {tag}
            </Tag>
        );
        return (
            <span className="single-brand" key={tag}>
                {tagElem}
            </span>
        );
    };

    //删除标签回调
    handleClose = removedTag => {
        const {tags} = this.state;
        const newTags = tags.filter(tag => tag !== removedTag);
        this.setState({
            tags: newTags
        }, () => {
            const {form: {validateFields}} = this.props;
            validateFields(['tag_value'], {force: true}); //强制触发校验
            this.input.focus();
        });
    };

    render() {
        const {form: {getFieldDecorator}, path, rowData} = this.props;
        const {tags, inputValue} = this.state;
        const tagChild = tags.map(this.forMap);
        //表单布局
        //form分24份， label占4份， input占16份，剩下的4份是右边的留白空间
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 14}
        };
        if (path === 'group') {
            return (
                <Form
                    {...formItemLayout}
                >
                    <FormItem
                        label="分组名称"
                    >
                        {getFieldDecorator('group', {
                            rules: [
                                {required: true, message: commodityManage.no_groupName},
                                {pattern: /^[\u4e00-\u9fa5]+$/, message: commodityManage.error_groupName}
                            ],
                            ...rowData.group && {initialValue: rowData.group}
                        })(
                            <Input
                                {...rowData.type ? {disabled: true} : {placeholder: '请输入1-8位中文字符'}}
                                allowClear
                                maxLength={8}
                            />
                        )}
                    </FormItem>
                    <FormItem
                        label="备注"
                    >
                        {getFieldDecorator('remark', {
                            initialValue: rowData.remark || ''
                        })(
                            <TextArea
                                autosize={{minRows: 3, maxRows: 5}}//指定最小行数和最大行数
                                maxLength={20}
                                placeholder="请输入0-20个字符"
                            />
                        )}
                    </FormItem>
                </Form>
            );
        }
        return (
            <Form
                {...formItemLayout}
                className="new-label-set"
            >
                <FormItem
                    label="标签组名称"
                >
                    {getFieldDecorator('tag_name', {
                        rules: [
                            {required: true, message: commodityManage.no_tagGroupName},
                            {pattern: /^[\u4e00-\u9fa5]+$/, message: commodityManage.error_tagGroupName}
                        ],
                        ...rowData.tag_name && {initialValue: rowData.tag_name}
                    })(
                        <Input
                            {...rowData.type ? {disabled: true} : {placeholder: '请输入1-8位中文字符'}}
                            allowClear
                            maxLength={8}
                        />
                    )}
                </FormItem>
                <FormItem
                    label="标签"
                    wrapperCol={{span: 14}}
                    className="ticket"
                >
                    {getFieldDecorator('tag_value', {
                        rules: [
                            {required: (tags.length === 0), message: commodityManage.no_tag},
                            {pattern: /^[\u4E00-\u9FA5A-Za-z0-9_]+$/, message: commodityManage.error_tag}
                        ]

                    })(
                        tags.length < 5 ? (
                            <div>
                                <Input
                                    ref={this.saveInputRef}
                                    placeholder="请输入1-5位字符"
                                    value={inputValue}
                                    onChange={this.handleInputChange}
                                    onBlur={this.handleInputConfirm}
                                    onPressEnter={this.handleInputConfirm}
                                    maxLength={5}
                                />
                                <Button onClick={this.handleInputConfirm}>确定</Button>
                            </div>
                        ) : (
                            <span>最多添加5个标签</span>
                        )
                    )}
                </FormItem>
                <Row className="brand-box">
                    <Col span={12} offset={6}>
                        {tagChild}
                    </Col>
                </Row>
            </Form>
        );
    }
}

export default ModalForm;
