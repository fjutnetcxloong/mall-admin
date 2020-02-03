/**
 * 登陆注册页面布局
 */
import {withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import {Layout, Divider, Button, Typography} from 'antd';
import './User.less';

const {Header, Content, Footer} = Layout;
const {Title, Paragraph} = Typography;
const {INFO} = Constants;
class User extends React.PureComponent {
    static propTypes = {
        children: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.array
        ]),
        history: PropTypes.object
    };

    static defaultProps = {
        children: null,
        history: {}
    };

    render() {
        return (
            <Layout className="layout">
                <Header >
                    <Typography>
                        <Title level={3} className="title">
                            <span className="icon logo-icon"/>
                            <span className="main-title">{INFO.title}</span>
                            <Divider type="vertical"/>
                            <span className="sub-title">{INFO.subTitle}</span>
                        </Title>
                    </Typography>
                </Header>
                <Content>
                    {this.props.children}
                </Content>
                <Footer>
                    <Typography>
                        <Button onClick={() => this.props.history.go(0)}>
                            <Title level={3}>
                                {INFO.company}
                            </Title>
                        </Button>
                        <Paragraph>{INFO.information}</Paragraph>
                        <Paragraph>{INFO.support}</Paragraph>
                    </Typography>
                </Footer>
            </Layout>
        );
    }
}

export default withRouter(User);
