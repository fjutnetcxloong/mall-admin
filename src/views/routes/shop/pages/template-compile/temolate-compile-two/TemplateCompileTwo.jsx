import React from 'react';
import Immutable from 'immutable';
import {Row, Col, Button, Modal, Spin} from 'antd';
import './TemplateCompileTwo.less';
import ModelTwo from  '../model/ModelTwo';
import StoreBackground from '../../collective/background';
import SecondRotary from '../../collective/secondRotary';
import RotarySowing from '../../collective/rotarySowing';
import Title from '../../collective/title';
import CommodityChoiceFour from '../../collective/commodityChoiceFour';//公共商品选择 四张图

const {api} = Configs;
const {successMsg, warningMsg, appHistory} = Utils;

class TemplateCompileTwo extends BaseComponent {
    state = {
        popping: '',
        defaultModelInfo: Immutable.Map({}),
        modelShow: false, //保存模板时的loading
        showOrHide: true //选择器展示与否
    }

    componentDidMount() {
        this.getDefaultModel();
    }

    getDefaultModel = () => {
        this.fetch(api.modelMetail, {data: {mol_id: 2}}).subscribe(res => {
            if (res.status === 0) {
                this.setState(({defaultModelInfo}) => ({
                    defaultModelInfo: defaultModelInfo.merge(res.data)
                }));
            }
        });
    }

    //设置picurl背景图
    setPicurlBackground = (index, value) => {
        this.setState(({defaultModelInfo}) => ({
            defaultModelInfo: defaultModelInfo.update('picurl', (list) => list.set(index, value))
        }));
    }

    //设置商品信息
    setExplosiveInfo = (title, value) => {
        this.setState(({defaultModelInfo}) => ({
            defaultModelInfo: defaultModelInfo.setIn(['content', title], value)
        }));
    }

    //改变颜色
    chooseColor = (value) => {
        const {defaultModelInfo} = this.state;
        const obj = defaultModelInfo;
        obj.content.bg_color = value;
        this.setState({
            defaultModelInfo: {...obj}
        });
    }

    //返回模板页面
    goBackModal = () => {
        appHistory.goBack();
    }

    //保存草稿
    modelSaveDraf= () => {
        this.setState(({defaultModelInfo}) => ({
            defaultModelInfo: defaultModelInfo.update('picurl', (list) => list.setSize(9))
        }), () => {
            const {defaultModelInfo} = this.state;
            this.saveEnd(defaultModelInfo.get('content'), defaultModelInfo.get('picurl'), true);
        });
    }

    //保存
    modelSave = () => {
        const {defaultModelInfo} = this.state;
        const content = defaultModelInfo.get('content');
        const picurl = defaultModelInfo.get('picurl');
        if (picurl && picurl.size >= 9 && content.get('banner').size > 0 && content.get('pr_banner').size > 0) {
            //这里是判断所有的字段都是否有填写
            const onOff = !Object.keys(content.toJS()).some(item => content.get(item) === '');//判断内容是否都填写
            const onOff2 = content.get('banner').every(item => item.get('id') !== '');//判断banner图数组商品id是否已选
            const onOff3 = content.get('banner').every(item => item.get('url'));//判断banner图图片是否已选择
            const onOff4 = content.get('pr_banner').every(item => item.get('id') !== '');//判断pr_banner图数组商品id是否已选
            const onOff5 = content.get('pr_banner').every(item => item.get('url'));//判断pr_banner图图片是否已选择
            const onOff6 = content.get('pr_banner').every(item => item.get('price'));//判断pr_banner图价格
            const onOff7 = content.get('pr_banner').every(item => item.get('price_original'));//判断pr_banner价格
            const onOff8 = content.get('pr_banner').every(item => item.get('title'));//判断pr_banner图标题
            if (onOff && onOff2 && onOff3 && onOff4 && onOff5 && onOff6 && onOff7 && onOff8) {
                this.saveEnd(content, picurl);
            } else {
                warningMsg('有信息未完善');
            }
        } else {
            warningMsg('请完善信息');
        }
    }

