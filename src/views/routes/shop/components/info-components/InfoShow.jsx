/*
* 店铺信息
* */
import {Button} from 'antd';
import InfoBottom from './InfoBottom';
import '../../index.less';

class InfoShow extends BaseComponent {
    //显示商家图册
    showPhotos = () => {
        const {shoplist} = this.props;
        return (
            shoplist.album && shoplist.album.map((item) => (
                <div className="img-box" key={item}>
                    <img src={item} alt="图册"/>
                </div>
            )));
    }

    infoObj = () => {
        const {shoplist} = this.props;
        return ([
            {
                title: '店铺类型：',
                key: shoplist.shop_type_name
            },
            {
                title: '店铺名称：',
                key: shoplist.shopName
            },
            {
                title: 'UID：',
                key: shoplist.no
            },
            {
                title: '营业时间：',
                key: `${shoplist.open_time} 至 ${shoplist.close_time}`
            },
            {
                title: '主营类目：',
                key: shoplist.cate1
            },
            {
                title: '收款码折扣：',
                key: shoplist.discount
            },
            {
                title: '所在地区：',
                key: shoplist.area
            },
            {
                title: '店铺具体地址：',
                key: shoplist.address
            },
            {
                title: '商家图册：',
                key: this.showPhotos()
            },
            {
                title: '客服电话：',
                key: shoplist.csh_phone
            },
            {
                title: '商户负责人：',
                key: shoplist.linkName
            },
            {
                title: '商户负责人电话：',
                key: shoplist.phone
            },
            {
                title: '店铺简介：',
                key: shoplist.intro
            }
        ]);
    }

    render() {
        const {shoplist} = this.props;
        return (
            <div className="shop-setting">
                <div className="info-show-inner">
                    <p className="shop-name">店铺信息</p>
                    <div className="info-show-inner-container">
                        <div className="shop-logo">
                            <img src={shoplist.logo} alt=""/>
                        </div>
                        <div className="info-show-inner-box">
                            {
                                this.infoObj().map(item => (
                                    <div className="info-show-item-box" key={item.title}>
                                        <span>{item.title}</span>
                                        <span>{item.key}</span>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    <div className="gray-line"/>
                    <InfoBottom infoBot={shoplist}/>
                    <div className="mt70">
                        <Button style={{width: '240px'}} type="primary" onClick={() => this.props.toModify(true)}>申请修改</Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default InfoShow;
