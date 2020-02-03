/**
 * 店铺信息组件
 * 雷疆
 */
import React from 'react';
import {Form, Select, Radio, Input} from 'antd';
import GeisInput from '../../../../common/form/input/GeisInput';
import './ShopInfo.less';

const formItemLayout = {
    labelCol: {span: 4},
    wrapperCol: {span: 10}
};
const {Option} = Select;
const {TextArea} = Input;
const {api} = Configs;
const {MESSAGE: {FORMVALIDATOR}} = Constants;
const {validator, getTime} = Utils;

class ShopInfo extends BaseComponent {
    state = {
        cate: [], //行业分类数据
        province: [], //获取省的数据
        city: [], //获取市数据
        county: [], //获取县的数据
        code: '', //市的id
        Ccode: '', //县城的id
        shopData: {}, //父组件传入回传数据
        hour: '', //小时
        min: '', //分钟
        openHour: '',
        openMin: '',
        closeHour: '',
        closeMin: '',
        preName: '',
        cityName: '',
        countryName: ''
    }

    componentDidMount() {
        this.getCate();
        this.getPcat();
        this.setState({
            min: getTime(60),
            hour: getTime(24)
        });
    }

    /**
     *
     * 回传数据并且取消图片的必填状态
     * 根据回传数据获取城市和县城的数据
     */
    componentWillReceiveProps(nextProps) {
        if (nextProps.shopData !== this.props.shopData) {
            this.setState({
                shopData: nextProps.shopData,
                code: nextProps.shopData.province_id,
                Ccode: nextProps.shopData.city_id,
                preName: nextProps.shopData.pcc_cn && nextProps.shopData.pcc_cn[0],
                cityName: nextProps.shopData.pcc_cn && nextProps.shopData.pcc_cn[1],
                countryName: nextProps.shopData.pcc_cn && nextProps.shopData.pcc_cn[2]
            }, () => {
                this.getCity();
                this.getCounty();
            });
        }
    }

    // 获取行业分类
    getCate = () =>  {
        this.fetch(api.getCategory, {
            data: {
                types: 1,
                id: 0
            }}).subscribe(res => {
            if (res && res.status === 0) {
                this.setState({
                    cate: res.data
                });
            }
        });
    }

    // 获取省数据
    // TODO:  区域选择封装
    getPcat = () => {
        this.fetch(api.getPcat, {
            data: {
                code: 0
            }}).subscribe(res => {
            if (res && res.status === 0) {
                this.setState({
                    province: res.data
                });
            }
        });
    }

    // 获取市数据
    getCity = () => {
        const {code} = this.state;
        if (code !== '0') {
            this.fetch(api.getPcat, {
                data: {
                    code
                }}).subscribe(res => {
                if (res && res.status === 0) {
                    this.setState({
                        city: res.data
                    });
                }
            });
        }
    }

    //获取县城数据
    getCounty = () => {
        const {Ccode} = this.state;
        if (Ccode !== '0') {
            this.fetch(api.getPcat, {
                data: {
                    code: Ccode
                }}).subscribe(res => {
                if (res && res.status === 0) {
                    this.setState({
                        county: res.data
                    });
                }
            });
        }
    }


    /**
     * 保存省id用来获取市列表数据
     * 当重新选择省的时候清空选中市和县选中状态
     */
    soloveCode = (val) => {
        const {code} = this.state;
        const {resetFields} = this.props.form;
        if (val !== code) {
            resetFields(['city', 'county']);
        }
        this.setState({
            code: val,
            cityName: '',
            Ccode: '',
            countryName: ''
        }, () => {
            this.getCity();
        });
    }

    // 保存选中的市的id用来获取县城列表数据
    soloveCountyCode = (val) => {
        const {Ccode} = this.state;
        const {resetFields} = this.props.form;
        if (val !== Ccode) {
            resetFields(['county']);
            this.setState({
                countryName: ''
            });
        }
        this.setState({
            Ccode: val
        }, () => {
            this.getCounty();
        });
    }

    // 验证折扣
    checkDiscount = (rule, value, callback) => {
        const reg = /^\d+$|^\d+\.\d+$/g;
        if (!validator.isEmpty(value, FORMVALIDATOR.no_discount, callback)) return;
        if (!reg.test(value)) {
            callback('请输入正确的折扣!');
            return;
        }
        if (Number(value) > 9.5 || Number(value) < 8) {
            validator.showMessage(FORMVALIDATOR.discount_err, callback);
            return;
        }
        callback();
    };

    //跳转帮助中心
    routeTo = () => {
        window.open(`#/support?id1=${32}&id2=${39}&id3=${51}`);
    }

