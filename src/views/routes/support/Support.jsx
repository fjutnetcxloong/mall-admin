import './Support.less';
import {Row, Col, Input, Icon, Button, Layout, Menu, Breadcrumb, List, Skeleton, Spin} from 'antd';
import HandleModal from '../../common/handle-modal/HandleModal';
import LoginHeader from '../../common/login-header/LoginHeader';
import currentHref from '../../../configs/href.config';

const {Search} = Input;
const {SubMenu} = Menu;
const {Content, Sider} = Layout;
const {api} = Configs;
const {TextArea} = Input;
const defaultSelected = [];
const listQuestion = [];
const {MESSAGE: {SalesReturn, ElseConfirm}} = Constants;
const {systemApi: {getValue}, successMsg, warningMsg, getUrlParam} = Utils;
class Support extends BaseComponent {
    state = {
        skeleton: true, //内容骨架
        question: false, //问题弹窗开关
        navigationBar: [], //侧边导航栏一级标题
        issueQuantity: [], //二级列表问题条数
        listStatus: true, //二级列表与详情页面切换开关
        helpDetails: {}, //帮助中心-详情页
        secondary: '', //二级列表名字
        listTitle: '', //一级列表名字
        listTitleID: '', //获取第一次打开页面ID,并传回后端
        defaultOpenKeys: '31', //获取一级列表ID
        value: '',
        openKeys: ['31'],  //存储展开的ID
        selectedKeys: '49', //当前选择的某一项
        spinning: false,  //懒加载动画
        showHeader: true  //展示头部右边内容
    }

    componentDidMount() {
        this.userRegister();
    }

    //打开问题弹窗
    question = () => {
        this.setState({
            question: true
        });
    }

    //关闭问题弹窗
    shut = () => {
        this.setState({
            question: false,
            value: ''
        });
    }

    //判断进入帮助中心方式，传入ID
    entranceMode = (id, id1) => {
        // console.log(id, id1);
        this.setState({
            defaultOpenKeys: id,
            selectedKeys: id1,
            openKeys: [id]
        });
    }

    //帮助中心接口
    userRegister = () => {
        this.fetch(api.helpCenter, {method: 'post'}).subscribe(res => {
            if (res && res.status === 0) {
                const arr = [];
                const obj = res.data;
                // console.log(obj);
                for (const i in obj) {
                    if (obj[i]) {
                        arr.push(obj[i]);
                    }
                }
                defaultSelected.push(arr[0].data[0].question);
                listQuestion.push(arr[0].title);
                console.log(arr);
                this.setState({
                    listTitleID: res.id,
                    navigationBar: arr,
                    skeleton: false
                }, () => {
                    //判断进入帮助中心的方式是否有带参数
                    const {listTitleID} = this.state;
                    this.setState({
                        spinning: true
                    }, () => {
                        if (window.location.href.includes('id')) {
                            const id1 = decodeURI(getUrlParam('id1', encodeURI(this.props.location.search)));
                            const id2 = decodeURI(getUrlParam('id2', encodeURI(this.props.location.search)));
                            const id3 = decodeURI(getUrlParam('id3', encodeURI(this.props.location.search)));
                            this.entranceMode(id1, id2);
                            this.fetch(api.helpCenterParticulars, {method: 'post',
                                data: {
                                    id: Number(id3)
                                }}).subscribe(arrs => {
                                if (arrs && arrs.status === 0) {
                                    console.log('中心小学');
                                    this.setState({
                                        listStatus: false,
                                        helpDetails: arrs.data,
                                        spinning: false
                                    });
                                }
                            });
                        } else {
                            const {defaultOpenKeys} = this.state;
                            this.helpCenterSecond(listTitleID, listQuestion, defaultSelected, defaultOpenKeys);
                        }
                    });
                });
            } else {
                //如接口不成功也关闭骨架屏
                this.setState({
                    skeleton: false
                });
            }
        });
    };

    //帮助中心-二级列表接口
    helpCenterSecond = (id, title, question, id2) => {
        console.log(id, title, question, id2);
        this.setState({
            listTitle: title,
            secondary: question,
            defaultOpenKeys: id2,
            selectedKeys: id,
            spinning: true
        }, () => {
            this.onOpenChange([id2]);
            this.fetch(api.helpCenterSecond, {method: 'post',
                data: {
                    id
                }
            }).subscribe(res => {
                const {openKeys} = this.state;
                if (id2) {
                    this.setState({
                        openKeys: openKeys.filter(key => key === id2)
                    }, () => {
                        console.log(this.state.openKeys);
                    });
                }
                if (res && res.status === 0) {
                    this.setState({
                        issueQuantity: res.data,
                        listStatus: true,
                        spinning: false
                    });
                }
            });
        });
    }

