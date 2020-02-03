/**
 * 数字输入框组件
 * Created by 邓小妹
 */
import PropTypes from 'prop-types';
import {Input} from 'antd';

const {validator} = Utils;
export default class NumericInput extends React.PureComponent {
    state = {
        value: ''
    };

    static propTypes = {
        maxLength: PropTypes.number, //input框的最大的输入长度
        placeholder: PropTypes.string, //input框的placeholder
        onChange: PropTypes.func, //输入框的onchange事件
        type: PropTypes.number.isRequired      //数字输入框的类型
    };

    static defaultProps = {
        maxLength: 11,
        onChange: {},
        placeholder: ''
    };

    onChange = (e) => {
        const {value} = e.target;
        const {type} = this.props;
        let result = false;
        if (type === 1) {
            result = (!Number.isNaN(value) && validator.numLimit(value)) || value === '';
        }
        if (type === 2) {
            result = validator.CNandEN(value) || value === '';
        }
        if (type === 3) {
            result = validator.checkEN(value) || value === '';
        }
        if (result) {
            this.setState({
                value
            });
            this.props.onChange(value);
        }
    };

    render() {
        const {placeholder, maxLength} = this.props;
        return (
            <Input
                onChange={this.onChange}
                placeholder={placeholder}
                maxLength={maxLength}
                value={this.state.value}
            />
        );
    }
}
