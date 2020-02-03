/**
 * 获取验证码按钮
 *
 */
import {Button} from 'antd';
import PropTypes from 'prop-types';
import './GetCode.less';

const {showInfo, showFail, validator} = Utils;
const {api} = Configs;
export default class GetCode extends React.PureComponent {
    static propTypes = {
        phone: PropTypes.string.isRequired,
        style: PropTypes.object,
        type: PropTypes.number
    }

    static defaultProps = {
        style: {},
        type: 0
    }

    state = {
        text: '获取验证码',
        times: 60,
        disable: false
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps !== this.props) {
            this.setState({
                disable: false,
                times: 60,
                text: '获取验证码'
            });
            clearInterval(this.timer);
        }
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }


    getCode = (phone, type) => {
        let {times} = this.state;
        if (times === 60) {
            if (phone && validator.checkPhone(phone)) {
                XHR.fetch(api.getCode, {data: {phone, type}}).subscribe(res => {
                    this.setState({
                        disable: true
                    });
                    if (res && res.status === 0) {
                        this.timer = setInterval(() => {
                            this.setState({
                                text: `${times -= 1}s后再次获取`,
                                times: times
                            });
                            if (times <= 0) {
                                this.setState({
                                    text: '再次获取',
                                    times: 60,
                                    disable: false
                                });
                                clearInterval(this.timer);
                            }
                        }, 1000);
                        showInfo('获取验证码成功');
                    }
                });
            } else {
                showFail('请先输入正确的手机号！');
            }
        }
    }

    render() {
        const {phone, style, type} = this.props;
        const disable = this.state.disable;
        return (
            <Button disabled={disable} className={`total-get-code ${phone.length === 11 ? 'button-highlight' :  ''}`} style={style} onClick={() => { this.getCode(Number(phone), type) }}>{this.state.text}</Button>
        );
    }
}
