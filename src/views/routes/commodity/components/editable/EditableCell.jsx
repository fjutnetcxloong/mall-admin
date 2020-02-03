/**
 * 可编辑单元格组件
 */
import {Form, InputNumber} from 'antd';
import PropTypes from 'prop-types';

const EditableContext = React.createContext();
class EditableCell extends React.PureComponent {
    static propTypes = {
        form: PropTypes.object.isRequired,
        onSaveCol: PropTypes.func, //将编辑内容存入表格数据源
        send: PropTypes.func, //编辑单元格报错则发送true
        record: PropTypes.object, //当前行数据
        children: PropTypes.array, //编辑前的单元格内容
        dataindex: PropTypes.string, //列索引
        title: PropTypes.string, //列标题
        editable: PropTypes.bool//列是否可编辑
    };

    static defaultProps = {
        onSaveCol() {},
        send() {},
        record: {},
        children: [],
        dataindex: '',
        title: '',
        editable: false
    };

    state = {
        editing: false //是否显示编辑输入框
    };

    //点击展开编辑框，获取焦点
    toggleEdit = (values) => {
        const {record, onSaveCol, dataindex} = this.props;
        this.setState((prevState) => ({
            editing: !prevState.editing
        }), () => {
            const {editing} = this.state;
            if (editing) {
                this.input.focus();
            } else {
                record[dataindex] = values[dataindex];
                onSaveCol(record);
            }
        });
    };

    //保存编辑框内容
    save = e => {
        const {form: {validateFields}, send} = this.props;
        validateFields((error, values) => {
            if (!error) {
                this.toggleEdit(values);
                send(false);
            } else {
                send(true);
            }
        });
    };

    renderCell = () => {
        const {children, dataindex, record, form, title} = this.props;
        const {editing} = this.state;
        const inputProps = new Map([
            ['price', {max: 99999999.99, min: 0.01, precision: 2, maxLength: 11}],
            ['original_price', {max: 99999999.99, min: 0, precision: 2, maxLength: 11}],
            ['discount', {max: 9.5, min: 8, precision: 2, maxLength: 4}],
            ['stock', {max: 999999999, min: 1, precision: 0, maxLength: 9}]
        ]);
        return editing ? (
            <Form.Item>
                {form.getFieldDecorator(dataindex, {
                    rules: [
                        {required: (dataindex !== 'original_price'), message: `请输入${title}`}
                    ],
                    initialValue: record[dataindex]
                })(
                    <InputNumber
                        ref={node => { this.input = node }}
                        onPressEnter={this.save}
                        onBlur={this.save}
                        {...inputProps.get(dataindex)}
                    />
                )}
            </Form.Item>
        ) : (
            <div onClick={this.toggleEdit}>
                {children}
            </div>
        );
    };

    render() {
        const {editable, children, ...restProps} = this.props;
        return (
            <td {...restProps}>
                {editable ? (
                    <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
                ) : (
                    children
                )}
            </td>
        );
    }
}

export default Form.create()(EditableCell);
