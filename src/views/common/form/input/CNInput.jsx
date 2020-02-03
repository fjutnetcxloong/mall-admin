/**
 * 中文输入组件
 * Created by 安格
 */
import PropTypes from 'prop-types';
import {Input} from 'antd';

export default class CNInput extends React.PureComponent {
    static propTypes = {
        defaultInput: PropTypes.string, //初始值
        maxLength: PropTypes.number,  //限制长度
        onChange: PropTypes.func, // 表单域传入的onChange
        placeholder: PropTypes.string,   //输入框的placeholder
        allowClear: PropTypes.bool,   //是否允许清除
        disabled: PropTypes.bool //是否禁用
    };

    static defaultProps = {
        defaultInput: '',
        onChange() {},
        placeholder: '',
        maxLength: 11,
        allowClear: false,
        disabled: false
    };

    state = {
        isSpell: false //是否处于拼写状态
    };

    componentDidMount() {
        const {defaultInput, onChange} = this.props;
        if (defaultInput) {
            onChange(defaultInput);
        }
        setTimeout(() => {
            this.input.input.value = defaultInput;
        }, 100);
    }

    componentWillReceiveProps(Props) {
        const {value} = Props;
        if (value) {
            this.input.input.value = value;
        }
    }

    //组合输入事件
    handleComposition = (e) => {
        const value = e.target.value;
        if (e.type === 'compositionend') {
            //中文输入结束
            this.setState({
                isSpell: false
            }, () => {
                this.onHandleChange(value);
            });
        } else {
            //中文输入开始
            this.setState({
                isSpell: true
            });
        }
    }

    onHandleChange = (value = '') => {
        const {isSpell} = this.state;
        if (!isSpell) {
            const {onChange} = this.props;
            if (onChange) {
                onChange(value);
            }
        }
        return;
    };

    render() {
        const {placeholder, maxLength, allowClear, disabled} = this.props;
        return (
            <Input
                ref={el => { this.input = el }}
                onCompositionStart={this.handleComposition}
                onCompositionUpdate={this.handleComposition}
                onChange={(e) => this.onHandleChange(e.target.value)}
                onCompositionEnd={this.handleComposition}
                placeholder={placeholder}
                maxLength={maxLength}
                allowClear={allowClear}
                disabled={disabled}
            />
        );
    }
}
