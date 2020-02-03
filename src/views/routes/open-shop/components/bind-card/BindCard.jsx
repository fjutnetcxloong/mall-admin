import {Button, Col, Form, Row, Select, Input} from 'antd';
import GeisInput from '../../../../common/form/input/GeisInput';
import './BindCard.less';

const formItemLayout = {
    labelCol: {span: 4},
    wrapperCol: {span: 10}
};
const {Option} = Select;
const {api} = Configs;
const {MESSAGE: {FORMVALIDATOR}} = Constants;
const {showInfo, validator} = Utils;
class BindCard extends BaseComponent {
    state={
        province: [],
        city: [],
        county: [],
        code: '', //城市code
        Ccode: '',
        countryId: '',
        bankName: '', //银行名
        bankList: [], //银行列表
        bankBranchList: [], //支行列表
        branchCode: '', //支行code
        bankId: '', //银行id
        provinceName: '',
        cityName: '',
        countryName: '',
        cardNum: '',
        branchsName: ''
    }

    componentDidMount = () => {
        this.getBank();
        this.getPcat();
        const {bankInfo} = this.props;
        this.setState({
            Ccode: bankInfo.city_id,
            countryId: bankInfo.county_id,
            code: bankInfo.province_id,
            provinceName: bankInfo.area && bankInfo.area[0],
            cityName: bankInfo.area && bankInfo.area[1],
            countryName: bankInfo.area && bankInfo.area[2],
            cardNum: bankInfo && bankInfo.bankNo,
            branchsName: bankInfo && bankInfo.branches,
            bankName: bankInfo.bankArea
        }, () => {
            this.getCity();
            this.getCounty();
        });
    };

    //获取省市县
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

    //保存省code
    soloveCode = (val) => {
        const {code} = this.state;
        const {resetFields} = this.props.form;
        this.setState({
            cityName: '',
            countryName: '',
            branchsName: '',
            Ccode: '',
            countryId: ''
        });
        if (val !== code) {
            resetFields(['branch', 'city', 'county']);
        }
        this.setState({
            code: val
        }, () => {
            this.getCity();
        });
    }

    //保存市code 获取县城
    soloveCountyCode = (val) => {
        const {Ccode} = this.state;
        const {resetFields} = this.props.form;
        this.setState({
            branchsName: '',
            countryName: '',
            countryId: ''
        });
        if (val !== Ccode) {
            resetFields(['county', 'branch']);
        }
        this.setState({
            Ccode: val
        }, () => {
            this.getCounty();
        });
    }

    //获取县城
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

    //获取银行列表
    getBank = () => {
        this.fetch(api.getBank).subscribe(res => {
            if (res && res.status === 0) {
                this.setState({
                    bankList: res.data
                });
            }
        });
    };

    //保存选中银行名称
    solovedBank = (val) => {
        const {bankList} = this.state;
        const {resetFields} = this.props.form;
        this.setState({
            provinceName: '',
            cityName: '',
            countryId: '',
            countryName: '',
            cardNum: '',
            branchsName: '',
            Ccode: '',
            code: '',
            city: [],
            county: []
        });
        resetFields(['city', 'county', 'branch', 'province', 'cardNumber']);

        const result = bankList.find(item => item.name === val);
        this.setState({
            bankName: val,
            bankId: result.id
        });
    }

    //获取支行列表
    getBankBranch = () => {
        const {bankName, countryId, Ccode} = this.state;
        this.setState({
            bankBranchList: []
        });
        let code;
        if (countryId) {
            code = countryId;
        } else {
            code = Ccode;
        }
        if (code && bankName) {
            this.fetch(api.getBankBranch, {
                data: {
                    cityId: code,
                    key: bankName
                }}).subscribe(res => {
                if (res && res.status === 0) {
                    this.setState({
                        bankBranchList: res.data
                    });
                } else {
                    this.setState({
                        bankBranchList: []
                    });
                }
            });
        } else {
            showInfo('请选择银行卡归属地和银行名称');
        }
    }

    //储存支行信息
    solovedBankBranch = (val) => {
        const {bankBranchList} = this.state;
        const result = bankBranchList.find(item => item.bankBranchName === val);
        this.setState({
            branchCode: result.code
        });
    }

    //返回上一页
    goBack = () => {
        this.props.parent.setState({
            status: 'info'
        }, () => {
            this.props.getShopInfo();
        });
    }

    //重置支行
    resetBranch = (val) => {
        this.setState({
            branchsName: '',
            countryId: val
        });
        const {resetFields} = this.props.form;
        resetFields(['branch']);
    }

