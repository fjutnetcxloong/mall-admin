/*
* 商店概况页面
* */
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import {Row, Col, Skeleton} from 'antd';
import CardComponents from './components/CardComponents';
import CardNotice from './components/CardNotice';
// import CardTbd from './components/CardTbd';
import EchartsComponent from './components/EchartsComponent';
import './Profile.less';

const {api} = Configs;
const {getTime} = Utils;
const {getShopInfo} = Utils;

class Profile extends BaseComponent {
    state = {
        skeleton: true, //内容骨架
        homePageList: {}, //首页数据
        echartsData: {}, //图表数据
        xLine: [], //图表横轴
        numIndeed: [], //订单数
        moneyIndeed: [], //营业额
        browsersIndeed: [], //浏览量
        timeData: '', //表项时间
        tableDatas: [], //表格统计数据
        tType: '1', //图表时间段
        isforbidden: false //营业状态按钮是否禁用
    }

    componentDidMount() {
        const shopInfo = getShopInfo(); //判断是否通过审核,通过后才调接口
        if (shopInfo && shopInfo.data.status === 6) {
            this.getAllDatas();
            this.getData();
        } else {
            this.setState({
                isforbidden: true,
                skeleton: false
            });
        }
    }

    //获取店铺订单，营业额等数据
    getAllDatas = () => {
        this.fetch(api.homePageData).subscribe(res => {
            if (res && res.status === 0) {
                this.setState({
                    homePageList: res.data
                });
            }
        });
    }

    //获取图表数据入口
    getData = () => {
        const nextStep = () => {
            //关闭骨架屏
            this.setState({
                skeleton: false
            });
        };
        Observable.forkJoin(
            this.getEchartDataURL('1'), //获取Echart数据
            this.getTabelDataURL() //获取表格数据
        ).subscribe(
            (ary) => {
                ary.forEach((res, index) => {
                    if (res && res.status === 0) {
                        this.dataHandle(index, res);
                    }
                });
                nextStep();
            }, (err) => {
                console.log('forkJoin错误', err);
                nextStep();
            }
        );
    }

    // 请求数据处理函数
    dataHandle = (index, res) => {
        switch (index) {
        case 0:
            //处理商品分类数据
            this.setEchartData(res);
            break;
        case 1:
            //保存运费模板数据
            this.setTableDatas(res);
            break;
        default:
            break;
        }
    }

    //获取折线图数据
    getEchartDataURL = (types) => {
        const xLineArr = getTime(25, '点');
        const arr = new Map([
            ['1', '今日'],
            ['2', '昨日'],
            ['3', '最近七日'],
            ['4', '最近30日']
        ]);
        this.setState({
            timeData: arr.get(types)
        });
        if (types === '1' || types === '2') {
            this.setState({
                xLine: xLineArr
            });
        }
        return this.fetch(api.homePageEcharts, {data: {types}}); //获取实时数据
    }

    //保存echart折线图数据
    setEchartData = (res) => {
        const numArr = []; //订单量
        const moneyArr = []; //营业额
        const browsersArr = []; //浏览量
        const xLineArrs = []; //横坐标
        const datapull = res.data;
        if (datapull.length > 0) {
            datapull.forEach(item => {
                numArr.push(item.num);
                moneyArr.push(item.money);
                browsersArr.push(item.browser);
                if (item.date) {
                    xLineArrs.push(item.date);
                    this.setState({
                        xLine: xLineArrs
                    });
                }
            });
            this.setState({
                numIndeed: numArr,
                moneyIndeed: moneyArr,
                browsersIndeed: browsersArr
            });
        }
    }

    //请求折线图数据
    getEchartData = (types) => {
        const {isforbidden} = this.state;
        if (!isforbidden) {
            this.getEchartDataURL(types).subscribe((res) => {
                if (res && res.status === 0) {
                    this.setEchartData(res);
                }
            });
        }
    }

    //表格统计数据
    getTabelDataURL = () => this.fetch(api.homePageDataCount)

    //设置表格数据
    setTableDatas = (res) => {
        this.setState({
            tableDatas: res.data
        });
    }

    render() {
        const {homePageList, isforbidden, skeleton, tableDatas, xLine,
            moneyIndeed, browsersIndeed, numIndeed} = this.state;
        return (
            <div className="page">
                <Skeleton active loading={skeleton}>
                    <Row className="home">
                        {/*导航栏*/}
                        <Col className="home-content">
                            <Row>
                                <Col span={15}>
                                    <CardComponents
                                        getAllDatas={this.getAllDatas}
                                        isforbidden={isforbidden}
                                        homePageList={homePageList}
                                    />
                                </Col>
                                <Col span={9}>
                                    <CardNotice/>
                                </Col>
                            </Row>
                            {/* <Skeleton active loading={skeleton}>
                            <CardTbd isforbidden={isforbidden} homePageList={homePageList}/>
                        </Skeleton> */}
                            <Row>
                                <Col span={24}>
                                    <EchartsComponent
                                        tableDatas={tableDatas}
                                        getEchartData={this.getEchartData}
                                        xLine={xLine}
                                        xValue={xLine[0]}
                                        moneyIndeed={moneyIndeed}
                                        browsersIndeed={browsersIndeed}
                                        numIndeed={numIndeed}
                                    />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Skeleton>
            </div>

        );
    }
}
export default Profile;
