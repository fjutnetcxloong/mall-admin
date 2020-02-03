/**
 * 商品列表新建/编辑表单
 */
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import {Spin, Form, Anchor, Button} from 'antd';
import {BottomButton} from '../../../common/bottom-button/index';
import First from '../components/list-form/First';
import Second from '../components/list-form/Second';
import Third from '../components/list-form/Third';
import Fourth from '../components/list-form/Fourth';
import HandleModal from '../../../common/handle-modal/HandleModal';

const {Link} = Anchor;
const {warningMsg} = Utils;
const {api} = Configs;
let timer;
class ListForm extends BaseComponent {
    state={
        tempOption: {}, //运费模板
        tagsOption: [], //商品标签选项
        unitOption: [], //商品单位选项
        specOption: [], //商品规格选项
        firstOption: [], //规格一属性值选项
        secondOption: [], //规格二属性值选项
        thirdOption: [], //规格三属性值选项
        isError: false, //编辑单元格是否报错
        loading: true, //衔接列表页面的加载动画
        modalVisible: false, //是否显示对话框
        modalProps: {}, //对话框属性
        isRe: false //是否点击刷新模板
    }

    componentDidMount() {
        const {isAdd} = this.props;
        this.initListForm();
        if (isAdd) {
            // 新建表单：每分钟缓存一次
            timer = setInterval(() => {
                this.saveDraft();
            }, 60000);
        }
    }

    componentWillUnmount() {
        clearInterval(timer);
    }

    //初始化表单数据
    initListForm=() => {
        Observable.forkJoin(
            this.getTemplate(), //获取运费模板
            this.fetch(api.getAllCommodityTags), //获取商品标签组
            this.getUnit(), //获取商品单位
            this.getSpec(), //获取商品规格
        ).subscribe(
            (ary) => {
                ary.forEach((res, index) => {
                    if (res && res.status === 0) {
                        this.dataHandle(index, res);
                    }
                });
                this.setState({
                    loading: false
                });
            }, (err) => {
                console.log('forkJoin错误', err);
                //错误时直接关闭表单
                const {onCancel} = this.props;
                onCancel();
            }
        );
    }

    //获取运费模板
    getTemplate=() => this.fetch(api.getAllMailTemplate)

    //获取商品单位
    getUnit=() => this.fetch(api.getCommodityUnit)

    //获取规格
    getSpec=() => this.fetch(api.getCommoditySpec)

    //请求数据处理函数
    dataHandle = (index, {data}) => {
        switch (index) {
        case 0:
            //保存运费模板数据
            this.setState({
                tempOption: data,
                isRe: false
            });
            break;
        case 1:
            //保存商品标签组数据
            this.setState({
                tagsOption: data
            });
            break;
        case 2:
            //保存商品单位数据
            this.setState({
                unitOption: data
            });
            break;
        case 3:
            //保存规格数据
            this.setState({
                specOption: data
            });
            break;
        default: break;
        }
    }

    //触发缓存回调
    saveDraft=() => {
        const {form: {getFieldsValue}} = this.props;
        const {tempOption} = this.state;
        const values = getFieldsValue(); //获取全部控件的值
        console.log('this.fourth.state.inputText', this.fourth.state.inputText);
        const details = this.fourth.state.inputText; //富文本输入内容
        const {
            type, expressSet, expressMoney, invoice,
            validType, days, custom, holiday, name, sortId, group,
            tags, unit, ...value
        } = values;
        const sortName = this.second.state.sortName;
        const stock = this.third.state.total; //总库存
        const hour = value[`hour${type}`];
        const minute = value[`minute${type}`];
        const sku = this.third.state.dataSource;
        //商品类型：1实物商品 2蛋糕烘焙 4电子卡券
        const basic = new Map([
            ['1', {
                ...expressSet && {express_set: expressSet},
                ...expressMoney && {express_money: expressMoney.toString()},
                ...tempOption && {express_model: tempOption.id},
                ...value[`deliveryType${type}`].indexOf('2') !== -1 && {standby_time: `${hour},${minute}`} //备货时间
            }],
            ['2', {
                ...(hour && minute) && {standby_time: `${hour},${minute}`} //备货时间
            }],
            ['4', {
                ...validType && {effective_type: validType}, //有效时间设置 2有效期 3自定义周期
                ...days && {effective_day: parseInt(days, 10)},
                ...(custom && custom.length === 2) && {effective_time: [
                    custom[0].format('YYYY-MM-DD HH:mm'),
                    custom[1].format('YYYY-MM-DD HH:mm')
                ].join(',')},
                if_holiday: holiday //节假日是否可用
            }]
        ]);
        //商品详情参数
        const info = {
            type, //类型
            delivery_type: value[`deliveryType${type}`], //配送方式
            if_invoice: invoice, //是否开发票
            ...name && {title: name}, //名称
            //商品分类ID
            ...(sortId && sortId.length === 3) && {
                cate1_id: sortId[0],
                cate2_id: sortId[1],
                cate3_id: sortId[2],
                //商品分类名称
                cate1: sortName[0],
                cate2: sortName[1],
                cate3: sortName[2]
            },
            ...group && {group}, //分组
            tags: tags ? tags.split(',') : [], //标签组
            ...unit && {unit: unit.key}, //单位
            //sku详情
            sku_info: (sku.length === 0 ? [] : this.initSku(sku)),
            ...!!stock && {stock}, //总库存
            ...details && {details} //详情
        };
        const param = {...basic.get(type), ...info}; //保存商品信息所需参数
        this.onSave(param);
    }

