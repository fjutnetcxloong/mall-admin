/**
 * 限制输入组件
 * Created by 小妹
 */
import PropTypes from 'prop-types';
import {Input} from 'antd';

const {TextArea} = Input;
export default class NoSpaceTextArea extends React.PureComponent {
    static propTypes = {
        maxLength: PropTypes.number,  //限制长度
        row: PropTypes.number,  //textArea的高度
        onChange: PropTypes.func, // 表单域传入的onChange
        placeholder: PropTypes.string,  //输入框的placeholder
        defaultInput: PropTypes.string   //默认值
    };

    static defaultProps = {
        onChange() {},
        placeholder: '',
        maxLength: 100,
        row: 6,
        defaultInput: ''
    };

    constructor(props) {
        super(props);
        const {defaultInput, onChange} = this.props;
        this.state = {
            inputValue: defaultInput
        };
        if (defaultInput) {
            onChange(defaultInput);
        }
    }

    componentWillReceiveProps(Props) {
        const {value} = Props;
        if (value) {
            this.setState({
                inputValue: value
            });
        }
    }

    onHandleChange  = e => {
        const {value} = e.target || '';
        const reg = new Map([
            ['noSpace', /^[^\s]*$/] //除空格外
        ]);
        if (!reg.get('noSpace').test(value) && value !== '') {
            return;
        }
        const {onChange} = this.props;
        if (onChange) {
            onChange(value);
            this.setState({
                inputValue: value
            });
        }
    };

    render() {
        const {placeholder, maxLength, row} = this.props;
        const {inputValue} = this.state;
        console.log(this.props);
        return (
            <TextArea
                value={inputValue}
                onChange={this.onHandleChange}
                placeholder={placeholder}
                maxLength={maxLength}
                row={row}
            />
        );
    }
}
