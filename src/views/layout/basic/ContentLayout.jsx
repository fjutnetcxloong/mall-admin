import {Layout} from 'antd';
import PropTypes from 'prop-types';
import BreadCrumb from '../navigation/BreadCrumb';

const {Content} = Layout;
class ContentLayout extends React.PureComponent {
    static propTypes = {
        content: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
    };

    static defaultProps = {
        content: null
    };

    render() {
        return (
            <Content>
                {/* 面包屑导航 */}
                <BreadCrumb/>
                {this.props.content}
            </Content>
        );
    }
}


export default ContentLayout;
