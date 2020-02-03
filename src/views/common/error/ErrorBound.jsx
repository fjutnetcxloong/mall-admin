/**
 * 错误边界（Error boundaries）
 * 单一组件的js错误不应该导致整个组件树被卸载，为了解决这个问题，React16引入了错误边界的概念。
 * 错误边界是一种 React 组件，这种组件可以捕获并打印发生在其子组件树任何位置的js错误，
 * 并且，它会渲染出备用 UI，而不是渲染那些崩溃了的子组件树。
 * 错误边界在渲染期间、生命周期方法和整个组件树的构造函数中捕获错误。
 * Created by 安格
 */
import {Result, Button} from 'antd';
import PropTypes from 'prop-types';

const {appHistory} = Utils;
class ErrorBound extends React.Component {
    static propTypes = {
        children: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.array
        ])
    };

    static defaultProps = {
        children: null
    };

    state={
        hasError: false //是否显示页面错误UI
        // error: null, //抛出错误
        // info: null //抛出错误详情
    }

    //使用componentDidCatch()的class组件会变成一个错误边界
    //error: 已经被抛出的错误
    //info: 抛出错误的组件堆的信息
    componentDidCatch(error, info) {
        this.setState(prevState => ({
            hasError: !prevState.hasError
            // error: error,
            // info: info
        }));
    }

    render() {
        const {children} = this.props;
        const {hasError} = this.state;
        if (hasError) {
            //自定义页面崩溃后的UI并渲染
            return (
                <Result
                    status="warning"
                    title="非常抱歉，当前页面已崩溃."
                    extra={(
                        <Button type="primary" onClick={() => appHistory.go(0)}>
                                刷新页面
                        </Button>
                    )}
                />

            );
            // <h1>虽然你遇到BUG的时候挺狼狈，但是你改BUG的样子真的很靓仔！</h1>
            //         <details style={{whiteSpace: 'pre-wrap'}}>
            //             {error.toString()}
            //             <br/>
            //             {info.componentStack}
            //         </details>
        }
        return children;
    }
}

export default ErrorBound;