    /**
     * 提交数据
     *  根据选中城市id查找出对应的城市名称
     * 分类信息上传 并通过回传数据查找出对应的分类回传
     *
     */
    submit = () => {
        const {province, city, county, cate} = this.state;
        const {validateFieldsAndScroll} = this.props.form;
        return new Promise((resoloved) => {
            validateFieldsAndScroll({first: true, force: true, scroll: {offsetTop: 100}}, (err, val) => {
                if (!err) {
                    //城市数据处理
                    if (!validator.checkCN(val.province)) {
                        val.province = province.find(item => val.province === item.code).name;
                    }
                    if (val.city && !validator.checkCN(val.city)) {
                        val.city = city.find(item => val.city === item.code).name;
                    }
                    if (val.county && !validator.checkCN(val.county)) {
                        val.county = county.find(item => val.county === item.code).name;
                    }
                    if (validator.checkCN(val.kind)) {
                        val.kind = cate.find(item => val.kind === item.cate_name);
                    } else {
                        val.kind = cate.find(item => val.kind === item.id1);
                    }
                    val.openTimes = val.openTime + ':' + val.openMin;
                    val.closeTimes = val.closeTime + ':' + val.closeMin;
                    if (val.openTimes.includes(undefined)) {
                        val.openTimes = '';
                    }
                    if (val.closeTimes.includes(undefined)) {
                        val.closeTimes = '';
                    }
                    if (val.city === undefined) {
                        val.city = '';
                    }
                    if (val.county === undefined) {
                        val.county = '';
                    }
                    resoloved(val);
                }
            });
        });
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {cate, province, city, county, shopData, hour, min, preName, cityName, countryName} = this.state;
        const {type} = this.props;
        return (
            <Form onSubmit={this.submit} className="login-form shopInfo-form" {...formItemLayout} hideRequiredMark>
                <Form.Item label="店铺名称">
                    {getFieldDecorator('shopName', {
                        initialValue: shopData.shopName,
                        rules: [
                            {required: true, message: FORMVALIDATOR.no_shop_name},
                            {pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9_]{2,30}$/, message: FORMVALIDATOR.shop_name_error}
                        ]
                    })(
                        <Input
                            placeholder="请输入店铺名称"
                            allowClear
                            maxLength={30}
                        />
                    )}
                    <span className="other" onClick={() => this.routeTo()}>查看命名规则</span>
                </Form.Item>
                <Form.Item hasFeedback label="主营类目">
                    {getFieldDecorator('kind', {
                        initialValue: shopData.cate1 || undefined,
                        rules: [{required: true, message: FORMVALIDATOR.major_business}]
                    })(
                        <Select placeholder="请选择主营类目">
                            {
                                cate && cate.map(item => (
                                    <Option
                                        value={item.id1}
                                        key={item.id1}
                                    >
                                        {item.cate_name}
                                    </Option>
                                ))
                            }
                        </Select>,
                    )}
                </Form.Item>
                <Form.Item label="收款码折扣">
                    {getFieldDecorator('discount', {
                        initialValue: shopData.discount,
                        rules: [{required: true, validator: this.checkDiscount}]
                    })(
                        <GeisInput
                            type="float"
                            placeholder="折扣值最小为8.0"
                            maxLength={4}
                        />
                    )}
                    <span className="other" onClick={() => this.routeTo()}>什么是折扣？</span>
                </Form.Item>
                <Form.Item label="所在地区" className="city" hasFeedback wrapperCol={{span: 18}}>
                    <Form.Item wrapperCol={{span: 5}}>
                        {getFieldDecorator('province', {
                            initialValue: preName || undefined,
                            rules: [{required: true, message: FORMVALIDATOR.no_province}]
                        })(
                            <Select
                                placeholder="请选择省"
                                onSelect={(val) => this.soloveCode(val)}
                            >
                                {
                                    province && province.map(item => (
                                        <Option
                                            value={item.code}
                                            key={item.name}
                                        >
                                            {item.name}
                                        </Option>
                                    ))
                                }
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item wrapperCol={{span: 5}}>
                        {getFieldDecorator('city', {
                            initialValue: cityName || undefined,
                            rules: [{required: true, message: FORMVALIDATOR.no_city}]
                        })(
                            <Select
                                placeholder="请选择市"
                                disabled={!this.state.code}
                                onSelect={(val) => this.soloveCountyCode(val)}
                            >
                                {
                                    city && city.map(item => (
                                        <Option
                                            value={item.code}
                                            key={item.name}
                                        >
                                            {item.name}
                                        </Option>
                                    ))
                                }
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item wrapperCol={{span: 5}}>
                        {getFieldDecorator('county', {
                            initialValue: countryName || undefined,
                            rules: [{required: true, message: FORMVALIDATOR.no_county}]
                        })(
                            <Select
                                placeholder="请选择县"
                                disabled={!this.state.Ccode}
                            >
                                {
                                    county && county.map(item => (
                                        <Option
                                            value={item.code}
                                            key={item.name}
                                        >
                                            {item.name}
                                        </Option>
                                    ))
                                }
                            </Select>
                        )}
                    </Form.Item>
                </Form.Item>
                <Form.Item label="店铺具体地址" className="show-detail-of-address">
                    {getFieldDecorator('address', {
                        initialValue: shopData.address,
                        rules: [
                            {required: true, message: FORMVALIDATOR.detail_address_null},
                            {min: 5, message: '请输入正确的店铺地址！'}
                        ]
                    })(
                        <TextArea
                            maxLength={100}
                            placeholder="请输入店铺详细地址"
                        />
                    )}
                    {
                        (type && type === '1') && (
                            <Form.Item wrapperCol={{span: 20}} className="sure">
                                该地址是否支持自提：
                                {
                                    getFieldDecorator('sure', {
                                        initialValue: (shopData && shopData.pick_up_self) || undefined,
                                        rules: [{required: true, message: '请选择是否支持自提！'}]
                                    })(
                                        <Radio.Group onChange={this.onChange}>
                                            <Radio value={1}>是</Radio>
                                            <Radio value={0}>否</Radio>
                                        </Radio.Group>
                                    )
                                }
                            </Form.Item>
                        )
                    }
                </Form.Item>
                {
                    (type && type === '1') && (
                        <Form.Item label="营业时间" hasFeedback wrapperCol={{span: 15}} className="open-time">
                            <Form.Item wrapperCol={{span: 5}}>
                                {getFieldDecorator('openTime', {
                                    initialValue: (shopData.open_time && shopData.open_time.split(':')[0]) || '',
                                    rules: [{required: true, message: FORMVALIDATOR.no_province}]
                                })(
                                    <Select
                                        placeholder="开"
                                    >
                                        {
                                            hour && hour.map(item => (
                                                <Option
                                                    value={item}
                                                    key={item}
                                                >
                                                    {item}
                                                </Option>
                                            ))
                                        }
                                    </Select>
                                )}
                            </Form.Item>
                            <span className="times">时</span>
                            <Form.Item wrapperCol={{span: 3}}>
                                {getFieldDecorator('openMin', {
                                    initialValue: (shopData.open_time && shopData.open_time.split(':')[1]) || '',
                                    rules: [{required: true, message: FORMVALIDATOR.no_city}]
                                })(
                                    <Select
                                        placeholder="店"
                                    >
                                        {
                                            min && min.map(item => (
                                                <Option
                                                    value={item}
                                                    key={item}
                                                >
                                                    {item}
                                                </Option>
                                            ))
                                        }
                                    </Select>
                                )}
                            </Form.Item>
                            <span className="times">分</span>
                            <span className="times">——</span>
                            <Form.Item wrapperCol={{span: 3}}>
                                {getFieldDecorator('closeTime', {
                                    initialValue: (shopData.close_time && shopData.close_time.split(':')[0]) || '',
                                    rules: [{required: true, message: FORMVALIDATOR.no_county}]
                                })(
                                    <Select
                                        placeholder="时"
                                    >
                                        {
                                            hour && hour.map(item => (
                                                <Option
                                                    value={item}
                                                    key={item}
                                                >
                                                    {item}
                                                </Option>
                                            ))
                                        }
                                    </Select>
                                )}
                            </Form.Item>
                            <span className="times">时</span>
                            <Form.Item wrapperCol={{span: 3}}>
                                {getFieldDecorator('closeMin', {
                                    initialValue: (shopData.close_time && shopData.close_time.split(':')[1]) || '',
                                    rules: [{required: true, message: FORMVALIDATOR.no_county}]
                                })(
                                    <Select
                                        placeholder="间"
                                    >
                                        {
                                            min && min.map(item => (
                                                <Option
                                                    value={item}
                                                    key={item}
                                                >
                                                    {item}
                                                </Option>
                                            ))
                                        }
                                    </Select>
                                )}
                            </Form.Item>
                            <span className="times">分</span>
                        </Form.Item>
                    )
                }
                <Form.Item label="客服电话">
                    {getFieldDecorator('service', {
                        initialValue: shopData.csh_phone,
                        rules: [
                            {required: true, message: FORMVALIDATOR.customer_service_phone_null},
                            {pattern: /^[0-9]*$/, message: FORMVALIDATOR.open_shop_phone_error},
                            {min: 4, message: '请输入4-12位客服电话!'}
                        ]
                    })(
                        <GeisInput
                            type="numAndBar"
                            placeholder="请输入客服电话"
                            maxLength={12}
                        />
                    )}
                </Form.Item>
                <Form.Item label="开店人">
                    {getFieldDecorator('boss', {
                        initialValue: shopData.linkName,
                        rules: [
                            {required: true, message: FORMVALIDATOR.principal_name_null},
                            {pattern: /^[\u4E00-\u9FA5]{2,8}$/, message: FORMVALIDATOR.shopkeeper_err}
                        ]
                    })(
                        <Input
                            placeholder="请输入开店人姓名"
                            maxLength={8}
                        />
                    )}
                </Form.Item>
                <Form.Item label="开店人手机号">
                    {getFieldDecorator('phone', {
                        initialValue: shopData.phone,
                        rules: [
                            {required: true, message: FORMVALIDATOR.principal_phone_null},
                            {validator: this.props.checkPhone}
                        ]
                    })(
                        <GeisInput
                            type="num"
                            placeholder="请输入开店人手机号"
                            maxLength={11}
                        />
                    )}
                </Form.Item>
            </Form>
        );
    }
}
export default Form.create()(ShopInfo);