    //帮助中心-详情页接口
    getQuestionContnet = (id1, id2, id3) => {
        this.entranceMode(id1, id2);
        this.setState({
            spinning: true
        }, () => {
            this.fetch(api.helpCenterParticulars, {method: 'post',
                data: {
                    id: id3
                }}).subscribe(res => {
                if (res && res.status === 0) {
                    this.setState({
                        listStatus: false,
                        helpDetails: res.data,
                        spinning: false
                    }, () => {
                        console.log(this.state.helpDetails);
                    });
                } else {
                    this.setState({
                        spinning: false
                    });
                }
            });
        });
    }

    //搜索全部二级列表关键字
    getSelectValue = (value) => {
        console.log(value);
        //过滤字符串中所有空格
        const filtration = value.replace(/(^\s*)|(\s*$)/g, '');
        if (!filtration) {
            warningMsg(ElseConfirm.not_import_information);
        } else {
            this.setState({
                spinning: true
            });
            this.fetch(api.helpCenterSecond, {method: 'post',
                data: {
                    key: filtration
                }
            }).subscribe(res => {
                console.log(res);
                if (res && res.status === 0) {
                    this.setState({
                        issueQuantity: res.data,
                        listStatus: true,
                        listTitle: '',
                        secondary: '',
                        spinning: false
                    }, () => {
                        console.log(this.state.issueQuantity);
                    });
                } else {
                    this.setState({
                        spinning: false
                    });
                }
            });
        }
    }

    //存储提问内容
    askQuestionValue = (e) => {
        this.setState({
            value: e.target.value
        });
    }

    //我要问接口
    askQuestion = () => {
        this.setState({
            spinning: true
        }, () => {
            const {value} = this.state;
            const filtration = value.replace(/(^\s*)|(\s*$)/, '');
            if (!filtration) {
                warningMsg(ElseConfirm.not_submit_information);
                this.setState({
                    spinning: false
                });
            } else {
                this.fetch(api.helperQuestion, {method: 'post',
                    data: {
                        question: filtration
                    }}).subscribe(res => {
                    if (res && res.status === 0) {
                        successMsg(SalesReturn.Submit_Success);
                        this.setState({
                            question: false,
                            value: '',
                            spinning: false
                        });
                    } else {
                        this.setState({
                            spinning: false
                        });
                    }
                });
            }
        });
    }

