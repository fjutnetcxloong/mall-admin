import React from 'react';
import moment from 'moment';


class InfoBottom extends BaseComponent {
    render() {
        const {infoBot} = this.props;
        const obj = [
            {
                name: '入驻人姓名：',
                key: infoBot.re_name
            },
            {
                name: '入驻人手机：',
                key: infoBot.phone
            },
            {
                name: '入驻时间：',
                key: moment(Number(infoBot.crtdate) * 1000).format('YYYY-MM-DD')
            }
        ];
        return (
            <div className="info-bottom-container">
                <p className="shop-name">入驻信息</p>
                <div className="info-show-inner-container">
                    <div className="info-show-inner-box">
                        {
                            obj.map(item => (
                                <div key={item.name}>
                                    <span>{item.name}</span>
                                    <span>{item.key}</span>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default InfoBottom;