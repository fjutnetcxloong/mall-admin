import React from 'react';
import {Carousel} from 'antd';
// import {SketchPicker} from 'react-color';
import '../../../index.less';

class ModelFour extends BaseComponent {
    state={
        chooseColor: false
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

    //新品
    newMain = (ix, title1, title2, title3, newClassName, type, good) => {
        const {defaultModelInfo} = this.props;
        const content = defaultModelInfo.get('content');
        const picurl = defaultModelInfo.get('picurl');
        return (
            <div className="new-box" onClick={() => this.clickOnShow('four')}>
                <div className={(picurl && picurl.get(content.get('sort1_pr1_ix')) && content.get('sort1_pr1_title1') && content.get('sort1_pr1_title2') && content.get('sort1_pr1_title3')) ? 'new' : 'new no-edit-model'}>
                    <img src={picurl && picurl.get(content.get('sort1_pr1_ix'))} alt=""/>
                    <div className="headline-price">
                        <div className="headline">{content.get('sort1_pr1_title1')}</div>
                        <div className="price">
                            <span>￥<span>{content.get('sort1_pr1_title2')}</span></span>
                            <span>{content.get('sort1_pr1_title3')}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    //热销结构
    hotModal = (ix, title1, title2, title3, newClassName, type, good) => {
        const {defaultModelInfo} = this.props;
        const content = defaultModelInfo.get('content');
        const picurl = defaultModelInfo.get('picurl');
        return (
            <div key={title1} onClick={() => this.clickOnShow(type)} className={(picurl && picurl.get(content.get(ix)) && content.get(title1) && content.get(title2) && content.get(title3)) ? newClassName : newClassName + ' no-edit-model'}>
                <div className={good ? 'sell-goods' : 'sell-commodity-img'}>
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
    mapMain = (prevNum, nextNum, hot, className, type, good) => {
        const arr = [];
        for (let i = prevNum; i <= nextNum; i++) {
            if (hot) {
                arr.push(this.hotModal(`sort2_pr${i}_ix`, `sort2_pr${i}_title1`, `sort2_pr${i}_title2`, `sort2_pr${i}_title3`, className, type, good));
            } else {
                arr.push(this.hotModal(`sort3_pr${i}_ix`, `sort3_pr${i}_title1`, `sort3_pr${i}_title2`, `sort3_pr${i}_title3`, className, type, good));
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
                            {/* {
                                chooseColor && <SketchPicker color={nowColor} onChange={this.chooseColor}/>
                            } */}
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
                            {this.newMain()}
                            <div className="sell-box">
                                <div className="title-bar" onClick={() => this.clickOnShow('three')}>
                                    <span>{(content.get('sort2_title1'))}</span>
                                    <div>{(content.get('sort2_title2'))}</div>
                                </div>
                                <div className="sell-commodity-box">
                                    {this.mapMain(1, 1, true, 'sell', 'five', true)}
                                    {this.mapMain(2, 5, true, 'sell-commodity', 'six')}
                                </div>
                            </div>
                            <div className={(content.get('sort3_title1') && content.get('sort3_title2')) ? 'title-bar' : 'title-bar no-edit-model'} onClick={() => this.clickOnShow('seven')}>
                                <span>{content.get('sort3_title1')}</span>
                                <div>{content.get('sort3_title2')}</div>
                            </div>
                            <div className="sell-commodity-box">
                                {this.mapMain(1, 4, false, 'sell-commodity', 'eight')}
                            </div>
                        </div>
                    )
                }
            </div>
        );
    }
}

export default ModelFour;
