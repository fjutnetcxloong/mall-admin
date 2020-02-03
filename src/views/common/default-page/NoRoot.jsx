import './index.less';

const NoRoot = (props) => (
    <div className="defaults-box" style={{height: window.innerHeight - 137 + 'px'}}>
        <div className="defaults-inner">
            <div className="no-root"/>
            <p>暂无权限！！！</p>
        </div>
    </div>
);

export default NoRoot;