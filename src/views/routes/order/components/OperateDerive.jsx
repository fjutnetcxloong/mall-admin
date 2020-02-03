import PropTypes from 'prop-types';
import {Select} from 'antd';
import './OperateDerive.less';

const {api} = Configs;
const {Option} = Select;
const {downloadExcel, warningMsg} = Utils;

class OperateDerive extends BaseComponent {
    static propTypes = {
        orderList: PropTypes.array,
        checkedList: PropTypes.array,
        ifExpress: PropTypes.number
    };

    //组件API默认值
    static defaultProps = {
        orderList: [], //订单数据
        checkedList: [], //checkbox选中数组
        ifExpress: 0 //全部导出 线上 1 线下 2
    };

    state = {
        derivationId: 0 //导出id判断 1导出全部  2导出选定
    };

    //导出Eelct
    getDerivation = () => {
        //derivationId 1 导出所有 2导出选中
        const {derivationId} = this.state;
        const {orderList, checkedList, ifExpress} = this.props;
        if (derivationId === '2') { //部分导出
            const arr = [];
            if (checkedList.length > 0) {
                for (let i = 0; i < checkedList.length; i++) {
                    const shop = [];
                    const title = ['订单编号', '客户UID', '实收金额（元）', ifExpress === 1 ? '收货信息' : '买家信息'];
                    arr.push(title);
                    shop.push(orderList[checkedList[i]].order_no, orderList[checkedList[i]].no, orderList[checkedList[i]].all_price, orderList[checkedList[i]].area + orderList[checkedList[i]].address);
                    arr.push(shop);
                    const titleGoods = ['商品名称', '商品规格', '商品单价（元）', '商品数量'];
                    arr.push(titleGoods);
                    for (let j = 0; j < orderList[checkedList[i]].pr_list.length; j++) {
                        const goods = [];
                        goods.push(orderList[checkedList[i]].pr_list[j].pr_title, orderList[checkedList[i]].pr_list[j].values_name, orderList[checkedList[i]].pr_list[j].price, orderList[checkedList[i]].pr_list[j].num);
                        arr.push(goods);
                    }
                }
                this.fetch(api.batchExport, {method: 'post', data: {list: arr}})
                    .subscribe(res => {
                        if (res) {
                            if (res.status === 0) {
                                const name = ifExpress === 1 ? 'onlineorder_filtered' : 'offlineorder_filtered';
                                downloadExcel(res.data, name);
                            }
                        }
                    });
            } else {
                warningMsg('您还未选择任何数据');
            }
        } else if (derivationId === '1') { //导出全部
            this.fetch(api.exportOutputExcelAll, {method: 'post', data: {type: 3, if_express: ifExpress}}) //if_express 1 线上 2 线下
                .subscribe(res => {
                    if (res) {
                        if (res.status === 0) {
                            const name = ifExpress === 1 ? 'onlineorder_all' : 'offlineorder_all';
                            downloadExcel(res.data, name);
                        }
                    }
                });
        } else {
            warningMsg('请选择导出方式');
        }
    }

    //批量操作选择器
    tabsCallback = (value) => {
        this.setState({
            derivationId: value
        });
    }

    render() {
        return (
            <div className="set-wrap">
                <div className="of-sth-btn" onClick={this.getDerivation}>确认</div>
                <div className="select">
                    <Select defaultValue="批量操作" onChange={this.tabsCallback}>
                        <Option value="1">导出所有订单</Option>
                        <Option value="2">导出所选订单</Option>
                    </Select>
                </div>
            </div>
        );
    }
}

export default OperateDerive;
