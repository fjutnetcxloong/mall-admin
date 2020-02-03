import React from 'react';
import {Carousel} from 'antd';
// import {SketchPicker} from 'react-color';
import '../../../index.less';

class TemplateCompileOne extends BaseComponent {
    state={
        chooseColor: false
    }

    //选择器
    clickOnShow = (value) => {
        this.props.clickOnShow(value);
    }

    //颜色选择
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
                <img src={(picurl && picurl.get(content.get(ix))) ? picurl.get(content.get(ix)) : null} alt=""/>
                <div className="headline">
                    <span className="headline-left">{content && content.get(title1)}</span>
                    <span className="headline-right">
                        <span>{content.get(title2)}</span>
                        <span>{content.get(title3)}</span>
                    </span>
                </div>
            </div>
        );
    }

    //新品结构
    newModal = (ix, title1, title2, title3, newClassName) => {
        const {defaultModelInfo} = this.props;
        const content = defaultModelInfo.get('content');
        const picurl = defaultModelInfo.get('picurl');
        return  (
            <div key={title2} className={(picurl && picurl.get(content.get(ix)) && content.get(title1) && content.get(title2) && content.get(title3)) ? newClassName : newClassName + ' no-edit-model'}>
                <img src={(picurl && picurl.get(content.get(ix))) ? picurl.get(content.get(ix)) : null} alt=""/>
                <div className="two-headline">{content.get(title1)}</div>
                <div className="two-price">
                    <span>{content.get(title2)}</span>
                    <span className="price">{content.get(title3)}</span>
                </div>
            </div>
        );
    }

    //渲染函数
    mapMain = (prevNum, nextNum, hot) => {
        const arr = [];
        for (let i = prevNum; i <= nextNum; i++) {
            if (hot) {
                arr.push(this.hotModal(`sort1_pr${i}_ix`, `sort1_pr${i}_title1`, `sort1_pr${i}_title2`, `sort1_pr${i}_title3`, 'Commodity'));
            } else {
                arr.push(this.newModal(`sort2_pr${i}_ix`, `sort2_pr${i}_title1`, `sort2_pr${i}_title2`, `sort2_pr${i}_title3`, 'commodity-two'));
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
                <div className="template-middle-box">
                    {content && (
                        <div className="compile-box" onClick={() => this.props.mainShow(true)}>
                            <div className="compile">编辑面板</div>
                            {/* <div onClick={() => this.setState({chooseColor: true})}>选择颜色</div> */}
                            {/* {
                                chooseColor && <SketchPicker color={nowColor} onChange={this.chooseColor}/>
                            } */}
                            <div className={(picurl && !picurl.get(0)) ? 'head no-edit-model' : 'head'} style={{background: picurl ? `url(${picurl.get(0)})` : '', backgroundSize: '100% 100%'}}>
                                <div className="head-base" onClick={() => this.clickOnShow('one')}/>
                            </div>
                            <div className={content.get('banner') ? 'template-one-banner-carousel' : 'no-edit-model template-one-banner-carousel'} onClick={() => this.clickOnShow('two')}>
                                <Carousel autoplay speed={2000}>
                                    {
                                        content.get('banner').size > 0
                                            ? content.get('banner').map(item => (
                                                <img
                                                    key={item.get('url')}
                                                    className={item.get('id') !== '' && item.get('url') ? '' : 'no-edit-model'}
                                                    src={item.get('url')}
                                                    onClick={() => this.clickOnShow('two')}
                                                />
                                            ))
                                            : (
                                                <div
                                                    className={content.get('banner').size === 0 ? 'banner-img no-edit-model' : 'banner-img'}
                                                    onClick={() => this.clickOnShow('two')}
                                                />
                                            )
                                    }
                                </Carousel>
                            </div>
                            <div className="title-bar" onClick={() => this.clickOnShow('three')}>
                                <p className={content.get('sort1_title1') ? 'time' : 'time no-edit-model'}>{content.get('sort1_title1')}</p>
                                <p className={content.get('sort1_title2') ? 'hot' : 'hot no-edit-model'}>{content.get('sort1_title2')}</p>
                                <p className={content.get('sort1_title3') ? 'fiery' : 'fiery no-edit-model'}>{content.get('sort1_title3')}</p>
                            </div>
                            <div className="commodity-title-one" onClick={() => this.clickOnShow('four')}>
                                {this.mapMain(1, 2, true)}
                            </div>
                            <div className={(content.get('sort2_title1') && content.get('sort2_title2')) ? 'title-bar' : 'title-bar no-edit-model'} onClick={() => this.clickOnShow('five')}>
                                <p className="hot">{content.get('sort2_title1')}</p>
                                <p className="fiery">{content.get('sort2_title2')}</p>
                            </div>
                            <div className="commodity-title-two" onClick={() => this.clickOnShow('six')}>
                                {this.mapMain(1, 4)}
                            </div>
                            <div className="commodity-title-two" onClick={() => this.clickOnShow('seven')}>
                                {this.mapMain(5, 8)}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default TemplateCompileOne;
