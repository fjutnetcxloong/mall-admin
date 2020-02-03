//我的职工 xwb 2019.8.18

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import React from 'react';
import {Row, Col, Card, Button, Table, Switch, Input, Modal, Form, notification, InputNumber, Skeleton} from 'antd';
import Pagenation from '../../myAsset/components/PageNation';
import ErrPage from '../../../common/default-page/NoRoot';
import '../index.less';
import './Employee.less';
import {showInfo} from '../../../../utils/mixin';

// FIXME: 认真再重新优化，很多爆红，逻辑也不清晰

const {api} = Configs;
const {MESSAGE: {MyEmployee}} = Constants;
const {warningMsg, successMsg, tengXunIm} = Utils;
//表单布局
const formItemLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 5}
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 19}
    }
};

class Employee extends BaseComponent {
    state = {
        skeleton: true, //内容骨架
        modal1Visible: false, //关闭员工号的弹框判断
        modal2Visible: false, //修改密码的弹框控制
        modal3Visible: false, //申请员工号的弹窗
        modal4Visible: false, //申请失败的弹窗
        qrCodeShow: false, //二维码弹框
        loading: false,
        employNum: 0, //职工数
        failedPassMsg: '', //申请失败的原因
        page: 1,
        pagesize: 10,
        pageCount: -1,
        totalPage: 0, //总数据量
        dataList: [], //列表结构
        closeOnoff: 1, //员工状态 关闭或者开启 1表示开启，2表示关闭
        errPage: false,
        pageNow: 1
    };

    temp = {
        timer: null
    }

    componentDidMount() {
        this.getData();
    }

    getData=() => {
        const nextStep = () => {
            //关闭骨架屏
            this.setState({
                skeleton: false
            });
        };
        Observable.forkJoin(
            this.isEmployeesURL(),
            this.getListURL()
        ).subscribe(
            (ary) => {
                console.log('forkJoin结果', ary);
                ary.forEach((res, index) => {
                    if (res && res.status === 0) {
                        if (res.data.status === 1) {
                            this.setState({
                                errPage: true
                            });
                        } else {
                            this.dataHandle(index, res);
                        }
                    }
                });
                nextStep();
            }, (err) => {
                console.log('forkJoin错误', err);
                nextStep();
            }
        );
    }

    // 请求数据处理函数
    dataHandle = (index, res) => {
        switch (index) {
        case 0:
            //处理获取列表数据
            this.isEmployees(res);
            break;
        case 1:
            //表格头部数据
            this.setList(res);
            break;
        default:
            break;
        }
    }

    //判断是否有员工申请，和目前已有员工数量
    isEmployeesURL = () => this.fetch(api.employeesAudited);

    //判断之前的申请是否成功
    isEmployees = (res) => {
        if (res && res.status === 0) {
            if (res.data.yes === 1) { // yes状态 1 申请失败，2申请中 ,  0申请成功
                this.setState({
                    modal4Visible: true,
                    failedPassMsg: res.data.message
                });
            }
            this.setState({//设置当前职工数的数量
                employNum: res.data.data.staffNum
            });
        }
    }

    //获取列表
    getListURL = () => {
        this.setState({
            loading: true
        });
        const {page, pageCount, pagesize} = this.state;
        return this.fetch(api.myEmployeeList, {data: {page, page_count: pageCount, pagesize}});
    }

    getList = (types) => {
        this.getListURL(types).subscribe((res) => {
            if (res && res.status === 0) {
                this.setList(res);
            }
        });
    }

    setList = (res) => {
        this.setState({
            loading: false
        });
        if (res && res.status === 0) {
            this.setState({
                totalPage: res.data.total,
                pageCount: res.data.page_count,
                dataList: res.data.data
            });
        }
    }


    //表格头部
    columns = [
        {
            title: '员工UID',
            dataIndex: 'no',
            key: 'none'
        },
        {
            title: '真实姓名',
            dataIndex: 'realname',
            key: 'realname'
        },
        // {
        //     title: '密码',
        //     dataIndex: 'password',
        //     render: text => <Input.Password style={{width: 100}} value={text}/>,
        //     className: 'password'
        // },
        {
            title: '二维码',
            dataIndex: 'qrcode',
            key: 'qrcode',
            render: text => <Button type="link" onClick={() => this.showQrCode(text)}>查看</Button>
        },
        {
            title: '操作',
            dataIndex: 'status',
            key: 'status',
            render: (text, val) => (
                <div>
                    <Switch onClick={() => this.setModal1Visible(true, val.id)} checked={text === '1'}/>
                    <Button onClick={() => this.setModal2Visible(true, val.id)} type="link">修改</Button>
                </div>
            )
        },
        {
            title: '联系',
            dataIndex: 'no',
            key: 'no',
            className: 'last-column',
            render: (text, data) => <Button type="link" className="icon" onClick={() => tengXunIm(1, data.no, 2, data.nickname, data.avatarUrl)}>发起聊天</Button>
        }
    ];

