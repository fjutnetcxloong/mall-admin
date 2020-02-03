import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {Layout, Menu} from 'antd';

const {Sider} = Layout;
const {SubMenu, Item} = Menu;
const {INFO} = Constants;
class SiderLayout extends React.PureComponent {
    static propTypes = {
        menuData: PropTypes.array, //导航菜单配置
        pathName: PropTypes.string//当前路由路径
    };

    static defaultProps = {
        menuData: [],
        pathName: ''
    };

    state = {
        openKeys: [this.props.pathName.match(/\/\w*/g)[0]]
    };

    componentWillReceiveProps(nextProps) {
        const urlPath = nextProps.pathName.match(/\/\w*/g)[0];
        if (!this.state.openKeys.includes(urlPath)) {
            this.setState((preState) => ({
                openKeys: [...preState.openKeys, urlPath]
            }));
        }
    }

    //初始化渲染导航菜单
    initializeMenu = (menuData) => {
        const sideMenu = [];
        menuData.forEach(v => {
            if (v.children) {
                if (v.children.length === 0) {
                    sideMenu.push(
                        //一级菜单无子菜单
                        <Item key={v.path}>
                            <Link to={v.path}>
                                <span className={`icon ${v.icon}`}>{v.name}</span>
                            </Link>
                        </Item>
                    );
                } else {
                    sideMenu.push(
                        //一级菜单有子菜单
                        <SubMenu
                            key={v.path}
                            title={(
                                <span className={`icon ${v.icon}`}>{v.name}</span>
                            )}
                        >
                            {this.initializeMenu(v.children)}
                        </SubMenu>
                    );
                }
            } else {
                sideMenu.push(
                    //二级菜单
                    <Item key={v.path}>
                        <Link to={v.path}>
                            <span>{v.name}</span>
                        </Link>
                    </Item>
                );
            }
        });
        return sideMenu;
    };

    onOpenChange = openKeys => {
        // 展开多个菜单栏
        this.setState({openKeys});
    };

    render() {
        const {menuData, pathName} = this.props;
        const {openKeys} = this.state;
        const pathGroup = pathName.match(/\/\w*/g)[0];
        const menu = this.initializeMenu(menuData);
        return (
            <Sider>
                <div className="icon icon-headline">{INFO.title}</div>
                <Menu
                    defaultSelectedKeys={[pathName]}
                    defaultOpenKeys={[pathGroup]}
                    selectedKeys={[pathName]}
                    onOpenChange={this.onOpenChange}
                    openKeys={openKeys}
                    mode="inline"
                    theme="dark"
                >
                    {menu}
                </Menu>
            </Sider>
        );
    }
}

export default SiderLayout;
