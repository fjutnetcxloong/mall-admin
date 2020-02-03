/**
 * 分页组件
 */
import {Row, Pagination} from 'antd';
import PropTypes from 'prop-types';
import './HandlePage.less';

class HandlePage extends React.PureComponent {
    static propTypes = {
        page: PropTypes.number.isRequired, //当前页码
        size: PropTypes.number.isRequired, //每页条数
        count: PropTypes.number.isRequired, //总条数
        onShowSizeChange: PropTypes.func.isRequired, //改变每页条数回调
        onChangePage: PropTypes.func.isRequired //改变页码回调
    };

    onShowSizeChange=(current, pageSize) => {
        console.log('修改后的页码', current, '改变后的每页条数', pageSize);
        const {onShowSizeChange} = this.props;
        onShowSizeChange(current, pageSize);
    }

    onChangePage=(page) => {
        console.log('改变后的页码', page);
        const {onChangePage} = this.props;
        onChangePage(page);
    }

    render() {
        const {page, size, count} = this.props;
        return (
            count > 0
            && (
                <Row span={24} className="page-bottom">
                    <div span={2} className="page-left">当前第<span>{page}</span>页</div>
                    <Pagination
                        current={page}
                        defaultPageSize={size} //默认的每页条数
                        showSizeChanger //是否可以改变 pageSize
                        pageSizeOptions={['10', '20', '40', '60', '80', '100']} //指定每页条数选项
                        onShowSizeChange={this.onShowSizeChange} //pageSize变化的回调
                        total={count} //数据总数
                        //TODO:跳转页码超出当前页数提示页码不存在（组件获取不到用户输入的页码）
                        showQuickJumper //是否可以快速跳转至某页
                        // 页码改变的回调，参数是改变后的页码及每页条数
                        onChange={this.onChangePage}
                    />
                    <div span={2} className="page-right"><span>{count}</span>条数据</div>
                </Row>
            )
        );
    }
}

export default HandlePage;
