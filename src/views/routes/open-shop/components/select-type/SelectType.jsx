import {Row, Col, Typography, Button} from 'antd';
import PropType from 'prop-types';
import './SelectType.less';

const {Title, Text} = Typography;
export default class SelectType extends React.PureComponent {
    static propTypes = {
        changePage: PropType.func.isRequired
    };

    render() {
        const {changePage} = this.props;
        return (
            <Row className="select-type" span={24}>
                <Title level={3}>选择您的店铺类型</Title>
                <Row className="type-heart" span={24}>
                    <Col span={8} className="type-left"/>
                    <Col span={15} className="type-right">
                        <Text level={2} strong>您是否有营业执照?</Text>
                        <Button type="primary" onClick={() => changePage(1)}>我有营业执照</Button>
                        <Button onClick={() => changePage(2)}>我没有营业执照</Button>
                    </Col>
                </Row>
            </Row>
        );
    }
}
