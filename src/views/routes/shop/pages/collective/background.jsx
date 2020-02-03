//模板背景图选择框

import {Upload, Icon, Radio} from 'antd';
import './background.less';

const {checkImageWH} = Utils;
class StoreBackground extends BaseComponent {
    state = {
        loading: false,
        value: ''
    };

    //图片上传方法
    getBase64 = (file, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(file);
    }

    //单选框选择
    radioChange = e => {
        const {defaultModelInfo} = this.props;
        let url = '';
        defaultModelInfo.get('bg').forEach(item => {
            if (item.get('id') === e.target.value) {
                url = item.get('url');
            }
        });
        this.setState({
            value: e.target.value
        });
        this.changeParentStyle(url);
    };

    //统一改变父级样式
    changeParentStyle = (val) => {
        this.props.setPicurlBackground(0, val);
    }

    render() {
        const {defaultModelInfo} = this.props;
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'}/>
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            <div className="store-background">
                <div onClick={() => this.props.mainShow(false)} className="hide-choise">X</div>
                <div className="headline">选择店铺背景</div>
                <div className="uploading">
                    <div className="require">
                        <span>图片要求:</span>
                        <span>可选择1张图，750*260像素，小于500kb</span>
                    </div>
                    <Upload
                        accept="image/png, image/jpeg,image/jpg"
                        className="avatar-uploader"
                        name="avatar"
                        listType="picture-card"
                        showUploadList={false}
                        beforeUpload={(file) => checkImageWH(file, 750, 260, 0.5).then(res => true)}
                        onChange={(data, value) => {
                            this.getBase64(data.file.originFileObj, img => {
                                this.changeParentStyle(img);
                            });
                        }}
                    >
                        {uploadButton}
                    </Upload>
                </div>
                <div className="template">
                    <div className="template-topic">模板图</div>
                    <Radio.Group onChange={this.radioChange} value={this.state.value}>
                        {
                            defaultModelInfo.get('bg') && defaultModelInfo.get('bg').map(item => (
                                <div key={item.get('id')} className="template-one">
                                    <Radio value={item.get('id')}>
                                        选择
                                    </Radio>
                                    <img src={item.get('url')} alt=""/>
                                </div>
                            ))
                        }
                    </Radio.Group>
                </div>
            </div>
        );
    }
}

export default StoreBackground;