    //格式化sku参数
    initSku=(arr) => {
        const newArr = arr.map(v => ({
            property_name1: v.property_name1,
            property_id1: v.property_id1,
            property_name2: v.property_name2 || '',
            property_id2: v.property_id2 || '',
            property_name3: v.property_name3 || '',
            property_id3: v.property_id3 || '',
            values_name1: v.values_name1,
            values1: v.values1,
            values_name2: v.values_name2 || '',
            values2: v.values2 || '',
            values_name3: v.values_name3 || '',
            values3: v.values3 || '',
            price: v.price,
            original_price: v.original_price,
            discount: v.discount,
            stock: v.stock
        }));
        return newArr;
    }

    // 保存缓存回调
    onSave=(values) => {
        this.fetch(api.addCommodityDraft, {
            data: {
                ...values
            }
        }).subscribe(res => {
            if (res && res.status === 0) {
                console.log('当前内容已缓存');
            }
        });
    }

    //避免点击锚点跳转路由
    handleClick = (e) => {
        e.preventDefault();
    };

    //刷新运费模板
    reTemplate=() => {
        this.setState({
            isRe: true
        }, () => {
            this.getTemplate().subscribe(res => {
                if (res && res.status === 0) {
                    this.dataHandle(0, res);
                } else {
                    this.setState({
                        isRe: false
                    });
                }
            });
        });
    }

     //自定义添加单位=>刷新单位选项
     addUnit=(unit) => {
         this.fetch(api.addCommodityUnit, {
             data: {
                 unit
             }
         }).subscribe(res => {
             if (res && res.status === 0) {
                 this.getUnit().subscribe(newUnit => {
                     if (newUnit && newUnit.status === 0) {
                         this.dataHandle(2, newUnit);
                     }
                 });
             }
         });
     }

    //自定义添加规格=>刷新规格选项
    addSpec=(spec) => {
        this.fetch(api.addCommoditySpec, {
            data: {
                spec
            }
        }).subscribe(res => {
            if (res && res.status === 0) {
                this.getSpec().subscribe(newSpec => {
                    if (newSpec && newSpec.status === 0) {
                        this.dataHandle(3, newSpec);
                    }
                });
            }
        });
    }

    //搜索并返回选中规格项属性值
    getValue=(id, value, type) => new Promise((resolve) => {
        this.fetch(api.getCommodityValue, {
            data: {
                spec_id: parseInt(id, 10),
                ...value && !!value && {key: value} //不传value返回全部选项
            }
        }).subscribe(res => {
            if (res && res.status === 0) {
                this.setState({
                    [`${type}Option`]: res.data
                }, () => { resolve(true) });
            } else {
                this.setState({
                    [`${type}Option`]: []
                }, () => { resolve(true) });
            }
        });
    })

    //自定义添加选中规格项属性值=>刷新属性值选项
    addValue=(id, value, type) => new Promise((resolve) => {
        this.fetch(api.addCommodityValue, {
            data: {
                spec_id: parseInt(id, 10),
                value
            }
        }).subscribe(res => {
            if (res && res.status === 0) {
                resolve(this.getValue(id, value, type));
            } else {
                this.setState({
                    [`${type}Option`]: []
                }, () => { resolve(true) });
            }
        });
    })

    //若编辑单元格报错=>保存按钮不可点击
    changeSaveButton=(type) => {
        this.setState({
            isError: type
        });
    }