    //吊起或关闭 申请员工号 的弹框
    setModal3Visible(modal3Visible) {
        this.setState({
            modal3Visible,
            modal4Visible: false //这里设置这个是为了，当吊起的是失败弹框的时候，需要重新申请，则会进入这个函数，也需要将申请失败的弹框给关闭
        });
    }

    //申请员工号提交按钮
    handleOk = () => {
        const {quantityNum} = this.state;
        if (quantityNum > 0) { //输入的申请数量
            this.fetch(api.addEmployee, {data: {num: quantityNum}})
                .subscribe(res => {
                    if (res && res.status === 0) {
                        this.setState({
                            loading: true
                        });
                        this.timer = setTimeout(() => {
                            this.setState({loading: false, modal3Visible: false});
                            this.openNotification();
                        }, 3000);
                        this.setState({
                            quantityNum: 0
                        });
                    }
                });
        } else {
            warningMsg('请输入申请员工数');
        }
    };

    //申请成功弹窗
    openNotification = () => {
        notification.open({
            message: '申请提交成功',
            description: '您的申请已提交，审核结果在3个工作日内公布'
        });
        clearTimeout(this.temp.timer); //清除定时器
    }

    //申请员工号
    applyEmployeeNumber = (modal3Visible) => {
        const {employNum} = this.state;
        if (employNum < 100) {
            this.setState({
                modal3Visible,
                modal4Visible: false
            });
        } else {
            warningMsg('员工数已达上限');
        }
    }

    //调起或关闭弹窗  (关闭员工号)
    setModal1Visible(modal1Visible, id) {
        const {dataList} = this.state;
        const arr = dataList;
        const ones = arr.find(item => item.id === id);
        this.setState({
            closeId: id || '',
            modal1Visible: id ? ones.status === '1' : false
        }, () => {
            if (id && ones.status !== '1') { this.mustClose() }
        });
    }

    //确定关闭员工号
    mustClose = () => {
        const {closeId, dataList} = this.state;
        const ones = dataList.find(item => item.id === closeId);
        this.fetch(api.modifystaffstatus, {data: {id: closeId, status: ones.status === '1' ? '2' : '1'}})
            .subscribe(res => {
                if (res && res.status === 0) {
                    successMsg('操作成功');
                    this.setState({
                        closeId: '',
                        modal1Visible: false
                    }, () => {
                        this.getList();
                    });
                }
            });
    }

    //操作，修改密码的弹框，弹出或者关闭信息
    setModal2Visible(modal2Visible, id) {
        this.setState({
            editWordId: id || '',
            modal2Visible
        });
    }

    //修改密碼
    editPass = () => {
        const {editWordId} = this.state;
        let name = '';
        let passWord = '';
        this.props.form.validateFields((err, values) => {
            if (values.userName) {
                name = values.userName;
            }
            if (!values.userName && !values.password) {
                warningMsg('请输入修改内容');
            } else {
                if (values.password === values.passAgain) {
                    passWord = values.password;
                } else if (values.password) {
                    warningMsg('两次输入的密码不一致');
                    return;
                }
                this.fetch(api.modifystaffpwd, {data: {status: 1, id: editWordId, pwd: passWord, realname: name, staff_status: 1}})
                    .subscribe(res => {
                        if (res.status === 0) {
                            successMsg('修改成功');
                            this.setState({
                                modal2Visible: false
                            });
                            this.getList();
                            //清除数据
                            this.props.form.resetFields();
                        }
                    });
            }
        });
    }

    //申请员工号失败
    setModal4Visible(modal4Visible) {
        this.setState({modal4Visible});
    }

    //打开和关闭二维码弹框
    showQrCode = (qrCode) => {
        this.setState({
            qrCodeImg: qrCode || '',
            qrCodeShow: !!qrCode
        });
    }

    //点击页码进行切换
    pageChange = (data) => {
        this.setState({
            page: data,
            pageNow: data
        }, () => {
            this.getList();
        });
    }

    //页面的如20条切换的时候
    pageSizeChange = (pagesize, num) => {
        this.setState({
            pagesize: num,
            pageNow: 1
        }, () => {
            this.getList();
        });
    }

