import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import {Col, Spin, Radio, Button, Input, Form, Skeleton} from 'antd';
import {connect} from 'react-redux';
import {AreaPrompt} from '../../../../common/area-prompt';
import {BottomButton} from '../../../../common/bottom-button';
import {disAtionCreator} from '../../action/index';

const {MESSAGE: {WRITEOFF}} = Constants;
const {showInfo} = Utils;
const {api} = Configs;
class NewTemplate extends BaseComponent {
    constructor(props) {
        super(props);
        this.temp = {
            fTitle: '首件', // 展开表格的可变表头，首件或首重
            fDataIndex: 'fPart',  // 首件或首重的dataIndex
            cTitle: '续件', // 展开表格的可变表头,续件或续重
            cDataIndex: 'cPart', // 续件或续重的dataIndex
            postageTitle: '满额包邮', //包邮条件，满额包邮或满件包邮
            cancelDisable: false,
            choiceTemplateId: '' //选择模板的id
        };
        this.state = {
            skeleton: true, //内容骨架
            editId: '',  //保存编辑的id
            saveFlag: '', //标记是保存，新建，还是修改
            updateIndex: '',  //修改模板的下标
            editingKey: '',
            count: 2,
            visible: true,
            popup: false,
            unit: '元',
            charging: '件（个）',
            chargeUnit: '个',
            method: 1,  //type: 整型(1按件数 2按重量
            situation: 0, //if_mail: 包邮条件的下标
            name: '', //template_name:模板名称
            bValue: '',
            // tempArr: [],   //新建模板列表
            editTempArr: [],  //编辑的模板
            allProvince: [],  //区域选择
            loopArr: [],  //用于新建模板循环的列表
            selectedFlag: '',
            templateNames: [],
            area: '', //区域选择
            expandSwitch: false,
            loading: false,
            errPage: false
        };
    }

    componentDidMount() {
        console.log('子组件---新建商品页面');
        const {editId} = this.props;
        this.getData(editId);
    }

    //編輯运费模板
    setEdit = (res) => {
        let charging = '件（个）';
        let chargeUnit = '个';
        if (Number(res.data.type) === 2) {
            charging = '重（kg）';
            chargeUnit = 'kg';
        }
        res.data.areaAndMail.forEach(item => {
            item.mail.fPart = item.mail.fPart || item.mail.fKg || '';
            item.mail.cPart = item.mail.cPart || item.mail.sKg || '';
            item.mail.postage = item.mail.postage || '';
        });
        this.setState({
            method: Number(res.data.type),
            situation: Number(res.data.if_mail),
            name: res.data.template_name,
            editTempArr: res.data.areaAndMail,
            editId: res.data.id,
            charging,
            chargeUnit
        });
    };

    getEditURL = (id) => this.fetch(api.findMailTemplate, {
        data: {
            id
        }});

    //编辑运费模板骨架屏
    getData=(id) => {
        const {changeRoute, handleState} = this.props;
        const nextStep = () => {
            //关闭骨架屏
            this.setState({
                skeleton: false
            });
        };
        if (handleState === 'edit') {
            Observable.forkJoin(
                this.getEditURL(id),
                this.getAllProvinceURL()
            ).subscribe(
                (ary) => {
                    console.log('forkJoin结果', ary);
                    ary.forEach((res, index) => {
                        if (res && res.status === 0) {
                            if (res.data && res.data.status === 1) {
                                changeRoute('two');
                            } else {
                                this.dataHandle(index, res);
                            }
                        }
                    });
                    nextStep();
                }, (err) => {
                    console.log('forkJoin错误', err);
                    nextStep();
                }
            );
        } else {
            Observable.forkJoin(
                this.getAllProvinceURL()
            ).subscribe(
                (ary) => {
                    if (ary[0] && ary[0].status === 0) {
                        if (ary[0].data && ary[0].data.status === 1) {
                            changeRoute('two');
                        } else {
                            this.setAllProvince(ary[0]);
                        }
                    }
                    nextStep();
                }, (err) => {
                    console.log('forkJoin错误', err);
                    nextStep();
                }
            );
        }
    };


    // 请求数据处理函数
    dataHandle = (index, res) => {
        switch (index) {
        case 0:
            //获取编辑的数据
            this.setEdit(res);
            break;
        case 1:
            //获取地区数据
            this.setAllProvince(res);
            break;
        default:
            break;
        }
    };

    //计费方式
    billingWay = e => {
        let charging = '件（个）';
        let chargeUnit = '个';
        if (e.target.value === 2) {
            charging = '重（kg）';
            chargeUnit = 'kg';
        }
        this.setState({
            method: e.target.value,
            charging,
            chargeUnit
        });
    };

    //包邮条件
    condition = e => {
        let unit = '(元)';
        if (e.target.value === 2) {
            unit = '(件)';
        }
        this.setState({
            situation: e.target.value,
            unit
        });
    };

