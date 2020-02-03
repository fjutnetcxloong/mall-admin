import {Upload, Icon, Row, message, Button} from 'antd';
import PropTypes from 'prop-types';
import './upload.less';

const {api} = Configs;
const {showInfo, showFail} = Utils;
class SUpload extends React.PureComponent {
    static propTypes = {
        btnText: PropTypes.string,
        ix: PropTypes.number,
        onSuccess: PropTypes.func,
        status: PropTypes.string,
        messages: PropTypes.string,
        visible: PropTypes.bool,
        show: PropTypes.bool,
        init: PropTypes.string,
        form: PropTypes.object.isRequired,
        disabled: PropTypes.bool
    }

    static defaultProps = {
        btnText: '点击上传',
        ix: -1,
        status: '',
        init: '',
        messages: '',
        onSuccess: () => {},
        visible: false,
        show: false,
        disabled: false
    }

   state = {
       imageUrl: ''
   }

   //    getImgByteSize(data) {
   //        let size;
   //        if (data) { // 获取base64图片byte大小
   //            const equalIndex = data.indexOf('='); // 获取=号下标
   //            if (equalIndex > 0) {
   //                const str = data.substring(0, equalIndex); // 去除=号
   //                const strLength = str.length;
   //                const fileLength = strLength - (strLength / 8) * 2; // 真实的图片byte大小
   //                size = Math.floor(fileLength); // 向下取整
   //            } else {
   //                const strLength = data.length;
   //                const fileLength = strLength - (strLength / 8) * 2;
   //                size = Math.floor(fileLength); // 向下取整
   //            }
   //        } else {
   //            size = 0;
   //        }
   //        return size;
   //    }

   getBase64(img, callback) {
       const reader = new FileReader();
       reader.addEventListener('load', () => callback(reader.result));
       reader.readAsDataURL(img);
   }

   shopPicup = (e) => {
       if (e.file.size / 1024 / 1024 > 2) {
           message.error('请上传小于2M的图片！');
           return;
       }
       if (e.data.ix === -1) {
           message.error('请选择上传图片的类型!');
           return;
       }
       this.getBase64(e.file, imageUrl => {
           if (e.data.ix || e.data.ix === 0) {
               XHR.fetch(api.shopPicup, {
                   data: {
                       ix: e.data.ix,
                       file: encodeURIComponent(imageUrl)
                   }
               }).subscribe(res => {
                   if (res && res.status === 0) {
                       this.setState({
                           imageUrl: res.data.url
                       });
                       if (res.data && res.data.status === 0) {
                           this.props.onSuccess(res.data);
                           showInfo((e.data.ix === 0 || e.data.ix === 1 || e.data.ix === 2) ? '图片识别成功' : '图片上传成功');
                       } else if (res.data.status === 1) {
                           this.props.onSuccess(res.data);
                           const {resetFields} = this.props.form;
                           const {status} = this.props;
                           resetFields([status]);
                           this.setState({
                               imageUrl: ''
                           });
                           showFail('图片识别失败请重新上传');
                       }
                   }
               });
           }
       });
   }

   render() {
       const {btnText, ix, status, init, messages, visible, disabled, show} = this.props;
       const {imageUrl} = this.state;
       const uploadButton = (
           <div className="upload-button1 upload-button">
               <Icon type="upload"/>
               <div className="ant-upload-text">{btnText}</div>
           </div>
       );
       return (
           <Row className="my-upload">
               <Row>
                   {
                       this.props.form && this.props.form.getFieldDecorator(status, {
                           initialValue: init,
                           valuePropName: 'file',
                           rules: [
                               {required: true, message: messages}
                           ]
                       })(
                           <Upload
                               name="avatar"
                               accept="image/png,image/jpeg"
                               listType="picture-card"
                               className="avatar-uploader"
                               data={{ix}}
                               disabled={disabled} //是否可编辑
                               //    onChange={this.handleChange} // onCHange事件
                               showUploadList={false}
                               //    beforeUpload={this.beforeUpload}
                               customRequest={this.shopPicup}
                           >
                               {(imageUrl || init) ? <img src={imageUrl || init} alt="暂无" style={{width: '100%'}}/> : uploadButton}
                               <Button type="primary" style={{display: visible || (imageUrl && show) ? 'block' : 'none'}} className="seave-btn">更换图片</Button>
                           </Upload>
                       )
                   }
               </Row>
           </Row>
       );
   }
}
export default SUpload;
