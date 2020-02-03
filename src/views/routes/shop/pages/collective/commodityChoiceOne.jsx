//爆款选择商品图  xwb

import {Upload, Icon, Input, Select} from 'antd';
import './commodityChoice.less';

const {Option} = Select;
const {checkImageWH} = Utils;
const {api} = Configs;
let onOffShow = true;//选择图片的时候自带会渲染三次，这个是开关用来阻止，只让走一次
class CommodityChoiceOne extends BaseComponent {
    state = {
        loading: false,
        value: 1,
        hotOne: {index: this.props.index[0], id: ''}, //热销商品1
        prsList: [],
        allMsg: this.props
    };

    componentDidMount() {
        this.getAllPrs();
    }

    componentWillReceiveProps(nextProps) {
        const {sortId1} = nextProps;
        if (sortId1 !== this.props.sortId1) { //一个模板两个地方使用了这个组件，判断变化的时候数据就变动
            this.setState({
                loading: false,
                allMsg: {...nextProps},
                value: 1,
                hotOne: {index: nextProps.index[0], id: ''}, //热销商品1
                prsList: []
            }, () => {
                this.getAllPrs();
            });
        }
    }

    getAllPrs = (title) => {
        const {defaultModelInfo, sortId1, sortIx1, sortTitle11} = this.props;
        const content = defaultModelInfo.get('content');
        const picurl = defaultModelInfo.get('picurl');
        const {hotOne} = this.state;
        const arr = hotOne;
        this.fetch(api.modelPrs, {data: {title}})
            .subscribe(res => {
                if (res && res.status === 0) {
                    this.setState({
                        prsList: res.data
                    }, () => {
                        if (picurl) { //为了拿到初始值
                            const str = res.data.find(item => item.id === content.get(sortId1));
                            arr.url = picurl.get(content.get(sortIx1));
                            arr.text = content.get(sortTitle11);
                            arr.id = str ? str.id : '';
                            this.setState({
                                hotOne: {...arr}
                            });
                        }
                    });
                }
            });
    }

    getBase64=(img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    //选择器
    selector = (value, index) => {
        const {prsList, hotOne, allMsg} = this.state;
        const {setExplosiveInfo, sortId1, sortTitle11, sortTitle21, sortTitle31} = allMsg;
        const arr = hotOne;
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
        }
        this.setState({
            hotOne: arr
        });
    }

    //文字输入
    mainChange = (e, index) => {
        const {hotOne, allMsg} = this.state;
        const arr = hotOne;
        const {setExplosiveInfo, sortTitle11} = allMsg;
        if (index === 0) {
            arr.text = e.target.value;
            setExplosiveInfo(sortTitle11, e.target.value);
        }
        this.setState({
            hotOne: arr
        });
    }

    handleChange = ({file}, index) => {
        if (!onOffShow) return;
        onOffShow = false;
        const {hotOne, allMsg} = this.state;
        const {setPicurlBackground} = allMsg;
        this.getBase64(file.originFileObj, img => {
            if (index === 0) {
                hotOne.url = img;
                setPicurlBackground(hotOne.index, img);
            }
        });
        setTimeout(() => {
            this.setState({
                hotOne
            });
        }, 200);
    };

    //图片上传前改变一下控制的变量
    beforeFn = (file, width, height, num) => {
        onOffShow = true;
        return checkImageWH(file, width, height, num).then(res => true);
    }

    render() {
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'}/>
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        const {hotOne, prsList, allMsg} = this.state;
        const {top} = allMsg;
        return (
            <div className="model-product-description" style={{top: top + 'px'}}>
                <div onClick={() => this.props.mainShow(false)} className="hide-choise">X</div>
                <div className="headline">选择商品图</div>
                <div className="uploading">
                    <div className="require">
                        <span>图片要求:</span>
                        <span>550*330像素，小于500kb</span>
                    </div>
                    <div className="require">
                        <span>商品1:</span>
                        <span>可添加1张</span>
                    </div>
                    <div className="upload-box">
                        <Upload
                            accept="image/png, image/jpeg,image/jpg"
                            name="avatar"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            beforeUpload={(file) => this.beforeFn(file, 550, 330, 0.5)}
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
                                    prsList.length > 0 && prsList.map(value => <Option key={value.id} value={value.id}>{value.pr_no + ' ' + value.title}</Option>)
                                }
                            </Select>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CommodityChoiceOne;
