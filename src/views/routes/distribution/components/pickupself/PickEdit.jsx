import {Row, Col, Form, Input} from 'antd';
import {connect} from 'react-redux';
import {BottomButton} from '../../../../common/bottom-button/index';
import {GetArea} from '../../../../common/get-area/index';
import {disAtionCreator} from '../../action';

const {api} = Configs;
const {validator, showFail} = Utils;
const {Search} = Input;
const {MESSAGE: {WRITEOFF}} = Constants;
const formItemLayout = {
    labelCol: {span: 4},
    wrapperCol: {span: 8}
};

class PickEdit extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            provinceId: '',   //省ID
            cityId: '',      //市id
            countyId: '',     //县id
            latitude: '',
            longitude: '',
            areaName: [] //获取位置
        };
    }

    componentDidMount() {
        console.log('bianji');
        this.setAreaName();
    }

    //设置初始编辑地区的信息
    setAreaName = () => {
        const {editInfo, longitude, latitude, editArea} = this.props;
        this.setState({
            areaName: editInfo.address.split('-'),
            longitude,
            latitude,
            provinceId: editArea[0],
            cityId: editArea[1],
            countyId: editArea[2]
        }, () => {
            this.renderMap();
        });
    }

    renderMap = () => {
        const {longitude, latitude} = this.state;
        this.map = new window.BMap.Map('container');
        const point = new window.BMap.Point(longitude, latitude);
        this.map.centerAndZoom(point, 15);
        const marker = new window.BMap.Marker(point);
        this.map.addOverlay(marker);
    };

    //保存
    saveEditTemplate = () => {
        const {changeRoute, getPickupInfo} = this.props;
        const {latitude, longitude, provinceId, cityId, countyId} = this.state;
        this.props.form.validateFields({first: true, force: true}, (err, val) => {
            if (!err) {
                this.fetch(api.setSelf, {data: {
                    phone: val.phone,
                    addr: val.detailAddress,
                    name: val.name,
                    latitude,
                    longitude,
                    province_id: provinceId,
                    city_id: cityId,
                    county_id: countyId
                }}).subscribe(res => {
                    if (res.status === 0) {
                        changeRoute();
                        getPickupInfo();
                    }
                });
            } else {
                console.log(err, val);
            }
        });
    };

    //检验名字
    checkName = (rule, value, callback) => {
        if (value && !validator.checkStr(value, 4, 20)) {
            validator.showMessage(WRITEOFF.error_name, callback);
            return;
        }
        callback();
    };

    //检验地址
    checkAddress = (rule, value, callback) => {
        const {provinceId, cityId, countyId} = this.state;
        if (!validator.isEmpty(provinceId, WRITEOFF.address_null, callback)) return;
        if (!validator.isEmpty(cityId, WRITEOFF.no_city, callback)) return;
        if (!validator.isEmpty(countyId, WRITEOFF.no_county, callback)) return;
        callback();
    };

    //改变地区
    getAreaArr = (value) => {
        if (value.length === 1) {
            this.setState({
                provinceId: Number(value[0]),
                cityId: '',
                countyId: ''
            });
        } else if (value.length === 2) {
            this.setState({
                cityId: Number(value[1]),
                countyId: ''
            });
        } else {
            this.setState({
                countyId: Number(value[2])
            });
        }
    };

    //  获取地区名称
    getAreaName = (areaName) => {
        this.setState({
            areaName: areaName
        });
    };

    //检查详细地址
    checkDetailAddress = (rule, value, callback) => {
        if (value && !validator.checkStr(value, 4, 30)) {
            validator.showMessage(WRITEOFF.error_detailAddress, callback);
            return;
        }
        callback();
    };

    //获取输入框地址信息
    getAddress = (val) => {
        console.log(val);
        const {areaName} = this.state;
        const area = `${areaName.toString().replace(/,/g, '') + val}`;
        this.addressGoGeoc(area);
    };

    //  解析地址
    addressGoGeoc = (address) => {
        // 创建地址解析器实例
        const myGeo = new window.BMap.Geocoder();
        // 将地址解析结果显示在地图上，并调整地图视野
        myGeo.getPoint(address, (point) => {
            if (point) {
                this.setState({
                    longitude: point.lng,
                    latitude: point.lat
                }, () => {
                    this.renderMap();
                });
            } else {
                showFail(WRITEOFF.address_invalid);
            }
        });
    }

    //检验手机
    chekedPhone = (rule, value, callback) => {
        if (value && !validator.checkPhone(value)) {
            validator.showMessage(WRITEOFF.error_phone, callback);
            return;
        }
        callback();
    };

    //取消编辑
    cancelEditTemplate = () => {
        this.props.changeRoute();
    };

    render() {
        const {editInfo, editArea} = this.props;
        const {getFieldDecorator} = this.props.form;
        return (
            <div className="pickup-edit">
                <Row className="one-row">
                    <Col span={24} className="one-one-col">
                        <span className="tip">
                                编辑核销地址
                        </span>
                    </Col>
                </Row>
                <Row className="two-row">
                    <Form onSubmit={this.saveEditTemplate} {...formItemLayout} className="edit-form">
                        <Form.Item label="核销点名称">
                            {getFieldDecorator('name', {
                                initialValue: editInfo.site,
                                rules: [
                                    {required: true, message: WRITEOFF.name_null},
                                    {validator: this.checkName}
                                ]
                            })(
                                <Input maxLength={20}/>
                            )}
                        </Form.Item>
                        <Form.Item label="核销点地址">
                            {getFieldDecorator('address', {
                                rules: [
                                    {validator: this.checkAddress}
                                ]
                            })(<GetArea
                                getAreaArr={this.getAreaArr}
                                editArea={editArea}
                                getAreaName={this.getAreaName}
                            />)}
                        </Form.Item>
                        <Form.Item label="地图定位">
                            {getFieldDecorator('detailAddress', {
                                initialValue: editInfo.detailAddress,
                                rules: [
                                    {required: true, message: WRITEOFF.no_detailAddress},
                                    {validator: this.checkDetailAddress}
                                ]
                            })(<Search
                                placeholder="请输入核销点具体地址"
                                enterButton="确定"
                                onSearch={value => this.getAddress(value)}
                            />)}
                        </Form.Item>
                        <div id="container" style={{height: '30vh', width: '280px', marginLeft: '135px'}}/>
                        <Form.Item label="联系电话" className="phone">
                            {getFieldDecorator('phone', {
                                initialValue: editInfo.phone,
                                rules: [
                                    {required: true, message: WRITEOFF.phone},
                                    {validator: this.chekedPhone}
                                ]
                            })(
                                <Input maxLength={11}/>
                            )}
                        </Form.Item>
                    </Form>
                </Row>
                <BottomButton
                    saveEditTemplate={this.saveEditTemplate}
                    cancelEditTemplate={this.cancelEditTemplate}
                    pickUpSelf="pickUpSelf"
                />
            </div>
        );
    }
}
const mapDispatchToProps = {
    getPickupInfo: disAtionCreator.getPickupInfo
};
const FormPickEdit = Form.create()(PickEdit);
export default connect(null, mapDispatchToProps)(FormPickEdit);
