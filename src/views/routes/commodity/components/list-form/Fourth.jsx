import PropTypes from 'prop-types';
import ReactQuill from 'react-quill';
import {Form, Card, Button, Popover} from 'antd';
import HandleUpload from '../../../../common/handle-upload/HandleUpload';
import HandleModal from '../../../../common/handle-modal/HandleModal';
import DragSort from '../drag-sort/DragSort';
import 'react-quill/dist/quill.snow.css';

const {MESSAGE: {NewGoods}} = Constants;
const {normFile} = Utils;
const FormItem = Form.Item;
export default class Fourth extends React.PureComponent {
    static propTypes = {
        form: PropTypes.object.isRequired,
        rowData: PropTypes.object.isRequired //编辑商品详情
    };

    constructor(props) {
        super(props);
        const {rowData} = this.props;
        this.state = {
            fileList: (rowData.banner && rowData.banner.length !== 0) ? rowData.banner.map((item, index) => ({
                uid: index,
                url: item,
                status: 'done'
            })) : [], //已上传/待上传的图片列表
            inputText: rowData.intro || '<p><br></p>', //富文本输入内容
            previewVisible: false, //是否显示图片预览框
            previewImage: '', //预览图片地址
            sortVisible: false, //是否显示图片排序框
            inputArray: [], //富文本上传图片列表
            inputLength: 1 //输入内容长度
        };
    }

    componentDidMount() {
        const {rowData} = this.props;
        if (this.reactQuillRef && rowData.intro) {
            const inputArray = [];
            const editor = this.reactQuillRef.getEditor(); //返回Quill编辑器的实例
            const unprivilegedEditor = this.reactQuillRef.makeUnprivilegedEditor(editor); //创建无特权编辑器
            unprivilegedEditor.getContents().ops.map(({insert}) => {
                if (insert.image) {
                    inputArray.push(insert.image);
                }
            }); //getContents获取编辑器去除HTML标签后的内容，返回图片数组
            const inputLength = unprivilegedEditor.getLength(); //返回编辑器内容的长度，以字符为单位，不包括任何HTML标记
            this.setState({
                inputArray,
                inputLength
            }, () => {
                console.log('编辑或有缓存时已有商品详情字符长度', this.state.inputArray, this.state.inputLength);
            });
        }
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

    //显示图片排序框
    showDragSort=() => {
        this.setState({
            sortVisible: true
        });
    }

    //关闭图片排序框
    hideDragSort=() => {
        console.log('关闭');
        this.setState({
            sortVisible: false
        });
    }

    //确认排序
    confimDragSort=(fileList) => {
        console.log('确定', fileList);
        this.setState({
            sortVisible: false,
            fileList
        });
    }

    //修改富文本内容回调，初始渲染时不调用
    onQuillChange=(text) => {
        if (this.reactQuillRef) {
            const inputArray = [];
            const editor = this.reactQuillRef.getEditor();
            const unprivilegedEditor = this.reactQuillRef.makeUnprivilegedEditor(editor);
            unprivilegedEditor.getContents().ops.map(({insert}) => {
                if (insert.image) {
                    inputArray.push(insert.image);
                }
            });
            const inputLength = unprivilegedEditor.getLength();
            this.setState({
                inputText: text,
                inputArray,
                inputLength
            }, () => {
                console.log('修改后长度', this.state.inputArray, inputLength);
            });
        }
    }

    render() {
        const {form: {getFieldDecorator}} = this.props;
        const {previewVisible, previewImage, fileList, sortVisible, inputText} = this.state;
        //编辑器启用模块
        const modules = {
            //工具栏
            toolbar: {
                container: [
                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                    [{list: 'ordered'}, {list: 'bullet'}, {indent: '-1'}, {indent: '+1'}],
                    ['image']
                ]
            }
        };
        //支持编辑的格式
        const formats = [
            'bold', 'italic', 'underline', 'strike', 'blockquote',
            'list', 'bullet', 'indent',
            'link', 'image'
        ];
        const content = (
            <div className="commodity-banner-example"/>
        );
        return (
            <Form id="Fourth" className="particulars">
                <Card title="商品详情">
                    <Form.Item label="添加banner">
                        <div className="suggest">
                            <div>建议尺寸：750x 580像素</div>
                            {fileList.length > 1 && <Button type="link" onClick={this.showDragSort}>排序</Button>}
                            <Popover content={content} placement="right">
                                <Button type="link">查看示例</Button>
                            </Popover>
                        </div>
                        {getFieldDecorator('banner', {
                            initialValue: fileList,
                            rules: [{required: true, message: NewGoods.banner_null}],
                            valuePropName: 'fileList',
                            getValueFromEvent: (e) => {
                                const result = normFile(e);
                                this.handleChange(result);
                                return result;
                            } //getValueFromEvent将formItem的onChange的参数（如 event）传入受控组件
                        })(
                            <HandleUpload
                                list={fileList}
                                limit={10}
                                button={<div>点击上传</div>}
                                onPreview={this.handlePreview}
                            />
                        )}
                    </Form.Item>
                    <FormItem label="商品详情页">
                        <ReactQuill
                            ref={(el) => { this.reactQuillRef = el }}
                            theme="snow"
                            modules={modules}
                            formats={formats}
                            value={inputText}
                            onChange={this.onQuillChange}
                            placeholder="请输入5-3000字符的商品详情"
                        />
                    </FormItem>
                </Card>
                {
                    previewVisible && (
                        <HandleModal
                            visible={previewVisible}
                            width={250}
                            closable={false}
                            content={<img alt="" src={previewImage}/>}
                            onCancel={this.handleCancel}
                        />
                    )
                }
                {
                    sortVisible && (
                        <DragSort
                            visible={sortVisible}
                            list={fileList}
                            onConfim={this.confimDragSort}
                            onCancel={this.hideDragSort}
                        />
                    )
                }
            </Form>
        );
    }
}
