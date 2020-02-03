import './index.less';
import {Button} from 'antd';

const {appHistory} = Utils;
//返回上一級
const routeTo = () => {
    appHistory.goBack();
};
const ServiceErr = (props) => {
    console.log('服务器内部错误');
    return (
        <div className="err-box">
            <div className="err-inner">
                <div className="service-error"/>
                <p>服务器内部错误！！！</p>
                <Button type="primary" onClick={() => routeTo()}>返回上一级</Button>
            </div>
        </div>
    );
};

export default ServiceErr;
