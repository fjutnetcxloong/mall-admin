/**
 * 根组件  封装组件一些逻辑通用方法
 */
import PropTypes from 'prop-types';
import {is} from 'immutable';

class BaseComponent extends React.Component {
    static contextTypes = {
        store: PropTypes.object
    };

    static defaultProps = {
        children: null
    };

    static propTypes = {
        children: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.array
        ])
    };

    constructor(props, context) {
        super(props, context);
    }

    shouldComponentUpdate(nextProps, nextState) {
        const thisProps = this.props || {},
            thisState = this.state || {},
            newProps = nextProps || {},
            newState = nextState || {};
        if (Object.keys(thisProps).length !== Object.keys(newProps).length
            || Object.keys(thisState).length !== Object.keys(newState).length) {
            return true;
        }
        for (const key in newProps) {
            if (newProps.hasOwnProperty(key) && !is(thisProps[key], nextProps[key])) {
                return true;
            }
        }
        for (const key in newState) {
            if (newState.hasOwnProperty(key) && !is(thisState[key], nextState[key])) {
                return true;
            }
        }
        return false;
    }

    // 元素销毁时，清掉未完成Ajax回调函数, 关闭alert、confirm弹窗
    componentWillUnmount() {
        console.log('BaseComponent componentWillUnmount', this.__proto__.constructor.name);
        if (XHR.ajaxQueue.length > 0) {
            XHR.abort();
        }
        //不能在已经被销毁的组件中执行setState
        this.setState((prevState) => ({
            prevState
        }));
    }

    // 获取组件名称
    getComponnetName() {
        try {
            return this.__proto__.constructor.name;
        } catch (e) {
            return '';
        }
    }

    // 获取子元素, 返回正确的子元素
    getChildren() {
        const children = [];
        React.Children.forEach(this.props.children, (child) => {
            if (React.isValidElement(child)) {
                children.push(child);
            }
        });
        return children;
    }

    // 发送http请求
    fetch(url, params) {
        return XHR.fetch(url, params);
    }

    // 终止http请求
    abort(url) {
        XHR.abort(url);
    }
}

export default BaseComponent;
