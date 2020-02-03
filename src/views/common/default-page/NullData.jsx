import './index.less';

const NullData = (props) => (
    <div className="defaults-null-box" style={{height: window.innerHeight - 137 + 'px'}}>
        <div className="defaults-inner">
            <div className="null-data"/>
            <p>暂无订单！！！</p>
        </div>
    </div>
);

export default NullData;