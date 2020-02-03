//商品及图片选择  4张 xwb

import {Upload, Icon, Input, Select} from 'antd';
import './commodityChoice.less';

const {Option} = Select;
const {checkImageWH} = Utils;
const {api} = Configs;
class CommodityChoiceFour extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            value: 1,
            newOne: {index: props.index[0], id: ''}, //新品商品1
            newTwo: {index: props.index[1], id: ''}, //新品商品2
            newThree: {index: props.index[2], id: ''}, //新品商品3
            newFoure: {index: props.index[3], id: ''}, //新品商品4
            prsList: [],
            allMsg: props
        };
    }

    componentDidMount() {
        this.getAllPrs();
    }

    getAllPrs = () => {
        const {newOne, newTwo, newThree, newFoure, allMsg} = this.state;
        const {defaultModelInfo, sortId1, sortId2, sortId3, sortId4, sortIx1, sortIx2, sortIx3, sortIx4, sortTitle11, sortTitle12, sortTitle13, sortTitle14} = allMsg;
        const content = defaultModelInfo.get('content');
        const picurl = defaultModelInfo.get('picurl');
        const arr = newOne;
        const arr2 = newTwo;
        const arr3 = newThree;
        const arr4 = newFoure;
        this.fetch(api.modelPrs)
            .subscribe(res => {
                if (res && res.status === 0) {
                    this.setState({
                        prsList: res.data
                    }, () => {
                        if (content) { //为了拿到初始值
                            const str = res.data.find(item => item.id === content.get(sortId1));
                            const str2 = res.data.find(item => item.id === content.get(sortId2));
                            const str3 = res.data.find(item => item.id === content.get(sortId3));
                            const str4 = res.data.find(item => item.id === content.get(sortId4));
                            arr.url = picurl.get(content.get(sortIx1));
                            arr2.url = picurl.get(content.get(sortIx2));
                            arr3.url = picurl.get(content.get(sortIx3));
                            arr4.url = picurl.get(content.get(sortIx4));
                            arr.text = content.get(sortTitle11);
                            arr2.text = content.get(sortTitle12);
                            arr3.text = content.get(sortTitle13);
                            arr4.text = content.get(sortTitle14);
                            arr.id = str ? str.id : '';
                            arr2.id = str2 ? str2.id : '';
                            arr3.id = str3 ? str3.id : '';
                            arr4.id = str4 ? str4.id : '';
                            this.setState({
                                newOne: {...arr},
                                newTwo: {...arr2},
                                newThree: {...arr3},
                                newFoure: {...arr4}
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
                newOne: {index: nextProps.index[0], id: ''}, //新品商品1
                newTwo: {index: nextProps.index[1], id: ''}, //新品商品2
                newThree: {index: nextProps.index[2], id: ''}, //新品商品3
                newFoure: {index: nextProps.index[3], id: ''}, //新品商品4
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
        const {prsList, newOne, newTwo, newThree, newFoure, allMsg} = this.state;
        const {setExplosiveInfo, sortId1, sortId2, sortId3, sortId4, sortTitle11, sortTitle12, sortTitle13, sortTitle14, sortTitle21, sortTitle22, sortTitle23, sortTitle24, sortTitle31, sortTitle32, sortTitle33, sortTitle34} = allMsg;
        const all = prsList.find(item => item.id === value);
        if (index === 0 && all) {
            newOne.price = all.price;
            newOne.price_original = all.price_original;
            newOne.id = all.id;
            if (!newOne.text) { //判断是否已经有填写了商品名称，如果没有，则可以使用选择商品时的商品名赋值
                newOne.text = all.title;
                setExplosiveInfo(sortTitle11, all.title);
            }
            setExplosiveInfo(sortId1, all.id);
            setExplosiveInfo(sortTitle21, all.price);
            setExplosiveInfo(sortTitle31, all.price_original);
        } else if (index === 1 && all) {
            newTwo.price = all.price;
            newTwo.price_original = all.price_original;
            newTwo.id = all.id;
            if (!newTwo.text) { //判断是否已经有填写了商品名称，如果没有，则可以使用选择商品时的商品名赋值
                newTwo.text = all.title;
                setExplosiveInfo(sortTitle12, all.title);
            }
            setExplosiveInfo(sortId2, all.id);
            setExplosiveInfo(sortTitle22, all.price);
            setExplosiveInfo(sortTitle32, all.price_original);
        } else if (index === 2 && all) {
            newThree.price = all.price;
            newThree.price_original = all.price_original;
            newThree.id = all.id;
            if (!newThree.text) { //判断是否已经有填写了商品名称，如果没有，则可以使用选择商品时的商品名赋值
                newThree.text = all.title;
                setExplosiveInfo(sortTitle13, all.title);
            }
            setExplosiveInfo(sortId3, all.id);
            setExplosiveInfo(sortTitle23, all.price);
            setExplosiveInfo(sortTitle33, all.price_original);
        } else if (all) {
            newFoure.price = all.price;
            newFoure.price_original = all.price_original;
            newFoure.id = all.id;
            if (!newFoure.text) { //判断是否已经有填写了商品名称，如果没有，则可以使用选择商品时的商品名赋值
                newFoure.text = all.title;
                setExplosiveInfo(sortTitle14, all.title);
            }
            setExplosiveInfo(sortId4, all.id);
            setExplosiveInfo(sortTitle24, all.price);
            setExplosiveInfo(sortTitle34, all.price_original);
        }
        this.setState({
            newOne,
            newTwo,
            newThree,
            newFoure
        });
    }

    //文字输入
    mainChange = (e, index) => {
        const {newOne, newTwo, newThree, newFoure, allMsg} = this.state;
        const {setExplosiveInfo, sortTitle11, sortTitle12, sortTitle13, sortTitle14} = allMsg;
        if (index === 0) {
            newOne.text = e.target.value;
            setExplosiveInfo(sortTitle11, e.target.value);
        } else if (index === 1) {
            newTwo.text = e.target.value;
            setExplosiveInfo(sortTitle12, e.target.value);
        } else if (index === 2) {
            newThree.text = e.target.value;
            setExplosiveInfo(sortTitle13, e.target.value);
        } else {
            newFoure.text = e.target.value;
            setExplosiveInfo(sortTitle14, e.target.value);
        }
        this.setState({
            newOne,
            newTwo,
            newThree,
            newFoure
        });
    }

    //图片选择
    handleChange = ({file}, index) => {
        const {newOne, newTwo, newThree, newFoure, allMsg} = this.state;
        const {setPicurlBackground} = allMsg;
        this.getBase64(file.originFileObj, img => {
            if (index === 0) {
                newOne.url = img;
                setPicurlBackground(newOne.index, img);
            } else if (index === 1) {
                newTwo.url = img;
                setPicurlBackground(newTwo.index, img);
            } else if (index === 2) {
                newThree.url = img;
                setPicurlBackground(newThree.index, img);
            } else {
                newFoure.url = img;
                setPicurlBackground(newFoure.index, img);
            }
        });
        setTimeout(() => {
            this.setState({
                newOne,
                newTwo,
                newThree,
                newFoure
            });
        }, 200);
    };

    render() {
        const {newOne, newTwo, newThree, newFoure, prsList, loading, allMsg} = this.state;
        const {top, firstWidth, firstHeight, secondWidth, secondHeight, noNormal} = allMsg;
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
                        {   //有个别图片是不一样的时候
                            secondWidth ? <span>小于500k</span> : <span>{firstWidth}*{firstHeight}像素，小于500kb</span>
                        }
                    </div>
                    <div className="require">
                        <span>商品1:</span>
                        {   //有个别图片是不一样的时候
                            secondWidth ? <span>可添加一张，{firstWidth}*{firstHeight}像素</span> : <span>可添加1张</span>
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
                            {newOne.url ? <img src={newOne.url} alt="avatar" style={{width: '100%'}}/> : uploadButton}
                        </Upload>
                        <div className="import-headline">
                            <div>商品标题:</div>
                            <Input maxLength={16} onChange={(e) => this.mainChange(e, 0)} value={newOne.text} placeholder="请输入"/>
                        </div>
                        <div className="change">
                            <div>商品页:</div>
                            <Select onChange={(data) => this.selector(data, 0)} value={newOne.id && newOne.id} >
                                <Option value="">全部</Option>
                                {
                                    prsList.length > 0 && prsList.map(value => <Option key={value.id} value={value.id}>{(value.pr_no || '') + ' ' + value.title}</Option>)
                                }
                            </Select>
                        </div>
                    </div>

                    <div className="require">
                        <span>商品2:</span>
                        {noNormal && <span>可添加一张，{firstWidth}*{firstHeight}像素</span> }
                        {/* 模板五有这个不一样的地方  */}
                        {!noNormal && secondWidth ? <span>可添加一张，{secondWidth}*{secondHeight}像素</span> : <span>可添加1张</span>}
                    </div>
                    <div className="upload-box">
                        <Upload
                            accept="image/png, image/jpeg,image/jpg"
                            name="avatar"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            beforeUpload={(file) => (noNormal ? checkImageWH(file, firstWidth, firstHeight, 0.5).then(res => true) : checkImageWH(file,  secondWidth || firstWidth, secondHeight || firstHeight, 0.5).then(res => true))}
                            onChange={(data) => this.handleChange(data, 1)}
                        >
                            {newTwo.url ? <img src={newTwo.url} alt="avatar" style={{width: '100%'}}/> : uploadButton}
                        </Upload>
                        <div className="import-headline">
                            <div>商品标题:</div>
                            <Input maxLength={16} onChange={(e) => this.mainChange(e, 1)} value={newTwo.text} placeholder="请输入"/>
                        </div>
                        <div className="change">
                            <div>商品页:</div>
                            <Select onChange={(data) => this.selector(data, 1)} value={newTwo.id && newTwo.id} >
                                <Option value="">全部</Option>
                                {
                                    prsList.length > 0 && prsList.map(value => <Option key={value.id} value={value.id}>{(value.pr_no || '') + ' ' + value.title}</Option>)
                                }
                            </Select>
                        </div>
                    </div>

                    <div className="require">
                        <span>商品3:</span>
                        {   //有个别图片是不一样的时候
                            secondWidth ? <span>可添加一张，{secondWidth}*{secondHeight}像素</span> : <span>可添加1张</span>
                        }
                    </div>
                    <div className="upload-box">
                        <Upload
                            accept="image/png, image/jpeg,image/jpg"
                            name="avatar"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            beforeUpload={(file) => checkImageWH(file,  secondWidth || firstWidth, secondHeight || firstHeight, 0.5).then(res => true)}
                            onChange={(data) => this.handleChange(data, 2)}
                        >
                            {newThree.url ? <img src={newThree.url} alt="avatar" style={{width: '100%'}}/> : uploadButton}
                        </Upload>
                        <div className="import-headline">
                            <div>商品标题:</div>
                            <Input maxLength={16} onChange={(e) => this.mainChange(e, 2)} value={newThree.text} placeholder="请输入"/>
                        </div>
                        <div className="change">
                            <div>商品页:</div>
                            <Select onChange={(data) => this.selector(data, 2)} value={newThree.id && newThree.id} >
                                <Option value="">全部</Option>
                                {
                                    prsList.length > 0 && prsList.map(value => <Option key={value.id} value={value.id}>{(value.pr_no || '') + ' ' + value.title}</Option>)
                                }
                            </Select>
                        </div>
                    </div>

                    <div className="require">
                        <span>商品4:</span>
                        {   //有个别图片是不一样的时候
                            secondWidth ? <span>可添加一张，{firstWidth}*{firstHeight}像素</span> : <span>可添加1张</span>
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
                            onChange={(data) => this.handleChange(data, 3)}
                        >
                            {newFoure.url ? <img src={newFoure.url} alt="avatar" style={{width: '100%'}}/> : uploadButton}
                        </Upload>
                        <div className="import-headline">
                            <div>商品标题:</div>
                            <Input maxLength={16} onChange={(e) => this.mainChange(e, 3)} value={newFoure.text} placeholder="请输入"/>
                        </div>
                        <div className="change">
                            <div>商品页:</div>
                            <Select onChange={(data) => this.selector(data, 3)} value={newFoure.id && newFoure.id} >
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

export default CommodityChoiceFour;
