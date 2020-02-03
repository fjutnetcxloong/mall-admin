//商品及图片选择 2张 xwb

import {Upload, Icon, Input, Select} from 'antd';
import './commodityChoice.less';

const {Option} = Select;
const {checkImageWH} = Utils;
const {api} = Configs;
let onOffShow = true;//选择图片的时候自带会渲染三次，这个是开关用来阻止，只让走一次
class CommodityChoice extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            value: 1,
            hotOne: {index: props.index[0], id: ''}, //热销商品1
            hotTwo: {index: props.index[1], id: ''}, //热销商品2
            prsList: [],
            allMsg: props
        };
    }

    componentDidMount() {
        this.getAllPrs();
    }

    getAllPrs = (title) => {
        const {defaultModelInfo, sortId1, sortId2, sortIx1, sortIx2, sortTitle11, sortTitle12} = this.props;
        const content = defaultModelInfo.get('content');
        const picurl = defaultModelInfo.get('picurl');
        const {hotOne, hotTwo} = this.state;
        const arr = hotOne;
        const arr2 = hotTwo;
        this.fetch(api.modelPrs, {data: {title}})
            .subscribe(res => {
                if (res && res.status === 0) {
                    this.setState({
                        prsList: res.data
                    }, () => {
                        if (content) { //为了拿到初始值
                            const str = res.data.find(item => item.id === content.get(sortId1));
                            const str2 = res.data.find(item => item.id === content.get(sortId2));
                            arr.url = picurl.get(content.get(sortIx1));
                            arr2.url = picurl.get(content.get(sortIx2));
                            arr.text = content.get(sortTitle11);
                            arr2.text = content.get(sortTitle12);
                            arr.id = str ? str.id : '';
                            arr2.id = str2 ? str2.id : '';
                            this.setState({
                                hotOne: {...arr},
                                hotTwo: {...arr2}
                            });
                        }
                    });
                }
            });
    }

    componentWillReceiveProps(nextProps) {
        const {sortId1} = nextProps;
        if (sortId1 !== this.props.sortId1) { //一个模板两个地方使用了这个组件，判断变化的时候数据就变动
            this.setState({
                allMsg: {...nextProps},
                loading: false,
                value: 1,
                hotOne: {index: nextProps.index[0], id: ''}, //热销商品1
                hotTwo: {index: nextProps.index[1], id: ''}, //热销商品2
                prsList: []
            }, () => {
                this.getAllPrs();
            });
        }
    }

    getBase64=(img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    //选择器
    selector = (value, index) => {
        const {prsList, hotOne, hotTwo, allMsg} = this.state;
        const {setExplosiveInfo, sortId1, sortId2, sortTitle11, sortTitle12, sortTitle21, sortTitle22, sortTitle31, sortTitle32} = allMsg;
        const arr = hotOne;
        const arr2 = hotTwo;
        const all = prsList.find(item => item.id === value);
        if (index === 0 && all) {
            arr.price = all.price;
            arr.price_original = all.price_original;
            arr.id = all.id;
            if (!arr.text) {
                arr.text = all.title;
                setExplosiveInfo(sortTitle11, all.title);
            }
            setExplosiveInfo(sortId1, all.id);
            setExplosiveInfo(sortTitle21, all.price);
            setExplosiveInfo(sortTitle31, all.price_original);
        } else if (all) {
            arr2.price = all.price;
            arr2.price_original = all.price_original;
            arr2.id = all.id;
            if (!arr2.text) {
                arr2.text = all.title;
                setExplosiveInfo(sortTitle12, all.title);
            }
            setExplosiveInfo(sortId2, all.id);
            setExplosiveInfo(sortTitle22, all.price);
            setExplosiveInfo(sortTitle32, all.price_original);
        }
        this.setState({
            hotOne: arr,
            hotTwo: arr2
        });
    }

    //文字输入
    mainChange = (e, index) => {
        const {hotOne, hotTwo, allMsg} = this.state;
        const {setExplosiveInfo, sortTitle11, sortTitle12} = allMsg;
        if (index === 0) {
            hotOne.text = e.target.value;
            setExplosiveInfo(sortTitle11, e.target.value);
        } else {
            hotTwo.text = e.target.value;
            setExplosiveInfo(sortTitle12, e.target.value);
        }
        this.setState({
            hotOne,
            hotTwo
        });
    }

    //图片选择
    handleChange = ({file}, index) => {
        if (!onOffShow) return;
        onOffShow = false;
        const {hotOne, hotTwo, allMsg} = this.state;
        const {setPicurlBackground} = allMsg;
        this.getBase64(file.originFileObj, img => {
            if (index === 0) {
                hotOne.url = img;
                setPicurlBackground(hotOne.index, img);
            } else {
                hotTwo.url = img;
                setPicurlBackground(hotTwo.index, img);
            }
        });
        setTimeout(() => {
            this.setState({
                hotOne,
                hotTwo
            });
            onOffShow = true;
        }, 200);
    };

    render() {
        const {hotOne, hotTwo, prsList, loading, allMsg} = this.state;
        const {firstWidth, firstHeight, top, secondWidth, secondHeight} = allMsg;
        const uploadButton = (
            <div>
                <Icon type={loading ? 'loading' : 'plus'}/>
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            <div className="model-product-description" style={{top: top + 'px'}}>
                <div onClick={() => this.props.mainShow(false)} className="hide-choise">X</div>
                <div className="headline">选择商品图</div>
                <div className="uploading">
                    <div className="require">
                        <span>图片要求:</span>
                        {
                            secondWidth ? <span>小于500k</span> : <span>{firstWidth}*{firstHeight}像素，小于500kb</span>
                        }
                    </div>
                    <div className="require">
                        <span>商品1:</span>
                        {
                            secondWidth ? <span>小于500k，{firstWidth}*{firstHeight}像素</span> : <span>可添加1张</span>
                        }
                    </div>
                    <div className="upload-box">
                        <Upload
                            accept="image/png, image/jpeg,image/jpg"
                            name="avatar"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            beforeUpload={(file) => checkImageWH(file, firstWidth, firstHeight, 0.5).then(res => true)}
                            onChange={(data) => this.handleChange(data, 0)}
                        >
                            {hotOne.url ? <img src={hotOne.url} alt="avatar" style={{width: '100%'}}/> : uploadButton}
                        </Upload>
                        <div className="import-headline">
                            <div>商品标题:</div>
                            <Input maxLength={16} onChange={(e) => this.mainChange(e, 0)} value={hotOne.text} placeholder="请输入"/>
                        </div>
                        <div className="change">
                            <div>商品页:</div>
                            <Select onChange={(data) => this.selector(data, 0)} value={hotOne.id && hotOne.id} >
                                <Option value="">全部</Option>
                                {
                                    prsList.length > 0 && prsList.map(value => <Option key={value.id} value={value.id}>{(value.pr_no || '') + ' ' + value.title}</Option>)
                                }
                            </Select>
                        </div>
                    </div>

                    <div className="require">
                        <span>商品2:</span>
                        {
                            secondWidth ? <span>小于500k，{secondWidth}*{secondHeight}像素</span> : <span>可添加1张</span>
                        }
                    </div>
                    <div className="upload-box">
                        <Upload
                            accept="image/png, image/jpeg,image/jpg"
                            name="avatar"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            beforeUpload={(file) => checkImageWH(file, secondWidth || firstWidth, secondHeight || firstHeight, 0.5).then(res => true)}
                            onChange={(data) => this.handleChange(data, 1)}
                        >
                            {hotTwo.url ? <img src={hotTwo.url} alt="avatar" style={{width: '100%'}}/> : uploadButton}
                        </Upload>
                        <div className="import-headline">
                            <div>商品标题:</div>
                            <Input maxLength={16} onChange={(e) => this.mainChange(e, 1)} value={hotTwo.text} placeholder="请输入"/>
                        </div>
                        <div className="change">
                            <div>商品页:</div>
                            <Select onChange={(data) => this.selector(data, 1)} value={hotTwo.id && hotTwo.id} >
                                <Option value="">全部</Option>
                                {
                                    prsList.length > 0 && prsList.map(value => <Option key={value.id} value={value.id}>{(value.pr_no || '') + ' ' + value.title}</Option>)
                                }
                            </Select>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CommodityChoice;
