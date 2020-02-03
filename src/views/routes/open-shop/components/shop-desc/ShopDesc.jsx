/**
 * 开店类型介绍
 */
import {Button, Card, Col, Form, Radio, Row, Typography, Checkbox} from 'antd';
import PropTypes from 'prop-types';
import '../../pages/ShopPage.less';

const {MESSAGE: {LOGIN}} = Constants;
const {api} = Configs;
const {appHistory, showFail} = Utils;
class ShopDesc extends React.PureComponent {
    static propTypes = {
        shopIntro: PropTypes.object,
        criterion: PropTypes.func.isRequired,
        changeSelect: PropTypes.func.isRequired,
        value: PropTypes.number.isRequired
    }

    static defaultProps = {
        shopIntro: {}
    }

    state = {
        agreeStatus: [false, false, false]
    }

    //协议选择
    agreement = (e, i) => {
        const {agreeStatus} = this.state;
        agreeStatus.forEach((item, index) => {
            if (index === (i - 1)) {
                agreeStatus[index] = e.target.checked;
            } else {
                agreeStatus[index] = false;
            }
        });
        this.setState({
            agreeStatus: [...agreeStatus]
        });
    }

    //前往开店页面
    goShopPage = (i, type) => {
        const {agreeStatus} = this.state;
        if (agreeStatus[i - 1]) {
            XHR.fetch(api.checkShopType, {
                data: {
                    shop_type: type
                }
            }).subscribe(res => {
                if (res && res.status === 0) {
                    appHistory.push(`/shop-page?type=${type}`);
                }
            });
        } else {
            showFail(LOGIN.protocol_err);
        }
    }

    agreementContent = (i) => (
        <div className="agreement">
            <Checkbox onChange={(e) =>  this.agreement(e, i)} checked={this.state.agreeStatus[i - 1]}>已阅读并同意</Checkbox>
            <span className="norm" onClick={this.props.criterion}>《用户开店协议》</span>
        </div>
    );

    render() {
        const {shopIntro, changeSelect, value} = this.props;
        return (
            <div className="shop-style">
                <Row className="shop-select">
                    <Typography.Title level={4}>
                        您是否有营业执照？
                    </Typography.Title>
                    <Radio.Group onChange={changeSelect} value={value}>
                        <Radio value={1}>我有营业执照</Radio>
                        <Radio value={2}>我没有营业执照</Radio>
                    </Radio.Group>
                </Row>
                <Row gutter={16}>
                    {
                        value === 2 && (
                            <Col span={8}>
                                <Card
                                    title="网店"
                                    bordered={false}
                                    hoverable
                                >
                                    <p>仅需提供个人身份证及证明照</p>
                                    <div className="open-protocol">
                                        <Form.Item className="agreement-privacy">
                                            {this.agreementContent('1')}
                                        </Form.Item>
                                        <Button onClick={() => { this.goShopPage(1, 2) }}>立即开店</Button>
                                    </div>

                                </Card>
                                <div className="desc">{shopIntro.net}</div>
                            </Col>
                        )
                    }
                    {
                        value === 1 && (
                            <Col className="has-passport" span={8}>
                                <Card
                                    title="个体工商店"
                                    bordered={false}
                                    hoverable
                                >
                                    <p>需提供个人身份证及营业执照</p>
                                    <div className="open-protocol">
                                        <Form.Item className="agreement-privacy">
                                            {this.agreementContent('2')}
                                        </Form.Item>
                                        <Button onClick={() => { this.goShopPage(2, 1) }}>立即开店</Button>
                                    </div>
                                </Card>
                                <div className="desc">{shopIntro.individual_business}</div>
                            </Col>
                        )
                    }
                    {
                        value === 2 && (
                            <Col span={8}>
                                <Card
                                    title="个人店"
                                    bordered={false}
                                    hoverable
                                >
                                    <p>需提供个人身份证及摊位照</p>
                                    <div className="open-protocol">
                                        <Form.Item className="agreement-privacy">
                                            {this.agreementContent('3')}
                                        </Form.Item>
                                        <Button onClick={() => { this.goShopPage(3, 0) }}>立即开店</Button>
                                    </div>
                                </Card>
                                <div className="desc">
                                    {shopIntro.person}
                                </div>
                            </Col>
                        )
                    }
                </Row>
            </div>
        );
    }
}
export default ShopDesc;