    //最终保存
    saveEnd = (content, picurl, draf) => {
        this.setState({//弹框提示保存中
            modelShow: true
        }, () => {
            const bannerImg = picurl.slice(0, 9).concat(content.get('pr_banner').map(item => item.get('url'))).concat(content.get('banner').map(item => item.get('url')));
            const saveObj = content.toJS();
            saveObj.pr_banner.forEach((item, index) => {
                item.ix = 9 + index;
                item.url = '123';
            });
            saveObj.banner.forEach((item, index) => {
                item.ix = saveObj.pr_banner.length + 9 + index;
                item.url = '123';
            });
            this.fetch(api.modelSave, {data: {type: draf ? 0 : 1, mol_id: 2, content: JSON.stringify(saveObj)}})
                .subscribe(res => {
                    if (res.status === 0) {
                        const pasArr = [];
                        bannerImg.forEach((item, index) => {
                            if (item) {
                                pasArr.push(new Promise((resolve, reject) => {
                                    this.fetch(api.modelSavePice, {data: {id: res.data.id, ix: index, num: content.get('banner').size + 9, file: encodeURIComponent(item), is_url: item.indexOf('https:') === -1 ? 0 : 1}})
                                        .subscribe(value => {
                                            if (value && value.status === 0) {
                                                resolve(value);
                                            } else {
                                                reject(value);
                                            }
                                        });
                                }));
                            }
                        });
                        Promise.all(pasArr).then(ooo => {
                            successMsg(draf ? '保存草稿成功' : '保存成功');
                            this.goBackModal();
                        }).catch(err => {
                            this.setState({
                                modelShow: false
                            });
                        });
                    }
                });
        });
    }

    //点击哪个位置展示对应可编辑内容
    clickOnShow = (data) => {
        this.setState({
            popping: data
        });
    }

    //控制编辑器展示与否
    mainShow = (onoff) => {
        this.setState({
            showOrHide: onoff
        });
    }

