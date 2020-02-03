import PropTypes from 'prop-types';
import {Form, Card, Select, Input, Button, Tag, Spin, InputNumber, Table, Checkbox, Popconfirm, Empty} from 'antd';
import EditableFormRow from '../editable/EditableFormRow';
import EditableCell from '../editable/EditableCell';
// import GeisInput from '../../../../common/form/input/GeisInput';

const FormItem = Form.Item;
const {Option} = Select;
const {debounce, removeRepeat, showFail} = Utils;
const {MESSAGE: {NewGoods}} = Constants;
export default class Third extends React.PureComponent {
    static propTypes = {
        form: PropTypes.object.isRequired,
        isAdd: PropTypes.bool.isRequired, //true新建商品 false编辑商品
        rowData: PropTypes.object.isRequired, //编辑商品详情
        specOption: PropTypes.array.isRequired, //规格选项
        firstOption: PropTypes.array.isRequired, //规格一属性值选项
        secondOption: PropTypes.array.isRequired, //规格二属性值选项
        thirdOption: PropTypes.array.isRequired, //规格三属性值选项
        addSpec: PropTypes.func.isRequired, //添加规格选项
        getValue: PropTypes.func.isRequired, //获取选中规格项属性值
        addValue: PropTypes.func.isRequired, //添加选中规格项属性值
        changeSaveButton: PropTypes.func.isRequired //判断编辑单元格是否报错
    };

    constructor(props) {
        super(props);
        this.onSearchValue = debounce(this.onSearchValue, 500); //防抖控制
        const {isAdd, rowData} = this.props;
        const bothState = {
            firstCustom: '', //规格一搜索内容
            firstSpining: false, //是否显示规格一搜索中
            firstLoading: false, //是否显示规格一属性值搜索中
            firstWaitAdd: '', //规格一待增加属性值
            secondCustom: '', //规格二搜索内容
            secondSpining: false, //是否显示规格二搜索中
            secondLoading: false, //是否显示规格二属性值搜索中
            secondWaitAdd: '', //规格二待增加属性值
            thirdCustom: '', //规格三搜索内容
            thirdSpining: false, //是否显示规格三搜索中
            thirdLoading: false, //是否显示规格三属性值搜索中
            thirdWaitAdd: '', //规格三待增加属性值
            checkSetting: false, //是否勾选批量设置
            price: 0.01, //批量设置价格
            oPrice: 0, //批量设置原价
            discount: 9.5, //批量设置折扣
            stock: 1 //批量设置库存
        };
        if (!isAdd || (rowData.sku && rowData.sku.length !== 0)) {
            //编辑或新建有sku缓存
            const first = rowData.sku.map(item => ({
                key: item.values1,
                label: item.values_name1
            }));
            const second = rowData.sku.map(item => ({
                key: item.values2,
                label: item.values_name2
            }));
            const third = rowData.sku.map(item => ({
                key: item.values3,
                label: item.values_name3
            }));
            this.state = {
                number: rowData.pr_no || '系统将为您自动生成商品号', //商品号
                ...bothState,
                firstTitle: rowData.sku[0].property_name1, //规格一列标题
                firstId: rowData.sku[0].property_id1, //规格一列id
                firstValues: removeRepeat(first, 'key'), //规格一选中属性值
                secondSku: !!rowData.sku[0].property_name2, //规格二是否显示
                secondTitle: rowData.sku[0].property_name2, //规格二列标题
                secondId: rowData.sku[0].property_id2, //规格二列id
                secondValues: !!rowData.sku[0].property_name2 && removeRepeat(second, 'key'), //规格二选中属性值
                thirdSku: !!rowData.sku[0].property_name3, //规格三是否显示
                thirdTitle: rowData.sku[0].property_name3, //规格三列标题
                thirdId: rowData.sku[0].property_id3, //规格三列id
                thirdValues: !!rowData.sku[0].property_name3 && removeRepeat(third, 'key'), //规格三选中属性值
                dataSource: rowData.sku, //表格数据源
                total: rowData.num_stock //总库存
            };
            //获取属性值选项
            this.onSearchValue('', 'first');
            !!rowData.sku[0].property_name2 && this.onSearchValue('', 'second');
            !!rowData.sku[0].property_name3 && this.onSearchValue('', 'third');
        } else {
            //新建无缓存或新建有缓存但无sku
            this.state = {
                number: '系统将为您自动生成商品号',
                ...bothState,
                firstTitle: '',
                firstId: '',
                firstValues: [],
                secondSku: false,
                secondTitle: '',
                secondId: '',
                secondValues: [],
                thirdSku: false,
                thirdTitle: '',
                thirdId: '',
                thirdValues: [],
                dataSource: [],
                total: ''
            };
        }
    }