    //点击保存按钮回调
    onSubmit=(e) => {
        e.preventDefault();
        const {form: {validateFieldsAndScroll}} = this.props;
        const {tempOption} = this.state;
        //scroll滚动，force强制再次校验
        validateFieldsAndScroll({scroll: {offsetTop: 150, offsetBottom: 300}, force: true}, (err, values) => {
            if (!err) {
                const detailsLen = this.fourth.state.inputLength; //富文本内容长度
                console.log('detailsLen', detailsLen);
                if ((detailsLen < 6) || (detailsLen > 3001)) {
                    //富文本默认回车符号占一个字符
                    warningMsg('请输入5-3000字符的商品详情');
                } else {
                    const {
                        type, expressSet, expressMoney, invoice,
                        validType, days, custom, holiday, name, sortId, group,
                        tags, unit, image, banner, ...value
                    } = values;
                    const sortName = this.second.state.sortName;
                    const hour = value[`hour${type}`];
                    const minute = value[`minute${type}`];
                    const details = this.fourth.state.inputText; //富文本输入内容
                    const imageArr = this.fourth.state.inputArray; //富文本图片数组
                    //商品类型：1实物商品 2蛋糕烘焙 4电子卡券
                    const basic = new Map([
                        ['1', {
                            express_set: expressSet, //运费设置 1邮费 2运费模板
                            express_money: expressSet === '1' ? expressMoney.toString() : '',
                            express_model: expressSet === '2' ? tempOption.id : '',
                            ...value[`deliveryType${type}`].indexOf('2') !== -1 && {standby_time: `${hour},${minute}`} //备货时间
                        }],
                        ['2', {
                            standby_time: `${hour},${minute}` //备货时间
                        }],
                        ['4', {
                            effective_type: validType, //有效时间设置 2有效期 3自定义周期
                            ...validType === '2' && {effective_day: parseInt(days, 10)},
                            ...validType === '3' && {effective_time: [
                                custom[0].format('YYYY-MM-DD HH:mm'),
                                custom[1].format('YYYY-MM-DD HH:mm')
                            ].join(',')},
                            if_holiday: holiday //节假日是否可用
                        }]
                    ]);
                    //商品详情参数
                    const info = {
                        type, //类型
                        delivery_type: value[`deliveryType${type}`], //配送方式
                        if_invoice: invoice, //是否开发票
                        title: name, //名称
                        //商品分类ID
                        cate1_id: sortId[0],
                        cate2_id: sortId[1],
                        cate3_id: sortId[2],
                        //商品分类名称
                        cate1: sortName[0],
                        cate2: sortName[1],
                        cate3: sortName[2],
                        group: group || 0, //分组
                        tags: tags ? tags.split(',') : [], //标签组
                        unit: unit.key, //单位
                        details, //详情
                        imageArr
                    };
                    const param = {...basic.get(type), ...info}; //保存商品信息所需参数
                    const picture = [...image, ...banner]; //图片上传所需参数
                    const sku = this.third.state.dataSource; //SKU表格数据源
                    this.onSubmitForm(param, picture, sku);
                }
            }
        });
    }

    //保存表单回调
    onSubmitForm=(values, picture, sku) => {
        const {isAdd, isPick, rowId, onConfim} = this.props;
        const keyword = isAdd ? '新建' : '编辑';
        const message = (isPick === '0' && values.delivery_type.indexOf('2') !== -1)
            ? '您的买家到店核销功能已打开，如需修改可前往 配送管理-上门自提 内修改' : '请勿关闭当前页面...';
        this.setState({
            modalVisible: true,
            modalProps: {
                title: `${keyword}商品信息`,
                content: (
                    <Spin tip={`正在提交${keyword}的商品信息...`}>
                        {message}
                    </Spin>
                ),
                closable: false
            }
        }, () => {
            this.fetch(api.addCommodity, {
                data: {
                    ...values,
                    //编辑
                    ...!isAdd && {if_update: '1'},
                    ...!isAdd && {id: rowId}
                }}).subscribe(res => {
                if (res && res.status === 0) {
                    console.log(`添加商品成功，商品id为${res.ins}`);
                    Promise.all([
                        this.onSubmitSku(res.ins, sku),
                        this.onSubmitImage(res.ins, picture)
                    ]).then(() => {
                        //对话框随组件一起卸载
                        if (isAdd) {
                            //新建保存后删除缓存
                            this.delDraft().subscribe(del => {
                                if (del && del.status === 0) {
                                    onConfim();
                                }
                            });
                        } else {
                            onConfim();
                        }
                    }).catch((error) => {
                        console.log(error);
                        this.setState({
                            modalVisible: false,
                            modalProps: {}
                        });
                    });
                } else {
                    warningMsg('保存商品失败，请稍后再试');
                    this.setState({
                        modalVisible: false,
                        modalProps: {}
                    });
                }
            });
        });
    }