    // 存储展开项
    onOpenChange = (openKeys) => {
        console.log(openKeys);
        this.setState({
            openKeys: openKeys
        }, () => {
            console.log(typeof this.state.openKeys);
        });
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
        const {question, navigationBar, issueQuantity, listStatus, helpDetails, skeleton, secondary, listTitle, defaultOpenKeys, openKeys, selectedKeys} = this.state;
        console.log(defaultOpenKeys, selectedKeys, openKeys);
        const query = (
            <div>
                <Button
                    onClick={this.shut}
                >
                    取消
                </Button>
                <Button
                    type="primary"
                    onClick={this.askQuestion}
                >
                    保存
                </Button>
            </div>
        );
        const logisticsr = (
            <div className="submit-issue">
                <div className="explain">
                    <p>很抱歉给您带来不便</p>
                    <p>请在下方输入您的具体问题，我们将尽快为您解决</p>
                </div>
                <TextArea
                    placeholder="请输入具体问题，我们将尽快为您解决 ( 限100字 )"
                    autosize="false"
                    maxLength={100}
                    // value={value}
                    onChange={e => this.askQuestionValue(e)}
                />
            </div>
        );
        //TODO:德阳说，暂无接口，先写死，后期优化
        const hotSearch = [
            {
                nameOne: '账号管理',
                nameTwo: '登录',
                ID1: '31',
                ID3: '49'
            },
            {
                nameOne: '开店帮助',
                nameTwo: '开店流程',
                ID1: '32',
                ID3: '39'
            },
            {
                nameOne: '开店帮助',
                nameTwo: '店铺认证',
                ID1: '32',
                ID3: '40'
            }
        ];
        return (
            <Row className="altitude">
                <Col span={24}>
                    <div className="support">
                        <div className="help-top">
                            <Col span={18} offset={3}>
                                <LoginHeader
                                    visible={this.state.showHeader}
                                />
                            </Col>
                        </div>
                        <Spin spinning={this.state.spinning} tip="Loading...">
                            <Col span={18} offset={3}>
                                <Skeleton active loading={skeleton}>
                                    <div className="search-box">
                                        <span className="search-left">商家帮助中心</span>
                                        <div className="probe">
                                            <div>
                                                <Search
                                                    prefix={<Icon type="search" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                                    icon="search"
                                                    placeholder="请输入关键文字"
                                                    enterButton="搜索"
                                                    size="large"
                                                    onSearch={value => this.getSelectValue(value)}
                                                />
                                                <Button className="quiz" type="primary" onClick={this.question}>我要问</Button>
                                            </div>
                                            <div>
                                                {
                                                    hotSearch.map((item) => (
                                                        <span onClick={() => this.helpCenterSecond(item.ID3, item.nameOne, item.nameTwo, item.ID1)}>{item.nameTwo}</span>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </Skeleton>
                            </Col>
                            <Col span={18} offset={3}>
                                <Layout>
                                    <Layout>
                                        <Skeleton active loading={skeleton}>
                                            <Sider>
                                                <Menu
                                                    mode="inline"
                                                    defaultOpenKeys={[defaultOpenKeys]}
                                                    onOpenChange={this.onOpenChange}
                                                    openKeys={openKeys}
                                                    selectedKeys={[selectedKeys]}
                                                    style={{height: '100%', borderRight: 0}}
                                                >
                                                    {
                                                        navigationBar.map(item => (
                                                            <SubMenu
                                                                key={item.id}
                                                                // onClick={() => this.firstListTitle(item.id)}
                                                                title={(
                                                                    <span>{item.title}</span>
                                                                )}
                                                            >
                                                                {
                                                                    item.data.map((item2) => (
                                                                        <Menu.Item
                                                                            key={item2.id}
                                                                            onClick={() => this.helpCenterSecond(item2.id, item.title, item2.question, item.id)}
                                                                        >{item2.question}
                                                                        </Menu.Item>
                                                                    ))
                                                                }
                                                            </SubMenu>
                                                        ))
                                                    }
                                                </Menu>
                                            </Sider>
                                        </Skeleton>
                                        <Skeleton active loading={skeleton}>
                                            <Layout>
                                                <Breadcrumb>
                                                    <Breadcrumb.Item>{listTitle}</Breadcrumb.Item>
                                                    <Breadcrumb.Item className="second">{secondary}</Breadcrumb.Item>
                                                </Breadcrumb>
                                                <Content
                                                    style={{
                                                        background: '#fff'
                                                    }}
                                                >
                                                    {
                                                        listStatus ? (
                                                            <List
                                                                className="help-each"
                                                                itemLayout="horizontal"
                                                                dataSource={issueQuantity}
                                                                renderItem={item => (
                                                                    <List.Item onClick={() => this.getQuestionContnet(item.first, item.second, item.id)}>
                                                                        <List.Item.Meta title={item.question}/>
                                                                    </List.Item>
                                                                )}
                                                            />
                                                        ) : (
                                                            <div>
                                                                <div className="particulars-top">
                                                                    {helpDetails.question}
                                                                </div>
                                                                <div dangerouslySetInnerHTML={{__html: helpDetails.answer}}/>
                                                            </div>
                                                        )
                                                    }
                                                </Content>
                                            </Layout>
                                        </Skeleton>
                                    </Layout>
                                </Layout>
                            </Col>
                            {
                                question && (
                                    <HandleModal
                                        visible={question}
                                        title="提交问题"
                                        closable
                                        footer={query}
                                        content={logisticsr}
                                        onCancel={this.shut}
                                    />
                                )
                            }
                        </Spin>
                        <div className="flotage">
                            <div className="telephone">
                                <p>客服热线：</p>
                                <p>400-968-4315</p>
                            </div>
                            {/* <div className="service icon">IM客服</div> */}
                            <div className="issue" onClick={this.problemFeedback}>问题反馈<img src={require('../../../assets/images/icon.png')} alt=""/></div>
                        </div>
                    </div>
                </Col>
            </Row>
        );
    }
}
export default Support;
