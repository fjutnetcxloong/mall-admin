// import {Fragment} from 'react';
import {Card, Tabs, Badge} from 'antd';

const {api} = Configs;
const {TabPane} = Tabs;
const {tengXunIm} = Utils;
class CardNotice extends BaseComponent {
    state = {
        userMsgList: [], //数据集合
        statusNum: '1'//初始tab的状态
    }

    componentDidMount() {
        this.getAllMsg();
    }

    getAllMsg = () => {
        this.fetch(api.userAllMsg).subscribe(res => {
            if (res && res.status === 0) {
                this.setState({
                    userMsgList: res.data
                });
            }
        });
    }

    //多选 暂时去掉
    // selectId = (checked, id, type) => {
    //     const {userMsgList} = this.state;
    //     const arr = userMsgList;
    //     switch (type) {
    //     case '1':
    //         arr.all_msg_data.forEach(item => {
    //             if (item.id === id) {
    //                 item.checked = checked.target.checked;
    //             }
    //         });
    //         break;
    //     case '2':
    //         arr.buyer_msg.forEach(item => {
    //             if (item.id === id) {
    //                 item.checked = checked.target.checked;
    //             }
    //         });
    //         break;
    //     case '3':
    //         arr.order_msg.forEach(item => {
    //             if (item.id === id) {
    //                 item.checked = checked.target.checked;
    //             }
    //         });
    //         break;
    //     case '4':
    //         arr.platform.forEach(item => {
    //             if (item.id === id) {
    //                 item.checked = checked.target.checked;
    //             }
    //         });
    //         break;
    //     default:
    //         console.log(arr);
    //     }
    //     this.setState({
    //         userMsgList: {...arr}
    //     });
    // }

    //切换tab
    changeList = (num) => {
        this.setState({
            statusNum: num
        });
        if (num === '1') { //当点击到全部消息的时候，可以进行一次接口请求
            this.getAllMsg();
        }
    }

    //统一im跳转方法
    openAllsIm =(item, type, clickNum) => { //msg_type  1平台  2订单  3买家 clickNum 1 点击全部 2点击用户 3点击订单 4点击平台
        this.fetch(api.myNoticeEdit, {data: {type: '1', ids: [item.id], msg_type: type === 3 ? '1' : 0}})
            .subscribe(res => {
                if (res && res.status === 0) {
                    const {userMsgList} = this.state;
                    const obj = userMsgList;
                    const objArr = new Map([ //属性对象集合
                        ['1', 'all_msg_data'],
                        ['2', 'buyer_msg'],
                        ['3', 'order_msg'],
                        ['4', 'platform']

                    ]);
                    obj[objArr.get(clickNum)].forEach(value => {
                        if (value.id === item.id) {
                            value.if_read = '1';
                        }
                    });
                    this.setState({
                        userMsgList: {...obj}
                    }, () => {
                        const arr = new Map([
                            [1, 3],
                            [2, 2],
                            [3, 1]
                        ]);
                        tengXunIm(arr.get(type), type === 3 ? item.no : '');
                    });
                }
            });
    }

    //底部按钮操作  暂时不搞
    // letDoIt = (type) => { //type 1已读 2置顶 3未读
    //     const {statusNum, userMsgList} = this.state;
    //     const arr = userMsgList;
    //     const SelecArr = [];
    //     switch (statusNum) {
    //     case '1':
    //         arr.all_msg_data.forEach(item => {
    //             if (item.checked) {
    //                 SelecArr.push(item.id);
    //             }
    //         });
    //         break;
    //     case '2':
    //         arr.buyer_msg.forEach(item => {
    //             if (item.checked) {
    //                 SelecArr.push(item.id);
    //             }
    //         });
    //         break;
    //     case '3':
    //         arr.order_msg.forEach(item => {
    //             if (item.checked) {
    //                 SelecArr.push(item.id);
    //             }
    //         });
    //         break;
    //     case '4':
    //         arr.platform.forEach(item => {
    //             if (item.checked) {
    //                 SelecArr.push(item.id);
    //             }
    //         });
    //         break;
    //     default:
    //         console.log(arr);
    //     }
    //     if (SelecArr.length > 0) {
    //         if (type === 1) { //设置为已读
    //             this.fetch(api.alreadyMsg);
    //         } else if (type === 2) { //置顶
    //             this.fetch(api.sendTopMsg, {data: {id: SelecArr}});
    //         } else if (type === 3) { //设置为未读
    //             this.fetch(api.noReadMsg);
    //         }
    //         //设置完之后刷新数据
    //         this.getAllMsg();
    //     } else {
    //         warningMsg('您还未选中任何数据');
    //     }
    // }

