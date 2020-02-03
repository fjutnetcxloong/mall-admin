import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {connect} from 'react-redux';
import {Form, Spin, Card, Radio, Checkbox, Select, Button, DatePicker} from 'antd';
import moment from 'moment';
import {baseActionCreator} from '../../../../../redux/baseAction';
import HandleModal from '../../../../common/handle-modal/HandleModal';
import GeisInput from '../../../../common/form/input/GeisInput';
import './First.less';

const FormItem = Form.Item;
const {Option} = Select;
const {RangePicker} = DatePicker;
const {MESSAGE: {NewGoods}, WEB_NAME} = Constants;
class First extends React.PureComponent {
    static propTypes = {
        form: PropTypes.object.isRequired,
        isAdd: PropTypes.bool.isRequired, //true新建商品 false编辑商品
        rowData: PropTypes.object.isRequired, //编辑商品详情
        shopType: PropTypes.string.isRequired, //店铺类型
        criterion: ImmutablePropTypes.map.isRequired, //商品规范
        tempOption: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.bool
        ]), //模板选项,有选中模板为object，无选中模板为bool
        getCriterion: PropTypes.func.isRequired,
        reTemplate: PropTypes.func.isRequired, //刷新模板回调
        isRe: PropTypes.bool.isRequired //是否能点击刷新模板
    };

    static defaultProps = {
        tempOption: false
    }

    constructor(props) {
        super(props);
        const {isAdd, rowData} = this.props;
        const bothState = {
            type: rowData.type || '1', //商品类型 1实物商品 2蛋糕烘焙 4电子卡券
            checkedEx: rowData.express_type || '', //选中运费设置
            checkedVt: rowData.effective_type || '', //选中有效时间类型
            visible: false, //是否显示对话框
            normType: '' //规范类型
        };
        if (!isAdd) {
            //编辑:商品类型不能修改
            this.state = {
                ...bothState,
                checkedOneType: rowData.type === '1' && rowData.delivery_type.split(','), //实物商品配送方式
                checkedTwoType: rowData.type === '2' && rowData.delivery_type.split(',') //蛋糕烘焙配送方式
            };
        } else {
            //新建
            this.state = {
                ...bothState,
                checkedOneType: (rowData.type && rowData.type === '1' && rowData.delivery_type)
                    ? rowData.delivery_type.split(',') : ['1'],
                checkedTwoType: (rowData.type && rowData.type === '2' && rowData.delivery_type)
                    ? rowData.delivery_type.split(',') : ['2']
            };
        }
    }

    //选择商品类型
    onSelectType=(e) => {
        this.setState({
            type: e.target.value
        });
    }

    //查看商品规范
    showNorm=(type) => {
        const {getCriterion, criterion} = this.props;
        if (!criterion.has('pr_content')) {
            getCriterion({type});
        } else if (!criterion.has('card_content')) {
            getCriterion({type});
        }
        this.setState({
            visible: true,
            normType: type
        });
    }

    //关闭商品规范对话框
    close=() => {
        this.setState({
            visible: false,
            normType: ''
        });
    }

    //选择配送方式
    onCheckedType=(index) => {
        const {type} = this.state;
        if (type === '1') {
            this.setState({
                checkedOneType: index
            });
        } else if (type === '2') {
            this.setState({
                checkedTwoType: index
            });
        }
    }

    //改变运费设置
    setExpress = (e) => {
        const {form: {validateFields}} = this.props;
        this.setState({
            checkedEx: e.target.value
        }, () => {
            //强制校验，可用于关闭已触发的错误提示
            validateFields(['expressMoney'], {force: true});
        });
    };

    //刷新运费模板回调
    reTemplate=() => {
        const {reTemplate} = this.props;
        reTemplate();
    }

    //渲染天数选项
    setDay = () => {
        const children = [];
        for (let i = 30; i >= 1; i--) {
            children.push(<Option key={`${i}`}>{i}</Option>);
        }
        return children;
    };

    //渲染小时选项
    setHour = () => {
        const children = [];
        for (let i = 0; i <= 23; i++) {
            //后端会把个位数处理成两位数
            if (i < 10) {
                children.push(<Option key={`0${i}`}>{i}</Option>);
            } else {
                children.push(<Option key={`${i}`}>{i}</Option>);
            }
        }
        return children;
    };

    //渲染分钟选项
    setMinute=() => {
        const children = [];
        for (let i = 0; i <= 59; i++) {
            if (i < 10) {
                children.push(<Option key={`0${i}`}>{i}</Option>);
            } else {
                children.push(<Option key={`${i}`}>{i}</Option>);
            }
        }
        return children;
    }

    //设置有效时间
    setValidTime=(e) => {
        const {form: {validateFields}} = this.props;
        this.setState({
            checkedVt: e.target.value
        }, () => {
            validateFields(['days', 'custom'], {force: true});
        });
    }

    render() {
        const {form: {getFieldDecorator}, isAdd, rowData, tempOption, shopType, criterion, isRe} = this.props;
        const {type, visible, normType, checkedOneType, checkedTwoType, checkedEx, checkedVt} = this.state;
        console.log('checkedOneType', checkedOneType, checkedTwoType);
        const disabledDate = (current) => current && current < moment().startOf('day');
        const footer = (
            <Button
                type="primary"
                onClick={this.close}
            >
                知道了
            </Button>
        );
        return (
            <Form id="First" className="essential-logistics">
                <Card title="基本信息/物流">
                    <div className="abide edge">你需遵守
                        <Button type="link" onClick={() => this.showNorm('1')}>{`《${WEB_NAME}商城禁售商品管理规范》`}</Button>
                        {type === '4' && <Button type="link" onClick={() => this.showNorm('2')}>{`《${WEB_NAME}电子卡券商品管理规范》`}</Button>}
                    </div>
                    {type === '4' && <div className="edge">电子卡券无需物流</div>}
                    <Form.Item className="consume edge">
                        {getFieldDecorator('type', {
                            initialValue: type
                        })(
                            <Radio.Group onChange={this.onSelectType} disabled={!isAdd}>
                                <Radio.Button value="1">实物商品(物流发货)</Radio.Button>
                                {
                                    shopType !== '2' && (
                                        <React.Fragment>
                                            <Radio.Button value="2">蛋糕烘焙(到店自提)</Radio.Button>
                                            <Radio.Button value="4">电子卡券(到店消费)</Radio.Button>
                                        </React.Fragment>
                                    )
                                }
                                <span className="attention">注意：商品类型发布后不能修改</span>
                            </Radio.Group>
                        )}
                    </Form.Item>
                    {type === '1' && (
                        <FormItem className="allot-way" label="配送方式">
                            {getFieldDecorator(`deliveryType${type}`, {
                                initialValue: checkedOneType,
                                rules: [{required: true, message: NewGoods.delivery_way_null}]
                            })(
                                <Checkbox.Group onChange={this.onCheckedType}>
                                    <Checkbox value="1" disabled>快递发货</Checkbox>
                                    {
                                        shopType !== '2' && (
                                            <React.Fragment>
                                                <Checkbox value="2">到店自提</Checkbox>
                                                <Checkbox value="4">同城配送(该功能将陆续开放，勾选即代表您同意功能开放后，该商品支持同城配送)</Checkbox>
                                            </React.Fragment>
                                        )
                                    }
                                </Checkbox.Group>
                            )}
                        </FormItem>
                    )}
                    {type === '2' && (
                        <FormItem label="配送方式">
                            {getFieldDecorator(`deliveryType${type}`, {
                                initialValue: checkedTwoType,
                                rules: [{required: true, message: NewGoods.delivery_way_null}]
                            })(
                                <Checkbox.Group onChange={this.onCheckedType}>
                                    <Checkbox value="2" disabled >到店自提</Checkbox>
                                    <Checkbox value="4">同城配送(该功能将陆续开放，勾选即代表您同意功能开放后，该商品支持同城配送)</Checkbox>
                                </Checkbox.Group>
                            )}
                        </FormItem>
                    )}
                    {type === '4' && (
                        <FormItem label="配送方式">
                            {getFieldDecorator(`deliveryType${type}`, {
                                initialValue: ['3'],
                                rules: [{required: true, message: NewGoods.delivery_way_null}]
                            })(
                                <Checkbox.Group>
                                    <Checkbox value="3" disabled>到店消费</Checkbox>
                                </Checkbox.Group>
                            )}
                        </FormItem>
                    )}
                    {type === '1' && (
                        <FormItem className="freight" label="运费设置">
                            {getFieldDecorator('expressSet', {
                                initialValue: checkedEx,
                                rules: [{required: true, message: NewGoods.freight_setting_null}]
                            })(
                                <Radio.Group onChange={this.setExpress}>
                                    <Radio value="1">
                                        <FormItem
                                            label="统一邮费"
                                            extra="输入0代表包邮"
                                        >
                                            {getFieldDecorator('expressMoney', {
                                                rules: [{required: (checkedEx === '1'), message: NewGoods.no_postage}]
                                            })(
                                                <GeisInput
                                                    {...(checkedEx === '1' && rowData.express_money) && {defaultInput: rowData.express_money}}
                                                    type="amount"
                                                    isRMB
                                                    isFix
                                                />
                                            )}
                                        </FormItem>
                                    </Radio>
                                    <Radio value="2" disabled={!tempOption}>
                                        <FormItem
                                            label="运费模板"
                                            extra={(
                                                <div>
                                                    <Button type="link" disabled={isRe} onClick={this.reTemplate}>
                                                        {isRe ? '正在刷新' : '刷新'}
                                                    </Button>
                                                    <Button type="link" onClick={() => window.open('#/dispath/distribution?status=1')}>新建</Button>
                                                </div>
                                            )}
                                        >
                                            <span className="ant-form-text">
                                                {tempOption ? (rowData.template_name || tempOption.template_name) : '请先新建模板并选中'}
                                            </span>
                                        </FormItem>
                                    </Radio>
                                </Radio.Group>
                            )}
                        </FormItem>
                    )}
                    {type === '2' || (type === '1' && checkedOneType.indexOf('2') !== -1) ? (
                        <div style={{marginBottom: '24px'}}>
                            <FormItem className="readiness-time">
                                <FormItem label="备货时间">
                                    {getFieldDecorator('makeTime', {
                                        valuePropName: 'checked',
                                        initialValue: true,
                                        rules: [{required: true, message: NewGoods.no_stokeUpTime}]
                                    })(
                                        <Checkbox disabled>
                                                需要预留备货时间
                                        </Checkbox>
                                    )}
                                </FormItem>
                                {/* 实物商品需要默认备货时间为0 */}
                                {type === '1' ? (
                                    <div className="time">
                                        <FormItem>
                                            {getFieldDecorator(`hour${type}`, {
                                                ...rowData.standby_time ? {initialValue: rowData.standby_time.split(',')[0]} : {initialValue: '00'},
                                                rules: [{required: true, message: NewGoods.no_hour}]
                                            })(
                                                <Select>
                                                    {this.setHour()}
                                                </Select>
                                            )}
                                        </FormItem>
                                        <span>时</span>
                                        <FormItem>
                                            {getFieldDecorator(`minute${type}`, {
                                                ...rowData.standby_time ? {initialValue: rowData.standby_time.split(',')[1]} : {initialValue: '00'},
                                                rules: [{required: true, message: NewGoods.no_minute}]
                                            })(
                                                <Select>
                                                    {this.setMinute()}
                                                </Select>
                                            )}
                                        </FormItem>
                                        <span>分</span>
                                    </div>
                                ) : type === '2' && (
                                    <div className="time">
                                        <FormItem>
                                            {getFieldDecorator(`hour${type}`, {
                                                ...rowData.standby_time && {initialValue: rowData.standby_time.split(',')[0]},
                                                rules: [{required: true, message: NewGoods.no_hour}]
                                            })(
                                                <Select>
                                                    {this.setHour()}
                                                </Select>
                                            )}
                                        </FormItem>
                                        <span>时</span>
                                        <FormItem>
                                            {getFieldDecorator(`minute${type}`, {
                                                ...rowData.standby_time && {initialValue: rowData.standby_time.split(',')[1]},
                                                rules: [{required: true, message: NewGoods.no_minute}]
                                            })(
                                                <Select>
                                                    {this.setMinute()}
                                                </Select>
                                            )}
                                        </FormItem>
                                        <span>分</span>
                                    </div>
                                )}
                            </FormItem>
                            <div className="explain">买家在选择自提时间时，也会预留备货时间。备货时间设置为0时，代表该商品不需要备货时间。</div>
                        </div>
                    ) : null}
                    {type === '4' && (
                        <FormItem className="valid-time" label="有效时间">
                            {getFieldDecorator('validType', {
                                initialValue: checkedVt,
                                rules: [{required: true, message: NewGoods.no_validTime}]
                            })(
                                <Radio.Group onChange={this.setValidTime}>
                                    <Radio value="1">
                                            长期有效
                                    </Radio>
                                    <Radio value="2">
                                        <div>
                                            <span>自购买日起</span>
                                            <FormItem>
                                                {getFieldDecorator('days', {
                                                    ...rowData.effective_day && checkedVt === '2' && {initialValue: rowData.effective_day},
                                                    rules: [{required: (checkedVt === '2'), message: NewGoods.no_day}]
                                                })(
                                                    <Select>
                                                        {this.setDay()}
                                                    </Select>
                                                )}
                                            </FormItem>
                                            <span>天内有效</span>
                                        </div>
                                    </Radio>
                                    <Radio value="3">
                                        <FormItem label="自定义周期" colon={false}>
                                            {getFieldDecorator('custom', {
                                                ...(rowData.effective_time_start && rowData.effective_time_end && checkedVt === '3') && {
                                                    initialValue: [
                                                        moment(rowData.effective_time_start, 'YYYY-MM-DD HH:mm'),
                                                        moment(rowData.effective_time_end, 'YYYY-MM-DD HH:mm')
                                                    ]
                                                },
                                                rules: [{type: 'array', required: (checkedVt === '3'), message: NewGoods.no_cycle}]
                                            })(
                                                <RangePicker
                                                    showTime={{format: 'HH:mm'}}
                                                    format="YYYY-MM-DD HH:mm"
                                                    disabledDate={disabledDate}
                                                    placeholder={['开始时间', '结束时间']}
                                                />
                                            )}
                                        </FormItem>
                                    </Radio>
                                </Radio.Group>
                            )}
                        </FormItem>
                    )}
                    {type === '4' && (
                        <FormItem label="使用时间">
                            {getFieldDecorator('holiday', {
                                ...rowData.if_holiday ? {initialValue: rowData.if_holiday} : {initialValue: '0'},
                                rules: [{required: true}]
                            })(
                                <Radio.Group>
                                    <Radio value="0">节假日通用<span>（节假日包含周六、周日）</span></Radio>
                                    <Radio value="1">节假日不可用</Radio>
                                </Radio.Group>,
                            )}
                        </FormItem>
                    )}
                    <FormItem label="是否开具纸质发票">
                        {getFieldDecorator('invoice', {
                            ...rowData.if_invoice ? {initialValue: rowData.if_invoice} : {initialValue: '0'},
                            rules: [{required: true}]
                        })(
                            <Radio.Group>
                                <Radio value="0">否</Radio>
                                <Radio value="1">是</Radio>
                            </Radio.Group>,
                        )}
                    </FormItem>
                    {
                        visible && (
                            <HandleModal
                                visible={visible}
                                isStyle
                                onCancel={this.close}
                                title={normType === '1' ? '中卖网商城禁售商品管理规范' : '中卖网电子卡券商品管理规范'}
                                footer={footer}
                                content={(
                                    <div className="content-composing">
                                        {normType === '1'
                                            ? criterion.get('pr_content') || <Spin/>
                                            : criterion.get('card_content') || <Spin/>}
                                    </div>
                                )}

                            />
                        )
                    }
                </Card>
            </Form>
        );
    }
}

const mapStateToProps = (state) => {
    const commodity = state.get('commodity');
    const base = state.get('base');
    return {
        shopType: commodity.get('shopType'),
        criterion: base.get('criterion')
    };
};

const mapDispatchToProps = {
    getCriterion: baseActionCreator.getCriterion
};

export default connect(mapStateToProps, mapDispatchToProps)(First);