    //进入职工群
    goToImGroud = () => {
        this.fetch(api.getGroupID).subscribe(res => {
            if (res && res.status === 0) {
                if (res.data.GroupId) {
                    tengXunIm(1, res.data.GroupId, 5, res.data.Name, res.data.FaceUrl);
                } else {
                    showInfo('暂无群组');
                }
            }
        });
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {employNum, failedPassMsg, pagesize, errPage, dataList, pageNow, qrCodeShow, qrCodeImg, totalPage, loading, skeleton} = this.state;
        return (
            <div className="shop-setting">
                <React.Fragment>
                    {
                        !errPage ? (
                            <div className="page shop-setting">
                                <Row>
                                    <Col span={24}>
                                        <div className="employee-container">
                                            <Skeleton active loading={skeleton}>
                                                <div className="employee-top">
                                                    <Card title="我的职工">
                                                        <div>
                                                            <div>
                                                                <span>当前职工数：{employNum}</span>
                                                                <span style={{marginRight: '1.5rem'}}>(一次最多申请30个)</span>
                                                            </div>
                                                            <div className="employee-btn">
                                                                <Button onClick={() => this.setModal3Visible(true)} type="primary">申请员工号</Button>
                                                            </div>
                                                        </div>
                                                    </Card>
                                                </div>
                                            </Skeleton>
                                            <Skeleton active loading={skeleton}>
                                                <div className="employee-bottom">
                                                    {/*表格组件 */}
                                                    <Table
                                                        columns={this.columns}
                                                        dataSource={dataList}
                                                        bordered
                                                        rowKey="id"
                                                        title={() => <Button type="primary" onClick={this.goToImGroud}>进入职工群</Button>}
                                                        pagination={false}
                                                        loading={loading}
                                                    />
                                                    {
                                                        totalPage > 0 ? (
                                                            <Pagenation
                                                                size={pagesize}
                                                                pageNow={pageNow}
                                                                total={totalPage}
                                                                pageChange={this.pageChange}
                                                                pageSizeChange={this.pageSizeChange}
                                                            />
                                                        ) : null
                                                    }
                                                    {/*弹出对话框 */}
                                                    <div>
                                                        {/*关闭员工弹出层*/}
                                                        <Modal
                                                            title="关闭员工号"
                                                            centered
                                                            visible={this.state.modal1Visible}
                                                            onOk={this.mustClose}
                                                            onCancel={() => this.setModal1Visible(false)}
                                                        >
                                                            <p style={{textAlign: 'center'}}>{MyEmployee.close_employeeID_null}</p>
                                                        </Modal>
                                                        {/*修改信息弹出层*/}
                                                        <Modal
                                                            title="修改信息"
                                                            centered
                                                            visible={this.state.modal2Visible}
                                                            onOk={this.editPass}
                                                            onCancel={() => this.setModal2Visible(false)}
                                                        >
                                                            <Form {...formItemLayout}>
                                                                <Form.Item label="姓名">
                                                                    {getFieldDecorator('userName')(<Input placeholder="请输入您的名字"/>)}
                                                                </Form.Item>
                                                                <Form.Item label="密码">
                                                                    {getFieldDecorator('password')(<Input type="password" placeholder="请输入密码"/>)}
                                                                </Form.Item>
                                                                <Form.Item label="密码">
                                                                    {getFieldDecorator('passAgain')(<Input type="password" placeholder="请再次输入密码"/>)}
                                                                </Form.Item>
                                                            </Form>
                                                        </Modal>
                                                        {/*申请员工号弹出层 */}
                                                        <Modal
                                                            className="apply-emplpyees"
                                                            visible={this.state.modal3Visible}
                                                            title="申请员工号"
                                                            centered
                                                            onCancel={() => this.setModal3Visible(false)}
                                                            footer={[
                                                                <Button type="primary" loading={loading} onClick={this.handleOk}>
                                                                    提交
                                                                </Button>
                                                            ]}
                                                        >
                                                            <Form label="员工数" {...formItemLayout}>
                                                                <Form.Item label="员工数">
                                                                    {
                                                                        getFieldDecorator('employeeNum')(<InputNumber className="apply-employee" min={0} max={100 - employNum > 30 ? 30 : 100 - employNum} onChange={(num) => this.setState({quantityNum: num})} placeholder="请输入要申请的员工数量"/>)
                                                                    }
                                                                </Form.Item>
                                                            </Form>
                                                        </Modal>
                                                        {/*申请员工号失败弹出层 */}
                                                        <Modal
                                                            visible={this.state.modal4Visible}
                                                            title="申请失败"
                                                            centered
                                                            onCancel={() => this.setModal4Visible(false)}
                                                            footer={[
                                                                <Button type="primary" onClick={() => this.setModal3Visible(true)}>
                                                                    再次申请
                                                                </Button>
                                                            ]}
                                                        >
                                                            <p>{failedPassMsg}</p>
                                                        </Modal>
                                                        <Modal
                                                            width={240}
                                                            visible={qrCodeShow}
                                                            onCancel={() => this.showQrCode(false)}
                                                            closable={false}
                                                            footer={null}
                                                            className="employee-preview"
                                                        >
                                                            <img src={qrCodeImg} alt=""/>
                                                            <div onClick={() => this.showQrCode(false)} className="icon icon-cross"/>
                                                        </Modal>
                                                    </div>
                                                </div>
                                            </Skeleton>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        ) : (<ErrPage/>)
                    }
                </React.Fragment>
            </div>
        );
    }
}

export default Form.create()(Employee);
