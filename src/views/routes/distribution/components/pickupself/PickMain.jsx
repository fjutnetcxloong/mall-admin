import {Button, Col, Row, Skeleton, Steps, Switch, Table} from 'antd';
import {connect} from 'react-redux';
import BaseComponent from '../../../../../components/base/BaseComponent';
import HandleModal from '../../../../common/handle-modal/HandleModal';
import {disAtionCreator} from '../../action';

const {Step} = Steps;
const {api} = Configs;
class PickMain extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            showStatus: '',  //页面显示状态
            skeleton: true, //内容骨架
            columns: [
                {
                    title: '核销点名称',
                    dataIndex: 'site',
                    key: 'site'
                }, {
                    title: '所在地',
                    dataIndex: 'address',
                    key: 'address'
                }, {
                    title: '具体地址',
                    dataIndex: 'detailAddress',
                    key: 'detailAddress'
                }, {
                    title: '联系电话',
                    dataIndex: 'phone',
                    key: 'phone'
                }, {
                    title: '操作',
                    dataIndex: 'action',
                    key: 'action',
                    render: (text, record) => (this.state.data.length >= 1 ? (
                        <div>
                            <span onClick={() => this.edit(text, record)} className="editBtn">
                                编辑
                            </span>
                        </div>
                    ) : null)
                }
            ],
            data: [],
            value: '',
            showMain: true,
            provinceId: '',   //省ID
            cityId: '',      //市id
            countyId: '',     //县id
            editInfo: {},    //编辑的信息
            editArea: [],  //编辑的地区
            latitude: '',
            longitude: '',
            showRule: false, //扫码核销功能说明弹框
            hasPickUp: false, //提示无法关闭核销按钮的弹框
            areaName: [] //获取位置
        };
    }

    componentDidMount() {
        console.log('子组件---主页面');
        // this.getData();
        const {pickupInfo} = this.props;
        if (pickupInfo) {
            this.setPickupInfo(pickupInfo);
            // this.closeSkeleton();
        } else {
            this.getPickupInfo();
        }
    }

    componentWillReceiveProps(nextProps) {
        console.log('componentWillReceiveProps');
        if (nextProps.pickupInfo && nextProps.pickupInfo !== this.props.pickupInfo) {
            this.setPickupInfo(nextProps.pickupInfo);
            // this.closeSkeleton();
        }
    }

    //  获取地区名称
    getAreaName = (areaName) => {
        this.setState({
            areaName: areaName
        });
    };

    //获取自提信息
    getPickupInfo = () => {
        const {getPickupInfo} = this.props;
        getPickupInfo();
    };

    //处理自提信息
    setPickupInfo = (res) => {
        const {changeRoute} = this.props;
        if (res && res.status === 0) {
            if (res.data.status === 1 || res.data.cer_type === '2') {
                changeRoute('two');
                return;
            }
            const data = [];
            const obj = {key: 0};  // antd 表格需要key否则会警告
            let area = '';
            if (res.data.area && res.data.area.length !== 0) {
                area = res.data.area.replace(/\s/g, '-');
            }
            const bool = !!Number(res.data.pick_up_self);
            obj.site = res.data.sufficiency_name;
            obj.address = area;
            obj.detailAddress = res.data.sufficiency_address;
            obj.phone = res.data.sufficiency_phone;
            data.push(obj);
            const arr = [];
            arr.push(res.data.province_id, res.data.city_id, res.data.county_id);
            this.setState({
                data,
                editArea: arr,
                provinceId: res.data.province_id,
                cityId: res.data.city_id,      //市id
                countyId: res.data.county_id,     //县id
                latitude: res.data.sufficiency_latitude,
                longitude: res.data.sufficiency_longitude,
                value: bool,
                skeleton: false
            });
        } else {
            this.setState({
                skeleton: false
            });
        }
    };

    //编辑到点自提地址
    edit = (text, record) => {
        const {latitude, longitude, editArea} = this.state;
        const {changeRoute, setEditInfo} = this.props;
        const data = {
            editInfo: record,
            latitude: latitude,
            longitude: longitude,
            editArea: editArea
        };
        setEditInfo(data);
        changeRoute('one');
    };

    //切换上门自提功能
    changeIfExpress = (checked) => {
        let result = '';
        if (checked) {
            result = 1;
        } else {
            result = 0;
        }

        this.fetch(api.updateShopSelf, {
            data: {
                if_self: result
            }
        }).subscribe(res => {
            if (res.status === 0) {
                if (res.data.status === 2) {
                    this.setState({
                        hasPickUp: true
                    });
                } else {
                    this.setState({
                        value: checked
                    });
                }
            }
        });
    };

    //新增核销点名称
    addVerification = () => {
        this.setState({
            showMain: false
        });
    };

    //显示扫码核销功能说明
    showRule = () => {
        this.setState({
            showRule: true
        });
    };

    //关闭扫码核销功能说明
    shut = () => {
        this.setState({
            showRule: false,
            hasPickUp: false
        });
    };

    //切换页面
    changeRoute = (edit = '') => {
        this.setState({
            showStatus: edit
        });
    };


    render() {
        const {data, columns, value, skeleton, showRule, hasPickUp} = this.state;
        const {displayStatus} = this.props;
        const content = (
            <div className="showRule-model">
                <Steps
                    current={0}
                    type="navigation"
                    size="small"
                    labelPlacement="vertical"
                >
                    <Step title="放置店铺码" description="将集合支付码打印" status="wait"/>
                    <Step title="扫码核销" description="买家打开APP,点击“扫一扫”，选择“核销订单”,点击我要核销" status="wait"/>
                    <Step title="完成核销" status="wait"/>
                </Steps>
            </div>
        );
        const footer = (
            <div>
                <Button
                    type="primary"
                    onClick={this.shut}
                >
                    确定
                </Button>
            </div>
        );
        const content2 = (
            <p>当前上架商品中含有自提商品无法关闭。</p>
        );
        return (
            <div className="pickup-self" style={{display: displayStatus ? 'none' : ''}}>
                <Skeleton active loading={skeleton}>
                    <Row className="one-row">
                        <Col span={24} className="one-one-col">
                            <span className="buyer-tip">买家到店核销功能</span>
                            <div className="switch">
                                <Switch
                                    defaultChecked
                                    checked={value}
                                    onChange={this.changeIfExpress}
                                />
                            </div>
                        </Col>
                        <Col className="one-two-col" span={24}>
                            <div className="one-span">启用到店核销功能后，买家可以选择到店核销，下单后你需要尽快准备商品。</div>
                        </Col>
                    </Row>
                    {
                        showRule && (
                            <HandleModal
                                visible={showRule}
                                width={400}
                                title="扫码核销使用教程"
                                closable
                                centered //垂直居中展示 Modal
                                content={content}
                                onCancel={this.shut}
                            />
                        )
                    }
                    {
                        hasPickUp && (
                            <HandleModal
                                visible={hasPickUp}
                                width={400}
                                title="温馨提示"
                                closable
                                centered //垂直居中展示 Modal
                                content={content2}
                                footer={footer}
                                onCancel={this.shut}
                            />
                        )
                    }
                </Skeleton>
                <Skeleton active loading={skeleton}>
                    <Row className="two-row">
                        <Col span={24} className="two-one-col">
                            <Table columns={columns} dataSource={data} pagination={false}/>
                        </Col>
                        <Col span={24} className="two-two-col">
                            {
                                data.length === 0 && (
                                    <Button onClick={this.addVerification} className="add">新增核销点</Button>
                                )
                            }
                        </Col>
                    </Row>
                </Skeleton>
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    const disReducer = state.get('disReducer');
    return {
        pickupInfo: disReducer.get('pickupInfo')
    };
};
const mapDispatchToProps = {
    getPickupInfo: disAtionCreator.getPickupInfo
};
export default connect(mapStateToProps, mapDispatchToProps)(PickMain);
