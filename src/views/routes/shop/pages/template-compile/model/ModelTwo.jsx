import React from 'react';
import {Carousel} from 'antd';
import '../../../index.less';

class ModelTwo extends BaseComponent {
    slideshow = (str) => {
        this.props.clickOnShow(str);
    }

    //新品
    newShoper = (ix, title1, title2, title3, newClassName) => {
        const {defaultModelInfo} = this.props;
        const content = defaultModelInfo.get('content');
        const picurl = defaultModelInfo.get('picurl');
        return (
            <div key={title2} className={(picurl && picurl.get(content.get(ix)) && content.get(title1) && content.get(title2) && content.get(title3)) ? newClassName : newClassName + ' no-edit-model'}>
                <div className="commodity-t">
                    <img src={picurl && picurl.get(content.get(ix))} alt=""/>
                </div>
                <div className="headline-price">
                    <div className="headline">{content.get(title1)}</div>
                    <div className="price">
                        <span>{content.get(title2)}</span>
                        <span>{content.get(title3)}</span>
                    </div>
                </div>
            </div>
        );
    }

    //折扣区
    discountModal = (ix, title1, title2, title3, newClassName) => {
        const {defaultModelInfo} = this.props;
        const content = defaultModelInfo.get('content');
        const picurl = defaultModelInfo.get('picurl');
        return (
            <div key={title1} className={(picurl && picurl.get(content.get(ix)) && content.get(title1) && content.get(title2) && content.get(title3)) ? newClassName : newClassName + ' no-edit-model'}>
                <div className="discount">
                    <img src={picurl && picurl.get(content.get(ix))} alt=""/>
                </div>
                <div className="headline-price">
                    <div className="headline">{content.get(title1)}</div>
                    <div className="price">
                        <span>{content.get(title2)}</span>
                        <span>{content.get(title3)}</span>
                    </div>
                </div>
            </div>
        );
    }

    //渲染函数
    mapMain = (prevNum, nextNUm, newMain) => {
        const arr = [];
        for (let i = prevNum; i <= nextNUm; i++) {
            if (newMain) {
                arr.push(this.newShoper(`sort1_pr${i}_ix`, `sort1_pr${i}_title1`, `sort1_pr${i}_title2`, `sort1_pr${i}_title3`, 'commodity-one'));
            } else {
                arr.push(this.discountModal(`sort2_pr${i}_ix`, `sort2_pr${i}_title1`, `sort2_pr${i}_title2`, `sort2_pr${i}_title3`, 'discount-cargo'));
            }
        }
        return arr;
    }

    //标题结构
    titleMain = (prev, next, content) => (
        <div>
            <div className={content.get(`sort${prev}_title${next}`) ? 'products' : 'products no-edit-model'}>{content.get(`sort${prev}_title${next}`)}</div>
            <div className={content.get(`sort${prev}_title${next + 1}`) ? '' : 'no-edit-model'}>{content.get(`sort${prev}_title${next + 1}`)}</div>
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
                                <div className="head-base" onClick={() => this.slideshow('one')}/>
                            </div>
                            {
                                <Carousel autoplay>
                                    {
                                        content.get('banner').size > 0 ? content.get('banner').map(item => <img key={item} onClick={() => this.slideshow('two')} className={(item.get('id') && item.get('url')) ? '' : 'no-edit-model'} src={item.get('url')}/>) : <div className={content.get('banner').size === 0 ? 'banner-img no-edit-model' : 'banner-img'} onClick={() => this.slideshow('two')}/>
                                    }
                                </Carousel>
                            }
                            {/*新品推荐*/}
                            <div className="title-bar" onClick={() => this.slideshow('three')}>
                                {this.titleMain(1, 1, content)}
                            </div>
                            <div className="new-commodity" onClick={() => this.slideshow('four')}>
                                <div className="commodity-one-box">
                                    {this.mapMain(1, 2, true)}
                                </div>
                                <div className="commodity-one-box">
                                    {this.mapMain(3, 4, true)}
                                </div>
                            </div>
                            {/*折扣区*/}
                            <div className="title-bar" onClick={() => this.slideshow('five')}>
                                {this.titleMain(2, 1, content)}
                            </div>
                            <div className="discount" onClick={() => this.slideshow('six')}>
                                {this.mapMain(1, 2)}
                            </div>
                            <div className="discount" onClick={() => this.slideshow('six')}>
                                {this.mapMain(3, 4)}
                            </div>
                            {/*热销区*/}
                            <div className="title-bar" onClick={() => this.slideshow('seven')}>
                                {this.titleMain(3, 1, content)}
                            </div>
                            <Carousel className="hot-sell-recommend">
                                {
                                    content.get('pr_banner').size > 0
                                        ? (
                                            content.get('pr_banner').map(item => (
                                                <div key={item} className={(item.get('id') && item.get('title') && item.get('url') && item.get('price') && item.get('price_original')) ? 'hot-sell-box' : 'hot-sell-box no-edit-model'} onClick={() => this.slideshow('eight')}>
                                                    <div className="hot-sell">
                                                        <img src={item.get('url')} alt=""/>
                                                        <div className="headline-price">
                                                            <div className="headline">{item.get('title')}</div>
                                                            <div className="price">
                                                                <span>{item.get('price')}</span>
                                                                <span>{item.get('price_original')}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : <div className="pr-banner-default no-edit-model" onClick={() => this.slideshow('eight')}/>
                                }
                            </Carousel>
                        </div>
                    )
                }
            </div>
        );
    }
}

export default ModelTwo;
