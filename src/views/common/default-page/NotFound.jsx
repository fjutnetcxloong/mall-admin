import './index.less';
import {Button} from 'antd';

const {appHistory} = Utils;
class NotFound  extends React.PureComponent {
    //返回上一級
    routeTo = () => {
        appHistory.goBack();
    };

    render() {
        return (
            <div className="err-box">
                <div className="err-inner">
                    <div className="not-found"/>
                    <p>页面丢失啦！！！</p>
                    <Button type="primary" onClick={() => this.routeTo()}>返回上一级</Button>
                </div>
            </div>
        );
    }
}

export default NotFound;