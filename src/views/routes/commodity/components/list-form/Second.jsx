import PropTypes from 'prop-types';
import {Form, Card, Input, Select, Cascader, Spin, Popover, Button} from 'antd';
import HandleUpload from '../../../../common/handle-upload/HandleUpload';
import HandleModal from '../../../../common/handle-modal/HandleModal';
import './Second.less';

const FormItem = Form.Item;
const {Option} = Select;
const {MESSAGE: {NewGoods}} = Constants;
const {normFile, showFail} = Utils;
export default class Second extends React.PureComponent {
    static propTypes = {
        form: PropTypes.object.isRequired,
        // isAdd: PropTypes.bool.isRequired, //true新建商品 false编辑商品
        rowData: PropTypes.object.isRequired, //编辑商品详情
        sortOption: PropTypes.array.isRequired, //分类选项
        groupOption: PropTypes.array.isRequired, //分组选项
        tagsOption: PropTypes.array.isRequired, //标签选项
        unitOption: PropTypes.array.isRequired, //单位选项
        addUnit: PropTypes.func.isRequired //添加单位选项
    };

    constructor(props) {
        super(props);
        const {rowData} = this.props;
        this.state = {
            sortName: (rowData.cate1 && rowData.cate2 && rowData.cate3) ? [rowData.cate1, rowData.cate2, rowData.cate3] : [], //商品分类选中项名称
            fileList: (rowData.picurl && !!rowData.picurl) ? [{
                uid: '1',
                url: rowData.picurl,
                status: 'done'
            }] : [], //已上传/待上传的图片
            previewVisible: false, //是否显示图片预览框
            previewImage: '', //预览图片地址
            custom: '', //单位搜索内容
            loading: false //是否显示搜索中
        };
    }

    // 渲染分组选项
    setGroupOptionList = () => {
        const {groupOption} = this.props;
        const children = [];
        groupOption.map(v => {
            children.push(<Option key={v.group_id}>{v.group_name}</Option>);
        });
        return children;
    };

    //渲染标签选项
    setTagsOptionList = () => {
        const {tagsOption} = this.props;
        const children = [];
        tagsOption.map(v => {
            if (v.tag_value) {
                children.push(<Option key={v.tag_id}>{v.tag_value}</Option>);
            }
        });
        return children;
    };

    //渲染单位选项
    setUnitOptionList = () => {
        const {unitOption} = this.props;
        // FIXME: 代码需要优化，无需再多创建一个children对象
        //改好了
        const children = unitOption.map(v => (
            <Option key={v.unit_id}>{v.unit}</Option>
        ));
        return children;
    };

    //选择商品分类
    onChange=(value, selectedOptions)  => {
        const arr = [];
        selectedOptions.map(v => {
            arr.push(v.label);
        });
        this.setState({
            sortName: arr
        }, () => {
            console.log('选中商品分类id', value, '选中商品分类名称', this.state.sortName);
        });
    }

    //点击上传回调
    handleChange = (fileList) => {
        this.setState({
            fileList
        });
    };

