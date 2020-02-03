/**
 * 限制输入组件
 * Created by 安格
 */
import PropTypes from 'prop-types';
import {Input} from 'antd';

export default class GeisInput extends React.PureComponent {
    static propTypes = {
        defaultInput: PropTypes.string, //默认值
        maxLength: PropTypes.number,  //限制长度
        onChange: PropTypes.func, // 表单域传入的onChange
        placeholder: PropTypes.string,   //输入框的placeholder
        showPass: PropTypes.bool,  //输入框的显示类型，text或password
        suffix: PropTypes.element, //带有后缀图标的input
        allowClear: PropTypes.bool,   //是否允许清除
        type: PropTypes.string.isRequired, // 输入框使用正则类型
        isRMB: PropTypes.bool, //是否使用前缀￥
        disabled: PropTypes.bool, //是否禁用
        isFix: PropTypes.bool //是否需要补足小数点后两位
    };

    static defaultProps = {
        defaultInput: '',
        onChange() {},
        placeholder: '',
        maxLength: 11,
        showPass: false,
        allowClear: false,
        suffix: null,
        isRMB: false,
        disabled: false,
        isFix: false
    };

    constructor(props) {
        super(props);
        const {defaultInput, onChange} = props;
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

    onHandleChange  = (value = '') => {
        const {type} = this.props;
        const reg = new Map([
            ['limitSpace', /^(\S|(\S.*\S)) ?$/], //不能空格开头及连续输入空格
            ['amount', /^((0)|([1-9]{1}\d{0,7}))(\.\d{0,2})?$/], //金额 含两位小数
            ['discount', /^([8-9]{1})(\.{0,1}\d{1,2})$/], //折扣 8~9.5
            ['stock', /^\d+$/], //输入商品库存
            ['num',  /^\d+$/], //数字输入
            ['numAndBar', /^[\d-]*$/],  //数字和中横线(客服电话)
            ['cn', /^[a-zA-Z\u4e00-\u9fa5]+$/], //中文以及英文字母
            ['numEn', /^[0-9a-zA-Z]+$/],  //数字和英文
            ['es', /^\w+$/], //英文输入
            ['nonSpace', /^[^\s]*$/], //限制不能输入空格
            ['cnEnNum', /^[\u4E00-\u9FA5A-Za-z0-9_]+$/],  //中英文数字
            ['float', /^[0-9]+.?[0-9]*$/],    //可以输入小数的数字
            ['noCn', /[^\u4E00-\u9FFF\s]+$/]    //非中文以及非空格
        ]);
        if (!reg.get(type).test(value) && value !== '') {
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

    //失去焦点时若小数点后无数字补足0
    onBlur= () => {
        const {inputValue} = this.state;
        if (!Number.isNaN(inputValue) && inputValue.indexOf('.') !== -1 && inputValue.split('.')[1] === '') {
            this.setState({
                inputValue: parseInt(inputValue, 10).toFixed(2)
            }, () => {
                const {onChange} = this.props;
                if (onChange) {
                    onChange(this.state.inputValue);
                }
            });
        }
    };

    render() {
        const {placeholder, maxLength, showPass, suffix, allowClear, isRMB, disabled, isFix} = this.props;
        const {inputValue} = this.state;
        return (
            <Input
                {...isFix && {onBlur: this.onBlur}}
                value={inputValue}
                onChange={(e) => this.onHandleChange(e.target.value)}
                placeholder={placeholder}
                maxLength={maxLength}
                type={showPass ? 'password' : 'text'}
                suffix={suffix}
                allowClear={allowClear}
                {...isRMB && {prefix: '￥'}}
                disabled={disabled}
            />
        );
    }
}
