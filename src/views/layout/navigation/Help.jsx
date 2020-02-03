import {Drawer, Input, Empty} from 'antd';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import currentHref from '../../../configs/href.config';
import '../basic/Basic.less';

const {api} = Configs;
const {Search} = Input;
const {systemApi: {getValue}, warningMsg} = Utils;
const {MESSAGE: {ElseConfirm}} = Constants;

class Help extends BaseComponent {
    state = {
        issueQuantity: [], //存储搜索到的每一条数据
        listTitleID: '', //获取一级列表的ID
        isDefaultPage: false //缺省页
    }

    static propTypes = {
        visible: PropTypes.bool, //是否显示
        onClose: PropTypes.func, //点击右上角回调
        setUserInfo: PropTypes.func.isRequired
    };

    static defaultProps = {
        visible: true,
        onClose() {}
    };

    componentDidMount() {
        // this.helpCenterSecond(49);
        this.userRegister();
    }

    onClose = () => {
        this.props.onClose();
    }

    helpCenter = () => {
        window.open('#/support');
    }

    //获取帮助中心一级列表接口
    userRegister = () => {
        this.fetch(api.helpCenter, {method: 'post'}).subscribe(res => {
            // const {listTitleID} = this.state;
            console.log(res);
            if (res && res.status === 0) {
                this.setState({
                    listTitleID: res.id
                }, () => {
                    const {listTitleID} = this.state;
                    console.log(this.state.listTitleID);
                    this.helpCenterSecond(listTitleID);
                });
            }
        });
    }

    //帮助中心-二级列表接口
    helpCenterSecond = (id, key) => {
        this.fetch(api.helpCenterSecond, {
            data: {
                id,
                key
            }
        }).subscribe(res => {
            if (res && res.status === 0) {
                if (res.data.length > 0) {
                    this.setState({
                        issueQuantity: res.data,
                        isDefaultPage: false
                    });
                } else {
                    this.setState({
                        isDefaultPage: true
                    });
                }
            }
        });
    }

    //搜索全部二级列表关键字
    getSelectValue = (value) => {
        const filtration = value.replace(/(^\s*)|(\s*$)/g, '');
        if (!filtration) {
            warningMsg(ElseConfirm.not_import_information);
        } else {
            this.helpCenterSecond(null, filtration);
            // console.log(null, value);
        }
    }

    //跳转当前所选问题
    rouTo = (id1, id2, id3) => {
        window.open(`#/support?id1=${id1}&id2=${id2}&id3=${id3}`);
    };

    //跳转问题反馈
    problemFeedback = () => {
        const {userInfo} = this.props;
        const userInfoData = userInfo || JSON.parse(getValue('users'));
        const feedback = currentHref.feedback + '?uid=' + userInfoData.no;
        window.open(feedback);
        console.log(feedback);
    }

    render() {
        const {issueQuantity, isDefaultPage} = this.state;
        console.log(issueQuantity);
        const {visible} = this.props;
        return (
            <Drawer
                title="帮助中心"
                placement="right"
                mask={false}
                onClose={this.onClose}
                visible={visible}
                width={320}
            >
                <Search
                    placeholder="请输入您要搜索的问题"
                    enterButton="搜索"
                    size="large"
                    onSearch={value => this.getSelectValue(value)}
                />
                {
                    isDefaultPage ? (<Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>)
                        : (
                            <div className="issue">
                                {
                                    issueQuantity.map(item => (
                                        <span key={item.id}>
                                            <p onClick={() => this.rouTo(item.first, item.pid, item.id)}>{item.question}</p>
                                        </span>
                                    ))
                                }
                            </div>
                        )
                }

                <div className="help" onClick={this.helpCenter}>进入帮助中心</div>
                <div className="service">
                    <div onClick={this.problemFeedback}>问题反馈</div>
                    {/* <div>在线客服</div> */}
                    <div>电话客服:400-968-4315</div>
                </div>
            </Drawer>
        );
    }
}
const mapStateToProps = state => {
    const login = state.get('login');
    return {
        username: login.get('userInfo')
    };
};

export default connect(mapStateToProps, null)(Help);
