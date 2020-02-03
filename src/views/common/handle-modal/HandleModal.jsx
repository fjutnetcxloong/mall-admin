/**
 * 对话框组件
 * Created by 安格
 */
import PropTypes from 'prop-types';
import {Modal} from 'antd';
import './HandleModal.less';

export default class HandleModal extends React.PureComponent {
    static propTypes = {
        visible: PropTypes.bool, //是否显示对话框
        width: PropTypes.number, //宽度
        isStyle: PropTypes.bool, //是否需要使用自定义样式（用于协议和规范）
        title: PropTypes.string, //对话框标题
        closable: PropTypes.bool, //是否显示右上角的关闭按钮
        content: PropTypes.oneOfType([
            PropTypes.node, //任何可被渲染的元素（包括数字、字符串、子元素或数组）
            PropTypes.func
        ]), //自定义对话框内容
        footer: PropTypes.element, //自定义对话框底部按钮
        onCancel: PropTypes.func //点击对话框遮罩层或右上角叉或取消按钮的回调
    };

    static defaultProps = {
        visible: false,
        isStyle: false,
        width: 520,
        title: '',
        closable: true,
        content: null,
        footer: null,
        onCancel() {}
    };

    //渲染对话框内容
    renderContent=() => {
        const {content} = this.props;
        let element;
        if (typeof content === 'function') {
            element = content();
        } else {
            element = content;
        }
        return element;
    };

    onCancel=() => {
        this.props.onCancel();
    };

    render() {
        const {visible, isStyle, width, title, closable, footer} = this.props;
        return (
            <Modal
                className="drag-box-container"
                visible={visible}
                width={width}
                {...isStyle && {className: 'modal-content-height'}}
                title={title}
                closable={closable}
                footer={footer}
                onCancel={this.onCancel}
                centered //垂直居中展示 Modal
            >
                {this.renderContent()}
            </Modal>
        );
    }
}