    //选择器
    choiseType = (num) => {
        const {defaultModelInfo} = this.state;
        let str = '';
        switch (num) {
        case 'one':
            str = (
                <StoreBackground
                    mainShow={this.mainShow}
                    defaultModelInfo={defaultModelInfo}
                    setPicurlBackground={this.setPicurlBackground}
                />
            );
            break;
        case 'two':
            str = (
                <RotarySowing
                    mainShow={this.mainShow}
                    defaultModelInfo={defaultModelInfo}
                    setExplosiveInfo={this.setExplosiveInfo}
                    top={105}
                    width={750}
                    height={1082}
                />
            );
            break;
        case 'three':
            str = (
                <Title
                    mainShow={this.mainShow}
                    defaultModelInfo={defaultModelInfo}
                    setExplosiveInfo={this.setExplosiveInfo}
                    titleName1="sort1_title1"
                    titleName2="sort1_title2"
                    top={670}
                />
            );
            break;
        case 'four':
            str = (
                <CommodityChoiceFour
                    mainShow={this.mainShow}
                    defaultModelInfo={defaultModelInfo}
                    setExplosiveInfo={this.setExplosiveInfo}
                    setPicurlBackground={this.setPicurlBackground}
                    index={[1, 2, 3, 4]}
                    top={733}
                    firstWidth={280}
                    firstHeight={390}
                    secondWidth={304}
                    secondHeight={304}
                    sortId1="sort1_pr1_id"
                    sortId2="sort1_pr2_id"
                    sortId3="sort1_pr3_id"
                    sortId4="sort1_pr4_id"

                    sortIx1="sort1_pr1_ix"
                    sortIx2="sort1_pr2_ix"
                    sortIx3="sort2_pr3_ix"
                    sortIx4="sort1_pr4_ix"

                    sortTitle11="sort1_pr1_title1"
                    sortTitle12="sort1_pr2_title1"
                    sortTitle13="sort1_pr3_title1"
                    sortTitle14="sort1_pr4_title1"

                    sortTitle21="sort1_pr1_title2"
                    sortTitle22="sort1_pr2_title2"
                    sortTitle23="sort1_pr3_title2"
                    sortTitle24="sort1_pr4_title2"

                    sortTitle31="sort1_pr1_title3"
                    sortTitle32="sort1_pr2_title3"
                    sortTitle33="sort1_pr3_title3"
                    sortTitle34="sort1_pr4_title3"
                />
            );
            break;
        case 'five':
            str = (
                <Title
                    mainShow={this.mainShow}
                    defaultModelInfo={defaultModelInfo}
                    setExplosiveInfo={this.setExplosiveInfo}
                    titleName1="sort2_title1"
                    titleName2="sort2_title2"
                    top={1300}
                />
            );
            break;
        case 'six':
            str = (
                <CommodityChoiceFour
                    mainShow={this.mainShow}
                    defaultModelInfo={defaultModelInfo}
                    setExplosiveInfo={this.setExplosiveInfo}
                    setPicurlBackground={this.setPicurlBackground}
                    index={[5, 6, 7, 8]}
                    top={1360}
                    firstWidth={304}
                    firstHeight={304}
                    sortId1="sort2_pr1_id"
                    sortId2="sort2_pr2_id"
                    sortId3="sort2_pr3_id"
                    sortId4="sort2_pr4_id"
                    sortIx1="sort2_pr1_ix"
                    sortIx2="sort2_pr2_ix"
                    sortIx3="sort2_pr3_ix"
                    sortIx4="sort2_pr4_ix"
                    sortTitle11="sort2_pr1_title1"
                    sortTitle12="sort2_pr2_title1"
                    sortTitle13="sort2_pr3_title1"
                    sortTitle14="sort2_pr4_title1"

                    sortTitle21="sort2_pr1_title2"
                    sortTitle22="sort2_pr2_title2"
                    sortTitle23="sort2_pr3_title2"
                    sortTitle24="sort2_pr4_title2"

                    sortTitle31="sort2_pr1_title3"
                    sortTitle32="sort2_pr2_title3"
                    sortTitle33="sort2_pr3_title3"
                    sortTitle34="sort2_pr4_title3"
                />
            );
            break;
        case 'seven':
            str = (
                <Title
                    mainShow={this.mainShow}
                    defaultModelInfo={defaultModelInfo}
                    setExplosiveInfo={this.setExplosiveInfo}
                    titleName1="sort3_title1"
                    titleName2="sort3_title2"
                    top={1760}
                />
            );
            break;
        case 'eight':
            str = (
                <SecondRotary
                    mainShow={this.mainShow}
                    defaultModelInfo={defaultModelInfo}
                    setExplosiveInfo={this.setExplosiveInfo}
                />
            );
            break;
        default:
            str = '';
        }
        return str;
    }

    render() {
        const {popping, goBackShow, defaultModelInfo, buttonStatus, modelShow, showOrHide} = this.state;
        return (
            <React.Fragment>
                <Row className="template-compile-two back">
                    <Col span={8}>
                        <div className="static">
                            <div>
                                <span>参考模板</span>
                                <span>不可编辑</span>
                            </div>
                            <img src={require('../../../../../../assets/images/summer-two.png')} alt=""/>
                        </div>
                    </Col>
                    <Col span={8}>
                        <ModelTwo
                            defaultModelInfo={defaultModelInfo}
                            clickOnShow={this.clickOnShow}
                            mainShow={this.mainShow}
                        />
                    </Col>
                    <Col span={8}>
                        {showOrHide && this.choiseType(popping)}
                    </Col>
                </Row>
                <div className="edit-template-button">
                    <Button onClick={() => this.setState({goBackShow: true})} disabled={buttonStatus}>取消</Button>
                    <Button onClick={this.modelSaveDraf} disabled={buttonStatus}>保存草稿</Button>
                    <Button onClick={this.modelSave} disabled={buttonStatus}>保存</Button>
                </div>
                <Modal
                    title="确定退出？"
                    centered
                    visible={goBackShow}
                    onCancel={() => this.setState({goBackShow: false})}
                    onOk={this.goBackModal}
                >
                    <p style={{textAlign: 'center'}}>退出后，所填写的内容将清空，可以选择保存到草稿？</p>
                </Modal>
                <Modal
                    title="模板保存中..."
                    visible={modelShow}
                    footer={null}
                    closable={false}
                >
                    <p className="model-must-save-loading"><Spin/></p>
                </Modal>
            </React.Fragment>
        );
    }
}

export default TemplateCompileTwo;