    //渲染规格设置
    renderSkuSetting=(v) => {
        if (v) {
            const {form: {getFieldDecorator}, isAdd, rowData, [`${v.type}Option`]: options} = this.props;
            const {
                [`${v.type}Title`]: title,
                [`${v.type}Spining`]: spining,
                [`${v.type}Loading`]: loading,
                [`${v.type}WaitAdd`]: addValue,
                [`${v.type}Values`]: values,
                secondSku,
                thirdSku
            } = this.state;
            return (
                <div key={v.key}>
                    <FormItem className="standard" label={v.name}>
                        {getFieldDecorator(`${v.type}`, {
                            ...(rowData.sku && title) && {initialValue: {key: title}},
                            rules: [{required: true, message: NewGoods.specfication_null}]
                        })(
                            <Select
                                labelInValue //把每个选项的label包装到value中 {key: string, label: ReactNode}
                                showSearch //支持搜索
                                onSearch={(value) => this.onSearch(value, v.type)} //搜索回调
                                optionFilterProp="children"//搜索时过滤option的children属性
                                filterOption={(input, option) => option.props.children.indexOf(input) !== -1} //根据输入项进行筛选
                                //当下拉列表为空时显示的内容
                                notFoundContent={(
                                    spining ? <Spin size="small"/>
                                        : (
                                            <Button
                                                type="link"
                                                block
                                                onClick={() => this.addOption(v.type)}
                                            >
                                                增加新规格
                                            </Button>
                                        )
                                )}
                                onChange={(value) => this.changeTitle(value, v.type)} //选中option回调
                                onBlur={() => this.onSpecBlur(v.type)}
                                placeholder="请输入"
                                //编辑时规格不可修改
                                {...(!isAdd && rowData.sku && title) && {disabled: !!title}}
                                disabled={loading}
                            >
                                {this.setOptionList()}
                            </Select>
                        )}
                        {
                            v.type !== 'first'
                        && (
                            <Popconfirm
                                {...(v.type === 'second' && thirdSku) && {title: '删除规格二将删除规格三，是否确认删除?'}}
                                {...(v.type === 'second' && !thirdSku) && {title: '是否确认删除规格二?'}}
                                {...v.type === 'third' && {title: '是否确认删除规格三?'}}
                                onConfirm={() => this.removeSkuInput(v.type)}
                                onCancel={this.cancel}
                                okText="确认"
                                cancelText="取消"
                            >
                                <Button type="link">删除</Button>
                            </Popconfirm>
                        )
                        }
                    </FormItem>
                    {!!title && (
                        values.length < 5 ? (
                            <FormItem
                                className="description"
                                label="添加规格值"
                                {...(v.type === 'first' && values.length === 1 && secondSku) && {extra: '清空规格一属性值将删除规格二和规格三'}}
                                {...(v.type === 'second' && values.length === 1 && thirdSku) && {extra: '清空规格二属性值将删除规格三'}}
                            >
                                <div
                                    //阻止点击下拉框自动回弹
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        return false;
                                    }}
                                >
                                    {//正在搜索且搜索值为空且无选中属性值
                                        (loading && addValue === '' && values.length === 0) ? (
                                            <Input placeholder="正在初始化选项" disabled/>
                                        )
                                            : getFieldDecorator(`${v.type}Values`, {
                                                ...(rowData.sku && values.length !== 0) && {initialValue: values},
                                                rules: [{required: (values.length === 0), message: NewGoods.no_specficationValue}]
                                            })(
                                                (
                                                    <Select
                                                        mode="multiple"
                                                        labelInValue
                                                        placeholder="请输入"
                                                        notFoundContent={
                                                            !!addValue && (<Empty description="无可选规格值" image={Empty.PRESENTED_IMAGE_SIMPLE}/>)
                                                        }
                                                        //自定义下拉框
                                                        dropdownRender={menu => (
                                                            <Spin size="small" spinning={loading}>
                                                                {(!!addValue && !options.some(obj => obj.value === addValue)) && (
                                                                    <Button
                                                                        type="link"
                                                                        block
                                                                        onClick={() => this.onAddValues(v.type)}
                                                                    >
                                                                        {`增加值:${addValue}`}
                                                                    </Button>
                                                                )}
                                                                {menu}
                                                            </Spin>
                                                        )}
                                                        filterOption={false}
                                                        onSearch={(value) => this.onSearchValue(value, v.type)}
                                                        onChange={(value) => this.onChangeValues(value, v.type)}
                                                        onBlur={() => this.onBlur(v.type)}
                                                    >
                                                        {options.map(op => (
                                                            <Option key={op.value_id}>{op.value}</Option>
                                                        ))}
                                                    </Select>
                                                )
                                            )}
                                </div>
                            </FormItem>
                        ) : values.map((tag) => (
                            <Tag
                                key={tag.key}
                                closable
                                onClose={() => this.delTags(tag.key, v.type)} //关闭标签回调
                            >
                                {tag.label}
                            </Tag>
                        ))
                    )}
                </div>
            );
        }
        return null;
    }

    //渲染规格选项
    setOptionList = () => {
        const {specOption} = this.props;
        const {firstTitle, secondTitle, thirdTitle} = this.state;
        const selectedItems = [firstTitle, secondTitle, thirdTitle];
        const children = [];
        //将已选中规格设为不可选
        specOption.map(v => {
            if (selectedItems.includes(v.value)) {
                children.push(<Option key={v.spec_id} disabled>{v.value}</Option>);
            } else {
                children.push(<Option key={v.spec_id}>{v.value}</Option>);
            }
        });
        return children;
    };

    //保存规格搜索内容
    onSearch=(value, type) => {
        if (value) {
            this.setState({
                [`${type}Custom`]: value
            });
        }
    }

    //新增自定义规格
    addOption=(type) => {
        const {addSpec} = this.props;
        const {[`${type}Custom`]: custom} = this.state;
        const reg = /^[\u4e00-\u9fa5]+$/;
        if (reg.test(custom) && custom.length < 7 && custom.length > 1) {
            this.setState({
                [`${type}Spining`]: true
            }, () => {
                addSpec(custom);
            });
        } else {
            showFail('规格仅支持2-6位的中文字符');
        }
    }

    //选择规格=>更新列标题=>清空前一个规格属性值
    changeTitle = (value, type) => {
        this.setState({
            [`${type}Title`]: value.label,
            [`${type}Id`]: value.key,
            [`${type}Spining`]: false,
            [`${type}Values`]: [],
            [`${type}Loading`]: true,
            [`${type}WaitAdd`]: ''
        }, () => {
            const {form: {setFieldsValue}} = this.props;
            setFieldsValue({[`${type}Values`]: []});
            this.onSearchValue('', type);//覆盖前一个规格属性值选项
            this.setDataSource();
        });
    }

    //失去焦点时关闭动画
    onSpecBlur=(type) => {
        this.setState({
            [`${type}Spining`]: false
        });
    }

    //搜索规格属性值
    onSearchValue = (value, type) => {
        console.log('搜索规格属性值', value);
        this.setState({
            [`${type}Loading`]: true,
            [`${type}WaitAdd`]: value
        }, async () => {
            const {[`${type}Id`]: id} = this.state;
            const {getValue} = this.props;
            const res = await getValue(id, value, type);
            if (res) {
                this.setState({
                    [`${type}Loading`]: false
                });
            }
        });
    };

    //改变选中属性值
    onChangeValues = (value, type) => {
        this.setState({
            [`${type}Values`]: value
        }, () => {
            const {[`${type}Values`]: values} = this.state;
            if (values.length === 0) {
                if (type === 'first') {
                    //若清空规格一选中属性=>清空规格二和规格三
                    this.setState({
                        secondSku: false,
                        secondTitle: '',
                        secondValues: [],
                        thirdSku: false,
                        thirdTitle: '',
                        thirdValues: []
                    }, () => {
                        this.setDataSource();
                    });
                } else if (type === 'second') {
                    //若清空规格二选中属性=>清空规格三
                    this.setState({
                        thirdSku: false,
                        thirdTitle: '',
                        thirdValues: []
                    }, () => {
                        this.setDataSource();
                    });
                }
            } else {
                this.setDataSource();
            }
        });
    };

    //输入=>无搜索结果，保存待增加属性=>不操作失去焦点=>删除待增加属性
    onBlur=(type) => {
        this.setState({
            [`${type}WaitAdd`]: ''
        });
    }

    //新增属性值
    onAddValues =(type) => {
        const {addValue} = this.props;
        const reg = /^[^\s]*$/;
        const {[`${type}Id`]: id, [`${type}WaitAdd`]: value} = this.state;
        if (reg.test(value) && value.length < 31 && value.length > 0) {
            this.setState({
                [`${type}Loading`]: true
            }, async () => {
                const res = await addValue(id, value, type);
                if (res) {
                    this.setState({
                        [`${type}Loading`]: false
                    });
                }
            });
        } else {
            showFail('属性值仅支持1-30位的非空格输入');
        }
    };

    //删除标签
    delTags =(removedId, type) => {
        const {[`${type}Values`]: values} = this.state;
        const newTags = values.filter(tag => tag.key !== removedId);
        this.setState({
            [`${type}Values`]: newTags
        }, () => {
            const {form: {setFieldsValue}} = this.props;
            setFieldsValue({[`${type}Values`]: newTags});
            this.setDataSource();
        });
    };

    //点击新增规格按钮
    addSkuInput = () => {
        const {secondSku} = this.state;
        if (secondSku) {
            this.setState({
                thirdSku: true
            });
        } else {
            this.setState({
                secondSku: true
            });
        }
    };

    //点击删除规格按钮
    removeSkuInput = (type) => {
        if (type === 'second') {
            //删除规格二=>删除规格三
            this.setState({
                secondSku: false,
                secondTitle: '',
                secondValues: [],
                thirdSku: false,
                thirdTitle: '',
                thirdValues: []
            }, () => {
                this.setDataSource();
            });
        } else {
            //删除规格三
            this.setState({
                thirdSku: false,
                thirdTitle: '',
                thirdValues: []
            }, () => {
                this.setDataSource();
            });
        }
    };

    //勾选批量设置复选框
    handleChange = e => {
        this.setState({
            checkSetting: e.target.checked
        });
    };

    //输入商品价格/划线价格/折扣/库存
    changeInputNum=(value, type, num) => {
        this.setState({
            [`${type}`]: value || num
        }, () => {
            this.setDataSource();
        });
    }

    //批量还原默认值
    clear=() => {
        this.setState({
            price: 0.01,
            oPrice: 0,
            discount: 9.5,
            stock: 1,
            checkSetting: false
        }, () => {
            this.setDataSource();
        });
    }

    //编辑保存单元格
    handleSave = row => {
        const {dataSource} = this.state;
        const newData = [...dataSource];
        const index = newData.findIndex(item => row.sku_id === item.sku_id);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row
        });
        let sum = 0;
        newData.map(v => {
            sum += parseInt(v.stock, 10);
        });
        this.setState({
            dataSource: newData,
            total: sum
        });
    };

    changeSaveButton=(type) => {
        const {changeSaveButton} = this.props;
        changeSaveButton(type);
    }

    //渲染表格数据源
    setDataSource = () => {
        const {
            firstTitle, firstId, firstValues,
            secondTitle, secondId, secondValues,
            thirdTitle, thirdId, thirdValues,
            price, oPrice, discount, stock
        } = this.state;
        let source = [];
        // 数据整合
        if (!!firstTitle && firstValues.length > 0) {
            firstValues.map((vf, fIndex) => {
                if (!!secondTitle && secondValues.length > 0) {
                    secondValues.map((vs, sIndex) => {
                        if (!!thirdTitle && thirdValues.length > 0) {
                            thirdValues.map((vt, tIndex) => {
                                const obj = {
                                    sku_id: fIndex.toString() + sIndex.toString() + tIndex.toString(),
                                    property_name1: firstTitle,
                                    property_id1: firstId,
                                    property_name2: secondTitle,
                                    property_id2: secondId,
                                    property_name3: thirdTitle,
                                    property_id3: thirdId,
                                    values_name1: vf.label,
                                    values1: vf.key,
                                    values_name2: vs.label,
                                    values2: vs.key,
                                    values_name3: vt.label,
                                    values3: vt.key,
                                    price: price,
                                    original_price: oPrice,
                                    discount: discount,
                                    stock: stock
                                };
                                source = source.concat(obj);
                            });
                        } else {
                            const obj = {
                                sku_id: fIndex.toString() + sIndex.toString(),
                                property_name1: firstTitle,
                                property_id1: firstId,
                                property_name2: secondTitle,
                                property_id2: secondId,
                                values_name1: vf.label,
                                values1: vf.key,
                                values_name2: vs.label,
                                values2: vs.key,
                                price: price,
                                original_price: oPrice,
                                discount: discount,
                                stock: stock
                            };
                            source = source.concat(obj);
                        }
                    });
                } else {
                    const obj = {
                        sku_id: fIndex.toString(),
                        property_name1: firstTitle,
                        property_id1: firstId,
                        values_name1: vf.label,
                        values1: vf.key,
                        price: price,
                        original_price: oPrice,
                        discount: discount,
                        stock: stock
                    };
                    source = source.concat(obj);
                }
            });
            let sum = 0;
            source.map(v => {
                sum += parseInt(v.stock, 10);
            });
            this.setState({
                dataSource: source,
                total: sum
            });
        } else {
            this.setState({
                dataSource: []
            });
        }
    };

    render() {
        const {form: {getFieldDecorator}} = this.props;
        const {
            number, firstTitle, firstValues, secondSku, secondTitle, secondValues,
            thirdSku, thirdTitle, total, dataSource, checkSetting
        } = this.state;
        //规格类型
        const specType = [
            {
                key: 'first',
                name: '规格一',
                type: 'first',
                num: '1'
            },
            secondSku && {
                key: 'second',
                name: '规格二',
                type: 'second',
                num: '2'
            },
            thirdSku && {
                key: 'third',
                name: '规格三',
                type: 'third',
                num: '3'
            }
        ];
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell
            }
        };
        const defaultCols = [
            {
                title: '规格编码',
                dataIndex: 'sku_no',
                align: 'center',
                editable: false,
                render: (text) => <p>{text || '系统自动生成'}</p>
            },
            {
                title: '商品价格',
                dataIndex: 'price',
                align: 'center',
                editable: true,
                render: (text) => <p>￥{text}</p>
            },
            {
                title: '划线价格',
                dataIndex: 'original_price',
                align: 'center',
                editable: true,
                render: (text) => <p>￥{text}</p>
            },
            {
                title: '折扣',
                dataIndex: 'discount',
                align: 'center',
                editable: true,
                render: (text) => <p>{text}折</p>
            },
            {
                title: '记账量',
                dataIndex: 'deposit',
                align: 'center',
                editable: false,
                render: (text) => <p>{text || '系统自动计算'}</p>
            },
            {
                title: '商品库存',
                dataIndex: 'stock',
                align: 'center',
                editable: true,
                render: (text) => <p {...text <= 10 && {className: 'stock-error-color'}}>{text}件</p>
            }
        ];
        const cols = () => {
            const arr = [
                {
                    title: firstTitle,
                    dataIndex: 'values_name1',
                    editable: false,
                    align: 'center'
                },
                {
                    title: secondTitle,
                    dataIndex: 'values_name2',
                    editable: false,
                    align: 'center'
                },
                {
                    title: thirdTitle,
                    dataIndex: 'values_name3',
                    editable: false,
                    align: 'center'
                }
            ];
            //动态增减表格列
            let result = [];
            if (secondSku && thirdSku) {
                result = [...arr, ...defaultCols];
            } else if (secondSku && !thirdSku) {
                arr.splice(2, 1);
                result = [...arr, ...defaultCols];
            } else if (!secondSku && !thirdSku) {
                arr.splice(1, 2);
                result = [...arr, ...defaultCols];
            }
            return result;
        };
        const columns = cols().map((col) => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    editable: col.editable,
                    dataindex: col.dataIndex, //使用dataIndex会报错
                    title: col.title,
                    onSaveCol: this.handleSave,
                    send: this.changeSaveButton
                })
            };
        });
        const addButton = (
            <FormItem>
                <Button type="Link" onClick={this.addSkuInput}>+添加规格</Button>
            </FormItem>
        );
        return (
            <Form id="Third" className="specification">
                <Card title="规格信息（SKU）">
                    <FormItem label="商品编号">
                        <span>{number}</span>
                    </FormItem>
                    <FormItem className="set" label="规格设置">
                        {
                            specType.map(v => (
                                this.renderSkuSetting(v)
                            ))
                        }
                        {secondSku
                            ? (!!secondTitle && secondValues.length > 0 && !thirdSku) && addButton
                            : (!!firstTitle && firstValues.length > 0) && addButton}
                    </FormItem>
                    <FormItem className="list" label="规格列表">
                        <Table
                            rowKey={record => record.sku_id}
                            components={components}
                            columns={columns}
                            dataSource={dataSource}
                            bordered
                            pagination={false}
                        />
                    </FormItem>
                    {(!!firstTitle && firstValues.length > 0)
                    && (
                        <FormItem className="volume-set">
                            <Checkbox checked={checkSetting} onChange={this.handleChange}/>
                            <FormItem label="批量设置">
                                <React.Fragment>
                                    {checkSetting && (
                                        <div className="batch">
                                            <FormItem>
                                                {getFieldDecorator('price')(
                                                    <InputNumber
                                                        max={99999999.99}
                                                        min={0.01}
                                                        precision={2}
                                                        onChange={
                                                            (value) => this.changeInputNum(value, 'price', 0.01)
                                                        }
                                                        placeholder="商品价格"
                                                        maxLength={11}
                                                    />
                                                )}
                                            </FormItem>
                                            <FormItem>
                                                {getFieldDecorator('oPrice')(
                                                    <InputNumber
                                                        max={99999999.99}
                                                        min={0}
                                                        precision={2}
                                                        onChange={
                                                            (value) => this.changeInputNum(value, 'oPrice', 0)
                                                        }
                                                        placeholder="划线价格"
                                                        maxLength={11}
                                                    />
                                                )}
                                            </FormItem>
                                            <FormItem>
                                                {getFieldDecorator('discount')(
                                                    <InputNumber
                                                        max={9.5}
                                                        min={8}
                                                        precision={2}
                                                        onChange={
                                                            (value) => this.changeInputNum(value, 'discount', 9.5)
                                                        }
                                                        placeholder="需8-9.5折"
                                                        maxLength={4}
                                                    />
                                                )}
                                            </FormItem>
                                            <FormItem>
                                                {getFieldDecorator('stock')(
                                                    <InputNumber
                                                        max={999999999}
                                                        min={1}
                                                        precision={0}
                                                        onChange={
                                                            (value) => this.changeInputNum(value, 'stock', 1)
                                                        }
                                                        placeholder="库存"
                                                        maxLength={9}
                                                    />
                                                )}
                                            </FormItem>
                                        </div>
                                    )}
                                    <div className="altogether">
                                        <div className="gross">总库存：{total}件</div>
                                        <Form.Item>
                                            <Button type="link" onClick={this.clear}>
                                                还原默认值
                                            </Button>
                                        </Form.Item>
                                    </div>
                                </React.Fragment>
                            </FormItem>
                        </FormItem>
                    )}
                </Card>
            </Form>
        );
    }
}
