/**
 * 模块页面布局
 */
import React from 'react';
import {withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
// import {Row, Col} from 'antd';
import SiderNav from '../navigation/SiderNav';
import HeaderNav from '../navigation/HeaderNav';
import ContentLayout from './ContentLayout';
import Help from '../navigation/Help';
import './Basic.less';

const {MENUDATA} = Constants;
class Basic extends React.PureComponent {
    static propTypes = {
        //每个组件都可以获取到this.props.children。它包含组件的开始标签和结束标签之间的内容，可能为undefined/object/array
        children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
        // history: PropTypes.object,
        location: PropTypes.object
    };

    static defaultProps = {
        children: null,
        // history: {},
        location: {}
    };

    state = {
        visible: false //是否显示帮助中心
    };

    //显示帮助中心
    showHelp = () => {
        this.setState({
            visible: true
        });
    };

    //隐藏帮助中心
    closeHelp = () => {
        this.setState({
            visible: false
        });
    };

    render() {
        const {location, children} = this.props;
        const {visible} = this.state;
        return (
            <div className="basic-layout">
                <React.Fragment>
                    <div className="basic-layout-side">
                        {/* 左侧导航菜单 */}
                        <SiderNav
                            menuData={MENUDATA}
                            pathName={location.pathname}
                        />
                    </div>
                    <div className="basic-layout-content">
                        {/* 顶部导航栏 */}
                        <HeaderNav
                            visible={visible}
                            onShow={this.showHelp}
                        />
                        {/* 内容区域 */}
                        <ContentLayout content={children}/>
                    </div>
                    {/* 帮助中心 */
                        visible && (
                            <div className="basic-layout-help" style={{width: '320px'}}>
                                <Help
                                    visible={visible}
                                    onClose={this.closeHelp}
                                />
                            </div>
                        )
                    }
                </React.Fragment>
            </div>
        );
    }
}

export default withRouter(Basic);
