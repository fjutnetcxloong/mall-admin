/**
 * 懒加载
 * Created by 安格
 */
import {Spin} from 'antd';

class Loading extends React.PureComponent {
    render() {
        return (
            <div style={{paddingTop: 100, textAlign: 'center'}}>
                <Spin size="large"/>
            </div>
        );
    }
}

export default Loading;
