/**
 * 上传组件
 * Created by 安格
 */
import {Upload} from 'antd';
import PropTypes from 'prop-types';
import './HandleUpload.less';

export default class HandleUpload extends React.PureComponent {
     static propTypes = {
         onChange: PropTypes.func, //表单域传入的onChange
         list: PropTypes.array.isRequired, //当前的文件列表
         showUploadList: PropTypes.oneOfType([
             PropTypes.bool,
             PropTypes.object //可设为一个对象，用于单独设定是否显示预览按钮或删除按钮
         ]), //是否展示文件列表
         limit: PropTypes.number, //限制上传数量
         button: PropTypes.element, //上传按钮
         onPreview: PropTypes.func.isRequired //点击预览图片回调
     }

     static defaultProps = {
         onChange() {},
         showUploadList: true,
         limit: 1,
         button: null
     }

     onPreview=(file) => {
         const {onPreview} = this.props;
         onPreview(file);
     }

     onChange=(e) => {
         this.props.onChange(e);
     }

     render() {
         const {list, showUploadList, limit, button} = this.props;
         return (
             <Upload
                 accept="image/png,image/jpeg" //接受上传的文件类型
                 listType="picture-card" //上传列表的内建样式
                 beforeUpload={() => false} //返回false阻止组件默认上传行为
                 fileList={list} //已经上传的文件列表（受控）
                 showUploadList={showUploadList}
                 onChange={this.onChange} //上传文件改变时的状态
                 onPreview={this.onPreview} //点击图片预览回调
             >
                 {//是否渲染上传按钮
                     list.length >= limit
                         ? null
                         : button
                 }
             </Upload>
         );
     }
}