    //改变编辑模板中的内容
    changeEditInput = (e, index, flag) => {
        const {editTempArr} = this.state;
        const ary = [...editTempArr];
        const reg = new Map([
            ['num',  /^\d+$/] //数字输入
        ]);
        if (!reg.get('num').test(e.target.value) && e.target.value !== '') {
            return;
        }
        ary[index].mail[flag] = e.target.value;
        this.setState({
            editTempArr: ary
        });
    };

    //删除模板列表
    deleteTemplate = (index) => {
        const {editTempArr} = this.state;
        const ary = [...editTempArr];
        ary.splice(index, 1);
        this.setState({
            editTempArr: ary
        });
    };

    //修改地址
    updateArea = (index) => {
        this.temp.cancelDisable = true;
        this.setState({
            saveFlag: 'updateEdit',
            updateIndex: index.toString()
        });
        this.showModal();
    };

    //编辑模板列表
    editTemplate = () => {
        const {situation, chargeUnit, editTempArr} = this.state;
        return editTempArr.map((item, index) => (
            <div className="content">
                <p className="first"><span>{item.area}</span></p>
                <p>
                    <div onClick={() => this.updateArea(index)} className="edit">修改</div>
                    <div onClick={() => this.deleteTemplate(index)} className="edit">删除</div>
                </p>
                <p>
                    <Input
                        placeholder="请输入"
                        onChange={(e) => this.changeEditInput(e, index, 'fPart')}
                        value={item.mail.fPart}
                        maxLength={5}
                    />
                    <span>{chargeUnit}</span>
                </p>
                <p>
                    <Input
                        placeholder="请输入"
                        onChange={(e) => this.changeEditInput(e, index, 'freight')}
                        value={item.mail.freight}
                        maxLength={5}
                    />
                    <span>元</span>
                </p>
                <p>
                    <Input
                        placeholder="请输入"
                        onChange={(e) => this.changeEditInput(e, index, 'cPart')}
                        value={item.mail.cPart}
                        maxLength={5}
                    />
                    <span>{chargeUnit}</span>
                </p>
                <p>
                    <Input
                        placeholder="请输入"
                        onChange={(e) => this.changeEditInput(e, index, 'reNew')}
                        value={item.mail.reNew}
                        maxLength={5}
                    />
                    <span>元</span>
                </p>
                <p>
                    {
                        situation === 0 ? (<span>无</span>) : (
                            <div>
                                <Input
                                    placeholder="请输入"
                                    onChange={(e) => this.changeEditInput(e, index, 'postage')}
                                    value={item.mail.postage}
                                    maxLength={5}
                                />
                                <span>{situation === 1 ? '元' : '件'}</span>
                            </div>
                        )
                    }
                </p>
            </div>
        ));
    };

    //获取地区
    getAllProvinceURL = () => this.fetch(api.getAllProvince);

    setAllProvince = (res) => {
        if (res.status === 0) {
            // 转换后端数据
            res.data.forEach(item => {
                item.data.forEach(value => {
                    value.label = value.name;
                    value.value = value.name;
                    delete value.name;
                });
            });
            this.setState({
                allProvince: res.data
            });
        }
    };

    //选择地区按钮开
    showModal = () => {
        this.setState({
            popup: true
        });
    };

    //新增区域
    addArea = () => {
        this.temp.cancelDisable = false;
        this.setState({
            saveFlag: 'edit'
        });
        this.showModal();
    };

    //选择地区按钮关
    closeModal = () => {
        this.setState({
            popup: false
        });
    };

    //获取地区
    areaChoice = (val) => {
        const {editTempArr, saveFlag, updateIndex} = this.state;
        if (saveFlag === 'edit' && editTempArr.length < 10) {
            console.log('1111111');
            editTempArr.push({
                area: val,
                mail: {
                    fPart: '',  //首件c
                    freight: '',  //运费
                    cPart: '',   //续件
                    reNew: '', //续费
                    postage: '' //包邮
                }
            });
            this.setState({
                editTempArr
            }, () => {
                console.log(this.state.editTempArr);
            });
        }
        if (saveFlag === 'updateEdit') {
            editTempArr[updateIndex].area = val;
            this.setState({
                editTempArr
            });
        }
        this.closeModal();
    };

    //取消保存模板
    cancelTemplate = () => {
        const {changeRoute} = this.props;
        this.setState({
            method: 1,
            situation: 0,
            name: '',
            editTempArr: [],
            tempArr: []
        });
        changeRoute();
    };

