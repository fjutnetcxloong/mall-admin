/**
 *底部按钮
 */
import PropTypes from 'prop-types';
import './BottomButton.less';
import {Button} from 'antd';

class BottomButton extends React.PureComponent {
    static propTypes ={
        saveTemplate: PropTypes.func,
        cancelTemplate: PropTypes.func,
        saveEditTemplate: PropTypes.func,
        cancelEditTemplate: PropTypes.func,
        pickUpSelf: PropTypes.string,

        buttonList: PropTypes.node //按钮列表
    };

    //组件API默认值
    static defaultProps = {
        saveTemplate() {},
        cancelTemplate() {},
        saveEditTemplate() {},
        cancelEditTemplate() {},
        pickUpSelf: '',

        buttonList: null
    };


  save = () => {
      // this.props.saveTemplate();
      if (this.props.pickUpSelf) {
          this.props.saveEditTemplate();
      } else {
          this.props.saveTemplate();
      }
  };

  //取消
    cancel = () => {
        if (this.props.pickUpSelf) {
            this.props.cancelEditTemplate();
        } else {
            this.props.cancelTemplate();
        }
    };

    render() {
        const {buttonList} = this.props;
        if (buttonList) {
            return (
                <div className="public-button">
                    {buttonList}
                </div>
            );
        }
        return (
            <div className="public-button">
                <Button className="public-button-first" onClick={this.cancel}>取消</Button>
                <Button onClick={this.save}>保存</Button>
            </div>
        );
    }
}

export default BottomButton;
