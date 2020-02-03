import PropTypes from 'prop-types';
import './ShopEstimate.less';

const listName = [
    '好评',
    '中评',
    '差评',
    '合计'
];
const {api} = Configs;

class TopSearch extends BaseComponent {
    static propTypes = {
        orderList: PropTypes.func
    };

    //组件API默认值
    static defaultProps = {
        orderList() {} //订单数据
    };

    state = {
        preparation: false, //判断是否收起筛选
        census: [] //店铺统计列表参数
    }

    componentDidMount() {
        this.statistics();
    }

    //店铺评价统计
    statistics = () => {
        this.fetch(api.pingjiaNum, {method: 'POST'}).subscribe(res => {
            if (res) {
                if (res.status === 0) {
                    this.setState({
                        census: res.data
                    });
                }
            }
        });
    }

    //收起筛选、不收起筛选
    preparation = () => {
        this.setState(prevState => ({
            preparation: !prevState.preparation
        }));
    }

    render() {
        //preparation 判断是否收起筛选 types 判断搜索框在哪个模块中
        const {preparation, census} = this.state;
        return (
            <div className="top-screenr">
                <div className="navigation" onClick={this.preparation}>
                    <div className="navigation-left">店铺评价统计</div>
                    <div className="navigation-right">
                        <span className="navigation-text">{preparation ? '收起' : '展开'}</span>
                        <div className={`arrowhead ${preparation ? 'arrowhead-up' : ''}`}/>
                    </div>
                </div>
                <div className={`navigation-bottoms ${preparation ? 'navigation-ups' : ''}`}>
                    <div className="tabs-list">
                        <div className="float-colour"/>
                        <div className="list-wrap">
                            <div className="list">
                                <div className="list-nth list-nth-top">
                                    <div className="assess">评价</div>
                                    <div className="timer">时间</div>
                                </div>
                                {listName.map(item => (
                                    <div key={item} className="list-nth">{item}</div>
                                ))}
                            </div>
                            {census && census.tomon && (
                                <div className="list">
                                    <div className="list-nth">本月</div>
                                    <div className="list-nth">{census.tomon.pingjia_good}</div>
                                    <div className="list-nth">{census.tomon.pingjia_middle}</div>
                                    <div className="list-nth">{census.tomon.pingjia_bad}</div>
                                    <div className="list-nth">{census.tomon.pingjia_num}</div>
                                </div>
                            )}
                            {census && census.three && (
                                <div className="list">
                                    <div className="list-nth">近3个月</div>
                                    <div className="list-nth">{census.three.pingjia_good}</div>
                                    <div className="list-nth">{census.three.pingjia_middle}</div>
                                    <div className="list-nth">{census.three.pingjia_bad}</div>
                                    <div className="list-nth">{census.three.pingjia_num}</div>
                                </div>
                            )}
                            {census && census.six && (
                                <div className="list">
                                    <div className="list-nth">近6个月</div>
                                    <div className="list-nth">{census.six.pingjia_good}</div>
                                    <div className="list-nth">{census.six.pingjia_middle}</div>
                                    <div className="list-nth">{census.six.pingjia_bad}</div>
                                    <div className="list-nth">{census.six.pingjia_num}</div>
                                </div>
                            )}
                            {census && census.oney && (
                                <div className="list">
                                    <div className="list-nth">近一年</div>
                                    <div className="list-nth">{census.oney.pingjia_good}</div>
                                    <div className="list-nth">{census.oney.pingjia_middle}</div>
                                    <div className="list-nth">{census.oney.pingjia_bad}</div>
                                    <div className="list-nth">{census.oney.pingjia_num}</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default TopSearch;
