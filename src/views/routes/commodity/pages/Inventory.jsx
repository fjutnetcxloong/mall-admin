/**
 * 商品列表
 */
import {connect} from 'react-redux';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import {Collapse, Form, Skeleton, Card, Row, Col, Select, Button,
    Icon, Tabs, Empty, Checkbox, Switch, Spin} from 'antd';
import * as ActionCreator from '../redux/actions';
import ErrPage from '../../../common/default-page/NoRoot';
import FiltraFrom from '../components/FiltraFrom';
import ListForm from './ListForm';
import HandleModal from '../../../common/handle-modal/HandleModal';
import HandlePage from '../../../common/handle-page/HandlePage';
import '../Commodity.less';
import './Inventory.less';

const {Panel} = Collapse;
const {Option} = Select;
const {TabPane} = Tabs;
const {api} = Configs;
const {warningMsg} = Utils;
class Inventory extends BaseComponent {
    state={
        isFormLoad: true, //筛选表单是否显示骨架
        isTableLoad: true, //商品表格是否显示骨架
        isTableSpin: false, //商品表格是否加载
        isOpen: true, //折叠面板是否展开
        isPick: '', //是否开启到店核销 0是关  1是开
        goodList: [], // 商品列表
        sortOption: [],  //商品分类选项
        groupOption: [], //商品分组选项
        title: '',  //筛选商品名称
        deliveryType: '',  //筛选配送方式
        cateType: '',   //筛选商品分类级别
        cateId: '',   //筛选商品分类ID
        status: '', //筛选商品状态
        groupId: '',  //筛选商品分组ID
        isAdd: true, //表单操作类型：true:新建商品 false:编辑商品
        waiting: false, //是否显示过渡动画
        visible: false, //是否显示新建/编辑商品表单
        page: 1, //当前页码
        pageSize: 20, //每页条数
        pureCount: 0, //无筛选时总条数，只在首次渲染和创建商品后改变，用于无数据时判断能否导出所有、筛选等
        count: -1, //无筛选或当前筛选条件下的总条数,在有涉及到筛选时需重置，用于分页、是否显示空表格等
        length: 0, //无筛选或当前筛选条件下当页数据长度
        singleChecked: [], //当前页选中id数组
        allChecked: false, //当前页是否全选
        indeterminate: false, //当前页是否模糊全选
        checkedList: [], //批量操作选中id数组
        batch: '', //选中批量操作id
        modalVisible: false, //是否显示对话框
        modalProps: {}, //对话框属性
        rowId: '', //当前编辑商品id
        rowData: {}, //当前编辑商品详情
        errPage: false //是否显示无权限缺省页
    };

    componentDidMount() {
        const {isAuth} = this.props;
        //判断是否有商品权限
        if (isAuth) {
            const {location: {search}} = this.props;
            const statusr = search.split('newType=')[1];
            this.getData(statusr);
        } else {
            this.setState({
                errPage: true
            });
        }
    }