    //预览图片
    handlePreview = file => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true
        });
    };

    //关闭图片预览
    handleCancel = () => this.setState({previewVisible: false});

    //商品单位搜索
    onSearch=value => {
        if (value && value !== '') {
            this.setState({
                custom: value,
                loading: false
            });
        }
    }

    //点击增加新单位
    addUnit=() => {
        const {addUnit} = this.props;
        const {custom} = this.state;
        const reg = /^[\u4e00-\u9fa5]+$/;
        if (reg.test(custom) && custom.length < 3 && custom.length > 0) {
            this.setState({
                loading: true
            }, () => {
                addUnit(custom);
            });
        } else {
            showFail('商品单位仅支持输入1-2位中文字符');
        }
    }

    render() {
        const {form: {getFieldDecorator}, rowData, sortOption} = this.props;
        const {previewVisible, previewImage, fileList, loading} = this.state;
        const content = (
            <div className="commodity-image-example"/>
        );
        return (
            <Form id="Second" className="merchandise-news">
                <Card title="商品信息">
                    <FormItem label="商品名称">
                        {getFieldDecorator('name', {
                            rules: [
                                {required: true, message: NewGoods.name_null},
                                {min: 2, message: NewGoods.fontNum_tooLittle},
                                {pattern: /^(\S|(\S.*\S)) ?$/, message: NewGoods.name_error}
                            ],
                            ...rowData.title && {initialValue: rowData.title}
                        })(
                            <Input
                                placeholder="仅支持输入2-30位字符"
                                allowClear
                                maxLength={30}
                            />
                        )}
                    </FormItem>
                    <FormItem label="商品分类">
                        {getFieldDecorator('sortId', {
                            ...(rowData.id1 && rowData.id2 && rowData.id3) && {initialValue: [rowData.id1, rowData.id2, rowData.id3]},
                            rules: [{type: 'array', required: true, message: NewGoods.type_null}]
                        })(
                            <Cascader
                                placeholder="请选择"
                                options={sortOption}
                                onChange={this.onChange}
                                showSearch={
                                    (inputValue, path) => path.some(option => option.label.indexOf(inputValue) > -1)
                                }
                                notFoundContent={null}
                            />
                        )}
                    </FormItem>
                    <FormItem
                        className="grouping"
                        label="商品分组"
                    >
                        {getFieldDecorator('group', {
                            ...rowData.group_id && {initialValue: rowData.group_id}
                        })(
                            <Select
                                placeholder="请选择"
                            >
                                {this.setGroupOptionList()}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem label="商品标签">
                        {getFieldDecorator('tags', {
                            ...rowData.tags && {initialValue: rowData.tags}
                        })(
                            <Select
                                placeholder="请选择"
                            >
                                {this.setTagsOptionList()}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem className="commodity-figure" label="商品图">
                        <div>
                            <div>建议尺寸：480x 480像素</div>
                            <Popover
                                content={content}
                                placement="right"
                            >
                                <Button type="link">
                                    查看示例
                                </Button>
                            </Popover>
                        </div>
                        {getFieldDecorator('image', {
                            initialValue: fileList,
                            rules: [{required: true, message: NewGoods.no_picture}],
                            valuePropName: 'fileList',
                            getValueFromEvent: (e) => {
                                const result = normFile(e);
                                this.handleChange(result);
                                return result;
                            }  //getValueFromEvent将formItem的onChange的参数（如 event）传入受控组件
                        })(
                            <HandleUpload
                                list={fileList}
                                button={<div>点击上传</div>}
                                onPreview={this.handlePreview}
                            />
                        )}
                    </FormItem>
                    <FormItem label="商品单位">
                        {getFieldDecorator('unit', {
                            ...rowData.unit && {initialValue: {key: rowData.unit}},
                            rules: [{required: true, message: NewGoods.no_productUnit}]
                        })(
                            <Select
                                placeholder="请选择"
                                labelInValue //把选项的label包装到value中，会把 Select的value类型从string变为{key: string, label: ReactNode}
                                showSearch
                                onSearch={this.onSearch}
                                optionFilterProp="children"
                                filterOption={(input, option) => option.props.children.indexOf(input) !== -1}
                                notFoundContent={(
                                    loading ? <Spin size="small"/>
                                        : (
                                            <Button
                                                type="link"
                                                block
                                                onClick={this.addUnit}
                                            >
                                            增加新单位
                                            </Button>
                                        )
                                )}
                            >
                                {this.setUnitOptionList()}
                            </Select>
                        )}
                    </FormItem>
                </Card>
                <HandleModal
                    visible={previewVisible}
                    width={250}
                    closable={false}
                    content={<img alt="" src={previewImage}/>}
                    onCancel={this.handleCancel}
                />
            </Form>
        );
    }
}
