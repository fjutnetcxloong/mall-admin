import './index.less';
import {Button} from 'antd';

const {appHistory} = Utils;
//返回上一級
const routeTo = () => {
    appHistory.goBack();
};
const NetError = (props) => (
    <div className="err-box">
        <div className="err-inner">
            <div className="net-error"/>
            <p>网络连接错误！！！</p>
            <Button type="primary" onClick={() => routeTo()}>返回上一级</Button>
        </div>
    </div>
);

export default NetError;