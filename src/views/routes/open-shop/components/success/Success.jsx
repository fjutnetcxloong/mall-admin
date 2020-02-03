/**
 * 开店状态页
 * 雷疆
 */
import {Row, Typography, Col, Button} from 'antd';
import PropTypes from 'prop-types';
import './Success.less';


const {appHistory} = Utils;
const {Title} = Typography;
const {Text} = Typography;
class Success extends React.PureComponent {
    static propTypes = {
        qrcode: PropTypes.string.isRequired
    }

    lookMyShop = () => {
        appHistory.replace('/profile');
    }

    render() {
        const {qrcode} = this.props;
        return (
            <Row className="success-content">
                <Row className="success-logo">
                    <span className="icon icon-success"/>
                </Row>
                <Row>
                    <Title level={4}>审核提交成功</Title>
                </Row>
                <Row>
                    <Text type="secondary" strong className="text-desc">您的开店申请已审核通过，开店后消费者如果使用CAM余额支付，钱款将直接到账至您的微信零钱，为保障资金安全到账，请扫取二维码进行微信账号绑定</Text>
                </Row>
                <Row className="allow">
                    <Col span={6}>
                        <Title level={4}>绑定小程序</Title>
                    </Col>
                    <Col span={18}>
                        <Row span={24} className="sign">
                            <Col span={6} className="QR-code">
                                <img src={qrcode} alt=""/>
                            </Col>
                            <Col span={18} className="flow">
                                <div>
                                    <dl>
                                        <dt>
                                        1、使用手机微信扫描二维码，进入小程序页面，同意微信授权
                                        </dt>
                                        <dt>
                                        2、进入设置-账号管理-添加账号，输入账号密码进行添加登陆
                                        </dt>
                                        <dt>
                                        3、完成绑定
                                        </dt>
                                        <dt>
                                            <span className="warning-text">注：未绑定微信将需要您手动提现。</span>
                                        </dt>
                                    </dl>
                                </div>
                                <Button type="primary" style={{marginBottom: '60px'}} onClick={this.lookMyShop}>查看后台</Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Row>
        );
    }
}
export default Success;
