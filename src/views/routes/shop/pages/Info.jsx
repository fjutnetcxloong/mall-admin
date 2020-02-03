/*
* 店铺信息
* */
import {Skeleton} from 'antd';
import InfoShow from '../components/info-components/InfoShow';
import InfoModify from '../components/info-components/InfoModify';
import ErrPage from '../../../common/default-page/NoRoot';
import '../index.less';
import './Info.less';

const {api} = Configs;

class Info extends BaseComponent {
    state = {
        isModify: false, //是否展示信息
        errPage: false,
        editArea: [], //地区
        skeleton: true, //内容骨架
        shoplist: {} //店铺信息
    };

    componentDidMount() {
        this.getList();
    }

    //获取店铺信息
    getList = () => {
        this.fetch(api.getShopInfo)
            .subscribe(res => {
                if (res && res.status === 0) {
                    if (res.data.status === 1) {
                        this.changePage(true);
                    } else {
                        this.setState({
                            shoplist: res.data,
                            skeleton: false,
                            editArea: res.data.area_code
                        });
                    }
                }
            });
    };

    //点击申请修改按钮
    toModify = (onOff, callback = null) => {
        if (callback && typeof callback === 'function') {
            callback();
        }
        this.setState({
            isModify: onOff
        });
    };

    //是否出现缺省页
    changePage = (val) => {
        this.setState({
            errPage: val
        });
    }

    render() {
        const {errPage, isModify, shoplist, skeleton} = this.state;
        return (
            <div className="shop-setting">
                <div className="page info-show-container">
                    <Skeleton active loading={skeleton && !errPage}>
                        {
                            (isModify && !errPage) && (<InfoModify getShopInfo={this.getList} shopInfo={shoplist} toModify={this.toModify} changePage={this.changePage}/>)
                        }
                        {
                            (!isModify && !errPage) && (<InfoShow shoplist={shoplist} toModify={this.toModify} changePage={this.changePage}/>)
                        }
                    </Skeleton>
                    {
                        errPage && (<ErrPage/>)
                    }
                </div>
            </div>
        );
    }
}

export default Info;
