import React from 'react';
import {Carousel} from 'antd';
import '../../../index.less';

class ModelThree extends BaseComponent {
    state={
        chooseColor: false
    }

    //控制改变
    clickOnShow = (value) => {
        this.props.clickOnShow(value);
    }

    chooseColor = (data) => {
        this.setState({
            nowColor: data.hex
        });
        this.props.chooseColor(data.hex);
    }

    //热销结构
    hotModal = (ix, title1, title2, title3, newClassName) => {
        const {defaultModelInfo} = this.props;
        const content = defaultModelInfo.get('content');
        const picurl = defaultModelInfo.get('picurl');
        return (
            <div key={title1} className={(picurl.get(content.get(ix)) && content.get(title1) && content.get(title2) && content.get(title3)) ? newClassName : newClassName + ' no-edit-model'}>
                <div className="commodity-img">
                    <img src={picurl.get(content.get(ix)) ? picurl.get(content.get(ix)) : ''} alt=""/>
                </div>
                <div className="headline-price">
                    <div className="headline">{content.get(title1)}</div>
                    <div className="price">
                        <span>￥<span className="">{content.get(title2)}</span></span>
                        <span>{content.get(title3)}</span>
                    </div>
                </div>
            </div>
        );
    }

    //热销结构
    hotModalS = (ix, title1, title2, title3, newClassName, secondClassName) => {
        const {defaultModelInfo} = this.props;
        const content = defaultModelInfo.get('content');
        const picurl = defaultModelInfo.get('picurl');
        return (
            <div key={title1} className={(picurl && picurl.get(content.get(ix)) && content.get(title1) && content.get(title2) && content.get(title3)) ? newClassName : newClassName + ' no-edit-model'}>
                <div>
                    <img src={picurl && picurl.get(content.get(ix))} alt=""/>
                </div>
                <div className="headline-price">
                    <p className="headline">{content.get(title1)}</p>
                    <div className="price">
                        <span>￥<span>{content.get(title2)}</span></span>
                        <span>{content.get(title3)}</span>
                    </div>
                </div>
            </div>
        );
    }

    //渲染函数
    mapMain = (prevNum, nextNum, hot, classShow) => {
        const arr = [];
        for (let i = prevNum; i <= nextNum; i++) {
            if (hot) {
                arr.push(this.hotModal(`sort1_pr${i}_ix`, `sort1_pr${i}_title1`, `sort1_pr${i}_title2`, `sort1_pr${i}_title3`, 'hot'));
            } else {
                arr.push(this.hotModalS(`sort2_pr${i}_ix`, `sort2_pr${i}_title1`, `sort2_pr${i}_title2`, `sort2_pr${i}_title3`, classShow));
            }
        }
        return arr;
    }

    //标题渲染
    mainTitle = (title1, title2, content) => (
        <div>
            <p className={content.get(title1) ? 'hot' : 'hot no-edit-model'}>{content.get(title1)}</p>
            <p className={content.get(title2) ? 'fiery' : 'fiery no-edit-model'}>{content.get(title2)}</p>
        </div>
    )

    render() {
        const {defaultModelInfo} = this.props;
        const content = defaultModelInfo.get('content');
        const picurl = defaultModelInfo.get('picurl');
        return (
            <div className="shop-setting">
                {
                    content && (
                        <div className="compile-box" onClick={() => this.props.mainShow(true)}>
                            <div className="compile">编辑面板</div>
                            <div className={(picurl && !picurl.get(0)) ? 'head no-edit-model' : 'head'} style={{background: picurl ? `url(${picurl.get(0)})` : '', backgroundSize: '100% 100%'}}>
                                <div className="head-base" onClick={() => this.clickOnShow('one')}/>
                            </div>
                            <div className="my-carousel">
                                <Carousel autoplay>
                                    {
                                        content.get('banner').size > 0 ? content.get('banner').map(item => <img key={item} onClick={() => this.clickOnShow('two')} className={item.get('id') !== '' && item.get('url') ? '' : 'no-edit-model'} src={item.get('url')}/>) : <div className={content.get('banner').size === 0 ? 'banner-img no-edit-model' : 'banner-img'} onClick={() => this.clickOnShow('two')}/>
                                    }
                                </Carousel>
                            </div>

                            <div className="title-bar" onClick={() => this.clickOnShow('three')}>
                                {this.mainTitle('sort1_title1', 'sort1_title2', content)}
                            </div>
                            <div className="hot-box" onClick={() => this.clickOnShow('four')}>
                                {this.mapMain(1, 2, true)}
                            </div>
                            <div className="title-bar" onClick={() => this.clickOnShow('five')}>
                                {this.mainTitle('sort2_title1', 'sort2_title2', content)}
                            </div>
                            <div className="sell-box" onClick={() => this.clickOnShow('six')}>
                                {this.mapMain(1, 2, false, 'sell')}
                            </div>
                            <div className="sell-one-box" onClick={() => this.clickOnShow('five-extra')}>
                                {this.mapMain(3, 4, false, 'sell-one')}
                            </div>
                            <div className="sell-two-box" onClick={() => this.clickOnShow('seven')}>
                                {this.mapMain(5, 8, false, 'sell-two')}
                            </div>
                        </div>
                    )
                }

            </div>
        );
    }
}

export default ModelThree;
