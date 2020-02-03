import React from 'react';
import Immutable from 'immutable';
import {Row, Col, Button, Modal, Spin} from 'antd';
import './TemplateCompileThree.less';
import ModelThree from  '../model/ModelThree';
import StoreBackground from '../../collective/background';//公共背景图选择
import RotarySowing from '../../collective/rotarySowing';//公共轮播图选择
import Title from '../../collective/title';//公共标题选择
import CommodityChoiceTwo from '../../collective/commodityChoiceTwo';//公共商品选择 两张图
import CommodityChoiceFour from '../../collective/commodityChoiceFour';//公共商品选择 四张图

const {api} = Configs;
const {successMsg, warningMsg} = Utils;

class TemplateCompileThree extends BaseComponent {
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
        this.fetch(api.modelMetail, {data: {mol_id: 3}}).subscribe(res => {
            if (res && res.status === 0) {
                this.setState(({defaultModelInfo}) => ({
                    defaultModelInfo: defaultModelInfo.merge(res.data)
                }));
            }
        });
    }

    //返回模板页面
    goBackModal = () => {
        this.props.history.push('/shop/template');
    }

    //点击哪个位置展示对应可编辑内容
    clickOnShow = (data) => {
        this.setState({
            popping: data
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

    //保存
    modelSave = () => {
        const {defaultModelInfo} = this.state;
        const content = defaultModelInfo.get('content');
        const picurl = defaultModelInfo.get('picurl');
        if (picurl && picurl.size >= 11 && content.get('banner').size > 0) {
            //这里是判断所有的字段都是否有填写
            const onOff = !Object.keys(content.toJS()).some(item => content.get(item) === '');//判断内容是否都填写
            const onOff2 = content.get('banner').every(item => item.get('id') !== '');//判断banner图数组商品id是否已选
            const onOff3 = content.get('banner').every(item => item.get('url') !== '');//判断banner图图片是否已选择
            if (onOff && onOff2 && onOff3) {
                this.saveEnd(content, picurl);
            } else {
                warningMsg('有信息未完善');
            }
        } else {
            warningMsg('请完善信息');
        }
    }

    //保存草稿
    modelSaveDraf = () => {
        this.setState(({defaultModelInfo}) => ({
            defaultModelInfo: defaultModelInfo.update('picurl', (list) => list.setSize(11))
        }), () => {
            const {defaultModelInfo} = this.state;
            this.saveEnd(defaultModelInfo.get('content'), defaultModelInfo.get('picurl'), true);
        });
    }

    //最终保存
    saveEnd = (content, picurl, draf) => {
        this.setState({//弹框提示保存中
            modelShow: true
        }, () => {
            const bannerImg = picurl.slice(0, 11).concat(content.get('banner').map(item => item.get('url')));
            const saveObj = content.toJS();
            saveObj.banner.forEach((item, index) => {
                item.ix = 11 + index;
                item.url = '123';
            });
            this.fetch(api.modelSave, {data: {type: draf ? 0 : 1, mol_id: 3, content: JSON.stringify(saveObj)}})
                .subscribe(res => {
                    if (res.status === 0) {
                        const pasArr = [];
                        bannerImg.forEach((item, index) => {
                            if (item) {
                                pasArr.push(new Promise((resolve, reject) => {
                                    this.fetch(api.modelSavePice, {data: {id: res.data.id, ix: index, num: content.get('banner').size + 11, file: encodeURIComponent(item), is_url: item.indexOf('https:') === -1 ? 0 : 1}})
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

    //控制编辑器展示与否
    mainShow = (onoff) => {
        this.setState({
            showOrHide: onoff
        });
    }

    //选择器
    choiseType = (type) => {
        const {defaultModelInfo} = this.state;
        let str = '';
        switch (type) {
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
                    top={110}
                    width={750}
                    height={496}
                />
            );
            break;
        case 'three':
            str = (
                <Title
                    mainShow={this.mainShow}
                    defaultModelInfo={defaultModelInfo}
                    setExplosiveInfo={this.setExplosiveInfo}
                    top={400}
                    titleName1="sort1_title1"
                    titleName2="sort1_title2"
                />
            );
            break;
        case 'four':
            str = (
                <CommodityChoiceTwo
                    mainShow={this.mainShow}
                    defaultModelInfo={defaultModelInfo}
                    setPicurlBackground={this.setPicurlBackground}
                    setExplosiveInfo={this.setExplosiveInfo}
                    top={445}
                    index={[1, 2]}
                    firstWidth={550}
                    firstHeight={330}
                    sortId1="sort1_pr1_id"
                    sortId2="sort1_pr2_id"

                    sortIx1="sort1_pr1_ix"
                    sortIx2="sort1_pr2_ix"

                    sortTitle11="sort1_pr1_title1"
                    sortTitle12="sort1_pr2_title1"

                    sortTitle21="sort1_pr1_title2"
                    sortTitle22="sort1_pr2_title2"

                    sortTitle31="sort1_pr1_title3"
                    sortTitle32="sort1_pr2_title3"
                />
            );
            break;
        case 'five':
            str = (
                <Title
                    mainShow={this.mainShow}
                    defaultModelInfo={defaultModelInfo}
                    setExplosiveInfo={this.setExplosiveInfo}
                    top={680}
                    titleName1="sort2_title1"
                    titleName2="sort2_title2"
                />
            );
            break;
        case 'five-extra':
            str = (
                <CommodityChoiceTwo
                    mainShow={this.mainShow}
                    defaultModelInfo={defaultModelInfo}
                    setExplosiveInfo={this.setExplosiveInfo}
                    setPicurlBackground={this.setPicurlBackground}
                    top={984}
                    index={[5, 6]}
                    firstWidth={280}
                    firstHeight={390}
                    sortId1="sort2_pr3_id"
                    sortId2="sort2_pr4_id"

                    sortIx1="sort2_pr3_ix"
                    sortIx2="sort2_pr4_ix"

                    sortTitle11="sort2_pr3_title1"
                    sortTitle12="sort2_pr4_title1"

                    sortTitle21="sort2_pr3_title2"
                    sortTitle22="sort2_pr4_title2"

                    sortTitle31="sort2_pr3_title3"
                    sortTitle32="sort2_pr4_title3"
                />
            );
            break;
        case 'six':
            str = (
                <CommodityChoiceTwo
                    mainShow={this.mainShow}
                    defaultModelInfo={defaultModelInfo}
                    setPicurlBackground={this.setPicurlBackground}
                    setExplosiveInfo={this.setExplosiveInfo}
                    index={[3, 4]}
                    top={742}
                    firstWidth={280}
                    firstHeight={390}
                    secondWidth={304}
                    secondHeight={304}
                    sortId1="sort2_pr1_id"
                    sortId2="sort2_pr2_id"

                    sortIx1="sort2_pr1_ix"
                    sortIx2="sort2_pr2_ix"

                    sortTitle11="sort2_pr1_title1"
                    sortTitle12="sort2_pr2_title1"

                    sortTitle21="sort2_pr1_title2"
                    sortTitle22="sort2_pr2_title2"

                    sortTitle31="sort2_pr1_title3"
                    sortTitle32="sort2_pr2_title3"
                />
            );
            break;
        case 'seven':
            str = (
                <CommodityChoiceFour
                    mainShow={this.mainShow}
                    defaultModelInfo={defaultModelInfo}
                    setExplosiveInfo={this.setExplosiveInfo}
                    setPicurlBackground={this.setPicurlBackground}
                    index={[7, 8, 9, 10]}
                    top={1200}
                    firstWidth={304}
                    firstHeight={304}
                    sortId1="sort2_pr5_id"
                    sortId2="sort2_pr6_id"
                    sortId3="sort2_pr7_id"
                    sortId4="sort2_pr8_id"

                    sortIx1="sort2_pr5_ix"
                    sortIx2="sort2_pr6_ix"
                    sortIx3="sort2_pr7_ix"
                    sortIx4="sort2_pr8_ix"

                    sortTitle11="sort2_pr5_title1"
                    sortTitle12="sort2_pr6_title1"
                    sortTitle13="sort2_pr7_title1"
                    sortTitle14="sort2_pr8_title1"

                    sortTitle21="sort2_pr5_title2"
                    sortTitle22="sort2_pr6_title2"
                    sortTitle23="sort2_pr7_title2"
                    sortTitle24="sort2_pr8_title2"

                    sortTitle31="sort2_pr5_title3"
                    sortTitle32="sort2_pr6_title3"
                    sortTitle33="sort2_pr7_title3"
                    sortTitle34="sort2_pr8_title3"
                />
            );
            break;
        default:
            str = '';
        }
        return str;
    }

    render() {
        const {popping, goBackShow, defaultModelInfo, modelShow, showOrHide} = this.state;
        return (
            <React.Fragment>
                <Row className="template-compile-three back">
                    <Col span={8}>
                        <div className="static">
                            <div>
                                <span>参考模板</span>
                                <span>不可编辑</span>
                            </div>
                            <img src={require('../../../../../../assets/images/summer-three.png')} alt=""/>
                        </div>
                    </Col>
                    <Col span={8}>
                        <ModelThree
                            clickOnShow={this.clickOnShow}
                            defaultModelInfo={defaultModelInfo}
                            chooseColor={this.chooseColor}
                            mainShow={this.mainShow}
                        />
                    </Col>
                    <Col span={8} className="edit-template-right" style={{backgroundColor: '#fff'}}>
                        {showOrHide && this.choiseType(popping)}
                    </Col>
                </Row>
                <div className="edit-template-button">
                    <Button onClick={() => this.setState({goBackShow: true})}>取消</Button>
                    <Button onClick={this.modelSaveDraf}>保存草稿</Button>
                    <Button onClick={this.modelSave}>保存</Button>
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

export default TemplateCompileThree;
