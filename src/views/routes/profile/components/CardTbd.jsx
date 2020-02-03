import {Card, Button, Col, Row, Radio} from 'antd';
import {Link} from 'react-router-dom';
import {Fragment} from 'react';

// const {api} = Configs;
// const {TabPane} = Tabs;

class CardTbd extends BaseComponent {
  state = {
      tbdShow: 'true', //待处理事务切换
      mode: 'true' //决定线上线下
  }

  //待处理事务切换
  tbdTask = (e) => {
      const mode = e.target.value;
      this.setState({
          tbdShow: mode,
          mode
      });
  }

  //待处理订单组件
    CardFiv = () => {
        const {mode, tbdShow} = this.state;
        const {homePageList} = this.props;
        const onLineTasks = {
            orders: '/order/online-delivery?status=',
            goods: '/commodity/list?newType='
        };
        const offLineTasks = {
            orders: '/order/offline-pickup?status=',
            goods: '/commodity/list?newType='
        };
        //线上
        const titArr1 = [
            {
                title: '待付款订单',
                param: 0,
                taskNum: homePageList.away_pay_count
            },
            {
                title: '待发货订单',
                param: 1,
                taskNum: homePageList.away_deliver_count
            },
            {
                title: '待处理售后订单',
                param: 5,
                taskNum: homePageList.away_service_count
            },
            {
                title: '买家提醒发货订单',
                param: 1,
                taskNum: homePageList.remind_deliver_count
            },
            {
                title: '待确认退货订单',
                param: 5,
                taskNum: homePageList.away_return_receve_count
            },
            {
                title: '待补货的商品',
                param: '2',
                taskNum: homePageList.replenish_pr
            }
        ];
        //线下
        const titArr2 = [
            {
                title: '待付款订单',
                param: 0,
                taskNum: homePageList.white_pay_count
            },
            {
                title: '待补货的商品',
                param: '2',
                taskNum: homePageList.white_replenish_pr
            },
            {
                title: '待核销订单',
                param: 1,
                taskNum: homePageList.white_count
            },
            {
                title: '待处理售后订单',
                param: 5,
                taskNum: homePageList.white_service_count
            }
        ];
        return (
            <div>
                <Card
                    title="待处理事务"
                    bordered={false}
                    className="tbd-tasks"
                    extra={(
                        <Radio.Group className="mgb8" value={mode} onChange={(e) => this.tbdTask(e)}>
                            <Radio.Button value="true">物流发货</Radio.Button>
                            <Radio.Button value="false">到店自提/消费</Radio.Button>
                        </Radio.Group>
                    )}
                >
                    {
                        tbdShow === 'true' ? (
                            <div className="my-card card-fiv">
                                <div className="ul-container">
                                    {
                                        titArr1.map((item, index) => (
                                            <div key={item.title + item.index}>
                                                <li className="card-item-li">
                                                    <div>
                                                        <Button type="link">
                                                            <Link
                                                                to={
                                                                    item.title === '待补货的商品' ? onLineTasks.goods + item.param : onLineTasks.orders + item.param
                                                                }
                                                                style={{color: '#666666'}}
                                                            >{item.title}
                                                            </Link>
                                                        </Button>
                                                        <span>
                                                            <span className="order-number">{item.taskNum === undefined ? 0 : item.taskNum[index]}</span>
                                                        </span>
                                                    </div>
                                                </li>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        ) : (
                            <div className="my-card card-fiv">
                                <div className="ul-container">
                                    {
                                        titArr2.map((item, index) => (
                                            <div key={item.title + item.index}>
                                                <li className="card-item-li">
                                                    <div key={item.title}>
                                                        <Button type="link">
                                                            <Link
                                                                to={
                                                                    item.title === '待补货的商品' ? offLineTasks.goods + item.param : offLineTasks.orders + item.param
                                                                }
                                                                style={{color: '#666666'}}
                                                            >{item.title}
                                                            </Link>
                                                        </Button>
                                                        <span>
                                                            <span className="order-number">{item.taskNum === undefined ? 0 : item.taskNum}</span>
                                                        </span>
                                                    </div>
                                                </li>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        )
                    }
                </Card>
            </div>
        );
    }

    //商品总览组件
    CardSix = () => {
        const {homePageList} = this.props;
        const obj = [
            {num: homePageList.shoper_pr_down_num, tit: '已下架'},
            {num: homePageList.shoper_pr_line_num, tit: '已上架'},
            {num: homePageList.shoper_pr_zero_num, tit: '库存紧张'},
            {num: homePageList.shoper_all_pr_num, tit: '全部商品'}
        ];

        return (
            <div>
                <Card title="商品总览" className="lists-all" bordered={false}>
                    <div className="my-card card-six">
                        {
                            obj.map(item => (
                                <div key={item.tit}>
                                    <p>{item.num === undefined ? 0 : item.num}</p>
                                    <p>{item.tit}</p>
                                </div>
                            ))
                        }
                    </div>
                </Card>
            </div>
        );
    }

    render() {
        return (
            <Fragment>
                <Row>
                    <Col span={15}>
                        {this.CardFiv()}
                    </Col>
                    <Col span={9}>
                        {this.CardSix()}
                    </Col>
                </Row>
            </Fragment>
        );
    }
}

export default CardTbd;
