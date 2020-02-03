import React from 'react';
import {Carousel} from 'antd';
import '../../../index.less';
// import {SketchPicker} from 'react-color';

class ModelFive extends BaseComponent {
    state={
        chooseColor: true
    }

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
    newModal = (ix, title1, title2, title3, classNameOne, classNameTwo) => {
        const {defaultModelInfo} = this.props;
        const content = defaultModelInfo.get('content');
        const picurl = defaultModelInfo.get('picurl');
        return (
            <div key={title1} className={(picurl && picurl.get(content.get(ix)) && content.get(title1) && content.get(title2) && content.get(title3)) ? classNameOne : classNameOne + ' no-edit-model'}>
                <div className={classNameTwo}>
                    <img src={(picurl && picurl.get(content.get(ix))) ? picurl.get(content.get(ix)) : null} alt=""/>
                </div>
                <div className="headline-price space">
                    <div className="headline">{content.get(title1)}</div>
                    <div className="price">
                        <span>￥<span>{content.get(title2)}</span></span>
                        <span>{content.get(title3)}</span>
                    </div>
                </div>
            </div>
        );
    }

    //热销结构
    hotModal = (ix, title1, title2, title3) => {
        const {defaultModelInfo} = this.props;
        const content = defaultModelInfo.get('content');
        const picurl = defaultModelInfo.get('picurl');
        return (
            <div key={title1} className={(picurl && picurl.get(content.get(ix)) && content.get(title1) && content.get(title2) && content.get(title3)) ? 'handpick' : 'handpick no-edit-model'}>
                <div className="handpick-img">
                    <img src={(picurl && picurl.get(content.get(ix))) ? picurl.get(content.get(ix)) : null} alt=""/>
                </div>
                <div className="headline-price-take">
                    <div className="headline">{content.get(title1)}</div>
                    <div className="price">
                        <span>￥<span>{content.get(title2)}</span></span>
                        <span>{content.get(title3)}</span>
                    </div>
                </div>
            </div>
        );
    }

    //渲染函数
    mapMain = (prevNum, nextNum, hot, classNameOne, classNameTwo) => {
        const arr = [];
        for (let i = prevNum; i <= nextNum; i++) {
            if (hot) {
                arr.push(this.newModal(`sort2_pr${i}_ix`, `sort2_pr${i}_title1`, `sort2_pr${i}_title2`, `sort2_pr${i}_title3`, classNameOne[i - 1], classNameTwo[i - 1]));
            } else {
                arr.push(this.hotModal(`sort1_pr${i}_ix`, `sort1_pr${i}_title1`, `sort1_pr${i}_title2`, `sort1_pr${i}_title3`));
            }
        }
        return arr;
    }

    render() {
        const {defaultModelInfo} = this.props;
        const content = defaultModelInfo.get('content');
        const picurl = defaultModelInfo.get('picurl');
        // const {chooseColor, nowColor} = this.state;
        return (
            <div className="shop-setting">
                {
                    content && (
                        <div className="compile-box" onClick={() => this.props.mainShow(true)}>
                            <div className="compile">编辑面板</div>
                            {
                            // chooseColor && <SketchPicker color={nowColor} onChange={this.chooseColor}/>
                            }
                            <div className={(picurl && !picurl.get(0)) ? 'head no-edit-model' : 'head'} style={{background: picurl ? `url(${picurl.get(0)})` : '', backgroundSize: '100% 100%'}}>
                                <div className="head-base" onClick={() => this.clickOnShow('one')}/>
                            </div>
                            <div className="my-carousel">
                                <Carousel autoplay speed={2000}>
                                    {
                                        content.get('banner').size > 0 ? content.get('banner').map(item => <img key={item} onClick={() => this.clickOnShow('two')} className={item.get('id') !== '' && item.get('url') ? '' : 'no-edit-model'} src={item.get('url')}/>) : <div className={content.get('banner').size === 0 ? 'banner-img no-edit-model' : 'banner-img'} onClick={() => this.clickOnShow('two')}/>
                                    }
                                </Carousel>
                            </div>
                            {/*精选商品*/}
                            <div className="title-bar" onClick={() => this.clickOnShow('three')}>
                                <div className="products">-{content.get('sort1_title1')}-</div>
                                <div>{content.get('sort1_title2')}</div>
                            </div>
                            <div className="handpick-box" onClick={() => this.clickOnShow('four')}>
                                {this.mapMain(1, 4)}
                            </div>
                            {/*热销尖货*/}
                            <div className={(content.get('sort2_title1') && content.get('sort2_title2')) ? 'title-bar' : 'title-bar no-edit-model'} onClick={() => this.clickOnShow('five')}>
                                <div className="products">-{content.get('sort2_title1')}-</div>
                                <div>{content.get('sort2_title2')}</div>
                            </div>
                            <div className="hot-sale-box" onClick={() => this.clickOnShow('six')}>
                                {this.mapMain(1, 4, true, ['hot-sale', 'hot-sale-one', 'hot-sale-two', 'hot-sale-three'], ['hot-sale-img', 'sale-one-img', 'sale-two-img', 'sale-three-img'])}
                            </div>
                        </div>
                    )
                }
            </div>
        );
    }
}

export default ModelFive;
