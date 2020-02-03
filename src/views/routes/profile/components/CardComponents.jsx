import {Fragment} from 'react';
import {Row, Col, Card, Button, Switch, Spin} from 'antd';
import {Link} from 'react-router-dom';
import Prompt from '../../../common/order-prompt/OrderPrompt';

const {api} = Configs;
class CardComponents extends BaseComponent {
  state = {
      orderPopup: false, //状态 订单核销弹出框
      runStatus: '休息中', //营业状态文字
      loading: false,
      checked: true //营业状态
  };

  //弹窗 核销弹窗
  verification = () => {
      const {isforbidden} = this.props;
      if (!isforbidden) {
          this.setState({
              orderPopup: true
          });
      }
  }

  //关闭核销窗口
  ClosePopups = () => {
      this.setState({
          orderPopup: false
      }, () => this.props.getAllDatas());
  }

  //顶部概况组件
  CardFir = (...numArr) => {
      let obj = [];
      if (numArr) {
          obj = [
              {
                  num: numArr[0],
                  tit: '今日订单量',
                  unit: '笔'
              },
              {
                  num: numArr[1],
                  tit: '今日销售总额',
                  unit: '元'
              },
              {
                  num: numArr[2],
                  tit: '收藏店铺',
                  unit: '人'
              },
              {
                  num: numArr[3],
                  tit: '收藏商品',
                  unit: '人'
              }
          ];
      }
      return (
          <div>
              <Card title="概况" bordered={false}>
                  <div className="my-card card-fir">
                      {
                          obj.map((item) => (
                              <div key={item.tit}>
                                  <div className="icon card-first-item-icon iconfont"/>
                                  <p className="card-fir-num">{item.num || 0}<span>{item.unit}</span></p>
                                  <p className="card-fir-tit">{item.tit}</p>
                              </div>
                          ))
                      }
                  </div>
              </Card>
          </div>
      );
  }

  //切换营业状态
  switchStatus = () => {
      const {homePageList, getAllDatas} = this.props;
      this.setState({
          loading: true
      });
      const typeStatus = homePageList.shoper_open_status === '1' ? '0' : '1'; //获取营业状态
      this.fetch(api.homePageStatus, {data: {type: typeStatus}
      }).subscribe(res => {
          if (res && res.status === 0) {
              getAllDatas();
              this.setState({
                  loading: false
              });
          }
      });
  }

  //营业状态组件
  CardSec = () => {
      const {isforbidden, homePageList} = this.props;
      const checked = homePageList.shoper_open_status === '1';
      const {loading} = this.state;
      return (
          <Spin spinning={loading}>
              <div>
                  <Card title="营业状态" style={checked ? {color: '#00aeff'} : {color: '#bfbfbf'}} bordered={false}>
                      <div className="my-card card-sec">
                          <p>{checked ? '营业中' : '休息中'}</p>
                          <div>
                              <Switch onChange={this.switchStatus} checked={checked} disabled={isforbidden}/>
                          </div>
                      </div>
                  </Card>
              </div>
          </Spin>
      );
  }

  //快捷窗组件
  CardThi = () => {
      const {homePageList} = this.props;
      return (
          <div>
              <Card title="快捷窗" bordered={false} className="fast-third">
                  <div className="my-card card-thi">
                      <div className="card-thi-contain-fir">
                          <p className="card-thi-num">{homePageList.white_count || 0}</p>
                          <p className="card-thi-tit">
                              <Link to="/order/offline-pickup?status=1">待核销</Link>
                          </p>
                          <Button type="primary" onClick={this.verification}>快捷核销</Button>
                      </div>
                      <div className="card-thi-contain-second">
                          <Link to="/commodity/list?newType=1">
                              <div className="icon card-thi-icon-new-list"/>
                              <p className="card-thi-tit">
                                新建商品
                              </p>
                          </Link>
                      </div>
                  </div>
              </Card>
          </div>
      );
  }

  render() {
      const {homePageList} = this.props;
      return (
          <Fragment>
              <Row>
                  <Col>
                      {this.CardFir(homePageList.today_order, homePageList.today_money, homePageList.collection_num, homePageList.collect_pr_num)}
                  </Col>
              </Row>
              <Row type="flex" justify="space-between" align="bottom">
                  <Col span={10}>
                      {this.CardSec()}
                  </Col>
                  <Col span={14}>
                      {this.CardThi()}
                  </Col>
              </Row>
              {/*订单弹出核销*/}
              {this.state.orderPopup && (
                  <Prompt close={this.ClosePopups}/>
              )}
          </Fragment>
      );
  }
}

export default CardComponents;