import ReactEcharts from 'echarts-for-react';
import {Card, Table, Tabs} from 'antd';

const {TabPane} = Tabs;
// const {getTime} = Utils;
// const {api} = Configs;
//表格数据
const columns = [
    {
        title: '',
        dataIndex: 'time'
    },
    {
        title: '订单量（笔）',
        className: 'column-money',
        dataIndex: 'orders'
    },
    {
        title: '访问量（次）',
        dataIndex: 'browsers'
    },
    {
        title: '营业额（元）',
        dataIndex: 'money'
    }
];

export default class EchartsComponent extends BaseComponent {
  state = {
      echartsShow: true,
      actived: true
  }

  //图表切换
  echartToTable = (echartShow) => {
      this.setState({
          echartsShow: echartShow,
          actived: echartShow
      });
  }

  //echarts数据配置项
  getOption = () => {
      const {xLine, xValue, numIndeed, browsersIndeed, moneyIndeed} = this.props;
      return (
          {
              toolbox: {show: true},
              tooltip: {trigger: 'axis', confine: 'true'},
              legend: {data: ['订单量', '访问量', '营业额'], left: 'right'},
              xAxis: {type: 'category', data: xLine, boundaryGap: false, axisPointer: {show: 'true', snap: true, value: xValue}},
              yAxis: [{
                  // data: this.state.yLine
                  show: false,
                  boundaryGap: [0, '50%'],
                  axisLine: {
                      lineStyle: {
                          color: '#0B438B'
                      }
                  },
                  type: 'value',
                  name: '订单量',
                  position: 'left',
                  offset: 50,
                  // splitNumber: 1,
                  min: 0,
                  // max: 300,
                  axisLabel: {
                      formatter: '{value}',
                      textStyle: {
                          color: '#0B438B'
                      }
                  },
                  splitLine: {
                      show: false
                  }
              },
              {
                  boundaryGap: [0, '50%'],
                  show: false,
                  axisLine: {
                      lineStyle: {
                          color: '#0B438B'
                      }
                  },
                  splitLine: {
                      show: false
                  },
                  type: 'value',
                  name: '访问量',
                  // position: 'left',
                  //            min:0,
                  //            max:100,
                  // splitNumber: 2,
                  axisLabel: {
                      formatter: '{value}'
                  }
              },
              {
                  boundaryGap: [0, '50%'],
                  axisLine: {
                      lineStyle: {
                          color: '#0B438B'
                      }
                  },
                  splitLine: {
                      show: false
                  },
                  type: 'value',
                  name: '营业额',
                  position: 'left',
                  //            min:0,
                  //            max:600,
                  axisTick: {
                      inside: 'false'
                      // length: 10
                  }
              }],
              series: [
                  {
                      name: '订单量', type: 'line', data: numIndeed, symbol: 'line', yAxisIndex: 0, color: '#FFE366'
                  },
                  {
                      name: '访问量', type: 'line', data: browsersIndeed, symbol: 'line', yAxisIndex: 1, color: '#ABB9EE'
                  },
                  {
                      name: '营业额', type: 'line', data: moneyIndeed, symbol: 'line', yAxisIndex: 2, color: '#CFEAA7'
                  }
              ]
          }
      );
  }

  render() {
      const {tableDatas, getEchartData} = this.props;
      let data;
      if (tableDatas.length > 0) {
          data = [
              {
                  key: '1',
                  time: '今日',
                  orders: tableDatas[0].num,
                  browsers: tableDatas[0].browser,
                  money: tableDatas[0].money
              },
              {
                  key: '2',
                  time: '昨日',
                  orders: tableDatas[1].num,
                  browsers: tableDatas[1].browser,
                  money: tableDatas[1].money
              },
              {
                  key: '3',
                  time: '最近七日',
                  orders: tableDatas[2].num,
                  browsers: tableDatas[2].browser,
                  money: tableDatas[2].money
              },
              {
                  key: '4',
                  time: '最近30日',
                  orders: tableDatas[3].num,
                  browsers: tableDatas[3].num,
                  money: tableDatas[3].num
              }
          ];
      }
      return (
          <div className="card-eight-container">
              <Card
                  title="店铺概况"
                  extra={(
                      <div className="card-eight-header">
                          <div style={{display: this.state.echartsShow ? 'block' : 'none'}}>
                              <Tabs
                                  onTabClick={(value) => getEchartData(value)}
                              >
                                  <TabPane tab="今日" key="1"/>
                                  <TabPane tab="昨日" key="2"/>
                                  <TabPane tab="最近7日" key="3"/>
                                  <TabPane tab="最近30天" key="4"/>
                              </Tabs>
                          </div>
                          <div className="turn-table" style={{marginLeft: 24}}>
                              <div className={`icon ${this.state.actived ? 'icon-actived' : ''}`} onClick={() => this.echartToTable(true)}/>
                              <div className={`icon ${this.state.actived ? '' : 'icon-actived'}`} onClick={() => this.echartToTable(false)}/>
                          </div>
                      </div>
                  )}
                  bordered={false}
                  className="shop-imfor"
              >
                  {
                      this.state.echartsShow ? (
                          <div className="my-card card-eig">
                              <ReactEcharts
                                  option={this.getOption()}
                                  style={{width: '100%', height: '300px'}}
                                  className="react_for_echarts"
                              />
                          </div>
                      ) : (
                          <React.Fragment>
                              {/* <div style={{height: '70px', lineHeight: '70px'}}>店铺概况</div> */}
                              <div className="my-card table-card">
                                  <Table
                                      columns={columns}
                                      dataSource={data}
                                      bordered
                                      pagination={false}
                                  />
                              </div>
                          </React.Fragment>
                      )
                  }
              </Card>
          </div>
      );
  }
}