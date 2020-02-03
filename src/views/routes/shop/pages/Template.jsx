import React from 'react';
import {Button, Row, Col, Modal, Skeleton} from 'antd';
import ErrPage from '../../../common/default-page/NoRoot';
import '../index.less';
import './Template.less';
// import DefaultPage from '../../../common/default-page';

const {api} = Configs;
const {warningMsg, successMsg} = Utils;
class Template extends BaseComponent {
    state = {
        skeleton: true, //内容骨架
        visible: false,
        nowModel: '', //当前使用模板 id
        allModel: [], //所有使用模板
        title: '', //当前模板使用标题
        errPage: false
    }

    componentDidMount() {
        this.getList();
    }

    //获取所有模板
    getList = () => {
        this.fetch(api.myModel).subscribe(res => {
            if (res.status === 0) {
                if (res.data.status === 1) {
                    this.setState({
                        errPage: true
                    });
                }
                this.setState({
                    nowModel: res.data.my_model,
                    allModel: res.data.pics,
                    skeleton: false
                });
            } else {
                this.setState({
                    skeleton: false
                });
            }
        });
    }

    //预览图片开
    showModal = () => {
        this.setState({
            visible: true
        });
    };

    //预览图片关
    handleCancel = e => {
        this.setState({
            visible: false
        });
    };

    //点击模板编辑
    templateEdit = (num) => {
        // FIXME：用Map对象来优化
        //已优化
        const url = new Map([
            [1, '/shop/template-compile-one'],
            [2, '/shop/template-compile-two'],
            [3, '/shop/template-compile-three'],
            [4, '/shop/template-compile-four'],
            [5, '/shop/template-compile-five']
        ]);
        this.props.history.push(url.get(num));
    }

    //预览
    showBigModel = (onOff, img) => {
        //FIXME： 代码需要优化
        //已优化
        this.setState({
            modelPic: img || '',
            showPrimary: onOff
        });
    }

    //点击不使用模板
    noUseModel = () => {
        const {nowModel} = this.state;
        if (!nowModel) {
            warningMsg('您当前没有正在使用的模板');
        } else {
            this.fetch(api.unModel, {data: {mol_id: nowModel}})
                .subscribe(res => {
                    if (res.status === 0) {
                        successMsg('操作成功');
                        this.getList();
                    }
                });
        }
    }

    //店铺模板
    defaultFormModal = () => {
        const {nowModel, allModel, showPrimary, modelPic, skeleton} = this.state;
        return (
            <div>
                <Skeleton active loading={skeleton}>
                    <div className="template-top">
                        <p>店铺模板</p>
                        <div className="current">
                            <div>当前使用模板：{nowModel}</div>
                            <Button type="primary" onClick={this.noUseModel}>不使用模板</Button>
                        </div>
                    </div>
                </Skeleton>
                <Skeleton active loading={skeleton}>
                    <Row className="template-box">
                        {
                            allModel.length > 0 && allModel.map((item, index) => (
                                <Col key={item.id} span={8} className="template-one">
                                    <span className="template-one-top">
                                        <span>模板{index + 1}</span>
                                        <span>{item.title}</span>
                                    </span>
                                    <img src={item.urlx} alt=""/>
                                    <div className="examine-set">
                                        <Button type="primary" onClick={() => this.showBigModel(true, item.url)}>预览</Button>
                                        {nowModel === item.id ? <Button type="primary" onClick={() => this.templateEdit(item.id)}>编辑</Button> : <Button type="primary" onClick={() => this.templateEdit(item.id)}>立即应用</Button>}
                                    </div>
                                </Col>
                            ))
                        }
                        <Modal
                            visible={showPrimary}
                            onCancel={() => this.showBigModel(false)}
                            closable={false}
                            footer={null}
                            className="preview"
                        >
                            <img src={modelPic} style={{width: '100%'}} alt=""/>
                            <div onClick={() => this.showBigModel(false)} className="icon icon-cross"/>
                        </Modal>
                    </Row>
                </Skeleton>
            </div>
        );
    }

    render() {
        const {errPage} = this.state;
        return (
            <div className="shop-setting">
                <div className="page template-container">
                    {
                        !errPage ? this.defaultFormModal() : <ErrPage/>
                    }
                </div>
            </div>
        );
    }
}

export default Template;
