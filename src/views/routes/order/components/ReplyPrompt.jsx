/**
 * 客户评价回复弹出框
 */
import PropTypes from 'prop-types';
import {Button, Input} from 'antd';
import './ReplyPrompt.less';
import HandleModal from '../../../common/handle-modal/HandleModal';

const {TextArea} = Input;
const {showFail} = Utils;
class ReplyPrompt extends BaseComponent {
    static propTypes = {
        visible: PropTypes.bool, //是否显示对话框
        onCancel: PropTypes.func, //点击对话框遮罩层或右上角叉或取消按钮的回调
        onOk: PropTypes.func, //点击对话框遮罩层或右上角叉或取消按钮的回调
        onOrderText: PropTypes.string // 回复内容
    };

    static defaultProps = {
        visible: false,
        onCancel() {},
        onOk() {},
        onOrderText: ''
    };

    state = {
        replyText: ''
    }

    //评价内容
    evaluationsText = (res) => {
        console.log(res.target.value);
        this.setState({
            replyText: res.target.value
        });
    }

    onCancel = () => {
        this.props.onCancel();
    }

    onOk = () => {
        const {replyText} = this.state;
        if (replyText) {
            this.props.onOk(replyText);
        } else {
            showFail('请输入评价内容');
        }
    }

    render() {
        const {visible, onCancel, onOrderText} = this.props;
        const details = (
            <div className="reply-box">
                <div className="opinion">
                    {onOrderText}
                </div>
                <div className="input-field ">
                    <TextArea
                        placeholder="请输入"
                        autosize={{minRows: 2, maxRows: 6}}
                        maxLength={200}
                        onChange={this.evaluationsText}
                    />
                </div>
            </div>
        );
        const fastener = (
            <div>
                <Button
                    onClick={onCancel}
                >
                    取消
                </Button>
                <Button
                    type="primary"
                    onClick={this.onOk}
                >
                    回复
                </Button>
            </div>
        );
        return (
            <div className="reply-prompt">
                <HandleModal
                    visible={visible}
                    title="回复评价"
                    closable
                    onOk={this.onOk}
                    onCancel={this.onCancel}
                    content={details}
                    footer={fastener}
                />
            </div>
        );
    }
}

export default ReplyPrompt;
