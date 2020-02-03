//第二个轮播图， 暂时只有模板二有 xwb

import {Upload, Icon, Select} from 'antd';
import Immutable from 'immutable';
import './secondRotary.less';

const {Option} = Select;
const {api} = Configs;
let onOffShow = true;//选择图片的时候自带会渲染三次，这个是开关用来阻止，只让走一次
const {checkImageWH} = Utils;
class SecondRotary extends BaseComponent {
    state = {
        loading: false,
        value: 1,
        prsList: Immutable.List([]), //商品列表
        imgAll: this.props.defaultModelInfo.get('content').get('banner') || Immutable.List([])
    };

    componentDidMount() {
        this.getAllPrs();
    }

    //获取商品信息
    getAllPrs = (title) => {
        const {prsList} = this.state;
        this.fetch(api.modelPrs, {data: {title}})
            .subscribe(res => {
                if (res.status === 0) {
                    this.setState({
                        prsList: prsList.merge(res.data)
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
        const {defaultModelInfo, setExplosiveInfo} = this.props;
        const {prsList} = this.state;
        const content = defaultModelInfo.get('content');
        const str = {};
        content.get('pr_banner').forEach((item, indexChild) => {
            if (index === indexChild) {
                str.url = item.get('url');
                str.ix = item.get('ix');
                str.num = item.get('num');
            }
        });
        prsList.forEach(item => {
            if (item.get('id') === value) {
                str.id = item.get('id');
                str.title = item.get('title');
                str.price = item.get('price');
                str.price_original = item.get('price_original');
            }
        });
        //同步展示值
        content.get('pr_banner').forEach((item, num) => {
            if (num === index) {
                this.setState({
                    imgAll: content.get('pr_banner').update(index, aa => Immutable.Map(str))
                }, () => {
                    setExplosiveInfo('pr_banner', this.state.imgAll);
                });
            }
        });
    }

    //改变名字
    // mainChange = (e, index) => {
    //     const {imgAll} = this.state;
    //     const obj = imgAll;
    //     obj[index].title1 = e.target.value;
    //     this.props.setPropsPrBannerImg(obj);
    //     this.setState({
    //         imgAll: [...obj]
    //     });
    //     e.target.focus();
    // } //暂时屏蔽

    //选择图片的时候
    handleChange = ({fileList, file}) => {
        if (!onOffShow) return;
        onOffShow = false;
        const {defaultModelInfo, setExplosiveInfo} = this.props;
        let imgAll = defaultModelInfo.get('content').get('pr_banner');
        imgAll = imgAll.push(Immutable.fromJS({id: file.id || '', originFileObj: file.originFileObj, num: new Date().getTime()}));
        imgAll.forEach((item, index) => {
            if (!item.get('url')) { //新上传的图片都是没有url这个属性的
                this.getBase64(item.get('originFileObj'), img => {
                    this.setState({//更新图片
                        arrAll: imgAll.update(index, aa => aa.setIn(['url'], img))
                    }, () => {
                        const {arrAll} = this.state;
                        //传给父级
                        setExplosiveInfo('pr_banner', arrAll);
                    });
                });
            }
        });
    };

    //点击删除图片
    onRemove = (url, num) => {
        const {defaultModelInfo, setExplosiveInfo} = this.props;
        let imgAll = defaultModelInfo.get('content').get('pr_banner');
        //删除先判断有没有num，这个是时间戳，如果有则通过这个来判断唯一，如果没有则通过url来判断唯一
        imgAll = imgAll.filter(item => ((item.get('num') && item.get('num') !== num) || item.get('url') !== url));
        this.setState({
            imgAll
        }, () => {
            setExplosiveInfo('pr_banner', this.state.imgAll);
        });
    }

    //图片上传前改变一下控制的变量
    beforeFn = (file, width, height, num) => {
        onOffShow = true;
        return checkImageWH(file, width, height, num).then(res => true);
    }

    render() {
        const {prsList, loading} = this.state;
        const {defaultModelInfo} = this.props;
        const content = defaultModelInfo.get('content');
        const uploadButton = (
            <div>
                <Icon type={loading ? 'loading' : 'plus'}/>
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            <div className="pr-panner">
                <div onClick={() => this.props.mainShow(false)} className="hide-choise">X</div>
                <div className="headline">选择轮播广告图</div>
                <div className="uploading">
                    <div className="require">
                        <span>图片要求:</span>
                        <span>可添加1-10张图，宽：550像素，高：330像素，小于500kb</span>
                    </div>
                    <Upload
                        accept="image/png, image/jpeg,image/jpg"
                        name="avatar"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        onChange={this.handleChange}
                        beforeUpload={(file) => this.beforeFn(file, 550, 330, 0.5)}
                    >
                        {content.get('pr_banner').size > 8 ? null : uploadButton}
                    </Upload>
                </div>
                {
                    content.get('pr_banner').size > 0 && content.get('pr_banner').map((item, index) => (
                        <div key={item} className="picture">
                            <span className="close" onClick={() => this.onRemove(item.get('url'), item.get('num'))}>x</span>
                            <img src={item.get('url')} alt=""/>
                            {/* <div className="import-headline">
                                <div>商品标题:</div>
                                <Input maxLength={16} onChange={(e) => this.mainChange(e, index)} value={item.get('title1')} placeholder="请输入"/>
                            </div> */}
                            <div className="change">
                                <div>商品页：</div>
                                <Select onChange={(data) => this.selector(data, index)} value={item.get('id')} >
                                    <Option value="">全部</Option>
                                    {
                                        prsList.size > 0 && prsList.map(value => <Option key={value.get('id')} value={value.get('id')}>{(value.get('pr_no') || '') + ' ' + value.get('title')}</Option>)
                                    }
                                </Select>
                            </div>
                        </div>
                    ))
                }
            </div>
        );
    }
}

export default SecondRotary;