    //保存模板
    saveTemplate = () => {
        const {method, situation, editTempArr, editId} = this.state;
        const {handleState, changeRoute, getMailTemplate} = this.props;
        const ary = [];
        editTempArr.forEach(item => {
            const data =  JSON.parse(JSON.stringify(item));
            ary.push(data);
        });
        //新增接口
        let onOff = false;
        this.props.form.validateFields({first: true, force: true}, (err, values) => {
            if (!err) {
                const arr = [];
                if (ary.length === 0) {
                    onOff = true;
                    showInfo(WRITEOFF.no_freight);
                } else {
                    ary.map((item) => {
                        for (const key in item.mail) {
                            if (item.mail[key] === '') {
                                arr.push(item.mail[key]);
                            }
                        }
                    });
                }
                if (method === 2) {
                    ary.forEach(item => {
                        item.mail.fKg = item.mail.fPart;
                        item.mail.sKg = item.mail.cPart;
                        delete item.mail.fPart;
                        delete item.mail.cPart;
                    });
                }
                if (situation === 0) {
                    ary.forEach(item => {
                        delete item.mail.postage;
                        arr.pop();
                    });
                }
                if (arr.length !== 0) {
                    onOff = true;
                    showInfo(WRITEOFF.no_freight);
                }
                if (!onOff && handleState === 'create') {
                    console.log('新建模板');
                    this.setState({
                        loading: true
                    });
                    this.fetch(api.setMailTemplate, {
                        data: {
                            name: values.name,
                            type: method,
                            if_mail: situation,
                            areaAndMail: ary
                        }
                    }).subscribe(res => {
                        this.setState({
                            loading: false
                        });
                        if (res.status === 0) {
                            this.setState({
                                method: 1,
                                situation: 0,
                                name: '',
                                editTempArr: []
                            });
                            changeRoute();
                            getMailTemplate();
                        }
                    });
                }
                if (!onOff && handleState === 'edit') {
                    console.log('编辑模板');
                    this.setState({
                        loading: true
                    });
                    this.fetch(api.setMailTemplate, {method: 'post',
                        data: {
                            id: editId,
                            name: values.name,
                            type: method,
                            if_mail: situation,
                            areaAndMail: ary,
                            if_update: 1
                        }
                    }).subscribe(res => {
                        this.setState({
                            loading: false
                        });
                        if (res.status === 0) {
                            this.setState({
                                method: 1,
                                situation: 0,
                                editTempArr: [],
                                name: ''
                            });
                            changeRoute();
                            getMailTemplate();
                        }
                    });
                }
            } else {
                console.log(err, values);
                this.setState({
                    loading: false
                });
            }
        });
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        const {cancelDisable} = this.temp;
        const {unit, situation, charging, allProvince, name, popup, editTempArr, updateIndex, loading, skeleton} = this.state;
        return (
            <Col span={24} className="new-template page">
                <Skeleton active loading={skeleton}>
                    <Form onSubmit={this.saveTemplate} className="main-content">
                        <Spin spinning={loading}>
                            <div className="one-col">
                                <Form.Item label="模板名称" className="name">
                                    {getFieldDecorator('name', {
                                        initialValue: name,
                                        rules: [
                                            {required: true, message: WRITEOFF.no_template_name}
                                        ]
                                    })(
                                        <Input
                                            maxLength={10}
                                            allowClear
                                        />
                                    )}
                                </Form.Item>
                            </div>
                            <div className="radio">
                                <div className="mode">
                                    <span className="mode-left">计费方式：</span>
                                    <Radio.Group
                                        onChange={this.billingWay}
                                        value={this.state.method}
                                    >
                                        <Radio value={1}>按件数</Radio>
                                        {/*<Radio value={2}>按重量</Radio>*/}
                                    </Radio.Group>
                                </div>
                                <div className="mode">
                                    <span className="mode-left">包邮条件：</span>
                                    <Radio.Group
                                        onChange={this.condition}
                                        value={situation}
                                    >
                                        <Radio value={0}>无</Radio>
                                        <Radio value={1}>满额包邮</Radio>
                                        <Radio value={2}>满件包邮</Radio>
                                    </Radio.Group>
                                </div>
                            </div>
                            <div className="form">
                                <div className="form-head">
                                    <p className="first">可配送区域</p>
                                    <p>操作</p>
                                    <p>首{charging}</p>
                                    <p>运费（元）</p>
                                    <p>续{charging}</p>
                                    <p>续费（元）</p>
                                    <p>包邮
                                        {
                                            situation !== 0 && (
                                                <span>{unit}</span>
                                            )
                                        }
                                    </p>
                                </div>
                                {
                                    this.editTemplate()
                                }
                            </div>
                            <div className="assign">
                                <Button type="primary" onClick={this.addArea}>
                                    指定区域和运费
                                </Button>
                            </div>
                        </Spin>
                    </Form>
                    {
                        popup && (
                            <AreaPrompt
                                switching={this.closeModal}
                                allProvince={allProvince}
                                chose={this.areaChoice}
                                cancelDisable={cancelDisable}
                                editTempArr={editTempArr}
                                updateIndex={updateIndex}
                            />
                        )
                    }
                    <BottomButton
                        saveTemplate={this.saveTemplate}
                        cancelTemplate={this.cancelTemplate}
                    />
                </Skeleton>
            </Col>
        );
    }
}
const mapDispatchToProps = {
    getMailTemplate: disAtionCreator.getMailTemplate
};
const FormNewTemplate = Form.create()(NewTemplate);
export default connect(null, mapDispatchToProps)(FormNewTemplate);