    //首次渲染商品列表页面
    getData=(statusr = '0') => {
        const nextStep = () => {
            //关闭骨架屏
            this.setState({
                isFormLoad: false,
                isTableLoad: false
            }, () => {
                if (statusr === '1') {
                    //概况新建商品跳转
                    this.onHandleGoods(true);
                } else if (statusr === '2') {
                    //概况补货商品跳转
                    this.onClear(3);
                }
            });
        };
        Observable.forkJoin(
            this.fetch(api.getAllCategory), //获取商品分类
            this.fetch(api.getAllCommodityGroup), //获取商品分组
            this.getGoodListURL() //获取商品列表
        ).subscribe(
            (ary) => {
                ary.forEach((res, index) => {
                    const {initAuth, isAuth} = this.props;
                    if (isAuth) {
                        if (res && res.status === 0) {
                            if ((res.data.status && res.data.status === 1) || res.cer_type === '0') {
                                initAuth(false);
                                this.setState({
                                    errPage: true
                                });
                            } else {
                                this.dataHandle(index, res);
                            }
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

    //获取商品列表
    getGoodListURL = () => {
        const {page, pageSize, count, title, deliveryType, status,
            cateType, cateId, groupId} = this.state;
        return this.fetch(api.getCommodity, {
            data: {
                page,
                pageSize,
                count,
                ...!!title && {title},
                delivery_type: deliveryType,
                ...!!cateType && {cate_type: cateType},
                ...!!cateId && {cate_id: cateId},
                pr_status: status,
                ...!!groupId && {group: groupId}
            }
        });
    }

    //请求数据处理函数
    dataHandle = (index, {data, ...res}) => {
        switch (index) {
        case 0:
            //处理商品分类数据
            this.setState({
                sortOption: this.handleSortOption(data, 1)
            });
            break;
        case 1:
            //保存商品分组数据
            this.setState({
                groupOption: data
            });
            break;
        case 2: {
            //保存商品列表数据
            const {checkedList, pureCount} = this.state;
            //翻页后判断当前页是否有选中项
            const result = data.filter(item => checkedList.indexOf(item.id) !== -1);
            this.setState({
                isTableSpin: false,
                isPick: res.if_self,
                goodList: data,
                ...pureCount === 0 && {pureCount: parseInt(res.count, 10)},
                count: parseInt(res.count, 10),
                length: data.length,
                singleChecked: result,
                allChecked: result.length !== 0 && (result.length === data.length),
                indeterminate: result.length !== 0 && !(result.length === data.length)
            }, () => {
                const {initShopType, shopType} = this.props;
                if (shopType === '') {
                    initShopType(res.cer_type);
                }
            });
            break;
        }
        default: break;
        }
    }

    //格式化分类选项(三级)
    handleSortOption=(data, type) => {
        if (data.length > 0 && type) {
            const arr = data.map(v => ({
                value: v[`id${type}`],
                label: v.cate_name,
                ...type !== 3 && {children: this.handleSortOption(v[`cate${type + 1}`], type + 1)}
            }));
            return arr;
        }
        return [];
    }

    //点击折叠面板回调
    onCollapse=() => {
        this.setState(prevState => ({
            isOpen: !prevState.isOpen
        }));
    };

    //点击筛选回调
    onFiltrate = (values) => {
        const {pureCount} = this.state;
        if (pureCount === 0) {
            warningMsg('请创建商品');
            return;
        }
        const {title, type, cate, status, group} = values;
        this.setState({
            page: 1,
            count: -1,
            title: title || '',
            deliveryType: type,
            ...cate && {
                cateType: cate.length,
                cateId: parseInt(cate[cate.length - 1], 10)
            },
            status,
            ...group && {groupId: parseInt(group, 10)},
            isTableSpin: true
        }, () => {
            this.getGoodList();
        });
    };

    //不传key：清空筛选条件
    //传key：切换标签页并清空筛选
    onClear = (key) => {
        const {pureCount} = this.state;
        if (pureCount === 0) {
            warningMsg('请创建商品');
            return;
        }
        const tabKey = (key === '' ? key : parseInt(key, 10));
        this.setState({
            ...key ? {status: tabKey} : {status: ''},
            title: '',
            deliveryType: '',
            cateType: '',
            cateId: '',
            groupId: '',
            page: 1,
            count: -1,
            isTableSpin: true
        }, () => {
            const {form: {resetFields}} = this.props;
            resetFields();
            this.getGoodList();
        });
    }

    //更新商品列表
    getGoodList = () => {
        this.getGoodListURL().subscribe(res => {
            if (res && res.status === 0) {
                this.dataHandle(2, res);
            } else {
                this.setState({
                    isTableSpin: false,
                    singleChecked: [],
                    allChecked: false,
                    indeterminate: false,
                    checkedList: []
                });
            }
        });
    }

    //创建商品/编辑商品
    onHandleGoods=(type, id) => {
        this.setState({
            isAdd: type,
            waiting: true
        }, () => {
            const url = (type ? this.getDraft() : this.getDetails(id));
            url.subscribe(res => {
                if (res && res.status === 0) {
                    //有缓存draft为对象，无缓存draft为空数组；编辑详情为对象
                    const data = res.data.draft || res.data;
                    if (type && !Array.isArray(data)) {
                        console.log('新建且有缓存');
                        const use = (isUse) => {
                            this.setState({
                                visible: true,
                                modalVisible: false,
                                modalProps: {},
                                ...isUse && {rowData: data}
                            });
                        };
                        const footer = (
                            <div>
                                <Button onClick={() => use(false)}>否</Button>
                                <Button type="primary" onClick={() => use(true)}>是</Button>
                            </div>
                        );
                        this.setState({
                            waiting: false,
                            modalVisible: true,
                            modalProps: {
                                title: '确认框',
                                content: '是否使用上次未保存的商品信息？',
                                footer,
                                closable: false
                            }
                        });
                    } else {
                        console.log('编辑或新建无缓存');
                        this.setState({
                            visible: true,
                            waiting: false,
                            ...!type && {
                                rowId: id,
                                rowData: data
                            }
                        });
                    }
                } else {
                    this.setState({
                        waiting: false
                    });
                }
            });
        });
    }

    //获取缓存
    getDraft=() => this.fetch(api.getCommodityDraft)

    //获取待编辑商品详情
    getDetails=(id) => this.fetch(api.getCommodityDetail, {data: {id}})

    //保存并提交表单成功回调
    confimForm=() => {
        const {isAdd} = this.state;
        this.setState(prevState => ({
            visible: false,
            rowData: {},
            ...!isAdd && {rowId: ''},
            page: 1,
            ...(isAdd && prevState.pureCount === 0) && {pureCount: prevState.pureCount + 1}, //创建第一个商品时+1
            count: -1,
            isTableSpin: true
        }), () => {
            this.getGoodList();
            window.scrollTo(0, 0);
        });
    }

    //关闭新建/编辑表单
    closeForm=() => {
        const {isAdd} = this.state;
        this.setState({
            visible: false,
            rowData: {},
            ...!isAdd && {rowId: ''}
        }, () => {
            window.scrollTo(0, 0);
        });
    }

    //点击查看库存回调
    showGoodsSku = ({id, ...item}) => {
        const footer = (
            <Button type="primary" onClick={this.closeModal}>确定</Button>
        );
        this.setState({
            waiting: true
        }, () => {
            this.fetch(api.getCommoditySku, {
                data: {
                    pr_id: id
                }
            }).subscribe(res => {
                if (res && res.status === 0) {
                    this.setState({
                        waiting: false,
                        modalVisible: true,
                        modalProps: {
                            width: 912,
                            isStyle: true,
                            title: '规格库',
                            content: this.showContent(res.data, id, item),
                            footer,
                            onCancel: this.closeModal
                        }
                    });
                } else {
                    this.setState({
                        waiting: false
                    });
                }
            });
        });
    }

    //渲染库存展示对话框内容
    showContent = (data, id, {title, picpath, pr_no: no, num_stock: total}) => {
        const describe = ['规格编码', '商品价格', '划线价格', '折扣', '记账量', '库存'];
        return (
            <div className="specification">
                <div className="specification-trade-box">
                    <div>
                        <img src={picpath} alt=""/>
                        <span>{title}</span>
                    </div>
                    <div>商品编号：{no}</div>
                </div>
                <div className="specifications-models">
                    <div className="colour">{data[0].property_name1}</div>
                    {!!data[0].property_name2 && <div className="divide">{data[0].property_name2}</div>}
                    {!!data[0].property_name3 && <div className="divide">{data[0].property_name3}</div>}
                    {
                        describe.map(item => (
                            <div className="divide" key={item}>{item}</div>
                        ))
                    }
                </div>
                {
                    data.map(item => (
                        <div className="specifications-message" key={item.sku_id}>
                            <div className="colour">
                                <div className="public-height">{item.values_name1}</div>
                            </div>
                            {!!item.values_name2 && (
                                <div className="divide">
                                    <div className="public-height">{item.values_name2}</div>
                                </div>
                            )}
                            {!!item.values_name3 && (
                                <div className="divide">
                                    <div className="public-height">{item.values_name3}</div>
                                </div>
                            )}
                            <div className="divide">
                                <div className="public-height">{item.sku_no}</div>
                            </div>
                            <div className="divide">
                                <div className="public-height">¥{item.price}</div>
                            </div>
                            <div className="divide">
                                <div className="public-height">¥{item.original_price}</div>
                            </div>
                            <div className="divide">
                                <div className="public-height">{item.discount}折</div>
                            </div>
                            <div className="divide">
                                <div className="public-height">{item.deposit}</div>
                            </div>
                            <div className="divide">
                                <div className={`public-height ${item.stock < 11 ? 'stock-error-color' : ''}`}>{item.stock}件</div>
                            </div>
                        </div>
                    ))
                }
                <div className="batch-box">
                    <div className="batch">
                        <Button
                            type="primary"
                            onClick={() => this.setState({
                                //关闭规格库
                                modalVisible: false,
                                modalProps: {}
                            }, () => {
                                this.onHandleGoods(false, id);
                            })
                            }
                        >编辑
                        </Button>
                    </div>
                    <div className="total">总库存：{total}件</div>
                </div>
            </div>
        );
    };

    //关闭规格库
    closeModal = () => {
        this.setState({
            modalVisible: false,
            modalProps: {}
        });
    }

    //改变每页条数回调
    onShowSizeChange = (current, size) => {
        const {count, pageSize} = this.state;
        const res = (count <= pageSize && count <= size);
        //总条数小于等于修改前和修改后的每页条数，不请求接口
        this.setState({
            page: current,
            pageSize: size,
            ...res || {isTableSpin: true}
        }, () => {
            res || this.getGoodList();
        });
    }

    //改变页码回调
    onChangePage = (page) => {
        //跳页返回页码等于当前页码，不请求接口
        const {page: current} = this.state;
        const res = (page === current);
        this.setState({
            page,
            ...res || {isTableSpin: true}
        }, () => {
            res || this.getGoodList();
        });
    }

    //点击全选回调
    onTotalChecked = (e) => {
        this.setState({
            allChecked: e.target.checked,
            indeterminate: false
        }, () => {
            const {allChecked, goodList} = this.state;
            if (allChecked) {
                const arr = goodList.map(({id}) => id);
                this.setState(prevState => ({
                    singleChecked: arr,
                    checkedList: Array.from(new Set([...prevState.checkedList, ...arr]))
                }), () => {
                    console.log('选中全选影响选中id数组', arr, this.state.checkedList, this.state.singleChecked);
                });
            } else {
                const {checkedList} = this.state;
                goodList.map(({id}) => {
                    const index = checkedList.indexOf(id);
                    if (index !== -1) {
                        checkedList.splice(index, 1);
                    }
                });
                this.setState({
                    checkedList,
                    singleChecked: []
                }, () => {
                    console.log('取消全选影响选中id数组', this.state.checkedList, this.state.singleChecked);
                });
            }
        });
    };

    //点击单选回调
    onSingleChecked = (id) => {
        this.setState(prevState => ({
            singleChecked: prevState.singleChecked.indexOf(id) !== -1 ? prevState.singleChecked.filter(cid => cid !== id) : [...prevState.singleChecked, id],
            checkedList: prevState.checkedList.indexOf(id) !== -1 ? prevState.checkedList.filter(cid => cid !== id) : [...prevState.checkedList, id]
        }), () => {
            const {length, singleChecked, checkedList} = this.state;
            if (singleChecked.length !== 0) {
                const result = (length === singleChecked.length);
                this.setState({
                    allChecked: result,
                    indeterminate: !result
                });
                console.log('单选影响选中id数组', checkedList, singleChecked);
            }
        });
    };

    //选择批量操作回调
    onSelectBatch = (value) => {
        console.log('选择批量操作', value);
        this.setState({
            batch: value
        });
    }

    //确认批量操作回调
    onConfimBatch = () => {
        const {batch, checkedList, pureCount} = this.state;
        const callBack = new Map([
            ['1', {status: '1', id: checkedList}],
            ['2', {status: '0', id: checkedList}],
            ['3', {status: '1', id: []}],
            ['4', {status: '0', id: []}]
        ]);
        const {status, id} = callBack.get(batch);
        if (batch === '1' || batch === '2') {
            //上下架选中
            if (checkedList.length === 0) {
                warningMsg('请选择商品');
                return;
            }
            this.changeSwitch(status, id);
        } else {
            //上下架所有
            if (pureCount === 0) {
                warningMsg('请创建商品');
                return;
            }
            this.changeSwitch(status, id);
        }
    }

    //渲染单件商品状态
    showGoodsStatus=({status, id, return_reason: reason}) => {
        const renderStatus = new Map([
            ['0', (
                <div>
                    <Switch checked={status === '1'} onChange={() => this.changeSwitch('1', [id])}/>
                    <div>已下架</div>
                </div>
            )],
            ['1', (
                <div>
                    <Switch checked={status === '1'} onChange={() => this.changeSwitch('0', [id])}/>
                    <div>已上架</div>
                </div>
            )],
            ['2', (
                <div className="goods-error-color">已封锁</div>
            )],
            ['4', (
                <div className="goods-warning-color">审核中</div>
            )],
            ['5', (
                <div>
                    <div className="goods-error-color">已退回</div>
                    <div className="goods-error-reason">原因：{reason}</div>
                </div>
            )]
        ]);
        return renderStatus.get(status);
    }

    //改变上/下架状态
    changeSwitch = (status, id) => {
        this.setState({
            isTableSpin: true
        }, () => {
            this.fetch(api.upCommodityStatus, {
                data: {
                    id,
                    status,
                    ...id.length === 0 ? {if_all: 1} : {if_all: 0} //1-全部 0-非全部
                }
            }).subscribe(res => {
                if (res && res.status === 0) {
                    this.setState({
                        page: 1,
                        count: -1
                    }, () => {
                        this.getGoodList();
                    });
                } else {
                    this.setState({
                        isTableSpin: false
                    });
                }
            });
        });
    }

    render() {
        const {form} = this.props;
        const {isFormLoad, isTableLoad, isTableSpin, isOpen, visible, goodList, isAdd, waiting,
            sortOption, groupOption, status, page, pageSize, count,  allChecked, indeterminate,
            isPick, checkedList, batch, modalVisible, modalProps, rowData, rowId, errPage} = this.state;
        //顶部分类
        const tabs = [
            {name: '全部', id: ''},
            {name: '已上架', id: 1},
            {name: '已下架', id: 0},
            {name: '库存不足', id: 3}
        ];
        //批量操作
        const methods = [
            {title: '上架选中商品', id: '1'},
            {title: '下架选中商品', id: '2'},
            {title: '上架全部商品', id: '3'},
            {title: '下架全部商品', id: '4'}
        ];
        return (
            <React.Fragment>
                {
                    !errPage ? (
                        <div className="page commodity">
                            {visible
                                ? (
                                    <ListForm
                                        isAdd={isAdd} //当前表单操作类型
                                        rowData={rowData} //缓存或编辑详情
                                        rowId={rowId} //编辑id
                                        sortOption={sortOption} //商品分类
                                        groupOption={groupOption} //商品分组
                                        isPick={isPick} //是否开启到店核销
                                        onConfim={this.confimForm} //提交表单成功回调
                                        onCancel={this.closeForm} //取消表单回调
                                    />
                                )
                                : (
                                    <React.Fragment>
                                        <Spin spinning={waiting}>
                                            <Collapse
                                                className="commodity-top"
                                                defaultActiveKey={['1']}
                                                expandIconPosition="right"
                                                onChange={this.onCollapse}
                                                expandIcon={({isActive}) => <Icon type="right" rotate={isActive ? 270 : 90}/>}
                                            >
                                                <Panel className="list-form-select" header="筛选查询" key="1" extra={isOpen ? '收起筛选' : '展开筛选'}>
                                                    <FiltraFrom
                                                        form={form}
                                                        isFormLoad={isFormLoad}
                                                        isTableSpin={isTableSpin}
                                                        sortOption={sortOption}
                                                        groupOption={groupOption}
                                                        onFiltrate={this.onFiltrate}
                                                        onClear={this.onClear}
                                                    />
                                                </Panel>
                                            </Collapse>
                                            <Card
                                                className="commodity-table"
                                                bordered={false}
                                            >
                                                <Skeleton active loading={isTableLoad}>
                                                    <Spin spinning={isTableSpin}>
                                                        <div className="establish-commodity">
                                                            <Tabs
                                                            //筛选商品状态为审核中或封锁中时，标签项选择全部，否则等同于筛选
                                                                activeKey={status === 2 || status === 4 ? '' : status.toString()}
                                                                onChange={this.onClear}
                                                                animated={false} //关闭组件自带动画
                                                            >
                                                                {
                                                                    tabs.map(item => (
                                                                        <TabPane tab={item.name} key={item.id}/>
                                                                    ))
                                                                }
                                                            </Tabs>

                                                            <div className="establish-left">
                                                                <Button type="primary" onClick={() => this.onHandleGoods(true)}>创建商品</Button>
                                                                <div className="batch">
                                                                    <Select placeholder="请选择批量操作" onChange={this.onSelectBatch}>
                                                                        {
                                                                            methods.map(item => (
                                                                                <Option key={item.id}>{item.title}</Option>
                                                                            ))
                                                                        }
                                                                    </Select>
                                                                    <Button
                                                                        type="primary"
                                                                        {...batch ? {onClick: this.onConfimBatch} : {onClick: () => warningMsg('请选择批量操作')}}
                                                                    >
                                                                        确认
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="title-panel">
                                                            <Row className="tab-bar">
                                                                <Col span={6} className="tab-commodity-information">
                                                                    <Checkbox
                                                                        indeterminate={indeterminate}
                                                                        onChange={this.onTotalChecked}
                                                                        checked={allChecked}
                                                                    >
                                                                        选中当页
                                                                    </Checkbox>
                                                                    <span>商品信息</span>
                                                                </Col>
                                                                <Col span={3}>类别</Col>
                                                                <Col span={2}>库存</Col>
                                                                <Col span={2}>单价</Col>
                                                                <Col span={2}>记账量</Col>
                                                                <Col span={3}>配送方式</Col>
                                                                <Col span={4}>状态</Col>
                                                                <Col span={2}>操作</Col>
                                                            </Row>
                                                        </div>
                                                        {
                                                            count < 1
                                                                ? (<Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>) //渲染空数据
                                                                : goodList && goodList.map((item, index) => (
                                                                    <Row key={item.id}>
                                                                        <div className="oddNumbers">
                                                                            <Checkbox
                                                                                onChange={() => this.onSingleChecked(item.id)}
                                                                                checked={checkedList.indexOf(item.id) !== -1}
                                                                            >
                                                                                商品号:{item.pr_no}
                                                                            </Checkbox>
                                                                            <div className="edit-session">
                                                                                <span>编辑时间：{item.edtdate}</span>
                                                                            </div>
                                                                        </div>
                                                                        <Row className="commodity-details">
                                                                            <Col span={1} className="serial-number">{(page - 1) * pageSize + (index + 1)}</Col>
                                                                            <Col span={5} className="goods-message">
                                                                                <img src={item.picpath} alt=""/>
                                                                                <span>{item.title}</span>
                                                                            </Col>
                                                                            <Col span={3} className="description">
                                                                                <div>
                                                                                    <div>{item.cate1}</div>
                                                                                    <div>{item.cate2}</div>
                                                                                    <div>{item.cate3}</div>
                                                                                </div>
                                                                            </Col>
                                                                            <Col span={2} className="inventory">
                                                                                <div>
                                                                                    {
                                                                                        item.min_stock < 11 ? <p className="stock-warning-color">库存不足</p>
                                                                                            : <p>{item.num_stock}</p>
                                                                                    }
                                                                                    <Button
                                                                                        type="link"
                                                                                        onClick={
                                                                                            () => this.showGoodsSku(item)
                                                                                        }
                                                                                    >
                                                                                        查看
                                                                                    </Button>
                                                                                </div>
                                                                            </Col>
                                                                            <Col span={2}>¥{item.price}</Col>
                                                                            <Col span={2}>{item.deposit}</Col>
                                                                            <Col span={3}>
                                                                                <div>
                                                                                    {
                                                                                        item.delivery_type.map(v => (
                                                                                            <div key={v}>{v}</div>
                                                                                        ))
                                                                                    }
                                                                                    <div>{item.express_type}</div>
                                                                                </div>
                                                                            </Col>
                                                                            <Col span={4}>
                                                                                {this.showGoodsStatus(item)}
                                                                            </Col>
                                                                            <Col span={2} className="compile">
                                                                                <Button type="link" onClick={() => this.onHandleGoods(false, item.id)}>编辑</Button>
                                                                            </Col>
                                                                        </Row>
                                                                    </Row>
                                                                ))
                                                        }
                                                        <HandlePage
                                                            page={page}
                                                            size={pageSize}
                                                            count={count}
                                                            onShowSizeChange={this.onShowSizeChange}
                                                            onChangePage={this.onChangePage}
                                                        />
                                                    </Spin>
                                                </Skeleton>
                                            </Card>
                                        </Spin>
                                    </React.Fragment>
                                )}
                            {modalVisible && (
                                <HandleModal
                                    visible={modalVisible}
                                    {...modalProps}
                                />
                            )}
                        </div>
                    ) : (<ErrPage/>)
                }
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    //获取对应reducer
    const commodity = state.get('commodity');
    //获取对应state
    return {
        isAuth: commodity.get('isAuth'),
        shopType: commodity.get('shopType')
    };
};

const mapDispatchToProps = {
    initAuth: ActionCreator.initAuth,
    initShopType: ActionCreator.initShopType
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Inventory));
