/**
 * 物流详情弹出框
 */
import PropTypes from 'prop-types';
import {Steps} from 'antd';
import './LogisticsPrompt.less';
import HandleModal from '../../../common/handle-modal/HandleModal';

const {Step} = Steps;
const {api} = Configs;
const {showFail} = Utils;

class LogisticsPrompt extends BaseComponent {
    static propTypes = {
        visible: PropTypes.bool, //是否显示对话框
        orderId: PropTypes.string, //获取订单id
        onCancel: PropTypes.func //点击对话框遮罩层或右上角叉或取消按钮的回调
    };

    static defaultProps = {
        visible: false,
        onCancel() {},
        orderId: ''
    };

    state = {
        logisticsData: [] //物流详情列表
    }

    componentDidMount() {
        this.logisticsDetail();
    }

    logisticsDetail = () => {
        const {orderId} = this.props;
        this.fetch(api.logisticsTrack, {method: 'POST',
            data: {
                order_id: orderId //1165
            }}).subscribe(res => {
            if (res) {
                if (res.status === 0) {
                    if (res.data) {
                        if (res.data.express_content) {
                            this.setState({
                                logisticsData: res.data.express_content.data
                            });
                        } else {
                            showFail('暂无物流详情');
                        }
                    }
                }
            }
        });
    }

    render() {
        const {logisticsData} = this.state;
        const {visible, onCancel} = this.props;
        const details = (
            <div className="logistics-box">
                <Steps direction="vertical" progressDot current={0}>
                    {logisticsData && logisticsData.map((item) => (
                        <Step key={item.time} title={item.context} description={item.time}/>
                    ))}
                </Steps>
            </div>
        );
        return (
            <div className="reply-prompt">
                <HandleModal
                    visible={visible}
                    title="物流详情"
                    closable
                    onCancel={onCancel}
                    content={details}
                    // footer={fastener}
                />
            </div>
        );
    }
}

export default LogisticsPrompt;