    //提交表单sku
    onSubmitSku=(id, values) => new Promise((resolve, reject) => {
        const {isAdd} = this.props;
        const arr = this.initSku(values);
        this.fetch(api.addCommoditySku, {
            data: {
                pr_id: id,
                sku_info: arr,
                ...!isAdd && {if_update: '1'}
            }
        }).subscribe(res => {
            if (res && res.status === 0) {
                console.log('SKU提交成功');
                resolve(true);
            } else {
                reject(res.message);
            }
        });
    })

    //提交表单图片
    onSubmitImage=(id, fileList) => new Promise((solve, ject) => {
        console.log('fileList', fileList);
        const uploads = [];
        fileList.forEach((file, index) => {
            uploads[index] = new Promise((resolve, reject) => {
                this.fetch(api.addCommodityPic, {
                    data: {
                        id,
                        ix: index,
                        num: fileList.length,
                        file: file.thumbUrl ? encodeURIComponent(file.thumbUrl) : file.url
                    }
                }).subscribe(res => {
                    if (res && res.status === 0) {
                        console.log('图片上传成功');
                        resolve(true);
                    } else {
                        reject(res.message);
                    }
                });
            });
            Promise.all(uploads).then(() => {
                solve(true);
            }).catch((error) => {
                ject(error);
            });
        });
    })

    // 删除缓存
    delDraft=() => this.fetch(api.delCommodityDraft)

    onCancel=() => {
        const {onCancel} = this.props;
        onCancel();
    }

    render() {
        const {form, isAdd, rowData, sortOption, groupOption} = this.props;
        const {tempOption, tagsOption, unitOption, specOption, firstOption, secondOption, thirdOption,
            isError, loading, modalVisible, modalProps, isRe} = this.state;
        const anchorArr = [
            {href: '#First', title: '基本信息/物流'},
            {href: '#Second', title: '商品信息'},
            {href: '#Third', title: '规格信息（SKU）'},
            {href: '#Fourth', title: '商品详情'}
        ];
        const buttonList = (
            <React.Fragment>
                <Button onClick={this.onCancel}>取消</Button>
                <Button onClick={this.onSubmit} disabled={isError}>{isError ? '规格列表错误' : '保存'}</Button>
            </React.Fragment>
        );
        return (
            <React.Fragment>
                <Spin spinning={loading}>
                    <div className="fixation-anchor">
                        <Anchor
                            affix={false}
                            onClick={this.handleClick}
                            className="anchor"
                            offsetTop={40}
                        >
                            {
                                anchorArr.map(item => (<Link key={item.href} href={item.href} title={item.title}/>))
                            }
                        </Anchor>
                    </div>
                    <First
                        form={form}
                        isAdd={isAdd}
                        rowData={rowData}
                        tempOption={tempOption}
                        isRe={isRe}
                        reTemplate={this.reTemplate}
                    />
                    <Second
                        ref={el => { this.second = el }}
                        form={form}
                        isAdd={isAdd}
                        rowData={rowData}
                        sortOption={sortOption}
                        groupOption={groupOption}
                        tagsOption={tagsOption}
                        unitOption={unitOption}
                        addUnit={this.addUnit}
                    />
                    <Third
                        ref={el => { this.third = el }}
                        form={form}
                        isAdd={isAdd}
                        rowData={rowData}
                        specOption={specOption}
                        firstOption={firstOption}
                        secondOption={secondOption}
                        thirdOption={thirdOption}
                        addSpec={this.addSpec}
                        getValue={this.getValue}
                        addValue={this.addValue}
                        changeSaveButton={this.changeSaveButton}
                    />
                    <Fourth
                        ref={el => { this.fourth = el }}
                        form={form}
                        rowData={rowData}
                    />
                    <BottomButton
                        buttonList={buttonList}
                    />
                </Spin>
                {modalVisible && (
                    <HandleModal
                        visible={modalVisible}
                        {...modalProps}
                    />
                )}
            </React.Fragment>
        );
    }
}

export default Form.create()(ListForm);
