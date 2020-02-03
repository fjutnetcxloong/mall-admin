import {Form, Col, Row, Input, DatePicker} from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';
import './TopSearch.less';

const FormItem = Form.Item;
const {RangePicker} = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const formLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 18}
};
const {validator} = Utils;
const {MESSAGE: {FORMVALIDATOR}} = Constants;

class TopSearch extends BaseComponent {
    static propTypes = {
        orderList: PropTypes.func
    };

    //组件API默认值
    static defaultProps = {
        orderList() {} //订单数据
    };

    state = {
        timeSt: '', //开始时间
        timeEd: '', //结束时间
        types: 0, //判断搜索框在个模块中 0、 网店发货 1、到店自提 2、客户评价
        orderSta: '0', //订单状态
        orderStar: '0', //评价星级
        preparation: false //判断是否收起筛选
    }

    componentDidMount() {
        //types 判断搜索框在个模块中 0、 订单管理-网店发货 1、订单管理-到店自提 2、订单管理-客户评价
        const {types} = this.props;
        if (types) {
            this.setState({
                types
            });
        }
    }

    //收起筛选、不收起筛选
    preparation = () => {
        this.setState(prevState => ({
            preparation: !prevState.preparation
        }));
    }

    //选择筛选日期
    onChangeDate = (res, date) => {
        console.log(date);
        this.setState({
            timeSt: date[0],
            timeEd: date[1]
        });
    }

    //清空筛选条件
    emptyTerm = () => {
        this.props.form.resetFields();
        this.setState({
            timeSt: '',
            timeEd: '',
            orderSta: '0',
            orderStar: '0'
        });
    };

    //验证uid
    checkUid=(rule, value, callback) => {
        if (value && !validator.UID(value)) {
            validator.showMessage(FORMVALIDATOR.uid_min_error, callback);
            return;
        }
        callback();
    }

    //点击筛选
    sumbitTerm = () => {
        const {timeSt, timeEd} = this.state;
        const {form} = this.props;
        form.validateFields({first: true, force: true}, (err, value) => {
            //value.goodsName  商品名称
            // value.orderNumber 订单编号
            // value.date 时间
            // value.buyerName 买家昵称uid
            // value.statusr 买家评价状态
            // orderStar 买家评价星级
            this.setState({
                orderSta: value.statusr,
                orderStar: value.orderStar
            });
            if (!err) {
                const data = value;
                data.datest = timeSt;
                data.dateed = timeEd;
                data.status = -1; //点击搜索状态改为全部
                data.count = -1;  //点击搜索总条数清零
                data.page = 1; //点击搜索总页数清零
                this.props.orderList(data);
            }
        });
    }

    render() {
        //preparation 判断是否收起筛选 types 判断搜索框在哪个模块中
        const {preparation, timeSt, timeEd} = this.state;
        const {getFieldDecorator} = this.props.form;
        return (
            <div className="top-screen">
                <div className="navigation" onClick={this.preparation}>
                    <div className="navigation-left">筛选查询</div>
                    <div className="navigation-right">
                        <span className="navigation-text">{preparation ? '展开筛选' : '收起筛选'}</span>
                        <div className={`arrowhead ${preparation ? 'arrowhead-up' : ''}`}/>
                    </div>
                </div>
                <div className={`navigation-bottom ${preparation ? 'navigation-up' : ''}`}>
                    <Row>
                        <Form {...formLayout} onSubmit={this.handleSubmit} className="login-form">
                            <Col span={8} className="left-search">
                                <div>
                                    <Form.Item label="商品名称：">
                                        {getFieldDecorator('goodsName', {})(
                                            <Input
                                                className="basis-input"
                                                placeholder="请输入"
                                            />,
                                        )}
                                    </Form.Item>
                                </div>
                            </Col>
                            <Col span={8} className="left-search">
                                <div>
                                    <Form.Item label="买家UID：">
                                        {getFieldDecorator('buyerName', {
                                            rules: [
                                                {validator: this.checkUid}
                                            ]
                                        })(
                                            <Input
                                                className="basis-input"
                                                placeholder="请输入"
                                            />,
                                        )}
                                    </Form.Item>
                                </div>
                            </Col>
                            <Col span={8} className="left-search">
                                <div>
                                    <Form.Item label=" 订单编号：">
                                        {getFieldDecorator('orderNumber', {
                                            rules: [
                                                {message: '订单编号为纯数字', pattern: /^\d+$/}
                                            ]
                                        })(
                                            <Input
                                                className="basis-input"
                                                placeholder="请输入"
                                            />,
                                        )}
                                    </Form.Item>
                                </div>
                            </Col>
                            {/* {types !== 1 && (
                                <Col span={8} className="left-search">
                                    <FormItem label="评价状态：">
                                        {getFieldDecorator('statusr', {
                                            initialValue: orderSta
                                        })(
                                            (types === 2 ? (
                                                <Select>
                                                    <Option value="0">全部</Option>
                                                    <Option value="1">好评</Option>
                                                    <Option value="2">中评</Option>
                                                    <Option value="3">差评</Option>
                                                </Select>
                                            ) : (
                                                <Select>
                                                    <Option value="0">全部</Option>
                                                    <Option value="1">已评价</Option>
                                                    <Option value="2">未评价</Option>
                                                </Select>
                                            ))
                                        )}
                                    </FormItem>
                                </Col>
                            )} */}
                            {/* {types === 2 && (
                                <Col span={8} className="left-search">
                                    <FormItem label="评价星级：">
                                        {getFieldDecorator('orderStar', {
                                            initialValue: orderStar
                                        })(
                                            <Select>
                                                <Option value="0">请选择</Option>
                                                <Option value="1">一星</Option>
                                                <Option value="2">二星</Option>
                                                <Option value="3">三星</Option>
                                                <Option value="4">四星</Option>
                                                <Option value="5">五星</Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                            )} */}
                            <Col span={8} className="left-search">
                                <FormItem {...formLayout} label="交易时间：">
                                    {getFieldDecorator('time_st', {
                                        initialValue: timeSt ? [moment(timeSt, dateFormat), moment(timeEd, dateFormat)] : ''
                                    })(
                                        <RangePicker onChange={this.onChangeDate}/>
                                    )}
                                </FormItem>
                            </Col>
                        </Form>
                    </Row>
                    <div className="navigation-bottom-btn">
                        <div className="empty-term" onClick={this.emptyTerm}>清空筛选条件</div>
                        <div className="of-sth-btn of-sth-btn-wrap" onClick={this.sumbitTerm}>筛选</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Form.create()(TopSearch);
