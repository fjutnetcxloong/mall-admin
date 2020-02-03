/**
 * 订单模块弹出框
 */
import PropTypes from 'prop-types';
import './ClosePrompt.less';
import {Input, Button} from 'antd';

const {TextArea} = Input;
const {showFail} = Utils;

class DetelePrompt extends BaseComponent {
    state = {
        reason: '' //关闭订单原因
    };

    static propTypes = {
        close: PropTypes.func,
        masterSheet: PropTypes.string
    };

    componentDidMount() {}

    //组件API默认值
    static defaultProps = {
        close() {}, //关闭弹窗
        masterSheet: ''
    };

    //关闭弹窗
    close = () => {
        this.props.close();
    }

    //关闭原因
    InputBox = (res) => {
        this.setState({
            reason: res.target.value
        });
        console.log(res.target.value);
    }

    //确定按钮
    defineConfirm = () => {
        const {reason} = this.state;
        if (reason.length < 5 || reason.length > 30) {
            showFail('请输入5到30以内的原因');
        } else {
            this.props.masterSheet(reason);
        }
    }

    render() {
        return (
            <div className="area-selection">
                <div className="shade"/>
                <div className="content">
                    <div className="upper">
                        <div className="upper-text">关闭订单</div>
                        <span className="icon" onClick={this.close}/>
                    </div>
                    <div className="content-wrap">
                        <div className="close-reason">
                            <span className="must">*</span>
                            关闭原因：
                        </div>
                        <div className="reason">
                            <TextArea rows={6} onChange={this.InputBox}/>
                        </div>
                    </div>
                    <div className="close-btn">
                        <div>
                            <Button className="btn-delete" onClick={this.close}>取消</Button>
                        </div>
                        <div className="define">
                            <Button type="primary" className="btn-detail" onClick={this.defineConfirm}>确定</Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default DetelePrompt;
