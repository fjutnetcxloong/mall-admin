/*
* 登录页面
* */
import {connect} from 'react-redux';
import {Row, Col, Layout} from 'antd';
import ForgetPass from '../components/ForgetPass';
import LoginHeader from '../../../common/login-header/LoginHeader';
import LoginFrom from '../components/LoginFrom';
import {baseActionCreator} from '../../../../redux/baseAction';
import './Login.less';

const {Header, Footer, Content} = Layout;

class Login extends BaseComponent {
    state = {
        isForgetPassword: false //页面状态
    }

    componentDidMount() {
        // 重置请求接口userToken报错数目
        const {setNumTimeOut} = this.props;
        setNumTimeOut(0);
    }

    //切换 忘记密码 或者 登录
    changeForget = (bol) => {
        this.setState({
            isForgetPassword: bol
        });
    }

    render() {
        return (
            <Layout className="login">
                <Header>
                    <LoginHeader/>
                </Header>
                <Content className="content">
                    {
                        this.state.isForgetPassword
                            ? (<ForgetPass changeForget={this.changeForget}/>)
                            : (
                                <Row span={24} className="login-bg">
                                    <Col span={16}>
                                        <div className="login-bg-img"/>
                                    </Col>
                                    <Col span={8}>
                                        <LoginFrom changeForget={this.changeForget}/>
                                    </Col>
                                </Row>
                            )
                    }
                </Content>
                <Footer>© CAM消费管理 2019 鲁ICP备18044314号-1</Footer>
            </Layout>
        );
    }
}

const mapDispatchToProps = {
    setNumTimeOut: baseActionCreator.setNumTimeOut
};
export default connect(null, mapDispatchToProps)(Login);