    //提交信息
    submit = () => {
        const {validateFieldsAndScroll} = this.props.form;
        const {branchCode, bankId, province, city, county} = this.state;
        const {bankInfo} = this.props;

        validateFieldsAndScroll({first: true, force: true}, (err, val) => {
            if (!err) {
                // console.log(val.province, val.city, val.county);
                if (validator.checkCN(val.province)) {
                    val.province = province.find(item => item.name === val.province).code;
                }
                if (validator.checkCN(val.city)) {
                    val.city = city.find(item => item.name === val.city).code;
                }
                if (validator.checkCN(val.county)) {
                    val.county = county.find(item => item.name === val.county).code;
                }
                this.fetch(api.checkBank, {
                    data: {
                        bank_name: val.bank,
                        real_name: val.username,
                        bank_number: val.cardNumber,
                        phone: val.setPhone,
                        branches_code: branchCode || bankInfo.branches_code,
                        bank_id: bankId || bankInfo.bankId,
                        branches: val.branch,
                        pcat: [val.province, val.city, val.county],
                        accType: 0,
                        userType: 2,
                        id: bankInfo.id || ''
                    }}).subscribe(res => {
                    if (res && res.status === 0) {
                        this.props.parent.setState({
                            status: 'success',
                            stepStatus: 2
                        });
                        this.finish();
                    }
                });
            }
        });
    }

    //通知审核
    finish = () => {
        this.fetch(api.shopFinish).subscribe(res => {
            showInfo(FORMVALIDATOR.operator_success);
        });
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {province, city, county, bankList, bankBranchList, branchsName, cardNum, provinceName, cityName, countryName} = this.state;
        const {bankInfo} = this.props;
        return (
            <Row className="form-content bind-card">
                <Row className="card-title">
                    <Col span={6}>
                        <div className="title-card">绑定银行卡</div>
                    </Col>
                    <Col span={18} style={{textAlign: 'left'}}>
                        <div className="explain">请填写与开店人信息一致的所属人银行卡信息</div>
                    </Col>
                </Row>
                <Row>
                    <Col span={6}/>
                    <Col span={18}>
                        <Form onSubmit={this.handleSubmit} className="login-form" {...formItemLayout} hideRequiredMark>
                            <Form.Item label="卡主姓名">
                                {getFieldDecorator('username', {
                                    initialValue: (bankInfo && bankInfo.realname) || undefined,
                                    rules: [
                                        {required: true, message: FORMVALIDATOR.card_owner_null},
                                        {pattern: /^[\u4E00-\u9FA5]{2,8}$/, message: FORMVALIDATOR.username_err}
                                    ]
                                })(
                                    <Input
                                        placeholder="请输入开户人姓名"
                                        maxLength={8}
                                    />
                                )}
                            </Form.Item>
                            <Form.Item hasFeedback label="开户银行">
                                {getFieldDecorator('bank', {
                                    initialValue: (bankInfo && bankInfo.bankArea) || undefined,
                                    rules: [{required: true, message: FORMVALIDATOR.bank_null}]
                                })(
                                    <Select
                                        placeholder="请选择开户银行"
                                        onSelect={val => this.solovedBank(val)}
                                    >
                                        {
                                            bankList && bankList.map(item => (
                                                <Option
                                                    value={item.name}
                                                    key={item.id}
                                                >{item.name}
                                                </Option>

                                            ))
                                        }
                                    </Select>,
                                )}
                            </Form.Item>
                            <Form.Item label="银行卡号">
                                {getFieldDecorator('cardNumber', {
                                    initialValue: cardNum || undefined,
                                    rules: [
                                        {required: true, message: FORMVALIDATOR.no_card},
                                        {pattern: /^\d{15,20}$/, message: FORMVALIDATOR.card_err}
                                    ]
                                })(
                                    <Input
                                        maxLength={20}
                                        placeholder="请输入银行卡号"
                                    />
                                )}
                            </Form.Item>
                            <Form.Item label="开户地区" className="city" wrapperCol={{span: 20}}>
                                <Form.Item wrapperCol={{span: 5}}>
                                    {getFieldDecorator('province', {
                                        initialValue: provinceName || undefined,
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
                                            onSelect={(val) => this.resetBranch(val)}
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
                            <Form.Item hasFeedback label="所属支行">
                                {getFieldDecorator('branch', {
                                    initialValue: branchsName || undefined,
                                    rules: [{required: true, message: FORMVALIDATOR.bank_account_branch_null}]
                                })(
                                    <Select
                                        placeholder="请选择开户支行"
                                        onFocus={this.getBankBranch}
                                        onChange={val => this.solovedBankBranch(val)}
                                    >
                                        {
                                            bankBranchList && bankBranchList.map(item => (
                                                <Option
                                                    value={item.bankBranchName}
                                                    key={item.code}
                                                >
                                                    {item.bankBranchName}
                                                </Option>
                                            ))
                                        }
                                    </Select>,
                                )}
                            </Form.Item>
                            <Form.Item label="银行预留手机号">
                                {getFieldDecorator('setPhone', {
                                    initialValue: (bankInfo && bankInfo.phone) || undefined,
                                    rules: [
                                        {required: true, message: FORMVALIDATOR.bank_reserved_phone_null},
                                        {validator: this.props.checkPhone}
                                    ]
                                })(
                                    <GeisInput
                                        type="num"
                                        placeholder="请输入银行预留手机号"
                                        maxLength={11}
                                    />
                                )}
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
                <Row className="btn-box2">
                    <Button type="primary" onClick={this.goBack}>上一步</Button>
                    <Button type="primary" onClick={this.submit}>下一步</Button>
                </Row>
            </Row>
        );
    }
}

export default Form.create()(BindCard);