    render() {
        const {userMsgList, statusNum} = this.state;
        return (
            <div>
                <Card title="消息通知" bordered={false} className="news-card">
                    <div className="card-fou">
                        <Tabs activeKey={statusNum} onChange={(data) => this.changeList(data)}>
                            <TabPane tab="全部消息" key="1">
                                <div className="card-fou-content">
                                    {
                                        (userMsgList.all_msg_data && userMsgList.all_msg_data.length > 0) ? userMsgList.all_msg_data.map((item, index) => (
                                            <div key={item.id} className="checkbox-content">
                                                {/* <Checkbox onChange={(data) => this.selectId(data, item.id, '1')} checked={item.checked}>
                                                    <span onClick={() => this.openAllsIm(item.id, item.msg_type)}>{item.if_read === '0' && <Badge status="error"/>}{item.last_msg}</span>
                                                </Checkbox> */}
                                                <div onClick={() => this.openAllsIm(item, item.msg_type, '1')}>{item.if_read === '0' && <Badge status="error"/>}{item.last_msg}</div>
                                                <span>{item.crtdate && item.crtdate.slice(5, 10)}</span>
                                            </div>
                                        )) : ''
                                    }
                                </div>
                            </TabPane>
                            {/* <TabPane tab="用户消息" key="2">
                                <div className="card-fou-content">
                                    {userMsgList.buyer_msg && userMsgList.buyer_msg.map(item => (
                                        <div key={item.id} className="checkbox-content">
                                            <Checkbox onChange={(data) => this.selectId(data, item.id, '2')} checked={item.checked}>
                                                <span onClick={() => this.openAllsIm(item.id, 3)}>{item.if_read === '0' && <Badge status="error"/>}{item.last_msg}</span>
                                            </Checkbox>

                                            <div onClick={() => this.openAllsIm(item, 3, '2')}>{item.if_read === '0' && <Badge status="error"/>}{item.last_msg}</div>
                                            <span>{item.crtdate && item.crtdate.slice(5, 10)}</span>
                                        </div>
                                    ))}
                                </div>
                            </TabPane> */}
                            <TabPane tab="订单消息" key="3">
                                <div className="card-fou-content">
                                    {(userMsgList.order_msg && userMsgList.order_msg.length > 0) ?  userMsgList.order_msg.map(item => (
                                        <div key={item.id} className="checkbox-content">
                                            {/* <Checkbox onChange={(data) => this.selectId(data, item.id, '3')} checked={item.checked}>
                                                <div onClick={() => this.openAllsIm(null, 2)}>{item.if_read === '0' && <Badge status="error"/>}{item.last_msg}</div>
                                            </Checkbox> */}
                                            <div onClick={() => this.openAllsIm(item, 2, '3')}>{item.if_read === '0' && <Badge status="error"/>}{item.last_msg}</div>
                                            <span>{item.crtdate && item.crtdate.slice(5, 10)}</span>
                                        </div>
                                    )) : ''}
                                </div>
                            </TabPane>
                            <TabPane tab="平台消息" key="4">
                                <div className="card-fou-content">
                                    {(userMsgList.platform && userMsgList.platform.length > 0) ? userMsgList.platform.map(item => (
                                        <div key={item.id} className="checkbox-content">
                                            {/* <Checkbox onChange={(data) => this.selectId(data, item.id, '4')} checked={item.checked}>
                                                <span onClick={() => this.openAllsIm(null, 1)}>{item.if_read === '0' && <Badge status="error"/>}{item.title}</span>
                                            </Checkbox> */}

                                            <div onClick={() => this.openAllsIm(item, 1, '4')}>{item.if_read === '0' && <Badge status="error"/>}{item.title}</div>
                                            <span>{item.crtdate && item.crtdate.slice(5, 10)}</span>
                                        </div>
                                    )) : ''}
                                </div>
                            </TabPane>
                        </Tabs>
                        {/* <div className="my-card card-fou"> //暂时去掉
                            <div className="card-fou-foot">
                                <Button type="link" onClick={this.letDoIt}>已读</Button>
                                <Button type="link" onClick={this.letDoIt}>置顶</Button>
                                <Button type="link" onClick={this.letDoIt}>标为未读</Button>
                            </div>
                        </div> */}
                    </div>
                </Card>
            </div>
        );
    }
}

export default CardNotice;
