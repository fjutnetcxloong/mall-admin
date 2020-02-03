import {Link} from 'react-router-dom';
import {Breadcrumb} from 'antd';

// const {MENUDATA} = Constants;

const breadcrumbNameMap = {
    '/order/online-delivery': '线上订单',
    '/order/online-delivery/delivery-detail': '网店发货详情页',
    '/order/offline-pickup': '线下订单',
    '/order/offline-pickup/pickup-detail': '到店自提详情页',
    '/order/evaluation': '客户评价',
    '/order/online-delivery/purchase-detail': '退货详情页'
};
/*
const getBreadcrumbNameMap = (menuData) => {
    menuData.forEach((item) => {
        if (item.children && item.children.length > 0) {
            getBreadcrumbNameMap(item.children);
        }
        breadcrumbNameMap[item.path] = item.name;
    });
};
getBreadcrumbNameMap(MENUDATA);
*/

console.log(breadcrumbNameMap);

class BreadCrumb extends React.Component {
    shouldComponentUpdate() {
        return true;
    }

    render() {
        const pathSnippets = window.location.hash.slice(2).split('/').map(i => {
            const n = i.indexOf('?');
            if (n > 0) {
                return i.slice(0, n);
            }
            return i;
        });
        let extraBreadcrumbItems = [];
        if (pathSnippets.length > 2) {
            extraBreadcrumbItems = pathSnippets.map((item, index, ary) => {
                let path = '';
                for (let i = 0; i < index + 1; i++) {
                    path += `/${ary[i]}`;
                }
                console.log(path);
                return (
                    <Breadcrumb.Item key={item}>
                        {index === 1
                            ? <Link to={path}>{breadcrumbNameMap[path]}</Link>
                            : breadcrumbNameMap[path]
                        }
                    </Breadcrumb.Item>
                );
            });
        }
        console.log(extraBreadcrumbItems);
        const breadcrumbItems = [].concat(extraBreadcrumbItems);
        return (
            <Breadcrumb>
                {breadcrumbItems}
            </Breadcrumb>
        );
    }
}

export default BreadCrumb;
